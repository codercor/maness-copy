import NextAuth from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "GOOGLE_CLIENT_SECRET",
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID ?? "APPLE_CLIENT_ID",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "APPLE_CLIENT_SECRET",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export { handler as GET, handler as POST };
