# IALegenda — Editor de Legendas

Editor de legendas para vídeos que funciona diretamente no navegador, com transcrição de áudio por IA, estilos de legendas, destaque palavra por palavra e exportação do vídeo com as legendas incorporadas.

O IALegenda foi desenvolvido para funcionar de forma **local no navegador**, sem necessidade de login ou envio do vídeo para um servidor. A transcrição utiliza modelos Whisper através do Transformers.js, enquanto a renderização final do vídeo utiliza FFmpeg.wasm.

## ✨ Recursos

* 🎬 Upload de vídeos e arquivos de áudio
* 📁 Suporte a MP4, MOV, WebM, MP3 e WAV
* 🧠 Transcrição automática com Whisper
* ⚡ Suporte a WebGPU quando disponível
* 💻 Fallback automático para CPU caso WebGPU não esteja disponível
* 🌎 Seleção de idioma
* 🔤 Português (BR), Inglês, Espanhol, Francês, Alemão, Japonês e Coreano
* 🔍 Detecção automática de idioma
* 🌐 Tradução da transcrição para inglês
* 📝 Importação de arquivos `.SRT` e `.VTT`
* 🎨 Diversos estilos de legendas
* ✏️ Editor visual de estilos
* 🔤 Diferentes fontes
* 💪 Controle de peso da fonte
* 📐 Controle de tamanho e posição
* 🎨 Cores personalizáveis
* 🌈 Destaque de palavras
* 💥 Animação de destaque palavra por palavra
* 🖍️ Fundo para palavras destacadas
* 🌑 Sombra
* 🖌️ Contorno
* ✨ Efeitos de glow em estilos compatíveis
* 🔠 Texto em maiúsculas
* 📱 Área segura para visualização
* 📐 Proporções Original, 9:16, 4:5 e 1:1
* ▶️ Controle de reprodução
* ⏩ Velocidade de reprodução de 0.5× até 2×
* ✂️ Divisão de legendas
* ➕ Adição de novas linhas
* 🗑️ Exclusão de linhas
* ⏱️ Edição dos tempos das legendas
* ✏️ Edição individual do texto
* 🔄 Reagrupamento automático das legendas
* 💾 Salvamento de projetos em JSON
* 📂 Abertura de projetos salvos
* 📄 Exportação `.SRT`
* 📄 Exportação `.VTT`
* 📄 Exportação `.TXT`
* 🎥 Exportação do vídeo com legendas incorporadas

A interface também possui uma versão adaptada para dispositivos móveis, incluindo uma barra de ações inferior.

## 🤖 Transcrição com IA

A transcrição é executada diretamente no navegador usando:

* `@huggingface/transformers`
* Whisper Tiny
* Whisper Base
* Whisper Small

Modelos disponíveis:

| Modelo        | Característica                          |
| ------------- | --------------------------------------- |
| Whisper Tiny  | Mais rápido e aproximadamente 40 MB     |
| Whisper Base  | Equilibrado e aproximadamente 80 MB     |
| Whisper Small | Maior precisão e aproximadamente 250 MB |

O projeto utiliza timestamps por palavra para permitir o destaque sincronizado durante a reprodução.

Durante o processamento, o editor apresenta etapas como:

1. Transcrevendo áudio
2. Detectando palavras-chave
3. Montando legendas

## 🎨 Estilos de Legendas

O editor possui uma biblioteca de estilos prontos, incluindo estilos como:

* HORMOZI 1
* HORMOZI 2
* BEAST
* Negativa
* Cove
* LEON
* LAGUNA
* Tuba
* Splitz
* Aria
* Stack
* Lume
* MARCA
* Canto
* Silk
* SLASH
* Dense
* Open
* Vibe
* Rise
* PRISM
* Neon
* Ice
* Sunset
* Mono
* Clean
* Bold Box
* Podcast
* Retro
* Punch

Os estilos podem ser filtrados entre **Todos**, **Padrão** e **Custom**.

Também é possível criar novos temas personalizados a partir das configurações atuais.

## ✏️ Personalização

O editor permite controlar:

* Fonte principal
* Fonte do destaque
* Peso da fonte
* Itálico
* Maiúsculas/minúsculas
* Tamanho
* Posição vertical
* Cor do texto
* Cor do destaque
* Sombra
* Cor da sombra
* Contorno
* Cor do contorno
* Fundo do destaque
* Opacidade do fundo
* Raio do fundo
* Quantidade de palavras por bloco

As fontes utilizadas incluem:

* Inter
* Montserrat
* Poppins
* Oswald
* Bebas Neue
* Anton
* Playfair Display

## 📝 Editor de Legendas

Depois da transcrição, as legendas podem ser editadas diretamente no editor.

É possível:

* Alterar o texto de cada palavra
* Alterar início e fim da legenda
* Dividir uma legenda em duas
* Apagar uma legenda
* Adicionar uma nova legenda
* Pré-visualizar uma legenda
* Reagrupar as palavras automaticamente

