import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, OrbitControls, Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './MoonScene.css';
import { useStore } from '../../store/useStore';

// Moon mesh - now rotates with the group
const MoonMesh: React.FC = () => {
  const { planetStyle } = useStore();

  // Load textures
  const textures = useTexture({
    artistic: '/assets/images/artistic_moon_v2.png',
    green: '/assets/images/planet_green.png',
    blue: '/assets/images/planet_blue.png'
  }, (tex) => {
    if (Array.isArray(tex)) return;
    tex.artistic.anisotropy = 16;
    if (tex.green) tex.green.anisotropy = 16;
    if (tex.blue) tex.blue.anisotropy = 16;
  });

  return (
    <Sphere args={[1.8, 64, 64]}>
      {planetStyle === 'minimal' ? (
        <MeshDistortMaterial
          color="#c8a96e"
          roughness={0.85}
          metalness={0.12}
          distort={0.12}
          speed={0.8}
          emissive="#5c3d1a"
          emissiveIntensity={0.15}
        />
      ) : planetStyle === 'artistic' ? (
        <meshStandardMaterial
          map={textures.artistic}
          roughness={1}
          metalness={0}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      ) : planetStyle === 'green' ? (
        <meshStandardMaterial
          map={textures.green}
          roughness={0.8}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.03}
        />
      ) : (
        <meshStandardMaterial
          map={textures.blue}
          roughness={0.7}
          metalness={0.2}
          emissive="#7fbfff"
          emissiveIntensity={0.05}
        />
      )}
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
            photoCount={memory.photos?.length || 0}
            descriptionLength={memory.description?.length || 0}
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
  photoCount: number;
  descriptionLength: number;
}> = ({ position, isSelected, onClick, photoCount, descriptionLength }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const maxPhotos = 5;
  const maxDescLength = 200;
  const photoScale = 1 + Math.min(photoCount, maxPhotos) * 0.1;
  const descScale = 1 + Math.min(descriptionLength, maxDescLength) * 0.003;

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
    const scale = baseScale * hoverScale * photoScale * descScale * (isSelected ? pulse : 1);

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
  const { theme, selectMemory } = useStore();

  const themeConfig = useMemo(() => {
    switch (theme) {
      case 'sunset':
        return {
          ambient: 0.4,
          dirIntensity: 1.5,
          dirColor: "#ffaa33",
          pointIntensity: 0.6,
          pointColor: "#ff4400",
          bgClass: "moon-scene--sunset"
        };
      case 'dawn':
        return {
          ambient: 0.5,
          dirIntensity: 1.0,
          dirColor: "#80ccff",
          pointIntensity: 0.3,
          pointColor: "#ffffff",
          bgClass: "moon-scene--dawn"
        };
      default: // night
        return {
          ambient: 0.3,
          dirIntensity: 1.2,
          dirColor: "#ffe8c0",
          pointIntensity: 0.4,
          pointColor: "#8040ff",
          bgClass: "moon-scene--night"
        };
    }
  }, [theme]);

  return (
    <div className={`moon-scene ${themeConfig.bgClass}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onPointerMissed={() => selectMemory(null)}
      >
        <ambientLight intensity={themeConfig.ambient} />
        <directionalLight position={[5, 3, 5]} intensity={themeConfig.dirIntensity} color={themeConfig.dirColor} />
        <pointLight position={[-4, -2, 3]} intensity={themeConfig.pointIntensity} color={themeConfig.pointColor} />

        <Suspense fallback={null}>
          <MoonSystem />
          <Stars
            radius={30}
            depth={20}
            count={theme === 'night' ? 800 : theme === 'sunset' ? 400 : 300}
            factor={2}
            saturation={theme === 'night' ? 0.2 : 0.4}
            fade
            speed={theme === 'night' ? 0.3 : 0.15}
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
