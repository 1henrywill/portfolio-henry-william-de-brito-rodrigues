import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "technician"]).default("user").notNull(),
  isTechnician: boolean("isTechnician").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Support rooms table - stores information about support sessions
 */
export const supportRooms = mysqlTable("support_rooms", {
  id: int("id").autoincrement().primaryKey(),
  technicianId: int("technician_id").notNull(),
  roomCode: varchar("room_code", { length: 16 }).notNull().unique(),
  roomName: varchar("room_name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["waiting", "in_progress", "completed"]).default("waiting").notNull(),
  clientName: text("client_name"),
  jitsiRoomName: varchar("jitsi_room_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SupportRoom = typeof supportRooms.$inferSelect;
export type InsertSupportRoom = typeof supportRooms.$inferInsert;

/**
 * Support sessions table - tracks individual support interactions
 */
export const supportSessions = mysqlTable("support_sessions", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("room_id").notNull(),
  technicianId: int("technician_id").notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  duration: int("duration"), // duration in seconds
  transcription: longtext("transcription"),
  summary: longtext("summary"),
  problemDescription: longtext("problem_description"),
  solution: longtext("solution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SupportSession = typeof supportSessions.$inferSelect;
export type InsertSupportSession = typeof supportSessions.$inferInsert;

/**
 * Transcriptions table - stores audio transcriptions from sessions
 */
export const transcriptions = mysqlTable("transcriptions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("session_id").notNull(),
  audioUrl: text("audio_url"),
  transcriptionText: longtext("transcription_text"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Transcription = typeof transcriptions.$inferSelect;
export type InsertTranscription = typeof transcriptions.$inferInsert;

/**
 * Reports table - stores generated support reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("session_id").notNull(),
  technicianId: int("technician_id").notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  problemDescription: longtext("problem_description"),
  solution: longtext("solution"),
  summary: longtext("summary"),
  duration: int("duration"), // duration in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => (({
  supportRooms: many(supportRooms),
  supportSessions: many(supportSessions),
  reports: many(reports),
})));

export const supportRoomsRelations = relations(supportRooms, ({ one, many }) => (({
  technician: one(users, {
    fields: [supportRooms.technicianId],
    references: [users.id],
  }),
  sessions: many(supportSessions),
})));

export const supportSessionsRelations = relations(supportSessions, ({ one, many }) => (({
  room: one(supportRooms, {
    fields: [supportSessions.roomId],
    references: [supportRooms.id],
  }),
  technician: one(users, {
    fields: [supportSessions.technicianId],
    references: [users.id],
  }),
  transcriptions: many(transcriptions),
  reports: many(reports),
})));

export const transcriptionsRelations = relations(transcriptions, ({ one }) => (({
  session: one(supportSessions, {
    fields: [transcriptions.sessionId],
    references: [supportSessions.id],
  }),
})));

export const reportsRelations = relations(reports, ({ one }) => (({
  session: one(supportSessions, {
    fields: [reports.sessionId],
    references: [supportSessions.id],
  }),
  technician: one(users, {
    fields: [reports.technicianId],
    references: [users.id],
  }),
})));
