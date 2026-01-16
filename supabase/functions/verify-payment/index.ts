import { serve } from "std/http/server.ts";
import crypto from "node:crypto";
import { createClient } from "supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// -------------------------
// Helper: format INR
// -------------------------
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// -------------------------
// Helper: India time
// -------------------------
function formatIndiaTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// WhatsApp Function

async function sendWhatsAppMessage({
  to,
  message,
}: {
  to: string; // "whatsapp:+91XXXXXXXXXX"
  message: string;
}) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_WHATSAPP_FROM");

  if (!sid || !token || !from) {
    console.warn("Twilio env vars missing");
    return;
  }

  const auth = btoa(`${sid}:${token}`);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:${to}`,
        Body: message,
      }),
    },
  );

  if (!res.ok) {
    console.error("Twilio WhatsApp failed:", await res.text());
  }
}

// -------------------------
// Helper: Send email via Resend
// -------------------------
async function sendPaymentEmail({
  to,
  name,
  amount,
  paymentId,
  service,
  paidAt,
}: {
  to: string;
  name?: string;
  amount: number;
  paymentId: string;
  service?: string;
  paidAt: Date;
}) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("EMAIL_FROM");
  const adminEmail = Deno.env.get("ADMIN_EMAIL"); // optional

  if (!resendKey || !fromEmail) {
    console.warn("Email skipped: Resend env vars missing");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      cc: adminEmail ? [adminEmail] : undefined,
      subject: "Payment Confirmation",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Payment Successful ✅</h2>
          <p>Hi ${name ?? "there"},</p>

          <p>We’ve received your payment successfully.</p>

          <table cellpadding="6">
            <tr>
              <td><strong>Amount</strong></td>
              <td>${formatINR(amount)}</td>
            </tr>
            <tr>
              <td><strong>Payment ID</strong></td>
              <td>${paymentId}</td>
            </tr>
            ${
        service
          ? `<tr>
                     <td><strong>Service</strong></td>
                     <td>${service}</td>
                   </tr>`
          : ""
      }
            <tr>
              <td><strong>Date</strong></td>
              <td>${formatIndiaTime(paidAt)}</td>
            </tr>
          </table>

          <p>Thank you for choosing us.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Resend email failed:", err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const bodyData = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      customer_data,
    } = bodyData;

    const customer_name = customer_data?.name;
    const customer_email = customer_data?.email;
    const customer_phone = customer_data?.phone;
    const service_selected = customer_data?.eventType;
    const notes = customer_data?.message;
    // const bookingDateRaw = customer_data?.booking_date;
    const bookingDateRaw = customer_data?.booking_date || null;
    console.log("Received bookingDateRaw:", bookingDateRaw);
    if (!bookingDateRaw) {
      console.error("CRITICAL: bookingDateRaw is null or empty string");
      return new Response(
        JSON.stringify({ success: false, error: "Booking date is required" }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing payment fields" }),
        { status: 400, headers: corsHeaders },
      );
    }

    // -------------------------
    // Verify signature
    // -------------------------
    const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        { status: 400, headers: corsHeaders },
      );
    }

    // -------------------------
    // Supabase client (service role)
    // -------------------------
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const paidAt = new Date();
    const paidAtUTC = new Date();
    const paidAtIST = new Date(
      paidAtUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );

    const { data: paymentRecord, error: paymentError } = await supabase
      .from("payments")
      .insert({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: amount / 100,
        currency: "INR",
        status: "paid",
        paid_at: new Date().toISOString(),
        paid_at_ist: paidAtIST.toISOString().replace("Z", ""),
        customer_name,
        customer_email,
        customer_phone,
        service_selected,
        notes,
      })
      .select("id")
      .single();

    if (paymentError) throw paymentError;

    // 3. INSERT INTO BOOKINGS
    // We use paymentRecord.id (the UUID) to link them correctly
    const { error: bookingError } = await supabase.from("bookings").insert({
      // booking_date: customer_data.booking_date,
      booking_date: bookingDateRaw,
      status: "pending",
      payment_id: paymentRecord.id, // <--- THIS WAS THE ERROR. NOW IT USES THE UUID
      customer_name,
      customer_email,
      customer_phone,
      service_selected,
      notes,
    });

    if (bookingError) {
      console.error("Booking Table Insert Error:", bookingError);
      // We don't necessarily want to crash the whole thing if the booking fails
      // but the payment succeeded, but for now we throw to be safe.
      throw bookingError;
    }
    // -------------------------
    // 🆕 Send confirmation email (non-blocking)
    // -------------------------
    if (customer_email) {
      sendPaymentEmail({
        to: customer_email,
        name: customer_name,
        amount: amount / 100,
        paymentId: razorpay_payment_id,
        service: service_selected,
        paidAt,
      }).catch(console.error);
    }

    if (customer_phone) {
      sendWhatsAppMessage({
        // to: customer_phone,
        to: `+91${customer_phone}`,
        // to: +91 ${customer_phone},
        message: `✅ Payment received!
        Service: ${service_selected}
        Amount: ₹${amount / 100}
        Date: ${formatIndiaTime(paidAt)}

        We’ll contact you shortly.`,
      }).catch(console.error);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: corsHeaders },
    );
  }
});
