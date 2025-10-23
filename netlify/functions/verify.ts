import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  const email = event.queryStringParameters!.email;
  if (!email) return { statusCode: 400, body: "Missing email" };

  await db.update(users).set({ verified: true }).where(eq(users.email, email));
  return { statusCode: 200, body: "Account verified! You can now log in." };
};
