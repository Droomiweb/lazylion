'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Text3D, Center, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Coin({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    // Constant rotation
    meshRef.current.rotation.y += delta * 0.5;
    // Speed up if clicked
    if (active) meshRef.current.rotation.y += delta * 5;
  });

  const handleClick = () => {
    setActive(true);
    onClick();
    setTimeout(() => setActive(false), 100);
  };

  return (
    <mesh ref={meshRef} onClick={handleClick} scale={active ? 1.1 : 1}>
      <cylinderGeometry args={[2.5, 2.5, 0.3, 32]} />
      <meshStandardMaterial color={"gold"} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function CoinScene({ onTap }: { onTap: () => void }) {
  return (
    <div className="w-full h-[400px]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} />
        <Coin onClick={onTap} />
      </Canvas>
    </div>
  );
}