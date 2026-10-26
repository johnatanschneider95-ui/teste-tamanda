/* Tamandaré Burguer - site com animação de rolagem, cardápio e pedido pelo WhatsApp.
   Arquivo único de JavaScript. Seções: 1 animação, 2 fogo, 3 navegação, 4 dados do cardápio,
   5 carrinho/WhatsApp, 6 opções do hambúrguer, 7 aberto/fechado, 8 cabeçalho, 9 brasinhas. */
const FRAMES = Array.from({ length: 47 }, (_, i) => 'frames/f' + String(i).padStart(2, '0') + '.webp');
const LOGO = 'img/logo.webp';
document.querySelectorAll('img[data-logo]').forEach(i => i.src = LOGO);
// ============================================================
// 1. ANIMAÇÃO DO HAMBÚRGUER
//    47 quadros (pasta frames/) controlados pela rolagem da página.
//    O movimento é suavizado pelo tempo (não depende da taxa de quadros).
// ============================================================
const cv = document.getElementById('cv'), ctx = cv.getContext('2d'), sc = document.getElementById('scroll'), panels = [...document.querySelectorAll('.p')], bar = document.getElementById('bar'), hint = document.getElementById('hint');
const imgs = [];
let loaded = 0, W, H, dpr;
FRAMES.forEach((s, i) => {
  const im = new Image();
  im.onload = () => {
    if (++loaded === 1 || loaded === FRAMES.length) {
      lastCur = -1;
      draw(cur);
    }
  };
  im.src = s;
  imgs.push(im);
  im.decode && im.decode().catch(() => {
  });
});
function size() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth;
  H = cv.clientHeight;
  cv.width = W * dpr;
  cv.height = H * dpr;
  fc.width = Math.round(W / 2);
  fc.height = Math.round(H / 2);
  lastCur = -1;
  draw(cur);
}
// ============================================================
// 2. FOGO ANIMADO atrás do hambúrguer (canvas em meia resolução, bem leve)
// ============================================================
const fc = document.getElementById('fire'), fx = fc.getContext('2d');
function mk(c0, c1) {
  const s = document.createElement('canvas');
  s.width = s.height = 64;
  const g = s.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, c0);
  r.addColorStop(0.4, c1);
  r.addColorStop(1, 'rgba(255,60,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return s;
}
const SP = [
  mk('rgba(255,235,150,1)', 'rgba(255,170,30,.55)'),
  mk('rgba(255,170,40,1)', 'rgba(255,90,10,.5)'),
  mk('rgba(255,90,20,.9)', 'rgba(170,25,0,.4)')
];
const parts = [];
let intens = 0.45;
// Posição horizontal do burger: ele se afasta do lado onde está o texto (só no computador).
// Cada par é [progresso da rolagem, deslocamento em fração da largura da tela].
const OK = [
  [
    0,
    0.12
  ],
  [
    0.12,
    0.12
  ],
  [
    0.16,
    -0.1
  ],
  [
    0.3,
    -0.1
  ],
  [
    0.34,
    0.1
  ],
  [
    0.48,
    0.1
  ],
  [
    0.52,
    -0.1
  ],
  [
    0.66,
    -0.1
  ],
  [
    0.7,
    0.1
  ],
  [
    0.82,
    0.1
  ],
  [
    0.87,
    0
  ],
  [
    1,
    0
  ]
];
function off(p) {
  for (let i = 1; i < OK.length; i++)
    if (p <= OK[i][0]) {
      const a = OK[i - 1], b = OK[i], u = (p - a[0]) / (b[0] - a[0] || 1);
      return a[1] + (b[1] - a[1]) * u * u * (3 - 2 * u);
    }
  return 0;
}
function L() {
  const iw = 1280, ih = 720;
  let s, cx = W / 2, cy = H / 2;
  if (W < H) {
    s = Math.max(W / iw * 1.55, H * 0.55 / ih);
    cy = Math.min(H * 0.34, 360 * s);
  } else {
    s = Math.max(W / iw, H / ih);
    cx = W / 2 + W * off(cur / (FRAMES.length - 1));
  }
  return {
    s,
    cx,
    cy,
    w: iw * s,
    h: ih * s
  };
}
function drawImg(im, a) {
  if (!im.complete || !im.naturalWidth)
    return;
  const l = L();
  ctx.globalAlpha = a;
  ctx.drawImage(im, l.cx - l.w / 2 + 300 * l.s, l.cy - l.h / 2, 740 * l.s, l.h);
}
function fire() {
  fx.setTransform(0.5, 0, 0, 0.5, 0, 0);
  fx.clearRect(0, 0, W, H);
  const l = L(), by = l.cy - l.h / 2 + l.h * 0.8, bw = l.w * 0.21, m = W < H ? 0.6 : 1;
  const n = Math.round((2 + 5 * intens) * m);
  if (parts.length < 420)
    for (let k = 0; k < n; k++)
      parts.push({
        x: l.cx + (Math.random() * 2 - 1) * bw,
        y: by + (Math.random() - 0.3) * l.h * 0.06,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(1.2 + Math.random() * 2.2) * l.s * 1.6,
        life: 0,
        max: 50 + Math.random() * 50,
        sz: (50 + Math.random() * 80) * l.s,
        e: Math.random() < 0.12
      });
  fx.globalCompositeOperation = 'lighter';
  const gg = fx.createRadialGradient(l.cx, by, 0, l.cx, by, l.w * 0.5);
  gg.addColorStop(0, 'rgba(255,120,20,' + 0.38 * intens + ')');
  gg.addColorStop(1, 'rgba(255,60,0,0)');
  fx.fillStyle = gg;
  fx.fillRect(0, 0, W, H);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life++;
    if (p.life > p.max) {
      parts.splice(i, 1);
      continue;
    }
    const u = p.life / p.max;
    p.x += p.vx + Math.sin((p.life + p.y) * 0.05) * 0.5 * l.s + (l.cx - p.x) * 0.006;
    p.y += p.vy * (1 - u * 0.5);
    if (p.e) {
      fx.globalAlpha = (1 - u) * 0.9;
      fx.fillStyle = '#ffc060';
      fx.beginPath();
      fx.arc(p.x, p.y, 2.4 + 3 * (1 - u), 0, 7);
      fx.fill();
      continue;
    }
    const sp = SP[u < 0.25 ? 0 : u < 0.6 ? 1 : 2], sz = p.sz * (1 - u * 0.55);
    fx.globalAlpha = Math.min(1, (1 - u) * 1.1) * (0.5 + 0.5 * intens) * 0.75;
    fx.drawImage(sp, p.x - sz / 2, p.y - sz / 2, sz, sz);
  }
  fx.globalAlpha = 1;
  fx.globalCompositeOperation = 'source-over';
}
let cur = 0, target = 0, P = 0, lastCur = -1;
// Desenha o quadro atual (mistura dois quadros vizinhos para ficar suave).
function draw(f) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const i = Math.floor(f), t = f - i;
  drawImg(imgs[i], 1);
  if (t > 0.01 && imgs[i + 1])
    drawImg(imgs[i + 1], t);
  ctx.globalAlpha = 1;
}
function prog() {
  const r = sc.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
}
function tick(now) {
  now = now || performance.now();
  const dt = Math.min(0.05, (now - (tick.t || now)) / 1000) || 0.016;
  tick.t = now;
  const p = prog();
  P = p;
  target = p * (FRAMES.length - 1);
  cur += (target - cur) * (1 - Math.exp(-dt * 8));
  if (Math.abs(target - cur) < 0.003)
    cur = target;
  if (cur !== lastCur) {
    draw(cur);
    lastCur = cur;
  }
  intens = 0.45 + 0.55 * Math.min(1, p / 0.25);
  if (sc.getBoundingClientRect().bottom > 0)
    fire();
  bar.style.width = p * 100 + '%';
  hint.style.opacity = p > 0.03 ? 0 : 1;
  panels.forEach(el => {
    el.classList.toggle('on', p >= +el.dataset.a && p <= +el.dataset.b);
  });
  requestAnimationFrame(tick);
}
// ============================================================
// 3. NAVEGAÇÃO: links com data-go rolam até a seção; a logo volta ao topo.
// ============================================================
document.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const g = a.dataset.go;
  if (g === 'top')
    scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  if (a.dataset.cat)
    setCat(a.dataset.cat);
  if (g !== 'top')
    document.getElementById(g).scrollIntoView({ behavior: 'smooth' });
}));
if (0) {
}
addEventListener('resize', size);
size();
tick();
// ============================================================
// 4. DADOS DO CARDÁPIO (aqui você edita preços, itens e opções)
// ============================================================
// Fotos dos lanches (pasta img/lanches/) e das opções (pasta img/opcoes/).
const IMG = Array.from({ length: 19 }, (_, i) => 'img/lanches/l' + String(i).padStart(2, '0') + '.webp');
const IM = {
  simples: 'img/opcoes/simples.webp',
  duplo: 'img/opcoes/duplo.webp',
  fritas: 'img/opcoes/fritas.webp',
  fritasch: 'img/opcoes/fritasch.webp',
  mai: 'img/opcoes/mai.webp',
  bbq: 'img/opcoes/bbq.webp',
  catchup: 'img/opcoes/catchup.webp',
  mostarda: 'img/opcoes/mostarda.webp',
  americano: 'img/opcoes/americano.webp',
  kit: 'img/opcoes/kit.webp',
  crinkle: 'img/opcoes/crinkle.webp',
  crinklech: 'img/opcoes/crinklech.webp',
  aipim: 'img/opcoes/aipim.webp',
  onion: 'img/opcoes/onion.webp',
  nuggets: 'img/opcoes/nuggets.webp',
  cocalata: 'img/opcoes/cocalata.webp',
  cocazlata: 'img/opcoes/cocazlata.webp',
  fantauva: 'img/opcoes/fantauva.webp',
  fantalar: 'img/opcoes/fantalar.webp',
  sprite: 'img/opcoes/sprite.webp',
  guarana: 'img/opcoes/guarana.webp',
  pessego: 'img/opcoes/pessego.webp',
  uva: 'img/opcoes/uva.webp',
  cocazero600: 'img/opcoes/cocazero600.webp',
  coca600: 'img/opcoes/coca600.webp',
  coca2l: 'img/opcoes/coca2l.webp',
  cocazero2l: 'img/opcoes/cocazero2l.webp',
  guarana2l: 'img/opcoes/guarana2l.webp'
};
const src = k => IM[k];
// Refrigerantes: k = nome do arquivo da foto, n = nome, p = preço (valores do iFood).
const DR = [
  {
    k: 'cocalata',
    n: 'Coca-Cola Lata 350 ml',
    p: 7.9
  },
  {
    k: 'cocazlata',
    n: 'Coca-Cola Sem Açúcar Lata 350 ml',
    p: 7.9
  },
  {
    k: 'fantauva',
    n: 'Fanta Uva Lata 350 ml',
    p: 7.9
  },
  {
    k: 'fantalar',
    n: 'Fanta Laranja Lata 350 ml',
    p: 7.9
  },
  {
    k: 'sprite',
    n: 'Sprite Limão Lata 350 ml',
    p: 7.9
  },
  {
    k: 'guarana',
    n: 'Guaraná Antarctica Lata 350 ml',
    p: 7.9
  },
  {
    k: 'pessego',
    n: 'Suco Del Valle Pêssego 290 ml',
    p: 8.9
  },
  {
    k: 'uva',
    n: 'Suco Del Valle Néctar Uva 290 ml',
    p: 8.9
  },
  {
    k: 'cocazero600',
    n: 'Coca-Cola Zero 600 ml',
    p: 13.9
  },
  {
    k: 'coca600',
    n: 'Coca-Cola 600 ml',
    p: 13.9
  },
  {
    k: 'coca2l',
    n: 'Coca-Cola 2 Litros',
    p: 19.9
  },
  {
    k: 'cocazero2l',
    n: 'Coca-Cola Zero 2 Litros',
    p: 19.9
  },
  {
    k: 'guarana2l',
    n: 'Guaraná Antarctica 2 Litros',
    p: 19.9
  }
];
const MG = 'Garrafinha com 30 ml';
// Opções da tela "Escolher opções" dos hambúrgueres com fritas.
// req:1 = obrigatório (escolhe 1) | max = máximo de unidades no grupo | p = acréscimo no preço.
const G = [
  {
    id: 'tam',
    t: 'Burguer simples ou duplo?',
    req: 1,
    max: 1,
    o: [
      {
        n: 'Burguer simples',
        d: 'O lanche vai com um hambúrguer artesanal de 100 g',
        p: 0,
        im: 'simples'
      },
      {
        n: 'Burguer duplo',
        d: 'O lanche vai com dois hambúrgueres artesanais de 100 g',
        p: 5.9,
        im: 'duplo'
      }
    ]
  },
  {
    id: 'fr',
    t: 'Fritas tradicional ou com cheddar e bacon?',
    req: 1,
    max: 1,
    o: [
      {
        n: 'Porção de fritas tradicional',
        p: 0,
        im: 'fritas'
      },
      {
        n: 'Fritas com cheddar cremoso e bacon',
        p: 0,
        im: 'fritasch'
      }
    ]
  },
  {
    id: 'mo',
    t: 'Gostaria de um molho?',
    req: 0,
    max: 10,
    o: [
      {
        n: 'Maionese de alho',
        d: MG,
        p: 3,
        im: 'mai'
      },
      {
        n: 'Molho Barbecue',
        d: MG,
        p: 3,
        im: 'bbq'
      },
      {
        n: 'Molho Catchup',
        d: MG,
        p: 3,
        im: 'catchup'
      },
      {
        n: 'Molho de Mostarda',
        d: MG,
        p: 3,
        im: 'mostarda'
      },
      {
        n: 'Molho Americano',
        d: MG,
        p: 3,
        im: 'americano'
      },
      {
        n: 'Kit com 5 molhos',
        d: '1 maionese de alho, 1 barbecue, 1 americano, 1 mostarda e 1 catchup, cada garrafinha com 30 ml',
        p: 9.9,
        im: 'kit'
      }
    ]
  },
  {
    id: 'rf',
    t: 'Gostaria de incluir um refrigerante?',
    req: 0,
    max: 2,
    o: DR.map(x => ({
      n: x.n,
      p: x.p,
      im: x.k,
      sd: 1
    }))
  },
  {
    id: 'po',
    t: 'Uma porção individual para acompanhar?',
    req: 0,
    max: 2,
    o: [
      {
        n: 'Batata crinkle',
        d: 'Média de 115\u2013130 g (150 g congelada)',
        p: 12.9,
        im: 'crinkle'
      },
      {
        n: 'Batata crinkle com cheddar cremoso e bacon',
        d: 'Média de 120\u2013135 g (150 g congelada)',
        p: 16.9,
        im: 'crinklech'
      },
      {
        n: 'Aipim noisets com bacon',
        d: 'Média de 120\u2013130 g (150 g congelada)',
        p: 14.9,
        im: 'aipim'
      },
      {
        n: 'Onion rings',
        d: '12 unidades',
        p: 16.9,
        im: 'onion'
      },
      {
        n: 'Nuggets',
        d: '10 unidades',
        p: 13.9,
        im: 'nuggets'
      }
    ]
  }
];
// Cardápio: categorias e itens.
// n = nome | d = descrição | p = preço | i = foto (número em IMG) | s = "Serve X pessoas"
// o:1 = abre a tela de opções | sd = foto de refrigerante | from:1 = "a partir de"
const MENU = [
  {
    cat: 'Ofertas especiais',
    items: [
      {
        id: 'o1',
        n: 'Burguer em Dobro',
        d: '2 burguer\u2019s por R$ 59,90. Escolha dois dos nossos hambúrgueres artesanais.',
        p: 59.9,
        i: 0,
        s: 'Serve 2 pessoas'
      },
      {
        id: 'o2',
        n: 'Sabor em Dobro',
        d: '2 burguer\u2019s + 2 porções por R$ 79,90. Escolha dois lanches e duas porções.',
        p: 79.9,
        i: 1,
        s: 'Serve 2 pessoas'
      },
      {
        id: 'o3',
        n: '3 Burguer\u2019s + 3 porções',
        d: 'Três combos de burguer + fritas por R$ 39,90 cada.',
        p: 119.7,
        i: 2,
        s: 'Serve 3 pessoas'
      },
      {
        id: 'o4',
        n: 'Quatro Burguer\u2019s',
        d: 'Escolha quatro dos nossos hambúrgueres artesanais por R$ 109,90.',
        p: 109.9,
        i: 3,
        s: 'Serve 4 pessoas'
      },
      {
        id: 'o5',
        n: 'Três Burguer\u2019s',
        d: 'Escolha três dos nossos hambúrgueres artesanais por R$ 89,90.',
        p: 89.9,
        i: 4,
        s: 'Serve 3 pessoas'
      }
    ]
  },
  {
    cat: 'Combos da Casa',
    items: [
      {
        id: 'c1',
        n: 'Combo Individual Cheddar Bacon',
        d: 'Hambúrguer artesanal 100 g, fritas com cheddar e bacon e refrigerante lata.',
        p: 59.9,
        i: 5,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'c2',
        n: 'Monte seu Combo Individual',
        d: 'Escolha seu burguer, sua porção e seu refrigerante lata.',
        p: 55.7,
        i: 6,
        s: 'Serve 1 pessoa',
        from: 1,
        f: 'a partir de; confirmar escolhas'
      },
      {
        id: 'c3',
        n: 'Combo Casal Cheddar Bacon',
        d: '2 burguer\u2019s, fritas com cheddar e bacon e refrigerante 600 ml.',
        p: 89.9,
        i: 7,
        s: 'Serve 2 pessoas'
      },
      {
        id: 'c4',
        n: 'Super Combo Cheddar Bacon',
        d: '3 burguer\u2019s, 0,5 kg de fritas com cheddar e bacon e Coca-Cola 2 L.',
        p: 119.9,
        i: 8,
        s: 'Serve 3 pessoas'
      },
      {
        id: 'c5',
        n: 'Combo Duplo da Casa',
        d: '2 burguer\u2019s, 2 fritas e 2 refrigerantes lata.',
        p: 89.9,
        i: 9,
        s: 'Serve 2 pessoas'
      },
      {
        id: 'c6',
        n: 'Combo Família',
        d: '4 burguer\u2019s, 4 porções e refrigerante 2 litros.',
        p: 149.9,
        i: 10,
        s: 'Serve 4 pessoas'
      }
    ]
  },
  {
    cat: 'Burguer com fritas',
    note: 'Cada lanche leva o nome de um bairro de Almirante Tamandaré. Na hora de pedir você escolhe burguer simples ou duplo, fritas tradicional ou com cheddar e bacon, molhos, refrigerante e porção.',
    items: [
      {
        id: 'b1',
        o: 1,
        n: 'Burguer Chico Mendes + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo mussarela, alface americana, tomate, cebola roxa e maionese de alho. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 47.99,
        i: 11,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b2',
        o: 1,
        n: 'Burguer Lamenha + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo mussarela, cebola frita crocante, maionese de alho e molho barbecue. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 48.99,
        i: 12,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b3',
        o: 1,
        n: 'Burguer Monte Santo + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, três fatias de bacon, maionese de alho e molho barbecue. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 48.99,
        i: 13,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b4',
        o: 1,
        n: 'Burguer Vila Prado + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, três fatias de bacon, alface americana, tomate e cebola roxa. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 49.99,
        i: 14,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b5',
        o: 1,
        n: 'Burguer Vila Grécia + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, três fatias de bacon, alface americana, tomate e cebola roxa. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 49.99,
        i: 15,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b6',
        o: 1,
        n: 'Burguer Alto Pinheiro + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, anéis de cebola empanados, alface americana, tomate e maionese de alho. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 48.99,
        i: 16,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b7',
        o: 1,
        n: 'Burguer São Venâncio + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, três fatias de bacon, anéis de cebola empanados e maionese de alho. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 48.99,
        i: 17,
        s: 'Serve 1 pessoa'
      },
      {
        id: 'b8',
        o: 1,
        n: 'Burguer Cachoeira + fritas',
        d: 'Hambúrguer artesanal 100 g, duas fatias de queijo cheddar, três fatias de bacon, anéis de cebola empanados e maionese de alho. Acompanha fritas (tradicional ou com cheddar cremoso e bacon). Burguer duplo por + R$ 5,90.',
        p: 48.99,
        i: 18,
        s: 'Serve 1 pessoa'
      }
    ]
  },
  {
    cat: 'Refrigerantes',
    items: DR.map(x => ({
      id: 'd_' + x.k,
      n: x.n,
      d: '',
      p: x.p,
      sd: x.k
    }))
  }
];
// ============================================================
// 5. PEDIDO / CARRINHO e envio para o WhatsApp
//    WAN = número do WhatsApp da loja (código do país + DDD + número).
// ============================================================
const WAN = '5541991071029', cart = [];
let cat = 'Todos', cfx = null;
const R = v => v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }), $ = id => document.getElementById(id);
const find = id => {
  for (const c of MENU)
    for (const x of c.items)
      if (x.id === id)
        return x;
};
const unit = l => find(l.id).p + l.sel.reduce((a, s) => a + s.p * s.q, 0);
function setCat(c) {
  cat = c;
  renderMenu();
}
function plain(id) {
  return cart.find(l => l.id === id && !l.sel.length && !l.note);
}
const ICON = {
  'Todos': '\uD83D\uDD25',
  'Ofertas especiais': '\uD83C\uDF89',
  'Combos da Casa': '\uD83E\uDD61',
  'Burguer com fritas': '\uD83C\uDF54',
  'Refrigerantes': '\uD83E\uDD64'
};
function mcard(x) {
  const l = plain(x.id), q = l ? l.q : 0, pr = R(x.p).split(/\s/);
  const ctl = x.o ? `<button class="addb" data-o="${ x.id }">+ Escolher opções</button>` : q ? `<div class="qt"><button data-m="${ x.id }" aria-label="Menos">−</button><b>${ q }</b><button data-p="${ x.id }" aria-label="Mais">+</button></div>` : `<button class="addb" data-p="${ x.id }">+ Adicionar</button>`;
  const im = x.i != null ? `<img src="${ IMG[x.i] }" alt="${ x.n }" loading="lazy">` : x.sd ? `<img class="sd" src="${ src(x.sd) }" alt="${ x.n }" loading="lazy">` : '<span class="em">\uD83E\uDD64</span>';
  return `<article class="mc"><div class="mi">${ im }${ x.s ? `<span class="bdg">${ x.s }</span>` : '' }</div><div class="mb"><h3>${ x.n }</h3>${ x.d ? `<p>${ x.d }</p>` : '' }<div class="mf"><div class="mp">${ x.from ? '<small>A partir de</small>' : '' }<span><i>${ pr[0] }</i>${ pr[1] }</span></div>${ ctl }</div></div></article>`;
}
function renderMenu() {
  const tb = $('tabs');
  tb.hidden = false;
  tb.innerHTML = [
    'Todos',
    ...MENU.map(c => c.cat)
  ].map(k => `<button class="${ k === cat ? 'on' : '' }" data-c="${ k }"><i>${ ICON[k] || '\uD83C\uDF54' }</i>${ k === 'Todos' ? 'Todos os itens' : k }</button>`).join('');
  const L = cat === 'Todos' ? MENU : [MENU.find(x => x.cat === cat) || MENU[0]];
  $('menu').innerHTML = L.map(c => (cat === 'Todos' ? `<h3 class="cathd">${ c.cat }</h3>` : '') + (c.note ? `<p class="catnote">${ c.note }</p>` : '') + c.items.map(mcard).join('')).join('');
}
function total() {
  let n = 0, v = 0;
  cart.forEach(l => {
    n += l.q;
    v += l.q * unit(l);
  });
  return {
    n,
    v
  };
}
function selTxt(l) {
  return l.sel.map(s => (s.q > 1 ? s.q + 'x ' : '') + s.n).join(' \xB7 ');
}
function msg() {
  const L = [];
  cart.forEach(l => {
    const x = find(l.id);
    L.push(`${ l.q }x ${ x.n } - ${ R(l.q * unit(l)) }${ x.f ? ' (' + x.f + ')' : '' }`);
    l.sel.forEach(s => L.push(`   • ${ s.q > 1 ? s.q + 'x ' : '' }${ s.n }${ s.p ? ` (+${ R(s.p * s.q) })` : '' }`));
    if (l.note)
      L.push(`   Obs: ${ l.note }`);
  });
  return '*Novo pedido - Tamandaré Burguer*\n\n' + L.join('\n') + `\n\n*Total: ${ R(total().v) }* (sem taxa de entrega)\n\nNome: ${ $('nm').value }\nEndereço: ${ $('ad').value }\nPagamento: ${ $('pg').value }` + ($('ob').value ? `\nObs: ${ $('ob').value }` : '');
}
function upd() {
  const t = total();
  renderMenu();
  $('cartbar').hidden = !t.n;
  $('cq').textContent = t.n;
  $('hq').textContent = t.n;
  $('ct').textContent = R(t.v);
  $('lines').innerHTML = (cart.length ? '' : '<p class="note">Seu pedido está vazio. Adicione itens do cardápio.</p>') + cart.map((l, i) => {
    const x = find(l.id);
    return `<div class="ln"><span>${ x.n }<br><small>${ R(unit(l)) }</small>${ l.sel.length ? `<small class="sel">${ selTxt(l) }</small>` : '' }${ l.note ? `<small class="sel">Obs: ${ l.note }</small>` : '' }</span><div class="qt"><button data-lm="${ i }">−</button><b>${ l.q }</b><button data-lp="${ i }">+</button></div></div>`;
  }).join('');
  $('tot').textContent = R(t.v);
  $('send').href = 'https://wa.me/' + WAN + '?text=' + encodeURIComponent(msg());
}
function chg(e) {
  const b = e.target.closest('button');
  if (!b)
    return;
  const d = b.dataset;
  if (d.c) {
    setCat(d.c);
    return;
  }
  if (d.o) {
    openCf(d.o);
    return;
  }
  if (d.p) {
    const l = plain(d.p);
    l ? l.q++ : cart.push({
      id: d.p,
      q: 1,
      sel: [],
      note: ''
    });
  }
  if (d.m) {
    const l = plain(d.m);
    if (l && --l.q <= 0)
      cart.splice(cart.indexOf(l), 1);
  }
  if (d.lp)
    cart[+d.lp].q++;
  if (d.lm) {
    const i = +d.lm;
    if (--cart[i].q <= 0)
      cart.splice(i, 1);
  }
  upd();
}
[
  'menu',
  'tabs',
  'lines'
].forEach(i => $(i).addEventListener('click', chg));
// ============================================================
// 6. TELA "ESCOLHER OPÇÕES" do hambúrguer (simples/duplo, fritas, molhos...)
// ============================================================
const gsum = g => Object.values(cfx.s[g.id] || {}).reduce((a, b) => a + b, 0);
const cfPrice = () => {
  let v = cfx.x.p;
  G.forEach(g => g.o.forEach((o, i) => v += o.p * ((cfx.s[g.id] || {})[i] || 0)));
  return v;
};
const cfOk = () => G.every(g => !g.req || gsum(g) === 1);
function openCf(id) {
  cfx = {
    x: find(id),
    s: {},
    q: 1,
    note: ''
  };
  renderCf();
  $('cf').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeCf() {
  $('cf').hidden = true;
  document.body.style.overflow = '';
  cfx = null;
}
function renderCf() {
  const sc = $('cfb') ? $('cfb').scrollTop : 0, ok = cfOk();
  $('cfp').innerHTML = `<div class="cfh"><button class="x" data-cx>✕</button><h3>${ cfx.x.n }</h3><p>${ R(cfx.x.p) } · escolha as opções abaixo</p></div><div class="cfb" id="cfb">` + G.map(g => {
    const n = gsum(g);
    const badge = g.req ? `<span class="rq ${ n === 1 ? 'ok' : '' }">${ n === 1 ? '\u2713 OK' : 'OBRIGATÓRIO' }</span>` : `<span class="rq ${ n ? 'ok' : '' }">${ n ? n + '/' + g.max : 'OPCIONAL' }</span>`;
    return `<div class="gh"><div><b>${ g.t }</b><small>${ g.req ? 'Escolha 1 opção.' : 'Escolha até ' + g.max + ' opções.' }</small></div>${ badge }</div>` + g.o.map((o, i) => {
      const q = (cfx.s[g.id] || {})[i] || 0, pp = o.p ? `<small class="pp">+ ${ R(o.p) }</small>` : '';
      const im = o.im ? `<img class="${ o.sd ? 'sd' : '' }" src="${ src(o.im) }" alt="">` : '';
      const txt = `<div class="t">${ o.n }${ o.d ? `<small>${ o.d }</small>` : '' }${ pp }</div>`;
      return g.max === 1 ? `<div class="op" data-r="${ g.id }|${ i }">${ im }${ txt }<span class="rd ${ q ? 'on' : '' }"></span></div>` : `<div class="op">${ im }${ txt }<div class="qt">${ q ? `<button data-s="${ g.id }|${ i }">−</button><b>${ q }</b>` : '' }<button data-a="${ g.id }|${ i }" ${ n >= g.max ? 'disabled' : '' }>+</button></div></div>`;
    }).join('');
  }).join('') + `<div class="cfn"><b>Algum comentário?</b><textarea id="cfn" rows="2" maxlength="140" placeholder="Ex.: tirar a cebola, maionese à parte etc.">${ cfx.note }</textarea></div></div><div class="cff"><div class="qt"><button data-cq="-1">−</button><b>${ cfx.q }</b><button data-cq="1">+</button></div><button class="btn" data-add ${ ok ? '' : 'disabled' }>${ ok ? 'Adicionar \xB7 ' + R(cfPrice() * cfx.q) : 'Escolha as opções obrigatórias' }</button></div>`;
  $('cfb').scrollTop = sc;
  $('cfn').addEventListener('input', e => cfx.note = e.target.value);
}
$('cf').addEventListener('click', e => {
  if (e.target.id === 'cfbg') {
    closeCf();
    return;
  }
  const r = e.target.closest('[data-r]'), b = e.target.closest('button');
  if (r) {
    const [g, i] = r.dataset.r.split('|');
    cfx.s[g] = { [i]: 1 };
    renderCf();
    return;
  }
  if (!b)
    return;
  const d = b.dataset;
  if ('cx' in d) {
    closeCf();
    return;
  }
  if (d.a || d.s) {
    const [g, i] = (d.a || d.s).split('|'), gr = G.find(x => x.id === g), m = cfx.s[g] = cfx.s[g] || {};
    if (d.a && gsum(gr) < gr.max)
      m[i] = (m[i] || 0) + 1;
    if (d.s) {
      m[i] = (m[i] || 0) - 1;
      if (m[i] <= 0)
        delete m[i];
    }
    renderCf();
    return;
  }
  if (d.cq) {
    cfx.q = Math.max(1, cfx.q + +d.cq);
    renderCf();
    return;
  }
  if ('add' in d && cfOk()) {
    const sel = [];
    G.forEach(g => g.o.forEach((o, i) => {
      const q = (cfx.s[g.id] || {})[i];
      if (q)
        sel.push({
          g: g.id,
          n: o.n,
          p: o.p,
          q
        });
    }));
    const note = cfx.note.trim(), k = JSON.stringify([
        sel,
        note
      ]), ex = cart.find(l => l.id === cfx.x.id && JSON.stringify([
        l.sel,
        l.note
      ]) === k);
    ex ? ex.q += cfx.q : cart.push({
      id: cfx.x.id,
      q: cfx.q,
      sel,
      note
    });
    closeCf();
    upd();
  }
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && cfx)
    closeCf();
});
const od = () => {
  upd();
  $('dr').hidden = false;
};
$('opencart').onclick = od;
$('hped').onclick = od;
$('cls').onclick = $('drbg').onclick = () => $('dr').hidden = true;
$('clr').onclick = () => {
  cart.length = 0;
  upd();
};
[
  'nm',
  'ad',
  'pg',
  'ob'
].forEach(i => $(i).addEventListener('input', upd));
$('send').addEventListener('click', e => {
  let bad = cart.length ? 0 : 1;
  [
    'nm',
    'ad'
  ].forEach(i => {
    const f = $(i);
    f.classList.toggle('err', !f.value.trim());
    if (!f.value.trim())
      bad = 1;
  });
  if (bad)
    e.preventDefault();
});
renderMenu();
// ============================================================
// 7. AVISO "ABERTO AGORA / FECHADO" (horário de Brasília)
//    Funcionamento: segunda a sábado, 18h às 23h30. Domingo fechado.
//    (1080 = 18h00 em minutos | 1410 = 23h30 em minutos)
// ============================================================
function openState(d) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(d || new Date()).map(x => [
    x.type,
    x.value
  ]));
  const m = +p.hour % 24 * 60 + +p.minute, dom = p.weekday === 'Sun', sab = p.weekday === 'Sat';
  if (!dom && m >= 1080 && m < 1410)
    return {
      open: true,
      msg: '\uD83D\uDFE2 Aberto agora \xB7 atendemos até 23h30'
    };
  if (dom)
    return {
      open: false,
      msg: '\uD83D\uDD34 Fechado aos domingos \xB7 abrimos segunda às 18h'
    };
  if (m < 1080)
    return {
      open: false,
      msg: '\uD83D\uDD34 Fechado agora \xB7 abrimos hoje às 18h'
    };
  return {
    open: false,
    msg: sab ? '\uD83D\uDD34 Fechado agora \xB7 abrimos segunda às 18h' : '\uD83D\uDD34 Fechado agora \xB7 abrimos amanhã às 18h'
  };
}
function showState() {
  const s = openState();
  const e = document.getElementById('status');
  e.textContent = s.msg;
  e.style.color = s.open ? '#6ee7a0' : '#ff8a80';
  const c = document.getElementById('cn');
  c.hidden = s.open;
  c.textContent = s.open ? '' : 'No momento estamos fechados. Você pode enviar o pedido e ele será atendido quando abrirmos.';
}
showState();
setInterval(showState, 60000);
// ============================================================
// 8. CABEÇALHO: mede a altura e destaca o item do menu da seção atual.
// ============================================================
const HD = document.getElementById('hd');
function hh() {
  document.documentElement.style.setProperty('--hh', HD.offsetHeight + 'px');
}
hh();
addEventListener('resize', hh);
if (window.ResizeObserver)
  new ResizeObserver(hh).observe(HD);
