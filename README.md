# 🎬 Clipa Free

**Legendas automáticas e molduras para vídeos, diretamente no navegador.**

O **Clipa Free** é uma ferramenta web gratuita para edição de vídeos que permite gerar legendas automáticas com IA e aplicar molduras PNG em um ou vários vídeos.

Todo o processamento é realizado diretamente no navegador do usuário, sem necessidade de login, servidor próprio ou upload dos vídeos.

---

## ✨ Recursos

### 🎤 Legendas Automáticas

* Transcrição automática de áudio e vídeo.
* Processamento local com **Whisper via Transformers.js**.
* Suporte a múltiplos idiomas.
* Detecção automática de idioma.
* Modelos de diferentes níveis de velocidade e precisão:

  * Whisper Tiny
  * Whisper Base
  * Whisper Small
  * Whisper Medium
* Utilização de **WebGPU** quando disponível.
* Opção de tradução para inglês.
* Importação de legendas `.SRT` e `.VTT`.
* Editor visual de legendas.
* Sincronização das legendas com o vídeo.
* Reagrupamento automático das linhas.
* Controle de palavras por linha.
* Controle da duração máxima das legendas.
* Edição manual dos textos e tempos.

O projeto oferece modelos que variam aproximadamente de 40 MB a 770 MB, permitindo escolher entre maior velocidade ou maior precisão.

---

## 🎨 Editor de Legendas

O editor possui diversas opções de personalização:

* Posição da legenda.
* Tamanho da fonte.
* Cor do texto.
* Cor de destaque.
* Tipografia.
* Alinhamento.
* Texto em maiúsculas.
* Contorno.
* Caixa de fundo.
* Cor da caixa.
* Opacidade.
* Arredondamento.
* Estilos pré-configurados.

Também existe preview em tempo real, controle de velocidade e opções de proporção:

* Original
* 9:16
* 4:5
* 1:1

---

## 📤 Exportação de Legendas

As legendas podem ser exportadas em:

* `.SRT`
* `.VTT`
* `.TXT`

O código gera os arquivos diretamente no navegador, sem necessidade de servidor.

Também é possível salvar o projeto em `.JSON` e posteriormente carregá-lo novamente para continuar a edição.

---

## 🎬 Exportação do Vídeo

O Clipa Free permite gerar um novo vídeo com as legendas incorporadas.

A exportação utiliza:

**FFmpeg.wasm**

O FFmpeg é carregado diretamente no navegador e utilizado para gerar o arquivo MP4 final.

Características:

* Exportação para MP4.
* Codec H.264.
* Áudio AAC.
* Preset `ultrafast`.
* Compatibilidade com reprodução rápida.
* Barra de progresso.
* Cancelamento da exportação.
* Download automático do vídeo final.

A aplicação também verifica se o arquivo gerado possui conteúdo válido antes de disponibilizá-lo para download.

---

# 🖼️ Moldura em Vídeos

A segunda ferramenta permite criar ou importar uma moldura e aplicá-la aos vídeos.

### 📥 Importar moldura

É possível enviar uma imagem:

* PNG
* Com transparência
* Com área reservada para o vídeo

A área onde o vídeo será colocado pode ser ajustada visualmente.

É possível alterar:

* X
* Y
* Largura
* Altura

Também existem ferramentas para:

* 🔍 Detectar área automaticamente
* ⊕ Centralizar
* 🗑 Remover moldura

---

## 🛠️ Criar Moldura

O sistema também permite criar uma moldura diretamente no navegador.

É possível configurar:

* Foto de perfil.
* Formato da foto.
* Username.
* Legenda.
* Cor de fundo.
* Cor do texto.
* Área do vídeo.
* Posição do vídeo.
* Largura.
* Altura.

Os elementos da composição podem ser movimentados diretamente no preview.

Depois da configuração, a moldura é gerada automaticamente como PNG.

---

# 🎥 Processamento em Massa

Uma das principais funcionalidades do Clipa Free é a aplicação de uma mesma moldura em vários vídeos.

É possível:

1. Selecionar uma moldura.
2. Adicionar vários vídeos.
3. Visualizar os vídeos na fila.
4. Processar todos.
5. Acompanhar o progresso.
6. Baixar cada resultado individualmente.
7. Baixar todos os resultados em um único `.ZIP`.

O sistema mantém uma fila de vídeos e registra o status individual de cada processamento.

---

## 📦 Download em ZIP

Após finalizar o processamento, todos os vídeos concluídos podem ser agrupados automaticamente em um arquivo `.ZIP`.

O projeto utiliza **JSZip** para criar o arquivo compactado diretamente no navegador.

---

# 🔒 Privacidade

O projeto foi desenvolvido com foco em processamento local.

Os vídeos são selecionados pelo usuário e processados no próprio navegador.

Não existe, no `index.html`, um backend próprio para receber os vídeos.

O projeto utiliza modelos e bibliotecas carregados pelo navegador, incluindo Transformers.js e FFmpeg.wasm.

