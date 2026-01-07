CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
  ('exchange_rate_usd_ngn', '1650', 'Exchange rate for CHINT products (USD to NGN)'),
  ('markup_percentage', '20', 'Default markup percentage'),
  ('vat_percentage', '7.5', 'VAT percentage'),
  ('company_name', 'Power Projects Limited', 'Company name'),
  ('company_address', '40, NNPC Road, Ejigbo, Lagos', 'Company address'),
  ('company_phone', '08078792350', 'Company phone'),
  ('company_email', 'info@powerprojectsltd.com', 'Company email'),
  ('company_website', 'www.powerprojectsltd.com', 'Company website'),
  ('default_payment_terms', '80% down payment balance 20% on completion before delivery', 'Default payment terms'),
  ('default_execution_period', '6 weeks from date we receive your order with payment', 'Default execution period'),
  ('default_validity_period', '30 days after which this offer will be subjected to confirmation', 'Default validity period')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX idx_settings_key ON public.settings(key);