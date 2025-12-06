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
- [Plate](https://platejs.org/) — Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) — Styling

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Alexandre-Chs/blog.git
cd blog

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/blog
```

## License

MIT
