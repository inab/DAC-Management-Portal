import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: "dac-management",
            clientSecret: process.env.KEYCLOAK_DAC_MANAGEMENT_SECRET,
            issuer: process.env.KEYCLOAK_URL_AND_REALM,
            accessTokenUrl: process.env.KEYCLOAK_ACCESS_TOKEN_URL_DEV,
        })
    ],
    session: {
        jwt: true
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            return session
        }
    }
});