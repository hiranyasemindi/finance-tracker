import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "If an account exists with this email, a reset link has been sent" }, { status: 404 });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prisma.passwordResetToken.upsert({
        where: {
            userId: user.id,
        },
        create: {
            token,
            userId: user.id,
            expiresAt,
        },
        update: {
            token,
            expiresAt,
        },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    //send mail
    const response = await sendPasswordResetEmail(email, resetLink) as any;
    console.log(response);
    if (!response) {
        return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password reset link sent to your email" }, { status: 200 });
}