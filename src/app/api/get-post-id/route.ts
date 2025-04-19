import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  // Ensure user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "User not authenticated or user ID missing" },
      { status: 401 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch post data" },
      { status: 500 }
    );
  }
}
