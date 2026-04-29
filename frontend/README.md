# IdeaForge Frontend Setup

This is the Next.js 16.2.1 application for IdeaForge.

> **CRITICAL:** Before making any Next.js API changes, please read the rules in `AGENTS.md` and the installed documentation in `node_modules/next/dist/docs/`. Next 16 introduces breaking changes.

## Prerequisites
- Node.js 20.19+, 22.12+, or 24.0+ (Required for Prisma)
- PostgreSQL (Local or managed provider like Supabase/Neon)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update the `.env` file with your `DATABASE_URL` and `AUTH_SECRET`.

### 3. Database Setup (Prisma)
Run the following commands to set up the database and seed it with initial data:
```bash
npm run db:migrate  # Runs migrations and pushes the schema to the database
npm run db:generate # Generates the Prisma client
npm run db:seed     # Populates the database with sample data
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality Checks
To ensure code quality, run the linting and build commands:
```bash
npm run lint
npm run build
```
