import NextAuth from "next-auth"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email,
                    },
                })
                if (!user) {
                    throw new Error("No user found with the given email")
                }
                const isValidPassword = await bcrypt.compare(
                    credentials?.password || "",
                    user.password
                )
                if (!isValidPassword) {
                    throw new Error("Invalid password")
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    preferredCurrency: user.preferredCurrency,
                    isDarkMode: user.isDarkMode,
                    createdAt: user.createdAt
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            if (user) {
                token.id = user.id
                token.preferredCurrency = (user as any).preferredCurrency
                token.isDarkMode = (user as any).isDarkMode
            }

            if (trigger === "signIn" && session?.remember === "false") {
                token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 6 // 6 hours
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                (session as any).id = token.id as string
                (session as any).preferredCurrency = token.preferredCurrency as string
                (session as any).isDarkMode = token.isDarkMode as boolean
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { authOptions as GET, authOptions as POST }