/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add some debugging for environment variables
  env: {
    // These will be available at build time
    CUSTOM_KEY: 'my-value',
  },
  // Add some logging for debugging
  async rewrites() {
    console.log('Environment check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET')
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET')
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET')
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
    return []
  }
}

module.exports = nextConfig