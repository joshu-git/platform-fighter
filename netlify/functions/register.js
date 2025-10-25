import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const handler = async (event, context) => {
  try {
    const { username, email, password } = JSON.parse(event.body || "{}");

    // Check for duplicate username
    const usernameExists = await db.select().from(users).where(eq(users.username, username));
    if (usernameExists.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Username already taken" }) };
    }

    // Check for duplicate email
    const emailExists = await db.select().from(users).where(eq(users.email, email));
    if (emailExists.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email already registered" }) };
    }

    // Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username, email, password: hashedPassword, verified: false });

    // Generate verification token (expires in 7 days)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
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

    return { statusCode: 200, body: JSON.stringify({ message: "Verification email sent!" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};