O editor mantém timestamps individuais das palavras quando esses dados estão disponíveis.

## 🎥 Pré-visualização

O vídeo possui uma área de preview em tempo real com:

* Legendas sincronizadas
* Destaque da palavra atual
* Animação de entrada
* Animação de destaque
* Área segura
* Controle de velocidade
* Play/Pause
* Mostrar/ocultar legendas
* Diferentes proporções

As proporções disponíveis são:

* Original
* 9:16
* 4:5
* 1:1

## 🎬 Exportação do vídeo

A exportação utiliza FFmpeg.wasm diretamente no navegador.

O processo gera frames PNG das legendas e posteriormente os compõe sobre o vídeo utilizando FFmpeg.

O vídeo final é exportado como:

```text
video-com-legenda.mp4
```

A codificação utiliza:

* H.264 (`libx264`)
* Preset `ultrafast`
* CRF 23
* Pixel format `yuv420p`
* Áudio AAC
* 128 kbps
* `+faststart`

## 📄 Exportação de Legendas

O projeto permite exportar as legendas separadamente.

### SRT

```text
legenda.srt
```

### VTT

```text
legenda.vtt
```

### TXT

```text
legenda.txt
```

Os arquivos são gerados diretamente no navegador através de `Blob` e download local.

## 💾 Projetos

As configurações e legendas podem ser salvas em um arquivo JSON.

Exemplo de informações armazenadas:

* Estilo selecionado
* Posição
* Tamanho
* Cores
* Fontes
* Pesos
* Maiúsculas
* Contorno
* Fundo
* Opacidade
* Raio
* Blocos de legenda

O arquivo é salvo como:

```text
projeto.json
```

Um projeto salvo pode ser carregado posteriormente e aplicado novamente ao vídeo.

## 🔒 Privacidade

O processamento foi projetado para acontecer localmente no navegador.

O vídeo e o áudio são processados no dispositivo do usuário, enquanto os modelos e bibliotecas necessários são carregados através das CDNs utilizadas pelo projeto.

A interface apresenta o projeto como:

> 100% local · grátis

e informa que o conteúdo não sai do dispositivo durante o processamento.

## ⚙️ Tecnologias

O projeto utiliza:

* HTML5
* CSS3
* JavaScript ES Modules
* Web Audio API
* Canvas API
* WebGPU
* Transformers.js
* Hugging Face Transformers
* Whisper
* FFmpeg.wasm
* HTML5 Video API

A biblioteca Transformers.js é carregada via CDN:

```text
https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2
```

O FFmpeg é carregado sob demanda através da CDN do unpkg.

## 📦 Estrutura

O projeto atual pode funcionar como uma aplicação estática de arquivo único:

```text
/
└── index.html
```

Todo o HTML, CSS e JavaScript principal estão concentrados no `index.html`.

As dependências externas são carregadas por CDN.

## 🚀 Como executar

Como o projeto é baseado em HTML, CSS e JavaScript no navegador, basta disponibilizar o `index.html` em um servidor web estático.

Exemplos:

* Vercel
* GitHub Pages
* Netlify
* Cloudflare Pages
* Qualquer hospedagem estática

Também pode ser aberto localmente em um navegador moderno, embora alguns recursos de processamento e APIs do navegador funcionem melhor quando servidos por HTTP/HTTPS.

## 🌐 Navegadores

Para melhor desempenho, recomenda-se utilizar versões recentes de:

* Google Chrome
* Microsoft Edge
* Firefox
* Safari

O desempenho da transcrição e exportação depende diretamente do hardware do dispositivo, navegador, disponibilidade de WebGPU, tamanho do vídeo e quantidade de legendas.

## ⚠️ Desempenho

A transcrição e principalmente a renderização final são operações pesadas.

O FFmpeg é carregado somente quando necessário, reduzindo o carregamento inicial da aplicação. O código também utiliza WebGPU quando disponível e possui fallback para CPU.

Vídeos maiores ou projetos com muitas legendas podem exigir mais memória e processamento.

## 📱 Responsividade

A interface possui layouts específicos para desktop e dispositivos móveis.

Em telas menores:

* O editor passa para uma única coluna
* O preview aparece antes dos controles
* As ações principais ficam em uma barra inferior
* A grade de estilos se adapta ao tamanho da tela
* Os controles são reorganizados para uso em telas pequenas

## 🛡️ Segurança

O texto das legendas é tratado antes de ser inserido no HTML de preview, utilizando escape de HTML para evitar interpretação direta de conteúdo como markup.

## 🇧🇷 Sobre

**IALegenda** é um editor de legendas focado em criação rápida de vídeos para redes sociais, com processamento local, estilos modernos e recursos de edição diretamente no navegador.

**IALegenda Free · Whisper AI + FFmpeg.wasm · 100% local · Feito no Brasil**
