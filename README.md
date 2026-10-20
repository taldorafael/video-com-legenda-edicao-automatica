# 🎬 Legendar Videos (videocomlegenda)

Legendas **virais** geradas 100% no navegador com IA — sem servidor, sem upload, 100% privado e gratuito.

## ✨ Funcionalidades

- 🧠 **Transcrição com IA** — Whisper (Xenova) rodando localmente via WebGPU/CPU
- 🎨 **40+ estilos prontos** — Hormozi, Beast, CapCut, TikTok, fontes misturadas, glow, neon
- 🔤 **Editor de legendas** — edite palavra por palavra, divida/junte linhas, ajuste tempos
- 🎞️ **Preview fiel** — quebra de linha idêntica ao vídeo final exportado
- 🎬 **Exportação com legenda queimada** — FFmpeg.wasm compõe os frames no próprio navegador
- 📦 **Exporta .SRT / .VTT / .TXT** e salva/abre projetos (.json)
- 📱 **Modo mobile** — barra de ações fixa e layout responsivo
- ⚡ **Detecção de performance** — ajusta modelo, animações e qualidade automaticamente

## 🚀 Deploy na Vercel

1. Faça push destes arquivos para um repositório GitHub
2. Na Vercel: **Add New → Project → Import** o repositório
3. Framework: **Other** · Build: vazio · Output: raiz do projeto
4. Deploy! O `vercel.json` já configura os headers (COOP/COEP para SharedArrayBuffer)

Ou via CLI:

```bash
npm i -g vercel
vercel --prod
```

## 💻 Rodar localmente

```bash
npx serve .
# ou
python3 -m http.server 3000
```

> ⚠️ O ffmpeg.wasm precisa de HTTP(S). Abrir o `index.html` via `file://` não funciona.

## 📁 Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Estrutura da aplicação |
| `style.css` | Tema dark completo + animações |
| `script.js` | Toda a lógica (Whisper, editor, render, FFmpeg) |
| `vercel.json` | Headers (COOP/COEP), cache e segurança |
| `package.json` | Metadados e scripts |

## 🔧 Tecnologias

- [@huggingface/transformers.js](https://huggingface.co/docs/transformers.js) — Whisper no browser
- [@ffmpeg/ffmpeg](https://ffmpegwasm.netlify.app) — composição de vídeo
- Canvas 2D — render dos frames de legenda
- Google Fonts — Inter, Montserrat, Poppins, Anton, Bebas Neue…

## 🔒 Privacidade

Nenhum vídeo ou áudio sai do seu dispositivo. Modelos de IA são baixados
do CDN do Hugging Face e cacheados no navegador.

## 📄 Licença

MIT
