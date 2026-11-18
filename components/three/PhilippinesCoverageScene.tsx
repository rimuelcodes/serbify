"use client";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

export interface CoverageHub3D {
  id: string;
  label: string;
  kind: "active" | "expanding";
  prosOnline: number;
  dispatchLabel: string;
  position: [number, number, number];
  cameraOffset: [number, number, number];
}

export const PH_HUBS_3D: CoverageHub3D[] = [
  {
    id: "manila",
    label: "Manila",
    kind: "active",
    prosOnline: 312,
    dispatchLabel: "< 18 mins",
    position: [-0.34, 0.22, -1.06],
    cameraOffset: [-0.65, 1.55, 1.35],
  },
  {
    id: "qc",
    label: "Quezon City",
    kind: "active",
    prosOnline: 428,
    dispatchLabel: "< 19 mins",
    position: [-0.14, 0.24, -1.26],
    cameraOffset: [-0.35, 1.55, 1.35],
  },
  {
    id: "makati",
    label: "Makati",
    kind: "active",
    prosOnline: 284,
    dispatchLabel: "< 15 mins",
    position: [-0.22, 0.22, -0.94],
    cameraOffset: [-0.45, 1.45, 1.35],
  },
  {
    id: "taguig",
    label: "Taguig",
    kind: "active",
    prosOnline: 196,
    dispatchLabel: "< 17 mins",
    position: [-0.08, 0.22, -0.88],
    cameraOffset: [-0.2, 1.45, 1.35],
  },
  {
    id: "pasig",
    label: "Pasig",
    kind: "active",
    prosOnline: 164,
    dispatchLabel: "< 20 mins",
    position: [0.02, 0.23, -1.02],
    cameraOffset: [0.22, 1.55, 1.4],
  },
  {
    id: "mandaluyong",
    label: "Mandaluyong",
    kind: "active",
    prosOnline: 98,
    dispatchLabel: "< 16 mins",
    position: [-0.15, 0.22, -1.05],
    cameraOffset: [-0.25, 1.5, 1.35],
  },
  {
    id: "cebu",
    label: "Cebu City",
    kind: "expanding",
    prosOnline: 84,
    dispatchLabel: "Q3 Launch",
    position: [0.46, 0.2, 0.42],
    cameraOffset: [0.85, 1.85, 1.95],
  },
  {
    id: "davao",
    label: "Davao City",
    kind: "expanding",
    prosOnline: 62,
    dispatchLabel: "Q4 Launch",
    position: [0.95, 0.22, 1.58],
    cameraOffset: [1.15, 1.95, 2.55],
  },
];

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

function createSmoothIslandShape(points: [number, number][]): THREE.Shape {
  const shape = new THREE.Shape();
  const vecs = points.map(([x, y]) => new THREE.Vector2(x, y));
  shape.moveTo(vecs[0].x, vecs[0].y);
  shape.splineThru([...vecs.slice(1), vecs[0]]);
  return shape;
}

