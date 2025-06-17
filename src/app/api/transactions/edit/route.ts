import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) return token;

    const { id, type, amount, date, categoryId, accountId, notes } = await request.json();

    if (!id || !type || !amount || !date || !categoryId || !accountId || !notes) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const transactionDate = new Date(date);
    const userId = (token as { id: string }).id;

    try {
        const existingTransaction = await prisma.transactions.findUnique({ where: { id } });
        if (!existingTransaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // 2️⃣ find old and new budgets
        const oldMonth = existingTransaction.date.toISOString().slice(0, 7);
        const newMonth = transactionDate.toISOString().slice(0, 7);
        const oldBudget = await prisma.budget.findFirst({
            where: { userId, categoryId: existingTransaction.categoryId, month: oldMonth }
        });
        const newBudget = await prisma.budget.findFirst({
            where: { userId, categoryId, month: newMonth }
        });

        await prisma.$transaction([
            ...(oldBudget ? [prisma.budget.update({
                where: { id: oldBudget.id },
                data: { spent: Math.max(0, oldBudget.spent - existingTransaction.amount) }
            })] : [])
            ,
            // Update transaction
            prisma.transactions.update({
                where: { id },
                data: { type, amount, date: transactionDate, categoryId, accountId, notes }
            })
            ,
            // Add to new
            ...(newBudget ? [prisma.budget.update({
                where: { id: newBudget.id },
                data: { spent: newBudget.spent + amount }
            })] : [])
        ]);

        return NextResponse.json({ message: "Transaction updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
