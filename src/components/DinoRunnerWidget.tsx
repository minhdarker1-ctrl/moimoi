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
  const [highScore, setHighScore] = useState(1280);
  const [isAutoPlay] = useState(true);
  const [dayNight, setDayNight] = useState<"day" | "night">("night");
  const [isDead, setIsDead] = useState(false);
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState("2.4");

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
    canvas.dispatchEvent(new CustomEvent("dino-jump"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    // TĂNG KÍCH THƯỚC TO LÊN 80% (Canvas rộng 540px, cao 240px)
    const width = (canvas.width = 540);
    const height = (canvas.height = 240);
    const groundY = 195;

    // Dino Physics & State (Scale to 1.8x)
    const dino = {
      x: 48,
      y: groundY - 48,
      width: 40,
      height: 48,
      vy: 0,
      gravity: 0.78,
      jumpStrength: -12.8,
      grounded: true,
      ducking: false,
      legFrame: 0,
      legTimer: 0,
      isFumbling: false, // Trạng thái ngẫu nhiên lỡ nhịp để die
      jump() {
        if (this.grounded && !this.isFumbling) {
          this.vy = this.jumpStrength;
          this.grounded = false;
          this.ducking = false;
        }
      },
      reset() {
        this.y = groundY - 48;
        this.vy = 0;
        this.grounded = true;
        this.ducking = false;
        this.legFrame = 0;
        this.legTimer = 0;
        this.isFumbling = false;
      },
    };

    // Tốc độ ban đầu chậm rãi, thư thái (2.4 px/frame)
    const initialSpeed = 2.4;
    let groundSpeed = initialSpeed;
    let groundOffset = 0;

    // Chướng ngại vật & Điểm số
    let obstacles: Obstacle[] = [];
    let deathParticles: Particle[] = [];
    let spawnTimer = 90;
    let currentScore = 0;
    let cycleTimer = 0;
    let localDayNight: "day" | "night" = "night";

    // Trạng thái Game Over & Hồi sinh tự động
    let gameOver = false;
    let respawnCountdown = 0;

    // Điểm số ngẫu nhiên cho mỗi ván sẽ bị die (từ 160 đến 520 điểm)
    let targetDeathScore = Math.floor(Math.random() * 360) + 160;

    // Lắng nghe sự kiện nhảy thủ công
    function onDinoJump() {
      if (gameOver) {
        // Click để restart ngay lập tức
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
        if (dino.grounded && !gameOver) {
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

    // Hàm khởi động lại từ đầu
    function restartGame() {
      gameOver = false;
      respawnCountdown = 0;
      setIsDead(false);
      currentScore = 0;
      groundSpeed = initialSpeed;
      obstacles = [];
      deathParticles = [];
      spawnTimer = 90;
      dino.reset();
      // Đặt ngưỡng ngẫu nhiên mới cho ván sau
      targetDeathScore = Math.floor(Math.random() * 380) + 180;
    }

    // Main Game Loop 60fps
    function loop() {
      // ==========================================
      // XỬ LÝ KHI KHỦNG LONG ĐÃ DIE (GAME OVER)
      // ==========================================
      if (gameOver) {
        respawnCountdown--;

        // Update death explosion particles
        for (let p of deathParticles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // particle gravity
          p.life--;
        }
        deathParticles = deathParticles.filter((p) => p.life > 0);

        // Vẽ lại canvas tĩnh và thông báo hồi sinh
        renderScene();

        // Tự động hồi sinh sau khoảng 1.8 giây (110 frames)
        if (respawnCountdown <= 0) {
          restartGame();
        }

        animId = requestAnimationFrame(loop);
        return;
      }

      // ==========================================
      // 1. CHU KỲ NGÀY / ĐÊM (DAY & NIGHT)
      // ==========================================
      cycleTimer++;
      if (cycleTimer > 1200) {
        cycleTimer = 0;
        localDayNight = localDayNight === "night" ? "day" : "night";
        setDayNight(localDayNight);
      }

      // ==========================================
      // 2. NHANH DẦN ĐỀU THEO THỜI GIAN & ĐIỂM SỐ
      // Bắt đầu 2.4, tăng từ từ đều đặn đến tối đa 6.2
      // ==========================================
      currentScore += 0.18;
      groundSpeed = initialSpeed + Math.min(currentScore * 0.0042, 3.8);

      const displayScore = Math.floor(currentScore);
      if (displayScore % 4 === 0) {
        setScore(displayScore);
        setCurrentSpeedDisplay(groundSpeed.toFixed(1));
      }

      // ==========================================
      // 3. VẬT LÝ KHỦNG LONG (DINO PHYSICS)
      // ==========================================
      dino.y += dino.vy;
      if (!dino.grounded) {
        dino.vy += dino.gravity;
      }

      const baseHeight = dino.ducking ? 28 : 48;
      if (dino.y >= groundY - baseHeight) {
        dino.y = groundY - baseHeight;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Hoạt họa nhịp chân theo tốc độ chạy
      dino.legTimer++;
      const legStepInterval = Math.max(2, Math.floor(6 - groundSpeed * 0.5));
      if (dino.legTimer > legStepInterval) {
        dino.legTimer = 0;
        dino.legFrame = (dino.legFrame + 1) % 2;
      }

      // ==========================================
      // 4. MẶT ĐẤT CUỘN TRÔI
      // ==========================================
      groundOffset = (groundOffset + groundSpeed) % 40;

      // ==========================================
      // 5. SINH CHƯỚNG NGẠI VẬT (SCALE TO 1.8X)
      // ==========================================
      spawnTimer--;
      if (spawnTimer <= 0) {
        // Khoảng cách xuất hiện co giãn theo tốc độ để vừa mắt
        const speedFactor = 3.6 / groundSpeed;
        spawnTimer = Math.floor((Math.random() * 55 + 75) * speedFactor);

        const r = Math.random();
        if (r < 0.35) {
          // Xương rồng nhỏ (scale to 1.8x)
          obstacles.push({
            x: width + 20,
            y: groundY - 42,
            width: 22,
            height: 42,
            type: "cactus_small",
            speed: groundSpeed,
          });
        } else if (r < 0.62) {
          // Xương rồng đôi (scale to 1.8x)
          obstacles.push({
            x: width + 20,
            y: groundY - 46,
            width: 38,
            height: 46,
            type: "cactus_double",
            speed: groundSpeed,
          });
        } else if (r < 0.82) {
          // Xương rồng lớn (scale to 1.8x)
          obstacles.push({
            x: width + 20,
            y: groundY - 56,
            width: 28,
            height: 56,
            type: "cactus_large",
            speed: groundSpeed,
          });
        } else {
          // Chim bay Pterodactyls (scale to 1.8x, độ cao thấp hoặc vừa)
          const birdY = Math.random() < 0.5 ? groundY - 44 : groundY - 74;
          obstacles.push({
            x: width + 20,
            y: birdY,
            width: 42,
            height: 28,
            type: "bird",
            birdFrame: 0,
            speed: groundSpeed + 0.8,
          });
        }
      }

      // ==========================================
      // 6. CẬP NHẬT CHƯỚNG NGẠI VẬT & BOT AUTO-PLAY
      // CÓ TỶ LỆ NGẪU NHIÊN DIE KHI ĐẠT TARGET SCORE!
      // ==========================================
      const shouldDieNow = currentScore >= targetDeathScore;

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        if (obs.type === "bird") {
          obs.birdFrame = Math.floor(cycleTimer / 8) % 2;
        }

        // ==========================================
        // AUTO-PLAY BOT LOGIC
        // ==========================================
        const dist = obs.x - (dino.x + dino.width);

        if (dist > -10 && dist < 110) {
          if (shouldDieNow) {
            // BOT LỠ NHỊP NGẪU NHIÊN ĐỂ DIE TỰ NHIÊN!
            dino.isFumbling = true;
            // Không nhảy hoặc không cúi để va chạm
          } else {
            // Bot né an toàn
            dino.isFumbling = false;
            if (obs.type === "bird" && obs.y === groundY - 74) {
              // Chim bay vừa tầm đầu -> Cúi!
              dino.ducking = true;
            } else if (dino.grounded) {
              // Xương rồng hoặc chim bay thấp -> Nhảy!
              dino.jump();
            }
          }
        }

        // ==========================================
        // KIỂM TRA VA CHẠM THỰC SỰ (COLLISION CHECK)
        // ==========================================
        const dinoHitBox = {
          x: dino.x + 8,
          y: dino.y + 6,
          w: (dino.ducking ? 48 : dino.width) - 12,
          h: (dino.ducking ? 26 : dino.height) - 10,
        };

        const obsHitBox = {
          x: obs.x + 4,
          y: obs.y + 4,
          w: obs.width - 8,
          h: obs.height - 8,
        };

        // AABB Collision
        const isColliding =
          dinoHitBox.x < obsHitBox.x + obsHitBox.w &&
          dinoHitBox.x + dinoHitBox.w > obsHitBox.x &&
          dinoHitBox.y < obsHitBox.y + obsHitBox.h &&
          dinoHitBox.y + dinoHitBox.h > obsHitBox.y;

        if (isColliding) {
          // BÙM! KHỦNG LONG DIE!
          gameOver = true;
          setIsDead(true);
          respawnCountdown = 110; // ~1.8s trước khi tự hồi sinh

          // Cập nhật kỷ lục điểm cao
          const finalScore = Math.floor(currentScore);
          setHighScore((prev) => {
            const nextHi = Math.max(prev, finalScore);
            try {
              localStorage.setItem("minsr-dino-hi", String(nextHi));
            } catch {}
            return nextHi;
          });

          // Tạo hạt nổ pixel (Neon Explosion)
          for (let k = 0; k < 18; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 4 + 1.5;
            deathParticles.push({
              x: dino.x + dino.width / 2,
              y: dino.y + dino.height / 2,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 1.5,
              life: Math.floor(Math.random() * 30 + 30),
              maxLife: 60,
              color: Math.random() < 0.5 ? "#f43f5e" : "#38bdf8",
            });
          }
          break;
        }

        // Xóa chướng ngại vật ra khỏi màn hình
        if (obs.x < -60) {
          obstacles.splice(i, 1);
        }
      }

      // Tự đứng dậy nếu chướng ngại vật đã qua
      const nearestObs = obstacles.find(
        (o) => o.x > dino.x - 20 && o.x < dino.x + 130
      );
      if (!nearestObs && dino.ducking && !dino.isFumbling) {
        dino.ducking = false;
      }

      // ==========================================
      // 7. VẼ SCENE
      // ==========================================
      renderScene();

      animId = requestAnimationFrame(loop);
    }

    // Hàm render cảnh game trên Canvas
    function renderScene() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const primaryColor = localDayNight === "night" ? "#38bdf8" : "#fbbf24";
      const groundColor = "rgba(255, 255, 255, 0.28)";

      // Đường chân trời mặt đất (Ground Line)
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Các vệt sỏi đá chuyển động trên mặt đất
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      for (let gx = -groundOffset; gx < width; gx += 46) {
        ctx.fillRect(gx, groundY + 4, 10, 2);
        ctx.fillRect(gx + 20, groundY + 9, 5, 2);
      }

      // Vẽ chướng ngại vật (Xương rồng & Chim bay 1.8x)
      obstacles.forEach((obs) => {
        ctx.fillStyle =
          obs.type === "bird"
            ? localDayNight === "night"
              ? "#f43f5e"
              : "#f59e0b"
            : primaryColor;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;

        if (obs.type === "cactus_small") {
          // Xương rồng nhỏ
          ctx.fillRect(obs.x + 7, obs.y, 7, obs.height);
          ctx.fillRect(obs.x, obs.y + 11, 7, 18);
          ctx.fillRect(obs.x + 14, obs.y + 14, 7, 18);
        } else if (obs.type === "cactus_double") {
          // Xương rồng đôi
          ctx.fillRect(obs.x + 5, obs.y + 7, 7, obs.height - 7);
          ctx.fillRect(obs.x + 23, obs.y, 7, obs.height);
          ctx.fillRect(obs.x, obs.y + 18, 7, 14);
          ctx.fillRect(obs.x + 31, obs.y + 14, 7, 14);
        } else if (obs.type === "cactus_large") {
          // Xương rồng lớn
          ctx.fillRect(obs.x + 9, obs.y, 10, obs.height);
          ctx.fillRect(obs.x, obs.y + 14, 9, 25);
          ctx.fillRect(obs.x + 19, obs.y + 18, 9, 25);
        } else if (obs.type === "bird") {
          // Chim bay Pterodactyls
          const wingUp = obs.birdFrame === 0;
          // Thân & mỏ chim
          ctx.fillRect(obs.x + 11, obs.y + 11, 22, 9);
          ctx.fillRect(obs.x, obs.y + 13, 11, 5); // Mỏ
          // Cánh chim vỗ lên / xuống
          if (wingUp) {
            ctx.fillRect(obs.x + 18, obs.y, 7, 11);
            ctx.fillRect(obs.x + 25, obs.y - 6, 7, 7);
          } else {
            ctx.fillRect(obs.x + 18, obs.y + 20, 7, 11);
            ctx.fillRect(obs.x + 25, obs.y + 27, 7, 7);
          }
        }
      });

      // Vẽ hạt nổ khi Game Over
      if (deathParticles.length > 0) {
        deathParticles.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(p.x, p.y, 3, 3);
        });
      }

      // Vẽ Khủng Long Dino (Pixel T-Rex 1.8x)
      ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";
      ctx.shadowColor = gameOver ? "#f43f5e" : primaryColor;
      ctx.shadowBlur = gameOver ? 14 : 10;

      const dx = dino.x;
      const dy = dino.y;

      if (!dino.ducking) {
        // Khủng long bình thường (đứng / chạy / nhảy)
        // Đầu & hàm
        ctx.fillRect(dx + 18, dy, 22, 18);
        ctx.fillRect(dx + 29, dy + 18, 11, 4); // Mõm

        // Mắt khủng long: dấu X nếu Game Over, ô pixel nếu bình thường
        if (gameOver) {
          ctx.fillStyle = "#ffffff";
          // Chữ X nhỏ trong mắt
          ctx.fillRect(dx + 23, dy + 4, 2, 2);
          ctx.fillRect(dx + 27, dy + 4, 2, 2);
          ctx.fillRect(dx + 25, dy + 6, 2, 2);
          ctx.fillRect(dx + 23, dy + 8, 2, 2);
          ctx.fillRect(dx + 27, dy + 8, 2, 2);
        } else {
          ctx.fillStyle = "#030c18";
          ctx.fillRect(dx + 24, dy + 4, 4, 4); // Con ngươi
        }
        ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";

        // Cổ & thân
        ctx.fillRect(dx + 11, dy + 14, 15, 22);
        ctx.fillRect(dx + 4, dy + 22, 11, 15); // Đuôi
        ctx.fillRect(dx, dy + 18, 4, 11); // Chóp đuôi

        // Tay nhỏ
        ctx.fillRect(dx + 26, dy + 22, 7, 4);
        ctx.fillRect(dx + 29, dy + 26, 4, 4);

        // Chân khủng long
        if (!dino.grounded) {
          ctx.fillRect(dx + 7, dy + 36, 6, 11);
          ctx.fillRect(dx + 18, dy + 36, 6, 11);
        } else if (dino.legFrame === 0) {
          ctx.fillRect(dx + 9, dy + 36, 6, 11);
          ctx.fillRect(dx + 20, dy + 36, 7, 6);
        } else {
          ctx.fillRect(dx + 7, dy + 36, 7, 6);
          ctx.fillRect(dx + 18, dy + 36, 6, 11);
        }
      } else {
        // Khủng long cúi người né chim bay
        ctx.fillRect(dx, dy + 7, 36, 15);
        ctx.fillRect(dx + 36, dy + 4, 15, 11); // Đầu hạ thấp
        // Mắt
        ctx.fillStyle = "#030c18";
        ctx.fillRect(dx + 40, dy + 6, 4, 4);
        ctx.fillStyle = gameOver ? "#f43f5e" : "#ffffff";

        // Chân cúi
        if (dino.legFrame === 0) {
          ctx.fillRect(dx + 7, dy + 22, 6, 6);
          ctx.fillRect(dx + 22, dy + 22, 7, 6);
        } else {
          ctx.fillRect(dx + 11, dy + 22, 7, 6);
          ctx.fillRect(dx + 26, dy + 22, 6, 6);
        }
      }

      // Thông báo khi GAME OVER (chết ngẫu nhiên & đếm lùi hồi sinh)
      if (gameOver) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#f43f5e";
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 15px monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("💥 OOPS! VA CHẠM — ĐANG HỒI SINH TỰ ĐỘNG...", width / 2, 45);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px monospace, sans-serif";
        ctx.fillText("Khủng long sẽ chạy lại từ đầu với tốc độ ban đầu", width / 2, 68);
        ctx.textAlign = "left";
      }

      // Mini sao lấp lánh trên canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.shadowBlur = 0;
      ctx.fillRect(width * 0.22, 40, 3, 3);
      ctx.fillRect(width * 0.76, 30, 3, 3);
      ctx.fillRect(width * 0.9, 65, 2, 2);
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
      title="Khủng long Dino Runner - Bấm vào để nhảy hoặc tự động hồi sinh!"
    >
      {/* Header Info: Score, Mode Indicator & Live Speed */}
      <div className="cyber-dino-info-row">
        <span className="cyber-dino-mode-tag">
          <span className={`cyber-dino-dot ${isDead ? "dead" : ""}`} />
          {isDead ? "DEAD (RESPAWNING)" : isAutoPlay ? "AUTO-DINO BOT" : "PLAYER 1"}
        </span>
        <div className="cyber-dino-metrics">
          <span className="cyber-dino-speed-badge">⚡ {currentSpeedDisplay}x</span>
          <div className="cyber-dino-score">
            <span className="cyber-dino-hi">HI {String(highScore).padStart(5, "0")}</span>{" "}
            <span className="cyber-dino-pts">{String(score).padStart(5, "0")}</span>
          </div>
        </div>
      </div>

      {/* Canvas Game (To hơn 80%, Frameless & Transparent) */}
      <canvas ref={canvasRef} className="cyber-dino-canvas" />

      {/* Subtitle Hint */}
      <div className="cyber-dino-hint">
        <span>🦖 Bấm chuột/Spacebar để nhảy · Nhanh dần đều &amp; tự hồi sinh</span>
        <span className="cyber-dino-cycle-badge">
          {dayNight === "night" ? "🌙 Đêm" : "☀️ Ngày"}
        </span>
      </div>
    </div>
  );
}
