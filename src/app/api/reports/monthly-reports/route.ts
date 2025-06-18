import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await requireAuth(req);
    // if (token instanceof NextResponse) {
    //     return token;
    // }

    const { id: userId } = token as { id: string };

    const result = await prisma.$queryRawUnsafe(`
        SELECT 
        TO_CHAR(t.date, 'FMMonth YYYY') AS month, 
        c.id AS category_id,
        c.name AS category_name,
        c.type AS category_type,
        SUM(t.amount) AS total
        FROM "Transactions" t
        INNER JOIN "Category" c ON t."categoryId" = c.id
        WHERE t."userId"=$1 AND date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY month,c.id,c.name,c.type
        ORDER BY month DESC;`, userId)

    const monthlyMap = new Map();

    for (const row of result as any[]) {
        const month = row.month;

        if (!monthlyMap.has(month)) {
            monthlyMap.set(month, {
                month,
                totalIncome: 0,
                totalExpense: 0,
                categories: []
            })
        }

        const entry = monthlyMap.get(month);
        const amount = parseFloat(row.total);
        if (row.category_type === 'income') {
            entry.totalIncome += amount;
        } else {
            entry.totalExpense += amount;
        }

        entry.categories.push({
            id: row.category_id,
            name: row.category_name,
            type: row.category_type,
            amount,
        });
    }

    const reports = Array.from(monthlyMap.values());
    return NextResponse.json(reports);
}