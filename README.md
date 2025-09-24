# ARCG Change Order Management System

A modern, mobile-first web application for managing construction change orders with OCR photo scanning and PDF generation capabilities.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Git
- Supabase account ([Sign up free](https://supabase.com))

### Option 1: Docker Setup (Recommended)
```bash
# Clone repository
git clone https://github.com/allxdamnxday/arcg.git
cd arcg

# Set up environment
cp .env.docker.example .env.local
# Edit .env.local with your Supabase credentials

# Start application
docker-compose up
```
→ **[Full Docker Guide](./README_DOCKER.md)**

### Option 2: Manual Setup
```bash
# Clone and install
git clone https://github.com/allxdamnxday/arcg.git
cd arcg
npm install

# Configure and run
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```
→ **[Manual Setup Guide](./docs/MANUAL_SETUP.md)**

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[Docker Guide](./README_DOCKER.md)** | Complete Docker setup and commands |
| **[Contributing](./CONTRIBUTING.md)** | Development workflow and guidelines |
| **[Architecture](./docs/ARCHITECTURE.md)** | System design and technical patterns |
| **[Roadmap](./docs/ROADMAP.md)** | Feature planning and progress |
| **[CLAUDE.md](./CLAUDE.md)** | AI assistant instructions |

## ✨ Features

- **📝 Change Order Management** - Create, edit, and track construction change orders
- **📸 OCR Processing** - Extract text from photos using Tesseract.js
- **📄 PDF Generation** - Professional PDF exports with React PDF
- **🔐 Authentication** - Secure user management with Supabase Auth
- **💾 Real-time Updates** - Live data synchronization
- **📱 Mobile First** - Responsive design for field use
- **🔌 MCP Integration** - AI assistants have live database access for accurate development

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com)
- **PDF**: [@react-pdf/renderer](https://react-pdf.org)
- **Deployment**: Docker + GitHub Actions

## 🤝 Contributing

We welcome contributions! Please see our **[Contributing Guide](./CONTRIBUTING.md)** for:
- Development setup
- Code standards
- Pull request process
- Branch strategy

## 📊 Project Status

**Current Stage**: Production Ready with Docker Integration

- ✅ Core functionality complete
- ✅ Docker containerization
- ✅ CI/CD pipeline configured
- ✅ Authentication & database
- ✅ OCR and PDF generation
- 🚧 Advanced features in development

See **[Roadmap](./docs/ROADMAP.md)** for detailed progress.

## 🚀 Deployment

### GitHub Actions CI/CD
Every push to `main` triggers:
1. Automated testing
2. Docker image build
3. Security scanning
4. Deployment (when configured)

### Production Deployment
See **[Docker Guide](./README_DOCKER.md#deployment)** for deployment instructions.

## 📄 License

This project is proprietary software for ARC Glazing.

## 🆘 Support

- **Documentation**: See links above
- **Issues**: [GitHub Issues](https://github.com/allxdamnxday/arcg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/allxdamnxday/arcg/discussions)

---

Built with ❤️ for the construction industry