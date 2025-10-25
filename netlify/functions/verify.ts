import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const token = event.queryStringParameters?.token;
    if (!token) return { statusCode: 400, body: "Missing token" };

    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const email = decoded.email;

    // Update the user to verified
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return { statusCode: 404, body: "User not found" };
    }

    await db.update(users).set({ verified: true }).where(eq(users.email, email));

    // Automatically generate auth token (1 year) and refresh token (30 days)
    const authToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "365d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "30d" }
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Email verified! You are now logged in.",
        token: authToken,
        refreshToken,
        user: { username: user.username, wins: user.wins, losses: user.losses },
      }),
    };
  } catch (err) {
    console.error("Verify error:", err);
    return { statusCode: 400, body: "Invalid or expired verification link." };
  }
};