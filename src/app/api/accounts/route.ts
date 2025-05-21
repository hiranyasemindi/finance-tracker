import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const accounts = await prisma.account.findMany();
        return NextResponse.json(accounts, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching accounts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}