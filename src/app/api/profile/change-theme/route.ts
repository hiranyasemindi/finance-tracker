import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const token = await requireAuth(req)
    if (token instanceof NextResponse) {
        return token;
    }

    const { id: userId } = token as { id: string }
    const body = await req.json()
    const { isDarkMode }: { isDarkMode: boolean } = body;

    try {
        const user = prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isDarkMode: isDarkMode
            }
        })
        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Theme updated successfully" }, { status: 200 })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}