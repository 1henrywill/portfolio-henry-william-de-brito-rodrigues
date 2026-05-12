import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  createSupportRoom, 
  getSupportRoomByCode, 
  getSupportRoomById,
  updateSupportRoomStatus,
  updateSupportRoomClient,
  getTechnicianRooms,
  createSupportSession,
  getSupportSessionById,
  updateSupportSession,
  getTechnicianSessions,
  createReport,
  getReportBySessionId,
  getTechnicianReports,
  createTranscription,
  updateTranscription,
  getTranscriptionBySessionId,
} from "./db";
import { TRPCError } from "@trpc/server";

// Helper function to generate unique room code with retry
async function generateUniqueRoomCode(maxRetries = 5): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Check if code already exists
    try {
      const existingRoom = await getSupportRoomByCode(code);
      if (!existingRoom) {
        return code;
      }
    } catch (error) {
      // If error is "not found", code is unique
      return code;
    }
  }
  
  throw new Error("Não foi possível gerar um código único para a sala");
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Support Room procedures
  rooms: router({
    // Create a new support room (technician only)
    create: protectedProcedure
      .input(z.object({
        roomName: z.string().min(1).max(255),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const roomCode = await generateUniqueRoomCode();
        await createSupportRoom(ctx.user.id, input.roomName, roomCode);
        
        const room = await getSupportRoomByCode(roomCode);
        if (!room) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        return room;
      }),

    // Get room by code (public - for clients)
    getByCode: publicProcedure
      .input(z.object({
        roomCode: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const room = await getSupportRoomByCode(input.roomCode);
        if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Sala não encontrada" });
        return room;
      }),

    // Get room by ID
    getById: publicProcedure
      .input(z.object({
        roomId: z.number(),
      }))
      .query(async ({ input }) => {
        const room = await getSupportRoomById(input.roomId);
        if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Sala não encontrada" });
        return room;
      }),

    // Update room status
    updateStatus: protectedProcedure
      .input(z.object({
        roomId: z.number(),
        status: z.enum(["waiting", "in_progress", "completed"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const room = await getSupportRoomById(input.roomId);
        if (!room) throw new TRPCError({ code: "NOT_FOUND" });
        if (room.technicianId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        
        await updateSupportRoomStatus(input.roomId, input.status);
        return { success: true };
      }),

    // Update client name in room
    updateClientName: publicProcedure
      .input(z.object({
        roomId: z.number(),
        clientName: z.string().min(1).max(255),
      }))
      .mutation(async ({ input }) => {
        await updateSupportRoomClient(input.roomId, input.clientName);
        return { success: true };
      }),

    // Get technician's rooms
    getTechnicianRooms: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await getTechnicianRooms(ctx.user.id);
      }),
  }),

  // Support Session procedures
  sessions: router({
    // Create a new session
    create: publicProcedure
      .input(z.object({
        roomId: z.number(),
        technicianId: z.number(),
        clientName: z.string().min(1).max(255),
      }))
      .mutation(async ({ input }) => {
        await createSupportSession(input.roomId, input.technicianId, input.clientName);
        const sessions = await getTechnicianSessions(input.technicianId);
        const session = sessions[0];
        if (!session) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return session;
      }),

    // Get session by ID
    getById: publicProcedure
      .input(z.object({
        sessionId: z.number(),
      }))
      .query(async ({ input }) => {
        const session = await getSupportSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        return session;
      }),

    // Update session (transcription, summary, etc)
    update: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        duration: z.number().optional(),
        transcription: z.string().optional(),
        summary: z.string().optional(),
        problemDescription: z.string().optional(),
        solution: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const session = await getSupportSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        if (session.technicianId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        
        const { sessionId, ...updateData } = input;
        await updateSupportSession(sessionId, updateData);
        return { success: true };
      }),

    // Get technician's sessions
    getTechnicianSessions: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await getTechnicianSessions(ctx.user.id);
      }),
  }),

  // Report procedures
  reports: router({
    // Create a report
    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        clientName: z.string().min(1).max(255),
        problemDescription: z.string().optional(),
        solution: z.string().optional(),
        summary: z.string().optional(),
        duration: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const session = await getSupportSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        if (session.technicianId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        
        await createReport({
          sessionId: input.sessionId,
          technicianId: ctx.user.id,
          clientName: input.clientName,
          problemDescription: input.problemDescription,
          solution: input.solution,
          summary: input.summary,
          duration: input.duration,
        });
        
        const report = await getReportBySessionId(input.sessionId);
        if (!report) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return report;
      }),

    // Get report by session ID
    getBySessionId: publicProcedure
      .input(z.object({
        sessionId: z.number(),
      }))
      .query(async ({ input }) => {
        const report = await getReportBySessionId(input.sessionId);
        if (!report) throw new TRPCError({ code: "NOT_FOUND" });
        return report;
      }),

    // Get technician's reports
    getTechnicianReports: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return await getTechnicianReports(ctx.user.id);
      }),
  }),

  // Transcription procedures
  transcriptions: router({
    // Create transcription record
    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const session = await getSupportSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        if (session.technicianId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        
        await createTranscription(input.sessionId);
        const transcription = await getTranscriptionBySessionId(input.sessionId);
        if (!transcription) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        return transcription;
      }),

    // Update transcription
    update: protectedProcedure
      .input(z.object({
        transcriptionId: z.number(),
        transcriptionText: z.string().optional(),
        status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        
        const { transcriptionId, ...updateData } = input;
        await updateTranscription(transcriptionId, updateData);
        return { success: true };
      }),

    // Get transcription by session ID
    getBySessionId: publicProcedure
      .input(z.object({
        sessionId: z.number(),
      }))
      .query(async ({ input }) => {
        const transcription = await getTranscriptionBySessionId(input.sessionId);
        if (!transcription) throw new TRPCError({ code: "NOT_FOUND" });
        return transcription;
      }),
  }),
});

export type AppRouter = typeof appRouter;
