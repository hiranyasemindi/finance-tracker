import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const body = await request.json();
    const { id }: { id: string } = body;

    if (!id) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Check if category has any transactions
        const transactionCount = await prisma.transactions.count({
            where: { categoryId: id }
        });

        // Check if category has any budgets
        const budgetCount = await prisma.budget.count({
            where: { categoryId: id }
        });

        if (transactionCount > 0 || budgetCount > 0) {
            let errorMessage = "Cannot delete this category because it has ";
            
            if (transactionCount > 0 && budgetCount > 0) {
                errorMessage += "transactions and budgets associated with it. Please delete those first.";
            } else if (transactionCount > 0) {
                errorMessage += "transactions associated with it. Please delete or reassign these transactions first.";
            } else {
                errorMessage += "budgets associated with it. Please delete or reassign these budgets first.";
            }
            
            return NextResponse.json({ 
                error: errorMessage,
                type: "FOREIGN_KEY_CONSTRAINT",
                hasTransactions: transactionCount > 0,
                hasBudgets: budgetCount > 0
            }, { status: 400 });
        }

        const category = await prisma.category.delete({
            where: { id }
        });
        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        // Check if it's a foreign key constraint error
        if (error.code === 'P2003') {
            return NextResponse.json({ 
                error: "This category has related transactions or budgets. Please delete those first.",
                type: "FOREIGN_KEY_CONSTRAINT"
            }, { status: 400 });
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
