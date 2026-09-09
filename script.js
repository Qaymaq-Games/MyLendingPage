const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("[data-nav-panel]");
const navLinks = document.querySelectorAll('a[href^="#"]');
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const modalTitle = document.querySelector("[data-modal-title]");
const closeModalButton = document.querySelector("[data-close-modal]");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const yearElement = document.querySelector("[data-year]");
const tiltCards = document.querySelectorAll(".floppy");

function setMenuOpen(isOpen) {
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!body.classList.contains("menu-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      setMenuOpen(false);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = navPanel.contains(event.target) || menuToggle.contains(event.target);

  if (!clickedInsideNav && body.classList.contains("menu-open")) {
    setMenuOpen(false);
  }
});

function openModal(gameId) {
  modalTitle.textContent = "Coming Soon";

  modalBackdrop.hidden = false;
  body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  body.classList.remove("modal-open");
}

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.openModal);
  });
});

closeModalButton.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) {
    closeModal();
  }
});

// ==========================================
// PAC-MAN ARCADE ENGINE WITH GHOSTS & WALLS
// ==========================================

const playfield = document.querySelector("[data-playfield]");
const scoreDisplay = document.querySelector("[data-score]");
const pelletsLeftDisplay = document.querySelector("[data-pellets-left]");
const livesDisplay = document.querySelector("[data-lives]");
const resetGameButton = document.querySelector("[data-reset-game]");
const soundToggleButton = document.querySelector("[data-sound-toggle]");
const moveButtons = document.querySelectorAll("[data-move]");

// Widescreen Full-Bleed Grid Coordinates (%) - filling screen to the neon borders
const GRID_COLS = [2.5, 12.0, 21.5, 31.0, 40.5, 50.0, 59.5, 69.0, 78.5, 88.0, 97.5];
const GRID_ROWS = [5.5, 20.3, 35.2, 50.0, 64.8, 79.7, 94.5];

// 1: Wall Obstacle, 0: Dot, 2: Power Energizer, 3: Ghost Nest, 4: Pac-Man Start
const MAP_TEMPLATE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 1, 0, 0, 2, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 3, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 4, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const DIRECTION_VECTORS = {
  up:    { x: 0,  y: -1, opposite: "down" },
  down:  { x: 0,  y: 1,  opposite: "up" },
  left:  { x: -1, y: 0,  opposite: "right" },
  right: { x: 1,  y: 0,  opposite: "left" }
};

// Web Audio API Retro Chiptune Synthesizer
let audioCtx = null;
let soundEnabled = true;

function getAudio() {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type, duration, vol = 0.08) {
  const ctx = getAudio();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

let wakaAlt = false;
function sfxWaka() {
  wakaAlt = !wakaAlt;
  playTone(wakaAlt ? 440 : 540, "sine", 0.08, 0.06);
}
function sfxPower() {
  playTone(300, "square", 0.09, 0.08);
  setTimeout(() => playTone(450, "square", 0.09, 0.08), 80);
  setTimeout(() => playTone(620, "square", 0.12, 0.08), 160);
}
function sfxEatGhost() {
  playTone(600, "triangle", 0.08, 0.12);
  setTimeout(() => playTone(800, "triangle", 0.08, 0.12), 80);
  setTimeout(() => playTone(1200, "triangle", 0.16, 0.14), 160);
}
function sfxDeath() {
  playTone(460, "sawtooth", 0.1, 0.1);
  setTimeout(() => playTone(360, "sawtooth", 0.1, 0.1), 100);
  setTimeout(() => playTone(260, "sawtooth", 0.12, 0.1), 200);
  setTimeout(() => playTone(140, "sawtooth", 0.22, 0.1), 320);
}
function sfxVictory() {
  [440, 554, 659, 880].forEach((f, i) => {
    setTimeout(() => playTone(f, "sine", 0.16, 0.1), i * 110);
  });
}
function sfxBump() {
  playTone(120, "triangle", 0.06, 0.05);
}

// Game State
let currentMap = [];
let score = 0;
let lives = 3;
let gameState = "PLAYING";
let frightenedTime = 0;
let frightenedInterval = null;
let moveTimeout = null;

let pacman = {
  x: 5,
  y: 5,
  dir: "right",
  invulnerable: false,
  el: null
};

let ghosts = [
  {
    id: "blinky",
    name: "Blinky",
    color: "#ff3b30",
    startX: 5,
    startY: 3,
    x: 5,
    y: 3,
    dir: "up",
    state: "normal",
    speed: 420,
    timer: null,
    el: null
  },
  {
    id: "inky",
    name: "Inky",
    color: "#00d8f6",
    startX: 5,
    startY: 2,
    x: 5,
    y: 2,
    dir: "left",
    state: "normal",
    speed: 500,
    timer: null,
    el: null
  }
];

function isWalkable(x, y) {
  if (x < 0 || x >= GRID_COLS.length || y < 0 || y >= GRID_ROWS.length) return false;
  return currentMap[y] && currentMap[y][x] !== 1;
}

function updateHUD() {
  if (scoreDisplay) scoreDisplay.textContent = String(score).padStart(4, "0");
  if (livesDisplay) {
    let hearts = "";
    for (let i = 0; i < 3; i++) {
      hearts += i < lives ? "❤️" : "🖤";
    }
    livesDisplay.textContent = hearts;
  }
  const pelletsLeft = playfield ? playfield.querySelectorAll(".pellet:not(.is-eaten)").length : 0;
  if (pelletsLeftDisplay) {
    pelletsLeftDisplay.textContent = pelletsLeft ? `${pelletsLeft} DOTS` : "CLEAR!";
  }
}

function showFloatingScore(x, y, text) {
  if (!playfield) return;
  const floatEl = document.createElement("div");
  floatEl.className = "floating-score";
  floatEl.textContent = text;
  floatEl.style.left = `${GRID_COLS[x]}%`;
  floatEl.style.top = `${GRID_ROWS[y]}%`;
  playfield.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 850);
}

