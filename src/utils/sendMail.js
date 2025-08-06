import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getTemplate } from './mailTemplates.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to, templateName, data = {}) => {
  const { subject, html } = getTemplate(templateName, data);

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
