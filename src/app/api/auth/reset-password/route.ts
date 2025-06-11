import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const { password, token } = await request.json();

    if (!password || !token) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: {
            token: token,
        },
        include: {
            user: true,
        },
    });

    if (!resetToken) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    if (resetToken.expiresAt < new Date()) {
        await prisma.passwordResetToken.delete({
            where: {
                id: resetToken.id,
            },
        });
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: resetToken.userId,
        },
        data: {
            password: hashedPassword,
        },
    })

    await prisma.passwordResetToken.delete({
        where: {
            id: resetToken.id,
        },
    });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
}