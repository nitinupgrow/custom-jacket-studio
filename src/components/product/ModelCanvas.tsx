import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment, Lightformer, Bounds } from "@react-three/drei";
import * as THREE from "three";
import defaultGlb from "@/assets/varsity-jacket-v2.glb.asset.json";

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const boundsRef = useRef<any>(null);
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const clone = scene.clone(true);
    g.add(clone);
    boundsRef.current?.refresh().clip().fit();
    return () => {
      g.remove(clone);
    };
  }, [scene]);
  return (
    <Bounds ref={boundsRef} fit clip observe margin={1.2}>
      <Center>
        <group ref={ref} />
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
        <Suspense fallback={null}><GlbModel url={url ?? defaultGlb.url} /></Suspense>
        <OrbitControls ref={controls} enableDamping enablePan={false} autoRotate={autoRotate} autoRotateSpeed={2.5} minDistance={1.8} maxDistance={9} />
        <ViewSync view={view} controls={controls} />
      </Canvas>
    </div>
  );
}
