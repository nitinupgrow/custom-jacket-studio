import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center, Environment, Lightformer, Bounds } from "@react-three/drei";
import * as THREE from "three";
import frontCut from "@/assets/jacket-front-cutout.png.asset.json";
import backCut from "@/assets/jacket-back-cutout.png.asset.json";
import defaultGlb from "@/assets/varsity-jacket-v2.glb.asset.json";

const H = 2.2; // jacket height in scene units
const DEPTH = 0.32; // chest bulge depth

/** Plane bent into a rounded shell so the jacket has real volume from any angle. */
function shell(w: number, h: number) {
  const g = new THREE.PlaneGeometry(w, h, 48, 48);
  const p = g.attributes['position'] as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const nx = (2 * p.getX(i)) / w;
    const ny = p.getY(i) / h + 0.5; // 0 bottom .. 1 top
    const across = Math.sqrt(Math.max(0, 1 - nx * nx));
    const vert = 0.75 + 0.25 * Math.sin(Math.PI * Math.min(1, ny * 1.1));
    p.setZ(i, DEPTH * across * vert);
  }
  g.computeVertexNormals();
  return g;
}

function ProceduralJacket() {
  const [f, b] = useTexture([frontCut.url, backCut.url]);
  const parts = useMemo(() => {
    return [f!, b!].map((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      const img = t.image as { width: number; height: number };
      return { tex: t, geo: shell((H * img.width) / img.height, H) };
    });
  }, [f, b]);
  return (
    <group>
      <mesh geometry={parts[0]!.geo}>
        <meshStandardMaterial map={parts[0]!.tex} alphaTest={0.5} roughness={0.85} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={parts[1]!.geo} rotation-y={Math.PI}>
        <meshStandardMaterial map={parts[1]!.tex} alphaTest={0.5} roughness={0.85} side={THREE.FrontSide} />
      </mesh>
    </group>
  );
}

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
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
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <directionalLight position={[-3, 3, -4]} intensity={0.9} />
        <Environment>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Suspense fallback={null}>{url ? <GlbModel url={url} /> : <ProceduralJacket />}</Suspense>
        <OrbitControls ref={controls} enableDamping enablePan={false} autoRotate={autoRotate} autoRotateSpeed={2.5} minDistance={1.8} maxDistance={9} />
        <ViewSync view={view} controls={controls} />
      </Canvas>
    </div>
  );
}
