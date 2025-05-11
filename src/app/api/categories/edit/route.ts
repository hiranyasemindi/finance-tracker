import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { id, name, type, color }: { id: number; name: string; type: TransactionType; color: string } = body;

    if (!id || !name || !type || !color) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const category = await prisma.category.update({
            where: { id },
            data: { name, type, color }
        });
        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}