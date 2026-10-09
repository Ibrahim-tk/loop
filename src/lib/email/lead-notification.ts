import { escapeHtml } from '@/lib/utils';
import { getInquiryOption } from '@/lib/constants/inquiry-options';

interface LeadNotificationData {
    name: string;
    email: string;
    phone?: string;
    helpType: string;
    message: string;
    createdAt?: string;
}

const LOGO_URL = 'https://fasanahomes.com/brand/logo-dark.png';

export function buildLeadNotificationHtml(data: LeadNotificationData): string {
    const option = getInquiryOption(data.helpType);
    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const phone = escapeHtml(data.phone || 'Not provided');
    const message = escapeHtml(data.message).replace(/\n/g, '<br>');
    const inquiryLabel = escapeHtml(option.label);
    const badgeColor = option.badgeColor;
    const badgeBg = option.badgeBg;
    const timestamp = data.createdAt
        ? new Date(data.createdAt).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
          })
        : new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
          });

    const dashboardUrl = 'https://fasanahomes.com/admin/leads';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry - Fasana Homes</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">



<!-- Inquiry Badge -->
<tr>
<td style="padding:28px 32px 0 32px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:${badgeBg};color:${badgeColor};font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:6px 14px;border-radius:20px;border:1px solid ${badgeColor}20;">
      ${inquiryLabel}
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- Title -->
<tr>
<td style="padding:16px 32px 4px 32px;">
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#1a1a1a;line-height:1.3;">
    New Inquiry from ${name}
  </h1>
</td>
</tr>
<tr>
<td style="padding:0 32px 24px 32px;">
  <p style="margin:0;font-size:13px;color:#8b8f94;">
    ${timestamp}
  </p>
</td>
</tr>

<!-- Divider -->
<tr>
<td style="padding:0 32px;">
  <hr style="border:none;border-top:1px solid #e8e9eb;margin:0;" />
</td>
</tr>

<!-- Contact Details -->
<tr>
<td style="padding:24px 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:8px 0;vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="120" style="font-size:13px;color:#8b8f94;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;vertical-align:top;padding-bottom:4px;">
              Name
            </td>
            <td style="font-size:15px;color:#1a1a1a;font-weight:500;vertical-align:top;padding-bottom:4px;">
              ${name}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0;vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="120" style="font-size:13px;color:#8b8f94;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;vertical-align:top;padding-bottom:4px;">
              Email
            </td>
            <td style="font-size:15px;vertical-align:top;padding-bottom:4px;">
              <a href="mailto:${email}" style="color:#0A3161;text-decoration:none;font-weight:500;">${email}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0;vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="120" style="font-size:13px;color:#8b8f94;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;vertical-align:top;padding-bottom:4px;">
              Phone
            </td>
            <td style="font-size:15px;color:#1a1a1a;font-weight:500;vertical-align:top;padding-bottom:4px;">
              ${phone}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0;vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="120" style="font-size:13px;color:#8b8f94;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;vertical-align:top;padding-bottom:4px;">
              Inquiry
            </td>
            <td style="font-size:15px;color:${badgeColor};font-weight:600;vertical-align:top;padding-bottom:4px;">
              ${inquiryLabel}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Message Block -->
<tr>
<td style="padding:0 32px 24px 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="font-size:13px;color:#8b8f94;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;padding-bottom:10px;">
      Message
    </td>
  </tr>
  <tr>
    <td style="background-color:#f8f9fa;border-left:3px solid #0A3161;padding:16px 20px;border-radius:0 6px 6px 0;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;">
        ${message}
      </p>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- CTA Button -->
<tr>
<td style="padding:8px 32px 32px 32px;text-align:center;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
  <tr>
    <td style="background-color:#0A3161;border-radius:6px;">
      <a href="${dashboardUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
        View in Dashboard
      </a>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e8e9eb;">
  <p style="margin:0 0 4px 0;font-size:13px;color:#8b8f94;font-weight:600;">
    Fasana Homes
  </p>
  <p style="margin:0;font-size:11px;color:#b0b3b8;">
    This is an automated notification from your website contact form.
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
