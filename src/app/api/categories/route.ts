import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    // Authenticate the request
    const token = await requireAuth(req);
    if (token instanceof NextResponse) {
        return token;
    }

    try {
        // Get the authenticated user's ID from the token
        const userId = token.id;

        // Fetch categories only for this user
        const categories = await prisma.category.findMany({
            where: {
                userId: userId
            }
        });

        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}