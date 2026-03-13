"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Edges, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface CubeProps {
  position: [number, number, number];
  color: string;
  distort?: boolean;
  scale?: number;
  rotationSpeed?: number;
}

function AnimatedCube({ position, color, distort = false, scale = 1, rotationSpeed = 1 }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * rotationSpeed;
      meshRef.current.rotation.y += delta * 0.3 * rotationSpeed;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={1.5} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
      position={position}
    >
      <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        {distort ? (
          <MeshDistortMaterial
            color={color}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.2}
            speed={2}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.0}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent={true}
            opacity={0.8}
            transmission={0.5} // Glass effect
            thickness={0.5}
            ior={1.5}
          />
        )}
        <Edges
          linewidth={2}
          threshold={15}
          color={new THREE.Color(color).multiplyScalar(2)} // Brighter edges for neon effect
        />
      </mesh>
    </Float>
  );
}

export function FloatingCubes() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#8b5cf6" />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#db2777" />
        
        {/* Core Topic Nodes */}
        <AnimatedCube position={[-3, 1, -2]} color="#06b6d4" scale={0.8} rotationSpeed={1.2} />
        <AnimatedCube position={[3, -1, -3]} color="#8b5cf6" distort scale={1.2} rotationSpeed={0.8} />
        <AnimatedCube position={[-2, -2, -1]} color="#db2777" scale={0.6} rotationSpeed={1.5} />
        <AnimatedCube position={[4, 2, -2]} color="#3b82f6" scale={0.9} />
        <AnimatedCube position={[0, 3, -4]} color="#dc2626" scale={0.7} distort rotationSpeed={2} />
        
        {/* Smaller floating decoration nodes */}
        <AnimatedCube position={[-4, -3, -5]} color="#a78bfa" scale={0.4} />
        <AnimatedCube position={[5, -2, -4]} color="#22d3ee" scale={0.3} rotationSpeed={2.5} />
        <AnimatedCube position={[1, -4, -6]} color="#f87171" scale={0.5} />

      </Canvas>
    </div>
  );
}
