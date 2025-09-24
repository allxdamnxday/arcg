# ARCG Change Order Management System
## Simplified Project Guide for Small Teams

---

## 🎯 Project Overview

A straightforward, mobile-first web app for managing construction change orders with photo OCR, PDF generation, and real-time updates. Built for small construction companies (<10 users).

### Philosophy: Keep It Simple
- ✅ One database (Supabase)
- ✅ One framework (Next.js 14)
- ✅ One UI library (shadcn/ui)
- ✅ Minimal dependencies
- ✅ AI-agent friendly
- ✅ Production-ready from day one

---

## 🛠 Minimal Tech Stack

### Core Dependencies Only
```json
{
  "dependencies": {
    // Core Framework
    "next": "14.2.13",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "typescript": "5.6.2",
    
    // Database & Auth (Supabase handles everything)
    "@supabase/ssr": "0.5.1",
    "@supabase/supabase-js": "2.45.4",
    
    // UI Components (shadcn/ui base)
    "@radix-ui/react-dialog": "1.1.1",
    "@radix-ui/react-dropdown-menu": "2.1.1",
    "@radix-ui/react-select": "2.1.1",
    "@radix-ui/react-tabs": "1.1.0",
    "@radix-ui/react-toast": "1.2.1",
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.2",
    
    // Forms & Validation
    "react-hook-form": "7.53.0",
    "zod": "3.23.8",
    "@hookform/resolvers": "3.9.0",
    
    // OCR (free, runs in browser)
    "tesseract.js": "5.1.0",
    
    // PDF Generation
    "@react-pdf/renderer": "3.4.4",
    
    // File Upload
    "react-dropzone": "14.2.3",
    
    // Date Handling
    "date-fns": "3.6.0",
    
    // Icons
    "lucide-react": "0.441.0"
  },
  "devDependencies": {
    "@types/node": "22.5.5",
    "@types/react": "18.3.8",
    "@types/react-dom": "18.3.0",
    "supabase": "1.191.3",
    "tailwindcss": "3.4.12",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.47",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.13",
    "prettier": "3.3.3"
  }
}
```

---

## 📁 Simple Project Structure

```
arcg-change-orders/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          # Protected layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── projects/
│   │   │   ├── page.tsx        # Projects list
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Project detail
│   │   └── change-orders/
│   │       ├── page.tsx        # CO list
│   │       ├── new/
│   │       │   └── page.tsx    # New CO form
│   │       └── [id]/
│   │           └── page.tsx    # CO detail
│   ├── api/
│   │   ├── ocr/
│   │   │   └── route.ts        # OCR processing
│   │   └── pdf/
│   │       └── route.ts        # PDF generation
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── forms/
│   │   ├── change-order-form.tsx
│   │   └── project-form.tsx
│   └── features/
│       ├── ocr-uploader.tsx
│       └── pdf-viewer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries.ts         # Typed queries
│   ├── ocr.ts                 # OCR logic
│   ├── pdf.ts                 # PDF templates
│   └── utils.ts               # Helper functions
├── types/
│   └── supabase.ts            # Generated DB types
├── public/
│   └── (images, fonts)
├── supabase/
│   └── migrations/
│       └── 001_schema.sql
├── middleware.ts
├── .env.local
└── package.json
```

---

## 🗄 Database Schema (Simplified)

```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Basic Enums
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE co_status AS ENUM ('draft', 'pending', 'approved');

-- Users (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_number VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  address TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change Orders
CREATE TABLE change_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  co_number VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cost_impact DECIMAL(12, 2),
  time_impact_days INTEGER,
  status co_status DEFAULT 'draft',
  
  -- OCR fields
  original_image_url TEXT,
  ocr_text TEXT,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Line Items
CREATE TABLE change_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  change_order_id UUID REFERENCES change_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(12, 2)
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  change_order_id UUID REFERENCES change_orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_change_orders_project ON change_orders(project_id);
CREATE INDEX idx_change_orders_status ON change_orders(status);

-- RLS Policies (everyone in company can see everything)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can do everything" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can do everything" ON change_orders
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER change_orders_updated_at BEFORE UPDATE ON change_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 🔐 Simple Authentication

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 🎯 Core Features Implementation

### 1. OCR Upload (Simple)
```tsx
// components/features/ocr-uploader.tsx
'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Tesseract from 'tesseract.js'

export function OCRUploader({ onExtracted }: { onExtracted: (text: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]
      if (!file) return

      setLoading(true)
      
      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100))
            }
          }
        })
        
        onExtracted(result.data.text)
      } catch (error) {
        console.error('OCR failed:', error)
      } finally {
        setLoading(false)
        setProgress(0)
      }
    }
  })

  return (
    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer">
      <input {...getInputProps()} />
      {loading ? (
        <div>Processing... {progress}%</div>
      ) : (
        <div>
          <p>Drag & drop a change order photo here</p>
          <p className="text-sm text-gray-500 mt-2">or click to select</p>
        </div>
      )}
    </div>
  )
}
```

### 2. PDF Generation (Simple)
```tsx
// lib/pdf.ts
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  field: { fontSize: 12, marginBottom: 10 },
})

