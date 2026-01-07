-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Clients table policies
CREATE POLICY "Users can view all clients"
  ON public.clients FOR SELECT
  USING (true);

CREATE POLICY "Sales engineers and managers can create clients"
  ON public.clients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('sales_engineer', 'sales_manager', 'admin')
    )
  );

CREATE POLICY "Users can update clients they created"
  ON public.clients FOR UPDATE
  USING (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));

-- Components table policies
CREATE POLICY "Users can view all components"
  ON public.components FOR SELECT
  USING (true);

CREATE POLICY "Sales engineers and managers can create components"
  ON public.components FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('sales_engineer', 'sales_manager', 'admin')
    )
  );

CREATE POLICY "Sales managers can update/delete components"
  ON public.components FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));

CREATE POLICY "Sales managers can delete components"
  ON public.components FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));

-- Quotes table policies
CREATE POLICY "Users can view quotes they created or all if manager"
  ON public.quotes FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
    )
  );

CREATE POLICY "Sales engineers can create quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('sales_engineer', 'sales_manager', 'admin')
    )
  );

CREATE POLICY "Users can update their own quotes or managers can update all"
  ON public.quotes FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
    )
  );

CREATE POLICY "Users can delete their own draft quotes or managers can delete all"
  ON public.quotes FOR DELETE
  USING (
    (created_by = auth.uid() AND status = 'draft') OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
    )
  );

-- Quote items table policies (inherit from quotes)
CREATE POLICY "Users can view quote items for accessible quotes"
  ON public.quote_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE id = quote_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
        )
      )
    )
  );

CREATE POLICY "Users can manage quote items for their quotes"
  ON public.quote_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE id = quote_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
        )
      )
    )
  );

-- Settings table policies
CREATE POLICY "Users can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins and managers can update settings"
  ON public.settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('sales_manager', 'admin')
  ));
