import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const token = event.queryStringParameters?.token;
    if (!token) return { statusCode: 400, body: "Missing token" };

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const email = decoded.email;

    await db.update(users).set({ verified: true }).where(eq(users.email, email));

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `
        <html>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h2>Email verified!</h2>
            <p>You can now log in to your account.</p>
            <a href="${process.env.SITE_URL}" style="color: blue;">Return to Platform Fighter</a>
          </body>
        </html>
      `,
    };
  } catch (err) {
    console.error("Verify error:", err);
    return { statusCode: 400, body: "Invalid or expired verification link." };
  }
};

