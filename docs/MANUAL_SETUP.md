---
📚 [Home](../README.md) | 🐳 [Docker](../README_DOCKER.md) | 🤝 [Contributing](../CONTRIBUTING.md)
---

# Manual Setup Guide

For setting up the ARCG Change Order Management System without Docker.

## Prerequisites
- Node.js 22+ installed
- npm 10.9+
- Supabase account (free tier works)

### Setup Instructions

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Once created, go to Settings > API
3. Copy your project URL and anon key

#### 3. Configure Environment Variables
1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Run Database Migrations
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_sync_schema.sql`
   - `supabase/migrations/003_delay_notice_policies.sql`
   - `supabase/migrations/004_change_order_details.sql`

> Tip: If you have the Supabase CLI installed, you can run `npm run db:push` instead.

#### 5. Configure Authentication
1. In Supabase, open Authentication → Providers → Email
2. Enable Email/Password authentication
3. (Optional) Enable email confirmations for signups
4. Set a Password Recovery redirect URL (e.g. `http://localhost:3000/reset-password`)

#### 6. Configure Storage Buckets
In Supabase Storage create a bucket named `co-images` and mark it as **public**. This is where OCR source images will be stored.

#### 7. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types

### Project Structure
```
/
├── app/              # Next.js app router pages
│   ├── (auth)/      # Authentication pages
│   ├── (app)/       # Protected app pages
│   └── api/         # API routes
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── forms/       # Form components
│   └── features/    # Feature components
├── lib/             # Utilities and configurations
│   └── supabase/    # Supabase client setup
├── types/           # TypeScript type definitions
├── public/          # Static assets
└── supabase/        # Database migrations
```

### Next Steps
1. Test authentication by creating a user
2. Create your first project
3. Add a change order with OCR
4. Generate a PDF

### Troubleshooting
- **Can't connect to Supabase**: Check your environment variables
- **Database errors**: Ensure migrations have been run
- **Build errors**: Run `npm run typecheck` to find type issues

### Support
- See [Architecture Guide](./ARCHITECTURE.md) for system design details
- See [Contributing Guide](../CONTRIBUTING.md) for development workflow
- See [Roadmap](./ROADMAP.md) for feature planning
