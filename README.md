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


## Grátis no Vercel (Hobby)

- Hospedagem **estática** → plano Hobby **sem cartão / sem custo**.
- Não usa serverless functions, banco nem bandwidth especial.
- Link com projeto isolado (mesmo navegador):

```
https://videocomlegenda.vercel.app/?project=ec462cba-ba20-47ad-a386-cc2cdfecefe5
```

O `?project=UUID` só separa o auto-save no **localStorage** deste browser. Não há nuvem: cada pessoa vê só o que salvou no próprio aparelho. Para compartilhar legenda use **Salvar** (JSON) ou **.SRT**.

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

### Headers (importante)

**Não use COEP (`Cross-Origin-Embedder-Policy`)** neste projeto.

O Transformers.js (Whisper) cria Workers a partir do CDN (jsDelivr). Com COEP ativo o browser bloqueia esses Workers e aparece o erro:

`SecurityError: Failed to construct 'Worker'… cannot be accessed from origin`

O `vercel.json` atual **não envia COEP**. O FFmpeg.wasm usa automaticamente o core single-thread (`@ffmpeg/core-st`) quando `SharedArrayBuffer` não está disponível — funciona normalmente, só um pouco mais lento na exportação.

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
