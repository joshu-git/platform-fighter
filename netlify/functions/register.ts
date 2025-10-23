import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

 export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { username, email, password } = JSON.parse(event.body!);

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email already registered" }) };
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({ username, email, password: hashed }).returning();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or Mailgun/SendGrid
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const verifyUrl = `${process.env.URL}/.netlify/functions/verify?email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      to: email,
      from: process.env.SMTP_USER,
      subject: "Verify your account",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`,
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Verification email sent" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};


