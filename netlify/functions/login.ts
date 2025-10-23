import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { username, password } = JSON.parse(event.body || "{}");

    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length === 0)
      return { statusCode: 400, body: JSON.stringify({ error: "User not found" }) };

    const user = existing[0];
    if (!user.verified)
      return { statusCode: 401, body: JSON.stringify({ error: "Email not verified" }) };

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ token, user: { username: user.username, wins: user.wins, losses: user.losses } }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
