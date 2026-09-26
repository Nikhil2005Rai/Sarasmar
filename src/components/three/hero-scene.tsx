"use client";

import { Environment, Float, Html, Lightformer, MeshTransmissionMaterial, QuadraticBezierLine, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────
   Geometry: the logo's S, lifted into 3D.
   Same control points as S_PATHS in components/brand/s-mark.tsx,
   mapped from the 120×160 SVG box into world units, with z-twist.
   ──────────────────────────────────────────────────────────────── */
type P = [number, number];
const toV = ([x, y]: P, z: number) => new THREE.Vector3((x - 60) / 36, -(y - 80) / 36, z);

function sCurve(pts: P[], zs: number[]) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < 3; i++) {
    const o = i * 3;
    path.add(
      new THREE.CubicBezierCurve3(toV(pts[o], zs[o]), toV(pts[o + 1], zs[o + 1]), toV(pts[o + 2], zs[o + 2]), toV(pts[o + 3], zs[o + 3])),
    );
  }
  return path;
}

const GOLD_PTS: P[] = [[94, 20], [62, 2], [20, 16], [25, 47], [30, 79], [93, 73], [95, 108], [97, 141], [55, 158], [22, 141]];
const ROYAL_PTS: P[] = [[103, 33], [76, 19], [40, 26], [41, 49], [42, 72], [105, 71], [105, 111], [105, 147], [62, 163], [31, 152]];
const HAIR_PTS: P[] = [[86, 12], [52, -2], [10, 14], [14, 45], [18, 76], [82, 76], [85, 106], [88, 134], [50, 150], [16, 131]];

/** Global pointer, normalised to -1..1, shared by the whole scene. */
function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}

function StarMesh(props: JSX.IntrinsicElements["mesh"]) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const n = 8;
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
      const long = i % 4 === 0;
      const r = i % 2 === 0 ? (long ? 1 : 0.55) : 0.14;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
    g.center();
    return g;
  }, []);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <mesh ref={ref} geometry={geo} {...props}>
      <meshPhysicalMaterial color="#F0D59A" metalness={1} roughness={0.18} clearcoat={1} emissive="#D9A441" emissiveIntensity={0.35} />
    </mesh>
  );
}

function Emblem() {
  const gold = useMemo(() => new THREE.TubeGeometry(sCurve(GOLD_PTS, [0.3, 0.55, 0.4, 0, -0.35, -0.4, 0, 0.35, 0.5, 0.2]), 220, 0.11, 32, false), []);
  const royal = useMemo(() => new THREE.TubeGeometry(sCurve(ROYAL_PTS, [-0.1, 0.1, 0.05, -0.3, -0.6, -0.65, -0.3, 0, 0.15, -0.05]), 220, 0.16, 40, false), []);
  const hair = useMemo(() => new THREE.TubeGeometry(sCurve(HAIR_PTS, [0.55, 0.8, 0.7, 0.3, -0.1, -0.15, 0.25, 0.6, 0.7, 0.45]), 200, 0.018, 8, false), []);

  return (
    <group>
      {/* glass strand — refracts the gold behind it */}
      <mesh geometry={royal}>
        <MeshTransmissionMaterial
          samples={4}
          resolution={256}
          thickness={0.35}
          roughness={0.12}
          transmission={0.55}
          chromaticAberration={0.2}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.05}
          ior={1.3}
          color="#6f93d6"
          emissive="#3568B8"
          emissiveIntensity={0.35}
          clearcoat={1}
          attenuationColor="#8FB2EC"
          attenuationDistance={2}
          background={new THREE.Color("#142B4A")}
        />
      </mesh>
      <mesh geometry={gold}>
        <meshPhysicalMaterial color="#E4B45A" metalness={1} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} emissive="#5a3a08" emissiveIntensity={0.25} />
      </mesh>
      <mesh geometry={hair}>
        <meshBasicMaterial color="#F8F5EF" transparent opacity={0.6} />
      </mesh>
      <StarMesh position={[1.35, 0.45, 0.2]} scale={0.26} />
    </group>
  );
}

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.05;
    if (b.current) b.current.rotation.z -= dt * 0.035;
  });
  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2.35, 0.15, 0]}>
        <torusGeometry args={[3.1, 0.006, 8, 256]} />
        <meshBasicMaterial color="#D9A441" transparent opacity={0.55} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 1.8, -0.35, 0.4]}>
        <torusGeometry args={[3.7, 0.004, 8, 256]} />
        <meshBasicMaterial color="#8A78C7" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[2.55, 0.003, 8, 256]} />
        <meshBasicMaterial color="#F0D59A" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

type NodeDef = {
  label: string;
  sub: string;
  kind: "skill" | "company";
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  y: number;
};

const NODES: NodeDef[] = [
  { label: "Financial Modelling", sub: "Verified · 94", kind: "skill", radius: 2.35, speed: 0.09, phase: 0.2, tilt: 0.55, y: 0.9 },
  { label: "Power BI", sub: "Verified · 91", kind: "skill", radius: 2.57, speed: 0.07, phase: 2.3, tilt: 0.45, y: -1.2 },
  { label: "Excel", sub: "Verified · 97", kind: "skill", radius: 2.49, speed: 0.1, phase: 4.1, tilt: 0.6, y: 1.7 },
  { label: "Northwind Capital", sub: "3 open projects", kind: "company", radius: 2.73, speed: 0.06, phase: 1.2, tilt: 0.4, y: -0.2 },
  { label: "Aster Labs", sub: "Hiring · 2 weeks", kind: "company", radius: 2.49, speed: 0.08, phase: 3.3, tilt: 0.5, y: -2 },
  { label: "Market Research", sub: "Match 87%", kind: "skill", radius: 2.27, speed: 0.085, phase: 5.3, tilt: 0.5, y: 2.2 },
];

