import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, supportRooms, supportSessions, reports, transcriptions, SupportRoom, SupportSession, Report } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Support Room operations
export async function createSupportRoom(technicianId: number, roomName: string, roomCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const jitsiRoomName = `support-${roomCode}-${Date.now()}`;
  
  const result = await db.insert(supportRooms).values({
    technicianId,
    roomCode,
    roomName,
    jitsiRoomName,
    status: "waiting",
  });

  return result;
}

export async function getSupportRoomByCode(roomCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(supportRooms).where(eq(supportRooms.roomCode, roomCode)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getSupportRoomById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(supportRooms).where(eq(supportRooms.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSupportRoomStatus(roomId: number, status: "waiting" | "in_progress" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { status };
  
  if (status === "in_progress") {
    updateData.startedAt = new Date();
  } else if (status === "completed") {
    updateData.endedAt = new Date();
  }

  await db.update(supportRooms).set(updateData).where(eq(supportRooms.id, roomId));
}

export async function updateSupportRoomClient(roomId: number, clientName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(supportRooms).set({ clientName }).where(eq(supportRooms.id, roomId));
}

export async function getTechnicianRooms(technicianId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(supportRooms).where(eq(supportRooms.technicianId, technicianId)).orderBy(desc(supportRooms.createdAt));
}

// Support Session operations
export async function createSupportSession(roomId: number, technicianId: number, clientName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(supportSessions).values({
    roomId,
    technicianId,
    clientName,
  });

  return result;
}

export async function getSupportSessionById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(supportSessions).where(eq(supportSessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSupportSession(sessionId: number, data: Partial<SupportSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(supportSessions).set(data).where(eq(supportSessions.id, sessionId));
}

export async function getTechnicianSessions(technicianId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(supportSessions).where(eq(supportSessions.technicianId, technicianId)).orderBy(desc(supportSessions.createdAt));
}

// Report operations
export async function createReport(data: {
  sessionId: number;
  technicianId: number;
  clientName: string;
  problemDescription?: string;
  solution?: string;
  summary?: string;
  duration?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reports).values(data);
  return result;
}

export async function getReportBySessionId(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(reports).where(eq(reports.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getTechnicianReports(technicianId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(reports).where(eq(reports.technicianId, technicianId)).orderBy(desc(reports.createdAt));
}

// Transcription operations
export async function createTranscription(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(transcriptions).values({
    sessionId,
    status: "pending",
  });

  return result;
}

export async function updateTranscription(transcriptionId: number, data: { transcriptionText?: string; status?: "pending" | "processing" | "completed" | "failed" }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(transcriptions).set(data).where(eq(transcriptions.id, transcriptionId));
}

export async function getTranscriptionBySessionId(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(transcriptions).where(eq(transcriptions.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
