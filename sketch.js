// Variáveis globais para o estado do jogo e elementos visuais
let cartas = []; // Array para armazenar todos os objetos Carta
let imagensCampoCidade = {}; // Objeto para armazenar as imagens ou conteúdos dos pares
let imagemVerso; // Imagem para o verso de todas as cartas (opcional, se usar imagens)

let cartaVirada1 = null; // Armazena a primeira carta clicada
let cartaVirada2 = null; // Armazena a segunda carta clicada

let bloqueioDeCliques = false; // Impede cliques enquanto as cartas estão sendo comparadas/viradas de volta
let paresEncontrados = 0; // Contador de pares encontrados
const totalDePares = 6; // Defina quantos pares você quer no jogo (ex: 6 pares = 12 cartas)

// Configurações do layout da grade das cartas
const numColunas = 4;
const numLinhas = 3; // (totalDePares * 2) / numColunas
const margem = 20; // Margem ao redor da grade de cartas
const espacamento = 10; // Espaçamento entre as cartas
let larguraCarta; // Largura calculada para cada carta
let alturaCarta; // Altura calculada para cada carta

// Variáveis para as telas do jogo e o estado atual
let gameState = 'intro'; // Estados possíveis: 'intro', 'playing', 'win'
let playButton; // Objeto para o botão "Jogar"
let restartButton; // Objeto para o botão "Jogar Novamente"

// Variáveis para a animação da tela de introdução
let fieldParticles = []; // Partículas representando o campo
let cityParticles = []; // Partículas representando a cidade
const NUM_PARTICLES = 50; // Número de partículas para cada lado

// Conteúdo de texto para a animação da introdução
const INTRO_ANIMATION_TEXTS = [
  "Bem-vindo(a) ao",
  "Conexão Campo & Cidade!",
  "Um Jogo da Memória.",
  "Encontre os pares!",
  "O Campo produz...",
  "...a Cidade transforma!",
  "Pronto(a) para começar?"
];
let currentIntroTextIndex = 0; // Índice do texto atual na animação
let introTextDisplayTime = 120; // Tempo em frames para cada texto (aprox. 2 segundos)
let introTextTimer = 0; // Contador para controlar a mudança do texto

// --- Função de Pré-carregamento de Imagens ---
// Esta função é executada antes do setup(). É ideal para carregar recursos como imagens.
function preload() {
  // Para usar imagens reais:
  // 1. Crie uma pasta 'assets' no seu projeto P5.js.
  // 2. Faça upload das suas imagens para a pasta 'assets'.
  // 3. Descomente as linhas 'loadImage()' abaixo e atualize os caminhos dos arquivos.
  // 4. Comente ou remova as linhas com emojis.

  // Exemplo de carregamento de imagem para o verso da carta:
  // imagemVerso = loadImage('assets/card_back.png');

  // Exemplo de carregamento de imagens para os pares (você precisará de imagens para cada 'tipo' de carta):
  // imagensCampoCidade['vaca'] = loadImage('assets/vaca.png');
  // imagensCampoCidade['leite'] = loadImage('assets/leite.png');
  // imagensCampoCidade['trigo'] = loadImage('assets/trigo.png');
  // imagensCampoCidade['pao'] = loadImage('assets/pao.png');
  // imagensCampoCidade['galinha'] = loadImage('assets/galinha.png');
  // imagensCampoCidade['ovo'] = loadImage('assets/ovo.png');
  // imagensCampoCidade['arvore'] = loadImage('assets/arvore.png');
  // imagensCampoCidade['movel'] = loadImage('assets/movel.png');
  // imagensCampoCidade['horta'] = loadImage('assets/horta.png');
  // imagensCampoCidade['salada'] = loadImage('assets/salada.png');
  // imagensCampoCidade['caminhao'] = loadImage('assets/caminhao.png');
  // imagensCampoCidade['entrega'] = loadImage('assets/entrega.png');

  // Para demonstração inicial, usando emojis como conteúdo das cartas:
  imagensCampoCidade['vaca'] = '🐄';
  imagensCampoCidade['leite'] = '🥛';
  imagensCampoCidade['trigo'] = '🌾';
  imagensCampoCidade['pao'] = '🍞';
  imagensCampoCidade['galinha'] = '🐔';
  imagensCampoCidade['ovo'] = '🥚';
  imagensCampoCidade['arvore'] = '🌳';
  imagensCampoCidade['movel'] = '🛋️';
  imagensCampoCidade['horta'] = '🥕';
  imagensCampoCidade['salada'] = '🥗';
  imagensCampoCidade['caminhao'] = '🚚';
  imagensCampoCidade['entrega'] = '📦';
}

