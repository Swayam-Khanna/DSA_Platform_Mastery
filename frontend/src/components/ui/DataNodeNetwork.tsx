'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Define the connections randomly based on proximity
function generateNodes(count: number, radius: number) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    // Generate random points in a sphere volume
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    nodes.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ));
  }
  return nodes;
}

function DataGraph() {
  const group = useRef<THREE.Group>(null);
  
  // Memoize geometry generation
  const { nodes, lines } = useMemo(() => {
    const nodePositions = generateNodes(30, 4.5);
    const linePairs = [];
    
    // Connect nodes that are close to each other
    for (let i = 0; i < nodePositions.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 3.5 && connections < 3) {
          linePairs.push([nodePositions[i], nodePositions[j]]);
          connections++;
        }
      }
    }
    return { nodes: nodePositions, lines: linePairs };
  }, []);

  // Float animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Draw Nodes */}
      {nodes.map((pos, i) => (
        <Sphere args={[0.08, 16, 16]} position={pos} key={`node-${i}`}>
          <meshStandardMaterial 
            color={i % 3 === 0 ? '#06b6d4' : i % 2 === 0 ? '#8b5cf6' : '#ec4899'} 
            emissive={i % 3 === 0 ? '#06b6d4' : i % 2 === 0 ? '#8b5cf6' : '#ec4899'}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </Sphere>
      ))}

      {/* Draw Data Connection Lines */}
      {lines.map((pair, i) => (
        <Line 
          key={`line-${i}`}
          points={pair} 
          color="#a78bfa"
          lineWidth={1.5}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

export default function DataNodeNetwork() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.6, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <DataGraph />
        {/* Allows slightly moving the graph if pointer events were enabled, but we leave it to auto-rotate */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
