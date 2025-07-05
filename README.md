# Facebook Wall - 2008 Style

A nostalgic recreation of the classic Facebook Wall from 2008, built with modern React technologies.

## Features

- 🎨 **2008 Facebook Design**: Authentic retro styling with blue header and clean layout
- 👤 **Profile Sidebar**: Left sidebar with user profile information and friends list
- ✍️ **Post Creation**: "What's on your mind?" textarea with 280 character limit
- 📸 **Photo Upload**: UI for photo upload functionality (visual only)
- ⚡ **Real-time Updates**: Live feed updates without page refresh
- 💬 **Social Actions**: Like, Comment, and Share buttons
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Loading States**: Smooth loading indicators
- ⚠️ **Error Handling**: User-friendly error messages
- ⌨️ **Keyboard Shortcuts**: Press Enter to post (Shift+Enter for new line)

## Tech Stack

- **Frontend**: React 19 + Next.js 15
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com/)
   - Run the SQL from `SETUP.md`
   - Get your API keys

4. **Configure environment variables**
   ```bash
   # Create .env.local file with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text check (char_length(body) <= 280),
  created_at timestamptz default now()
);
```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Main Facebook Wall component
├── components/
│   └── LoadingSpinner.tsx
└── lib/
    ├── supabase.ts       # Supabase client configuration
    └── utils.ts          # Utility functions
```

## Contributing

This is a test project for demonstrating modern React development with a nostalgic twist. Feel free to fork and experiment!

## License

MIT License - feel free to use this code for your own projects.
