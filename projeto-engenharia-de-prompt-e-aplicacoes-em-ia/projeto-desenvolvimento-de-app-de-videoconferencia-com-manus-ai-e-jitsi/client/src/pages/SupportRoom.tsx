import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import JitsiMeet from "@/components/JitsiMeet";
import { Phone, LogOut, Clock, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SupportRoom() {
  const [, params] = useRoute("/room/:id");
  const [, setLocation] = useLocation();
  const roomId = params?.id ? parseInt(params.id) : null;

  const [room, setRoom] = useState<any>(null);
  const [clientName, setClientName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Get room data
  const getRoomQuery = trpc.rooms.getById.useQuery(
    { roomId: roomId || 0 },
    { enabled: !!roomId }
  );

  // Update room status
  const updateStatusMutation = trpc.rooms.updateStatus.useMutation({
    onError: (error) => {
      console.error("Error updating room status:", error);
    },
  });

  // Update client name
  const updateClientNameMutation = trpc.rooms.updateClientName.useMutation({
    onError: (error) => {
      console.error("Error updating client name:", error);
    },
  });

  useEffect(() => {
    // Get client name from session storage
    const storedClientName = sessionStorage.getItem("clientName");
    if (storedClientName) {
      setClientName(storedClientName);
    }

    // Load room data
    if (getRoomQuery.data) {
      setRoom(getRoomQuery.data);
      setIsLoading(false);

      // Update client name in room if not already set
      if (storedClientName && !getRoomQuery.data.clientName) {
        updateClientNameMutation.mutate({
          roomId: getRoomQuery.data.id,
          clientName: storedClientName,
        });
      }
    }
  }, [getRoomQuery.data]);

  const handleConferenceJoined = () => {
    setSessionStartTime(new Date());
    
    // Update room status to in_progress
    if (room) {
      updateStatusMutation.mutate({
        roomId: room.id,
        status: "in_progress",
      });
    }
  };

  const handleConferenceLeft = () => {
    // Update room status to completed
    if (room) {
      updateStatusMutation.mutate({
        roomId: room.id,
        status: "completed",
      });
    }

    // Redirect to home after a delay
    setTimeout(() => {
      setLocation("/");
    }, 2000);
  };

  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor(
          (now.getTime() - sessionStartTime.getTime()) / 1000
        );
        setSessionDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (isLoading || !room) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Carregando sala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold">{room.roomName}</h1>
              <p className="text-sm text-muted-foreground">
                Código: <span className="font-mono font-semibold">{room.roomCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Session Info */}
            {sessionStartTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-mono">{formatDuration(sessionDuration)}</span>
              </div>
            )}

            {/* Client Info */}
            {clientName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-accent" />
                <span>{clientName}</span>
              </div>
            )}

            {/* Leave Button */}
            <Button
              onClick={() => {
                handleConferenceLeft();
              }}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Jitsi Meet Container */}
      <div className="flex-1 overflow-hidden">
        <JitsiMeet
          roomName={room.jitsiRoomName}
          userName={clientName || "Visitante"}
          onConferenceJoined={handleConferenceJoined}
          onConferenceLeft={handleConferenceLeft}
        />
      </div>

      {/* Footer Info */}
      {room.status === "waiting" && (
        <div className="border-t border-border/50 bg-blue-50 dark:bg-blue-950/30 p-4">
          <div className="container flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-900 dark:text-blue-200">
              Aguardando o técnico entrar na sala...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
