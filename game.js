const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const finalScreen = document.getElementById('final');
const startBtn = document.getElementById('startBtn');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameActive = false;
let playerX = 418; // Posição central inicial no container de 900px
let gameInterval;
let currentControlMode = null; // 'keyboard' ou 'mouse'
const playerSpeed = 25; 
const containerWidth = 900;
const playerWidth = 64;

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block'; // Mostra o container do jogo
    gameActive = true;
    
    // Gera corações dentro do jogo
    gameInterval = setInterval(criarCoracao, 700);
});

// Movimentação por teclado (Dento do limite de 900px)
window.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerX -= playerSpeed;
        if (playerX < 0) playerX = 0;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerX += playerSpeed;
        if (playerX > containerWidth - playerWidth) playerX = containerWidth - playerWidth;
    }
    player.style.left = playerX + 'px';
});

function iniciarJogo(modo) {
    currentControlMode = modo;
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    gameActive = true;
    gameInterval = setInterval(criarCoracao, 700);

    if (currentControlMode === 'mouse') {
        // Evento de mouse dentro do container
        gameContainer.addEventListener('mousemove', moverComMouse);
    }
}

window.addEventListener('keydown', (e) => {
    if (!gameActive || currentControlMode !== 'keyboard') return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerX = Math.max(0, playerX - playerSpeed);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerX = Math.min(containerWidth - playerWidth, playerX + playerSpeed);
    }
    player.style.left = playerX + 'px';
});

function moverComMouse(e) {
    if (!gameActive) return;
    
    // Pega a posição relativa do mouse dentro do container
    const rect = gameContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - (playerWidth / 2);

    // Limites para o player não sair do container
    if (x < 0) x = 0;
    if (x > containerWidth - playerWidth) x = containerWidth - playerWidth;

    playerX = x; // Atualiza a variável global
    player.style.left = playerX + 'px';
}

function criarCoracao() {
    if (!gameActive) return;

    const coracao = document.createElement('div');
    coracao.classList.add('coracao');
    coracao.innerHTML = '❤️';
    
    // Sorteia posição X apenas dentro dos 900px do container (descontando o tamanho do coração)
    const xAleatorio = Math.random() * (containerWidth - 40);
    coracao.style.left = xAleatorio + 'px';
    coracao.style.top = '-50px';
    
    gameContainer.appendChild(coracao);

    let posicaoY = -50;
    const velocidadeQueda = 4 + Math.random() * 4;

    const intervaloQueda = setInterval(() => {
        if (!gameActive) {
            clearInterval(intervaloQueda);
            coracao.remove();
            return;
        }

        posicaoY += velocidadeQueda;
        coracao.style.top = posicaoY + 'px';

        // Se passar do fundo do container (500px)
        if (posicaoY > 500) {
            clearInterval(intervaloQueda);
            coracao.remove();
        }

        // Colisão
        if (checarColisao(coracao, player)) {
            clearInterval(intervaloQueda);
            coracao.remove();
            score++;
            scoreDisplay.textContent = score;

            if (score >= 20) {
                finalizarJogo();
            }
        }
    }, 20);
}

function checarColisao(elem1, elem2) {
    const r1 = elem1.getBoundingClientRect();
    const r2 = elem2.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function finalizarJogo() {
    gameActive = false;
    clearInterval(gameInterval);

    // Pega o centro do container para fazer a explosão bem no meio do jogo!
    const rect = gameContainer.getBoundingClientRect();
    const centroX = rect.left + (rect.width / 2);
    const centroY = rect.top + (rect.height / 2);

    criarExplosao(centroX, centroY);

    setTimeout(() => {
        gameContainer.style.display = 'none';
        finalScreen.style.display = 'flex'; // Exibe a tela final centralizada como Flex
    }, 1000);
}

function criarExplosao(origemX, origemY) {
    const totalParticulas = 50;
    
    for (let i = 0; i < totalParticulas; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particula');
        particula.innerHTML = Math.random() > 0.4 ? '❤️' : '✨';
        
        particula.style.left = origemX + 'px';
        particula.style.top = origemY + 'px';
        particula.style.position = 'fixed'; // Garante que voe por cima de tudo

        const angulo = Math.random() * Math.PI * 2;
        const distancia = 150 + Math.random() * 250;
        const xVoo = Math.cos(angulo) * distancia;
        const yVoo = Math.sin(angulo) * distancia;

        particula.style.setProperty('--x', `${xVoo}px`);
        particula.style.setProperty('--y', `${yVoo}px`);

        document.body.appendChild(particula);
        setTimeout(() => particula.remove(), 1000);
    }
}

// Função para o botão "Voltar para o início da nossa aventura"
function voltarParaInicio() {
    // Ao redirecionar, o navegador recarrega o index.html do zero.
    // Isso limpa automaticamente todos os timers, variáveis e elementos da tela.
    window.location.href = "index.html";
}

/**
 * Nota: Você não precisa mais da função "reiniciarJogo" antiga 
 * se o objetivo é sempre voltar para a página inicial (index.html).
 */