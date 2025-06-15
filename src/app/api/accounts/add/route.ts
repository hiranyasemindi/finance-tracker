import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) {
        return token;
    }

    const { id: userId } = token as { id: string };
    const body = await request.json();
    const { name, balance, type }: { name: string; balance: number; type: AccountType } = body;

    if (!name || !balance || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const account = await prisma.account.create({
            data: { name, balance, type, userId }
        })
        return NextResponse.json(account, { status: 201 });
    } catch (error: any) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}