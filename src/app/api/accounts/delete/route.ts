import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) {
        return token;
    }
    const body = await request.json();
    const { id }: { id: string } = body;

    if (!id) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Check if account has any transactions
        const transactionCount = await prisma.transactions.count({
            where: { accountId: id }
        });

        if (transactionCount > 0) {
            return NextResponse.json({ 
                error: "Cannot delete this account because it has transactions associated with it. Please delete the transactions first or transfer them to another account.",
                type: "FOREIGN_KEY_CONSTRAINT"
            }, { status: 400 });
        }

        const account = await prisma.account.delete({
            where: { id }
        });
        return NextResponse.json(account, { status: 200 });
    } catch (error: any) {
        // Check if it's a foreign key constraint error
        if (error.code === 'P2003') {
            return NextResponse.json({ 
                error: "This account has transactions associated with it. Please delete them first or transfer them to another account.",
                type: "FOREIGN_KEY_CONSTRAINT"
            }, { status: 400 });
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
