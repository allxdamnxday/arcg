---
📚 [Home](./README.md) | 🐳 [Docker](./README_DOCKER.md) | 📖 [Architecture](./docs/ARCHITECTURE.md)
---

# Contributing to ARCG Change Order Management System

## 🚀 Development Workflow

### Prerequisites
- Docker Desktop installed and running
- Git
- GitHub account with repository access
- Node.js 22+ (for local development without Docker)

### Getting Started

#### 1. Clone the Repository
```bash
git clone https://github.com/allxdamnxday/arcg.git
cd arcg
```

#### 2. Set Up Environment
```bash
# Copy environment variables
cp .env.docker.example .env.local

# Edit .env.local with your Supabase credentials
# Get these from: https://supabase.com/dashboard/project/_/settings/api
```

#### 3. Start Development with Docker
```bash
# Build and start the development environment
make dev
# OR
docker-compose up

# The app will be available at http://localhost:3000
```

#### 4. Start Development without Docker (alternative)
```bash
npm install
npm run dev
```

## 🌳 Branch Strategy

### Branch Structure
```
main (production)
  ├── develop (staging)
  │     ├── feature/add-new-feature
  │     ├── bugfix/fix-issue
  │     └── chore/update-deps
  └── hotfix/urgent-fix
```

### Branch Naming Convention
- `feature/` - New features
- `bugfix/` - Bug fixes
- `chore/` - Maintenance tasks
- `hotfix/` - Urgent production fixes

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## 📝 Making Changes

### 1. Write Your Code
Follow the existing code patterns:
- Use Server Components where possible
- Implement Server Actions for mutations
- Use TypeScript for all files
- Follow the project structure

### 2. Test Your Changes
```bash
# Run all checks
make test

# Or individually:
npm run typecheck
npm run lint
npm run format:check
```

### 3. Commit Your Changes
Our pre-commit hooks will automatically:
- Run lint-staged
- Format your code
- Check for TypeScript errors

```bash
git add .
git commit -m "feat: add user profile page"
```

#### Commit Message Format
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## 🔄 Pull Request Process

### 1. Push Your Branch
```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request
Use GitHub CLI or web interface:
```bash
gh pr create --title "feat: add user profile page" --body "Description of changes"
```

### 3. PR Requirements
Your PR must:
- ✅ Pass all CI checks (automated)
- ✅ Have a clear description
- ✅ Include any necessary documentation updates
- ✅ Have at least 1 approval (for main branch)
- ✅ Resolve all review comments

### 4. PR Template
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Tested in Docker environment
- [ ] Tested on mobile viewport

## Checklist
- [ ] My code follows the project style
- [ ] I've run the linter and formatter
- [ ] I've added/updated tests as needed
- [ ] I've updated the documentation
```

## 🐳 Docker Commands

### Common Docker Operations
```bash
# Start development environment
make dev

# Build Docker images
make build

# Run tests in Docker
make test

# View logs
make logs

# Access container shell
make shell

# Clean up Docker resources
make clean

# Check container status
make status
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests (when implemented)
npm run test:ci

# Run tests in Docker
docker-compose -f docker-compose.test.yml up
```

### Code Quality Checks
```bash
# TypeScript type checking
npm run typecheck

# ESLint
npm run lint

# Prettier formatting
npm run format:check

# Fix formatting issues
npm run format
```

## 📦 Dependencies

### Adding Dependencies
```bash
# Production dependency
npm install package-name

# Dev dependency
npm install --save-dev package-name

# Rebuild Docker image after adding dependencies
docker-compose build
```

## 🚨 Troubleshooting

### Docker Issues
```bash
# Clean rebuild
make clean
make build

# Check logs
docker-compose logs -f

# Restart containers
docker-compose restart
```

### Port Conflicts
If port 3000 is already in use:
```bash
# Find process using port 3000
lsof -i :3000

# Or change the port in docker-compose.yml
ports:
  - "3001:3000"
```

### Database Issues
```bash
# Reset database (requires Supabase CLI)
npm run db:reset

# Push migrations
npm run db:push
```

## 🔒 Security

### Best Practices
- Never commit `.env.local` or secrets
- Use environment variables for sensitive data
- Keep dependencies updated
- Review security advisories from GitHub

### Reporting Security Issues
Please report security vulnerabilities to the maintainers directly rather than creating a public issue.

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/en/actions)

### Project Structure
```
/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities and configurations
├── types/           # TypeScript definitions
├── .github/         # GitHub Actions workflows
└── docker files     # Docker configuration
```

## 💡 Tips

### Development Tips
1. Use `make` commands for common tasks
2. Enable hot reload by saving files
3. Check Docker logs if something isn't working
4. **Use MCP tools** - AI assistants can query live database with `mcp__supabase__*` commands
5. Use GitHub Copilot/AI assistants responsibly
6. Ask questions in discussions/issues

### Performance Tips
1. Use dynamic imports for heavy components
2. Implement proper loading states
3. Optimize images with Next.js Image
4. Use Server Components by default

## 🤝 Code Review Guidelines

### As a Reviewer
- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when requirements are met
- Use "Request changes" sparingly

### As a Developer
- Respond to all comments
- Push fixes as new commits (don't force-push)
- Mark conversations as resolved
- Thank reviewers for their time

## 📈 Continuous Improvement

We welcome suggestions for improving:
- Development workflow
- Code quality standards
- Documentation
- Testing strategies

Create an issue with the label `enhancement` to propose improvements.

---

**Thank you for contributing!** 🎉