import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || import.meta.env.VITE_RESEND_API_KEY);

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
  const { name, email, message } = body;

  try {
    const data = await resend.emails.send({
      from: 'Animesh <hello@animeshpandey.com>', // or a verified sender
      to: ['animeshpandey.pro@gmail.com'], // where the message goes
      subject: `New Contact Form Message from ${name}`,
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}
