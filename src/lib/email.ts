import { Resend } from "resend";

// RESEND_API_KEY must be set in .env.local for emails to send
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface OrderEmailData {
  to: string;
  orderTotal: string;
  itemsSummary: string;
  shippingName: string;
  shippingAddress: string;
  isGift: boolean;
  skus: string[]; // for passport links
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const passportLinks = data.skus
    .map(
      (sku) =>
        `<li style="margin-bottom:6px;">
          <a href="https://tempo.style/passport/${sku}"
             style="color:#C29E5F;text-decoration:underline;">
            View Digital Product Passport for ${sku}
          </a>
        </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Tempo order is confirmed</title>
</head>
<body style="margin:0;padding:0;background:#E8DFD2;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#E8DFD2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FAFAF7;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1A1A1A;padding:28px 40px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#C29E5F;letter-spacing:0.1em;">
                TEMPO
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:#9A9A9A;letter-spacing:0.12em;text-transform:uppercase;">
                Your order is confirmed
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;line-height:1.6;">
                Thank you${data.isGift ? " for your gift order" : ""}. Your Tempo garments are being prepared and will ship shortly.
              </p>

              <!-- Order summary -->
              <div style="background:#E8DFD2;border-radius:8px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#5A5A5A;letter-spacing:0.1em;text-transform:uppercase;">
                  Order summary
                </p>
                <p style="margin:0 0 8px;font-size:15px;color:#1A1A1A;line-height:1.6;">
                  ${data.itemsSummary}
                </p>
                <p style="margin:0;font-size:16px;font-weight:700;color:#1A1A1A;">
                  Total: $${data.orderTotal}
                </p>
              </div>

              <!-- Shipping -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#5A5A5A;letter-spacing:0.1em;text-transform:uppercase;">
                  Shipping to
                </p>
                <p style="margin:0;font-size:15px;color:#1A1A1A;line-height:1.6;">
                  ${data.shippingName}<br/>
                  ${data.shippingAddress}
                </p>
              </div>

              <!-- Digital Passports -->
              ${
                passportLinks
                  ? `<div style="background:#F0EDE8;border:1px solid #D4C9BA;border-radius:8px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1A1A1A;">
                  Your Tempo Passport is ready to scan
                </p>
                <p style="margin:0 0 12px;font-size:13px;color:#5A5A5A;line-height:1.5;">
                  Every garment comes with a Digital Product Passport showing fiber origin, certifications, carbon footprint, and care instructions.
                </p>
                <ul style="margin:0;padding-left:16px;font-size:13px;">
                  ${passportLinks}
                </ul>
              </div>`
                  : ""
              }

              <!-- HSA/FSA -->
              <div style="border-left:3px solid #C29E5F;padding:12px 16px;margin-bottom:24px;background:#FDF9F3;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1A1A1A;">
                  HSA / FSA reimbursement
                </p>
                <p style="margin:0;font-size:13px;color:#5A5A5A;line-height:1.5;">
                  This receipt is formatted for plan administrators. Attach it to your reimbursement request or submit it directly to your HSA/FSA administrator.
                </p>
              </div>

              <!-- Care instructions -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#5A5A5A;letter-spacing:0.1em;text-transform:uppercase;">
                  Care reminder
                </p>
                <p style="margin:0;font-size:13px;color:#5A5A5A;line-height:1.6;">
                  Scan the QR code on your garment tag, or visit your Digital Product Passport above, for washing, sterilization, and drying instructions specific to your garment.
                </p>
              </div>

              <!-- Return policy -->
              <div style="border-top:1px solid #D4C9BA;padding-top:20px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#5A5A5A;letter-spacing:0.1em;text-transform:uppercase;">
                  Returns
                </p>
                <p style="margin:0;font-size:13px;color:#5A5A5A;line-height:1.6;">
                  30-day returns on unworn items. Use our take-back program to earn 1,000 TempoPoints on eligible returns. Email orders@tempo.style to start a return.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1A1A1A;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#9A9A9A;line-height:1.6;">
                Tempo, Desta &amp; Yishak Consulting.
                Questions? Email <a href="mailto:orders@tempo.style" style="color:#C29E5F;">orders@tempo.style</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<void> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set. Skipping order confirmation email."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: "Tempo Orders <orders@tempo.style>",
      to: data.to,
      subject: `Your Tempo order is confirmed, $${data.orderTotal}`,
      html: buildOrderEmailHtml(data),
    });
  } catch (err) {
    console.error("[email] Failed to send order confirmation:", err);
  }
}