function OrbitNode({ def, index }: { def: NodeDef; index: number }) {
  const group = useRef<THREE.Group>(null);
  const line = useRef<any>(null); // drei Line2 instance with setPoints
  const [front, setFront] = useState(true);
  const [side, setSide] = useState<1 | -1>(def.kind === "skill" ? 1 : -1);
  const mid = useMemo(() => new THREE.Vector3(), []);
  const start = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * def.speed + def.phase;
    const x = Math.cos(t) * def.radius;
    const z = Math.sin(t) * def.radius * def.tilt;
    const y = def.y + Math.sin(t * 2 + index) * 0.12;
    group.current?.position.set(x, y, z);
    mid.set(x * 0.45, y * 0.35 + 0.6, z * 0.5 + 0.6);
    line.current?.setPoints(start, group.current!.position, mid);
    if (line.current?.material) line.current.material.dashOffset -= 0.004;
    const isFront = z > -0.6;
    if (isFront !== front) setFront(isFront);
    // keep the label inside the frame: push it toward the centre near the edges
    const nextSide: 1 | -1 = x > 1.2 ? -1 : x < -1.2 ? 1 : def.kind === "skill" ? 1 : -1;
    if (nextSide !== side) setSide(nextSide);
  });

  const color = def.kind === "skill" ? "#F0D59A" : "#9dbcf2";
  return (
    <>
      <QuadraticBezierLine
        ref={line}
        start={[0, 0, 0]}
        end={[def.radius, def.y, 0]}
        color={def.kind === "skill" ? "#D9A441" : "#6f93d6"}
        lineWidth={1}
        dashed
        dashScale={8}
        dashSize={0.6}
        gapSize={0.4}
        transparent
        opacity={0.55}
      />
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
        <Html
          center
          zIndexRange={[20, 0]}
          style={{
            transition: "opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)",
            opacity: front ? 1 : 0.28,
            transform: `translate3d(${side * 84}px, 0, 0) scale(${front ? 1 : 0.88})`,
            pointerEvents: "none",
          }}
        >
          <div className="flex items-center gap-2.5 whitespace-nowrap rounded-[11px] border border-white/10 bg-[rgba(17,31,51,0.62)] py-2 pl-2 pr-3.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md">
            {def.kind === "company" ? (
              <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-gradient-to-br from-[#3568B8] to-[#8A78C7] font-serif text-[13px] font-semibold text-white">
                {def.label[0]}
              </span>
            ) : (
              <span className="grid h-7 w-7 place-items-center rounded-[7px] border border-[#D9A441]/40 bg-[#D9A441]/10 text-[#F0D59A]">
                <svg viewBox="0 0 12 12" className="h-3 w-3">
                  <path d="M2.2 6.3 4.8 8.8 9.8 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-medium text-[#F8F5EF]">{def.label}</span>
              <span className="text-[10.5px] tracking-wide text-[#c9cfd9]/70">{def.sub}</span>
            </span>
          </div>
        </Html>
      </group>
    </>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const pointer = usePointer();
  useFrame((state, dt) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const targetY = pointer.current.x * 0.35 + Math.sin(t * 0.15) * 0.25;
    const targetX = -pointer.current.y * 0.2 + 0.08;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, targetY, 2.2, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, targetX, 2.2, dt);
  });
  return <group ref={g}>{children}</group>;
}

function EmblemSpin({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (g.current) g.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.45;
  });
  return <group ref={g}>{children}</group>;
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 11], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#fff4dc" />
      <directionalLight position={[-6, -2, -4]} intensity={0.9} color="#6f93d6" />
      <pointLight position={[0, 0, 2.5]} intensity={6} distance={6} color="#D9A441" />

      <Rig>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6} floatingRange={[-0.12, 0.12]}>
          <EmblemSpin>
            <Emblem />
          </EmblemSpin>
        </Float>
        <Rings />
        {NODES.map((n, i) => (
          <OrbitNode key={n.label} def={n} index={i} />
        ))}
        <Sparkles count={60} scale={[9, 6, 4]} size={1.6} speed={0.25} color="#F0D59A" opacity={0.5} />
      </Rig>

      {/* Procedural studio environment — no HDR download */}
      <Environment resolution={256} environmentIntensity={1.35}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="rect" intensity={6} color="#fff2d6" position={[0, 5, -9]} scale={[10, 4, 1]} />
          <Lightformer form="circle" intensity={3} color="#9dbcf2" position={[-5, 1, -1]} scale={3} />
          <Lightformer form="ring" intensity={4} color="#F0D59A" position={[5, -1, -1]} scale={4} />
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 0, 8]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#8A78C7" position={[-2, -3, 4]} scale={[8, 1, 1]} />
        </group>
      </Environment>
    </Canvas>
  );
}
