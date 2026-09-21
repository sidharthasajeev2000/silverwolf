import { useEffect, useRef } from 'react';

/**
 * Fixed cinematic depth background: neon haze, perspective grid, floating orbs.
 * Pointer/touch + scroll parallax, with a soft idle drift on phones.
 * Disabled when prefers-reduced-motion.
 */
export function SceneBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      root.dataset.static = '1';
      return;
    }

    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches;
    if (coarse) root.dataset.mobile = '1';

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let scrollY = window.scrollY;
    let lastInteract = 0;
    const start = performance.now();

    const setTargetFromClient = (clientX: number, clientY: number) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetX = (clientX / w - 0.5) * 2;
      targetY = (clientY / h - 0.5) * 2;
      lastInteract = performance.now();
    };

    const onPointer = (e: PointerEvent) => {
      setTargetFromClient(e.clientX, e.clientY);
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      setTargetFromClient(t.clientX, t.clientY);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const tick = (now: number) => {
      // Soft idle drift on phones when the finger is not moving
      if (coarse && now - lastInteract > 900) {
        const t = (now - start) / 1000;
        targetX = Math.sin(t * 0.35) * 0.55;
        targetY = Math.cos(t * 0.28) * 0.4;
      }

      const ease = coarse ? 0.1 : 0.06;
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;
      const sy = scrollY * (coarse ? 0.055 : 0.04);
      // Slightly stronger parallax on touch so motion is visible
      const amp = coarse ? 1.35 : 1;
      root.style.setProperty('--px', (curX * amp).toFixed(4));
      root.style.setProperty('--py', (curY * amp).toFixed(4));
      root.style.setProperty('--sy', sy.toFixed(2));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="scene-bg" ref={rootRef} aria-hidden="true">
      <div className="scene-bg__vignette" />
      <div className="scene-bg__glow scene-bg__glow--a" />
      <div className="scene-bg__glow scene-bg__glow--b" />
      <div className="scene-bg__glow scene-bg__glow--c" />
      <div className="scene-bg__grid-wrap">
        <div className="scene-bg__grid" />
      </div>
      <div className="scene-bg__orb scene-bg__orb--1" />
      <div className="scene-bg__orb scene-bg__orb--2" />
      <div className="scene-bg__orb scene-bg__orb--3" />
      <div className="scene-bg__dust" />
      <div className="scene-bg__scan" />
    </div>
  );
}
