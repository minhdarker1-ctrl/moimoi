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
  jumped?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function DinoRunnerWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(2580);
  const [isDead, setIsDead] = useState(false);
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState("1.0");

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("minsr-dino-hi") || 2580);
      setHighScore(saved);
    } catch {}
  }, []);

  const handleUserJump = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.dispatchEvent(new CustomEvent("dino-jump"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    // TỶ LỆ DẸT THANH THOÁT ĐỐI XỨNG: RỘNG 420px, CAO 150px
    const width = (canvas.width = 420);
    const height = (canvas.height = 150);
    const groundY = 122;

    // Dino Physics & State
    const dino = {
      x: 36,
      y: groundY - 36,
      width: 30,
      height: 36,
      vy: 0,
      gravity: 0.44,
      jumpStrength: -8.5,
      grounded: true,
      ducking: false,
      legFrame: 0,
      legTimer: 0,
      isFumbling: false, // Trạng thái ngẫu nhiên die khi chạm ngưỡng 999-9999
      jump() {
        if (this.grounded && !this.isFumbling) {
          this.vy = this.jumpStrength;
          this.grounded = false;
          this.ducking = false;
        }
      },
      reset() {
        this.y = groundY - 36;
        this.vy = 0;
        this.grounded = true;
        this.ducking = false;
        this.legFrame = 0;
        this.legTimer = 0;
        this.isFumbling = false;
      },
    };

    // TỐC ĐỘ 1.0X SIÊU CHILL, THƯ THÁI, MƯỢT MÀ
    const initialSpeed = 1.0;
    let groundSpeed = initialSpeed;
    let groundOffset = 0;

    // Chướng ngại vật & Điểm số
    let obstacles: Obstacle[] = [];
    let deathParticles: Particle[] = [];
    let spawnTimer = 110;
    let currentScore = 0;
    let cycleTimer = 0;
    let localDayNight: "day" | "night" = "night";
    let userHoldingDuck = false;

    // Trạng thái Game Over & Hồi sinh tự động
    let gameOver = false;
    let respawnCountdown = 0;

    // NGƯỠNG NGẪU NHIÊN DIE: TỪ 999 ĐẾN 9999 ĐIỂM (CỰC KỲ BỀN BỈ!)
    let targetDeathScore = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;

    function onDinoJump() {
      if (gameOver) {
        restartGame();
      } else {
        dino.jump();
      }
    }
    canvas.addEventListener("dino-jump", onDinoJump);

    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameOver) {
          restartGame();
        } else {
          dino.jump();
        }
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        userHoldingDuck = true;
        if (dino.grounded && !gameOver) {
          dino.ducking = true;
        }
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ArrowDown") {
        userHoldingDuck = false;
        dino.ducking = false;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Reset ván mới với tốc độ chill ban đầu 1.0x
    function restartGame() {
      gameOver = false;
      respawnCountdown = 0;
      setIsDead(false);
      currentScore = 0;
      groundSpeed = initialSpeed;
      obstacles = [];
      deathParticles = [];
      spawnTimer = 110;
      dino.reset();
      // Ngưỡng chết ngẫu nhiên mới: 999 - 9999
      targetDeathScore = Math.floor(Math.random() * (9999 - 999 + 1)) + 999;
    }

    // Game loop 60fps
    function loop() {
      if (gameOver) {
        respawnCountdown--;

        for (let p of deathParticles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.life--;
        }
        deathParticles = deathParticles.filter((p) => p.life > 0);

        renderScene();

        // Tự động hồi sinh sau khoảng 1.8s
        if (respawnCountdown <= 0) {
          restartGame();
        }

        animId = requestAnimationFrame(loop);
        return;
      }

      // 1. Chu kỳ Ngày / Đêm
      cycleTimer++;
      if (cycleTimer > 1500) {
        cycleTimer = 0;
        localDayNight = localDayNight === "night" ? "day" : "night";
      }

      // 2. Tốc độ chill 1.0x tăng cực kỳ êm dịu
      currentScore += 0.12;
      groundSpeed = initialSpeed + Math.min(currentScore * 0.00012, 0.45);

      const displayScore = Math.floor(currentScore);
      if (displayScore % 4 === 0) {
        setScore(displayScore);
        setCurrentSpeedDisplay(groundSpeed.toFixed(1));
      }

      // 3. Vật lý Khủng Long
      dino.y += dino.vy;
      if (!dino.grounded) {
        dino.vy += dino.gravity;
      }

      const baseHeight = dino.ducking ? 20 : 36;
      if (dino.y >= groundY - baseHeight) {
        dino.y = groundY - baseHeight;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Nhịp bước chân thong thả, êm ái
      dino.legTimer++;
      if (dino.legTimer > 7) {
        dino.legTimer = 0;
        dino.legFrame = (dino.legFrame + 1) % 2;
      }

      // 4. Mặt đất cuộn trôi
      groundOffset = (groundOffset + groundSpeed) % 32;

      // 5. Sinh chướng ngại vật khoảng cách an toàn, thoáng đãng
      spawnTimer--;
      if (spawnTimer <= 0) {
        const speedFactor = 1.1 / groundSpeed;
        spawnTimer = Math.floor((Math.random() * 80 + 120) * speedFactor);

        const r = Math.random();
        if (r < 0.35) {
          // Xương rồng nhỏ
          obstacles.push({
            x: width + 15,
            y: groundY - 26,
            width: 16,
            height: 26,
            type: "cactus_small",
            speed: groundSpeed,
          });
        } else if (r < 0.62) {
          // Xương rồng đôi
          obstacles.push({
            x: width + 15,
            y: groundY - 30,
            width: 28,
            height: 30,
            type: "cactus_double",
            speed: groundSpeed,
          });
        } else if (r < 0.82) {
          // Xương rồng lớn
          obstacles.push({
            x: width + 15,
            y: groundY - 36,
            width: 20,
            height: 36,
            type: "cactus_large",
            speed: groundSpeed,
          });
        } else {
          // Chim bay (tầm thấp bay phải nhảy hoặc tầm vừa bay ngang đầu phải cúi)
          const birdY = Math.random() < 0.5 ? groundY - 26 : groundY - 48;
          obstacles.push({
            x: width + 15,
            y: birdY,
            width: 32,
            height: 18,
            type: "bird",
            birdFrame: 0,
            speed: groundSpeed + 0.35,
          });
        }
      }

      // 6. Cập nhật chướng ngại vật & Bot né chuẩn xác (Chỉ nhảy ĐÚNG 1 LẦN, không nhảy loạn xạ)
      const shouldDieNow = currentScore >= targetDeathScore;
      let needDuck = false;
      const tApex = Math.abs(dino.jumpStrength) / dino.gravity; // ~19.3 frames

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        if (obs.type === "bird") {
          obs.birdFrame = Math.floor(cycleTimer / 10) % 2;
        }

        // Cự ly tới Dino
        const dist = obs.x - (dino.x + dino.width);

        // Cự ly nhảy tối ưu: Đỉnh Parabol của Dino sẽ rơi vào ngay giữa chướng ngại vật
        const idealJumpDist = Math.round(tApex * groundSpeed + (obs.width / 2) - 4);

        if (dist > -obs.width - 12 && dist <= 75) {
          if (shouldDieNow) {
            // Đã đạt điểm mục tiêu (999-9999): cố tình không nhảy/cúi để va chạm tự nhiên!
            dino.isFumbling = true;
          } else {
            dino.isFumbling = false;

            // 1. Chim bay tầm đầu: Cúi mình né mượt mà
            if (obs.type === "bird" && obs.y === groundY - 48) {
              if (dist <= 42 && dist > -obs.width - 6) {
                needDuck = true;
              }
            }
            // 2. Xương rồng hoặc chim tầm thấp: Nhảy ĐÚNG 1 CÚ NHẢY DUY NHẤT
            else {
              if (dino.grounded && !obs.jumped && dist <= idealJumpDist && dist > 0) {
                obs.jumped = true; // ĐÁNH DẤU ĐÃ NHẢY: vĩnh viễn không nhảy thêm lần nào cho vật cản này!
                dino.jump();
              }
            }
          }
        }

        // Kiểm tra va chạm thực sự
        const dinoHitBox = {
          x: dino.x + 5,
          y: dino.y + 4,
          w: (dino.ducking ? 36 : dino.width) - 8,
          h: (dino.ducking ? 18 : dino.height) - 6,
        };

        const obsHitBox = {
          x: obs.x + 3,
          y: obs.y + 3,
          w: obs.width - 6,
          h: obs.height - 6,
        };

        const isColliding =
          dinoHitBox.x < obsHitBox.x + obsHitBox.w &&
          dinoHitBox.x + dinoHitBox.w > obsHitBox.x &&
          dinoHitBox.y < obsHitBox.y + obsHitBox.h &&
          dinoHitBox.y + dinoHitBox.h > obsHitBox.y;

        if (isColliding) {
          gameOver = true;
          setIsDead(true);
          respawnCountdown = 100;

          const finalScore = Math.floor(currentScore);
          setHighScore((prev) => {
            const nextHi = Math.max(prev, finalScore);
            try {
              localStorage.setItem("minsr-dino-hi", String(nextHi));
            } catch {}
            return nextHi;
          });

          // Hạt nổ pixel
          for (let k = 0; k < 14; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 3 + 1;
            deathParticles.push({
              x: dino.x + dino.width / 2,
              y: dino.y + dino.height / 2,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 1,
              life: Math.floor(Math.random() * 25 + 25),
              maxLife: 50,
              color: Math.random() < 0.5 ? "#f43f5e" : "#38bdf8",
            });
          }
          break;
        }

        if (obs.x < -45) {
          obstacles.splice(i, 1);
        }
      }

      // Tự động đứng thẳng dậy khi chim đã bay qua
      if (!userHoldingDuck && !dino.isFumbling) {
        dino.ducking = needDuck;
      }

      renderScene();
      animId = requestAnimationFrame(loop);
    }

    function renderScene() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const primaryColor = localDayNight === "night" ? "#38bdf8" : "#fbbf24";
      const groundColor = "rgba(255, 255, 255, 0.25)";

      // Đường chân trời
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Vết sỏi nhỏ
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let gx = -groundOffset; gx < width; gx += 36) {
        ctx.fillRect(gx, groundY + 3, 7, 1.5);
        ctx.fillRect(gx + 16, groundY + 6, 4, 1.5);
      }

      // Vẽ chướng ngại vật
      obstacles.forEach((obs) => {
        ctx.fillStyle =
          obs.type === "bird"
            ? localDayNight === "night"
              ? "#f43f5e"
              : "#f59e0b"
            : primaryColor;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;

        if (obs.type === "cactus_small") {
          ctx.fillRect(obs.x + 5, obs.y, 6, obs.height);
          ctx.fillRect(obs.x, obs.y + 7, 5, 12);
          ctx.fillRect(obs.x + 11, obs.y + 9, 5, 12);
        } else if (obs.type === "cactus_double") {
          ctx.fillRect(obs.x + 4, obs.y + 5, 5, obs.height - 5);
          ctx.fillRect(obs.x + 16, obs.y, 5, obs.height);
          ctx.fillRect(obs.x, obs.y + 12, 5, 10);
          ctx.fillRect(obs.x + 22, obs.y + 9, 5, 10);
        } else if (obs.type === "cactus_large") {
          ctx.fillRect(obs.x + 6, obs.y, 7, obs.height);
          ctx.fillRect(obs.x, obs.y + 10, 6, 17);
          ctx.fillRect(obs.x + 13, obs.y + 12, 6, 17);
        } else if (obs.type === "bird") {
          const wingUp = obs.birdFrame === 0;
          ctx.fillRect(obs.x + 8, obs.y + 8, 16, 6);
          ctx.fillRect(obs.x, obs.y + 9, 8, 4);
          if (wingUp) {
            ctx.fillRect(obs.x + 13, obs.y, 5, 8);
            ctx.fillRect(obs.x + 18, obs.y - 4, 5, 5);
          } else {
            ctx.fillRect(obs.x + 13, obs.y + 14, 5, 8);
            ctx.fillRect(obs.x + 18, obs.y + 19, 5, 5);
          }
        }
      });

      // Vẽ hạt nổ khi die
      if (deathParticles.length > 0) {
        deathParticles.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 5;
          ctx.fillRect(p.x, p.y, 2.5, 2.5);
        });
      }

      // Vẽ Khủng Long Dino
      ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";
      ctx.shadowColor = gameOver ? "#f43f5e" : primaryColor;
      ctx.shadowBlur = gameOver ? 12 : 8;

      const dx = dino.x;
      const dy = dino.y;

      if (!dino.ducking) {
        ctx.fillRect(dx + 13, dy, 17, 14);
        ctx.fillRect(dx + 22, dy + 14, 8, 3); // Mõm

        if (gameOver) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(dx + 17, dy + 3, 2, 2);
          ctx.fillRect(dx + 20, dy + 3, 2, 2);
          ctx.fillRect(dx + 18.5, dy + 5, 2, 2);
          ctx.fillRect(dx + 17, dy + 7, 2, 2);
          ctx.fillRect(dx + 20, dy + 7, 2, 2);
        } else {
          ctx.fillStyle = "#030c18";
          ctx.fillRect(dx + 18, dy + 3, 3, 3);
        }
        ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";

        ctx.fillRect(dx + 8, dy + 11, 11, 16);
        ctx.fillRect(dx + 3, dy + 17, 8, 11);
        ctx.fillRect(dx, dy + 14, 3, 8);

        ctx.fillRect(dx + 19, dy + 17, 5, 3);
        ctx.fillRect(dx + 22, dy + 20, 3, 3);

        if (!dino.grounded) {
          ctx.fillRect(dx + 5, dy + 27, 4, 9);
          ctx.fillRect(dx + 13, dy + 27, 4, 9);
        } else if (dino.legFrame === 0) {
          ctx.fillRect(dx + 7, dy + 27, 4, 9);
          ctx.fillRect(dx + 15, dy + 27, 5, 5);
        } else {
          ctx.fillRect(dx + 5, dy + 27, 5, 5);
          ctx.fillRect(dx + 13, dy + 27, 4, 9);
        }
      } else {
        ctx.fillRect(dx, dy + 5, 27, 11);
        ctx.fillRect(dx + 27, dy + 3, 11, 8);
        ctx.fillStyle = "#030c18";
        ctx.fillRect(dx + 30, dy + 4, 3, 3);
        ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";

        if (dino.legFrame === 0) {
          ctx.fillRect(dx + 5, dy + 16, 4, 4);
          ctx.fillRect(dx + 16, dy + 16, 5, 4);
        } else {
          ctx.fillRect(dx + 8, dy + 16, 5, 4);
          ctx.fillRect(dx + 19, dy + 16, 4, 4);
        }
      }

      if (gameOver) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f43f5e";
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 13px monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("💥 VA CHẠM! ĐANG TỰ ĐỘNG HỒI SINH...", width / 2, 35);
        ctx.textAlign = "left";
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.shadowBlur = 0;
      ctx.fillRect(width * 0.2, 28, 2, 2);
      ctx.fillRect(width * 0.78, 22, 2, 2);
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
      title="Khủng long Dino Runner - Tốc độ 1.0x chill, bền bỉ từ 999-9999 điểm!"
    >
      {/* Header Info: Score, Mode Indicator & Live Speed */}
      <div className="cyber-dino-info-row">
        <span className="cyber-dino-mode-tag">
          <span className={`cyber-dino-dot ${isDead ? "dead" : ""}`} />
          {isDead ? "RESPAWNING..." : "AUTO-DINO BOT"}
        </span>
        <div className="cyber-dino-metrics">
          <span className="cyber-dino-speed-badge">⚡ {currentSpeedDisplay}x CHILL</span>
          <div className="cyber-dino-score">
            <span className="cyber-dino-hi">HI {String(highScore).padStart(5, "0")}</span>{" "}
            <span className="cyber-dino-pts">{String(score).padStart(5, "0")}</span>
          </div>
        </div>
      </div>

      {/* Canvas Game (Dẹt thanh thoát 480x160, Frameless) */}
      <canvas ref={canvasRef} className="cyber-dino-canvas" />

      {/* Subtitle Hint */}
      <div className="cyber-dino-hint">
        <span>🦖 Bấm Space/chuột để nhảy · Treo máy siêu chill</span>
        <span className="cyber-dino-cycle-badge">Mục tiêu: 999 - 9999 pts</span>
      </div>
    </div>
  );
}
