import type { NextAuthOptions } from "next-auth";
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "text",
                },
                password: {
                    label: "Password:",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const res = await fetch("http://127.0.0.1:3001/api/auth/signin/", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()

                // If no error and we have user data, return it
                if (res.ok && user) {
                    console.log(user);
                    
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        //decode  encode methods in work still 
      },
    pages: {
        signIn: '/signin',

    }
}