const SECS = [
  'sobre',
  'cardapio',
  'depoimentos',
  'contato'
];
function spy() {
  let a = 'top';
  SECS.forEach(id => {
    const e = document.getElementById(id);
    if (e && e.getBoundingClientRect().top < innerHeight * 0.4)
      a = id;
  });
  document.querySelectorAll('.hn a[data-go],.snav a[data-go]').forEach(l => l.classList.toggle('on', l.dataset.go === a));
}
addEventListener('scroll', spy, { passive: true });
spy();
// ============================================================
// 9. BRASINHAS no fundo do site inteiro
// ============================================================
(function () {
  const c = document.getElementById('embers');
  if (!c || matchMedia('(prefers-reduced-motion:reduce)').matches)
    return;
  const x = c.getContext('2d');
  let w, h, last = 0, sy = scrollY;
  const P = [];
  function rs() {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
  }
  rs();
  addEventListener('resize', rs);
  const sp = document.createElement('canvas');
  sp.width = sp.height = 32;
  const g = sp.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, 'rgba(255,235,170,1)');
  r.addColorStop(0.25, 'rgba(255,150,40,.85)');
  r.addColorStop(1, 'rgba(255,70,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 32, 32);
  const N = innerWidth < 760 ? 34 : 64;
  const mk = i => ({
    x: Math.random() * w,
    y: i ? Math.random() * h : h + 20,
    z: Math.random(),
    ph: Math.random() * 6.28,
    s: 2.5 + Math.random() * 5
  });
  for (let i = 0; i < N; i++)
    P.push(mk(1));
  function f(t) {
    requestAnimationFrame(f);
    if (document.hidden)
      return;
    const dt = Math.min(0.05, (t - last) / 1000) || 0.016;
    last = t;
    const dy = scrollY - sy;
    sy = scrollY;
    x.clearRect(0, 0, w, h);
    x.globalCompositeOperation = 'lighter';
    for (const p of P) {
      p.y -= (14 + p.z * 46) * dt + dy * 0.22 * p.z;
      p.x += Math.sin(t / 1100 + p.ph) * (8 + p.z * 14) * dt;
      if (p.y < -20 || p.x < -20 || p.x > w + 20) {
        Object.assign(p, mk(0));
        continue;
      }
      if (p.y > h + 40) {
        p.y = -10;
      }
      const fl = 0.65 + 0.35 * Math.sin(t / 260 + p.ph), a = (0.22 + 0.6 * p.z) * fl * Math.min(1, p.y / (h * 0.3)), sz = p.s * (2.2 + p.z * 2.6);
      x.globalAlpha = Math.max(0, a);
      x.drawImage(sp, p.x - sz / 2, p.y - sz / 2, sz, sz);
    }
    x.globalAlpha = 1;
    x.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(f);
}());