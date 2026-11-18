"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroRadarFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-45"
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 65% 45%, black 15%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 65% 45%, black 15%, transparent 80%)",
        }}
      />
    </div>
  );
}

function MetroManilaMatrixScene({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const pulse3Ref = useRef<THREE.Mesh>(null);
  const rigRef = useRef<THREE.Group>(null);

  const blocks = useMemo(() => {
    const items: { x: number; z: number; h: number; w: number; d: number }[] = [];
    const cols = 11;
    const rows = 8;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - (cols - 1) / 2) * 1.45;
        const z = (j - (rows - 1) / 2) * 1.45;
        const dist = Math.hypot(x, z);
        if (dist < 1.35 || (Math.abs(x) < 0.5 && Math.abs(z) < 4)) continue;
        const seed = Math.abs(Math.sin(i * 12.9898 + j * 78.233)) * 1000;
        const frac = seed - Math.floor(seed);
        const h = 0.12 + frac * (dist < 4.2 ? 0.65 : 0.35);
        items.push({
          x,
          z,
          h,
          w: 0.72 + frac * 0.35,
          d: 0.72 + (1 - frac) * 0.35,
        });
      }
    }
    return items;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    blocks.forEach((b, idx) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    const targetX = pointerRef.current.x * 0.9;
    const targetY = 5.4 - pointerRef.current.y * 0.45;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.045);
    camera.lookAt(0, 0, 0);

    const rings = [
      { mesh: pulse1Ref.current, offset: 0 },
      { mesh: pulse2Ref.current, offset: 0.33 },
      { mesh: pulse3Ref.current, offset: 0.66 },
    ];
    rings.forEach(({ mesh, offset }) => {
      if (!mesh) return;
      const phase = (t * 0.28 + offset) % 1;
      const scale = 0.6 + phase * 8.5;
      mesh.scale.set(scale, scale, 1);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - phase) * 0.32;
    });

    if (rigRef.current) {
      rigRef.current.rotation.y = Math.sin(t * 0.08) * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[6, 10, 4]} intensity={0.65} color="#ffffff" />

      <group ref={rigRef} position={[1.6, -0.4, 0]}>
        <gridHelper args={[24, 24, "#CBD5E1", "#E2E8F0"]} position={[0, 0, 0]} />

        <instancedMesh ref={meshRef} args={[undefined, undefined, blocks.length]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#E2E8F0"
            roughness={0.85}
            metalness={0.05}
            transparent
            opacity={0.55}
          />
        </instancedMesh>

        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 24]} />
          <meshBasicMaterial color="#0660E4" transparent opacity={0.7} />
        </mesh>

        {[pulse1Ref, pulse2Ref, pulse3Ref].map((ref, idx) => (
          <mesh
            key={idx}
            ref={ref}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.02 + idx * 0.002, 0]}
          >
            <ringGeometry args={[0.94, 1, 64]} />
            <meshBasicMaterial
              color="#0660E4"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function HeroRadarScene() {
  const [supported, setSupported] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setSupported(canUseWebGL());
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (!supported) {
    return <HeroRadarFallback />;
  }

  return (
    <WebGLErrorBoundary fallback={<HeroRadarFallback />}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-55"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 62% 45%, black 25%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 62% 45%, black 25%, transparent 88%)",
        }}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 5.4, 8.2], fov: 40, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <MetroManilaMatrixScene pointerRef={pointerRef} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
