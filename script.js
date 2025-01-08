const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameBtn = document.getElementById('startGameBtn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const touchZone = document.getElementById('touchZone');

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
const snakeRadius = gridSize / 2;
let snake = [{ x: 200, y: 200 }];
let food = randomFoodPosition();
let direction = { x: 1, y: 0 };
let nextDirection = direction;
let score = 0;
let gameSpeed = 100; // Default speed for "Normal"
let gameRunning = false; // Prevent the game from starting automatically

// Draw game elements
function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => {
    ctx.beginPath();
    ctx.arc(segment.x + snakeRadius, segment.y + snakeRadius, snakeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.beginPath();
  ctx.arc(food.x + snakeRadius, food.y + snakeRadius, snakeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Update game state
function update() {
  if (direction.x !== 0 || direction.y !== 0) {
    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

    // Check for collision with walls or self
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= canvas.width || head.y >= canvas.height ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      alert(`Game Over! Your score: ${score}`);
      resetGame();
      return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = randomFoodPosition();
    } else {
      snake.pop();
    }
  }
}

// Handle keyboard input
window.addEventListener('keydown', e => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  const newDirection = keyMap[e.key];
  if (newDirection) {
    // Prevent snake from reversing on itself
    if (direction.x + newDirection.x !== 0 || direction.y + newDirection.y !== 0) {
      nextDirection = newDirection;
    }
  }
});

// Handle touch input
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

touchZone.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

touchZone.addEventListener('touchmove', e => {
  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;
});

touchZone.addEventListener('touchend', () => {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 }; // Right
    if (dx < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 }; // Left
  } else {
    if (dy > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 }; // Down
    if (dy < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 }; // Up
  }
});

// Random food position
function randomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

// Reset game
function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 1, y: 0 }; // Reset initial direction to right
  nextDirection = direction;
  food = randomFoodPosition();
  score = 0;
}

// Difficulty buttons
difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    gameSpeed = parseInt(button.dataset.speed);
    resetGame();
  });
});

// Start Game
startGameBtn.addEventListener('click', () => {
  if (!gameRunning) {
    gameRunning = true;
    startGameBtn.style.display = 'none';
    gameLoop();
  }
});

// Game loop
function gameLoop() {
  if (gameRunning) {
    direction = nextDirection;
    update();
    draw();
    setTimeout(gameLoop, gameSpeed);
  }
}
