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
        const transaction = await prisma.transactions.delete({
            where: { id }
        });
        return NextResponse.json(transaction, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}