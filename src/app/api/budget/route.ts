import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await requireAuth(req);
    if (token instanceof NextResponse) {
        return token;
    }

    const { id: userId } = token as { id: string };

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                userId: userId
            }
        })
        return NextResponse.json(budgets, { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}