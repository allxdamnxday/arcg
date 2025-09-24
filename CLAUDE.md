---
📚 [Home](./README.md) | 🐳 [Docker](./README_DOCKER.md) | 🤝 [Contributing](./CONTRIBUTING.md)
---

# CLAUDE.md - AI Assistant Guide

This guide helps AI assistants work effectively with the ARCG codebase by providing context, procedures, and live database access.

## 🔌 Supabase MCP Server Access

You have **LIVE access** to the production database through Supabase MCP. Use these tools to get real-time information:

### Essential MCP Tools
- **`mcp__supabase__list_tables`** - Get current table schemas with row counts
- **`mcp__supabase__execute_sql`** - Query data (use read-only for safety)
- **`mcp__supabase__apply_migration`** - Apply DDL changes (CREATE, ALTER, etc.)
- **`mcp__supabase__get_logs`** - Debug issues with service logs
- **`mcp__supabase__get_advisors`** - Check security/performance issues
- **`mcp__supabase__generate_typescript_types`** - Generate fresh TypeScript types

⚠️ **Always check real data before making assumptions about the database state!**

## 🗺️ Codebase Context Index

### Quick Navigation Map
```
/app                        → Next.js 14 App Router
├── (auth)/*               → Public pages (no auth required)
│   ├── login/             → User login
│   ├── register/          → User registration
│   └── reset-password/    → Password recovery
│
├── (app)/*                → Protected pages (auth required)
│   ├── dashboard/         → Main dashboard
│   ├── projects/          → Project CRUD
│   │   ├── page.tsx      → List view
│   │   ├── new/          → Create form
│   │   ├── [id]/         → Detail view
│   │   └── actions.ts    → Server actions
│   ├── change-orders/     → Change order management
│   │   ├── page.tsx      → List view
│   │   ├── new/          → Create with OCR
│   │   ├── [id]/         → Detail + PDF
│   │   └── actions.ts    → Server actions
│   └── delay-notices/     → Delay tracking
│
└── api/                   → API routes
    └── pdf/              → PDF generation endpoint

/components                → React components
├── ui/*                  → shadcn/ui (don't modify directly)
├── features/             → Feature-specific components
│   ├── ocr/
│   │   └── ocr-uploader.tsx    → Tesseract.js integration
│   ├── change-orders/
│   │   ├── line-items-editor.tsx → Dynamic pricing
│   │   └── pdf-download-button.tsx → PDF trigger
│   └── projects/        → Project-specific UI
└── forms/               → Reusable form components

/lib                     → Core utilities
├── supabase/
│   ├── server.ts       → SSR client (Server Components)
│   ├── client.ts       → Browser client (Client Components)
│   ├── actions.ts      → Common server actions
│   └── queries/        → Reusable data fetching
├── validations/        → Zod schemas
│   ├── project.ts
│   ├── change-order.ts
│   └── delay-notice.ts
├── pdf/                → PDF generation
│   └── change-order-template.tsx
└── utils.ts            → Helper functions

/types                  → TypeScript definitions
└── database.ts        → Generated from Supabase
```

## 🔄 Development Procedures

### 1️⃣ Creating a New Feature

```bash
# Step 1: Check current database state
mcp__supabase__list_tables

# Step 2: Create migration if needed
mcp__supabase__apply_migration
  name: "add_feature_table"
  query: "CREATE TABLE ..."

# Step 3: Generate types
mcp__supabase__generate_typescript_types

# Step 4: Create the feature structure
app/(app)/your-feature/
  ├── page.tsx          # Server Component
  ├── actions.ts        # Server Actions
  └── new/page.tsx      # Create form
```

### 2️⃣ Adding a Database Table

```sql
-- Use mcp__supabase__apply_migration
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- your columns
);

-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can manage"
  ON your_table
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER your_table_updated_at
  BEFORE UPDATE ON your_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 3️⃣ Implementing Server Actions

```typescript
// app/(app)/feature/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { yourSchema } from '@/lib/validations/your-feature'

