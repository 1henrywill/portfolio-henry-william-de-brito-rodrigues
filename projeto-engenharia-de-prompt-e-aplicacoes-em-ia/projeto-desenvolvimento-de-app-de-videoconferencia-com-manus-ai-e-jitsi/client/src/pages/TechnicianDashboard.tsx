import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Copy, CheckCircle2, Clock, LogOut, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [roomName, setRoomName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = trpc.rooms.getTechnicianRooms.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const createRoomMutation = trpc.rooms.create.useMutation({
    onSuccess: () => {
      toast.success("Sala criada com sucesso!");
      setRoomName("");
      setIsOpen(false);
      refetchRooms();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar sala");
    },
  });

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast.error("Digite um nome para a sala");
      return;
    }
    createRoomMutation.mutate({ roomName });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado para a área de transferência!");
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Você precisa estar autenticado</p>
          <Button onClick={() => setLocation("/")} className="btn-primary">
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-semibold">TechSupport Pro</h1>
            <span className="text-sm text-muted-foreground">Painel do Técnico</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{user?.name}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Minhas Salas de Suporte</h2>
            <p className="text-muted-foreground">
              Crie novas salas de suporte e compartilhe os códigos com seus clientes
            </p>
          </div>
          <Button
            onClick={() => setLocation("/session-history")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Histórico
          </Button>
        </div>

        {/* Create Room Button */}
        <div className="mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Nova Sala
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Sala de Suporte</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da Sala</label>
                  <Input
                    placeholder="Ex: Suporte Windows Server"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateRoom();
                    }}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={createRoomMutation.isPending}
                    className="btn-primary"
                  >
                    {createRoomMutation.isPending ? "Criando..." : "Criar Sala"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rooms Grid */}
        {roomsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando salas...</p>
          </div>
        ) : rooms && rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="card-elegant hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{room.roomName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Código: <span className="font-mono font-semibold text-foreground">{room.roomCode}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
                      {room.status === "waiting" && (
                        <>
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-xs font-medium text-accent">Aguardando</span>
                        </>
                      )}
                      {room.status === "in_progress" && (
                        <>
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-medium text-green-500">Em andamento</span>
                        </>
                      )}
                      {room.status === "completed" && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-medium text-blue-500">Encerrada</span>
                        </>
                      )}
                    </div>
                  </div>

                  {room.clientName && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Cliente: <span className="font-semibold text-foreground">{room.clientName}</span>
                    </p>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Criada em: {new Date(room.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <Button
                    onClick={() => handleCopyCode(room.roomCode)}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Código
                  </Button>
                  <Button
                    onClick={() => setLocation(`/room/${room.id}`)}
                    className="flex-1 btn-primary text-sm"
                  >
                    Entrar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-elegant">
            <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-4">Nenhuma sala criada ainda</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="btn-primary"
            >
              Criar Primeira Sala
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