export async function generateChangeOrderPDF(data: any) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Change Order #{data.co_number}</Text>
        <Text style={styles.field}>Project: {data.project_name}</Text>
        <Text style={styles.field}>Description: {data.description}</Text>
        <Text style={styles.field}>Cost Impact: ${data.cost_impact}</Text>
        <Text style={styles.field}>Time Impact: {data.time_impact_days} days</Text>
      </Page>
    </Document>
  )
  
  return await pdf(doc).toBlob()
}

// app/api/pdf/route.ts
import { NextResponse } from 'next/server'
import { generateChangeOrderPDF } from '@/lib/pdf'

export async function POST(request: Request) {
  const data = await request.json()
  const pdfBlob = await generateChangeOrderPDF(data)
  
  return new NextResponse(pdfBlob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="CO-${data.co_number}.pdf"`
    }
  })
}
```

### 3. Server Actions (No API Routes Needed)
```typescript
// app/(app)/change-orders/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChangeOrder(formData: FormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('change_orders')
    .insert({
      project_id: formData.get('project_id'),
      co_number: formData.get('co_number'),
      title: formData.get('title'),
      description: formData.get('description'),
      cost_impact: parseFloat(formData.get('cost_impact') as string) || 0,
      time_impact_days: parseInt(formData.get('time_impact_days') as string) || 0,
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/change-orders')
  return data
}
```

---

## 🚀 Development Phases (Simplified)

### Phase 1: Foundation (3 days)
```bash
# Setup
npx create-next-app@latest arcg-change-orders --typescript --tailwind --app
cd arcg-change-orders
npm install @supabase/ssr @supabase/supabase-js
npx shadcn-ui@latest init

# Create database
# 1. Go to supabase.com
# 2. Create new project
# 3. Run migration SQL
# 4. Copy environment variables
```

### Phase 2: Core Features (1 week)
1. **Auth Pages** - Login/Register with Supabase Auth
2. **Projects CRUD** - List, Create, View projects
3. **Change Orders CRUD** - List, Create, View, Edit COs
4. **Basic Dashboard** - Count of projects and COs

### Phase 3: OCR & PDF (3 days)
1. **OCR Upload** - Tesseract.js integration
2. **PDF Generation** - React PDF for documents
3. **File Storage** - Supabase Storage for images/PDFs

### Phase 4: Polish (2 days)
1. **Mobile Responsive** - Test on phones/tablets
2. **Error Handling** - User-friendly error messages
3. **Loading States** - Skeleton screens
4. **Deploy** - Push to Vercel

---

## 🔧 Environment Variables

```bash
# .env.local (that's it!)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 🚢 Deployment (5 minutes)

```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Add environment variables in Vercel dashboard
# Done!
```

---

## 📊 What "Good Enough" Looks Like

For a small construction company:

### Must Have ✅
- Login/logout
- Create/edit change orders
- Upload photos for OCR
- Generate PDF documents
- Mobile-friendly

### Nice to Have 🎯
- Search/filter
- Email notifications
- Approval workflow
- Cost summaries

### Don't Need ❌
- Real-time collaboration
- Complex permissions
- Analytics dashboards
- API for external systems
- Offline mode

---

## 💡 Pro Tips for Small Teams

1. **Start Manual**: Don't automate everything day 1
2. **Use Supabase Dashboard**: Great for data fixes
3. **Simple Backups**: Download CSV from Supabase weekly
4. **Email Later**: Start with in-app notifications only
5. **No User Roles**: Everyone sees everything (it's fine for <10 users)
6. **Use Vercel**: Free tier handles everything you need
7. **Skip Testing**: With <10 users, manual testing is faster
8. **One Environment**: No staging needed yet

---

## 🎯 Success Metrics

You've succeeded when:
- ✅ Team stops using paper change orders
- ✅ Can find any CO in <10 seconds
- ✅ PDFs generate correctly
- ✅ Works on phones
- ✅ No one asks for training

---

## 🚦 Go-Live Checklist

### Before Launch (1 hour)
- [ ] Test login/logout
- [ ] Create a real change order
- [ ] Generate a PDF
- [ ] Test on iPhone and Android
- [ ] Set up Supabase email templates
- [ ] Add your domain to Vercel

### Launch Day
- [ ] Add all team members as users
- [ ] Create first real project
- [ ] Process one real change order
- [ ] Save PDF to computer
- [ ] Celebrate! 🎉

---

## 📈 Future Growth Path

When you hit these milestones, consider adding:

**At 10+ users**: Add role-based permissions
**At 50+ COs/month**: Add search and filters
**At 100+ COs**: Add analytics dashboard


---

## 🆘 Common Issues & Quick Fixes

### "OCR isn't accurate"
- Make sure photos are well-lit
- Use horizontal orientation
- Consider upgrading to Google Vision API ($1.50/1000 images)

### "PDF looks wrong"
- React PDF has limitations
- Use HTML-to-PDF if needed (later)

### "Too slow"
- You're probably not caching Supabase queries
- Add `cache: 'force-cache'` to fetch calls

### "Can't login"
- Check Supabase email settings
- Confirm email is enabled in Auth settings


---

## 🎬 For Claude Code

Tell Claude Code:
```
Create a simple change order management system using:
- Next.js 14 with app router
- Supabase for everything (auth, database, storage)
- shadcn/ui for components
- Tesseract.js for OCR
- React PDF for documents

Keep it simple. No Redis, no complex state management, no PWA features.
Just a working app for <10 users.
```

This is all you need. Ship it! 🚀