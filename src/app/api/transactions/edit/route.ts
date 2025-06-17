import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) {
        return token;
    }

    const body = await request.json();
    const { id, type, amount, date, categoryId, accountId, notes }: { id: string, type: TransactionType, amount: number, date: Date, categoryId: string, accountId: string, notes: string } = body;
    if (!id || !type || !amount || !date || !categoryId || !accountId || !notes) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const transactionDate = new Date(date);
    try {
        const transaction = await prisma.transactions.findUnique({
            where: { id },
        })

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }
        const account = await prisma.transactions.update({
            where: { id },
            data: {
                type,
                amount,
                date: transactionDate,
                categoryId,
                accountId,
                notes,
            },
        });
        return NextResponse.json(account, { status: 200 });
    } catch (error: any) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}