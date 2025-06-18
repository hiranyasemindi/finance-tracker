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
        // Get existing transaction with the associated account
        const existing = await prisma.transactions.findUnique({ 
            where: { id },
            include: { account: true }
        });
        if (!existing) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Verify new account exists
        const newAccount = await prisma.account.findUnique({
            where: { id: accountId }
        });
        if (!newAccount) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // Calculate account balance changes
        const oldAmount = existing.amount;
        const newAmount = amount;
        const oldType = existing.type;
        const newType = type as TransactionType;
        const oldAccountId = existing.accountId;
        const isSameAccount = oldAccountId === accountId;

        // Start a transaction for all database operations
        const result = await prisma.$transaction(async (prisma) => {
            // Handle budget updates
            const oldMonth = existing.date.toISOString().slice(0, 7);
            const newMonth = transactionDate.toISOString().slice(0, 7);
            const oldBudget = await prisma.budget.findFirst({
                where: { userId, categoryId: existing.categoryId, month: oldMonth }
            });
            const newBudget = await prisma.budget.findFirst({
                where: { userId, categoryId, month: newMonth }
            });

            if (existing.categoryId === categoryId && oldMonth === newMonth && oldBudget) {
                const diff = (newType === 'expense' ? newAmount : 0) - (oldType === 'expense' ? oldAmount : 0);
                await prisma.budget.update({
                    where: { id: oldBudget.id },
                    data: { spent: oldBudget.spent + diff }
                });
            } else {
                if (oldBudget && oldType === 'expense') {
                    await prisma.budget.update({
                        where: { id: oldBudget.id },
                        data: { spent: Math.max(0, oldBudget.spent - oldAmount) }
                    });
                }
                if (newBudget && newType === 'expense') {
                    await prisma.budget.update({
                        where: { id: newBudget.id },
                        data: { spent: newBudget.spent + newAmount }
                    });
                }
            }

            // Handle account balance updates
            if (isSameAccount) {
                // Same account, adjust balance based on type changes
                let balanceChange = 0;
                
                if (oldType === 'income' && newType === 'income') {
                    balanceChange = newAmount - oldAmount;
                } else if (oldType === 'income' && newType === 'expense') {
                    balanceChange = -oldAmount - newAmount;
                } else if (oldType === 'expense' && newType === 'income') {
                    balanceChange = oldAmount + newAmount;
                } else if (oldType === 'expense' && newType === 'expense') {
                    balanceChange = oldAmount - newAmount;
                }

                await prisma.account.update({
                    where: { id: accountId },
                    data: { balance: newAccount.balance + balanceChange }
                });
            } else {
                // Different accounts, revert old account and update new account
                // Revert old account
                const oldAccountChange = oldType === 'income' ? -oldAmount : oldAmount;
                await prisma.account.update({
                    where: { id: oldAccountId },
                    data: { balance: { increment: oldAccountChange } }
                });

                // Update new account
                const newAccountChange = newType === 'income' ? newAmount : -newAmount;
                await prisma.account.update({
                    where: { id: accountId },
                    data: { balance: { increment: newAccountChange } }
                });
            }

            // Update the transaction
            return await prisma.transactions.update({
                where: { id },
                data: { type, amount, date: transactionDate, categoryId, accountId, notes }
            });
        });

        return NextResponse.json({ 
            message: "Transaction updated successfully",
            transaction: result
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}