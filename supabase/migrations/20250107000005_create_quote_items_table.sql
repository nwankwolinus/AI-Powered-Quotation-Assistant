CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  item_number INTEGER NOT NULL,
  panel_name VARCHAR(255) NOT NULL,
  
  -- Incomer details (JSONB for flexibility with multiple incomers)
  incomers JSONB DEFAULT '[]'::JSONB,
  
  -- Busbar details
  busbar_amperage VARCHAR(50),
  busbar_specification TEXT,
  busbar_price DECIMAL(15, 2) DEFAULT 0,
  
  -- Outgoings (JSONB array)
  outgoings JSONB DEFAULT '[]'::JSONB,
  
  -- Accessories (JSONB array)
  accessories JSONB DEFAULT '[]'::JSONB,
  
  -- Enclosure
  enclosure_dimensions VARCHAR(100),
  enclosure_price DECIMAL(15, 2) DEFAULT 0,
  
  -- Item totals
  subtotal DECIMAL(15, 2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_quote_item_number UNIQUE(quote_id, item_number)
);

CREATE INDEX idx_quote_items_quote_id ON public.quote_items(quote_id);

-- JSONB structure for reference:
-- incomers: [{ quantity, amperage, poles, type, vendor, model, specification, price }]
-- outgoings: [{ quantity, amperage, poles, type, vendor, model, price }]
-- accessories: [{ name, quantity, specification, price }]