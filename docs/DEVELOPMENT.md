# Development Guide

This guide provides detailed information for developers working on the Next.js Employee Management System.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Docker Setup](#docker-setup)
- [Code Organization](#code-organization)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Required Tools
- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- VS Code (recommended)
- Docker (optional)

### VS Code Extensions
Install these recommended extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens
- Error Lens

### Initial Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd next_boilerplate
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env.local
```
Configure the following in `.env.local`:
- Database connection string
- NextAuth.js secrets
- API keys (if needed)
- Environment-specific settings

3. **Database Setup**
```bash
# Create database
createdb next_boilerplate

# Run migrations
npm run prisma:migrate

# Seed data
npm run prisma:seed
```

4. **Start Development Server**
```bash
npm run dev
```

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. **Build and Start Services**
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

2. **Database Migrations**
```bash
# Run migrations
docker-compose exec app npm run prisma:migrate

# Seed database
docker-compose exec app npm run prisma:seed
```

3. **Useful Docker Commands**
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (including database data)
docker-compose down -v

# Rebuild a specific service
docker-compose up -d --build app

# Access database
docker-compose exec db psql -U postgres -d next_boilerplate
```

4. **Development with Docker**
- The application will be available at http://localhost:3000
- PostgreSQL will be available at localhost:5432
- Hot reloading is enabled for development
- Database data persists in a Docker volume

5. **Troubleshooting Docker**
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs app
docker-compose logs db

# Restart services
docker-compose restart

# Clean up Docker resources
docker system prune
```

## Code Organization

### Directory Structure
```
src/
├── app/                    # Next.js 13+ app directory
│   ├── components/            # Reusable components
│   │   ├── common/           # Shared components
│   │   ├── forms/            # Form components
│   │   ├── layouts/          # Layout components
│   ├── config/            # Frontend Config Files
│   ├── HOC/            # Higher Oder Components
│   ├── hooks/            # Hooks
│   ├── store/                # Redux store
│   ├── styles/               # Global styles
├── pages/                # Next.js pages
│   └── api/             # API routes
├── server/               # Server-side code
├── types/                # TypeScript types
└── middleware.ts         # Next.js middleware
```

### Key Files
- `src/types/` - TypeScript interfaces and types
- `src/lib/` - Utility functions and helpers
- `src/components/` - Reusable React components
- `src/store/` - Redux store configuration
- `prisma/schema.prisma` - Database schema

## Development Workflow

### 1. Starting a New Feature

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Follow the feature development checklist:
   - [ ] Create necessary database migrations
   - [ ] Add TypeScript interfaces
   - [ ] Implement API endpoints
   - [ ] Create UI components
   - [ ] Add tests
   - [ ] Update documentation

### 2. Database Changes

1. Modify `prisma/schema.prisma`
2. Create migration:
```bash
npm run prisma:migrate
```
3. Test migration locally
4. Update seed data if needed

### 3. API Development

1. Create new API route in `src/pages/api/`
2. Follow RESTful conventions
3. Implement proper error handling
4. Add request/response types
5. Document API endpoints

### 4. UI Development

1. Create components in appropriate directories
2. Follow component structure:
```typescript
// Component structure
import { FC } from 'react';
import styles from './Component.module.scss';

interface Props {
  // Props interface
}

export const Component: FC<Props> = ({ /* props */ }) => {
  // Component logic
  return (
    // JSX
  );
};
```

3. Use Ant Design components
4. Follow Tailwind CSS conventions
5. Implement responsive design

## Testing

### 1. Manual Testing
- Test all user flows
- Verify responsive design
- Check error handling
- Test form validations

### 2. Automated Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

### 3. Testing Checklist
- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] API endpoint tests
- [ ] Integration tests
- [ ] E2E tests (if applicable)

## Deployment

### 1. Production Build
```bash
npm run build
```

### 2. Environment Setup
- Set production environment variables
- Configure database
- Set up SSL certificates
- Configure domain

### 3. Deployment Checklist
- [ ] Run all tests
- [ ] Check build output
- [ ] Verify environment variables
- [ ] Test database migrations
- [ ] Monitor error tracking

## Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Check PostgreSQL status
pg_ctl status

# Verify connection string
echo $DATABASE_URL
```

2. **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

3. **TypeScript Errors**
```bash
# Check for type errors
npm run type-check

# Fix common issues
npm run lint:fix
```

### Debugging

1. **VS Code Debugging**
- Use launch configurations in `.vscode/launch.json`
- Set breakpoints in code
- Use debug console

2. **API Debugging**
- Use browser dev tools
- Check network requests
- Monitor API responses

3. **Database Debugging**
```bash
# Open Prisma Studio
npm run prisma:studio

# Check database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

## Best Practices

1. **Code Quality**
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Document complex logic

2. **Performance**
- Optimize images
- Use proper caching
- Implement lazy loading
- Monitor bundle size

3. **Security**
- Follow OWASP guidelines
- Implement proper authentication
- Sanitize user input
- Use environment variables

4. **Accessibility**
- Follow WCAG guidelines
- Use semantic HTML
- Implement keyboard navigation
- Test with screen readers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
