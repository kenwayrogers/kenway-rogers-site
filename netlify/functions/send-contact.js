// Netlify Function: send-contact
// Sends contact form messages to a configured recipient using SendGrid

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Accept JSON body (AJAX) — additional parsing could be added for urlencoded bodies
    const body = JSON.parse(event.body || '{}');
    const { name, email, message } = body || {};

    // Basic validation
    const emailRe = /^\S+@\S+\.\S+$/;

    if (!email || !message || !emailRe.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields (email, message).' }) };
    }

    // Support a few common env var names: application key may be set directly
    // as SENDGRID_API_KEY or via the Netlify Email Extension which stores a
    // provider key under a different environment variable. We check common
    // ones so the function works whether you set SENDGRID_API_KEY directly
    // or used Netlify's Email integration.
    // Determine which env var contains the sendgrid key so we can provide helpful logs.
    let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || process.env.NETLIFY_EMAIL_PROVIDER_API_KEY || process.env.NETLIFY_EMAIL_EXTENSION_API_KEY || process.env.NETLIFY_EMAIL_API_KEY;
    let sendgridKeyName = null;
    if (process.env.SENDGRID_API_KEY) sendgridKeyName = 'SENDGRID_API_KEY';
    else if (process.env.NETLIFY_EMAIL_PROVIDER_API_KEY) sendgridKeyName = 'NETLIFY_EMAIL_PROVIDER_API_KEY';
    else if (process.env.NETLIFY_EMAIL_EXTENSION_API_KEY) sendgridKeyName = 'NETLIFY_EMAIL_EXTENSION_API_KEY';
    else if (process.env.NETLIFY_EMAIL_API_KEY) sendgridKeyName = 'NETLIFY_EMAIL_API_KEY';
    // Recipient email environment variable (explicit)
    const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || process.env.SEND_TO_EMAIL || process.env.NETLIFY_EMAIL_RECIPIENT;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@' + (process.env.SITE_DOMAIN || 'example.com');

    if (!SENDGRID_API_KEY || !RECIPIENT_EMAIL) {
      const errors = [];
      if (!SENDGRID_API_KEY) errors.push('SENDGRID API key not set');
      if (!RECIPIENT_EMAIL) errors.push('CONTACT_RECIPIENT_EMAIL not set');
      console.error('send-contact: configuration error:', errors.join('; '));
      return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured. Set SENDGRID_API_KEY (or configure Netlify Email extension) and CONTACT_RECIPIENT_EMAIL on Netlify.' }) };
    }
    if (sendgridKeyName) console.log(`send-contact: using ${sendgridKeyName}`);

    const payload = {
      personalizations: [{
        to: [{ email: RECIPIENT_EMAIL }],
        subject: `Site contact from ${name || 'Visitor'}`
      }],
      from: { email: FROM_EMAIL, name: 'Kenway Rogers Site' },
      reply_to: { email: email, name: name || '' },
      content: [
        { type: 'text/plain', value: `From: ${name || 'Anonymous'} <${email}>\n\nMessage:\n${message}` },
        { type: 'text/html', value: `<p><strong>From:</strong> ${name || 'Anonymous'} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${(message || '').replace(/\n/g, '<br/>')}</p>` }
      ]
    };

    const res = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'SendGrid error', detail: txt }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('send-contact error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', detail: String(err) }) };
  }
};
