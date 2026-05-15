import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? 'NST <noreply@nst.se>',
    }),
  ],
  callbacks: {
    signIn({ user }) {
      const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
      return allowedEmails.includes(user.email ?? '')
    },
  },
  pages: {
    signIn: '/admin/login',
    verifyRequest: '/admin/login?verify=1',
  },
})
