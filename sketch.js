// Variáveis globais
let meuModelo3D;
let rotacaoX = 0;
let rotacaoY = 0;
let escala = 1;
let carregando = true;

// Variáveis para posição (translate)
let posX = 0;
let posY = 0;
let posZ = 0;

// Variáveis para controle de teclas pressionadas
let teclasPressionadas = {};

// Velocidades de movimento
const velocidadeMovimento = 5;
const velocidadeRotacao = 0.05;

// Função preload - carrega assets antes do setup
function preload() {
    meuModelo3D = loadModel('assets/models/Tubby_Duck_Free.stl', true, 
        function() {
            console.log('Modelo carregado com sucesso!');
            carregando = false;
        },
        function(err) {
            console.error('Erro ao carregar modelo:', err);
            carregando = false;
        }
    );
}

function setup() {
    let canvas = createCanvas(800, 600, WEBGL);
    canvas.parent('canvas-container');
    
    background(30);
    debugMode();
}

function draw() {
    background(30);
    
    // Iluminação aprimorada
    lights();
    ambientLight(80, 80, 80);
    pointLight(255, 255, 255, 0, -200, 200);
    directionalLight(255, 255, 255, 0.25, 0.25, -1);
    pointLight(255, 200, 200, 200, -200, 200);
    pointLight(200, 200, 255, -200, -200, 200);
    
    // Se ainda está carregando, mostra mensagem
    if (carregando) {
        push();
        fill(255);
        textAlign(CENTER);
        text('Carregando modelo 3D...', 0, 0);
        pop();
        return;
    }
    
    // Controles de câmera com mouse
    orbitControl();
    
    // Processa movimento contínuo
    processarMovimento();
    
    // Aplicar transformações
    push();
    
    // TRANSLATE - Move o objeto no espaço 3D
    translate(posX, posY, posZ);
    
    // Efeito de flutuação suave (opcional - remove se não gostar)
    let flutuacao = sin(frameCount * 0.02) * 10;
    translate(0, flutuacao, 0);
    
    // Rotação
    rotateX(rotacaoX);
    rotateY(rotacaoY);
    
    // Rotação automática suave (opcional)
    rotateY(frameCount * 0.005);
    
    // Escala
    scale(escala);
    
    // Use normalMaterial() que sempre é visível
    normalMaterial();
    // ou adicione mais luzes
    pointLight(255, 255, 255, 200, -200, 200);
    pointLight(255, 255, 255, -200, -200, 200);
    
    // Desenha o modelo
    if (meuModelo3D) {
        model(meuModelo3D);
    }
    
    pop();
    
    // Desenha eixos de referência (opcional)
    desenharEixos();
    
    // Mostra informações na tela
    mostrarInfo();
}

// Função para processar movimento contínuo
function processarMovimento() {
    // Movimento horizontal (X)
    if (teclasPressionadas[LEFT_ARROW]) {
        posX -= velocidadeMovimento;
    }
    if (teclasPressionadas[RIGHT_ARROW]) {
        posX += velocidadeMovimento;
    }
    
    // Movimento vertical (Y)
    if (teclasPressionadas[UP_ARROW]) {
        posY -= velocidadeMovimento;
    }
    if (teclasPressionadas[DOWN_ARROW]) {
        posY += velocidadeMovimento;
    }
    
    // Movimento profundidade (Z)
    if (teclasPressionadas['w'] || teclasPressionadas['W']) {
        posZ -= velocidadeMovimento;
    }
    if (teclasPressionadas['s'] || teclasPressionadas['S']) {
        posZ += velocidadeMovimento;
    }
    
    // Rotação contínua
    if (teclasPressionadas['a'] || teclasPressionadas['A']) {
        rotacaoY -= velocidadeRotacao;
    }
    if (teclasPressionadas['d'] || teclasPressionadas['D']) {
        rotacaoY += velocidadeRotacao;
    }
    if (teclasPressionadas['q'] || teclasPressionadas['Q']) {
        rotacaoX -= velocidadeRotacao;
    }
    if (teclasPressionadas['e'] || teclasPressionadas['E']) {
        rotacaoX += velocidadeRotacao;
    }
    
    // Escala contínua
    if (teclasPressionadas['+'] || teclasPressionadas['=']) {
        escala *= 1.02;
    }
    if (teclasPressionadas['-'] || teclasPressionadas['_']) {
        escala *= 0.98;
    }
}

// Função para desenhar eixos de referência
function desenharEixos() {
    push();
    strokeWeight(2);
    
    // Eixo X - Vermelho
    stroke(255, 0, 0);
    line(0, 0, 0, 100, 0, 0);
    
    // Eixo Y - Verde
    stroke(0, 255, 0);
    line(0, 0, 0, 0, -100, 0);
    
    // Eixo Z - Azul
    stroke(0, 0, 255);
    line(0, 0, 0, 0, 0, 100);
    
    pop();
}

// Função para mostrar informações
function mostrarInfo() {
    push();
    fill(255);
    textAlign(LEFT);
    textSize(14);
    
    let startY = -height/2 + 30;
    let lineHeight = 20;
    
    text('🎮 Controles:', -width/2 + 20, startY);
    text('• Mouse: Rotacionar câmera', -width/2 + 20, startY + lineHeight);
    text('• Scroll: Zoom da câmera', -width/2 + 20, startY + lineHeight * 2);
    text('• ←→↑↓: Mover objeto (X/Y)', -width/2 + 20, startY + lineHeight * 3);
    text('• W/S: Mover objeto (Z)', -width/2 + 20, startY + lineHeight * 4);
    text('• A/D: Rotação Y', -width/2 + 20, startY + lineHeight * 5);
    text('• Q/E: Rotação X', -width/2 + 20, startY + lineHeight * 6);
    text('• +/-: Ajustar escala', -width/2 + 20, startY + lineHeight * 7);
    text('• R: Reset posição', -width/2 + 20, startY + lineHeight * 8);
    text('• Espaço: Posição aleatória', -width/2 + 20, startY + lineHeight * 9);
    
    // Mostra posição atual
    textAlign(RIGHT);
    text(`Posição: X:${posX.toFixed(0)} Y:${posY.toFixed(0)} Z:${posZ.toFixed(0)}`, width/2 - 20, startY);
    text(`Rotação: X:${degrees(rotacaoX).toFixed(0)}° Y:${degrees(rotacaoY).toFixed(0)}°`, width/2 - 20, startY + lineHeight);
    text(`Escala: ${(escala * 100).toFixed(0)}%`, width/2 - 20, startY + lineHeight * 2);
    
    pop();
}

// Registra quando uma tecla é pressionada
function keyPressed() {
    teclasPressionadas[keyCode] = true;
    teclasPressionadas[key] = true;
    
    // Ações especiais que acontecem uma vez
    if (key === 'r' || key === 'R') {
        // Reset completo
        rotacaoX = 0;
        rotacaoY = 0;
        escala = 1;
        posX = 0;
        posY = 0;
        posZ = 0;
    } else if (key === ' ') {
        // Posição aleatória ao pressionar espaço
        posX = random(-200, 200);
        posY = random(-150, 150);
        posZ = random(-200, 200);
    }
}

// Registra quando uma tecla é solta
function keyReleased() {
    teclasPressionadas[keyCode] = false;
    teclasPressionadas[key] = false;
}

// Ajuste de tamanho da janela
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}