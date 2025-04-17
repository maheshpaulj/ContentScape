// lib/authOptions.ts
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No Profile!");
      }

      try {
        const userRef = doc(db, "users", profile.email);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: profile.email,
            name: profile.name,
            createdAt: new Date().toISOString(),
            generationCount: 0,
          });
          if (typeof window !== "undefined" && analytics) {
            logEvent(analytics, "sign_up", { method: "Google", email: profile.email });
          }
        } else {
          if (typeof window !== "undefined" && analytics) {
            logEvent(analytics, "login", { method: "Google", email: profile.email });
          }
        }
      } catch (error) {
        console.error("Firebase error during signIn:", error);
        throw new Error("Authentication failed due to Firebase issue");
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.email) {
        session.user!.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);