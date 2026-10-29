-- Store only the owner's browser push subscription. Booking/customer data is not stored here.
CREATE TABLE IF NOT EXISTS public.hello_honey_admin_push_subscriptions (
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text PRIMARY KEY,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hello_honey_admin_push_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hello_honey_admin_push_subscriptions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hello_honey_admin_push_subscriptions TO authenticated;

DROP POLICY IF EXISTS "Owner can manage Hello Honey push subscriptions"
  ON public.hello_honey_admin_push_subscriptions;
CREATE POLICY "Owner can manage Hello Honey push subscriptions"
  ON public.hello_honey_admin_push_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id AND auth.uid() = '3a7b2b25-39f7-462a-ace9-e98bd57efe2f'::uuid)
  WITH CHECK (auth.uid() = owner_id AND auth.uid() = '3a7b2b25-39f7-462a-ace9-e98bd57efe2f'::uuid);

CREATE OR REPLACE FUNCTION public.notify_hello_honey_admin_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
  trigger_secret text;
  publishable_key text;
BEGIN
  SELECT decrypted_secret INTO function_url
  FROM vault.decrypted_secrets
  WHERE name = 'hello_honey_push_function_url';

  SELECT decrypted_secret INTO trigger_secret
  FROM vault.decrypted_secrets
  WHERE name = 'hello_honey_push_trigger_secret';

  SELECT decrypted_secret INTO publishable_key
  FROM vault.decrypted_secrets
  WHERE name = 'hello_honey_push_publishable_key';

  IF function_url IS NULL OR trigger_secret IS NULL OR publishable_key IS NULL THEN
    RAISE WARNING 'Hello Honey push notification secrets are not configured';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := function_url || '/functions/v1/hello-honey-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-hello-honey-push-secret', trigger_secret,
      'Authorization', 'Bearer ' || publishable_key,
      'apikey', publishable_key
    ),
    body := jsonb_build_object('bookingId', NEW.id),
    timeout_milliseconds := 5000
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hello_honey_admin_new_booking_push ON public.hello_honey_bookings;
CREATE TRIGGER hello_honey_admin_new_booking_push
  AFTER INSERT ON public.hello_honey_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_hello_honey_admin_new_booking();
