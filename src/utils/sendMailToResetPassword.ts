import nodemailer from "nodemailer";
import "dotenv/config";
import redisClient from "../config/redis";

const BREVO_LOGIN: string = process.env.BREVO_LOGIN as string;
const BREVO_KEY: string = process.env.BREVO_KEY as string;
const BREVO_SENDER: string = process.env.BREVO_SENDER as string;

export default async function sendMailToResetPassword(email: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: BREVO_LOGIN,
            pass: BREVO_KEY,
        },
    });

    const code = Math.floor(Math.random() * 900000) + 100000;

    const mailOptions = {
        from: BREVO_SENDER,
        to: email,
        subject: "Reset Password",
        html:
            `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
            `<p>Here is your 6 digit reset code: <strong>${code}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);

    await redisClient.set(email, code, {
        EX: 60 * 5,
    });
}
