# Next.js Employee Management System

A modern, full-stack employee management system built with Next.js, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd next_boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your database and other configuration values.

4. Set up the database:
```bash
# Create and apply database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development Workflow

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run prettify` - Format code with Prettier
- `npm run prisma:studio` - Open Prisma Studio for database management
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:seed` - Seed the database with initial data

### Project Structure

```
src/
├── app/              # Next.js 13+ app directory
├── pages/            # Next.js pages
├── server/           # Server-side code
├── types/            # TypeScript type definitions
└── middleware.ts     # Next.js middleware
```

### Key Technologies

- **Frontend**: Next.js, React, TypeScript, Ant Design, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: Redux Toolkit
- **Forms**: Formik + Yup
- **Styling**: Tailwind CSS + SASS

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier for code formatting
   - Write meaningful commit messages

2. **Database Changes**
   - Create migrations using `npm run prisma:migrate`
   - Test migrations locally before committing
   - Update Prisma schema in `prisma/schema.prisma`

3. **API Development**
   - Follow RESTful conventions
   - Use TypeScript interfaces for request/response types
   - Implement proper error handling

4. **Authentication**
   - Use NextAuth.js for authentication
   - Protect routes using middleware
   - Follow security best practices

### Common Tasks

1. **Adding a New Feature**
   - Create necessary database migrations
   - Add API endpoints in `src/pages/api`
   - Create UI components in `src/app`
   - Add types in `src/types`

2. **Database Management**
   - Use Prisma Studio: `npm run prisma:studio`
   - Create migrations: `npm run prisma:migrate`
   - Reset database: `npm run prisma:reset`

3. **Testing Changes**
   - Run development server: `npm run dev`
   - Check linting: `npm run lint`
   - Format code: `npm run prettify`

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔧 Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env.local`
   - Ensure database exists

2. **Build Errors**
   - Clear `.next` directory
   - Run `npm install` to update dependencies
   - Check TypeScript errors

3. **Authentication Issues**
   - Verify environment variables
   - Check NextAuth.js configuration
   - Clear browser cookies

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request
