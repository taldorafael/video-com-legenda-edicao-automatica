# Editor Automático de IA que Adiciona Legendas em Vídeos

Editor automático de IA para adicionar legendas em vídeos diretamente pelo navegador, com transcrição de áudio utilizando Whisper, personalização visual das legendas, edição dos textos e tempos, pré-visualização em tempo real e exportação do vídeo com as legendas incorporadas.

O projeto foi desenvolvido para realizar o processamento localmente no navegador, utilizando **Transformers.js**, **Whisper** e **FFmpeg.wasm**.

## ✨ Recursos

* 🎬 Upload de vídeos e arquivos de áudio
* 📁 Suporte para MP4, MOV, WebM, MP3 e WAV
* 🤖 Transcrição automática utilizando IA
* 🧠 Whisper para reconhecimento de fala
* ⚡ Utilização de WebGPU quando disponível
* 💻 Fallback automático para CPU
* 🌎 Seleção de idioma da transcrição
* 🇧🇷 Português (Brasil)
* 🇺🇸 Inglês
* 🇪🇸 Espanhol
* 🇫🇷 Francês
* 🇩🇪 Alemão
* 🇯🇵 Japonês
* 🇰🇷 Coreano
* 🔍 Detecção automática de idioma
* 🌐 Tradução da transcrição para inglês
* 📝 Importação de legendas SRT
* 📝 Importação de legendas VTT
* 🎨 Diversos estilos de legendas
* ✏️ Personalização completa dos estilos
* 🔤 Diferentes fontes
* 💪 Controle de peso da fonte
* 📐 Controle de tamanho
* 📍 Controle de posição
* 🎨 Cores personalizáveis
* 🌈 Destaque de palavras
* ✨ Animações de destaque
* 🖍️ Fundo para palavras destacadas
* 🌑 Sombras
* 🖌️ Contorno das letras
* ✨ Efeitos visuais
* 🔠 Texto em maiúsculas
* 📱 Área segura para visualização
* 📐 Proporções Original, 9:16, 4:5 e 1:1
* ▶️ Pré-visualização do vídeo
* ⏩ Controle de velocidade
* ✂️ Divisão de legendas
* ➕ Adição de legendas
* 🗑️ Exclusão de legendas
* ⏱️ Edição dos tempos
* ✏️ Edição dos textos
* 🔄 Reagrupamento das legendas
* 💾 Salvamento de projetos
* 📂 Abertura de projetos
* 📄 Exportação SRT
* 📄 Exportação VTT
* 📄 Exportação TXT
* 🎥 Exportação do vídeo com legendas incorporadas

## 🤖 Transcrição automática com IA

A transcrição é realizada diretamente no navegador utilizando **Whisper através do Transformers.js**.

O projeto possui diferentes opções de modelo:

| Modelo        | Descrição                              |
| ------------- | -------------------------------------- |
| Whisper Tiny  | Modelo menor e mais rápido             |
| Whisper Base  | Equilíbrio entre velocidade e precisão |
| Whisper Small | Maior precisão, porém mais pesado      |

O processamento utiliza timestamps das palavras para permitir sincronização e destaque individual durante a reprodução do vídeo.

## ⚡ WebGPU

Quando disponível, o sistema pode utilizar **WebGPU** para acelerar o processamento da IA.

Caso o navegador ou dispositivo não tenha suporte adequado, o sistema utiliza processamento por CPU.

Isso permite que o editor continue funcionando em diferentes computadores e navegadores.

## 🌎 Idiomas

O editor permite selecionar o idioma utilizado na transcrição.

Idiomas disponíveis:

* Português
* Inglês
* Espanhol
* Francês
* Alemão
* Japonês
* Coreano
* Automático

Também existe a opção de tradução da transcrição para inglês.

## 🎨 Estilos de Legendas

O editor possui diversos estilos pré-configurados para facilitar a criação de legendas.

Entre os estilos disponíveis estão:

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

Os estilos podem ser organizados por categorias e também podem existir estilos personalizados.

