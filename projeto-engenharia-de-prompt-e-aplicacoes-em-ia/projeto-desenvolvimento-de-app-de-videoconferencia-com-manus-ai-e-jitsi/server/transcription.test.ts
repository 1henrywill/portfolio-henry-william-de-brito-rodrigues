import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateReportFromTranscription, generateSessionSummary } from "./transcription";

// Mock invokeLLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";

describe("Transcription Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateReportFromTranscription", () => {
    it("should generate report from valid transcription", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                problemDescription: "Client experiencing slow internet",
                solution: "Optimized network settings and cleared cache",
                summary: "Successfully resolved network performance issues",
              }),
            },
          },
        ],
      } as any);

      const result = await generateReportFromTranscription(
        "Client: I'm experiencing slow internet speeds\nTechnician: Let me help you optimize your settings...",
        "John Client",
        "Support Session"
      );

      expect(result).toBeDefined();
      expect(result?.problemDescription).toBe("Client experiencing slow internet");
      expect(result?.solution).toBe("Optimized network settings and cleared cache");
      expect(result?.summary).toBe("Successfully resolved network performance issues");
    });

    it("should return null for empty transcription", async () => {
      const result = await generateReportFromTranscription("", "John Client", "Support Session");
      expect(result).toBeNull();
    });

    it("should return null for whitespace-only transcription", async () => {
      const result = await generateReportFromTranscription("   ", "John Client", "Support Session");
      expect(result).toBeNull();
    });

    it("should handle LLM errors gracefully", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockRejectedValueOnce(new Error("LLM error"));

      const result = await generateReportFromTranscription(
        "Some transcription text",
        "John Client",
        "Support Session"
      );

      expect(result).toBeNull();
    });

    it("should handle missing response content", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [{ message: { content: undefined } }],
      } as any);

      const result = await generateReportFromTranscription(
        "Some transcription text",
        "John Client",
        "Support Session"
      );

      expect(result).toBeNull();
    });

    it("should parse JSON response correctly", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                problemDescription: "Test problem",
                solution: "Test solution",
                summary: "Test summary",
              }),
            },
          },
        ],
      } as any);

      const result = await generateReportFromTranscription(
        "Test transcription",
        "Test Client",
        "Test Room"
      );

      expect(result).toBeDefined();
      expect(result?.problemDescription).toBe("Test problem");
      expect(result?.solution).toBe("Test solution");
      expect(result?.summary).toBe("Test summary");
    });

    it("should handle array content from LLM", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: [
                { type: "text", text: JSON.stringify({
                  problemDescription: "Problem",
                  solution: "Solution",
                  summary: "Summary",
                }) },
              ],
            },
          },
        ],
      } as any);

      const result = await generateReportFromTranscription(
        "Test transcription",
        "Test Client",
        "Test Room"
      );

      expect(result).toBeDefined();
    });
  });

  describe("generateSessionSummary", () => {
    it("should generate session summary successfully", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "This was a productive session where we successfully resolved the client's connectivity issues.",
            },
          },
        ],
      } as any);

      const result = await generateSessionSummary(
        "John Client",
        "Internet connectivity problems",
        "Reconfigured network settings",
        600
      );

      expect(result).toBeDefined();
      expect(result).toContain("productive");
    });

    it("should include duration in minutes in the request", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "Summary text",
            },
          },
        ],
      } as any);

      await generateSessionSummary(
        "John Client",
        "Problem description",
        "Solution description",
        125 // 2 minutes 5 seconds
      );

      const callArgs = mockInvokeLLM.mock.calls[0];
      const messages = callArgs[0].messages;
      const userMessage = messages.find((m: any) => m.role === "user");

      expect(userMessage.content).toContain("2 minutos");
    });

    it("should return null for LLM errors", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockRejectedValueOnce(new Error("LLM error"));

      const result = await generateSessionSummary(
        "John Client",
        "Problem",
        "Solution",
        300
      );

      expect(result).toBeNull();
    });

    it("should return null for missing response", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [{ message: { content: undefined } }],
      } as any);

      const result = await generateSessionSummary(
        "John Client",
        "Problem",
        "Solution",
        300
      );

      expect(result).toBeNull();
    });

    it("should handle array content from LLM", async () => {
      const mockInvokeLLM = vi.mocked(invokeLLM);
      mockInvokeLLM.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: [
                { type: "text", text: "Summary from array" },
              ],
            },
          },
        ],
      } as any);

      const result = await generateSessionSummary(
        "John Client",
        "Problem",
        "Solution",
        300
      );

      expect(result).toBeDefined();
    });
  });
});
