import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { RotateCw, ZoomIn, Maximize, Hand, Upload, Box } from "lucide-react";

const ModelCanvas = lazy(() => import("./ModelCanvas"));

/** 3D viewer: built-in jacket model by default; customers/admins can load a GLB/GLTF to replace it. */
export function JacketViewer() {
  const wrap = useRef<HTMLDivElement>(null);
  const [glb, setGlb] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");
  const [spin, setSpin] = useState(true);
  const [zoomSignal, setZoomSignal] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fullscreen = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const tools = [
    { icon: RotateCw, label: "360°", on: () => setSpin((s) => !s), active: spin },
    { icon: ZoomIn, label: "Zoom", on: () => setZoomSignal((n) => n + 1), active: false },
    { icon: Maximize, label: "Full", on: fullscreen, active: false },
    { icon: Upload, label: "GLB", on: () => document.getElementById("glb-input")?.click(), active: !!glb },
  ];

  return (
    <div ref={wrap} className="bg-stage-gradient relative h-full w-full select-none overflow-hidden" style={{ touchAction: "none" }} onPointerDown={() => setSpin(false)}>
      {mounted ? (
        <Suspense fallback={<div className="grid h-full place-items-center text-stage-foreground">Loading 3D jacket…</div>}>
          <ModelCanvas url={glb} view={view} autoRotate={spin} zoomSignal={zoomSignal} />
        </Suspense>
      ) : (
        <div className="grid h-full place-items-center text-stage-foreground">Loading 3D jacket…</div>
      )}

      <div className="glass-chip absolute left-3 top-1/2 flex -translate-y-1/2 flex-col gap-3 rounded-2xl px-2 py-3 text-[10px] font-medium" onPointerDown={(e) => e.stopPropagation()}>
        {tools.map((t) => (
          <button key={t.label} onClick={t.on} className="flex flex-col items-center gap-1" aria-label={t.label}>
            <span className={`grid h-8 w-8 place-items-center rounded-full ${t.active ? "bg-background text-foreground" : ""}`}><t.icon className="h-4 w-4" /></span>
            {t.label}
          </button>
        ))}
      </div>
      <input id="glb-input" type="file" accept=".glb,.gltf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setGlb(URL.createObjectURL(f)); }} />

      <span className="glass-chip absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"><Box className="h-3.5 w-3.5" /> 3D View</span>

      <div className="absolute right-3 top-3 flex rounded-full border border-background/60 bg-stage/40 p-1 text-sm font-semibold backdrop-blur" onPointerDown={(e) => e.stopPropagation()}>
        {(["front", "back"] as const).map((v) => (
          <button key={v} onClick={() => { setSpin(false); setView(v); }} className={`rounded-full px-4 py-1.5 capitalize ${view === v ? "bg-background text-foreground" : "text-stage-foreground"}`}>{v}</button>
        ))}
      </div>

      <div className="glass-chip pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium">
        <Hand className="h-4 w-4" /> Drag to rotate any direction • Scroll / pinch to zoom
      </div>
    </div>
  );
}
