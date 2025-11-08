import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('Email configuration error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
}

export async function sendEmail(to, subject, text) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not configured. Would send:', { to, subject, text });
    return { message: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Gelibolu İngilizce Evi" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: text.replace(/\n/g, '<br>')
    });
    
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(customerEmail, customerName, date, time) {
  const subject = 'Randevu Onayı - Gelibolu İngilizce Evi';
  const text = `
    Sayın ${customerName},
    
    Randevu talebiniz onaylanmıştır.
    
    Randevu Detayları:
    Tarih: ${date}
    Saat: ${time}
    
    Randevu gününde sizleri görmekten mutluluk duyarız.
    
    Herhangi bir sorunuz olursa lütfen bizimle iletişime geçin.
    
    İyi günler,
    Gelibolu İngilizce Evi
  `;

  return await sendEmail(customerEmail, subject, text);
}

