import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { Phone, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ClientAccess() {
  const [, setLocation] = useLocation();
  const [roomCode, setRoomCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterRoom = async (): Promise<void> => {
    if (!roomCode.trim()) {
      toast.error("Digite o código da sala");
      return;
    }
    if (!clientName.trim()) {
      toast.error("Digite seu nome");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch room data using REST API
      const encodedInput = encodeURIComponent(
        JSON.stringify({ roomCode: roomCode.toUpperCase() })
      );
      const response = await fetch(
        `/api/trpc/rooms.getByCode?input=${encodedInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Sala não encontrada"
        );
      }

      const data = await response.json();
      const room = data.result?.data;

      if (!room) {
        throw new Error("Sala não encontrada");
      }

      // Store room info and navigate
      sessionStorage.setItem("currentRoom", JSON.stringify(room));
      sessionStorage.setItem("clientName", clientName);
      
      // Create session when entering
      try {
        await fetch("/api/trpc/sessions.create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: room.id,
            technicianId: room.technicianId,
            clientName: clientName,
          }),
        });
      } catch (e) {
        console.error("Error creating session:", e);
      }

      setLocation(`/room/${room.id}`);
    } catch (error: any) {
      toast.error(error.message || "Sala não encontrada");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-semibold">TechSupport Pro</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="card-elegant w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Entrar em Sala de Suporte</h2>
            <p className="text-muted-foreground">
              Digite o código da sala fornecido pelo técnico
            </p>
          </div>

          <div className="space-y-4">
            {/* Client Name Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Seu Nome</label>
              <Input
                placeholder="Digite seu nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && roomCode.trim()) handleEnterRoom();
                }}
              />
            </div>

            {/* Room Code Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Código da Sala</label>
              <Input
                placeholder="Ex: ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && clientName.trim()) handleEnterRoom();
                }}
                maxLength={6}
                className="font-mono text-center text-lg tracking-widest"
              />
            </div>

            {/* Info Box */}
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Você não precisa de autenticação. Apenas compartilhe seu nome e o código fornecido pelo técnico.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleEnterRoom}
              disabled={isLoading || !roomCode.trim() || !clientName.trim()}
              className="btn-primary w-full h-12 text-base"
            >
              {isLoading ? "Conectando..." : "Entrar na Sala"}
            </Button>

            {/* Back to Home */}
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="w-full"
            >
              Voltar para Home
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>
              Não tem um código? Peça ao técnico de suporte para criar uma sala.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
