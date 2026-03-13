import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, OrbitControls, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import './MoonScene.css';
import { useStore } from '../../store/useStore';

// Moon mesh - now rotates with the group
const MoonMesh: React.FC = () => {
  return (
    <Sphere args={[1.8, 64, 64]}>
      <MeshDistortMaterial
        color="#c8a96e"
        roughness={0.85}
        metalness={0.12}
        distort={0.12}
        speed={0.8}
        emissive="#5c3d1a"
        emissiveIntensity={0.15}
      />
    </Sphere>
  );
};

// Animated orbit ring
const OrbitRing: React.FC = () => {
  return (
    <mesh rotation={[1.3, 0.2, 0]}>
      <torusGeometry args={[2.6, 0.008, 8, 120]} />
      <meshBasicMaterial color="#ffd080" transparent opacity={0.5} />
    </mesh>
  );
};

// Outer ring
const OrbitRing2: React.FC = () => {
  return (
    <mesh rotation={[1.0, -0.3, 0.3]}>
      <torusGeometry args={[3.2, 0.005, 8, 120]} />
      <meshBasicMaterial color="#ffb040" transparent opacity={0.3} />
    </mesh>
  );
};

// Star dots around moon - each memory has a corresponding star
const MemoryStars: React.FC = () => {
  const { memories, selectedMemoryId, selectMemory } = useStore();

  const handleClick = (id: string) => {
    selectMemory(id);
  };

  const sortedMemories = [...memories].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getStarPosition = (index: number, total: number): [number, number, number] => {
    const progress = total === 1 ? 0.5 : index / (total - 1);
    const angle = progress * Math.PI * 2 - Math.PI / 2;
    const radius = 2.4 + Math.sin(progress * Math.PI) * 0.4;
    const y = (progress - 0.5) * 1.6;
    const xOffset = Math.sin(angle * 2) * 0.3;
    const zOffset = Math.cos(angle * 3) * 0.2;

    return [
      Math.cos(angle) * radius + xOffset,
      y + zOffset,
      Math.sin(angle) * radius + xOffset
    ];
  };

  return (
    <>
      {sortedMemories.map((memory, i) => {
        const pos = getStarPosition(i, sortedMemories.length);
        const isSelected = memory.id === selectedMemoryId;

        return (
          <MemoryStar
            key={memory.id}
            position={pos}
            isSelected={isSelected}
            onClick={() => handleClick(memory.id)}
          />
        );
      })}
    </>
  );
};

const MemoryStar: React.FC<{
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ position, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const baseScale = isSelected ? 1.5 : 1;
    const hoverScale = hovered ? 1.3 : 1;
    const pulse = Math.sin(t * 2) * 0.1 + 1;
    const scale = baseScale * hoverScale * (isSelected ? pulse : 1);

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale * 0.04);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * 0.25);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.8 : 0.4;
    }
  });

  const glowColor = isSelected ? '#ffffff' : '#ffd700';

  return (
    <group position={position}>
      {/* Core star */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#fff' : '#ffd700'} />
      </mesh>
      {/* Glow halo */}
      <Billboard follow={true}>
        <mesh ref={glowRef}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={0.4}
            color={glowColor}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
};

const MoonSystem: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <MoonMesh />
      <OrbitRing />
      <OrbitRing2 />
      <MemoryStars />
    </group>
  );
};

const MoonScene: React.FC = () => {
  const { selectMemory } = useStore();

  return (
    <div className="moon-scene">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onPointerMissed={() => selectMemory(null)}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffe8c0" />
        <pointLight position={[-4, -2, 3]} intensity={0.4} color="#8040ff" />

        <Suspense fallback={null}>
          <MoonSystem />
          <Stars
            radius={30}
            depth={20}
            count={800}
            factor={2}
            saturation={0.2}
            fade
            speed={0.3}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            zoomSpeed={0.5}
            rotateSpeed={0.3}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Flying birds SVG overlay */}
      <div className="birds-overlay">
        <svg viewBox="0 0 800 400" className="birds-svg">
          <g className="bird bird-1">
            <path d="M0,10 Q5,-5 10,10 Q15,-5 20,10" fill="none" stroke="#ffd070" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="bird bird-2" transform="translate(30,15) scale(0.8)">
            <path d="M0,10 Q5,-5 10,10 Q15,-5 20,10" fill="none" stroke="#ffd070" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="bird bird-3" transform="translate(60,5) scale(0.65)">
            <path d="M0,10 Q5,-5 10,10 Q15,-5 20,10" fill="none" stroke="#ffd070" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MoonScene;
