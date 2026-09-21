import { useEffect, useRef } from 'react';

const GLYPHS = 'SILVERWOLF3DPRINT·COS·PROP·STL·';

type Node = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ch: string;
};

/**
 * Neon-red letter cloth — spring mesh that stretches under pointer/touch
 * (inspired by curtain/weave demos). Fixed behind content; respects reduced-motion.
 */
export function ClothField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches;

    let raf = 0;
    let nodes: Node[] = [];
    let cols = 0;
    let rows = 0;
    let gapX = 0;
    let gapY = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pointer = { x: -9999, y: -9999, active: false };
    let lastTouch = 0;

    const stiffness = 0.085; // return to grid
    const damping = 0.86;
    const neighbor = 0.028;
    const influence = coarse ? 130 : 110;
    const force = coarse ? 28 : 34;

    function rebuild() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      gapX = coarse ? 28 : 24;
      gapY = coarse ? 32 : 28;
      const padX = w * 0.06;
      const padY = h * 0.12;
      cols = Math.max(8, Math.floor((w - padX * 2) / gapX));
      rows = Math.max(6, Math.floor((h - padY * 2) / gapY));
      const startX = (w - (cols - 1) * gapX) / 2;
      const startY = (h - (rows - 1) * gapY) / 2;

      nodes = [];
      let gi = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = startX + c * gapX;
          const oy = startY + r * gapY;
          nodes.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            ch: GLYPHS[gi++ % GLYPHS.length]!,
          });
        }
      }
    }

    rebuild();

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
      pointer.active = true;
      lastTouch = performance.now();
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onResize = () => rebuild();

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', onResize);

    function step() {
      if (reduce.matches) {
        // Static draw once-ish via raf still for resize
        drawStatic();
        raf = requestAnimationFrame(step);
        return;
      }

      // Soft idle wand on phones
      if (coarse && performance.now() - lastTouch > 1200) {
        const t = performance.now() / 1000;
        pointer.x = w * (0.5 + Math.sin(t * 0.5) * 0.28);
        pointer.y = h * (0.42 + Math.cos(t * 0.4) * 0.18);
        pointer.active = true;
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        // spring home
        n.vx += (n.ox - n.x) * stiffness;
        n.vy += (n.oy - n.y) * stiffness;

        // neighbor springs (right + down) for cloth
        if ((i % cols) < cols - 1) {
          const right = nodes[i + 1]!;
          const dx = right.x - n.x;
          const dy = right.y - n.y;
          const dist = Math.hypot(dx, dy) || 1;
          const rest = gapX;
          const f = (dist - rest) * neighbor;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          n.vx += fx;
          n.vy += fy;
          right.vx -= fx;
          right.vy -= fy;
        }
        if (i + cols < nodes.length) {
          const down = nodes[i + cols]!;
          const dx = down.x - n.x;
          const dy = down.y - n.y;
          const dist = Math.hypot(dx, dy) || 1;
          const rest = gapY;
          const f = (dist - rest) * neighbor;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          n.vx += fx;
          n.vy += fy;
          down.vx -= fx;
          down.vy -= fy;
        }

        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const r = influence;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 0.001;
            const fall = 1 - d / r;
            const push = force * fall * fall;
            n.vx += (dx / d) * push * 0.08;
            n.vy += (dy / d) * push * 0.08;
            // slight grab toward cursor for elastic "pluck"
            n.vx += ((pointer.x - n.x) / d) * push * 0.02;
            n.vy += ((pointer.y - n.y) / d) * push * 0.02;
          }
        }

        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      }

      draw();
      raf = requestAnimationFrame(step);
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.font = `600 ${coarse ? 11 : 12}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillStyle = 'rgba(255, 26, 26, 0.55)';
      for (const n of nodes) {
        ctx!.fillText(n.ch, n.ox, n.oy);
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      // faint link lines for weave
      ctx!.strokeStyle = 'rgba(255, 26, 26, 0.08)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        if ((i % cols) < cols - 1) {
          const right = nodes[i + 1]!;
          ctx!.moveTo(n.x, n.y);
          ctx!.lineTo(right.x, right.y);
        }
        if (i + cols < nodes.length) {
          const down = nodes[i + cols]!;
          ctx!.moveTo(n.x, n.y);
          ctx!.lineTo(down.x, down.y);
        }
      }
      ctx!.stroke();

      const size = coarse ? 11 : 12;
      ctx!.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.shadowColor = 'rgba(255, 26, 26, 0.85)';
      ctx!.shadowBlur = 12;
      ctx!.fillStyle = '#ff1a1a';
      for (const n of nodes) {
        ctx!.fillText(n.ch, n.x, n.y);
      }
      ctx!.shadowBlur = 0;
    }

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas className="cloth-field" ref={canvasRef} aria-hidden="true" />;
}
