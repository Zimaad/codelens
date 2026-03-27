import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import createGlobe from "cobe";

interface PulseMarker {
  id: string;
  location: [number, number];
  delay: number;
}

interface GlobePulseProps {
  markers?: PulseMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5 },
];

export function GlobePulse({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  // Perf knobs:
  // - `visualScale` reduces visible size by 30% (matches your request).
  // - `internalRenderScale` reduces canvas internal resolution to cut CPU/GPU load.
  const visualScale = 0.6;
  const internalRenderScale = 0.75;
  const targetFps = 60;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const lastUpdateMsRef = useRef(0);
  const phiRef = useRef(0);

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: any | null = null;
    let animationId: number | undefined;
    let initInternalSize = 0;

    function init() {
      if (!canvasRef.current) return;
      const widthCss = canvasRef.current.offsetWidth;
      if (widthCss === 0) return;
      if (globe) return;

      const widthInternal = Math.max(240, Math.floor(widthCss * internalRenderScale));
      initInternalSize = widthInternal;

      // cobe renders into the given <canvas> using the provided width/height.
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        width: widthInternal,
        height: widthInternal,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        // Lower samples for smoother performance.
        mapSamples: 9000,
        mapBrightness: 10,
        baseColor: [0.5, 0.5, 0.5],
        markerColor: [0.2, 0.8, 0.9],
        glowColor: [0.05, 0.05, 0.05],
        markerElevation: 0,
        markers: markers.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
        arcs: [],
        arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      });

      function animate(now: number) {
        animationId = requestAnimationFrame(animate);
        // Cap update rate to reduce lag.
        const last = lastUpdateMsRef.current;
        const minDeltaMs = 1000 / targetFps;
        if (now - last < minDeltaMs) return;
        lastUpdateMsRef.current = now;

        if (!globe) return;

        if (!isPausedRef.current) phiRef.current += speed;
        globe.update({
          phi: phiRef.current + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
      }

      lastUpdateMsRef.current = performance.now();
      phiRef.current = 0;
      animate(lastUpdateMsRef.current);

      // Fade in quickly after init.
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }

    init();

    // Debounced re-init on resize (expensive to recreate, so avoid thrashing).
    let resizeTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!canvasRef.current) return;
        const widthCss = canvasRef.current.offsetWidth;
        if (widthCss === 0) return;

        const nextInternal = Math.max(240, Math.floor(widthCss * internalRenderScale));
        // Only recreate if it meaningfully changed.
        if (Math.abs(nextInternal - initInternalSize) < 24) return;

        if (globe) {
          globe.destroy?.();
          globe = null;
        }
        init();
      }, 180);
    });
    ro.observe(canvas);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy?.();
      if (resizeTimer) window.clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, [markers, speed]);

  return (
    <div
      className={`relative aspect-square select-none ${className}`}
      style={{ transform: `scale(${visualScale})`, transformOrigin: "center" }}
    >
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
          100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.6s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />

      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning (only supported in modern browsers)
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.5}s`,
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              background: "#33ccdd",
              borderRadius: "50%",
              boxShadow: "0 0 0 3px #111, 0 0 0 5px #33ccdd",
            }}
          />
        </div>
      ))}
    </div>
  );
}

