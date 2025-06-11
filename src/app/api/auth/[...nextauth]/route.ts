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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                })

                if (!user) {
                    throw new Error("No user found with the given email")
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
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
                    remember: credentials.remember === 'true' || credentials.remember === true,
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
                session.user.id = token.id
                session.user.preferredCurrency = token.preferredCurrency
                session.user.isDarkMode = token.isDarkMode
                session.expires = new Date(token.exp * 1000).toISOString()
            }
            return session
        },
        async signIn({ user }) {
            console.log(user.remember)
            if (user.remember) {
                authOptions.cookies.sessionToken.options.maxAge = 30 * 24 * 60 * 60 // 30 days
            } else {
                authOptions.cookies.sessionToken.options.maxAge = 24 * 60 * 60 // 1 day
            }
            return true
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }