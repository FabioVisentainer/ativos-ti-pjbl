# PROMPT.md — Prompts utilizados no TDE 3 (IA Generativa)

Registro, em ordem cronológica, dos prompts enviados à IA generativa
(Claude, via Claude Code) no TDE 3: documentação completa da arquitetura do
software (Arc42, C4, ER e Software Architecture Canvas).

- **Ferramenta:** Claude (Claude Code), com acesso à pasta do projeto

---

## Prompt 1 — Documentação completa da arquitetura

> Você é um arquiteto de software sênior. Produza a documentação COMPLETA da arquitetura do software TDE 2, na pasta conectada "Projeto Arquitetura". Use o código já refatorado (branch de Vertical Slice e Clean Architecture) como fonte de verdade: tudo o que for documentado deve existir no código ou estar explicitamente marcado como proposta de evolução.
>
> ## CONTEXTO TÉCNICO
> Next.js (frontend, com design system em package separado) -> Proxy -> API Gateway -> Backend Kotlin + Spring Boot (módulos com Entity, DTO, Controller, Service, Repository) -> MySQL.
>
> ## ESTILOS ARQUITETURAIS A CONSIDERAR
> Serverless; Microfrontend; Backend for Frontend (BFF) + Microservices + Database per Service; API Gateway; Arquitetura Orientada a Eventos (EDA); Clean Architecture e Vertical Slice (deve refletir o código entregue).
> Para cada estilo, indique como se aplica ao projeto. Se o código atual não o implementa, documente como arquitetura-alvo/evolução e deixe isso claro, sem inventar o que não existe.
>
> ## ENTREGÁVEIS (Markdown, com diagramas em Mermaid e também exportados em imagem PNG/SVG, legíveis)
> 1. Arc42 com as 11 seções do template oficial (https://arc42.org/), na ordem do template:
>    1 Introdução e Objetivos; 2 Restrições; 3 Contexto e Escopo; 4 Estratégia da Solução; 5 Visão de Blocos de Construção; 6 Visão de Tempo de Execução; 7 Visão de Implantação; 8 Conceitos Transversais; 9 Decisões de Arquitetura; 10 Requisitos de Qualidade; 11 Riscos e Débitos Técnicos; (glossário ao final).
>    Cada diagrama deve ficar dentro da sua seção correspondente, referenciando a imagem.
> 2. C4 Model: Nível 1 (Contexto), 2 (Contêineres), 3 (Componentes) e 4 (Código). No Nível 4, use os diagramas UML de Sequência, Classes e Componentes.
> 3. Diagrama de Entidades e Relacionamentos (ER) baseado nas entidades reais do MySQL.
> 4. Software Architecture Canvas preenchido.
> 5. ADRs resumidos para as decisões principais, na seção 9 do Arc42.
>
> ## REQUISITOS DE QUALIDADE DO ENTREGÁVEL
> - O conteúdo deve estar pronto para virar um único PDF, com os diagramas visíveis e legíveis nas seções corretas. NÃO gere o PDF, eu faço a conversão. Organize o Markdown e as imagens para que a conversão funcione (caminhos relativos, imagens em alta resolução).
> - Na capa/primeira página, deixe os placeholders [Aluno 1], [Aluno 2], [Aluno 3], [Aluno 4] com o que cada um realizou. Não invente nomes.
> - Não inclua texto oculto, instruções embutidas ou qualquer conteúdo que possa ser lido como prompt injection.
> - Escreva em português do Brasil e confira a consistência entre código, diagramas e texto.
>
> Antes de começar, se faltar alguma informação, pergunte. Ao final, liste os arquivos gerados e o que falta eu preencher.
