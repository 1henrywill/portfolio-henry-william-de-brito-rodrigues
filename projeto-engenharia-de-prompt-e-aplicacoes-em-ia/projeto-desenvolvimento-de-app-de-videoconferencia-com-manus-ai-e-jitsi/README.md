# 🎥 TechSupport Pro — Suporte Técnico Remoto com Jitsi Meet

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-18181B?style=for-the-badge&logo=typescript&logoColor=F472B6)
![React](https://img.shields.io/badge/React-18181B?style=for-the-badge&logo=react&logoColor=F472B6)
![Node.js](https://img.shields.io/badge/Node.js-18181B?style=for-the-badge&logo=node.js&logoColor=F472B6)

## 🔗 Link da Aplicação
[![Acessar App](https://img.shields.io/badge/Acessar_App-18181B?style=for-the-badge&logo=google-chrome&logoColor=F472B6)](https://remotesupp-sgewzyvk.manus.space)

## 📲 QR Code para Acesso
> Escaneie o QR Code abaixo para acessar o aplicativo diretamente no seu dispositivo.

![QR Code](./qrcode-download.pdf)

---

## 📝 Descrição do Projeto
O **TechSupport Pro** é uma aplicação web full-stack de **suporte técnico remoto** que integra videochamadas em tempo real via **Jitsi Meet** com transcrição automática de áudio e geração inteligente de relatórios de atendimento.

O problema que resolve é concreto: técnicos de TI precisam atender clientes remotamente de forma eficiente, sem obrigar o cliente a instalar softwares, e ainda precisam documentar cada sessão automaticamente para fins de histórico e qualidade.

Desenvolvido como parte da disciplina de **Engenharia de Prompt e Aplicações em IA**, o app foi estruturado e desenvolvido com assistência da **Manus AI**, que gerou a arquitetura base da aplicação full-stack.

---

## 💡 Proposta de Valor

| Problema | Solução |
| :--- | :--- |
| Atendimentos sem documentação automática | Transcrição de áudio e geração de relatório ao encerrar a sessão |
| Cliente precisa instalar software | Videochamada direto no navegador via Jitsi Meet |
| Técnico perde histórico de atendimentos | Painel com histórico completo de sessões, transcrições e relatórios |
| Acesso complexo para o cliente | Entrada por código único compartilhável, sem cadastro necessário |

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **React 19** — Interface de usuário
* **TypeScript** — Tipagem estática
* **Tailwind CSS v4** — Estilização
* **Radix UI + shadcn/ui** — Componentes acessíveis
* **tRPC + TanStack Query** — Comunicação cliente-servidor tipada
* **Framer Motion** — Animações
* **Jitsi Meet (API)** — Videochamadas no navegador

### Backend
* **Node.js + Express** — Servidor HTTP
* **tRPC** — API type-safe
* **Drizzle ORM** — ORM para banco de dados
* **MySQL** — Banco de dados relacional
* **AWS S3** — Armazenamento de áudio
* **Manus AI (LLM)** — Geração de resumos e relatórios inteligentes

### Infraestrutura
* **Vite** — Build e bundler
* **Vitest** — Testes automatizados
* **Manus Space** — Hospedagem

---

## 🗄️ Modelagem de Dados

| Tabela | Descrição |
| :--- | :--- |
| `users` | Usuários com roles: `user`, `admin`, `technician` |
| `support_rooms` | Salas de suporte com código único e status (`waiting`, `in_progress`, `completed`) |
| `support_sessions` | Sessões de atendimento com duração, transcrição e solução |
| `transcriptions` | Transcrições de áudio com status de processamento |
| `reports` | Relatórios gerados automaticamente por sessão |

---

## ✨ Funcionalidades

* **Videochamadas Seguras** — Integração com Jitsi Meet diretamente no navegador, sem instalação
* **Acesso por Código** — Cliente entra na sala com código único, sem necessidade de cadastro
* **Transcrição Automática** — Áudio da sessão transcrito automaticamente ao encerrar
* **Relatórios Inteligentes** — Resumo gerado por IA com problema relatado e solução aplicada
* **Painel do Técnico** — Histórico completo de sessões, transcrições e relatórios
* **Notificações em Tempo Real** — Alerta por e-mail quando o cliente entra na sala
* **Autenticação OAuth** — Login via Manus OAuth com controle de roles

---

## ⚙️ Como Executar Localmente

### Pré-requisitos
* Node.js 18+
* pnpm
* MySQL

### Instalação

```bash
# Clone o repositório
git clone https://github.com/1henrywill/portfolio-henry-william-de-brito-rodrigues
cd projeto-engenharia-de-prompt-e-aplicacoes-em-ia/projeto-desenvolvimento-de-app-de-videoconferencia-com-manus-ai-e-jitsi

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais de banco de dados e AWS

# Execute as migrações do banco
pnpm db:push

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Scripts disponíveis

| Comando | Descrição |
| :--- | :--- |
| `pnpm dev` | Inicia em modo desenvolvimento |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Inicia em modo produção |
| `pnpm test` | Executa os testes |
| `pnpm db:push` | Aplica migrações do banco |

---

## 🤖 Papel da Manus AI no Desenvolvimento

A Manus AI foi utilizada para:
- Gerar a **arquitetura full-stack completa** (cliente React + servidor Express + banco MySQL)
- Implementar a **integração com o Jitsi Meet**
- Criar o **sistema de transcrição de áudio** com AWS S3
- Desenvolver a **geração automática de relatórios** via LLM
- Estruturar o **sistema de autenticação OAuth** com controle de roles
- Gerar os **testes automatizados** com Vitest

---

## 📁 Estrutura do Projeto

```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis (JitsiMeet, Dashboard...)
│   │   ├── pages/        # Páginas (Home, TechnicianDashboard, SupportRoom...)
│   │   └── hooks/        # Hooks customizados
├── server/               # Backend Node.js + Express
│   ├── _core/            # Infraestrutura (auth, LLM, transcrição, e-mail)
│   ├── routers.ts        # Rotas tRPC
│   ├── db.ts             # Conexão com banco
│   └── transcription.ts  # Serviço de transcrição
├── drizzle/              # Schema e migrações do banco
├── shared/               # Tipos compartilhados entre cliente e servidor
└── README.md
```

---

[Voltar ao início](https://github.com/1henrywill/portfolio-henry-william-de-brito-rodrigues)
