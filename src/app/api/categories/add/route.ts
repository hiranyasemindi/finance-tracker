import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/types";

export async function POST(request: Request) {
    const body = await request.json();
    const { name, type, color, userId }: { name: string; type: TransactionType, color: string, userId: string } = body;

    if (!name || !type || !color || !userId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error: any) {
        console.error("Error finding user:", error);
        return NextResponse.json({ error: "Error finding user" }, { status: 500 });
    }

    try {
        const category = await prisma.category.create({
            data: { name, type, color, userId }
        })
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}