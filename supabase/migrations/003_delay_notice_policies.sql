-- Ensure policies for delay notices exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'delay_notices_select'
  ) THEN
    CREATE POLICY "delay_notices_select" ON delay_notices
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'delay_notices_insert'
  ) THEN
    CREATE POLICY "delay_notices_insert" ON delay_notices
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'delay_notices_update'
  ) THEN
    CREATE POLICY "delay_notices_update" ON delay_notices
      FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'delay_notices_delete'
  ) THEN
    CREATE POLICY "delay_notices_delete" ON delay_notices
      FOR DELETE USING (auth.uid() IS NOT NULL);
  END IF;
END$$;

-- Ensure updated_at trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'delay_notices_updated_at'
  ) THEN
    CREATE TRIGGER delay_notices_updated_at BEFORE UPDATE ON delay_notices
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END$$;
