"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function NeonDragonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    // Number of spine segments for a long, majestic Asian dragon
    const NUM_SEGMENTS = 46;
    const SEG_LENGTH = 14;

    // Initialize dragon spine in the center
    const spine: Point[] = [];
    const cx = width * 0.5;
    const cy = height * 0.35;
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      spine.push({ x: cx - i * SEG_LENGTH, y: cy, angle: 0 });
    }

    // Whiskers (Râu rồng) - Left & Right (7 joints each)
    const NUM_WHISKER_JOINTS = 8;
    const leftWhisker: Point[] = [];
    const rightWhisker: Point[] = [];
    for (let i = 0; i < NUM_WHISKER_JOINTS; i++) {
      leftWhisker.push({ x: cx, y: cy, angle: 0 });
      rightWhisker.push({ x: cx, y: cy, angle: 0 });
    }

    // Flying trajectory parameters
    let targetX = cx;
    let targetY = cy;
    let headX = cx;
    let headY = cy;
    let headAngle = 0;
    let speed = 2.6;
    let time = 0;
    let userInteracting = false;
    let userTimeout: NodeJS.Timeout | null = null;

    // Track mouse to let dragon playfully acknowledge the user
    function handleMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      userInteracting = true;
      if (userTimeout) clearTimeout(userTimeout);
      userTimeout = setTimeout(() => {
        userInteracting = false;
      }, 3500);
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Sparkle trail particles
    const particles: Particle[] = [];
    const PARTICLE_COLORS = ["#38bdf8", "#fbbf24", "#c084fc", "#f43f5e", "#ffffff"];

    // Main animation loop
    function animate() {
      time += 0.022;

      // 1. Calculate autonomous target path when user is not moving mouse
      if (!userInteracting) {
        // Harmonious multi-frequency orbit weaving around the center and sides
        const rx = width * 0.42;
        const ry = height * 0.38;
        targetX = width * 0.5 + Math.sin(time * 0.8) * rx + Math.cos(time * 1.6) * (rx * 0.25);
        targetY = height * 0.45 + Math.cos(time * 0.6) * ry + Math.sin(time * 1.3) * (ry * 0.3);
      }

      // Smooth head rotation toward target with organic swimming sinewave
      const dx = targetX - headX;
      const dy = targetY - headY;
      const dist = Math.hypot(dx, dy);

      const targetAngle = Math.atan2(dy, dx);
      // Gentle angular lerp
      let diffAngle = targetAngle - headAngle;
      while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
      while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
      headAngle += diffAngle * 0.045;

      // Inject rhythmic serpentine undulating wave into head heading
      const undulatingOffset = Math.sin(time * 3.8) * 0.22;
      const currentMoveAngle = headAngle + undulatingOffset;

      const currentSpeed = userInteracting ? Math.min(speed * 1.35, dist * 0.04 + 1.8) : speed;
      headX += Math.cos(currentMoveAngle) * currentSpeed;
      headY += Math.sin(currentMoveAngle) * currentSpeed;

      // Update head point
      spine[0].x = headX;
      spine[0].y = headY;
      spine[0].angle = currentMoveAngle;

      // 2. Kinematic inverse constraints down the dragon spine
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = spine[i - 1];
        const curr = spine[i];
        const segDx = prev.x - curr.x;
        const segDy = prev.y - curr.y;
        const segAngle = Math.atan2(segDy, segDx);

        curr.angle = segAngle;
        curr.x = prev.x - Math.cos(segAngle) * SEG_LENGTH;
        curr.y = prev.y - Math.sin(segAngle) * SEG_LENGTH;
      }

      // 3. Update dragon whiskers (Râu rồng bồng bềnh)
      const whiskerBaseOffset = 14;
      const perpAngle = headAngle + Math.PI / 2;
      const leftBaseX = headX + Math.cos(perpAngle) * whiskerBaseOffset;
      const leftBaseY = headY + Math.sin(perpAngle) * whiskerBaseOffset;
      const rightBaseX = headX - Math.cos(perpAngle) * whiskerBaseOffset;
      const rightBaseY = headY - Math.sin(perpAngle) * whiskerBaseOffset;

      leftWhisker[0].x = leftBaseX;
      leftWhisker[0].y = leftBaseY;
      rightWhisker[0].x = rightBaseX;
      rightWhisker[0].y = rightBaseY;

      const WHISKER_SEG_LEN = 9;
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        // Left whisker
        const pL = leftWhisker[i - 1];
        const cL = leftWhisker[i];
        const aL = Math.atan2(pL.y - cL.y, pL.x - cL.x);
        cL.x = pL.x - Math.cos(aL) * WHISKER_SEG_LEN + Math.sin(time * 4 + i) * 1.2;
        cL.y = pL.y - Math.sin(aL) * WHISKER_SEG_LEN + Math.cos(time * 4 + i) * 1.2;

        // Right whisker
        const pR = rightWhisker[i - 1];
        const cR = rightWhisker[i];
        const aR = Math.atan2(pR.y - cR.y, pR.x - cR.x);
        cR.x = pR.x - Math.cos(aR) * WHISKER_SEG_LEN + Math.sin(time * 4 + i + 1) * 1.2;
        cR.y = pR.y - Math.sin(aR) * WHISKER_SEG_LEN + Math.cos(time * 4 + i + 1) * 1.2;
      }

      // 4. Emit stardust trail particles from the dragon's body
      if (Math.random() < 0.45) {
        const randSegIdx = Math.floor(Math.random() * 20) + 1;
        const seg = spine[randSegIdx];
        particles.push({
          x: seg.x + (Math.random() - 0.5) * 16,
          y: seg.y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.3,
          size: Math.random() * 2.5 + 1,
          alpha: 0.9,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        });
      }

      // CLEAR CANVAS
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // DRAW NEON PARTICLES TRAIL
      // ==========================================
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ==========================================
      // DRAW ASIAN DRAGON BODY (RỒNG PHƯƠNG ĐÔNG)
      // ==========================================
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 1. Draw dorsal fins / spines (Vây lưng rồng)
      for (let i = 2; i < NUM_SEGMENTS - 3; i += 2) {
        const seg = spine[i];
        const normal = seg.angle + Math.PI / 2;
        const finLen = Math.sin((i / NUM_SEGMENTS) * Math.PI) * 14 + 4;

        ctx.strokeStyle = i % 4 === 0 ? "rgba(251, 191, 36, 0.75)" : "rgba(56, 189, 248, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(
          seg.x + Math.cos(normal) * finLen,
          seg.y + Math.sin(normal) * finLen
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(
          seg.x - Math.cos(normal) * finLen,
          seg.y - Math.sin(normal) * finLen
        );
        ctx.stroke();
      }

      // 2. Draw 4 Claws/Talons (Móng vuốt rồng - 2 trước, 2 sau)
      const legPositions = [11, 28];
      legPositions.forEach((pos, idx) => {
        const seg = spine[pos];
        const sideOffset = idx === 0 ? 1 : -1;
        const legBaseAngle = seg.angle + (Math.PI / 2) * sideOffset;

        // Left & Right claw
        [-1, 1].forEach((dir) => {
          const lAngle = seg.angle + (Math.PI * 0.55 * dir);
          const kneeX = seg.x + Math.cos(lAngle) * 22;
          const kneeY = seg.y + Math.sin(lAngle) * 22;
          const clawX = kneeX + Math.cos(lAngle + 0.4 * dir) * 16;
          const clawY = kneeY + Math.sin(lAngle + 0.4 * dir) * 16;

          ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
          ctx.lineWidth = 2.2;
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 10;

          // Leg segment
          ctx.beginPath();
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(clawX, clawY);
          ctx.stroke();

          // 3 Talons (3 móng vuốt)
          for (let t = -1; t <= 1; t++) {
            const talonAngle = lAngle + (t * 0.4);
            ctx.beginPath();
            ctx.moveTo(clawX, clawY);
            ctx.lineTo(
              clawX + Math.cos(talonAngle) * 7,
              clawY + Math.sin(talonAngle) * 7
            );
            ctx.stroke();
          }
        });
      });

      // 3. Draw main glowing serpentine spine (Thân chính uốn lượn)
      for (let i = NUM_SEGMENTS - 1; i > 0; i--) {
        const seg = spine[i];
        const nextSeg = spine[i - 1];

        // Body width: tapered at neck, thickest at mid-belly, pointed at tail
        const progress = i / NUM_SEGMENTS;
        const bodyThickness = Math.sin(progress * Math.PI) * 9 + 3;

        // Gradient color along body: Cyan head -> Gold midbody -> Magenta/Fire tail
        const strokeColor =
          progress < 0.35
            ? "rgba(56, 189, 248, 0.95)" // Neon Cyan
            : progress < 0.75
            ? "rgba(251, 191, 36, 0.95)" // Gold Amber
            : "rgba(244, 63, 94, 0.95)"; // Neon Rose Flame

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = bodyThickness;
        ctx.shadowColor = progress < 0.5 ? "#38bdf8" : "#fbbf24";
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(nextSeg.x, nextSeg.y);
        ctx.stroke();

        // Inner glowing core
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(1, bodyThickness * 0.35);
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(nextSeg.x, nextSeg.y);
        ctx.stroke();
      }

      // 4. Draw Tail Tuft Flame (Đuôi lửa rồng)
      const tail = spine[NUM_SEGMENTS - 1];
      const tailAngle = tail.angle + Math.PI;
      ctx.strokeStyle = "#f43f5e";
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.2;
      for (let f = -2; f <= 2; f++) {
        const fAngle = tailAngle + f * 0.35 + Math.sin(time * 5 + f) * 0.2;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(
          tail.x + Math.cos(fAngle) * (20 - Math.abs(f) * 4),
          tail.y + Math.sin(fAngle) * (20 - Math.abs(f) * 4)
        );
        ctx.stroke();
      }

      // 5. Draw Dragon Head (Đầu rồng)
      const head = spine[0];
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(head.angle);

      // Dragon Antlers / Horns (Sừng rồng châu Á)
      ctx.strokeStyle = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.4;

      // Left horn
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(-24, -18);
      ctx.lineTo(-32, -14);
      ctx.moveTo(-18, -14);
      ctx.lineTo(-26, -26);
      ctx.stroke();

      // Right horn
      ctx.beginPath();
      ctx.moveTo(-6, 6);
      ctx.lineTo(-24, 18);
      ctx.lineTo(-32, 14);
      ctx.moveTo(-18, 14);
      ctx.lineTo(-26, 26);
      ctx.stroke();

      // Dragon Head Silhouette (Khung đầu rồng)
      ctx.fillStyle = "rgba(13, 20, 36, 0.9)";
      ctx.strokeStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 2.6;

      ctx.beginPath();
      ctx.moveTo(16, 0); // Snout
      ctx.lineTo(8, -8);
      ctx.lineTo(-8, -10);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 10);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Eyes (Mắt rồng ngọc phát sáng)
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(2, -5, 2.8, 0, Math.PI * 2);
      ctx.arc(2, 5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Draw Whiskers (Râu rồng uốn lượn tự do)
      ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.6;

      // Left whisker path
      ctx.beginPath();
      ctx.moveTo(leftWhisker[0].x, leftWhisker[0].y);
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        ctx.lineTo(leftWhisker[i].x, leftWhisker[i].y);
      }
      ctx.stroke();

      // Right whisker path
      ctx.beginPath();
      ctx.moveTo(rightWhisker[0].x, rightWhisker[0].y);
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        ctx.lineTo(rightWhisker[i].x, rightWhisker[i].y);
      }
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    // Pause animation when tab is inactive to save battery & CPU
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(animate);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (userTimeout) clearTimeout(userTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neon-dragon-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2, // Sits above scenic stars but below interactive UI
      }}
    />
  );
}