// --- Configuração Inicial do Jogo ---
// Esta função é executada uma vez quando o programa inicia.
function setup() {
  // Cria o canvas que será a área do jogo.
  // O tamanho é ajustado para ocupar 80% da largura e altura da janela do navegador.
  createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  background(240); // Define a cor de fundo (cinza claro)
  textFont('Arial'); // Define uma fonte padrão para todo o jogo

  // Calcula a largura e altura de cada carta para que se encaixem na grade com as margens e espaçamentos.
  larguraCarta = (width - (margem * 2) - (espacamento * (numColunas - 1))) / numColunas;
  alturaCarta = (height - (margem * 2) - (espacamento * (numLinhas - 1))) / numLinhas;

  // Inicializa o botão de jogar para a tela de introdução
  // O Y do botão 'Jogar' permanece em height * 0.85
  playButton = new Button(width / 2, height * 0.85, 180, 60, 'Jogar', () => {
    startGame(); // Inicia o jogo quando o botão é clicado
  });

  // Inicializa o botão de reiniciar para a tela de vitória
  restartButton = new Button(width / 2, height * 0.85, 230, 60, 'Jogar Novamente', () => {
    restartGame(); // Reinicia o jogo quando o botão é clicado
  });

  // Inicializa as partículas para a animação da tela de introdução
  for (let i = 0; i < NUM_PARTICLES; i++) {
    fieldParticles.push({
      x: random(-width / 2, 0), // Começa fora da tela à esquerda
      y: random(height * 0.4, height * 0.6), // Altura no meio
      size: random(10, 25), // Tamanho variado
      speed: random(1, 3) // Velocidade variada
    });
    cityParticles.push({
      x: random(width, width * 1.5), // Começa fora da tela à direita
      y: random(height * 0.4, height * 0.6), // Altura no meio
      size: random(10, 25), // Tamanho variado
      speed: random(1, 3) // Velocidade variada
    });
  }

  // Configura o jogo pela primeira vez
  initializeGameCards();
}

// --- Loop Principal do Jogo ---
// Esta função é executada repetidamente (geralmente 60 vezes por segundo).
function draw() {
  background(240); // Limpa o fundo do canvas a cada frame para redesenhar.

  // Gerencia qual tela deve ser exibida com base no estado do jogo
  switch (gameState) {
    case 'intro':
      drawIntroScreen();
      break;
    case 'playing':
      drawGameScreen();
      break;
    case 'win':
      drawWinScreen();
      break;
  }
}

// --- Funções de Inicialização e Reinício do Jogo ---

// Função para iniciar ou reiniciar as cartas do jogo
function initializeGameCards() {
  cartas = []; // Limpa as cartas existentes

  // Define os tipos de pares que serão usados no jogo.
  // Cada sub-array representa um par: [item do campo, item da cidade].
  const tiposDePares = [
    ['vaca', 'leite'],
    ['trigo', 'pao'],
    ['galinha', 'ovo'],
    ['arvore', 'movel'],
    ['horta', 'salada'],
    ['caminhao', 'entrega']
  ];

  // Cria as cartas e adiciona ao array 'cartas'.
  // Para cada par definido em 'tiposDePares', duas cartas são criadas:
  // uma com o conteúdo/tipo do campo e outra com o conteúdo/tipo da cidade.
  for (let i = 0; i < totalDePares; i++) {
    const [tipoCampo, tipoCidade] = tiposDePares[i];
    cartas.push(new Carta(imagensCampoCidade[tipoCampo], tipoCampo));
    cartas.push(new Carta(imagensCampoCidade[tipoCidade], tipoCidade));
  }

  // Embaralha o array de cartas para que a posição dos pares seja aleatória.
  shuffleArray(cartas);

  // Posiciona cada carta na grade visual.
  let index = 0;
  for (let linha = 0; linha < numLinhas; linha++) {
    for (let coluna = 0; coluna < numColunas; coluna++) {
      let x = margem + coluna * (larguraCarta + espacamento);
      let y = margem + linha * (alturaCarta + espacamento);
      if (index < cartas.length) { // Garante que não tentará acessar um índice fora do array
        cartas[index].setPosicao(x, y, larguraCarta, alturaCarta);
        index++;
      }
    }
  }
}

