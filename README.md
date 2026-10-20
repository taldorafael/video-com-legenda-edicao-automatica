# Video com Legenda

**Legendas virais 100% locais no navegador** — Whisper (Transformers.js) + FFmpeg.wasm.

Site: [https://videocomlegenda.vercel.app/](https://videocomlegenda.vercel.app/)

## Funcionalidades

- Transcrição automática com **Whisper** (tiny / base / small) rodando no seu dispositivo
- Suporte a **WebGPU** quando disponível
- Estilos estilo **CapCut / TikTok** (Hormozi, MrBeast, Neon, Mixed fonts etc.)
- Animações palavra-a-palavra no preview (Pop, Bounce, Scale, Fade, Slide)
- Preview com **quebra de linha idêntica** ao vídeo exportado
- Edição de legendas, tempos, divisão de linhas
- Exportação:
  - Vídeo com legenda queimada (MP4)
  - `.SRT` / `.VTT`
  - Projeto `.json` (salvar/carregar)
- Importação de legendas prontas (`.srt` / `.vtt`)
- Marca d’água opcional
- Área segura (safe zone) para redes sociais
- 100% privado — nada sai do seu computador

## Stack

| Tecnologia | Uso |
|------------|-----|
| [@huggingface/transformers](https://huggingface.co/docs/transformers.js) | Whisper no browser |
| [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) | Queima de legendas |
| CSS puro + variáveis | UI dark moderna |
| Vanilla JS (ES modules) | Lógica completa |

Nenhum backend. Nenhum upload de vídeo para servidores.

## Arquivos do projeto

```
videocomlegenda/
├── index.html      # Estrutura da página
├── style.css       # Estilos completos
├── script.js       # Lógica (Whisper + FFmpeg + UI)
├── package.json    # Metadados e scripts locais
├── vercel.json     # Headers COOP/COEP + rotas estáticas
└── README.md
```

## Deploy no Vercel

1. Suba a pasta no GitHub (ou use Vercel CLI)
2. Importe o repositório no [vercel.com](https://vercel.com)
3. Framework Preset: **Other** (static)
4. Deploy

Ou via CLI:

```bash
npm i -g vercel
vercel --prod
```

### Headers importantes

O `vercel.json` já configura:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Esses headers são **necessários** para `SharedArrayBuffer` (FFmpeg.wasm multithread). Sem eles o FFmpeg cai no modo single-thread (mais lento, mas funciona).

## Desenvolvimento local

```bash
# Qualquer servidor estático serve
npx serve .
# ou
python -m http.server 3000
```

Abra `http://localhost:3000`.

> **Nota:** Para COOP/COEP local, use um servidor que envie os headers (ex.: `npx serve` com config, ou VS Code Live Server com extensão). Sem os headers o app ainda funciona (FFmpeg single-thread).

## Modelos Whisper

| Modelo | Tamanho | Uso recomendado |
|--------|---------|-----------------|
| `Xenova/whisper-tiny` | ~40 MB | Celulares / PCs fracos |
| `Xenova/whisper-base` | ~80 MB | Equilíbrio (padrão) |
| `Xenova/whisper-small` | ~250 MB | Máxima precisão |

O app detecta performance do dispositivo e sugere o modelo adequado.

## Licença

MIT — use livremente.

---

Feito com ❤️ para criadores de conteúdo. Tudo roda no seu navegador.
