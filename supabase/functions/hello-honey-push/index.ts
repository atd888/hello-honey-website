import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const json = (body: Record<string, unknown>, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { "Content-Type": "application/json; charset=utf-8" } },
);

function sameSecret(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const expectedSecret = Deno.env.get("HELLO_HONEY_PUSH_TRIGGER_SECRET") || "";
  const receivedSecret = request.headers.get("x-hello-honey-push-secret") || "";
  if (!expectedSecret || !sameSecret(receivedSecret, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:artemidaballiu35@gmail.com";
  if (!supabaseUrl || !serviceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    console.error("Push notification configuration is incomplete.");
    return json({ error: "Push service is not configured" }, 500);
  }

  try {
    await request.json();
  } catch (_) {
    return json({ error: "Invalid request body" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: subscriptions, error } = await supabase
    .from("hello_honey_admin_push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    console.error("Unable to read admin push subscriptions:", error.message);
    return json({ error: "Unable to load notification subscriptions" }, 500);
  }
  if (!subscriptions?.length) return json({ sent: 0 });

  const notification = JSON.stringify({
    title: "New Hello Honey booking",
    body: "A new appointment request has arrived. Tap to review it.",
  });
  const staleEndpoints: string[] = [];
  const results = await Promise.allSettled(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      }, notification, {
        TTL: 60,
        urgency: "high",
        vapidDetails: {
          subject: vapidSubject,
          publicKey: vapidPublicKey,
          privateKey: vapidPrivateKey,
        },
      });
      return true;
    } catch (error) {
      const statusCode = Number((error as { statusCode?: number })?.statusCode);
      if (statusCode === 404 || statusCode === 410) staleEndpoints.push(subscription.endpoint);
      console.error("A Hello Honey push notification could not be sent:", statusCode || "unknown error");
      return false;
    }
  }));

  if (staleEndpoints.length) {
    const { error: deleteError } = await supabase
      .from("hello_honey_admin_push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
    if (deleteError) console.error("Unable to remove expired push subscriptions:", deleteError.message);
  }

  const sent = results.filter((result) => result.status === "fulfilled" && result.value).length;
  return json({ sent, attempted: subscriptions.length });
});