> **Importante:** apesar do processamento dos arquivos ocorrer localmente, o navegador precisa acessar os CDNs utilizados pelo projeto para carregar as bibliotecas e modelos.

---

# ⚡ Tecnologias

O projeto utiliza:

* HTML5
* CSS3
* JavaScript
* Transformers.js
* Whisper
* FFmpeg.wasm
* JSZip
* WebGPU
* Web APIs
* File API
* Blob API
* Canvas API
* Local Object URLs

A interface e a lógica estão concentradas no `index.html`.

---

# 📁 Estrutura

O projeto pode funcionar com uma estrutura extremamente simples:

```text
/
├── index.html
└── README.md
```

O `index.html` contém:

* HTML
* CSS
* JavaScript
* Interface
* Editor
* Processamento
* Exportação
* Integrações via CDN

---

# 🚀 Como usar

## 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```

## 2. Entre na pasta

```bash
cd SEU-REPOSITORIO
```

## 3. Abra o projeto

Como o projeto é baseado em HTML, CSS e JavaScript no navegador, não é necessário um backend.

Para melhor compatibilidade com módulos JavaScript, WebGPU e recursos do navegador, recomenda-se executar através de um servidor local.

Exemplo:

```bash
npx serve .
```

Depois abra o endereço indicado pelo servidor.

---

# 🌐 Deploy

O projeto pode ser hospedado em serviços de hospedagem estática, como:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages
* Outros hosts compatíveis com sites estáticos

Não é necessário configurar um servidor backend para as funcionalidades principais.

---

# 🌐 Navegadores

Para melhor desempenho, recomenda-se utilizar versões recentes de:

* Google Chrome
* Microsoft Edge

Especialmente para processamento pesado com FFmpeg.wasm e utilização de WebGPU.

O projeto detecta a disponibilidade de `SharedArrayBuffer` e informa quando o navegador não oferece o recurso, situação que pode deixar o processamento mais lento.

---

# 📱 Responsividade

A interface foi desenvolvida para funcionar em:

* 💻 Desktop
* 💻 Notebook
* 📱 Celular
* 📲 Tablet

No celular existe uma barra de ações específica para facilitar a exportação e o gerenciamento das legendas.

---

# 🎯 Fluxo de Legendas

```text
Selecionar vídeo
       ↓
Escolher idioma
       ↓
Escolher modelo Whisper
       ↓
Transcrição no navegador
       ↓
Editor de legendas
       ↓
Personalizar estilo
       ↓
Visualizar no vídeo
       ↓
Exportar
       ↓
MP4 / SRT / VTT / TXT
```

---

# 🎯 Fluxo de Moldura

```text
Criar ou enviar PNG
       ↓
Definir área do vídeo
       ↓
Adicionar vídeos
       ↓
Criar fila
       ↓
Aplicar moldura
       ↓
Processamento com FFmpeg
       ↓
Vídeos finalizados
       ↓
Download individual
       ↓
ou
       ↓
Download de todos em ZIP
```

---

# 💾 Projetos

O editor de legendas permite salvar as configurações em um arquivo JSON.

O projeto salvo pode conter:

* Estilo selecionado.
* Posição.
* Tamanho.
* Cores.
* Fonte.
* Alinhamento.
* Contorno.
* Fundo.
* Opacidade.
* Arredondamento.
* Linhas e tempos das legendas.

Isso permite salvar o trabalho e carregá-lo posteriormente.

---

# ⚠️ Desempenho

O processamento acontece no dispositivo do usuário.

Consequentemente, o desempenho depende principalmente de:

* CPU.
* GPU.
* Memória RAM.
* Navegador.
* Duração do vídeo.
* Resolução do vídeo.
* Modelo Whisper escolhido.
* Quantidade de vídeos processados simultaneamente.

Modelos menores são mais rápidos e consomem menos recursos, enquanto modelos maiores podem apresentar maior precisão e exigir mais memória.

O FFmpeg também precisa ser carregado na primeira utilização, aumentando o tempo inicial de carregamento.

---

# 🔐 Sem Login

O Clipa Free não exige:

* Cadastro.
* Login.
* Senha.
* Conta.
* Cartão de crédito.

A proposta do projeto é oferecer as ferramentas diretamente no navegador.

---

# 🆓 Gratuito

O projeto foi desenvolvido para uso gratuito e sem marca d'água.

Não existe cobrança por quantidade de vídeos dentro da aplicação.

---

# 🧩 Código Aberto

O projeto possui a lógica principal concentrada no `index.html` e pode ser utilizado como base para desenvolvimento de novas ferramentas de edição de vídeo no navegador.

---

# 📜 Licença

Este repositório não define uma licença de software explicitamente no `index.html`.

Se você disponibilizar o projeto publicamente no GitHub, recomenda-se adicionar uma licença apropriada ao repositório, como MIT, caso queira permitir reutilização e modificação do código.

---

## 🎬 Clipa Free

**Legendas automáticas + molduras para vídeos.**

> 🔒 Local • ⚡ Rápido • 🆓 Gratuito • 🎬 Sem servidor
