import nodemailer from 'nodemailer';

interface ContactEmailData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendContactNotification = async (data: ContactEmailData): Promise<void> => {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'info@escotech.rw';

  const mailOptions = {
    from: `"ESCOtech Website" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Contact Form Submission from ${data.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;">
            <strong>Name:</strong> ${data.fullName}
          </p>
          <p style="margin: 10px 0;">
            <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a>
          </p>
          <p style="margin: 10px 0;">
            <strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a>
          </p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Message:</h3>
          <p style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 0;">
            ${data.message.replace(/\n/g, '<br>')}
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="color: #666; font-size: 12px;">
          This email was sent from the ESCOtech Ltd website contact form.
        </p>
      </div>
    `,
    text: `
      New Contact Form Submission

      Name: ${data.fullName}
      Email: ${data.email}
      Phone: ${data.phone}

      Message:
      ${data.message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
};
