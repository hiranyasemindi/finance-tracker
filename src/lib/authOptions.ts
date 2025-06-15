import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import type { NextAuthOptions } from "next-auth"
import type { DefaultSession, DefaultUser } from "next-auth"

// Extend NextAuth types to include custom properties
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            preferredCurrency?: string
            isDarkMode?: boolean
        } & DefaultSession["user"]
    }
    interface User extends DefaultUser {
        preferredCurrency?: string
        isDarkMode?: boolean
        remember?: boolean
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember Me", type: "checkbox" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    throw new Error("No user found with the given email")
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password)

                if (!isValidPassword) {
                    throw new Error("Invalid password")
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    preferredCurrency: user.preferredCurrency,
                    isDarkMode: user.isDarkMode,
                    createdAt: user.createdAt,
                    remember: (typeof credentials.remember === 'string' && credentials.remember === 'true') || (typeof credentials.remember === 'boolean' && credentials.remember === true),
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.preferredCurrency = user.preferredCurrency
                token.isDarkMode = user.isDarkMode
                token.remember = user.remember
            }

            if (token.remember) {
                token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                    session.user.id = typeof token.id === "string" ? token.id : String(token.id)
                    session.user.preferredCurrency = typeof token.preferredCurrency === "string" ? token.preferredCurrency : undefined
                    session.user.isDarkMode = typeof token.isDarkMode === "boolean" ? token.isDarkMode : undefined
                    if (typeof token.exp === "number") {
                        session.expires = new Date(token.exp * 1000).toISOString()
                    }
                }
            }
            return session
        },
        async signIn({ user }) {
            if (user.remember) {
                if (authOptions.cookies?.sessionToken?.options) authOptions.cookies.sessionToken.options.maxAge = 30 * 24 * 60 * 60 // 30 days
            } else {
                if (authOptions.cookies?.sessionToken?.options) authOptions.cookies.sessionToken.options.maxAge = 24 * 60 * 60 // 1 day
            }
            return true
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
