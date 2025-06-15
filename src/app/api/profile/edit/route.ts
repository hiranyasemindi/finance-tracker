import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = await requireAuth(req)
    if (token instanceof NextResponse) {
        return token;
    }

    const { id: userId } = token as { id: string }
    const body = await req.json()
    const { name }: { name: string } = body;

    try {

        const user = await prisma.user.update({
            where: { id: userId },
            data: { name }
        })
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 40 }
            )
        }
        return NextResponse.json({ message: "User Name updated successfully" }, { status: 200 })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}


