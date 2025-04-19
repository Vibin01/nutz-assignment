import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, newPassword } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Compare with last 3 passwords
    const lastPasswords = user.passwordHistory.slice(-3); // get last 3
    const isReused = await Promise.any(
      lastPasswords.map(async (oldHash) => {
        return await bcrypt.compare(newPassword, oldHash);
      })
    ).catch(() => false); // catch if none match

    if (isReused) {
      return NextResponse.json(
        { message: "You cannot re-use your last 3 passwords." },
        { status: 400 }
      );
    }

    // Update password and add to history
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordHistory: {
          push: hashedPassword,
        },
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
