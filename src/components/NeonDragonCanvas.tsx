"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  angle: number;
}

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  isSmoke: boolean;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
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

    // Number of spine segments for a long, supple Eastern Dragon
    const NUM_SEGMENTS = 52;
    const SEG_LENGTH = 13;

    // Initialize spine
    const spine: Point[] = [];
    const cx = width * 0.45;
    const cy = height * 0.35;
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      spine.push({ x: cx - i * SEG_LENGTH, y: cy, angle: 0 });
    }

    // Whiskers (2 râu rồng dài mềm mại - 9 joints each)
    const NUM_WHISKER_JOINTS = 10;
    const leftWhisker: Point[] = [];
    const rightWhisker: Point[] = [];
    for (let i = 0; i < NUM_WHISKER_JOINTS; i++) {
      leftWhisker.push({ x: cx, y: cy, angle: 0 });
      rightWhisker.push({ x: cx, y: cy, angle: 0 });
    }

    // Flight AI Parameters (Autonomous Roaming)
    let headX = cx;
    let headY = cy;
    let headAngle = -0.4;
    let speed = 2.4;
    let time = 0;

    // Autonomous Waypoints
    let targetX = width * 0.7;
    let targetY = height * 0.3;
    let waypointTimer = 0;

    function pickNewWaypoint() {
      // Pick dynamic scenic paths across the viewport
      const padding = 100;
      targetX = padding + Math.random() * (width - padding * 2);
      targetY = padding + Math.random() * (height * 0.8 - padding);
    }
    pickNewWaypoint();

    // Gentle cursor parallax
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    function handleMouseMove(e: MouseEvent) {
      const offsetX = (e.clientX - width / 2) * 0.04;
      const offsetY = (e.clientY - height / 2) * 0.04;
      mouseParallaxX += (offsetX - mouseParallaxX) * 0.1;
      mouseParallaxY += (offsetY - mouseParallaxY) * 0.1;
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ========================================================
    // PERIODIC FLAME BREATHING STATE MACHINE (Phun lửa định kỳ)
    // ========================================================
    type DragonState = "roaming" | "charging" | "breathing" | "recovering";
    let dragonState: DragonState = "roaming";
    let stateTimer = 8; // First breath after 8 seconds
    let mouthOpen = 0; // 0 (closed) to 1 (wide open)
    let throatGlow = 0; // 0 to 1

    const flameParticles: FlameParticle[] = [];
    const ambientEmbers: EmberParticle[] = [];

    const FLAME_COLORS = ["#ffffff", "#fef08a", "#fbbf24", "#f97316", "#ef4444", "#dc2626"];
    const EMBER_COLORS = ["#ff2244", "#fbbf24", "#f43f5e", "#ea580c"];

    // Main animation loop
    function animate() {
      time += 0.02;
      waypointTimer += 0.016;

      // Waypoint reassignment
      if (waypointTimer > 5.5 || Math.hypot(targetX - headX, targetY - headY) < 120) {
        pickNewWaypoint();
        waypointTimer = 0;
      }

      // ========================================================
      // STATE MACHINE UPDATE
      // ========================================================
      stateTimer -= 0.016;
      if (dragonState === "roaming" && stateTimer <= 0) {
        dragonState = "charging";
        stateTimer = 1.3; // 1.3s charging
      } else if (dragonState === "charging") {
        throatGlow = Math.min(1, throatGlow + 0.04);
        mouthOpen = Math.min(0.65, mouthOpen + 0.03);
        if (stateTimer <= 0) {
          dragonState = "breathing";
          stateTimer = 2.8; // 2.8s flame breath
        }
      } else if (dragonState === "breathing") {
        mouthOpen = 1;
        throatGlow = 1;

        // Emit torrent of flame & smoke particles from mouth
        const snoutDist = 28;
        const mouthX = headX + Math.cos(headAngle) * snoutDist;
        const mouthY = headY + Math.sin(headAngle) * snoutDist;

        // Flame sparks
        for (let i = 0; i < 4; i++) {
          const spraySpread = (Math.random() - 0.5) * 0.42;
          const sprayAngle = headAngle + spraySpread;
          const flameSpeed = Math.random() * 7 + 5;
          flameParticles.push({
            x: mouthX,
            y: mouthY,
            vx: Math.cos(sprayAngle) * flameSpeed,
            vy: Math.sin(sprayAngle) * flameSpeed,
            size: Math.random() * 7 + 4,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.022,
            color: FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)],
            isSmoke: false,
          });
        }

        // Dark Crimson Smoke puffs
        if (Math.random() < 0.6) {
          const smokeAngle = headAngle + (Math.random() - 0.5) * 0.6;
          const smokeSpeed = Math.random() * 3 + 2;
          flameParticles.push({
            x: mouthX,
            y: mouthY,
            vx: Math.cos(smokeAngle) * smokeSpeed,
            vy: Math.sin(smokeAngle) * smokeSpeed - 0.5,
            size: Math.random() * 16 + 10,
            alpha: 0.45,
            decay: 0.012,
            color: "rgba(185, 28, 28, 0.35)",
            isSmoke: true,
          });
        }

        if (stateTimer <= 0) {
          dragonState = "recovering";
          stateTimer = 1.0;
        }
      } else if (dragonState === "recovering") {
        mouthOpen = Math.max(0, mouthOpen - 0.04);
        throatGlow = Math.max(0, throatGlow - 0.04);
        if (stateTimer <= 0) {
          dragonState = "roaming";
          mouthOpen = 0;
          throatGlow = 0;
          stateTimer = 14 + Math.random() * 6; // Next breath in 14-20 seconds
        }
      }

      // ========================================================
      // AUTONOMOUS FLIGHT HEADING & SERPENTINE MOTION
      // ========================================================
      const effectiveTargetX = targetX + mouseParallaxX;
      const effectiveTargetY = targetY + mouseParallaxY;

      const dx = effectiveTargetX - headX;
      const dy = effectiveTargetY - headY;
      const targetAngle = Math.atan2(dy, dx);

      let diffAngle = targetAngle - headAngle;
      while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
      while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;

      // Turning rate: slower during charging/breathing for majestic poise
      const turnRate = dragonState === "breathing" ? 0.018 : dragonState === "charging" ? 0.025 : 0.038;
      headAngle += diffAngle * turnRate;

      // Continuous undulating sine wave traveling down the spine
      const undulation = Math.sin(time * 3.4) * 0.22;
      const moveAngle = headAngle + undulation;

      const currentSpeed = dragonState === "breathing" ? speed * 0.75 : dragonState === "charging" ? speed * 0.85 : speed;
      headX += Math.cos(moveAngle) * currentSpeed;
      headY += Math.sin(moveAngle) * currentSpeed;

      // Head spine joint
      spine[0].x = headX;
      spine[0].y = headY;
      spine[0].angle = moveAngle;

      // Propagate down the spine with inverse kinematics
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

      // Update Whiskers (Râu rồng uốn lượn phấp phới)
      const whiskerBaseOffset = 15;
      const perp = headAngle + Math.PI / 2;
      leftWhisker[0].x = headX + Math.cos(perp) * whiskerBaseOffset;
      leftWhisker[0].y = headY + Math.sin(perp) * whiskerBaseOffset;
      rightWhisker[0].x = headX - Math.cos(perp) * whiskerBaseOffset;
      rightWhisker[0].y = headY - Math.sin(perp) * whiskerBaseOffset;

      const WHISKER_SEG_LEN = 11;
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        // Left whisker
        const pL = leftWhisker[i - 1];
        const cL = leftWhisker[i];
        const aL = Math.atan2(pL.y - cL.y, pL.x - cL.x);
        cL.x = pL.x - Math.cos(aL) * WHISKER_SEG_LEN + Math.sin(time * 3.6 + i * 0.8) * 1.6;
        cL.y = pL.y - Math.sin(aL) * WHISKER_SEG_LEN + Math.cos(time * 3.6 + i * 0.8) * 1.6;

        // Right whisker
        const pR = rightWhisker[i - 1];
        const cR = rightWhisker[i];
        const aR = Math.atan2(pR.y - cR.y, pR.x - cR.x);
        cR.x = pR.x - Math.cos(aR) * WHISKER_SEG_LEN + Math.sin(time * 3.6 + i * 0.8 + 1.2) * 1.6;
        cR.y = pR.y - Math.sin(aR) * WHISKER_SEG_LEN + Math.cos(time * 3.6 + i * 0.8 + 1.2) * 1.6;
      }

      // Ambient Embers (Tàn lửa rơi dọc thân rồng)
      if (Math.random() < 0.4) {
        const segIdx = Math.floor(Math.random() * (NUM_SEGMENTS - 4)) + 2;
        const s = spine[segIdx];
        ambientEmbers.push({
          x: s.x + (Math.random() - 0.5) * 20,
          y: s.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 0.8 - 0.4,
          size: Math.random() * 3 + 1.2,
          alpha: 0.9,
          decay: Math.random() * 0.015 + 0.01,
          color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
        });
      }

      // ========================================================
      // RENDER CANVAS
      // ========================================================
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Ambient Embers
      for (let i = ambientEmbers.length - 1; i >= 0; i--) {
        const p = ambientEmbers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          ambientEmbers.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Flame Particles (Breath of Fire)
      for (let i = flameParticles.length - 1; i >= 0; i--) {
        const p = flameParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 1.018; // Expands outward
        if (p.alpha <= 0) {
          flameParticles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.isSmoke ? "rgba(185, 28, 28, 0.4)" : "#ff1744";
        ctx.shadowBlur = p.isSmoke ? 8 : 16;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ========================================================
      // 3. DRAW CRIMSON NEON DRAGON (Mô phỏng bám sát Ảnh 1)
      // ========================================================
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 3A. Saw-tooth Dorsal Spines (Vây gai lưng dạng ngọn lửa)
      for (let i = 2; i < NUM_SEGMENTS - 3; i++) {
        const seg = spine[i];
        const normal = seg.angle + Math.PI / 2;
        const progress = i / NUM_SEGMENTS;
        const spineLength = (Math.sin(progress * Math.PI) * 16 + 5) * 1.1;

        ctx.strokeStyle = "rgba(255, 30, 66, 0.85)";
        ctx.shadowColor = "#ff1744";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.0;

        // Draw flame-like jagged spine on the back
        const tipX = seg.x + Math.cos(normal) * spineLength;
        const tipY = seg.y + Math.sin(normal) * spineLength;
        const backX = seg.x - Math.cos(seg.angle) * 8;
        const backY = seg.y - Math.sin(seg.angle) * 8;

        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(backX, backY);
        ctx.stroke();
      }

      // 3B. 4 Sharp Talons / Claws (4 Chân móng vuốt uyển chuyển)
      const clawIndices = [13, 31];
      clawIndices.forEach((pos, idx) => {
        const seg = spine[pos];
        const isForeClaw = idx === 0;

        [-1, 1].forEach((side) => {
          const legAngle = seg.angle + Math.PI * 0.52 * side;
          const legLen1 = isForeClaw ? 26 : 24;
          const kneeX = seg.x + Math.cos(legAngle) * legLen1;
          const kneeY = seg.y + Math.sin(legAngle) * legLen1;

          const footAngle = legAngle + 0.35 * side;
          const footLen = 18;
          const footX = kneeX + Math.cos(footAngle) * footLen;
          const footY = kneeY + Math.sin(footAngle) * footLen;

          // Leg bones
          ctx.strokeStyle = "rgba(255, 30, 66, 0.95)";
          ctx.shadowColor = "#ff1744";
          ctx.shadowBlur = 14;
          ctx.lineWidth = 2.6;

          ctx.beginPath();
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // 4 Sharp Talons with gold/amber tips
          for (let t = -1.5; t <= 1.5; t += 1) {
            const talonA = footAngle + t * 0.38;
            const talonLen = 10;
            ctx.strokeStyle = "#ffe4e6";
            ctx.shadowColor = "#ff1744";
            ctx.shadowBlur = 10;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(footX, footY);
            ctx.lineTo(
              footX + Math.cos(talonA) * talonLen,
              footY + Math.sin(talonA) * talonLen
            );
            ctx.stroke();
          }
        });
      });

      // 3C. Main Serpentine Body Outline & Ribbed Belly Scales (Vảy bụng dạng sọc)
      for (let i = NUM_SEGMENTS - 1; i > 0; i--) {
        const seg = spine[i];
        const next = spine[i - 1];

        const progress = i / NUM_SEGMENTS;
        const thickness = Math.sin(progress * Math.PI) * 11 + 3.2;

        // Outer Crimson Neon Glow
        ctx.strokeStyle = "rgba(255, 23, 68, 0.95)";
        ctx.shadowColor = "#ff1744";
        ctx.shadowBlur = 18;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();

        // Inner Hot Pink / White Light Core
        ctx.strokeStyle = progress < 0.2 ? "#ffffff" : "#ffe4e6";
        ctx.shadowColor = "#ff4d6d";
        ctx.shadowBlur = 8;
        ctx.lineWidth = Math.max(1.2, thickness * 0.35);
        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();

        // Transverse Ventral Belly Ribs (Vảy bụng sọc như ảnh 1)
        if (i % 2 === 0 && i > 4 && i < NUM_SEGMENTS - 4) {
          const ribAngle = seg.angle - Math.PI / 2;
          const ribWidth = thickness * 0.85;
          ctx.strokeStyle = "rgba(254, 202, 202, 0.85)";
          ctx.lineWidth = 1.6;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(
            seg.x + Math.cos(ribAngle) * ribWidth,
            seg.y + Math.sin(ribAngle) * ribWidth
          );
          ctx.stroke();
        }
      }

      // 3D. Flowing Tail Flame Tuft (Đuôi lửa rực rỡ)
      const tail = spine[NUM_SEGMENTS - 1];
      const tailBaseAngle = tail.angle + Math.PI;
      ctx.strokeStyle = "#ff1744";
      ctx.shadowColor = "#ff1744";
      ctx.shadowBlur = 16;
      ctx.lineWidth = 2.4;

      for (let f = -3; f <= 3; f++) {
        const fAngle = tailBaseAngle + f * 0.3 + Math.sin(time * 4 + f) * 0.22;
        const fLen = 26 - Math.abs(f) * 4;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(
          tail.x + Math.cos(fAngle) * fLen,
          tail.y + Math.sin(fAngle) * fLen
        );
        ctx.stroke();
      }

      // 3E. Detailed Dragon Head & Jaws (Đầu rồng phương Đông chuẩn ảnh 1)
      const head = spine[0];
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(head.angle);

      // Throat Glow when charging or breathing
      if (throatGlow > 0.05) {
        ctx.save();
        ctx.fillStyle = `rgba(254, 240, 138, ${throatGlow * 0.9})`;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 28 * throatGlow;
        ctx.beginPath();
        ctx.arc(8, 0, 14 * throatGlow, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Branching Antlers / Horns (Sừng hươu kép phát quang)
      ctx.strokeStyle = "#ff2244";
      ctx.shadowColor = "#ff1744";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.6;

      // Upper Main Horns
      [-1, 1].forEach((dir) => {
        ctx.beginPath();
        ctx.moveTo(-4, -6 * dir);
        ctx.lineTo(-26, -20 * dir);
        ctx.lineTo(-38, -16 * dir);
        ctx.moveTo(-18, -15 * dir);
        ctx.lineTo(-30, -30 * dir); // branch
        ctx.moveTo(-28, -18 * dir);
        ctx.lineTo(-44, -26 * dir); // tip
        ctx.stroke();
      });

      // Flaming Mane (Bờm tóc lửa phía sau gáy)
      ctx.strokeStyle = "rgba(255, 77, 109, 0.9)";
      ctx.lineWidth = 2.0;
      for (let m = -3; m <= 3; m++) {
        const maneAngle = Math.PI - 0.2 * m + Math.sin(time * 3 + m) * 0.15;
        const maneLen = 28 - Math.abs(m) * 3;
        ctx.beginPath();
        ctx.moveTo(-8, m * 4);
        ctx.lineTo(-8 + Math.cos(maneAngle) * maneLen, m * 4 + Math.sin(maneAngle) * maneLen);
        ctx.stroke();
      }

      // Head Silhouette & Snout with Openable Lower Jaw (Há miệng phun lửa)
      const jawRotation = mouthOpen * 0.42;

      // Upper Snout & Head Crest
      ctx.fillStyle = "rgba(15, 6, 12, 0.95)";
      ctx.strokeStyle = "#ff1744";
      ctx.shadowColor = "#ff1744";
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2.8;

      ctx.beginPath();
      ctx.moveTo(22, -4); // Upper snout tip
      ctx.lineTo(12, -10);
      ctx.lineTo(-4, -12); // Eyebrow ridge
      ctx.lineTo(-14, -6);
      ctx.lineTo(-12, 0);
      ctx.lineTo(4, 0); // Upper palate
      ctx.lineTo(16, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower Jaw (Hàm dưới chuyển động theo jawRotation)
      ctx.save();
      ctx.rotate(jawRotation);
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(20, 2); // Lower jaw tip
      ctx.lineTo(10, 8);
      ctx.lineTo(-8, 6);
      ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Teeth & Fangs (Răng nanh rồng nhọn)
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(16, 4); // Upper Fang
      ctx.lineTo(18, 0);
      ctx.moveTo(12, 2);
      ctx.lineTo(14, -2); // Lower Fang
      ctx.lineTo(16, 2);
      ctx.stroke();
      ctx.restore(); // restore jaw

      // Glowing Eyes (Mắt rồng ngọc vàng/đỏ sắc sảo)
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, -6, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Eye Slit Pupil
      ctx.fillStyle = "#7f1d1d";
      ctx.beginPath();
      ctx.ellipse(0, -6, 1, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // restore head

      // 3F. Whiskers (Râu rồng uốn lượn mềm mại như dải lụa neon)
      ctx.strokeStyle = "rgba(255, 77, 109, 0.95)";
      ctx.shadowColor = "#ff1744";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.0;

      // Left whisker
      ctx.beginPath();
      ctx.moveTo(leftWhisker[0].x, leftWhisker[0].y);
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        ctx.lineTo(leftWhisker[i].x, leftWhisker[i].y);
      }
      ctx.stroke();

      // Right whisker
      ctx.beginPath();
      ctx.moveTo(rightWhisker[0].x, rightWhisker[0].y);
      for (let i = 1; i < NUM_WHISKER_JOINTS; i++) {
        ctx.lineTo(rightWhisker[i].x, rightWhisker[i].y);
      }
      ctx.stroke();

      ctx.restore(); // restore main

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    // Pause when tab is inactive to preserve system resources
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(animate);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
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
        zIndex: 2, // Sits above scenic cosmic background but below interactive UI
      }}
    />
  );
}
