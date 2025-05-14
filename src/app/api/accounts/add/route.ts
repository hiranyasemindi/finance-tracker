import { prisma } from "@/lib/prisma";
import { AccountType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { name, balance, type }: { name: string; balance: number; type: AccountType } = body;

    if (!name || !balance || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const account = await prisma.account.create({
            data: { name, balance, type }
        })
        return NextResponse.json(account, { status: 201 });
    } catch (error: any) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}