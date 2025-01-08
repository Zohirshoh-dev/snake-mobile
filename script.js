const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameBtn = document.getElementById('startGameBtn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = randomFoodPosition();
let direction = { x: 1, y: 0 };
let nextDirection = direction;
let score = 0;
let gameSpeed = 100;
let gameRunning = false;

// Movement tracking
let joystickOffset = { x: 0, y: 0 };
let isDragging = false;

// Draw game elements
function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Update game state
function update() {
  if (direction.x !== 0 || direction.y !== 0) {
    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

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
    if (direction.x + newDirection.x !== 0 || direction.y + newDirection.y !== 0) {
      nextDirection = newDirection;
    }
  }
});

// Handle joystick input
joystick.addEventListener('touchstart', startDrag);
joystick.addEventListener('touchmove', drag);
joystick.addEventListener('touchend', stopDrag);

function startDrag(e) {
  isDragging = true;
  const rect = joystick.getBoundingClientRect();
  joystickOffset = {
    x: e.touches[0].clientX - rect.left - rect.width / 2,
    y: e.touches[0].clientY - rect.top - rect.height / 2
  };
}

function drag(e) {
  if (isDragging) {
    const rect = joystick.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left - rect.width / 2;
    const y = e.touches[0].clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x ** 2 + y ** 2);
    const maxDistance = rect.width / 2;

    if (distance <= maxDistance) {
      stick.style.transform = `translate(${x}px, ${y}px)`;
      if (Math.abs(x) > Math.abs(y)) {
        nextDirection = x > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        nextDirection = y > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }
    }
  }
}

function stopDrag() {
  isDragging = false;
  stick.style.transform = 'translate(0, 0)';
}

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
  direction = { x: 1, y: 0 };
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
