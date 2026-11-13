import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment, Lightformer, ContactShadows, Bounds } from "@react-three/drei";

function Model({ url }: { url: string }) {
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

export default function ModelCanvas({ url, view, autoRotate, zoomSignal }: { url: string; view: "front" | "back"; autoRotate: boolean; zoomSignal: number }) {
  const controls = useRef<any>(null);
  useEffect(() => {
    if (!zoomSignal || !controls.current) return;
    const c = controls.current;
    const cam = c.object;
    cam.position.multiplyScalar(0.8);
    c.update();
  }, [zoomSignal]);
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 40 }} style={{ touchAction: "none" }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.5} blur={2.5} scale={6} />
      <OrbitControls ref={controls} enableDamping enablePan={false} autoRotate={autoRotate} autoRotateSpeed={2} minDistance={1} maxDistance={12} />
      <ViewSync view={view} controls={controls} />
    </Canvas>
  );
}