// Inicia o jogo a partir da tela de introdução
function startGame() {
  gameState = 'playing';
  paresEncontrados = 0; // Reinicia o contador de pares
  resetCartasViradas(); // Garante que não há cartas viradas de uma sessão anterior
  initializeGameCards(); // Prepara um novo conjunto de cartas embaralhadas
}

// Reinicia o jogo a partir da tela de vitória
function restartGame() {
  gameState = 'playing';
  paresEncontrados = 0; // Reinicia o contador de pares
  resetCartasViradas();
  initializeGameCards(); // Prepara um novo conjunto de cartas embaralhadas
}

// --- Funções de Desenho das Telas ---

// Desenha a tela de introdução do jogo
function drawIntroScreen() {
  background(173, 216, 230); // Fundo azul claro (céu)

  // Desenha e anima as partículas do campo
  for (let p of fieldParticles) {
    fill(34, 139, 34, 200); // Verde floresta semi-transparente
    noStroke();
    ellipse(p.x, p.y, p.size);
    p.x += p.speed;
    // Se a partícula passou do centro, reinicia ela da esquerda
    if (p.x > width / 2 + 100) {
      p.x = random(-width / 4, 0);
      p.y = random(height * 0.4, height * 0.6);
      p.speed = random(1, 3); // Reinicia a velocidade também para variar
    }
  }

  // Desenha e anima as partículas da cidade
  for (let p of cityParticles) {
    fill(105, 105, 105, 200); // Cinza semi-transparente
    noStroke();
    rect(p.x, p.y, p.size, p.size);
    p.x -= p.speed;
    // Se a partícula passou do centro, reinicia ela da direita
    if (p.x < width / 2 - 100) {
      p.x = random(width, width * 1.25);
      p.y = random(height * 0.4, height * 0.6);
      p.speed = random(1, 3); // Reinicia a velocidade também para variar
    }
  }

  // Título principal do jogo
  fill(50); // Cor do texto escura
  textSize(32);
  textAlign(CENTER, CENTER);
  // ALTERAÇÃO AQUI: Y do título principal movido para height / 3
  text('Conexão Campo & Cidade', width / 2, height / 3);

  textSize(30);
  // ALTERAÇÃO AQUI: Y do subtítulo movido para height / 3 + 50
  text('O Jogo da Memória', width / 2, height / 3 + 50);

  // Animação de texto resumido
  introTextTimer++;
  if (introTextTimer >= introTextDisplayTime) {
    introTextTimer = 0;
    currentIntroTextIndex = (currentIntroTextIndex + 1) % INTRO_ANIMATION_TEXTS.length;
  }

  fill(80);
  textSize(24);
  text(INTRO_ANIMATION_TEXTS[currentIntroTextIndex], width / 2, height / 2 + 80);

  // Exibe o botão de jogar
  playButton.display();
}

// Desenha a tela principal do jogo
function drawGameScreen() {
  // Desenha todas as cartas
  for (let carta of cartas) {
    carta.display();
  }

  // Exibe o placar de pares encontrados na parte inferior do canvas.
  fill(0); // Cor do texto preta
  textSize(18); // Tamanho da fonte
  textAlign(LEFT, TOP); // Alinhamento do texto
  text(`Pares Encontrados: ${paresEncontrados}/${totalDePares}`, margem, height - margem - 1);
}

// Desenha a tela de vitória
function drawWinScreen() {
  background(200, 255, 200); // Fundo verde claro para vitória
  fill(0, 150, 0); // Cor verde para a mensagem
  textSize(28); // Tamanho maior para a mensagem de vitória
  textAlign(CENTER, CENTER); // Centraliza a mensagem no canvas
  text('Parabéns! Você conectou tudo!', width / 2, height / 2 - 50);

  fill(50);
  textSize(20);
  text('O campo e a cidade estão em harmonia!', width / 2, height / 2 + 20);

  // Exibe o botão de reiniciar
  restartButton.display();
}


