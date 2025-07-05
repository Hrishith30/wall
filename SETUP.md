# Facebook Wall Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Wait for the project to initialize
3. Go to SQL Editor and run this SQL:

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text check (char_length(body) <= 280),
  created_at timestamptz default now()
);
```

4. Go to Settings → API and copy:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon Key (starts with: `eyJ...`)

## 2. Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Replace `your_project_url` and `your_anon_key` with the values from step 1.

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** If you don't set these variables, the app will run in demo mode with sample data.

## 3. Run the Application

```bash
npm run dev
```

## 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import your repository
4. Add the same environment variables in Vercel dashboard
5. Deploy!

## Features

- ✅ 2008-style Facebook Wall design
- ✅ Left sidebar with profile information
- ✅ Right side with "What's on your mind?" post creation
- ✅ Photo upload option (UI only)
- ✅ 280 character limit with counter
- ✅ Real-time updates
- ✅ Like, Comment, Share buttons
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling 