import { ENV } from "./_core/env";

/**
 * Send email notification to technician when client joins
 */
export async function sendClientJoinedEmail(
  technicianEmail: string,
  technicianName: string,
  clientName: string,
  roomCode: string,
  roomName: string,
  roomUrl: string
): Promise<boolean> {
  try {
    // Use Manus built-in email service via Forge API
    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: technicianEmail,
        subject: `Novo cliente na sala: ${roomName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Novo Cliente na Sala de Suporte</h2>
            <p>Olá <strong>${technicianName}</strong>,</p>
            <p>Um cliente acaba de entrar na sua sala de suporte:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Sala:</strong> ${roomName}</p>
              <p><strong>Código:</strong> <code style="background-color: #e0e0e0; padding: 4px 8px; border-radius: 4px;">${roomCode}</code></p>
              <p><strong>Cliente:</strong> ${clientName}</p>
            </div>
            
            <p>
              <a href="${roomUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Entrar na Sala
              </a>
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Este é um e-mail automático do TechSupport Pro. Não responda este e-mail.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send email with session report to technician
 */
export async function sendSessionReportEmail(
  technicianEmail: string,
  technicianName: string,
  clientName: string,
  roomName: string,
  duration: number,
  summary: string,
  problemDescription: string,
  solution: string
): Promise<boolean> {
  try {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = duration % 60;

    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: technicianEmail,
        subject: `Relatório de Sessão: ${roomName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Relatório de Sessão de Suporte</h2>
            <p>Olá <strong>${technicianName}</strong>,</p>
            <p>Segue o relatório da sessão de suporte concluída:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Sala:</strong> ${roomName}</p>
              <p><strong>Cliente:</strong> ${clientName}</p>
              <p><strong>Duração:</strong> ${durationMinutes}m ${durationSeconds}s</p>
              <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
            </div>

            <h3 style="color: #333; margin-top: 20px;">Problema Relatado</h3>
            <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 4px;">
              ${problemDescription || "Não informado"}
            </p>

            <h3 style="color: #333; margin-top: 20px;">Solução Aplicada</h3>
            <p style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; border-radius: 4px;">
              ${solution || "Não informado"}
            </p>

            <h3 style="color: #333; margin-top: 20px;">Resumo</h3>
            <p style="background-color: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
              ${summary || "Não informado"}
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Este é um e-mail automático do TechSupport Pro. Não responda este e-mail.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send report email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending report email:", error);
    return false;
  }
}
