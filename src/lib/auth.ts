import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable')
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === 'google' && user.email && supabaseAdmin) {
        try {
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single()

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking user:', fetchError)
            return false
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const { error: insertError } = await supabaseAdmin
              .from('users')
              .insert([{
                email: user.email,
                name: user.name,
                google_id: user.id,
                image: user.image,
              }])

            if (insertError) {
              console.error('Error creating user:', insertError)
              return false
            }
          }

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return false
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session }: { session: any }) {
      if (session.user?.email && supabaseAdmin) {
        // Get user ID from database
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (user) {
          session.user.id = user.id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}