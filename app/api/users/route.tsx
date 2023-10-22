import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, receipes } from "@/db/schema";

export async function POST(request: Request) {
  const data: { description: string } = await request.json();
  const session: { user: { email: string } } | null = await getServerSession(authOptions);

  const userId: { id: string }[] = await db.selectDistinct({ id: users.id }).from(users).where(eq(users.email, session?.user.email!));

  await db.insert(receipes).values({
    userId: userId[0].id,
    description: data.description,
    createdAt: new Date(),
  });

  return Response.json(data);
}
