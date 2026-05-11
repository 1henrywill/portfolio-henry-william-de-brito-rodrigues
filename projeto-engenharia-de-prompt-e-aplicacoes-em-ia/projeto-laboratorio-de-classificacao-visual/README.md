# 👁️ Laboratório de Classificação Visual: Análise de Viés em IA
 
## 📝 Descrição do Projeto

Este projeto consiste em um experimento prático focado na identificação e mitigação de viés algorítmico em modelos de visão computacional. O objetivo principal é demonstrar como um *dataset* enviesado compromete a eficácia de uma Inteligência Artificial, gerando falsos positivos e negativos, e refletir sobre os impactos éticos dessas falhas no mundo real.
 
[cite_start]Desenvolvido como parte do laboratório de IA na Universidade Cidade de São Paulo (UNICID), o sistema foi treinado no **Teachable Machine** do Google[cite: 73]. [cite_start]Embora o foco ético direcione-se a vieses de perfis sociais, o experimento técnico demonstrou o mecanismo de falha através da classificação de objetos ("Garrafa com gás" vs. "Garrafa sem gás") [cite: 80, 81, 82, 83][cite_start], atingindo níveis de confiança que variam entre falsas certezas (99% e 100%) e confusões preditivas (77% vs 23%)[cite: 84, 100, 104, 125].
 
<img src="[https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop](https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop)" width="600" alt="Dashboard de Visão Computacional">

*Figura 1: Interface de treinamento e teste de inferência de imagem.*
 
## 🚀 Tecnologias Utilizadas

* **Plataforma:** Google Teachable Machine
* **Conceitos:** Visão Computacional, *Machine Learning*, Curadoria de Dados
* **Ferramentas:** Webcam para inferência em tempo real, Navegador Web
 
## 📊 Memorial de Impacto e Ética (Resultados e Aprendizados)

A análise do comportamento do modelo perante dados enviesados revelou vulnerabilidades críticas no treinamento de IA. Abaixo, a análise ética estruturada conforme os parâmetros do laboratório:
 
* [cite_start]**Mecanismo do Viés:** A seleção restrita e a falta de diversidade de imagens **confunde** a inteligência artificial, que **gera** e **apresenta** informações errôneas[cite: 67]. Essa limitação no *dataset* **corrompe** a lógica do algoritmo e **cria** uma visão distorcida e limitada da realidade.
* **Consequência Social:** O sistema **marginaliza** e **invisibiliza** indivíduos quando os **classifica** fora do padrão de treinamento. [cite_start]Se nós **treinamos** a IA para errar, isso **propaga** desinformações e *fake news*[cite: 68], o que **afeta** severamente o bem-estar emocional e as oportunidades profissionais das pessoas afetadas.
* **Ação Mitigadora:** A intervenção de *Human-in-the-loop* **garante** a equidade no processo. [cite_start]Um revisor humano **analisa** a curadoria para que os dados sejam corrigidos antes do uso do modelo, o que **evita** a propagação de falhas e **corrige** possíveis injustiças algorítmicas[cite: 69].
 
<img src="[https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1200&auto=format&fit=crop](https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1200&auto=format&fit=crop)" width="600" alt="Análise Ética de Dados">

*Figura 2: Análise métrica do viés e representação do impacto no processo de classificação.*
 
## 🔧 Como Executar

1. [cite_start]Acesse o ambiente do modelo já treinado através do link direto do projeto: `https://teachablemachine.withgoogle.com/models/PLAZeLclF_/`[cite: 66].
2. Autorize o uso da Webcam no navegador.
3. [cite_start]Aponte objetos (garrafas d'água com diferentes rótulos) ou simule diferentes posturas para a câmera[cite: 76, 77].
4. [cite_start]Observe a barra de "Output" oscilar e prever a classificação com base no *dataset* restrito fornecido[cite: 79, 97, 117].
 
<img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop" width="600" alt="Demonstração do Fluxo de Dados de IA">

*Figura 3: Representação visual do pipeline de dados e inferência ao vivo da IA.*
 
---
**Desenvolvedor:** Henry William de Brito Rodrigues
[Voltar ao início](https://github.com/henrywilliamr20/portfolio)