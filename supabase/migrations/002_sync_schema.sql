-- Align schema with live environment extras

-- Additional project metadata columns
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS general_contractor text,
  ADD COLUMN IF NOT EXISTS superintendent text,
  ADD COLUMN IF NOT EXISTS project_manager text,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date;

-- Expanded change order details
ALTER TABLE change_orders
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rfi_number text,
  ADD COLUMN IF NOT EXISTS submittal_number text,
  ADD COLUMN IF NOT EXISTS drawing_ref text,
  ADD COLUMN IF NOT EXISTS floor text,
  ADD COLUMN IF NOT EXISTS area text,
  ADD COLUMN IF NOT EXISTS vendor text,
  ADD COLUMN IF NOT EXISTS requested_by text,
  ADD COLUMN IF NOT EXISTS due_date date;

-- Delay notice support
DO $$
BEGIN
  CREATE TYPE delay_notice_status AS ENUM ('draft','sent','acknowledged');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

CREATE TABLE IF NOT EXISTS delay_notices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  incident_date date NOT NULL,
  reported_date date DEFAULT CURRENT_DATE,
  time_impact_days_estimate integer,
  recipients text[],
  status delay_notice_status DEFAULT 'draft',
  emailed_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delay_notices_project ON delay_notices(project_id);
CREATE INDEX IF NOT EXISTS idx_delay_notices_status ON delay_notices(status);

ALTER TABLE delay_notices ENABLE ROW LEVEL SECURITY;
