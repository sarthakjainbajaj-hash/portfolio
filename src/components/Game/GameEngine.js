import { MAP_CONFIG, ZONES, INTERACTABLES, COLLECTIBLES } from "./gameData";
import { sound } from "./soundEngine";

export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.houseTheme = options.houseTheme || "stark";
    this.onInteract = options.onInteract || (() => {});
    this.onCollect = options.onCollect || (() => {});
    this.onPlayerMove = options.onPlayerMove || (() => {});

    // State
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    // Player
    this.player = {
      x: MAP_CONFIG.spawnPoint.x,
      y: MAP_CONFIG.spawnPoint.y,
      radius: 18,
      speed: 4.2,
      facing: "down",
      isMoving: false,
      stepCycle: 0,
      targetPos: null,
    };

    // Camera
    this.camera = {
      x: this.player.x - this.width / 2,
      y: this.player.y - this.height / 2,
    };

    // Controls
    this.keys = {};
    this.activeInteractable = null;
    this.collectedRunes = new Set(options.collectedRunes || []);

    // Visuals
    this.particles = [];
    this.ripples = [];
    this.time = 0;
    this.isRunning = false;
    this.animId = null;

    // Obstacles / Solid Pillars
    this.obstacles = [
      // Outer boundaries
      { x: 50, y: 50, w: MAP_CONFIG.width - 100, h: 20 }, // Top
      { x: 50, y: MAP_CONFIG.height - 70, w: MAP_CONFIG.width - 100, h: 20 }, // Bottom
      { x: 50, y: 50, w: 20, h: MAP_CONFIG.height - 100 }, // Left
      { x: MAP_CONFIG.width - 70, y: 50, w: 20, h: MAP_CONFIG.height - 100 }, // Right

      // Decorative Citadel Pillars
      { x: 700, y: 550, w: 40, h: 40 },
      { x: 1100, y: 550, w: 40, h: 40 },
      { x: 700, y: 880, w: 40, h: 40 },
      { x: 1100, y: 880, w: 40, h: 40 },
    ];

    // Bindings
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.loop = this.loop.bind(this);

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.canvas.addEventListener("pointerdown", this.handleClick);

    // Initial ambient particles
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * MAP_CONFIG.width,
        y: Math.random() * MAP_CONFIG.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.5 ? "#f59e0b" : "#38bdf8",
      });
    }

    this.isRunning = true;
    this.animId = requestAnimationFrame(this.loop);
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.canvas.removeEventListener("pointerdown", this.handleClick);
  }

  handleResize() {
    const parent = this.canvas.parentElement;
    this.width = parent && parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth;
    this.height = parent && parent.clientHeight > 0 ? parent.clientHeight : window.innerHeight;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  handleKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;

    if (e.key === "e" || e.key === "E" || e.key === " " || e.key === "Enter") {
      if (this.activeInteractable) {
        sound.playInteract();
        this.onInteract(this.activeInteractable);
      }
    }
  }

  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Convert to world coordinates
    const worldX = screenX + this.camera.x;
    const worldY = screenY + this.camera.y;

    // Check if clicked directly on an interactable
    const clickedItem = INTERACTABLES.find((item) => {
      const dist = Math.hypot(item.x - worldX, item.y - worldY);
      return dist < 45;
    });

    if (clickedItem) {
      sound.playInteract();
      this.onInteract(clickedItem);
      return;
    }

    // Set target position for click-to-move
    this.player.targetPos = { x: worldX, y: worldY };

    // Add visual click ripple
    this.ripples.push({
      x: worldX,
      y: worldY,
      radius: 4,
      maxRadius: 28,
      alpha: 1,
    });
  }

  // Virtual Joystick input
  setJoystickInput(dx, dy) {
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      this.player.targetPos = null; // override click-to-move
      this.movePlayer(dx * this.player.speed, dy * this.player.speed);
    }
  }

  triggerAction() {
    if (this.activeInteractable) {
      sound.playInteract();
      this.onInteract(this.activeInteractable);
    }
  }

  checkCollision(newX, newY) {
    const r = this.player.radius;

    // Map bounds
    if (newX < 70 + r || newX > MAP_CONFIG.width - 70 - r) return true;
    if (newY < 70 + r || newY > MAP_CONFIG.height - 70 - r) return true;

    // Obstacle pillars
    for (const obs of this.obstacles) {
      if (
        newX + r > obs.x &&
        newX - r < obs.x + obs.w &&
        newY + r > obs.y &&
        newY - r < obs.y + obs.h
      ) {
        return true;
      }
    }

    return false;
  }

  movePlayer(vx, vy) {
    let nextX = this.player.x + vx;
    let nextY = this.player.y + vy;

    // Slide on walls
    if (!this.checkCollision(nextX, this.player.y)) {
      this.player.x = nextX;
    }
    if (!this.checkCollision(this.player.x, nextY)) {
      this.player.y = nextY;
    }

    // Update facing
    if (Math.abs(vx) > Math.abs(vy)) {
      this.player.facing = vx > 0 ? "right" : "left";
    } else if (Math.abs(vy) > 0.1) {
      this.player.facing = vy > 0 ? "down" : "up";
    }

    this.player.isMoving = true;
    this.player.stepCycle += 0.2;
    this.onPlayerMove(this.player.x, this.player.y);
  }

  update() {
    this.time += 0.03;
    let vx = 0;
    let vy = 0;

    // Keyboard movement
    if (this.keys["w"] || this.keys["arrowup"]) vy -= 1;
    if (this.keys["s"] || this.keys["arrowdown"]) vy += 1;
    if (this.keys["a"] || this.keys["arrowleft"]) vx -= 1;
    if (this.keys["d"] || this.keys["arrowright"]) vx += 1;

    if (vx !== 0 || vy !== 0) {
      this.player.targetPos = null; // cancel click-to-move
      // Normalize diagonal speed
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * this.player.speed;
      vy = (vy / len) * this.player.speed;
      this.movePlayer(vx, vy);
    } else if (this.player.targetPos) {
      // Move towards click target
      const dx = this.player.targetPos.x - this.player.x;
      const dy = this.player.targetPos.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 5) {
        this.player.targetPos = null;
        this.player.isMoving = false;
      } else {
        vx = (dx / dist) * this.player.speed;
        vy = (dy / dist) * this.player.speed;
        this.movePlayer(vx, vy);
      }
    } else {
      this.player.isMoving = false;
    }

    // Update camera (smooth lerp tracking)
    const targetCamX = this.player.x - this.width / 2;
    const targetCamY = this.player.y - this.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.08;
    this.camera.y += (targetCamY - this.camera.y) * 0.08;

    // Clamp camera within map bounds
    this.camera.x = Math.max(0, Math.min(this.camera.x, MAP_CONFIG.width - this.width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, MAP_CONFIG.height - this.height));

    // Check interactables proximity
    let closestItem = null;
    let closestDist = Infinity;

    for (const item of INTERACTABLES) {
      const dist = Math.hypot(item.x - this.player.x, item.y - this.player.y);
      if (dist < 75 && dist < closestDist) {
        closestItem = item;
        closestDist = dist;
      }
    }
    this.activeInteractable = closestItem;

    // Check Collectibles (Runes)
    for (const rune of COLLECTIBLES) {
      if (!this.collectedRunes.has(rune.id)) {
        const dist = Math.hypot(rune.x - this.player.x, rune.y - this.player.y);
        if (dist < 35) {
          this.collectedRunes.add(rune.id);
          sound.playPickup();
          this.onCollect(rune);

          // Burst particles
          for (let p = 0; p < 20; p++) {
            this.particles.push({
              x: rune.x,
              y: rune.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              size: 2 + Math.random() * 3,
              alpha: 1,
              color: rune.color,
            });
          }
        }
      }
    }

    // Update Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 1.2;
      rip.alpha -= 0.035;
      if (rip.alpha <= 0) this.ripples.splice(i, 1);
    }

    // Update ambient particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.005;
      if (p.alpha <= 0) {
        p.x = Math.random() * MAP_CONFIG.width;
        p.y = MAP_CONFIG.height - 100;
        p.alpha = 0.6 + Math.random() * 0.4;
      }
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.pixelRatio, this.pixelRatio);

    // Clear Screen
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, this.width, this.height);

    // Camera offset translation
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw Citadel Ground & Floor Tiles
    this.renderGround(ctx);

    // 2. Draw Pathways connecting zones
    this.renderPathways(ctx);

    // 3. Draw Zone Auras
    this.renderZoneAuras(ctx);

    // 4. Draw Click Ripples
    for (const rip of this.ripples) {
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 5. Draw Collectibles (Runes)
    this.renderCollectibles(ctx);

    // 6. Draw Interactable Entities (NPCs, Shrines, Bookshelves)
    this.renderInteractables(ctx);

    // 7. Draw Player Character
    this.renderPlayer(ctx);

    // 8. Draw Atmospheric Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 9. Draw Interaction Tooltip / Prompt above active object
    if (this.activeInteractable) {
      this.renderInteractionPrompt(ctx, this.activeInteractable);
    }

    ctx.restore(); // end camera translation
    ctx.restore(); // end scale
  }

  renderGround(ctx) {
    // Castle floor grid
    const tileSize = 60;
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;

    for (let x = 60; x < MAP_CONFIG.width - 60; x += tileSize) {
      for (let y = 60; y < MAP_CONFIG.height - 60; y += tileSize) {
        ctx.fillStyle = (x / tileSize + y / tileSize) % 2 === 0 ? "#0c1322" : "#0f172a";
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Outer castle stone wall
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, MAP_CONFIG.width, 60);
    ctx.fillRect(0, MAP_CONFIG.height - 60, MAP_CONFIG.width, 60);
    ctx.fillRect(0, 0, 60, MAP_CONFIG.height);
    ctx.fillRect(MAP_CONFIG.width - 60, 0, 60, MAP_CONFIG.height);

    // Gold Wall Crests
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, MAP_CONFIG.width - 120, MAP_CONFIG.height - 120);

    // Obstacle Pillars
    for (const obs of this.obstacles.slice(4)) {
      ctx.fillStyle = "#334155";
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Brazier Fire on pillars
      const flameY = obs.y - 12 + Math.sin(this.time * 6 + obs.x) * 3;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(obs.x + obs.w / 2, flameY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(obs.x + obs.w / 2, flameY + 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderPathways(ctx) {
    const center = MAP_CONFIG.spawnPoint;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
    ctx.lineWidth = 36;
    ctx.lineCap = "round";

    for (const z of ZONES) {
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(z.x, z.y);
      ctx.stroke();
    }
  }

  renderZoneAuras(ctx) {
    for (const z of ZONES) {
      const pulse = Math.sin(this.time * 2 + z.x) * 6;

      // Glow circle
      const grad = ctx.createRadialGradient(z.x, z.y, 10, z.x, z.y, z.radius + pulse);
      grad.addColorStop(0, `${z.color}33`);
      grad.addColorStop(0.7, `${z.color}11`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Zone Ring
      ctx.strokeStyle = `${z.color}66`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zone Label on Ground
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillStyle = z.color;
      ctx.textAlign = "center";
      ctx.fillText(z.name.toUpperCase(), z.x, z.y - z.radius - 12);
    }
  }

  renderCollectibles(ctx) {
    for (const rune of COLLECTIBLES) {
      if (this.collectedRunes.has(rune.id)) continue;

      const floatY = rune.y + Math.sin(this.time * 3 + rune.x) * 5;

      // Glow
      ctx.fillStyle = `${rune.color}44`;
      ctx.beginPath();
      ctx.arc(rune.x, floatY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Diamond Rune Shape
      ctx.save();
      ctx.translate(rune.x, floatY);
      ctx.rotate(this.time * 1.5);
      ctx.fillStyle = rune.color;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  renderInteractables(ctx) {
    for (const item of INTERACTABLES) {
      const floatAnim = Math.sin(this.time * 2.5 + item.x) * 3;

      // Base shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(item.x, item.y + 12, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw depending on type
      if (item.type === "npc") {
        // Character Pedestal
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(item.x, item.y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon / Emoji
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.avatar === "/photo.jpeg" ? "🧙‍♂️" : item.avatar, item.x, item.y + floatAnim);
      } else if (item.type === "shrine") {
        // Arcane Shrine Pedestal
        ctx.fillStyle = "#334155";
        ctx.fillRect(item.x - 16, item.y - 10, 32, 24);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x - 16, item.y - 10, 32, 24);

        // Floating Crystal
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, item.x, item.y - 16 + floatAnim);
      } else if (item.type === "altar") {
        // Skill Altar Pillars
        ctx.fillStyle = "#064e3b";
        ctx.beginPath();
        ctx.arc(item.x, item.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💎", item.x, item.y + floatAnim);
      } else {
        // Bookshelf / Raven Post
        ctx.font = "26px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, item.x, item.y + floatAnim);
      }

      // Name Label
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(item.name, item.x, item.y + 28);

      // Badge
      ctx.font = "9px Inter, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(item.badge, item.x, item.y + 40);
    }
  }

  renderPlayer(ctx) {
    const p = this.player;
    const bounce = p.isMoving ? Math.sin(p.stepCycle) * 3 : Math.sin(this.time * 2) * 1.5;

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 12, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cape / Robe (house theme accent)
    const capeColor = this.houseTheme === "targaryen" ? "#ef4444" : this.houseTheme === "lannister" ? "#f59e0b" : "#38bdf8";
    ctx.fillStyle = capeColor;
    ctx.beginPath();
    ctx.moveTo(p.x - 10, p.y - 4 + bounce);
    ctx.lineTo(p.x + 10, p.y - 4 + bounce);
    ctx.lineTo(p.x + 12, p.y + 14 + bounce);
    ctx.lineTo(p.x - 12, p.y + 14 + bounce);
    ctx.closePath();
    ctx.fill();

    // Body (Armor)
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(p.x, p.y + 2 + bounce, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(p.x, p.y - 10 + bounce, 8, 0, Math.PI * 2);
    ctx.fill();

    // Adventurer Helmet / Crown
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(p.x, p.y - 13 + bounce, 7, Math.PI, Math.PI * 2);
    ctx.fill();

    // Floating Player Name
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText("You (Explorer)", p.x, p.y - 25 + bounce);
  }

  renderInteractionPrompt(ctx, item) {
    const bounce = Math.sin(this.time * 5) * 4;
    const promptY = item.y - 42 + bounce;

    // Badge pill
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;

    const label = " [E] Inspect ";
    ctx.font = "bold 11px Inter, sans-serif";
    const textWidth = ctx.measureText(label).width;

    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(item.x - textWidth / 2 - 8, promptY - 12, textWidth + 16, 22, 11);
    } else {
      ctx.rect(item.x - textWidth / 2 - 8, promptY - 12, textWidth + 16, 22);
    }
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#fbbf24";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, item.x, promptY);
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }
}
