import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  // Use JWT strategy instead of database sessions to store OAuth tokens
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request Google Drive API access
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Save the access token and refresh token to the JWT on the initial login
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      // Add user ID to token on first sign in
      if (user) {
        token.id = user.id
      }
      
      // Auto-refresh token if expiring soon
      const now = Math.floor(Date.now() / 1000)
      if (token.expiresAt && typeof token.expiresAt === 'number' && now >= token.expiresAt - 300) {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              refresh_token: token.refreshToken as string,
              grant_type: 'refresh_token',
            }),
          })
          
          if (response.ok) {
            const refreshedTokens = await response.json()
            token.accessToken = refreshedTokens.access_token
            token.expiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in
          }
        } catch (error) {
          console.error('Error refreshing token:', error)
        }
      }
      
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        // Pass user ID and access token to the session
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
}
