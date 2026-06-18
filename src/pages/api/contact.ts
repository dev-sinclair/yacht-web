import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

// Where the inquiry lands. Mirrors the address used in the footer / privacy
// / terms pages so brokers see all customer mail in one inbox.
const TO_ADDRESS = "info@sinclairyachting.com";

// Same validation envelope the client form already enforces — duplicated
// here so a curl-by-hand request can't bypass it.
const LIMITS = { name: 80, email: 254, message: 2000 } as const;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[api/contact] RESEND_API_KEY is not set");
    return json(500, { ok: false, error: "Email service not configured" });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > LIMITS.name) {
    return json(400, { ok: false, error: "Invalid name" });
  }
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: "Invalid email" });
  }
  if (!message || message.length > LIMITS.message) {
    return json(400, { ok: false, error: "Invalid message" });
  }

  // Resend requires the from-address domain to be verified in their dashboard.
  // Falls back to onboarding@resend.dev so the route still works pre-verification —
  // production deployments should set RESEND_FROM to a verified address.
  const from =
    import.meta.env.RESEND_FROM || "Sinclair Yachts <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Yacht inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      ].join(""),
    });

    if (error) {
      console.error("[api/contact] Resend error:", error);
      return json(502, { ok: false, error: "Failed to send email" });
    }

    return json(200, { ok: true, id: data?.id });
  } catch (err) {
    console.error("[api/contact] Unexpected error:", err);
    return json(500, { ok: false, error: "Failed to send email" });
  }
};
