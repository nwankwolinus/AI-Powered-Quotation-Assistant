CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  client_address TEXT,
  attention VARCHAR(255),
  project_name TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'revised', 'rejected')),
  revision_number INTEGER DEFAULT 0,
  total DECIMAL(15, 2) DEFAULT 0,
  vat DECIMAL(15, 2) DEFAULT 0,
  grand_total DECIMAL(15, 2) DEFAULT 0,
  payment_terms TEXT,
  execution_period VARCHAR(255),
  validity_period VARCHAR(255),
  notes TEXT,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_quotes_quote_number ON public.quotes(quote_number);
CREATE INDEX idx_quotes_client_id ON public.quotes(client_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_created_by ON public.quotes(created_by);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at)