# ⚙️ Engenharia de Software e IA com Bubble.io

## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento de uma aplicação web de **gestão de orçamentos** utilizando a plataforma no-code **Bubble.io** com aceleração por Inteligência Artificial, aplicando rigorosamente os fundamentos de engenharia de software para garantir segurança, escalabilidade e governança.

Desenvolvido como parte da disciplina de **Engenharia de Prompt e Aplicações em IA**, o sistema gerencia orçamentos vinculados a clientes e projetos, com isolamento de dados por usuário, option sets para status e workflows organizados com cores e comentários.

## 🔗 Link da Aplicação
[![Bubble App](https://img.shields.io/badge/Acessar_App-18181B?style=for-the-badge&logo=google-chrome&logoColor=F472B6)](https://henrywilliamr20.bubbleapps.io/version-test?debug_mode=true)

## 🚀 Tecnologias Utilizadas
* **Plataforma:** Bubble.io (No-code)
* **IA Generativa:** Bubble AI (geração do blueprint inicial)
* **Banco de Dados:** Bubble Data (modelagem relacional via Data Types)
* **Segurança:** Privacy Rules (Privacy by Design)
* **Exportação de Dados:** Data API (JSON)

---

## 🗄️ Arquitetura e Modelagem de Dados

O banco de dados foi planejado antes da construção das telas, seguindo boas práticas de engenharia de software.

### Entidades (Data Types)

| Tabela | Descrição |
| :--- | :--- |
| `empresa` | Empresas cadastradas no sistema |
| `usuario` | Usuários com acesso ao sistema |
| `cliente` | Clientes vinculados a uma empresa |
| `catalogo_de_servicos` | Serviços disponíveis para orçamento |
| `budget` | Orçamento principal vinculado a um cliente e criador |
| `orcamento_item` | Itens filhos de um orçamento (relação N:1 com budget) |
| `fase_projeto` | Option Set de fases do projeto |
| `projeto` | Projetos vinculados a clientes, fases e orçamentos |
| `despesa_projeto` | Despesas associadas a um projeto |

### Relações principais
- `budget` → `cliente` (N:1) — um orçamento pertence a um cliente
- `budget` → `usuario` (N:1) — um orçamento pertence a um criador
- `orcamento_item` → `budget` (N:1) — itens pertencem a um orçamento
- `projeto` → `budget` (N:1) — projeto originado de um orçamento aprovado

> **Regra aplicada:** nenhum campo do tipo "Lista de Orçamentos" foi criado dentro da tabela Cliente, evitando degradação de performance acima de 100 itens.

### Option Sets (Status do Orçamento)
| Valor | Descrição |
| :--- | :--- |
| `Pendente` | Aguardando aprovação do cliente |
| `Aprovado` | Orçamento aceito e em execução |
| `Cancelado` | Orçamento recusado ou cancelado |

---

## 🔒 Segurança e Privacidade (Privacy by Design)

Seguindo o **OWASP Top Ten para Low-Code/No-Code**, as seguintes regras foram aplicadas na aba **Data > Privacy** do Bubble:

- ❌ Removida a regra padrão **"Publicly visible"** gerada pela IA
- ✅ Criada regra **"Apenas o Criador"**: `This Budget's Creator is Current User`
- ✅ Apenas o usuário criador consegue visualizar e buscar seus próprios orçamentos
- ✅ Nenhum dado de outro usuário é exposto na interface ou via API

---

## 📊 Resultados e Aprendizados

* **Isolamento de dados validado:** usuários logados não conseguem visualizar dados criados por outros usuários.
* **Zero hardcode:** todos os status do sistema utilizam Option Sets, eliminando textos soltos nas condições.
* **Otimização de WUs:** buscas ao banco de dados configuradas apenas no Repeating Group, evitando queries redundantes nas células individuais.
* **Governança aplicada:** workflows organizados com cores (🟢 Verde = Sucesso/Navegação, 🔴 Vermelho = Exclusão) e comentados via recurso Notes do Bubble.

---

## 🚪 Estratégia de Saída (Anti Vendor Lock-in)

O Bubble retém a posse do código-fonte gerado pela plataforma. Para mitigar o risco de **Vendor Lock-in**, a estratégia de saída planejada é:

1. **Habilitação da Data API** do Bubble para exportar todas as tabelas (`budget`, `cliente`, `usuario`, `orcamento_item`) via JSON
2. **Reescrita progressiva** em stack tradicional: **React** (frontend) + **Node.js/Express** (backend) + **PostgreSQL** (banco de dados)
3. O schema SQL completo já está documentado no arquivo `orcamento_schema.sql` desta pasta, permitindo recriar o banco de dados a qualquer momento fora do Bubble

---

## 📁 Arquivos desta Pasta

| Arquivo | Descrição |
| :--- | :--- |
| `README.md` | Documentação completa do projeto |
| `orcamento_schema.sql` | Schema SQL completo com todas as tabelas, índices e dados de exemplo |
| `export_budgets.pdf` | Export dos dados reais cadastrados na aplicação Bubble |

---

[Voltar ao início](https://github.com/1henrywill/portfolio-henry-william-de-brito-rodrigues)
