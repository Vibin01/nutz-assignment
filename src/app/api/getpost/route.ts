// app/api/auth/register/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const post = await prisma.post.findMany();

    return NextResponse.json(post);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
