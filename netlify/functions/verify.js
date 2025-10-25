import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const handler = async (event, context) => {
  try {
    const token = event.queryStringParameters?.token;
    if (!token) return { statusCode: 400, body: "Missing token" };

    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return { statusCode: 404, body: "User not found" };
    }

    // Mark the user as verified
    await db.update(users).set({ verified: true }).where(eq(users.email, email));

    // Generate auth token (1 year) and refresh token (30 days)
    const authToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
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