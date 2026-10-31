"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { getLenis, onIntroDone } from "@/lib/motion";

type DistortMat = React.ComponentRef<typeof MeshDistortMaterial>;

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<DistortMat>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const energy = useRef(0); // rises with pointer speed, decays over time
  const hovered = useRef(false);
  const intro = useRef(0);

  useEffect(() => {
    const off = onIntroDone(() => (intro.current = 1));
    const move = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      const speed = Math.hypot(x - pointer.current.x, y - pointer.current.y);
      energy.current = Math.min(energy.current + speed * 4, 1.2);
      pointer.current.x = x;
      pointer.current.y = y;
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
    const e = energy.current;
    const hover = hovered.current ? 1 : 0;
    const { x: px, y: py } = pointer.current;

    energy.current = lerp(e, 0, 0.04);

    // Spin faster when excited, and lean toward the pointer
    m.rotation.x += dt * (0.12 + e * 1.2) + velocity * 0.0008;
    m.rotation.y += dt * (0.18 + e * 1.6);
    m.rotation.z = lerp(m.rotation.z, -px * 0.5, 0.08);

    m.position.x = lerp(m.position.x, (mobile ? 0 : 1.1) + px * 1.0, 0.09);
    m.position.y = lerp(m.position.y, 0.2 + py * 0.65 + scroll * 1.6, 0.09);

    const target = intro.current * (mobile ? 0.8 : 1) * (1 + scroll * 0.6 + hover * 0.12 + e * 0.08);
    m.scale.setScalar(lerp(m.scale.x, target, intro.current ? 0.08 : 0.2));

    mat.current.distort = lerp(mat.current.distort, 0.36 + e * 0.26 + hover * 0.18 + velocity * 0.006, 0.12);
    mat.current.time += dt * e * 3; // extra wobble speed on top of the base animation
  });

  return (
    <mesh
      ref={mesh}
      scale={0}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
      onPointerDown={() => (energy.current = 1.5)}
    >
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
