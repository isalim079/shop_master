import nodemailer from 'nodemailer';
import { config } from '../../config/env.config';
import { logger } from './logger';
import { InternalServerError } from '../errors';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string,
  name: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'ShopMaster — Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Hello, ${name}!</h2>
          <p>Your OTP code to verify your ShopMaster account:</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f4f4f4;
            border-radius: 8px;
            margin: 20px 0;
          ">
            ${otp}
          </div>
          <p>This code expires in <strong>${config.otp.expiresInMinutes} minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    logger.info(`📧 OTP email sent to ${email}`);
  } catch (error) {
    logger.error('❌ Failed to send OTP email:', error);
    throw new InternalServerError(
      'Could not send OTP email. Please check your email address and try again.'
    );
  }
};