## ✏️ Personalização das Legendas

O editor permite modificar diversos aspectos visuais das legendas.

### Tipografia

* Fonte
* Fonte do destaque
* Peso da fonte
* Itálico
* Texto em maiúsculas
* Tamanho

### Posicionamento

* Posição vertical
* Área segura
* Proporção do vídeo

### Cores

* Cor do texto
* Cor do destaque
* Cor da sombra
* Cor do contorno
* Cor do fundo

### Efeitos

* Sombra
* Contorno
* Fundo da palavra
* Opacidade
* Raio do fundo
* Destaque de palavras
* Animações

## 🔥 Destaque Palavra por Palavra

O editor possui suporte para timestamps individuais das palavras.

Durante a reprodução, a palavra correspondente ao momento atual pode ser destacada automaticamente.

Isso permite criar estilos de legenda semelhantes aos utilizados em vídeos curtos para redes sociais.

## 📝 Editor de Legendas

Depois da transcrição automática, o usuário pode editar as legendas.

É possível:

* Alterar o texto
* Alterar o início da legenda
* Alterar o final da legenda
* Dividir uma legenda
* Excluir uma legenda
* Adicionar uma nova legenda
* Reagrupar legendas
* Visualizar a legenda no vídeo

## 🎥 Pré-visualização

O editor possui uma pré-visualização integrada para visualizar o resultado antes da exportação.

Recursos disponíveis:

* Reprodução do vídeo
* Pausar/reproduzir
* Alteração da velocidade
* Visualização das legendas
* Destaque sincronizado
* Diferentes proporções
* Área segura
* Visualização dos estilos

### Proporções

* Original
* 9:16
* 4:5
* 1:1

A proporção **9:16** é especialmente adequada para conteúdos verticais.

## 🎬 Exportação do Vídeo

A renderização do vídeo utiliza **FFmpeg.wasm** diretamente no navegador.

As legendas são renderizadas e incorporadas ao vídeo durante o processo de exportação.

O resultado é gerado como um arquivo de vídeo `.mp4`.

### Codificação

O projeto utiliza:

* H.264
* AAC
* Pixel Format `yuv420p`
* Áudio AAC
* Otimização `+faststart`

O processamento é realizado localmente no navegador.

## 📄 Exportação das Legendas

Além do vídeo final, é possível exportar as legendas separadamente.

### SRT

Formato amplamente utilizado por players de vídeo e plataformas de vídeo.

```text
legenda.srt
```

### VTT

Formato utilizado principalmente em aplicações web.

```text
legenda.vtt
```

### TXT

Exportação simples do texto das legendas.

```text
legenda.txt
```

## 📥 Importação de Legendas

O editor permite importar arquivos:

```text
.SRT
.VTT
```

Isso permite trabalhar com legendas criadas anteriormente ou provenientes de outras ferramentas.

## 💾 Salvamento de Projetos

As configurações do projeto podem ser salvas em um arquivo JSON.

O projeto pode armazenar informações como:

* Estilo
* Fonte
* Tamanho
* Posição
* Cores
* Peso
* Contorno
* Sombra
* Fundo
* Opacidade
* Configurações das legendas
* Textos
* Timestamps

O arquivo pode posteriormente ser carregado novamente no editor.

Exemplo:

```text
projeto.json
```

## 🔒 Processamento Local

O projeto foi desenvolvido com foco em processamento diretamente no navegador.

A transcrição utiliza o modelo Whisper através do Transformers.js e a renderização utiliza FFmpeg.wasm.

Dessa forma, o processamento do vídeo pode ocorrer diretamente no dispositivo do usuário.

Não é necessário um backend próprio para realizar a transcrição ou renderização.

## 🛠️ Tecnologias

O projeto utiliza:

* HTML5
* CSS3
* JavaScript
* ES Modules
* Canvas API
* Web Audio API
* WebGPU
* HTML5 Video API
* Transformers.js
* Hugging Face Transformers
* Whisper
* FFmpeg.wasm

