import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/types";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = await requireAuth(req)
    if (token instanceof NextResponse) {
        return token
    }

    const { id: userId } = token as { id: string }
    const body = await req.json()
    const { type, amount, date, categoryId, accountId, notes }: { type: TransactionType, amount: number, date: Date, categoryId: number, accountId: number, notes: string } = body

    if (!type || !amount || !date || !categoryId || !accountId || !notes) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 400 })
        }
        const account = await prisma.account.findUnique({
            where: {
                id: accountId
            }
        })
        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 400 })
        }
        const transaction = await prisma.transactions.create({
            data: {
                userId,
                type,
                amount,
                Date: date,
                categoryId,
                accountId,
                note: notes
            }
        })
        if (!transaction) {
            return NextResponse.json({ error: 'Failed to create transaction' }, { status: 400 })
        }
        return NextResponse.json({ message: "Transaction created successfully", transaction }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 })
    }

}