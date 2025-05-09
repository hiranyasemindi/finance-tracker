import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/types";

export async function POST(request: Request){
    const body = await request.json();
    const {name, type, color} : {name: string; type: TransactionType, color: string} = body;

    if(!name || !type || !color){
        return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    try {
        const category = await prisma.category.create({
            data: {name, type, color}
        })
        return NextResponse.json(category, {status: 201});
    }catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}