### Transformers.js

Utilizado para executar os modelos de IA diretamente no navegador.

### Whisper

Utilizado para realizar a transcrição automática do áudio.

### FFmpeg.wasm

Utilizado para processamento e exportação do vídeo com as legendas incorporadas.

## 📦 Estrutura do Projeto

O projeto atualmente pode funcionar como uma aplicação baseada em um único arquivo:

```text
/
└── index.html
```

O arquivo contém:

* HTML
* CSS
* JavaScript

As bibliotecas externas são carregadas através de CDN.

## 🚀 Como Usar

### 1. Abra o editor

Abra o projeto em um navegador moderno.

### 2. Envie o vídeo

Selecione um arquivo de vídeo ou áudio.

### 3. Escolha o idioma

Selecione o idioma da fala ou utilize a detecção automática.

### 4. Escolha o modelo

Selecione o modelo Whisper desejado de acordo com a velocidade e precisão necessárias.

### 5. Inicie a transcrição

O sistema processará o áudio e criará automaticamente as legendas.

### 6. Personalize

Escolha um estilo ou personalize:

* Fonte
* Tamanho
* Cores
* Posição
* Destaques
* Contorno
* Sombra
* Fundo
* Animações

### 7. Revise

Utilize a pré-visualização para conferir a sincronização e aparência das legendas.

### 8. Edite

Caso necessário, altere os textos e timestamps manualmente.

### 9. Exporte

Escolha entre:

* Vídeo com legenda
* SRT
* VTT
* TXT

## 🌐 Hospedagem

Por utilizar tecnologias executadas no navegador, o projeto pode ser hospedado em plataformas de hospedagem estática.

Exemplos:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages

Não é necessário configurar um servidor backend específico para a funcionalidade principal do editor.

## 📱 Responsividade

A interface foi desenvolvida para funcionar em diferentes tamanhos de tela.

No celular, os elementos da interface são reorganizados para facilitar a utilização.

O editor possui adaptações para:

* Smartphones
* Tablets
* Notebooks
* Desktops

## ⚠️ Desempenho

A transcrição de áudio e a renderização de vídeo são operações que podem consumir bastante CPU, GPU e memória.

O desempenho depende de fatores como:

* Processador
* GPU
* Memória RAM
* Navegador
* Duração do vídeo
* Resolução do vídeo
* Modelo Whisper selecionado
* Quantidade de legendas

Modelos menores tendem a ser mais rápidos, enquanto modelos maiores podem oferecer maior precisão.

## 💻 Navegadores Recomendados

Recomenda-se utilizar versões atualizadas de navegadores modernos, como:

* Google Chrome
* Microsoft Edge
* Firefox
* Safari

Para melhor desempenho, recomenda-se um navegador com suporte a recursos modernos como WebGPU quando disponível.

## 🔐 Privacidade

O processamento principal do projeto é realizado localmente no navegador.

O sistema utiliza modelos e bibliotecas carregados para execução da IA e processamento multimídia no dispositivo.

O objetivo é permitir que o usuário processe seus vídeos sem depender de um servidor próprio para a transcrição e renderização.

## 📌 Características Principais

**Editor automático de legendas com IA diretamente no navegador.**

* 🤖 IA para transcrição
* 🎬 Vídeos
* 🔤 Legendas automáticas
* 🎨 Estilos profissionais
* ✨ Destaque palavra por palavra
* ✏️ Editor manual
* 📱 Formatos para redes sociais
* 🎥 Exportação de vídeo
* 📄 Exportação SRT/VTT/TXT
* 💾 Projetos em JSON
* ⚡ WebGPU
* 🔒 Processamento local

## 📄 Licença

Este projeto não especifica uma licença no código fornecido. Portanto, não é definida aqui uma licença de uso, modificação ou distribuição.

---

**Editor Automático de IA que Adiciona Legendas em Vídeos**
🤖 Whisper AI · 🎬 FFmpeg.wasm · ⚡ WebGPU · 🔒 Processamento Local
