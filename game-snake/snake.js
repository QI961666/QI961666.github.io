const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const hint = document.getElementById("hint");

const SIZE = 20;
const COUNT = canvas.width / SIZE;

let snake, food, direction, nextDirection;
let score = 0;
let best = 0;
let timer = null;
let state = "ready";
let canTurn = true;

try {
  best = Number(localStorage.getItem("pinkSnakeBest")) || 0;
} catch (e) {
  best = 0;
}
bestText.textContent = best;

function showMessage(title, description) {
  message.textContent = title;
  hint.textContent = description;
  overlay.classList.remove("hidden");
}

function hideMessage() {
  overlay.classList.add("hidden");
}

function resetGame() {
  clearInterval(timer);
  timer = null;

  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  canTurn = true;
  score = 0;
  scoreText.textContent = score;

  spawnFood();
  state = "ready";
  draw();
  showMessage("准备好了吗？♡", "点击 START 开始游戏");
}

function spawnFood() {
  const empty = [];

  for (let y = 0; y < COUNT; y++) {
    for (let x = 0; x < COUNT; x++) {
      if (!snake.some(part => part.x === x && part.y === y)) {
        empty.push({ x, y });
      }
    }
  }

  food = empty.length
    ? empty[Math.floor(Math.random() * empty.length)]
    : null;
}

function startGame() {
  if (state === "running") return;

  if (state === "over" || state === "won") {
    resetGame();
  }

  state = "running";
  hideMessage();
  clearInterval(timer);
  timer = setInterval(update, 170);
}

function pauseGame() {
  if (state === "running") {
    clearInterval(timer);
    timer = null;
    state = "paused";
    showMessage("暂停中 ♡", "点击 PAUSE 或按空格继续");
  } else if (state === "paused") {
    startGame();
  }
}

function endGame(won = false) {
  clearInterval(timer);
  timer = null;
  state = won ? "won" : "over";
  showMessage(
    won ? "YOU WIN! ♡" : "GAME OVER ♡",
    "按 Enter 或 RESTART 再玩一次"
  );
}

function update() {
  direction = { ...nextDirection };
  canTurn = true;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const eating = food && head.x === food.x && head.y === food.y;

  const bodyToCheck = eating ? snake : snake.slice(0, -1);

  const hitWall =
    head.x < 0 || head.y < 0 ||
    head.x >= COUNT || head.y >= COUNT;

  const hitBody = bodyToCheck.some(
    part => part.x === head.x && part.y === head.y
  );

  if (hitWall || hitBody) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (eating) {
    score++;
    scoreText.textContent = score;

    if (score > best) {
      best = score;
      bestText.textContent = best;

      try {
        localStorage.setItem("pinkSnakeBest", best);
      } catch (e) {}
    }

    if (snake.length === COUNT * COUNT) {
      draw();
      endGame(true);
      return;
    }

    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function drawPixelApple(x, y) {
  const px = x * SIZE;
  const py = y * SIZE;

  // 苹果叶子
  ctx.fillStyle = "#74a86b";
  ctx.fillRect(px + 11, py + 2, 6, 4);

  // 苹果柄
  ctx.fillStyle = "#865d49";
  ctx.fillRect(px + 9, py + 2, 3, 5);

  // 红色像素苹果
  ctx.fillStyle = "#e96679";
  ctx.fillRect(px + 4, py + 7, 12, 9);
  ctx.fillRect(px + 6, py + 5, 8, 13);
  ctx.fillRect(px + 7, py + 16, 6, 2);

  // 小高光
  ctx.fillStyle = "#ffb5be";
  ctx.fillRect(px + 6, py + 8, 3, 3);
}

function draw() {
  ctx.fillStyle = "#fff0f6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 棋盘格
  for (let y = 0; y < COUNT; y++) {
    for (let x = 0; x < COUNT; x++) {
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = "#ffe3ee";
        ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
      }
    }
  }

  if (food) {
    drawPixelApple(food.x, food.y);
  }

  snake.forEach((part, index) => {
    const px = part.x * SIZE;
    const py = part.y * SIZE;

    ctx.fillStyle = index === 0 ? "#d66b99" : "#f3a6c4";
    ctx.fillRect(px + 1, py + 1, SIZE - 2, SIZE - 2);

    ctx.fillStyle = "#ffdce9";
    ctx.fillRect(px + 3, py + 3, SIZE - 6, 3);

    if (index === 0) {
      // 蛇头的小眼睛
      ctx.fillStyle = "#733d59";

      if (direction.x !== 0) {
        const eyeX = direction.x > 0 ? px + 14 : px + 5;
        ctx.fillRect(eyeX, py + 5, 2, 2);
        ctx.fillRect(eyeX, py + 12, 2, 2);
      } else {
        const eyeY = direction.y > 0 ? py + 14 : py + 5;
        ctx.fillRect(px + 5, eyeY, 2, 2);
        ctx.fillRect(px + 12, eyeY, 2, 2);
      }
    }
  });
}

const keyDirections = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 }
};

document.addEventListener("keydown", event => {
  const key = event.key.length === 1
    ? event.key.toLowerCase()
    : event.key;

  if (keyDirections[key]) {
    event.preventDefault();

    const newDirection = keyDirections[key];

    if (
      state === "running" &&
      canTurn &&
      !(newDirection.x === -direction.x &&
        newDirection.y === -direction.y)
    ) {
      nextDirection = newDirection;
      canTurn = false;
    }
  }

  if (event.code === "Space") {
    event.preventDefault();
    pauseGame();
  }

  if (event.key === "Enter") {
    resetGame();
    startGame();
  }
});

document.getElementById("start").addEventListener("click", startGame);
document.getElementById("pause").addEventListener("click", pauseGame);
document.getElementById("restart").addEventListener("click", () => {
  resetGame();
  startGame();
});

resetGame();