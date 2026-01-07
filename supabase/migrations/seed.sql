-- Sample users (passwords would be handled by Supabase Auth)
INSERT INTO public.users (id, email, full_name, role, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'linus@powerprojectsltd.com', 'Linus Nwankwo', 'sales_manager', '08067042742'),
  ('22222222-2222-2222-2222-222222222222', 'engineer@powerprojectsltd.com', 'Sales Engineer', 'sales_engineer', '08078792350');

-- Sample clients
INSERT INTO public.clients (name, address, contact_person, email, created_by) VALUES
  ('Greater TAF City', 'Port Harcourt, Nigeria', 'ENGR. OBINNA', 'obinna@greatertaf.com', '11111111-1111-1111-1111-111111111111'),
  ('ECOLYTES', 'Lagos, Nigeria', 'ENGR. OLA', 'ola@ecolytes.com', '11111111-1111-1111-1111-111111111111');

-- Sample components will be inserted via import feature