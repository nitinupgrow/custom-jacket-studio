import { Suspense, createElement as h, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

/** Varsity-style text patch that covers the baked lettering on the model. */
function textTexture(text: string, w: number, h: number, arch: boolean) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  // Body-colour patch with soft edges to hide the baked lettering underneath.
  const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.5);
  g.addColorStop(0, "rgba(3,3,4,1)"); g.addColorStop(0.85, "rgba(3,3,4,1)"); g.addColorStop(1, "rgba(3,3,4,0)");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.textAlign = "center"; x.textBaseline = "middle";
  const fs = arch ? h * 0.4 : h * 0.42;
  x.font = `400 ${fs}px Graduate, "Rockwell", serif`;
  const draw = (ch: string, cx: number, cy: number, rot: number) => {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    // raised chenille: soft shadow, then white fill
    x.shadowColor = "rgba(0,0,0,0.85)"; x.shadowBlur = fs * 0.08; x.shadowOffsetY = fs * 0.04;
    x.fillStyle = "#f4f4f2"; x.fillText(ch, 0, 0);
    x.shadowColor = "transparent";
    x.lineWidth = fs * 0.07; x.lineJoin = "round"; x.strokeStyle = "#ecece8"; x.strokeText(ch, 0, 0);
    x.restore();
  };
  if (!arch) draw(text, w / 2, h / 2, 0);
  else {
    const R = w * 1.1, cy = h * 0.62 + R, span = 0.62;
    const chars = text.split("");
    chars.forEach((ch, i) => {
      const a = -span / 2 + (span * (i + 0.5)) / chars.length;
      draw(ch, w / 2 + Math.sin(a) * R, cy - Math.cos(a) * R, a);
    });
  }
  // fuzzy fleece grain on the letters
  const img = x.getImageData(0, 0, w, h); const d = img.data;
  for (let i = 0; i < d.length; i += 4) if (d[i]! > 120) { const n = (Math.random() - 0.5) * 40; d[i] = d[i]! + n; d[i + 1] = d[i + 1]! + n; d[i + 2] = d[i + 2]! + n; }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

const FRONT_TEXT = "KJ";
const BACK_TEXT = "KABIR";
import defaultGlb from "@/assets/varsity-jacket-v2.glb.asset.json";

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const clone = scene.clone(true);
    // Normalize: center at origin and scale so the largest side is ~2.2 units.
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2.2 / Math.max(size.x, size.y, size.z, 0.0001);
    clone.scale.setScalar(s);
    clone.position.sub(center.multiplyScalar(s));
    g.add(clone);
    clone.updateMatrixWorld(true);

    // Replace lettering: front chest "KJ", back "KABIR".
    const meshes: THREE.Mesh[] = [];
    clone.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh); });
    const ray = new THREE.Raycaster();
    const decals: THREE.Mesh[] = [];
    let cancelled = false;
    const place = (px: number, py: number, side: 1 | -1, size: THREE.Vector3, tex: THREE.Texture) => {
      ray.set(new THREE.Vector3(px, py, side * 5), new THREE.Vector3(0, 0, -side));
      const hit = ray.intersectObjects(meshes, false)[0];
      if (!hit) return;
      const orient = new THREE.Euler(0, side === 1 ? 0 : Math.PI, 0);
      const mesh = hit.object as THREE.Mesh;
      const geo = new DecalGeometry(mesh, hit.point, orient, size);
      const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 1, metalness: 0, depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
      const d = new THREE.Mesh(geo, mat);
      decals.push(d); g.add(d);
    };
    document.fonts.load('400 100px Graduate').catch(() => {}).then(() => {
      if (cancelled) return;
      place(0.37, 0.36, 1, new THREE.Vector3(0.6, 0.5, 0.3), textTexture(FRONT_TEXT, 600, 500, false));
      place(0, 0.5, -1, new THREE.Vector3(1.2, 0.75, 0.3), textTexture(BACK_TEXT, 1024, 640, true));
    });
    return () => {
      cancelled = true;
      decals.forEach((d) => { g.remove(d); d.geometry.dispose(); (d.material as THREE.MeshStandardMaterial).map?.dispose(); (d.material as THREE.Material).dispose(); });
      g.remove(clone);
    };
  }, [scene]);
  // createElement (not JSX) so dev source-tagging attrs never reach R3F objects.
  return h("group", { ref });
}

function ViewSync({ view, controls }: { view: "front" | "back"; controls: React.RefObject<any> }) {
  const { camera } = useThree();
  useEffect(() => {
    const c = controls.current;
    const r = camera.position.length();
    camera.position.set(0, 0, view === "front" ? r : -r);
    c?.target.set(0, 0, 0);
    c?.update();
  }, [view, camera, controls]);
  return null;
}

export default function ModelCanvas({ url, view, autoRotate, zoomSignal }: { url: string | null; view: "front" | "back"; autoRotate: boolean; zoomSignal: number }) {
  const controls = useRef<any>(null);
  useEffect(() => {
    if (!zoomSignal || !controls.current) return;
    const c = controls.current;
    c.object.position.multiplyScalar(0.8);
    c.update();
  }, [zoomSignal]);
  return (
    <div className="h-full w-full" data-scene-ready>
      <Canvas camera={{ position: [0, 0, 4.6], fov: 40 }} style={{ touchAction: "none" }} dpr={[1, 2]}>
        {h(Scene, { url, view, autoRotate, controls })}
      </Canvas>
    </div>
  );
}

// Built with createElement (no JSX) so dev-only source attributes are not applied to three.js objects.
function Scene({ url, view, autoRotate, controls }: { url: string | null; view: "front" | "back"; autoRotate: boolean; controls: React.RefObject<any> }) {
  return h(
    "group",
    null,
    h("ambientLight", { intensity: 0.9 }),
    h("directionalLight", { position: [3, 5, 4], intensity: 1.2 }),
    h("directionalLight", { position: [-3, 3, -4], intensity: 0.9 }),
    h(Environment, null,
      h(Lightformer, { intensity: 2, position: [0, 5, 0], scale: [10, 10, 1] }),
      h(Lightformer, { intensity: 1, position: [-5, 1, -1], "rotation-y": Math.PI / 2, scale: [20, 1, 1] } as any),
    ),
    h(Suspense, { fallback: null }, h(GlbModel, { url: url ?? defaultGlb.url })),
    h(OrbitControls as any, { ref: controls, enableDamping: true, enablePan: false, autoRotate, autoRotateSpeed: 2.5, minDistance: 1.8, maxDistance: 9 }),
    h(ViewSync, { view, controls }),
  );
}
