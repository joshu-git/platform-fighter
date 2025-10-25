import { HandlerEvent, HandlerContext } from "@netlify/functions";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { username, email, password } = JSON.parse(event.body || "{}");

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email already registered" }) };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username, email, password: hashedPassword, verified: false });

    // Generate verification token (expires in 7 days)
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    const verifyUrl = `${process.env.URL}/.netlify/functions/verify?token=${token}`;

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Platform Fighter" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <h2>Welcome to Platform Fighter!</h2>
        <p>Click below to verify your email (expires in 7 days):</p>
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