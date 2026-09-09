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

const playfield = document.querySelector("[data-playfield]");
const pacman = document.querySelector("[data-pacman]");
const moveButtons = document.querySelectorAll("[data-move]");
const scoreDisplay = document.querySelector("[data-score]");
const pelletsLeftDisplay = document.querySelector("[data-pellets-left]");
const resetGameButton = document.querySelector("[data-reset-game]");
const pacmanPosition = {
  x: 2,
  y: 1
};
const gridColumns = [13, 31, 49, 69, 87];
const gridRows = [18, 48, 79];
const directionVectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};
let score = 0;
let moveTimeout = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function collectPellets() {
  document.querySelectorAll(".pellet:not(.is-eaten)").forEach((pellet) => {
    const pelletX = Number.parseFloat(pellet.style.left);
    const pelletY = Number.parseFloat(pellet.style.top);

    if (pelletX === gridColumns[pacmanPosition.x] && pelletY === gridRows[pacmanPosition.y]) {
      pellet.classList.add("is-eaten");
      score += 10;
      scoreDisplay.textContent = String(score).padStart(4, "0");
    }
  });

  const pelletsLeft = document.querySelectorAll(".pellet:not(.is-eaten)").length;
  pelletsLeftDisplay.textContent = pelletsLeft ? `${pelletsLeft} DOTS` : "CLEAR!";
}

function movePacman(direction) {
  const vector = directionVectors[direction];
  if (!vector) return;
  const nextX = pacmanPosition.x + vector.x;
  const nextY = pacmanPosition.y + vector.y;

  pacman.setAttribute("data-dir", direction);

  if (nextX < 0 || nextX >= gridColumns.length || nextY < 0 || nextY >= gridRows.length) {
    pacman.classList.remove("bump");
    void pacman.offsetWidth;
    pacman.classList.add("bump");
    return;
  }

  pacmanPosition.x = nextX;
  pacmanPosition.y = nextY;
  pacman.style.left = `${gridColumns[pacmanPosition.x]}%`;
  pacman.style.top = `${gridRows[pacmanPosition.y]}%`;
  pacman.classList.remove("moving");
  void pacman.offsetWidth;
  pacman.classList.add("moving");
  if (moveTimeout) clearTimeout(moveTimeout);
  moveTimeout = window.setTimeout(() => pacman.classList.remove("moving"), 180);
  collectPellets();
}

function resetGame() {
  pacmanPosition.x = 2;
  pacmanPosition.y = 1;
  score = 0;
  pacman.style.left = `${gridColumns[pacmanPosition.x]}%`;
  pacman.style.top = `${gridRows[pacmanPosition.y]}%`;
  pacman.setAttribute("data-dir", "right");
  pacman.className = "pacman";
  document.querySelectorAll(".pellet.is-eaten").forEach((pellet) => pellet.classList.remove("is-eaten"));
  scoreDisplay.textContent = "0000";
  pelletsLeftDisplay.textContent = `${document.querySelectorAll(".pellet").length} DOTS`;
}

moveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    movePacman(button.dataset.move);
  });
});

resetGameButton.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping = activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName);
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  if (keyMap[event.key] && !isTyping) {
    event.preventDefault();
    movePacman(keyMap[event.key]);
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
