# Tamandaré Burguer — site

Site de uma página: animação do hambúrguer se montando conforme a rolagem, fogo e brasinhas no fundo,
cardápio completo do iFood e pedido enviado para o WhatsApp.

## Estrutura

```
index.html        estrutura da página (topo, seções, carrinho, tela de opções)
css/style.css     todos os estilos (cores no :root)
js/app.js         toda a lógica (animação, fogo, cardápio, carrinho, WhatsApp, horário)
frames/           47 quadros do hambúrguer (f00.webp ... f46.webp, fundo transparente)
img/logo.webp     logo
img/lanches/      fotos dos 19 pratos principais (l00 ... l18)
img/opcoes/       fotos das opções: molhos, porções, fritas, refrigerantes
```

## Como abrir

- Para ver no computador: abra o `index.html` no navegador. Se algo não carregar, rode um servidor simples
  na pasta (`python3 -m http.server`) e acesse http://localhost:8000.
- Para publicar: envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages,
  GitHub Pages ou hospedagem comum). O arquivo principal é o `index.html`.
- As fontes (Bebas Neue e Inter) vêm do Google Fonts e precisam de internet. Sem elas o site usa fontes do sistema.

## O que você mais vai querer mudar

| O quê | Onde |
|---|---|
| Número do WhatsApp | `js/app.js`, constante `WAN` (formato 5541999999999) e os links `wa.me` no `index.html` |
| Link do iFood | `index.html` (procure `ifood.com.br`) |
| Preços e itens do cardápio | `js/app.js`, lista `MENU` (n nome, d descrição, p preço, i foto, s serve, o:1 abre as opções) |
| Opções do hambúrguer (molhos, porções, acréscimos) | `js/app.js`, lista `G` |
| Refrigerantes | `js/app.js`, lista `DR` |
| Horário de funcionamento | texto no `index.html` e função `openState` no `js/app.js` (1080 = 18h00, 1410 = 23h30) |
| Endereço e textos | `index.html` |
| Cores | `css/style.css`, bloco `:root` (`--or` laranja, `--ye` amarelo) |
| Comentários de clientes | `index.html`, seção `id="depoimentos"` (blocos `class="rv"`) |

## Para trocar uma foto

1. Salve a nova foto em `.webp` (ou `.jpg`) com o mesmo nome do arquivo antigo, na mesma pasta.
2. Para os lanches, a ordem é a da lista `MENU` (campo `i`). Fotos grandes e nítidas (pelo menos 800 px de largura)
   deixam os cards muito melhores; as atuais dos lanches são pequenas.

## Observações

- O pedido não é gravado em nenhum sistema: ele só monta a mensagem e abre o WhatsApp da loja.
- A taxa de entrega não entra no total; o texto do pedido avisa que é combinada pelo WhatsApp.
- Os preços foram copiados do cardápio do iFood. Confira sempre antes de publicar.

## Publicar no GitHub Pages (grátis)

1. No GitHub, clique em **New repository**, dê um nome (ex.: `tamandare-burguer`) e marque **Public**.
2. Na página do repositório vazio, clique em **uploading an existing file**.
3. Extraia o zip no computador e arraste **o conteúdo da pasta** (index.html, css, js, frames, img, README.md) para a janela.
   Não envie o .zip fechado: o GitHub não descompacta. O `index.html` precisa ficar na raiz.
4. Clique em **Commit changes**.
5. Vá em **Settings > Pages**, em *Branch* escolha `main` e a pasta `/ (root)`, e clique em **Save**.
6. Em 1 a 2 minutos o site abre em `https://SEU-USUARIO.github.io/tamandare-burguer/`.

Observação: o envio pelo navegador aceita até 100 arquivos por vez. Este projeto tem 99, então cabe de uma vez.
Se der erro, envie primeiro a pasta `frames` e depois o resto, ou use o GitHub Desktop (sem esse limite).
Para domínio próprio, use *Settings > Pages > Custom domain*.
