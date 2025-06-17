import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) {
        return token;
    }

    const body = await request.json();
    const { id, name, balance, type }: { name: string; balance: number; type: AccountType; id: string; } = body;
    if (!id || !name || !balance || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const acc = await prisma.account.findUnique({
            where: { id },
        })

        if (!acc) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }
        const account = await prisma.account.update({
            where: { id },
            data: {
                name,
                balance,
                type,
            },
        });
        return NextResponse.json(account, { status: 200 });
    } catch (error: any) {
        console.error("Error updating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}