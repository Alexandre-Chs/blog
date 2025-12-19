import { boolean, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

export const userRoleEnum = pgEnum('role', ['user', 'admin'])

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: userRoleEnum().notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const articles = pgTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  readTime: integer('read_time').default(0).notNull(),
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  publishedAt: timestamp('published_at'),
})

export const articlesRelations = relations(articles, ({ many }) => ({
  articlesToMedias: many(articlesToMedias),
}))

export type Article = InferSelectModel<typeof articles>

export const medias = pgTable('medias', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  mimetype: text('mimetype').notNull(),
  width: integer('width'),
  height: integer('height'),
  size: integer('size').notNull(),
  alt: text('alt').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Media = InferSelectModel<typeof medias>

export const mediasRelations = relations(medias, ({ many }) => ({
  articlesToMedias: many(articlesToMedias),
}))

export const mediaRoleEnum = pgEnum('media_role', ['thumbnail', 'inline', 'og_image'])

export const articlesToMedias = pgTable(
  'articles_to_medias',
  {
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    mediaId: text('media_id')
      .notNull()
      .references(() => medias.id, { onDelete: 'cascade' }),
    role: mediaRoleEnum().notNull().default('inline'),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.mediaId, t.role] })],
)

export const articlesToMediasRelations = relations(articlesToMedias, ({ one }) => ({
  media: one(medias, {
    fields: [articlesToMedias.mediaId],
    references: [medias.id],
  }),
  article: one(articles, {
    fields: [articlesToMedias.articleId],
    references: [articles.id],
  }),
}))

type SettingsMap = {
  general: { name: string }
  about: { content: string }
  favicon: { key: string; mimetype: string; url: string }
  ai: { context: string; defaultModel: string }
}

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').$type<SettingsMap[keyof SettingsMap]>(),
})

export const deviceEnum = pgEnum('device', ['desktop', 'mobile', 'tablet'])
export type Device = 'desktop' | 'mobile' | 'tablet'

export const visits = pgTable('visits', {
  id: text('id').primaryKey(),
  startedAt: timestamp('started_at').notNull(),
  lastSeenAt: timestamp('last_seen_at').notNull(),
  pages: text('pages').array().notNull().default([]),
  pageViews: integer('page_views').notNull().default(0),
  entryPage: text('entry_page').notNull(),
  exitPage: text('exit_page').notNull(),
  referrer: text('referrer'),
  country: text('country'),
  browser: text('browser'),
  duration: integer('duration'),
  device: deviceEnum(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Visit = InferSelectModel<typeof visits>
