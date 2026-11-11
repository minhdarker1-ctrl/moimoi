"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus_small" | "cactus_large" | "cactus_double" | "bird";
  birdFrame?: number;
  speed: number;
}

export default function DinoRunnerWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1280);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [dayNight, setDayNight] = useState<"day" | "night">("night");

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("minsr-dino-hi") || 1280);
      setHighScore(saved);
    } catch {}
  }, []);

  const handleUserJump = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // Dispatch custom jump event to the canvas loop
    canvas.dispatchEvent(new CustomEvent("dino-jump"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 300);
    const height = (canvas.height = 140);
    const groundY = 115;

    // Dino Physics & State
    const dino = {
      x: 28,
      y: groundY - 26,
      width: 22,
      height: 26,
      vy: 0,
      gravity: 0.58,
      jumpStrength: -9.4,
      grounded: true,
      ducking: false,
      legFrame: 0,
      legTimer: 0,
      jump() {
        if (this.grounded) {
          this.vy = this.jumpStrength;
          this.grounded = false;
          this.ducking = false;
        }
      },
    };

    // Ground scrolling dashes
    let groundOffset = 0;
    const groundSpeed = 3.6;

    // Obstacles array
    let obstacles: Obstacle[] = [];
    let spawnTimer = 70;
    let currentScore = 0;
    let cycleTimer = 0;
    let localDayNight: "day" | "night" = "night";

    // Listen for manual jump
    function onDinoJump() {
      dino.jump();
    }
    canvas.addEventListener("dino-jump", onDinoJump);

    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        dino.jump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        if (dino.grounded) {
          dino.ducking = true;
        }
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ArrowDown") {
        dino.ducking = false;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Main Game Loop
    function loop() {
      // 1. Update Game Cycle (Day / Night cycle: Sáng / Tối)
      cycleTimer++;
      if (cycleTimer > 900) {
        cycleTimer = 0;
        localDayNight = localDayNight === "night" ? "day" : "night";
        setDayNight(localDayNight);
      }

      // 2. Score Update
      currentScore += 0.2;
      const displayScore = Math.floor(currentScore);
      if (displayScore % 5 === 0) {
        setScore(displayScore);
      }

      // 3. Update Dino Physics
      dino.y += dino.vy;
      if (!dino.grounded) {
        dino.vy += dino.gravity;
      }

      // Ground collision
      const baseHeight = dino.ducking ? 15 : 26;
      if (dino.y >= groundY - baseHeight) {
        dino.y = groundY - baseHeight;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Leg animation
      dino.legTimer++;
      if (dino.legTimer > 5) {
        dino.legTimer = 0;
        dino.legFrame = (dino.legFrame + 1) % 2;
      }

      // 4. Update Ground
      groundOffset = (groundOffset + groundSpeed) % 24;

      // 5. Spawn Obstacles
      spawnTimer--;
      if (spawnTimer <= 0) {
        spawnTimer = Math.floor(Math.random() * 65) + 65;

        // Choose obstacle: small cactus, large cactus, double cactus, or flying bird
        const r = Math.random();
        if (r < 0.35) {
          // Small cactus
          obstacles.push({
            x: width + 10,
            y: groundY - 24,
            width: 12,
            height: 24,
            type: "cactus_small",
            speed: groundSpeed,
          });
        } else if (r < 0.62) {
          // Double cactus
          obstacles.push({
            x: width + 10,
            y: groundY - 26,
            width: 22,
            height: 26,
            type: "cactus_double",
            speed: groundSpeed,
          });
        } else if (r < 0.82) {
          // Large cactus
          obstacles.push({
            x: width + 10,
            y: groundY - 32,
            width: 16,
            height: 32,
            type: "cactus_large",
            speed: groundSpeed,
          });
        } else {
          // Pterodactyl Bird (Chim bay sáng / tối)
          // 2 heights: low (must jump) or mid (must duck)
          const birdY = Math.random() < 0.5 ? groundY - 26 : groundY - 42;
          obstacles.push({
            x: width + 10,
            y: birdY,
            width: 24,
            height: 16,
            type: "bird",
            birdFrame: 0,
            speed: groundSpeed + 0.8,
          });
        }
      }

      // 6. Update Obstacles & AI AUTO-PLAY (Treo máy bất tử)
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        // Animate bird wings
        if (obs.type === "bird") {
          obs.birdFrame = (Math.floor(cycleTimer / 8) % 2);
        }

        // ==========================================
        // AUTO-PLAY BOT LOGIC (Canh cự ly tự nhảy)
        // ==========================================
        const dist = obs.x - dino.x;
        if (dist > 0 && dist < 68) {
          if (obs.type === "bird" && obs.y === groundY - 42) {
            // Mid bird -> Duck!
            dino.ducking = true;
          } else if (dino.grounded) {
            // Cactus or low bird -> Jump!
            dino.jump();
          }
        }

        // Remove offscreen
        if (obs.x < -30) {
          obstacles.splice(i, 1);
        }
      }

      // Auto unduck if obstacle passed
      const nearestObs = obstacles.find((o) => o.x > dino.x - 10 && o.x < dino.x + 80);
      if (!nearestObs && dino.ducking) {
        dino.ducking = false;
      }

      // ==========================================
      // 7. RENDER FRAMELESS CANVAS (HOÀN TOÀN TRONG SUỐT)
      // ==========================================
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Theme Colors based on Day / Night Cycle (Sáng / Tối)
      const primaryColor = localDayNight === "night" ? "#38bdf8" : "#fbbf24";
      const secondaryColor = localDayNight === "night" ? "#94a3b8" : "#cbd5e1";
      const groundColor = "rgba(255, 255, 255, 0.25)";

      // Draw Horizon Ground Line with moving dashes
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Moving ground bumps
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let gx = -groundOffset; gx < width; gx += 28) {
        ctx.fillRect(gx, groundY + 3, 6, 1.5);
        ctx.fillRect(gx + 12, groundY + 6, 3, 1.5);
      }

      // Draw Obstacles (Xương rồng & Chim bay)
      obstacles.forEach((obs) => {
        ctx.fillStyle = obs.type === "bird" ? (localDayNight === "night" ? "#f43f5e" : "#f59e0b") : primaryColor;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;

        if (obs.type === "cactus_small") {
          // Small Cactus
          ctx.fillRect(obs.x + 4, obs.y, 4, obs.height);
          ctx.fillRect(obs.x, obs.y + 6, 4, 10);
          ctx.fillRect(obs.x + 8, obs.y + 8, 4, 10);
        } else if (obs.type === "cactus_double") {
          // Double Cacti
          ctx.fillRect(obs.x + 3, obs.y + 4, 4, obs.height - 4);
          ctx.fillRect(obs.x + 13, obs.y, 4, obs.height);
          ctx.fillRect(obs.x, obs.y + 10, 4, 8);
          ctx.fillRect(obs.x + 18, obs.y + 8, 4, 8);
        } else if (obs.type === "cactus_large") {
          // Large Cactus
          ctx.fillRect(obs.x + 5, obs.y, 6, obs.height);
          ctx.fillRect(obs.x, obs.y + 8, 5, 14);
          ctx.fillRect(obs.x + 11, obs.y + 10, 5, 14);
        } else if (obs.type === "bird") {
          // Pterodactyl Bird (Chim bay sáng / tối)
          const wingUp = obs.birdFrame === 0;
          // Bird Body & Beak
          ctx.fillRect(obs.x + 6, obs.y + 6, 12, 5);
          ctx.fillRect(obs.x, obs.y + 7, 6, 3); // Beak
          // Flapping Wings
          if (wingUp) {
            ctx.fillRect(obs.x + 10, obs.y, 4, 6);
            ctx.fillRect(obs.x + 14, obs.y - 3, 4, 4);
          } else {
            ctx.fillRect(obs.x + 10, obs.y + 11, 4, 6);
            ctx.fillRect(obs.x + 14, obs.y + 15, 4, 4);
          }
        }
      });

      // Draw Dino (Pixel T-Rex)
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 8;

      if (!dino.ducking) {
        // Normal Running / Jumping Dino
        const dx = dino.x;
        const dy = dino.y;

        // Head & Jaw
        ctx.fillRect(dx + 10, dy, 12, 10);
        ctx.fillRect(dx + 16, dy + 10, 6, 2); // Snout
        // Eye
        ctx.fillStyle = "#030c18";
        ctx.fillRect(dx + 13, dy + 2, 2, 2);
        ctx.fillStyle = "#ffffff";

        // Neck & Body
        ctx.fillRect(dx + 6, dy + 8, 8, 12);
        ctx.fillRect(dx + 2, dy + 12, 6, 8); // Tail base
        ctx.fillRect(dx, dy + 10, 2, 6); // Tail tip

        // Small Arm
        ctx.fillRect(dx + 14, dy + 12, 4, 2);
        ctx.fillRect(dx + 16, dy + 14, 2, 2);

        // Legs
        if (!dino.grounded) {
          // Jumping legs
          ctx.fillRect(dx + 4, dy + 20, 3, 6);
          ctx.fillRect(dx + 10, dy + 20, 3, 6);
        } else if (dino.legFrame === 0) {
          // Leg 1 down, Leg 2 back
          ctx.fillRect(dx + 5, dy + 20, 3, 6);
          ctx.fillRect(dx + 11, dy + 20, 4, 3);
        } else {
          // Leg 1 back, Leg 2 down
          ctx.fillRect(dx + 4, dy + 20, 4, 3);
          ctx.fillRect(dx + 10, dy + 20, 3, 6);
        }
      } else {
        // Ducking Dino (Cúi người né chim bay)
        const dx = dino.x;
        const dy = dino.y;

        // Elongated body
        ctx.fillRect(dx, dy + 4, 20, 8);
        ctx.fillRect(dx + 20, dy + 2, 8, 6); // Low head
        // Eye
        ctx.fillStyle = "#030c18";
        ctx.fillRect(dx + 22, dy + 3, 2, 2);
        ctx.fillStyle = "#ffffff";

        // Legs
        if (dino.legFrame === 0) {
          ctx.fillRect(dx + 4, dy + 12, 3, 3);
          ctx.fillRect(dx + 12, dy + 12, 4, 3);
        } else {
          ctx.fillRect(dx + 6, dy + 12, 4, 3);
          ctx.fillRect(dx + 14, dy + 12, 3, 3);
        }
      }

      // Draw Mini Stars & Clouds in Canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.shadowBlur = 0;
      ctx.fillRect(width * 0.25, 25, 2, 2);
      ctx.fillRect(width * 0.72, 18, 2, 2);
      ctx.fillRect(width * 0.88, 38, 1.5, 1.5);

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("dino-jump", onDinoJump);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <div
      className="cyber-dino-frameless-wrap"
      onClick={handleUserJump}
      role="button"
      tabIndex={0}
      aria-label="Khủng long Dino Runner - Bấm hoặc nhấn phím Space để nhảy"
      title="Khủng long Dino Runner - Đang tự động nhảy khi treo máy! Bấm vào để tự nhảy."
    >
      {/* Header Info: Score & Mode Indicator */}
      <div className="cyber-dino-info-row">
        <span className="cyber-dino-mode-tag">
          <span className="cyber-dino-dot" />
          {isAutoPlay ? "AUTO-DINO BOT" : "PLAYER 1"}
        </span>
        <div className="cyber-dino-score">
          <span className="cyber-dino-hi">HI {String(highScore).padStart(5, "0")}</span>{" "}
          <span className="cyber-dino-pts">{String(score).padStart(5, "0")}</span>
        </div>
      </div>

      {/* Canvas Game (Frameless & Transparent) */}
      <canvas ref={canvasRef} className="cyber-dino-canvas" />

      {/* Subtitle Hint */}
      <div className="cyber-dino-hint">
        <span>🦖 Bấm chuột hoặc Spacebar để nhảy</span>
        <span className="cyber-dino-cycle-badge">
          {dayNight === "night" ? "🌙 Đêm" : "☀️ Ngày"}
        </span>
      </div>
    </div>
  );
}
