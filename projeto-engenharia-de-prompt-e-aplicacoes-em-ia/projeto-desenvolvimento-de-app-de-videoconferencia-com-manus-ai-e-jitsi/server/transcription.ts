import { invokeLLM } from "./_core/llm";

/**
 * Generate a summary and extract key information from transcription using LLM
 */
export async function generateReportFromTranscription(
  transcriptionText: string,
  clientName: string,
  roomName: string
): Promise<{
  problemDescription: string;
  solution: string;
  summary: string;
} | null> {
  try {
    if (!transcriptionText || transcriptionText.trim().length === 0) {
      return null;
    }

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um assistente de análise de sessões de suporte técnico. 
          Analise a transcrição fornecida e extraia as informações em português.
          Retorne um JSON com os campos: problemDescription, solution, summary.
          - problemDescription: descrição clara do problema relatado pelo cliente
          - solution: solução ou passos aplicados pelo técnico
          - summary: resumo geral da sessão em 2-3 frases
          Seja conciso e profissional.`,
        },
        {
          role: "user",
          content: `Analise esta transcrição de uma sessão de suporte técnico:

Cliente: ${clientName}
Sala: ${roomName}

Transcrição:
${transcriptionText}

Retorne um JSON válido com os campos: problemDescription, solution, summary`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "support_report",
          strict: true,
          schema: {
            type: "object",
            properties: {
              problemDescription: {
                type: "string",
                description: "Descrição do problema relatado",
              },
              solution: {
                type: "string",
                description: "Solução ou passos aplicados",
              },
              summary: {
                type: "string",
                description: "Resumo geral da sessão",
              },
            },
            required: ["problemDescription", "solution", "summary"],
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.choices[0]?.message?.content) {
      return null;
    }

    const content = response.choices[0].message.content;
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const parsed = JSON.parse(contentStr);

    return {
      problemDescription: parsed.problemDescription || "",
      solution: parsed.solution || "",
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("Error generating report from transcription:", error);
    return null;
  }
}

/**
 * Generate a professional summary from session data
 */
export async function generateSessionSummary(
  clientName: string,
  problemDescription: string,
  solution: string,
  duration: number
): Promise<string | null> {
  try {
    const durationMinutes = Math.floor(duration / 60);

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um redator profissional de relatórios de suporte técnico.
          Gere um resumo executivo profissional em português baseado nas informações fornecidas.
          O resumo deve ser conciso, claro e destacar os pontos principais.`,
        },
        {
          role: "user",
          content: `Gere um resumo executivo para este relatório de suporte:

Cliente: ${clientName}
Duração da sessão: ${durationMinutes} minutos

Problema:
${problemDescription}

Solução:
${solution}

Crie um resumo profissional em 3-4 frases que capture a essência da sessão.`,
        },
      ],
    });

    if (!response.choices[0]?.message?.content) {
      return null;
    }

    const content = response.choices[0].message.content;
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    console.error("Error generating session summary:", error);
    return null;
  }
}