function ArchipelagoScene({
  activeHubId,
  onSelectHub,
}: {
  activeHubId: string;
  onSelectHub: (id: string) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isUserDraggingRef = useRef(false);
  const lastHubIdRef = useRef(activeHubId);

  const activeHub = useMemo(
    () => PH_HUBS_3D.find((h) => h.id === activeHubId) ?? PH_HUBS_3D[4],
    [activeHubId]
  );

  // Build accurate extruded Philippine archipelago geometries + Metro Manila contours
  const {
    islandGeometries,
    metroPadGeometry,
    pasigRiverGeometry,
    districtLinesGeometry,
    materials,
  } = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 24,
    };

    // Luzon with Lingayen Gulf, Manila Bay indentation, Bataan, Cavite hook, Bicol
    const luzon = createSmoothIslandShape([
      [-0.52, 2.48],
      [-0.12, 2.55],
      [0.14, 2.25],
      [0.18, 1.82],
      [0.08, 1.52],
      [0.26, 1.24],
      [0.14, 0.96],
      [0.44, 0.78],
      [0.62, 0.56],
      [0.48, 0.42],
      [0.24, 0.62],
      [0.02, 0.72],
      [-0.18, 0.78],
      [-0.36, 0.88],
      [-0.28, 1.04], // Manila Bay east rim
      [-0.44, 1.08], // Bataan peninsula
      [-0.52, 0.92],
      [-0.64, 1.18],
      [-0.58, 1.56],
      [-0.46, 1.78], // Lingayen Gulf
      [-0.62, 2.08],
    ]);

    const mindoro = createSmoothIslandShape([
      [-0.64, 0.64],
      [-0.38, 0.6],
      [-0.34, 0.34],
      [-0.56, 0.36],
    ]);

    const palawan = createSmoothIslandShape([
      [-1.48, -0.38],
      [-1.3, -0.26],
      [-0.84, 0.24],
      [-0.98, 0.38],
      [-1.44, -0.18],
    ]);

    const panay = createSmoothIslandShape([
      [-0.14, 0.12],
      [0.18, 0.16],
      [0.22, -0.14],
      [-0.08, -0.18],
    ]);

    const negros = createSmoothIslandShape([
      [0.2, -0.08],
      [0.39, -0.04],
      [0.35, -0.52],
      [0.15, -0.46],
    ]);

    const cebu = createSmoothIslandShape([
      [0.43, -0.02],
      [0.55, 0.02],
      [0.5, -0.56],
      [0.39, -0.54],
    ]);

    const bohol = createSmoothIslandShape([
      [0.56, -0.36],
      [0.72, -0.34],
      [0.7, -0.52],
      [0.55, -0.5],
    ]);

    const samarLeyte = createSmoothIslandShape([
      [0.64, 0.2],
      [0.96, 0.16],
      [0.88, -0.44],
      [0.64, -0.32],
    ]);

    const mindanao = createSmoothIslandShape([
      [0.5, -0.82],
      [1.08, -0.76],
      [1.28, -1.24],
      [1.06, -1.86],
      [0.66, -1.8],
      [0.34, -1.56],
      [0.02, -1.44],
      [0.26, -1.14],
    ]);

    const islands = [
      luzon,
      mindoro,
      palawan,
      panay,
      negros,
      cebu,
      bohol,
      samarLeyte,
      mindanao,
    ].map((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.rotateX(-Math.PI / 2);
      return geo;
    });

    // Metro Manila raised district contour pad
    const metroPadShape = createSmoothIslandShape([
      [-0.4, 1.32],
      [-0.06, 1.38],
      [0.08, 1.12],
      [0.04, 0.84],
      [-0.26, 0.84],
      [-0.38, 1.02],
    ]);
    const metroPad = new THREE.ExtrudeGeometry(metroPadShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
    metroPad.rotateX(-Math.PI / 2);

    // Pasig River winding contour across Metro Manila
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.215, -1.04),
      new THREE.Vector3(-0.26, 0.215, -1.06),
      new THREE.Vector3(-0.15, 0.215, -1.05),
      new THREE.Vector3(-0.04, 0.215, -1.02),
      new THREE.Vector3(0.06, 0.215, -0.96),
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 24, 0.012, 8, false);

    // Subtle city district boundary hairlines inside Metro Manila
    const boundaryPoints = [
      new THREE.Vector3(-0.24, 0.215, -1.32),
      new THREE.Vector3(-0.22, 0.215, -1.12),
      new THREE.Vector3(-0.22, 0.215, -1.12),
      new THREE.Vector3(-0.04, 0.215, -1.14),
      new THREE.Vector3(-0.22, 0.215, -1.12),
      new THREE.Vector3(-0.24, 0.215, -0.9),
      new THREE.Vector3(-0.12, 0.215, -1.02),
      new THREE.Vector3(-0.06, 0.215, -0.84),
    ];
    const districtLines = new THREE.BufferGeometry().setFromPoints(
      boundaryPoints
    );

    const topMat = new THREE.MeshStandardMaterial({
      color: "#E2E8F0",
      roughness: 0.78,
      metalness: 0.04,
    });
    const bevelMat = new THREE.MeshStandardMaterial({
      color: "#CBD5E1",
      roughness: 0.86,
      metalness: 0.02,
    });
    const metroMat = new THREE.MeshStandardMaterial({
      color: "#F1F5F9",
      roughness: 0.68,
      metalness: 0.05,
    });

    return {
      islandGeometries: islands,
      metroPadGeometry: metroPad,
      pasigRiverGeometry: riverGeo,
      districtLinesGeometry: districtLines,
      materials: { topMat, bevelMat, metroMat },
    };
  }, []);

  // Dispose Three.js geometries and materials on unmount
  useEffect(() => {
    return () => {
      islandGeometries.forEach((g) => g.dispose());
      metroPadGeometry.dispose();
      pasigRiverGeometry.dispose();
      districtLinesGeometry.dispose();
      materials.topMat.dispose();
      materials.bevelMat.dispose();
      materials.metroMat.dispose();
    };
  }, [
    islandGeometries,
    metroPadGeometry,
    pasigRiverGeometry,
    districtLinesGeometry,
    materials,
  ]);

  useEffect(() => {
    if (lastHubIdRef.current !== activeHubId) {
      isUserDraggingRef.current = false;
      lastHubIdRef.current = activeHubId;
    }
  }, [activeHubId]);

  useFrame(({ camera }) => {
    if (isUserDraggingRef.current) return;

    const targetCamPos = new THREE.Vector3(
      activeHub.position[0] + activeHub.cameraOffset[0],
      activeHub.cameraOffset[1],
      activeHub.position[2] + activeHub.cameraOffset[2]
    );
    const targetLook = new THREE.Vector3(
      activeHub.position[0],
      0.16,
      activeHub.position[2]
    );

    camera.position.lerp(targetCamPos, 0.06);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook, 0.08);
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLook);
    }
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={0.95}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.35}
        color="#93C5FD"
      />

      {/* Architectural coordinate base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.025, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.95} />
      </mesh>
      <gridHelper
        args={[12, 24, "#CBD5E1", "#E2E8F0"]}
        position={[0, -0.015, 0]}
      />

      {/* Manila Bay subtle water sheen */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.38, 0.01, -1.04]}
      >
        <circleGeometry args={[0.24, 32]} />
        <meshBasicMaterial color="#DBEAFE" transparent opacity={0.7} />
      </mesh>

      {/* Extruded Philippine Islands */}
      <group>
        {islandGeometries.map((geo, idx) => (
          <mesh
            key={idx}
            geometry={geo}
            material={[materials.topMat, materials.bevelMat]}
            castShadow
            receiveShadow
          />
        ))}
      </group>

      {/* Metro Manila Raised District Contour */}
      <mesh
        geometry={metroPadGeometry}
        material={materials.metroMat}
        position={[0, 0.165, 0]}
        receiveShadow
      />

      {/* Pasig River Contour */}
      <mesh geometry={pasigRiverGeometry}>
        <meshBasicMaterial color="#60A5FA" />
      </mesh>

      {/* City District Boundary Lines */}
      <lineSegments geometry={districtLinesGeometry}>
        <lineBasicMaterial color="#94A3B8" transparent opacity={0.65} />
      </lineSegments>

      {/* Interactive City Beacons */}
      {PH_HUBS_3D.map((hub) => (
        <HubBeacon
          key={hub.id}
          hub={hub}
          isSelected={hub.id === activeHubId}
          onSelect={() => onSelectHub(hub.id)}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.4}
        onStart={() => {
          isUserDraggingRef.current = true;
        }}
      />
    </>
  );
}

