CREATE TABLE IF NOT EXISTS public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(50) NOT NULL CHECK (vendor IN ('Schneider', 'ABB', 'CHINT', 'Generic', 'ComAp')),
  item VARCHAR(100) NOT NULL,
  model VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD')),
  amperage VARCHAR(50),
  poles VARCHAR(10),
  type VARCHAR(50),
  specification TEXT,
  category VARCHAR(50) CHECK (category IN ('breaker', 'busbar', 'accessory', 'enclosure', 'meter', 'other')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_components_vendor ON public.components(vendor);
CREATE INDEX idx_components_item ON public.components(item);
CREATE INDEX idx_components_amperage ON public.components(amperage);
CREATE INDEX idx_components_type ON public.components(type);
CREATE INDEX idx_components_category ON public.components(category);