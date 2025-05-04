const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasSize = 600;
const snakeSize = 20;
let snake = [{ x: 300, y: 300 }];
let dx = snakeSize;
let dy = 0;
let food;
let score = 0;
let speed = 200;

const foodImages = [
  'assets/images/chicken-leg-chicken-svgrepo-com.svg',
  'assets/images/egg-svgrepo-com.svg',
  'assets/images/fish-svgrepo-com.svg',
  'assets/images/meat-salami-svgrepo-com.svg',
  'assets/images/protein-meat-svgrepo-com.svg',
  'assets/images/steak-svgrepo-com.svg'
];

food = randomFood();

function randomFood() {
  const randomIndex = Math.floor(Math.random() * foodImages.length);
  const foodImage = foodImages[randomIndex];
  const position = {
    x: Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize,
    y: Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize
  };
  return { foodImage, position };
}

function drawSnake() {
  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
  });
}

function drawFood() {
  const image = new Image();
  image.src = food.foodImage;
  image.onload = function() {
    ctx.drawImage(image, food.position.x, food.position.y, snakeSize, snakeSize);
  };
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.position.x && head.y === food.position.y) {
    food = randomFood();
    score++;
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function gameLoop() {
    if (checkCollision()) {
      document.getElementById('finalScore').textContent = `Your score: ${score}`;
      document.getElementById('gameOverPopup').classList.remove('hidden');
      document.getElementById('gameOverPopup').classList.add('visible');
      return;
    }
  
    setTimeout(() => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      drawFood();
      moveSnake();
      drawSnake();
      gameLoop();
    }, speed);
  }
  
  function restartGame() {
    snake = [{ x: 300, y: 300 }];
    dx = snakeSize;
    dy = 0;
    food = randomFood();
    score = 0;
    document.getElementById('gameOverPopup').classList.remove('visible');
    document.getElementById('gameOverPopup').classList.add('hidden');
    gameLoop();
  }
  

document.getElementById('restartButton').addEventListener('click', restartGame);

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      if (dy === 0) {
        dx = 0;
        dy = -snakeSize;
      }
      break;
    case 'ArrowDown':
    case 's':
      if (dy === 0) {
        dx = 0;
        dy = snakeSize;
      }
      break;
    case 'ArrowLeft':
    case 'a':
      if (dx === 0) {
        dx = -snakeSize;
        dy = 0;
      }
      break;
    case 'ArrowRight':
    case 'd':
      if (dx === 0) {
        dx = snakeSize;
        dy = 0;
      }
      break;
  }
});

gameLoop();
