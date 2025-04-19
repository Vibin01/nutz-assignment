// app/api/auth/register/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, isPublic, userId } = body;

    // console.log("Received data:", body);

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        isPublic: isPublic,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
      },
    });
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
