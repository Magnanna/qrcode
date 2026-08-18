import QRCode from "qrcode";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function ticketEmailHtml({
  guestName,
  orgName,
  tableLabel,
  qrCid,
}: {
  guestName: string;
  orgName: string;
  tableLabel: string | null;
  qrCid: string;
}) {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:40px 40px 24px 40px;text-align:center;">
                <div style="width:48px;height:48px;background:#000;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
                  <span style="color:#fff;font-size:22px;line-height:48px;">◎</span>
                </div>
                <h1 style="margin:0 0 4px 0;font-size:22px;font-weight:600;color:#1d1d1f;letter-spacing:-0.3px;">You're on the list</h1>
                <p style="margin:0;font-size:15px;color:#6e6e73;">${orgName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px;text-align:center;">
                <div style="background:#f5f5f7;border-radius:20px;padding:28px;">
                  <img src="cid:${qrCid}" width="220" height="220" alt="Entry QR code" style="display:block;margin:0 auto;border-radius:12px;" />
                  <p style="margin:20px 0 0 0;font-size:17px;font-weight:600;color:#1d1d1f;">${guestName}</p>
                  ${tableLabel ? `<p style="margin:4px 0 0 0;font-size:14px;color:#6e6e73;">Table ${tableLabel}</p>` : ""}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px 40px 40px;text-align:center;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#86868b;">
                  Show this code at any entrance. It's valid for a single scan — please don't forward it to anyone else.
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

export async function sendTicketEmail({
  to,
  guestName,
  orgName,
  tableLabel,
  token,
}: {
  to: string;
  guestName: string;
  orgName: string;
  tableLabel: string | null;
  token: string;
}) {
  const qrBuffer = await QRCode.toBuffer(token, { width: 480, margin: 1 });
  const qrCid = "ticket-qr";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Your ticket for ${orgName}`,
    html: ticketEmailHtml({ guestName, orgName, tableLabel, qrCid }),
    attachments: [
      {
        filename: "ticket-qr.png",
        content: qrBuffer,
        contentId: qrCid,
      },
    ],
  });

  if (error) throw new Error(error.message);
}
