import { env } from '../config/env.js';
import nodemailer from 'nodemailer';

export async function sendVerificationCode(email: string, code: string) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    if (env.NODE_ENV !== 'production') {
      console.info(`[LearnX] Verification code for ${email}: ${code}`);
      return;
    }
    throw new Error('Email service is not configured');
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to: email,
    subject: 'Your LearnX verification code',
    text: `Your LearnX verification code is ${code}. It expires in ${env.OTP_EXPIRES_MINUTES} minutes.`,
    html: `<p>Your LearnX verification code is <strong>${code}</strong>.</p><p>This code expires in ${env.OTP_EXPIRES_MINUTES} minutes.</p>`
  });
}
