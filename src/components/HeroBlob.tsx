"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { getLenis, onIntroDone } from "@/lib/motion";

type DistortMat = THREE.MeshPhysicalMaterial & { distort: number };

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<DistortMat>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const intro = useRef(0);

  useEffect(() => {
    const off = onIntroDone(() => (intro.current = 1));
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => {
      off();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m || !mat.current) return;
    const lerp = THREE.MathUtils.lerp;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    const velocity = Math.min(Math.abs(getLenis()?.velocity ?? 0), 60);
    const mobile = state.size.width < 700;

    m.rotation.x += dt * 0.12 + velocity * 0.0008;
    m.rotation.y += dt * 0.18;
    m.position.x = lerp(m.position.x, (mobile ? 0 : 1.1) + pointer.current.x * 0.45, 0.04);
    m.position.y = lerp(m.position.y, 0.2 + pointer.current.y * 0.3 + scroll * 1.6, 0.06);

    const target = intro.current * (mobile ? 0.8 : 1) * (1 + scroll * 0.6);
    m.scale.setScalar(lerp(m.scale.x, target, intro.current ? 0.05 : 0.2));
    mat.current.distort = lerp(mat.current.distort, 0.38 + velocity * 0.006, 0.08);
  });

  return (
    <mesh ref={mesh} scale={0}>
      <icosahedronGeometry args={[1.35, 64]} />
      <MeshDistortMaterial
        ref={mat}
        color="#FF4A1C"
        roughness={0.18}
        metalness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.2}
        distort={0.38}
        speed={1.8}
      />
    </mesh>
  );
}

export default function HeroBlob() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-4, -2, 2]} intensity={40} color="#ffd9c9" />
      <pointLight position={[2, -3, -2]} intensity={25} color="#5B4BFF" />
      <Blob />
    </Canvas>
  );
}
