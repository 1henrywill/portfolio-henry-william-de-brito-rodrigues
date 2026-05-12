import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendClientJoinedEmail, sendSessionReportEmail } from "./email";

// Mock fetch
global.fetch = vi.fn();

describe("Email Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendClientJoinedEmail", () => {
    it("should send client joined email successfully", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const result = await sendClientJoinedEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "ABC123",
        "Support Room",
        "https://example.com/room/1"
      );

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/email/send"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should handle email send failure", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => "Error message",
      } as Response);

      const result = await sendClientJoinedEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "ABC123",
        "Support Room",
        "https://example.com/room/1"
      );

      expect(result).toBe(false);
    });

    it("should handle network error", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await sendClientJoinedEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "ABC123",
        "Support Room",
        "https://example.com/room/1"
      );

      expect(result).toBe(false);
    });

    it("should include client name in email body", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await sendClientJoinedEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "ABC123",
        "Support Room",
        "https://example.com/room/1"
      );

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.html).toContain("Jane Client");
      expect(body.html).toContain("ABC123");
      expect(body.html).toContain("Support Room");
    });
  });

  describe("sendSessionReportEmail", () => {
    it("should send session report email successfully", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await sendSessionReportEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "Support Room",
        600, // 10 minutes
        "Session went well",
        "Client had connectivity issues",
        "Restarted router and checked settings"
      );

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledOnce();
    });

    it("should format duration correctly in email", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await sendSessionReportEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "Support Room",
        125, // 2 minutes 5 seconds
        "Summary",
        "Problem",
        "Solution"
      );

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.html).toContain("2m 5s");
    });

    it("should include all report details in email", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const problemDesc = "Client cannot connect to VPN";
      const solutionDesc = "Updated VPN credentials";
      const summaryText = "Issue resolved successfully";

      await sendSessionReportEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "Support Room",
        300,
        summaryText,
        problemDesc,
        solutionDesc
      );

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.html).toContain(problemDesc);
      expect(body.html).toContain(solutionDesc);
      expect(body.html).toContain(summaryText);
    });

    it("should handle missing details gracefully", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await sendSessionReportEmail(
        "tech@example.com",
        "John Technician",
        "Jane Client",
        "Support Room",
        300,
        "", // empty summary
        "", // empty problem
        "" // empty solution
      );

      expect(result).toBe(true);
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.html).toContain("Não informado");
    });
  });
});
