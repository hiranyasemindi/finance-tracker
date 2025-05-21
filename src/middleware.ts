import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET
export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret });

    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    if (isAuth && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    const protectedPaths = ['/dashboard', '/api/protected']

    const isProtected = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )

    if (!isAuth && isProtected) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()

}

export const config = {
    matcher: ['/:path*', '/api/protected/:path*', '/auth/:path*'],
}