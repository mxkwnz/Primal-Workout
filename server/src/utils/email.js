const nodemailer = require("nodemailer");

function getTransport() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (apiKey) {
    // When using SendGrid's SMTP with an API key, the SMTP username must be
    // the literal string "apikey" and the API key is used as the password.
    // Nodemailer expects an `auth.user` and `auth.pass` pair, so we pass
    // { user: 'apikey', pass: <API_KEY> }.
    const host = process.env.SENDGRID_SMTP_HOST || "smtp.sendgrid.net";
    const port = process.env.SENDGRID_SMTP_PORT || 587;
    const masked =
      apiKey.length > 8
        ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
        : "(<short key>)";
    console.log(
      `Email transport: using SendGrid SMTP (SENDGRID_API_KEY present). host=${host}, port=${port}, apiKey=${masked}`,
    );
    return nodemailer.createTransport({
      host,
      port: port ? parseInt(port, 10) : 587,
      secure: port === "465" || port === 465,
      auth: { user: "apikey", pass: apiKey },
    });
  }

  // Fallback to generic SMTP settings. Make sure we read all expected vars.
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn(
      "Email transport: no SendGrid API key and no SMTP config found (SMTP_HOST/SMTP_USER/SMTP_PASS). Emails will be disabled.",
    );
    return null;
  }
  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: port === "465",
    auth: { user, pass },
  });
}

async function sendWelcomeEmail(to, username) {
  const transport = getTransport();
  if (!transport) return;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  try {
    console.log(`Attempting to send welcome email to ${to}`);
    const info = await transport.sendMail({
      from,
      to,
      subject: "Welcome to Primal-Fit",
      text: `Hi ${username},\n\nWelcome to Primal-Fit. You can now log in and start building your workout plans.\n\nBest,\nPrimal-Fit Team`,
    });
    console.log("Welcome email sent:", {
      to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return info;
  } catch (err) {
    console.error(
      "Send welcome email failed:",
      err && err.message ? err.message : err,
    );
  }
}

async function sendPasswordResetEmail(to, resetToken, baseUrl) {
  const transport = getTransport();
  if (!transport) return;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const url = baseUrl
    ? `${baseUrl.replace(/\/$/, "")}/reset-password.html?token=${resetToken}`
    : `#`;
  try {
    console.log(`Attempting to send password reset email to ${to}`);
    const info = await transport.sendMail({
      from,
      to,
      subject: "Primal-Fit Password Reset",
      text: `You requested a password reset. Open this link to set a new password: ${url}\n\nIf you did not request this, ignore this email.`,
    });
    console.log("Password reset email sent:", {
      to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return info;
  } catch (err) {
    console.error(
      "Send reset email failed:",
      err && err.message ? err.message : err,
    );
  }
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
