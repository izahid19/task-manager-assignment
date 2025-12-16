import { env } from '../config/env.js';

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

/**
 * Email service using Brevo (Sendinblue) API
 * Handles transactional emails for OTP verification and password reset
 */
class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  private apiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor() {
    this.apiKey = env.BREVO_API_KEY;
    this.fromEmail = env.FROM_EMAIL;
    this.fromName = env.FROM_NAME;
  }

  /**
   * Sends an email using Brevo API
   * @param options - Email options (to, subject, htmlContent)
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': this.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: this.fromName,
          email: this.fromEmail,
        },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Sends verification OTP email to new user
   * @param email - Recipient email
   * @param name - User's name
   * @param otp - 6-digit OTP code
   */
  async sendVerificationOtp(email: string, name: string, otp: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verify Your Account</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Welcome to Task Manager! Please use the following OTP to verify your email address:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Task Manager Account',
      htmlContent,
    });
  }

  /**
   * Sends password reset OTP email
   * @param email - Recipient email
   * @param name - User's name
   * @param otp - 6-digit OTP code
   */
  async sendPasswordResetOtp(email: string, name: string, otp: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 8px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Use the following OTP to proceed:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Task Manager Password',
      htmlContent,
    });
  }

  /**
   * Sends task assignment notification email
   * @param email - Recipient email
   * @param name - User's name
   * @param taskTitle - Title of the assigned task
   * @param assignerName - Name of the person who assigned the task
   */
  async sendTaskAssignmentEmail(
    email: string,
    name: string,
    taskTitle: string,
    assignerName: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; border-left: 4px solid #11998e; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p><strong>${assignerName}</strong> has assigned you a new task:</p>
            <div class="task-box">
              <strong>${taskTitle}</strong>
            </div>
            <p>Log in to your Task Manager account to view the task details and get started!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `New Task Assigned: ${taskTitle}`,
      htmlContent,
    });
  }
}

export const emailService = new EmailService();
