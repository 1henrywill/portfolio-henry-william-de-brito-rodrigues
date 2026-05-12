import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("Support Rooms Router", () => {
  it("should create a support room with unique code", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rooms.create({
      roomName: "Test Support Room",
    });

    expect(result).toBeDefined();
    expect(result.roomName).toBe("Test Support Room");
    expect(result.roomCode).toBeDefined();
    expect(result.roomCode).toHaveLength(6);
    expect(result.status).toBe("waiting");
    expect(result.technicianId).toBe(ctx.user!.id);
  });

  it("should retrieve room by code", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a room first
    const createdRoom = await caller.rooms.create({
      roomName: "Test Room for Retrieval",
    });

    // Retrieve it
    const retrievedRoom = await caller.rooms.getByCode({
      roomCode: createdRoom.roomCode,
    });

    expect(retrievedRoom).toBeDefined();
    expect(retrievedRoom.id).toBe(createdRoom.id);
    expect(retrievedRoom.roomCode).toBe(createdRoom.roomCode);
  });

  it("should throw error when room code not found", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.rooms.getByCode({
        roomCode: "INVALID",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });

  it("should update room status", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a room
    const room = await caller.rooms.create({
      roomName: "Test Room for Status Update",
    });

    // Update status
    await caller.rooms.updateStatus({
      roomId: room.id,
      status: "in_progress",
    });

    // Verify status was updated
    const updatedRoom = await caller.rooms.getById({
      roomId: room.id,
    });

    expect(updatedRoom.status).toBe("in_progress");
    expect(updatedRoom.startedAt).toBeDefined();
  });

  it("should get technician rooms", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create multiple rooms
    await caller.rooms.create({ roomName: "Room 1" });
    await caller.rooms.create({ roomName: "Room 2" });

    // Get technician rooms
    const rooms = await caller.rooms.getTechnicianRooms();

    expect(rooms).toBeDefined();
    expect(rooms.length).toBeGreaterThanOrEqual(2);
    expect(rooms[0].technicianId).toBe(ctx.user!.id);
  });
});

describe("Support Sessions Router", () => {
  it("should create a support session", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a room first
    const room = await caller.rooms.create({
      roomName: "Test Room for Session",
    });

    // Create a session
    const session = await caller.sessions.create({
      roomId: room.id,
      technicianId: ctx.user!.id,
      clientName: "Test Client",
    });

    expect(session).toBeDefined();
    expect(session.clientName).toBe("Test Client");
    expect(session.roomId).toBe(room.id);
    expect(session.technicianId).toBe(ctx.user!.id);
  });

  it("should get technician sessions", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a room and session
    const room = await caller.rooms.create({
      roomName: "Test Room for Sessions",
    });

    await caller.sessions.create({
      roomId: room.id,
      technicianId: ctx.user!.id,
      clientName: "Test Client",
    });

    // Get sessions
    const sessions = await caller.sessions.getTechnicianSessions();

    expect(sessions).toBeDefined();
    expect(sessions.length).toBeGreaterThan(0);
  });
});

describe("Reports Router", () => {
  it("should create a report", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create room and session
    const room = await caller.rooms.create({
      roomName: "Test Room for Report",
    });

    const session = await caller.sessions.create({
      roomId: room.id,
      technicianId: ctx.user!.id,
      clientName: "Test Client",
    });

    // Create report
    const report = await caller.reports.create({
      sessionId: session.id,
      clientName: "Test Client",
      problemDescription: "Test problem",
      solution: "Test solution",
      summary: "Test summary",
      duration: 300,
    });

    expect(report).toBeDefined();
    expect(report.clientName).toBe("Test Client");
    expect(report.problemDescription).toBe("Test problem");
    expect(report.duration).toBe(300);
  });

  it("should get technician reports", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create room, session, and report
    const room = await caller.rooms.create({
      roomName: "Test Room for Reports",
    });

    const session = await caller.sessions.create({
      roomId: room.id,
      technicianId: ctx.user!.id,
      clientName: "Test Client",
    });

    await caller.reports.create({
      sessionId: session.id,
      clientName: "Test Client",
      problemDescription: "Test problem",
      solution: "Test solution",
    });

    // Get reports
    const reports = await caller.reports.getTechnicianReports();

    expect(reports).toBeDefined();
    expect(reports.length).toBeGreaterThan(0);
  });
});

describe("Authentication Router", () => {
  it("should get current user", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.id).toBe(ctx.user!.id);
    expect(user?.email).toBe(ctx.user!.email);
  });

  it("should logout user", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
