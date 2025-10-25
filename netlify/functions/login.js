const { db } = require("../../db");
const { users } = require("../../db/schema");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.handler = async function (event, context) {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing request body" }) };
    }

    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: "Username and password required" }) };
    }

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.username, username));
    if (!existing || existing.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "User not found" }) };
    }

    const user = existing[0];

    // Check if email verified
    if (!user.verified) {
      return { statusCode: 401, body: JSON.stringify({ error: "Email not verified" }) };
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: { username: user.username, wins: user.wins, losses: user.losses },
      }),
    };
  } catch (err) {
    console.error("Login error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};