function renderBoard() {
  if (!playfield) return;
  playfield.innerHTML = "";

  // 1. Render Obstacles (Walls)
  for (let r = 0; r < GRID_ROWS.length; r++) {
    for (let c = 0; c < GRID_COLS.length; c++) {
      if (currentMap[r][c] === 1) {
        if (r > 0 && r < GRID_ROWS.length - 1 && c > 0 && c < GRID_COLS.length - 1) {
          const wall = document.createElement("div");
          wall.className = "maze-wall";
          wall.style.left = `${GRID_COLS[c]}%`;
          wall.style.top = `${GRID_ROWS[r]}%`;
          playfield.appendChild(wall);
        }
      } else if (currentMap[r][c] === 0 || currentMap[r][c] === 2) {
        const pellet = document.createElement("span");
        pellet.className = "pellet" + (currentMap[r][c] === 2 ? " power-pellet" : "");
        pellet.style.left = `${GRID_COLS[c]}%`;
        pellet.style.top = `${GRID_ROWS[r]}%`;
        pellet.dataset.col = c;
        pellet.dataset.row = r;
        pellet.dataset.type = currentMap[r][c];
        playfield.appendChild(pellet);
      }
    }
  }

  // 2. Render Pac-Man
  const pac = document.createElement("div");
  pac.className = "pacman";
  pac.setAttribute("data-pacman", "");
  pac.setAttribute("data-dir", pacman.dir);
  pac.style.left = `${GRID_COLS[pacman.x]}%`;
  pac.style.top = `${GRID_ROWS[pacman.y]}%`;
  playfield.appendChild(pac);
  pacman.el = pac;

  // 3. Render Ghosts
  ghosts.forEach((ghost) => {
    const g = document.createElement("div");
    g.className = "ghost";
    g.id = `ghost-${ghost.id}`;
    g.style.setProperty("--ghost-color", ghost.color);
    g.setAttribute("data-dir", ghost.dir);
    g.style.left = `${GRID_COLS[ghost.x]}%`;
    g.style.top = `${GRID_ROWS[ghost.y]}%`;
    g.innerHTML = `
      <div class="ghost-body">
        <div class="ghost-eye left"><div class="ghost-pupil"></div></div>
        <div class="ghost-eye right"><div class="ghost-pupil"></div></div>
        <div class="ghost-skirt"><span></span><span></span><span></span></div>
      </div>
    `;
    playfield.appendChild(g);
    ghost.el = g;
  });

  updateHUD();
}

function triggerFrightenedMode() {
  frightenedTime = 7000;
  ghosts.forEach((g) => {
    if (g.state !== "eaten") {
      g.state = "frightened";
      if (g.el) {
        g.el.classList.add("frightened");
        g.el.classList.remove("flashing");
      }
    }
  });

  if (frightenedInterval) clearInterval(frightenedInterval);
  frightenedInterval = setInterval(() => {
    frightenedTime -= 250;
    if (frightenedTime <= 2200 && frightenedTime > 0) {
      ghosts.forEach((g) => {
        if (g.state === "frightened" && g.el) {
          g.el.classList.add("flashing");
        }
      });
    }
    if (frightenedTime <= 0) {
      clearInterval(frightenedInterval);
      frightenedInterval = null;
      ghosts.forEach((g) => {
        if (g.state === "frightened") {
          g.state = "normal";
          if (g.el) {
            g.el.classList.remove("frightened", "flashing");
          }
        }
      });
    }
  }, 250);
}

