import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { token } = JSON.parse(event.body || "{}");

    if (!token) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing refresh token" }) };
    }

    // Verify using REFRESH secret
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: number };

    // Find the user by ID
    const existing = await db.select().from(users).where(eq(users.id, decoded.id));
    if (!existing || existing.length === 0) {
      return { statusCode: 401, body: JSON.stringify({ error: "User not found" }) };
    }

    const user = existing[0];
    if (!user.verified) {
      return { statusCode: 403, body: JSON.stringify({ error: "User not verified" }) };
    }

    // Generate a fresh access token
    const newToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!, // Access token secret
      { expiresIn: "365d" } // 1 year lifespan
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ token: newToken }),
    };
  } catch (err: any) {
    console.error("Refresh token error:", err);
    const message =
      err.name === "TokenExpiredError"
        ? "Refresh token expired"
        : "Invalid refresh token";
    return { statusCode: 401, body: JSON.stringify({ error: message }) };
  }
};