import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const channels = pgTable("channels", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  group: text("group"), // Category like News, Sports, etc.
  country: text("country"),
  language: text("language"),
  url: text("url").notNull(),
  tvg_id: text("tvg_id"),
  tvg_name: text("tvg_name"),
  isWorking: boolean("is_working").default(true),
  viewerCount: integer("viewer_count").default(0),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: text("channel_id").notNull(),
  userId: text("user_id").notNull(), // For future user system
});

export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  lastUpdated: text("last_updated"),
  channelCount: integer("channel_count").default(0),
  isActive: boolean("is_active").default(true),
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
});

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
