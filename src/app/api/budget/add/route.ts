import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = await requireAuth(req);
    if (token instanceof NextResponse) {
        return token;
    }
    const { id: userId } = token as { id: string };
    const { categoryId, amount, month } = await req.json();

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 1. Determine start and end of the specified month
        const { start, end } = getStartAndEndOfMonth(month);
        console.log(start, end);

        // 2. Retrieve transactions for this user, this category, within this range
        const transactions = await prisma.transactions.findMany({
            where: {
                userId,
                categoryId,
                date: { gte: start, lte: end }
            }
        });

        // 3. If transactions exist, sum their amounts
        const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
        console.log(totalSpent);

        // 4. Prepare the data to create the budget
        const budget = await prisma.budget.create({
            data: {
                categoryId,
                amount,
                month,
                userId,
                spent: transactions.length > 0 ? totalSpent : 0
            }
        });

        if (!budget) {
            return NextResponse.json({ error: "Error creating budget" }, { status: 500 });
        }
        return NextResponse.json({ budget }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating budget:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

function getStartAndEndOfMonth(month: string) {
    const [year, mon] = month.split("-").map(Number);
    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 0, 23, 59, 59, 999);
    return { start, end };
}
