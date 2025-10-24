import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { username, email, password } = JSON.parse(event.body || "{}");

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email already registered" }) };
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username, email, password: hashed });

    // ✅ Brevo + Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verifyUrl = `${process.env.URL}/.netlify/functions/verify?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: `"Platform Fighter" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <h2>Welcome to Platform Fighter!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyUrl}">Verify your account</a>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Verification email sent!" }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