// --- Manipulação de Cliques do Mouse ---
// Esta função é chamada automaticamente sempre que o mouse é pressionado.
function mousePressed() {
  // Gerencia cliques com base no estado atual do jogo
  switch (gameState) {
    case 'intro':
      playButton.handleClick(mouseX, mouseY);
      break;
    case 'playing':
      if (bloqueioDeCliques) {
        return; // Se estiver bloqueado, não processa o clique
      }

      for (let carta of cartas) {
        if (carta.contemPonto(mouseX, mouseY) && !carta.estaViradaParaCima && !carta.encontrada) {
          carta.virar(); // Vira a carta

          if (cartaVirada1 === null) {
            cartaVirada1 = carta; // Primeira carta virada
          } else if (cartaVirada2 === null && carta !== cartaVirada1) { // Segunda carta virada (e diferente da primeira)
            cartaVirada2 = carta;
            bloqueioDeCliques = true; // Bloqueia cliques enquanto as cartas são comparadas

            // Verifica se é um par
            if (saoPares(cartaVirada1, cartaVirada2)) {
              console.log("Par encontrado!");
              cartaVirada1.encontrada = true; // Marca ambas as cartas como encontradas
              cartaVirada2.encontrada = true;
              paresEncontrados++; // Incrementa o contador de pares
              resetCartasViradas(); // Reseta as variáveis das cartas viradas para a próxima tentativa.

              if (paresEncontrados === totalDePares) {
                gameState = 'win'; // Altera o estado do jogo para 'win'
              }
            } else {
              console.log("Não é um par. Tente novamente!");
              // Se não for um par, vira as cartas de volta para baixo após um pequeno atraso.
              setTimeout(() => {
                cartaVirada1.virar(); // Vira a primeira carta de volta
                cartaVirada2.virar(); // Vira a segunda carta de volta
                resetCartasViradas(); // Reseta as variáveis das cartas viradas.
              }, 1200); // Espera 1.2 segundos antes de virar as cartas de volta.
            }
          }
          return; // Sai da função `mousePressed` para processar apenas um clique por vez
        }
      }
      break;
    case 'win':
      restartButton.handleClick(mouseX, mouseY); // Lida com cliques no botão de reiniciar
      break;
  }
}

// --- Função para verificar se duas cartas formam um par ---
// Recebe duas cartas e verifica se seus tipos correspondem a um par válido.
function saoPares(c1, c2) {
  // Define os pares válidos usando um objeto para mapear um tipo ao seu par correspondente.
  const paresEsperados = {
    'vaca': 'leite',
    'leite': 'vaca',
    'trigo': 'pao',
    'pao': 'trigo',
    'galinha': 'ovo',
    'ovo': 'galinha',
    'arvore': 'movel',
    'movel': 'arvore',
    'horta': 'salada',
    'salada': 'horta',
    'caminhao': 'entrega',
    'entrega': 'caminhao'
  };

  // Retorna true se o tipo da primeira carta corresponde ao par esperado da segunda carta.
  return paresEsperados[c1.tipo] === c2.tipo;
}

// --- Reseta as variáveis das cartas viradas ---
// Limpa as referências das cartas que foram viradas e desbloqueia os cliques.
function resetCartasViradas() {
  cartaVirada1 = null;
  cartaVirada2 = null;
  bloqueioDeCliques = false; // Desbloqueia os cliques para o jogador poder continuar.
}

// --- Classe Carta ---
// Define a estrutura e o comportamento de uma carta individual no jogo.
class Carta {
  constructor(conteudo, tipo) {
    this.conteudo = conteudo; // O que será exibido na frente da carta (emoji, imagem, texto).
    this.tipo = tipo; // O identificador do par (ex: 'vaca', 'leite'). Usado para verificar pares.
    this.estaViradaParaCima = false; // Booleano: true se a carta está virada para cima.
    this.encontrada = false; // Booleano: true se esta carta faz parte de um par já encontrado.

    this.x = 0; // Posição X da carta
    this.y = 0; // Posição Y da carta
    this.largura = 0; // Largura da carta
    this.altura = 0; // Altura da carta
  }

  // Define a posição e o tamanho da carta.
  setPosicao(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
  }

  // Desenha a carta no canvas.
  display() {
    push(); // Salva as configurações de estilo atuais (cor, stroke, etc.)

    if (this.estaViradaParaCima || this.encontrada) {
      // Se a carta está virada para cima ou seu par já foi encontrado, desenha a frente.
      fill(255); // Fundo branco para a carta
      stroke(100); // Contorno cinza
      rect(this.x, this.y, this.largura, this.altura, 5); // Desenha um retângulo com bordas arredondadas.

      // Se o conteúdo é uma imagem (descomente quando usar imagens reais):
      // if (typeof this.conteudo === 'object' && this.conteudo instanceof p5.Image) {
      //   image(this.conteudo, this.x + 5, this.y + 5, this.largura - 10, this.altura - 10);
      // } else {
      // Se o conteúdo é texto (emoji ou string):
      fill(0); // Cor do texto preta
      textSize(min(this.largura, this.altura) * 0.6); // Ajusta o tamanho do texto dinamicamente.
      textAlign(CENTER, CENTER); // Centraliza o texto dentro da carta.
      text(this.conteudo, this.x + this.largura / 2, this.y + this.altura / 2);
      // }
    } else {
      // Se a carta está virada para baixo, desenha o verso.
      fill(50, 150, 200); // Azul vibrante para o verso
      stroke(100); // Contorno cinza
      rect(this.x, this.y, this.largura, this.altura, 5); // Desenha um retângulo com bordas arredondadas.

      // Opcional: Adicione um ícone ou texto ao verso (ex: um ponto de interrogação).
      fill(255); // Cor branca para o texto no verso
      textSize(this.largura * 0.3); // Ajusta o tamanho do texto do verso
      textAlign(CENTER, CENTER);
      text('?', this.x + this.largura / 2, this.y + this.altura / 2);
      // Se você tiver uma imagem de verso:
      // if (imagemVerso) { // Verifica se a imagemVerso foi carregada
      //   image(imagemVerso, this.x, this.y, this.largura, this.altura);
      // }
    }
    pop(); // Restaura as configurações de estilo salvas.
  }

