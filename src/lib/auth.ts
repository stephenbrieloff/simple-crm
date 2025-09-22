import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
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
            const { error: insertError } = await supabase
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
    async session({ session, token }) {
      if (session.user?.email) {
        // Get user ID from database
        const { data: user } = await supabase
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