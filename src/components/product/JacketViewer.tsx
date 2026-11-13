import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Box, RotateCw, ZoomIn, Maximize, Hand, Upload } from "lucide-react";
import pair from "@/assets/jacket-pair.jpg.asset.json";
import front from "@/assets/jacket-front.png.asset.json";
import back from "@/assets/jacket-back.png.asset.json";

const ModelCanvas = lazy(() => import("./ModelCanvas"));

/** Set to a .glb/.gltf URL once the real jacket model is ready. */
export const JACKET_MODEL_URL: string | null = null;

type View = "both" | "front" | "back";

export function JacketViewer({ image }: { image?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(JACKET_MODEL_URL);
  const [view, setView] = useState<View>("both");
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(false);
  const [zoomSignal, setZoomSignal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const drag = useRef<{ x: number; r: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ d: number; z: number } | null>(null);
  useEffect(() => setMounted(true), []);

  // non-passive wheel zoom for image fallback
  useEffect(() => {
    const el = wrap.current;
    if (!el || modelUrl) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      setZoom((z) => Math.min(3, Math.max(1, z * Math.exp(-dy * 0.0015))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [modelUrl]);

  // 360 auto-spin in fallback
  useEffect(() => {
    if (!spin || modelUrl) return;
    let raf = 0;
    const tick = () => { setRot((r) => r + 2); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spin, modelUrl]);

  const norm = ((rot % 360) + 360) % 360;
  const showingBack = norm > 90 && norm < 270;
  const singleSrc = showingBack ? back.url : front.url;
  const fallbackSrc = image ?? (view === "both" && rot === 0 ? pair.url : singleSrc);
  // mirror correction so the swapped face isn't reversed
  const flipFix = showingBack ? 180 : 0;

  const setFace = (v: "front" | "back") => { setSpin(false); setView(v); setRot(v === "back" ? 180 : 0); };

  const onDown = (e: React.PointerEvent) => {
    if (modelUrl) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2) {
      const [a, b] = [...pinch.current.values()];
      pinchStart.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: zoom };
      drag.current = null;
    } else {
      setSpin(false);
      if (view === "both") setView("front");
      drag.current = { x: e.clientX, r: rot };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (modelUrl || !pinch.current.has(e.pointerId)) return;
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pinch.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      setZoom(Math.min(3, Math.max(1, (pinchStart.current.z * d) / pinchStart.current.d)));
    } else if (drag.current) {
      setRot(drag.current.r + (e.clientX - drag.current.x) * 0.6);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pinch.current.delete(e.pointerId);
    if (pinch.current.size < 2) pinchStart.current = null;
    if (drag.current) {
      drag.current = null;
      setRot((r) => Math.round(r / 180) * 180);
    }
  };

  const fullscreen = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setModelUrl(URL.createObjectURL(f));
  };

  const tools = [
    { icon: Box, label: "3D", on: () => document.getElementById("glb-input")?.click(), active: !!modelUrl },
    { icon: RotateCw, label: "360°", on: () => { if (view === "both") setView("front"); setSpin((s) => !s); }, active: spin },
    { icon: ZoomIn, label: "Zoom", on: () => (modelUrl ? setZoomSignal((n) => n + 1) : setZoom((z) => (z >= 2.5 ? 1 : z + 0.5))), active: zoom > 1 },
    { icon: Maximize, label: "Full", on: fullscreen, active: false },
  ];

  return (
    <div
      ref={wrap}
      className="bg-stage-gradient relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl"
      style={{ touchAction: "none" }}
    >
      {modelUrl && mounted ? (
        <Suspense fallback={<div className="grid h-full place-items-center text-stage-foreground">Loading 3D model…</div>}>
          <ModelCanvas url={modelUrl} view={view === "back" ? "back" : "front"} autoRotate={spin} zoomSignal={zoomSignal} />
        </Suspense>
      ) : (
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
          style={{ perspective: 1400 }}
        >
          <img
            src={fallbackSrc}
            alt={showingBack ? "Varsity jacket back view" : "Varsity jacket front view"}
            draggable={false}
            className="h-full w-full object-contain transition-transform duration-100"
            style={{ transform: `scale(${zoom}) rotateY(${rot + flipFix}deg)` }}
          />
          {view === "both" && rot === 0 && !image && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-stage-foreground">
              <div className="text-xl font-bold drop-shadow">360°</div>
              <RotateCw className="mx-auto h-6 w-10" />
            </div>
          )}
        </div>
      )}

      {/* left toolbar */}
      <div className="glass-chip absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-4 rounded-2xl px-2.5 py-3 text-[11px] font-medium">
        {tools.map((t) => (
          <button key={t.label} onClick={t.on} className="flex flex-col items-center gap-1" aria-label={t.label}>
            <span className={`grid h-8 w-8 place-items-center rounded-full ${t.active || t.label === "3D" ? "bg-background text-foreground" : ""}`}>
              <t.icon className="h-4 w-4" />
            </span>
            {t.label}
          </button>
        ))}
      </div>
      <input id="glb-input" type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" className="hidden" onChange={onFile} />

      {/* front/back */}
      <div className="absolute right-4 top-3 flex rounded-full border border-background/70 bg-stage/40 p-1 text-sm font-semibold backdrop-blur">
        {(["front", "back"] as const).map((v) => {
          const active = v === "back" ? showingBack || view === "back" : !showingBack && view !== "back";
          return (
            <button key={v} onClick={() => setFace(v)} className={`rounded-full px-4 py-1.5 capitalize ${active ? "bg-background text-foreground" : "text-stage-foreground"}`}>
              {v}
            </button>
          );
        })}
      </div>

      {/* fallback notice */}
      {!modelUrl && (
        <button
          onClick={() => document.getElementById("glb-input")?.click()}
          className="glass-chip absolute left-4 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium"
        >
          <Upload className="h-3.5 w-3.5" /> Image preview · 3D model not loaded
        </button>
      )}

      <div className="glass-chip absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium sm:text-sm">
        <Hand className="h-4 w-4" /> Drag to rotate • Scroll to zoom
      </div>
      <button onClick={fullscreen} aria-label="Fullscreen" className="glass-chip absolute bottom-3 right-4 grid h-10 w-10 place-items-center rounded-full border border-background/40">
        <Maximize className="h-4 w-4" />
      </button>
    </div>
  );
}
