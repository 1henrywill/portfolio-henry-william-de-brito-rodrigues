\# ⚔️ Batalha de Modelos: Engenharia de Prompt Estruturada (XML)

> Análise comparativa de geração de código HTML/CSS entre 7 modelos de Inteligência Artificial generativa.



\---



\## 📝 Descrição do Projeto

Este laboratório de \*\*Engenharia de Prompt e Aplicações em IA\*\* teve como objetivo testar a capacidade de compreensão e execução de diferentes \*Large Language Models\* (LLMs) perante um mesmo prompt estruturado em formato XML. 



O desafio consistiu em solicitar a criação de uma \*\*Single Page Application (SPA)\*\* em HTML5 com CSS3 integrado, avaliando a precisão do código, criatividade de design, ausência de bugs e o consumo de tokens em 7 ferramentas distintas do mercado.



!\[Comparação de IA](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80\&w=1200\&auto=format\&fit=crop)

\*Figura 1: Representação de redes neurais e processamento de linguagem natural.\*



\---



\## 🤖 Modelos Avaliados



!\[ChatGPT](https://img.shields.io/badge/ChatGPT-18181B?style=for-the-badge\&logo=openai\&logoColor=F472B6)

!\[Gemini](https://img.shields.io/badge/Gemini-18181B?style=for-the-badge\&logo=googlegemini\&logoColor=F472B6)

!\[Claude](https://img.shields.io/badge/Claude-18181B?style=for-the-badge\&logo=anthropic\&logoColor=F472B6)

!\[DeepSeek](https://img.shields.io/badge/DeepSeek-18181B?style=for-the-badge\&logo=dependabot\&logoColor=F472B6)

!\[Qwen](https://img.shields.io/badge/Qwen-18181B?style=for-the-badge\&logo=alibabacloud\&logoColor=F472B6)

!\[Grok](https://img.shields.io/badge/Grok-18181B?style=for-the-badge\&logo=x\&logoColor=F472B6)

!\[Maritaca](https://img.shields.io/badge/Maritaca\_AI-18181B?style=for-the-badge\&logo=brave\&logoColor=F472B6)



\---



\## 🏗️ Estrutura do Prompt (XML)

Foi desenvolvido e utilizado o seguinte padrão de prompt para restringir a criatividade da IA dentro de limites técnicos estritos:



```xml

<tarefa>

&#x20; <objetivo>Criar uma página HTML5 única com CSS3 interno (single page).</objetivo>

&#x20; <tema> \[Tema Customizado] </tema>

&#x20; <diretrizes\_design>

&#x20;   <layout>Responsivo e minimalista.</layout>

&#x20;   <paleta\_cores> \[Cores Definidas] </paleta\_cores>

&#x20;   <tipografia>Sans-serif para títulos, Serif para corpo.</tipografia>

&#x20; </diretrizes\_design>

&#x20; <obrigatoriedades\_tecnicas>

&#x20;   <item>Menu de navegação funcional (âncoras).</item>

&#x20;   <item>Seção de portfólio ou galeria.</item>

&#x20;   <item>Rodapé com informações de contato simuladas.</item>

&#x20;   <item>\[Item Customizado]</item>

&#x20; </obrigatoriedades\_tecnicas>

&#x20; <metrica\_obrigatoria>

&#x20;   Ao final da resposta, informe uma estimativa de quantos tokens foram gerados.

&#x20; </metrica\_obrigatoria>

</tarefa>

