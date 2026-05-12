import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, FileText, Clock, User, Download } from "lucide-react";

export default function SessionHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Queries
  const { data: sessions, isLoading: sessionsLoading } = trpc.sessions.getTechnicianSessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: reports, isLoading: reportsLoading } = trpc.reports.getTechnicianReports.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation("/technician-dashboard")}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Histórico de Sessões</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Minhas Sessões de Suporte</h2>
          <p className="text-muted-foreground">
            Visualize o histórico de todas as suas sessões de suporte e relatórios
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border/50">
          <button className="pb-3 px-4 font-semibold border-b-2 border-accent">
            Sessões ({sessions?.length || 0})
          </button>
          <button className="pb-3 px-4 text-muted-foreground hover:text-foreground transition-colors">
            Relatórios ({reports?.length || 0})
          </button>
        </div>

        {/* Sessions List */}
        {sessionsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando sessões...</p>
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="card-elegant hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(session.createdAt)}
                        </p>
                      </div>
                    </div>

                    {session.problemDescription && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                          Problema:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300 line-clamp-2">
                          {session.problemDescription}
                        </p>
                      </div>
                    )}

                    {session.solution && (
                      <div className="mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-900 dark:text-green-200 mb-1">
                          Solução:
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-300 line-clamp-2">
                          {session.solution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-elegant">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">Nenhuma sessão registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
