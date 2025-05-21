import NextAuth from "next-auth"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.preferredCurrency = user.preferredCurrency
                token.isDarkMode = user.isDarkMode
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.id = token.id as string
                session.preferredCurrency = token.preferredCurrency as string
                session.isDarkMode = token.isDarkMode as boolean
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)