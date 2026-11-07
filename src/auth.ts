import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user || !user.password) {
          console.log('No user found');
          return null;
        }

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);

        if (isMatch) {
          return { id: user.id, email: user.email, name: user.name };
        }
        
        console.log('Invalid password');
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
});
