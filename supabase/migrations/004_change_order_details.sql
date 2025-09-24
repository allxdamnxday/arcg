-- Additional narrative and labor fields for change orders
ALTER TABLE change_orders
  ADD COLUMN IF NOT EXISTS justification text,
  ADD COLUMN IF NOT EXISTS additional_info text,
  ADD COLUMN IF NOT EXISTS labor_notes text,
  ADD COLUMN IF NOT EXISTS labor_hours numeric,
  ADD COLUMN IF NOT EXISTS labor_rate numeric,
  ADD COLUMN IF NOT EXISTS labor_overhead_pct numeric,
  ADD COLUMN IF NOT EXISTS total_labor_cost numeric,
  ADD COLUMN IF NOT EXISTS total_overhead_cost numeric,
  ADD COLUMN IF NOT EXISTS total_cost numeric,
  ADD COLUMN IF NOT EXISTS delay_notice_ref text;
