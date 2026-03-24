
export const sendOTPMail = async (otp, email) => {
  if (!process.env.BREVO_API_KEY) {
    console.error("CRITICAL: BREVO_API_KEY is missing !");
    return { success: false, error: "Configuration missing" };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Servive Mate Group",
          email: "ashwathsashwaths33@gmail.com",
        },
        to: [{ email: email }],
        subject: `OTP: ${otp}`,
        htmlContent: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Service Mate Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f9fafb; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center" style="padding:20px 0;">

<table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.05); border:1px solid #e5e7eb;">

<tr>
<td align="center" style="background-color:#2563eb; padding:30px 20px;">
<h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Service Mate</h1>
<p style="color:#dbeafe; margin:5px 0 0 0; font-size:14px; text-transform:uppercase; letter-spacing:1px;">
Account Verification
</p>
</td>
</tr>

<tr>
<td style="padding:40px 30px;">

<h2 style="color:#111827; margin:0 0 16px 0; font-size:20px; font-weight:600;">
Verify Your Account
</h2>

<p style="color:#4b5563; font-size:16px; line-height:24px; margin:0 0 30px 0;">
Hello,<br><br>
Welcome to <strong>Service Mate</strong> – your trusted platform to book professional home services like electricians, plumbers, cleaning, and more.<br><br>
To complete your registration, please enter the verification code below:
</p>

<div style="text-align:center; background-color:#eff6ff; border:2px dashed #2563eb; border-radius:10px; padding:25px; margin-bottom:30px;">
<span style="font-size:36px; font-weight:800; color:#2563eb; letter-spacing:8px; font-family:'Courier New', Courier, monospace;">
${otp}
</span>
</div>

<p style="color:#6b7280; font-size:14px; text-align:center; margin:0;">
This code will expire in <strong>10 minutes</strong>.<br>
If you didn’t request this code, you can safely ignore this email.
</p>

</td>
</tr>

<tr>
<td style="background-color:#f9fafb; padding:20px 30px; border-top:1px solid #e5e7eb; text-align:center;">
<p style="color:#9ca3af; font-size:12px; margin:0; line-height:18px;">
© 2026 Service Mate. All rights reserved.<br>
Helping you connect with trusted service professionals.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`,
      }),
    });

    const data = await response.json();
    console.log("Brevo Response:", data); // Check this in Vercel Logs
    return { success: true };
  } catch (err) {
    console.error("Vercel Edge Error:", err);
    return { success: false, error: err.message };
  }
};
