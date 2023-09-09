import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// GRAPHQL API - APPLOLO
import { DocumentNode, gql } from "@apollo/client";
import { getClient } from "@/lib/client";

const mutation: DocumentNode = gql`
  mutation login($username: String!, $password: String!) {
    tokenAuth(phoneNumber: $username, password: $password) {
      token
      refreshExpiresIn
      payload
    }
  }
`;

const query: DocumentNode = gql`
  query ME {
    me {
      id
      fullName
      email
      phoneNumber
    }
  }
`;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Phone Number",
          type: "text",
          placeholder: "+919876543210",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        const { data: auth_token } = await getClient().mutate({
          mutation,
          variables: credentials,
        });
        if (auth_token?.tokenAuth?.token) {
          const { data: userdata, error } = await getClient().query({
            query,
            context: {
              headers: {
                Authorization: `JWT ${auth_token.tokenAuth.token}`,
              },
            },
          });
          if(error) console.error(error);
          return { ...auth_token.tokenAuth, ...userdata?.me };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // error: '/login', // Error code passed in query string as ?error=
    newUser: "/learn", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
