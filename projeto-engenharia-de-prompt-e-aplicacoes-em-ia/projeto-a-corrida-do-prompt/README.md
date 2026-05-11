\# 🗣️ Estudo de Caso: A Corrida do Prompt (Engenharia de IA)



\## 📝 Descrição do Projeto

Este projeto documenta um exercício prático de \*\*Engenharia de Prompts\*\*, com o objetivo de explorar os limites de compreensão, adaptação de persona e interpretação espacial de modelos de Inteligência Artificial generativa. O estudo foca em como a IA reage a restrições progressivas tanto na geração de texto (interpretação de papéis) quanto na síntese de imagens (composição semântica).



\---



\## 🚀 Ferramentas e Técnicas



!\[Engenharia de Prompts](https://img.shields.io/badge/Engenharia\_de\_Prompts-18181B?style=for-the-badge\&logo=openai\&logoColor=F472B6)

!\[Roleplay](https://img.shields.io/badge/Roleplay\_\&\_Persona-18181B?style=for-the-badge\&logo=googlegemini\&logoColor=F472B6)

!\[Geração de Imagens](https://img.shields.io/badge/Geração\_de\_Imagens-18181B?style=for-the-badge\&logo=midjourney\&logoColor=F472B6)



\---



\## 🏴‍☠️ Experimento 1: Geração de Texto (Roleplay Histórico)



\### 🛠️ Solicitações e Refinamento

O objetivo foi forçar a IA a adotar uma persona altamente específica: um pirata/corsário escrevendo um e-mail formal de desculpas a um rei inglês, incorporando gírias da época e uma oferta de perdão.



\*\*Análise de Desempenho:\*\* A IA demonstrou excelente adaptabilidade. Conforme o linguajar foi sendo moldado pelos prompts, o modelo inseriu personagens históricos reais (Capitão William Kidd e Rei Guilherme III) por conta própria e criou uma narrativa de fundo envolvente (o ataque à nau \*Quedagh Merchant\*) para dar peso e contexto ao pedido de desculpas.



\### ✉️ Resultado Gerado

> \*\*Assunto:\*\* Súplica de Perdão e Arrependimento Profundo – Capitão Kidd

> \*\*Para:\*\* Sua Majestade Real, Guilherme III, o Capitão-Mor dos Sete Mares da Inglaterra

> \*\*De:\*\* Capitão William Kidd, Comandante do Casco Adventure Galley

> \*\*Data:\*\* 20 de Novembro do Ano de Nosso Senhor de 1699

> \*\*Local:\*\* Ancorado em Santo Domingo, nas Índias Ocidentais

>

> A Sua Majestade Real,

>

> Salve, Vossa Majestade. Escrevo esta com a mão trêmula, não pelo medo da tormenta, mas pelo peso da consciência. Venho diante de Vosso Trono não para negociar como um mercador, mas para me ajoelhar como um servo arrependido que sabe que navegou em águas proibidas.

>

> Peço humildemente perdão a Vossa Coroa. Confesso que o tomamento da nau \*Quedagh Merchant\* foi um erro de julgamento digno de um grumete inexperiente, não de um Capitão de Vossa confiança. A neblina da ganância e a confusão da batalha cegaram meus olhos por um instante, e acabei ferindo interesses que deveria proteger. 

>

> Não busco justificar o injustificável, Majestade. Sei que o preço para homens como eu, quando erram o rumo, é um colar de cânhamo apertado no pescoço e uma última dança na jig em Execution Dock. A mera ideia de terminar meus dias no locker de Davy Jones com a marca de traidor na alma faz meu sangue gelar mais que as águas do norte.

>

> Não ofereço ouro para comprar vosso perdão, mas devolvo o botim como prova de meu arrependimento. Cada dobrão, cada peça de oito e cada fardo de seda da \*Quedagh Merchant\* serão entregues aos Vossos cofres.

>

> Perdoai este velho lobo do mar, Senhor. Deixai-me lavar esta mancha com serviço honrado, em vez de lavar convés com meu próprio sangue. Prometo que, se Vossa Majestade me permitir viver para ver mais um nascer do sol, minha lealdade será tão firme quanto o carvalho do \*Adventure Galley\*.

>

> Com o mais profundo arrependimento e lealdade eterna,

>

> \*\*William Kidd\*\*

> \*Capitão de Mar e Guerra (e Servo Penitente da Coroa)\*



\---



\## 🧑‍🚀 Experimento 2: Geração de Imagem e Restrições Espaciais



\### 🔄 Processo Iterativo e Análise

O objetivo foi testar as restrições composicionais da IA, exigindo uma mistura de ficção científica (Astronauta em Marte) com arte clássica (estilo Barroco e um Violoncelo), focando na \*\*separação física\*\* de objetos.



1\. \*\*Prompt Inicial:\*\* \*"Faça uma pintura de um astronauta tocando violoncelo em Marte no estilo barroco... O instrumento não deve estar tocando o astronauta..."\*

&#x20;  \* \*\*Análise:\*\* A IA criou a imagem e acertou o cenário, porém não mostrou o rosto humano, ocultando-o no capacete.

2\. \*\*Refinamento:\*\* \*"Distancie o astronauta na imagem, não é necessário que ele toque o instrumento, crie um rosto para ele no estilo barroco."\*

&#x20;  \* \*\*Análise:\*\* A IA conseguiu criar o rosto perfeitamente misturando a estética barroca com o traje, mas o instrumento continuou "colado" ao corpo.

3\. \*\*Correção Espacial:\*\* \*"Faça o astronauta em pé ao lado do violoncelo."\*

&#x20;  \* \*\*Análise:\*\* Sem sucesso. O modelo ignorou a instrução de distanciamento.

4\. \*\*Tentativa Final:\*\* \*"Distancie a imagem, quero vê-lo de corpo inteiro."\*

&#x20;  \* \*\*Análise Final:\*\* Houve uma pequena melhora no enquadramento, mas a IA demonstrou uma falha de interpretação semântica severa: ela entende a relação com o instrumento puramente como o ato de produzir som, tendo extrema dificuldade em separar fisicamente o objeto do personagem na composição final.



<img src="https://placehold.co/1200x500/18181B/F472B6?text=Substitua+pela+imagem+do+Astronauta" width="600" alt="Resultado Astronauta Barroco">



\*Figura 1: A imagem final expõe a limitação da IA em interpretar comandos estritos de separação física entre personagem e instrumento.\*



\---

\[Voltar ao início](https://github.com/henrywilliamr20/portfolio)

