const canvas = document.getElementById("fireCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let sparks = [];
const gravity = -0.02;

const settings = {
  count: 500,
  speed: 1,
  spread: 4,
  smoke: 0.5,
  showSmoke: true,
  showSparks: true,
  heatDistortion: true,
  fireSound: true,
};

const fireSound = document.getElementById("fireSound");

function createParticle() {
  const x = canvas.width / 2 + (Math.random() - 0.5) * settings.spread * 50;
  const y = canvas.height - 20;
  const size = Math.random() * 3 + 2;
  const color = `rgba(255, ${Math.floor(Math.random() * 160)}, 0, 0.7)`;
  const velocity = {
    x: (Math.random() - 0.5) * settings.spread,
    y: -Math.random() * 3 - 1,
  };
  return { x, y, size, color, velocity, life: 100 };
}

function createSpark(x, y) {
  return {
    x,
    y,
    size: Math.random() * 1.5 + 0.5,
    color: "#fffa70",
    velocity: {
      x: (Math.random() - 0.5) * 4,
      y: -Math.random() * 4,
    },
    life: 30,
  };
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < settings.count; i++) {
    if (particles.length < settings.count) {
      particles.push(createParticle());
    }
  }

  particles.forEach((p, index) => {
    p.x += p.velocity.x * settings.speed;
    p.y += p.velocity.y * settings.speed;
    p.velocity.y += gravity * settings.speed;
    p.life--;

    if (settings.heatDistortion) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if (p.life <= 0) particles.splice(index, 1);

    if (settings.showSparks && Math.random() < 0.03) {
      sparks.push(createSpark(p.x, p.y));
    }
  });

  if (settings.showSparks) {
    sparks.forEach((s, i) => {
      s.x += s.velocity.x;
      s.y += s.velocity.y;
      s.velocity.y += gravity;
      s.life--;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();

      if (s.life <= 0) sparks.splice(i, 1);
    });
  }

  if (settings.showSmoke) {
    ctx.globalAlpha = settings.smoke;
    ctx.fillStyle = "rgba(80,80,80,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(update);
}

function applyPreset(preset) {
  if (preset === "campfire") {
    settings.count = 800;
    settings.speed = 1.2;
    settings.spread = 5;
    settings.smoke = 0.5;
  } else if (preset === "candle") {
    settings.count = 150;
    settings.speed = 0.6;
    settings.spread = 2;
    settings.smoke = 0.2;
  } else if (preset === "fireworks") {
    settings.count = 1000;
    settings.speed = 3;
    settings.spread = 8;
    settings.smoke = 0.3;
  } else if (preset === "explosion") {
    settings.count = 1500;
    settings.speed = 5;
    settings.spread = 10;
    settings.smoke = 0.7;
  }
}

document.getElementById("particleCount").addEventListener("input", (e) => settings.count = +e.target.value);
document.getElementById("speed").addEventListener("input", (e) => settings.speed = +e.target.value);
document.getElementById("spread").addEventListener("input", (e) => settings.spread = +e.target.value);
document.getElementById("smoke").addEventListener("input", (e) => settings.smoke = +e.target.value);
document.getElementById("toggleSmoke").addEventListener("change", (e) => settings.showSmoke = e.target.checked);
document.getElementById("toggleSparks").addEventListener("change", (e) => settings.showSparks = e.target.checked);
document.getElementById("toggleHeat").addEventListener("change", (e) => settings.heatDistortion = e.target.checked);
document.getElementById("toggleSound").addEventListener("change", (e) => {
  settings.fireSound = e.target.checked;
  if (settings.fireSound) fireSound.play();
  else fireSound.pause();
});

document.querySelectorAll(".presets button").forEach((btn) => {
  btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
});

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

if (settings.fireSound) fireSound.play();
update();
