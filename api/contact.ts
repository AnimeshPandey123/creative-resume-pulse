import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const verifyRecaptcha = async (token: string) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  const data = await response.json();
  return data.success && data.score > 0.5;
};

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    });
  }

  const body = await req.json();
  const { name, email, message, recaptchaToken } = body;

  if (!recaptchaToken) {
    return new Response(
      JSON.stringify({ error: 'Recaptcha token is required' }),
      {
        status: 400,
      }
    );
  }
  const recaptchaSuccess = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaSuccess) {
    return new Response(
      JSON.stringify({ error: 'Recaptcha verification failed' }),
      {
        status: 400,
      }
    );
  }

  try {
    const data = await resend.emails.send({
      from: 'Animesh  <onboarding@resend.dev>',
      to: ['animeshpandey.pro@gmail.com'],
      subject: `📬 New Message from ${name} via Your Website`,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Message:</strong></p>
            <p style="margin-left: 1em;">${message}</p>
          </div>`,
    });
    console.log(data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}
