import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) return token;

    const userId = (token as { id: string }).id;

    try {
        // Fetch all data in parallel for better performance
        const [categories, accounts, allTransactions, recentTransactions] = await Promise.all([
            prisma.category.findMany({
                where: { userId }
            }),
            prisma.account.findMany({
                where: { userId }
            }),
            prisma.transactions.findMany({
                where: { userId },
                include: {
                    category: true,
                    account: true
                },
                orderBy: { date: 'desc' } // Optional: sort all transactions by date
            }),
            prisma.transactions.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 6,
                include: {
                    category: true,
                    account: true
                }
            })
        ]);

        return NextResponse.json({
            categories,
            accounts,
            transactions: allTransactions, // All transactions
            recentTransactions // Just the 6 most recent
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}