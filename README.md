# Blog

A simple, self-hosted blogging platform built with modern web technologies.

## Features

- ✍️ **Write & Publish** — Create and publish articles with a rich text editor
- 📅 **Schedule Posts** — Schedule articles to be published at a specific date and time
- 🤖 **AI Writing Assistant** — Generate articles using AI to help you write faster
- 📊 **Analytics** — Track your blog performance _(coming soon)_

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [Drizzle ORM](https://orm.drizzle.team/) — TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Tailwind CSS](https://tailwindcss.com/) — Styling

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm
- Docker & Docker Compose (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Alexandre-Chs/blog.git
cd blog

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and configure your database URLs
```

### Development Mode

Run the application in development mode with hot-reload:

```bash
# Option 1: Run dev server only
pnpm dev

# Option 2: Run dev server + Drizzle Studio (database UI)
./bin/start.sh dev
```

The app will be available at `http://localhost:3000`.
Drizzle Studio (if started) will be available at `http://localhost:4983`.

### Docker Mode (Local)

Run the application in a Docker container:

```bash
# Start Docker containers
./bin/start.sh

# Or explicitly specify production mode
./bin/start.sh prod

# Stop Docker containers
./bin/stop.sh
```

The app will be available at `http://localhost`.

### Database Migrations

```bash
# Generate migration files from schema changes
pnpm db:generate

# Run migrations on production database (uses DATABASE_URL_PROD)
./bin/migrate.sh

# Push schema changes directly (development only)
pnpm db:push
```

### Other Useful Commands

```bash
# Open Drizzle Studio (database UI)
pnpm db:studio

# Build the application
pnpm build

# Start the built application
pnpm start
```

## Environment Variables

Create a [.env](.env) file based on [.env.example](.env.example):

```env
# Development database
DATABASE_URL=postgresql://user:password@localhost:5432/blog

# Production database (used by migrations)
DATABASE_URL_PROD=postgresql://user:password@localhost:5432/blog_prod
```

## License

MIT
