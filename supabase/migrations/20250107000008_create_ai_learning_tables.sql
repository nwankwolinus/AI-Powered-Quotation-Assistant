-- ============================================
-- COMPLETE AI LEARNING SYSTEM MIGRATION
-- File: supabase/migrations/20250107000008_create_ai_learning_tables.sql
-- ============================================

-- Table 1: Store learned patterns from quotes
CREATE TABLE IF NOT EXISTS public.quote_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('configuration', 'pricing', 'component_pairing', 'client_preference')),
  pattern_data JSONB NOT NULL,
  confidence_score DECIMAL(3, 2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  usage_count INTEGER DEFAULT 1,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for quote_patterns
CREATE INDEX idx_quote_patterns_type ON public.quote_patterns(pattern_type);
CREATE INDEX idx_quote_patterns_confidence ON public.quote_patterns(confidence_score DESC);
CREATE INDEX idx_quote_patterns_data ON public.quote_patterns USING GIN (pattern_data);
CREATE INDEX idx_quote_patterns_last_seen ON public.quote_patterns(last_seen_at DESC);

-- Table 2: Store AI recommendations history
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recommendation_type VARCHAR(50) NOT NULL,
  input_data JSONB NOT NULL,
  recommendation_data JSONB NOT NULL,
  was_accepted BOOLEAN DEFAULT NULL,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ai_recommendations
CREATE INDEX idx_ai_recommendations_user ON public.ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_type ON public.ai_recommendations(recommendation_type);
CREATE INDEX idx_ai_recommendations_accepted ON public.ai_recommendations(was_accepted);
CREATE INDEX idx_ai_recommendations_created ON public.ai_recommendations(created_at DESC);

-- Table 3: Track AI learning performance metrics
CREATE TABLE IF NOT EXISTS public.ai_learning_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR(50) NOT NULL,
  metric_value DECIMAL(10, 4) NOT NULL,
  metadata JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ai_learning_metrics
CREATE INDEX idx_ai_learning_metrics_type ON public.ai_learning_metrics(metric_type);
CREATE INDEX idx_ai_learning_metrics_recorded ON public.ai_learning_metrics(recorded_at DESC);

-- Function: Auto-update pattern confidence based on usage
CREATE OR REPLACE FUNCTION update_pattern_confidence()
RETURNS TRIGGER AS $$
BEGIN
  -- Increase confidence score based on usage count
  -- Cap at 0.95 to leave room for continuous learning
  NEW.confidence_score = LEAST(
    0.95, 
    NEW.confidence_score + (0.05 * (NEW.usage_count / 10.0))
  );
  NEW.updated_at = NOW();
  NEW.last_seen_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update confidence when usage increases
CREATE TRIGGER trigger_update_pattern_confidence
  BEFORE UPDATE ON public.quote_patterns
  FOR EACH ROW
  WHEN (OLD.usage_count < NEW.usage_count)
  EXECUTE FUNCTION update_pattern_confidence();

-- Function: Clean old low-confidence patterns (call this periodically)
CREATE OR REPLACE FUNCTION cleanup_old_patterns()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete patterns older than 90 days with confidence < 0.3
  DELETE FROM public.quote_patterns
  WHERE confidence_score < 0.3
    AND last_seen_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE public.quote_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quote_patterns
CREATE POLICY "Users can view all patterns"
  ON public.quote_patterns FOR SELECT
  USING (true);

CREATE POLICY "System can insert patterns"
  ON public.quote_patterns FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update patterns"
  ON public.quote_patterns FOR UPDATE
  USING (true);

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));

CREATE POLICY "System can insert recommendations"
  ON public.ai_recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own recommendations"
  ON public.ai_recommendations FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for ai_learning_metrics
CREATE POLICY "Managers can view metrics"
  ON public.ai_learning_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));

CREATE POLICY "System can insert metrics"
  ON public.ai_learning_metrics FOR INSERT
  WITH CHECK (true);

-- Insert initial sample patterns (optional - for testing)
INSERT INTO public.quote_patterns (pattern_type, pattern_data, confidence_score, usage_count) VALUES
  (
    'configuration',
    '{"amperage": "5000", "panel_type": "changeover", "incomer_count": 2, "typical_outgoings": [2500, 2500]}'::jsonb,
    0.7,
    5
  ),
  (
    'component_pairing',
    '{"main_breaker": "ACB", "typical_accessories": ["digital_meter", "indicator_lamps", "ct"], "vendor_preference": "Schneider"}'::jsonb,
    0.6,
    3
  ),
  (
    'pricing',
    '{"amperage": "4000", "average_price": 50000000, "price_per_ampere": 12500, "currency": "NGN"}'::jsonb,
    0.5,
    2
  );

-- Create view for easy pattern analysis
CREATE OR REPLACE VIEW pattern_summary AS
SELECT 
  pattern_type,
  COUNT(*) as pattern_count,
  AVG(confidence_score) as avg_confidence,
  SUM(usage_count) as total_usage
FROM public.quote_patterns
GROUP BY pattern_type;

-- Grant access to the view
GRANT SELECT ON pattern_summary TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.quote_patterns IS 'Stores learned patterns from historical quotes for AI recommendations';
COMMENT ON TABLE public.ai_recommendations IS 'Tracks AI recommendations and user acceptance for feedback loop';
COMMENT ON TABLE public.ai_learning_metrics IS 'Stores performance metrics for the AI learning system';
COMMENT ON COLUMN public.quote_patterns.confidence_score IS 'AI confidence in this pattern (0.0 to 1.0), increases with usage';
COMMENT ON COLUMN public.quote_patterns.usage_count IS 'Number of times this pattern has been observed';
COMMENT ON FUNCTION update_pattern_confidence() IS 'Automatically increases confidence score as pattern usage grows';
COMMENT ON FUNCTION cleanup_old_patterns() IS 'Removes stale low-confidence patterns older than 90 days';