  // Verifica se um ponto (px, py) está dentro dos limites da carta.
  contemPonto(px, py) {
    return px > this.x && px < this.x + this.largura &&
           py > this.y && py < this.y + this.altura;
  }

  // Alterna o estado `estaViradaParaCima` da carta.
  virar() {
    this.estaViradaParaCima = !this.estaViradaParaCima;
  }
}

// --- Classe Button ---
// Define a estrutura e o comportamento de um botão genérico.
class Button {
  constructor(x, y, w, h, text, onClick) {
    this.x = x; // Posição X do centro do botão
    this.y = y; // Posição Y do centro do botão
    this.w = w; // Largura do botão
    this.h = h; // Altura do botão
    this.text = text; // Texto exibido no botão
    this.onClick = onClick; // Função a ser executada quando o botão é clicado
  }

  display() {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    // Altera a cor ao passar o mouse por cima
    if (this.isHovered(mouseX, mouseY)) {
      fill(100, 200, 100); // Verde mais claro ao passar o mouse
    } else {
      fill(60, 179, 113); // Verde médio
    }
    stroke(50);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 10); // Desenha o botão com bordas arredondadas

    fill(255); // Cor do texto branca
    textSize(28);
    text(this.text, this.x, this.y);
    pop();
  }

  // Verifica se o mouse está sobre o botão
  isHovered(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
           py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }

  // Executa a função onClick se o botão for clicado
  handleClick(px, py) {
    if (this.isHovered(px, py)) {
      this.onClick();
    }
  }
}


// --- Função para embaralhar um array (algoritmo Fisher-Yates) ---
// Usado para randomizar a posição das cartas.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = floor(random(i + 1)); // Gera um índice aleatório
    [array[i], array[j]] = [array[j], array[i]]; // Troca elementos
  }
}

// --- Ajusta o canvas e o layout das cartas ao redimensionar a janela ---
// Garante que o jogo seja responsivo ao tamanho da tela.
function windowResized() {
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8); // Redimensiona o canvas.

  // Recalcula o tamanho das cartas.
  larguraCarta = (width - (margem * 2) - (espacamento * (numColunas - 1))) / numColunas;
  alturaCarta = (height - (margem * 2) - (espacamento * (numLinhas - 1))) / numLinhas;

  // Reposiciona todas as cartas na nova grade.
  let index = 0;
  for (let linha = 0; linha < numLinhas; linha++) {
    for (let coluna = 0; coluna < numColunas; coluna++) {
      let x = margem + coluna * (larguraCarta + espacamento);
      let y = margem + linha * (alturaCarta + espacamento);
      if (index < cartas.length) {
        cartas[index].setPosicao(x, y, larguraCarta, alturaCarta);
        index++;
      }
    }
  }

  // Reposiciona os botões na tela de introdução e vitória
  playButton.x = width / 2;
  // O Y do botão 'Jogar' permanece em height * 0.85 ao redimensionar
  playButton.y = height * 0.85;
  restartButton.x = width / 2;
  restartButton.y = height * 0.85;

  // Reinicializa as posições das partículas para a tela de introdução
  // para que elas se ajustem ao novo tamanho da tela.
  for (let i = 0; i < NUM_PARTICLES; i++) {
    fieldParticles[i].x = random(-width / 2, 0);
    fieldParticles[i].y = random(height * 0.4, height * 0.6);
    cityParticles[i].x = random(width, width * 1.5);
    cityParticles[i].y = random(height * 0.4, height * 0.6);
  }
}