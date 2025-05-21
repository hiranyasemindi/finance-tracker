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
                remember: { label: "Remember Me", type: "checkbox" },
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
                    createdAt: user.createdAt,
                    remember: credentials?.remember === 'true',
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // seconds for testing (you might want to use 30 * 24 * 60 * 60 for 30 days)
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.preferredCurrency = user.preferredCurrency
                token.isDarkMode = user.isDarkMode
                token.remember = user.remember
            }

            if (token.remember === true) {
                token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.preferredCurrency = token.preferredCurrency
                session.user.isDarkMode = token.isDarkMode
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

// ✅ Export the handlers for GET and POST requests
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
