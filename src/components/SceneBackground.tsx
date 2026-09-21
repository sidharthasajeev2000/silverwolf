import { useEffect, useRef } from 'react';

/**
 * Fixed cinematic depth background: neon haze, perspective grid, floating orbs.
 * Pointer + scroll parallax; disabled when prefers-reduced-motion.
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

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let scrollY = window.scrollY;

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetX = (e.clientX / w - 0.5) * 2;
      targetY = (e.clientY / h - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const sy = scrollY * 0.04;
      root.style.setProperty('--px', curX.toFixed(4));
      root.style.setProperty('--py', curY.toFixed(4));
      root.style.setProperty('--sy', sy.toFixed(2));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
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
