import nodemailer  from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const templatePath = path.join(__dirname, '..', 'templates');

async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (error) {
    console.error("Error with email server:", error);
    throw error;
  }
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

}

async function sendVerifyEmail(to: string, username: string, verifyUrl: string) {
  try {
    const verifyEmail = path.join(templatePath, 'verify-email.ejs');
    const html = await ejs.renderFile(verifyEmail, { username, verifyUrl });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Verify your email address',
        html,
    };
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Error preparing or sending verification email:", error);
    throw error;
  }
}

async function sendResetPasswordEmail(to: string, username: string, newPassword: string) {
    const resetPassword = path.join(templatePath, 'password-reset.ejs');
    const html = await ejs.renderFile(resetPassword, { username, newPassword });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Reset your password',
        html,
    };
    await sendEmail(mailOptions);
}

const email = {
    sendVerify: sendVerifyEmail,
    sendResetPassword: sendResetPasswordEmail,
};
export default email;