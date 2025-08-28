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

const templatePath = path.join(__dirname, '..', 'templates', 'sendemail-template.ejs');

async function sendEmail(to: string, username: string, verifyUrl: string) {
    const html = await ejs.renderFile(templatePath, { username, verifyUrl });
    await transporter.verify();
    console.log("Server is ready to take our messages");
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Verify your email address',
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

const email = {
    send: sendEmail
};
export default email;