# Simple CRM

The most basic CRM in the world! Add people's names and view your contact list.

## Features

- ✅ Add people by name
- ✅ View list of all added people
- ✅ Responsive design with dark/light mode support
- ✅ Built with Next.js, TypeScript, and Tailwind CSS
- ✅ Powered by Supabase database

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account
- A Vercel account (for deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd simple-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor

4. **Configure environment variables**
   - Copy `.env.local` and update with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Database Schema

The app uses a simple `people` table with the following structure:

- `id` (bigint, primary key, auto-increment)
- `name` (text, required)
- `created_at` (timestamp with time zone, default: now())

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

The app is now ready for production use.

## API Endpoints

- `GET /api/people` - Fetch all people
- `POST /api/people` - Add a new person

## License

MIT
