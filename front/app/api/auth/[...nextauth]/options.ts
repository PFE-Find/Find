// app/api/auth/[...nextauth]/options.ts
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from "@/app/lib/db";
import userService from "@/app/services/User";

export const options: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: 0,
                    createdAt: new Date(),
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    role: 0,
                    image: profile.picture,
                    createdAt: new Date(),
                };
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email:", type: "text" },
                password: { label: "Password:", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch("http://127.0.0.1:3001/api/auth/signin/", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) return null;
                   
                    const user = await res.json();
                    return user ? { ...user, id: user._id || user.id || user.user.id || user.user._id} : null;
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true;
           
            
            const userId = user?._id || user?.id;
            if (!userId) return false;
             
            const existingUser = await userService.getUserById(userId);

            return !!existingUser?.emailVerified;
        },

        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    ...user,
                    id: user._id || user.id
                };
            }

            if (token.user?.id) {
                try {
                    const updatedUser = await userService.getUserById(token.user.id);
                    if (updatedUser) {
                        token.user = {
                            ...updatedUser,
                            id: updatedUser._id || updatedUser.id
                        };
                    }
                } catch (error) {
                    console.error("Failed to fetch updated user:", error);
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = {
                    ...token.user,
                    id: token.user._id || token.user.id
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
};