export async function createAction(formData: FormData) {
  const supabase = await createClient()

  // Validate
  const validated = yourSchema.parse(Object.fromEntries(formData))

  // Insert
  const { error } = await supabase
    .from('your_table')
    .insert(validated)

  if (error) throw error

  revalidatePath('/your-feature')
  redirect('/your-feature')
}
```

### 4️⃣ Debugging Production Issues

```bash
# Check recent logs
mcp__supabase__get_logs
  service: "api"  # or "auth", "storage", "postgres"

# Query specific data
mcp__supabase__execute_sql
  query: "SELECT * FROM change_orders WHERE status = 'draft'"

# Check for security issues
mcp__supabase__get_advisors
  type: "security"  # or "performance"
```

## 🏗️ Architecture Patterns

### Data Flow Pattern
```
Server Component → Fetch Data → Props → Client Component → User Interaction → Server Action → Mutation → Revalidate
```

### File Creation Pattern
For each new feature, create:
1. **Page**: `app/(app)/feature/page.tsx` - List view
2. **Actions**: `app/(app)/feature/actions.ts` - CRUD operations
3. **Form**: `app/(app)/feature/new/page.tsx` - Create form
4. **Detail**: `app/(app)/feature/[id]/page.tsx` - View/edit
5. **Validation**: `lib/validations/feature.ts` - Zod schema
6. **Query**: `lib/supabase/queries/feature.ts` - Reusable fetches

## ⚠️ Critical Context

### Database Rules
- **All tables use UUID primary keys** generated by `uuid_generate_v4()`
- **RLS enabled on all tables** - policies require authentication
- **Timestamps** - created_at and updated_at with triggers
- **Foreign keys** cascade on delete where appropriate

### Authentication Flow
- Middleware checks all routes matching `/(app)/*`
- Unauthenticated users redirect to `/login`
- Session stored in HTTP-only cookies via Supabase

### Special Components
- **OCR**: Runs client-side with Tesseract.js, no server processing
- **PDF**: Generated server-side via API route, uses React PDF
- **Real-time**: Supabase channels for live updates

## 🚀 Quick Commands

### Essential Development
```bash
npm run dev          # Start development server
npm run typecheck    # Check TypeScript types
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Docker Development
```bash
make dev            # Start Docker development
make logs           # View container logs
make shell          # Access container shell
make clean          # Clean everything
```

### Database Management
```bash
npm run db:push     # Push migrations (needs Supabase CLI)
npm run db:reset    # Reset database
```

## 📊 Current Database State

Use MCP to check live status:
```typescript
// Check what data exists
mcp__supabase__list_tables  // Shows row counts

// Common queries for context
mcp__supabase__execute_sql
  query: "SELECT COUNT(*) FROM users"
  query: "SELECT * FROM projects LIMIT 10"
  query: "SELECT status, COUNT(*) FROM change_orders GROUP BY status"
```

## 🔍 Where to Look First

When working on:
- **Authentication**: `middleware.ts`, `app/(auth)/*`
- **Database**: `lib/supabase/*`, `types/database.ts`
- **Forms**: `lib/validations/*`, Server Actions in `actions.ts`
- **UI Components**: `components/features/*` (custom), `components/ui/*` (shadcn)
- **Styling**: Tailwind classes, no CSS files
- **Config**: `.env.local`, `next.config.mjs`

## 🎯 Development Best Practices

1. **Check before assuming**: Use MCP to verify database state
2. **Type everything**: Import from `@/types/database`
3. **Validate inputs**: Zod schemas for all forms
4. **Use Server Components**: Default to SSR, 'use client' only when needed
5. **Handle errors**: Try-catch in Server Actions, toast for user feedback
6. **Revalidate paths**: After mutations to update UI

---

For detailed architecture, see [Architecture Guide](./docs/ARCHITECTURE.md). For setup instructions, see [Docker Guide](./README_DOCKER.md) or [Manual Setup](./docs/MANUAL_SETUP.md).