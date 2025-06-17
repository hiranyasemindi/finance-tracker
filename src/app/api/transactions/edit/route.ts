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
        const existing = await prisma.transactions.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        const oldMonth = existing.date.toISOString().slice(0, 7);
        const newMonth = transactionDate.toISOString().slice(0, 7);
        const oldBudget = await prisma.budget.findFirst({
            where: { userId, categoryId: existing.categoryId, month: oldMonth }
        });
        const newBudget = await prisma.budget.findFirst({
            where: { userId, categoryId, month: newMonth }
        });


        if (existing.categoryId === categoryId && oldMonth === newMonth && oldBudget) {
            const diff = amount - existing.amount;
            await prisma.budget.update({
                where: { id: oldBudget.id },
                data: { spent: oldBudget.spent + diff }
            });

        } else {
            if (oldBudget) {
                await prisma.budget.update({
                    where: { id: oldBudget.id },
                    data: { spent: Math.max(0, oldBudget.spent - existing.amount) }
                });
            }
            if (newBudget) {
                await prisma.budget.update({
                    where: { id: newBudget.id },
                    data: { spent: newBudget.spent + amount }
                });
            }
        }

        await prisma.transactions.update({
            where: { id },
            data: { type, amount, date: transactionDate, categoryId, accountId, notes }
        });

        return NextResponse.json({ message: "Transaction updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

