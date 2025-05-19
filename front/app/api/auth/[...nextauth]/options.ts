import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import userService from "@/app/services/User";
import { log } from "console";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import client from "@/app/lib/db";
import clientPromise from "@/app/lib/db";
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
                    role: 0, // Default role
                    createdAt: new Date(), // Current timestamp
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
                    role: 0, // Default role
                    image: profile.picture,
                    createdAt: new Date(), // Current timestamp
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

                    if (!res.ok) {
                        console.error("Failed to log in:", res.statusText);
                        return null;
                    }

                    const user = await res.json();

                    if (user) {

                        return user;
                    }

                    return null;
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
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user,trigger }) {
            
            
              if (user) {
                token.user = user;
            }

            // Always fetch updated user data from DB on subsequent requests
            const id = token?.user?.id ||token?.user?._id
            
            if (id) {
                try {
                    
                    
                    const updatedUser = await userService.getUserById(id);
                   
                    
                    if (updatedUser) {
                        token.user = updatedUser;
                    }
                } catch (error) {
                    console.error("Failed to fetch updated user:", error);
                }
            }
            if (trigger === "update") {
                
                
                try {
                    
                    const updatedUser = await userService.getUserById(id);
                   
                    
                    if (updatedUser) {
                        token.user = updatedUser;
                    }
                } catch (error) {
                    console.error("Failed to fetch updated user:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token?.user) {
                session.user = token.user;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
};