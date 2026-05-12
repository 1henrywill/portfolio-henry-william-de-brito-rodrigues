import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Phone, Headphones, ArrowRight, Shield, Clock, FileText } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-semibold">TechSupport Pro</h1>
          </div>
          {isAuthenticated && user && (
            <div className="text-sm text-muted-foreground">
              Bem-vindo, <span className="font-semibold text-foreground">{user.name}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-border/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Suporte Técnico <span className="gradient-text">Remoto</span> Elegante
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Conecte técnicos e clientes em videochamadas seguras com transcrição automática e geração de relatórios inteligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/technician-dashboard")}
              className="btn-primary text-lg h-12 px-8 flex items-center gap-2"
            >
              <Headphones className="w-5 h-5" />
              Sou Técnico
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setLocation("/client-access")}
              className="btn-secondary text-lg h-12 px-8 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Preciso de Suporte
              <ArrowRight className="w-5 h-5" />
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Recursos Sofisticados
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Videochamadas Seguras</h4>
              </div>
              <p className="text-muted-foreground">
                Integração com Jitsi Meet para videochamadas de alta qualidade diretamente no navegador, sem necessidade de instalação.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Relatórios Automáticos</h4>
              </div>
              <p className="text-muted-foreground">
                Transcrição automática de áudio e geração inteligente de resumos ao final de cada sessão de suporte.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Histórico Completo</h4>
              </div>
              <p className="text-muted-foreground">
                Painel exclusivo do técnico com histórico de todas as sessões, transcrições e relatórios gerados.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Acesso por Código</h4>
              </div>
              <p className="text-muted-foreground">
                Clientes entram nas salas de suporte usando um código único compartilhável, sem necessidade de autenticação.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Notificações em Tempo Real</h4>
              </div>
              <p className="text-muted-foreground">
                Receba notificações instantâneas quando clientes entram na sua sala de suporte, com e-mail automático.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-elegant">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Resumos Inteligentes</h4>
              </div>
              <p className="text-muted-foreground">
                Resumos automáticos destacando problemas relatados e soluções aplicadas em cada atendimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-accent/5 border-t border-border/50">
        <div className="container text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Começar?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Escolha seu perfil abaixo e comece a oferecer suporte técnico remoto de forma elegante e profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/technician-dashboard")}
              className="btn-primary text-lg h-12 px-8"
            >
              Painel do Técnico
            </Button>
            <Button
              onClick={() => setLocation("/client-access")}
              className="btn-secondary text-lg h-12 px-8"
            >
              Entrar como Cliente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 TechSupport Pro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
