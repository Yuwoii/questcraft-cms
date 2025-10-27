import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Extend the built-in session type to include custom properties
   */
  interface Session {
    accessToken?: string
    user: {
      id: string
    } & DefaultSession['user']
  }

  /**
   * Extend the built-in user type
   */
  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the built-in JWT type
   */
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
  }
}
