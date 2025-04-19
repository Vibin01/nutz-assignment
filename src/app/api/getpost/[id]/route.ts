import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();

  try {
    const posts = await prisma.post.findMany({
      where: { userId: session?.user?.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts, { status: 200 }); // ✅ returns an array
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch post data" },
      { status: 500 }
    );
  }
}
