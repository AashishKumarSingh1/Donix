import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });
const sendVerificationEmail = async (email: string, verificationUrl: string) => {
    console.log("Sending verification email to:", process.env.SMTP_EMAIL);
    console.log("Verification URL:", process.env.SMTP_PASSWORD);
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass:process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, 
            },
        });

        const mailOptions = {
            from: `"Donix" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Verify Your Email",
            html: `
                <h2>Welcome to Donix</h2>
                <p>Click the link below to verify your email address:</p>
                <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
                <p>This link expires in 15 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
};

export default sendVerificationEmail;
