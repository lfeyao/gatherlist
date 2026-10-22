import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const members = sqliteTable('members', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: text('created_at').notNull(),
  lastSeenAt: text('last_seen_at').notNull(),
});