function HubBeacon({
  hub,
  isSelected,
  onSelect,
}: {
  hub: CoverageHub3D;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const towerRef = useRef<THREE.Mesh>(null);

  const baseColor = hub.kind === "active" ? "#10B981" : "#F59E0B";
  const accentColor =
    isSelected && hub.kind === "active" ? "#0660E4" : baseColor;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const phase = (t * 0.75 + (hub.kind === "expanding" ? 0.5 : 0)) % 1;
      const scale =
        (isSelected ? 1.25 : 0.8) + phase * (isSelected ? 2.5 : 1.5);
      ringRef.current.scale.set(scale, scale, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - phase) * (isSelected ? 0.85 : 0.45);
    }
    if (outerRingRef.current) {
      const phase2 = (t * 0.75 + 0.5) % 1;
      const scale2 = 0.9 + phase2 * (isSelected ? 2.2 : 1.3);
      outerRingRef.current.scale.set(scale2, scale2, 1);
      const mat2 = outerRingRef.current.material as THREE.MeshBasicMaterial;
      mat2.opacity = (1 - phase2) * (isSelected ? 0.55 : 0.25);
    }
    if (towerRef.current) {
      const targetScaleY = isSelected ? 1.45 : 1;
      towerRef.current.scale.y = THREE.MathUtils.lerp(
        towerRef.current.scale.y,
        targetScaleY,
        0.12
      );
    }
  });

  return (
    <group position={hub.position}>
      {/* Concentric sonar pulse rings */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <ringGeometry args={[0.065, 0.095, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
      >
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Architectural beacon spire */}
      <mesh
        ref={towerRef}
        position={[0, 0.13, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <cylinderGeometry args={[0.018, 0.04, 0.26, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isSelected ? 0.85 : 0.35}
        />
      </mesh>

      {/* Glowing crown orb */}
      <mesh position={[0, isSelected ? 0.34 : 0.28, 0]}>
        <sphereGeometry args={[isSelected ? 0.052 : 0.036, 16, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

function CoverageFallbackInner({ activeHubId }: { activeHubId: string }) {
  const active = PH_HUBS_3D.find((h) => h.id === activeHubId) ?? PH_HUBS_3D[4];
  return (
    <div className="relative w-full h-[270px] flex flex-col items-center justify-center rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
      <svg
        className="w-full h-full text-[#E2E8F0]"
        fill="none"
        viewBox="0 0 400 300"
      >
        <path
          d="M170 30 C190 20, 220 50, 230 80 C240 110, 220 130, 200 140 C180 150, 160 120, 150 90 Z"
          fill="currentColor"
        />
        <circle cx="230" cy="180" fill="currentColor" r="18" />
        <path
          d="M220 220 C260 210, 280 240, 270 270 C240 290, 200 270, 210 240 Z"
          fill="currentColor"
        />
      </svg>
      <span className="absolute bottom-3 px-3 py-1 rounded-full bg-white border border-[#10B981] text-xs font-bold text-[#065F46]">
        {active.label} • {active.kind === "active" ? "Live" : "Expanding"}
      </span>
    </div>
  );
}

export default function PhilippinesCoverageScene({
  activeHubId,
  onSelectHub,
}: {
  activeHubId: string;
  onSelectHub: (id: string) => void;
}) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(canUseWebGL());
  }, []);

  const activeHub =
    PH_HUBS_3D.find((h) => h.id === activeHubId) ?? PH_HUBS_3D[4];

  if (!supported) {
    return <CoverageFallbackInner activeHubId={activeHubId} />;
  }

  return (
    <WebGLErrorBoundary
      fallback={<CoverageFallbackInner activeHubId={activeHubId} />}
    >
      <div className="relative w-full h-[270px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#EEF4FF] border border-[#E2E8F0]/60">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0.35, 2.0, 1.35], fov: 38, near: 0.1, far: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ArchipelagoScene
            activeHubId={activeHubId}
            onSelectHub={onSelectHub}
          />
        </Canvas>

        {/* Active Hub HUD Pill */}
        <div
          className={`pointer-events-none absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border text-[11px] font-bold shadow-sm flex items-center gap-1.5 ${
            activeHub.kind === "active"
              ? "border-[#10B981] text-[#065F46]"
              : "border-[#F59E0B] text-[#92400E]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              activeHub.kind === "active" ? "bg-[#10B981]" : "bg-[#F59E0B]"
            }`}
          />
          <span>
            {activeHub.label} •{" "}
            {activeHub.kind === "active" ? "Live Dispatch" : "Expanding Q3/Q4"}
          </span>
        </div>

        {/* Subtle Orbit Hint */}
        <span className="pointer-events-none absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/85 border border-[#E2E8F0] text-[10px] font-semibold text-[#64748B]">
          Drag to orbit 3D map
        </span>
      </div>
    </WebGLErrorBoundary>
  );
}
