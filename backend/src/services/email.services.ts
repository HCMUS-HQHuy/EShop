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
  await transporter.verify();
  console.log("Server is ready to take our messages");

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }

}

async function sendVerifyEmail(to: string, username: string, verifyUrl: string) {
    const verifyEmail = path.join(templatePath, 'verify-email.ejs');
    const html = await ejs.renderFile(verifyEmail, { username, verifyUrl });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Verify your email address',
        html,
    };
    await sendEmail(mailOptions);
}

async function sendResetPasswordEmail(to: string, username: string, resetUrl: string) {
    const resetPassword = path.join(templatePath, 'password-reset.ejs');
    const html = await ejs.renderFile(resetPassword, { username, resetUrl });
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