function startGhostAI() {
  ghosts.forEach((ghost) => {
    if (ghost.timer) clearInterval(ghost.timer);
    ghost.timer = setInterval(() => {
      if (gameState !== "PLAYING") return;
      stepGhost(ghost);
    }, ghost.speed);
  });
}

function stopGhostAI() {
  ghosts.forEach((ghost) => {
    if (ghost.timer) clearInterval(ghost.timer);
    ghost.timer = null;
  });
  if (frightenedInterval) {
    clearInterval(frightenedInterval);
    frightenedInterval = null;
  }
}

function stepGhost(ghost) {
  if (ghost.state === "eaten") {
    if (ghost.x === 5 && ghost.y === 3) {
      ghost.state = "normal";
      if (ghost.el) ghost.el.classList.remove("eaten", "frightened", "flashing");
      return;
    }
  }

  let targetX = pacman.x;
  let targetY = pacman.y;

  if (ghost.state === "eaten") {
    targetX = 5;
    targetY = 3;
  } else if (ghost.state === "frightened") {
    targetX = pacman.x <= 5 ? 9 : 1;
    targetY = pacman.y <= 3 ? 5 : 1;
  } else if (ghost.id === "inky") {
    const pVec = DIRECTION_VECTORS[pacman.dir] || { x: 0, y: 0 };
    targetX = Math.max(1, Math.min(9, pacman.x + pVec.x * 2));
    targetY = Math.max(1, Math.min(5, pacman.y + pVec.y * 2));
  }

  const legalMoves = [];
  const currentOpposite = DIRECTION_VECTORS[ghost.dir] ? DIRECTION_VECTORS[ghost.dir].opposite : null;

  for (const [dir, vec] of Object.entries(DIRECTION_VECTORS)) {
    const nx = ghost.x + vec.x;
    const ny = ghost.y + vec.y;
    if (isWalkable(nx, ny)) {
      legalMoves.push({ dir, x: nx, y: ny, isReverse: dir === currentOpposite });
    }
  }

  if (legalMoves.length === 0) return;

  let candidates = legalMoves.filter(m => !m.isReverse);
  if (candidates.length === 0) candidates = legalMoves;

  candidates.sort((a, b) => {
    const distA = Math.abs(a.x - targetX) + Math.abs(a.y - targetY);
    const distB = Math.abs(b.x - targetX) + Math.abs(b.y - targetY);
    return distA - distB;
  });

  const bestMove = candidates[0];
  ghost.x = bestMove.x;
  ghost.y = bestMove.y;
  ghost.dir = bestMove.dir;

  if (ghost.el) {
    ghost.el.setAttribute("data-dir", ghost.dir);
    ghost.el.style.left = `${GRID_COLS[ghost.x]}%`;
    ghost.el.style.top = `${GRID_ROWS[ghost.y]}%`;
  }

  checkCollisionWithGhosts();
}

function checkCollisionWithGhosts() {
  if (gameState !== "PLAYING") return;

  ghosts.forEach((ghost) => {
    if (ghost.x === pacman.x && ghost.y === pacman.y) {
      if (ghost.state === "frightened") {
        ghost.state = "eaten";
        if (ghost.el) ghost.el.classList.add("eaten");
        score += 200;
        showFloatingScore(ghost.x, ghost.y, "+200");
        sfxEatGhost();
        updateHUD();
      } else if (ghost.state === "normal" && !pacman.invulnerable) {
        handlePacmanDeath();
      }
    }
  });
}

function handlePacmanDeath() {
  gameState = "LOST_LIFE";
  lives--;
  sfxDeath();
  updateHUD();

  if (pacman.el) {
    pacman.el.classList.add("bump");
  }

  if (lives <= 0) {
    gameState = "GAME_OVER";
    stopGhostAI();
    showOverlay("GAME OVER", "The ghosts got you!", "Play Again");
  } else {
    setTimeout(() => {
      pacman.x = 5;
      pacman.y = 5;
      pacman.dir = "right";
      if (pacman.el) {
        pacman.el.setAttribute("data-dir", "right");
        pacman.el.style.left = `${GRID_COLS[pacman.x]}%`;
        pacman.el.style.top = `${GRID_ROWS[pacman.y]}%`;
        pacman.el.classList.add("invulnerable");
      }
      pacman.invulnerable = true;

      ghosts[0].x = 5;
      ghosts[0].y = 3;
      ghosts[1].x = 5;
      ghosts[1].y = 2;
      ghosts.forEach(g => {
        g.state = "normal";
        if (g.el) {
          g.el.className = "ghost";
          g.el.style.left = `${GRID_COLS[g.x]}%`;
          g.el.style.top = `${GRID_ROWS[g.y]}%`;
        }
      });

      gameState = "PLAYING";

      setTimeout(() => {
        pacman.invulnerable = false;
        if (pacman.el) pacman.el.classList.remove("invulnerable");
      }, 1800);
    }, 800);
  }
}

