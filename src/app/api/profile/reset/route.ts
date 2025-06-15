import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await requireAuth(req)
    if (token instanceof NextResponse) {
        return token;
    }

    const { id: userId } = token as { id: string }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }


    try {
        await prisma.$transaction([
            prisma.category.deleteMany({
                where: { userId }
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId }
            })
        ])
        return NextResponse.json({ message: "User data reset successfully." })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}