function showOverlay(title, subtitle, btnText) {
  const existing = playfield.querySelector(".arcade-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "arcade-overlay" + (title.includes("GAME OVER") ? " game-over" : " victory");
  overlay.innerHTML = `
    <h3>${title}</h3>
    <p>${subtitle} Score: <strong>${score}</strong></p>
    <button class="btn btn-primary" type="button" data-restart-overlay>${btnText}</button>
  `;
  playfield.appendChild(overlay);

  overlay.querySelector("[data-restart-overlay]").addEventListener("click", () => {
    resetGame();
  });
}

function movePacman(direction) {
  if (gameState !== "PLAYING") return;
  getAudio();

  const vector = DIRECTION_VECTORS[direction];
  if (!vector) return;
  const nextX = pacman.x + vector.x;
  const nextY = pacman.y + vector.y;

  pacman.dir = direction;
  if (pacman.el) pacman.el.setAttribute("data-dir", direction);

  if (!isWalkable(nextX, nextY)) {
    if (pacman.el) {
      pacman.el.classList.remove("bump");
      void pacman.el.offsetWidth;
      pacman.el.classList.add("bump");
    }
    sfxBump();
    return;
  }

  pacman.x = nextX;
  pacman.y = nextY;

  if (pacman.el) {
    pacman.el.style.left = `${GRID_COLS[pacman.x]}%`;
    pacman.el.style.top = `${GRID_ROWS[pacman.y]}%`;
    pacman.el.classList.remove("moving");
    void pacman.el.offsetWidth;
    pacman.el.classList.add("moving");
    if (moveTimeout) clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      if (pacman.el) pacman.el.classList.remove("moving");
    }, 180);
  }

  const pellet = playfield.querySelector(`.pellet[data-col="${pacman.x}"][data-row="${pacman.y}"]:not(.is-eaten)`);
  if (pellet) {
    pellet.classList.add("is-eaten");
    const isPower = pellet.dataset.type === "2";
    if (isPower) {
      score += 50;
      sfxPower();
      triggerFrightenedMode();
    } else {
      score += 10;
      sfxWaka();
    }
    updateHUD();

    const remaining = playfield.querySelectorAll(".pellet:not(.is-eaten)").length;
    if (remaining === 0) {
      gameState = "VICTORY";
      score += 1000;
      updateHUD();
      stopGhostAI();
      sfxVictory();
      showOverlay("STAGE CLEAR!", "All dots cleared! +1000 bonus!", "Next Round");
      return;
    }
  }

  checkCollisionWithGhosts();
}

function resetGame() {
  score = 0;
  lives = 3;
  gameState = "PLAYING";
  currentMap = MAP_TEMPLATE.map(row => [...row]);

  pacman.x = 5;
  pacman.y = 5;
  pacman.dir = "right";
  pacman.invulnerable = false;

  ghosts[0].x = 5;
  ghosts[0].y = 3;
  ghosts[0].dir = "up";
  ghosts[0].state = "normal";

  ghosts[1].x = 5;
  ghosts[1].y = 2;
  ghosts[1].dir = "left";
  ghosts[1].state = "normal";

  renderBoard();
  startGhostAI();
}

moveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    movePacman(button.dataset.move);
  });
});

if (resetGameButton) {
  resetGameButton.addEventListener("click", () => {
    resetGame();
  });
}

if (soundToggleButton) {
  soundToggleButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggleButton.classList.toggle("muted", !soundEnabled);
    soundToggleButton.innerHTML = soundEnabled ? "&#128266;" : "&#128263;";
    soundToggleButton.title = soundEnabled ? "Sound: ON" : "Sound: MUTED";
  });
}

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping = activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName);
  if (isTyping) return;

  const keyMap = {
    ArrowUp: "up",
    KeyW: "up",
    KeyЦ: "up",
    ArrowDown: "down",
    KeyS: "down",
    KeyЫ: "down",
    ArrowLeft: "left",
    KeyA: "left",
    KeyФ: "left",
    ArrowRight: "right",
    KeyD: "right",
    KeyВ: "right"
  };

  const dir = keyMap[event.code] || keyMap[event.key];
  if (dir) {
    event.preventDefault();
    movePacman(dir);
  } else if (event.key === " " && (gameState === "GAME_OVER" || gameState === "VICTORY")) {
    event.preventDefault();
    resetGame();
  }
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

    card.style.setProperty("--tilt-x", `${y}deg`);
    card.style.setProperty("--tilt-y", `${x}deg`);
    card.classList.add("is-tilting");
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

yearElement.textContent = new Date().getFullYear();
resetGame();
setupRevealAnimations();
