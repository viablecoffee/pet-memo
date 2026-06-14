import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Stars, OrbitControls, Billboard, useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import './MoonScene.css';
import { useStore } from '../../store/useStore';
import { CAMERA, STAR, SCENE, DUR, lerp, easeOutCubic, isReducedMotion } from '../../motion';
import { sortMemoriesByDate } from '../../utils/memories';

// Build the radial-gradient glow sprite once and share it across every star
// (was created per-instance — N memories meant N canvas/texture allocations).
const createGlowTexture = (): THREE.CanvasTexture => {
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
};

const ORIGIN = new THREE.Vector3(0, 0, 0);

// Star layout — shared so the stars, the camera, and the constellation agree.
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
    Math.sin(angle) * radius + xOffset,
  ];
};

// Shader patch to blend seams for non-seamless textures
const useSeamPatch = () => {
  return useMemo(() => (shader: any) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_pars_vertex>',
      `#include <uv_pars_vertex>
       varying vec2 vUvPatched;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      `#include <uv_vertex>
       vUvPatched = uv;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_pars_fragment>',
      `#include <map_pars_fragment>
       varying vec2 vUvPatched;
       vec4 sampleSeamless(sampler2D tex, vec2 uv) {
         float blendWidth = 0.015; // Width of the blend area
         if (uv.x < blendWidth) {
           float t = uv.x / blendWidth;
           return mix(texture2D(tex, vec2(uv.x + 1.0, uv.y)), texture2D(tex, uv), t);
         } else if (uv.x > 1.0 - blendWidth) {
           float t = (1.0 - uv.x) / blendWidth;
           return mix(texture2D(tex, vec2(uv.x - 1.0, uv.y)), texture2D(tex, uv), t);
         }
         return texture2D(tex, uv);
       }`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#ifdef USE_MAP
         diffuseColor *= sampleSeamless( map, vUvPatched );
       #endif`
    );
  }, []);
};

// Moon mesh - now rotates with the group
const MoonMesh: React.FC = () => {
  const { planetStyle } = useStore();
  const patchSeam = useSeamPatch();

  // Load textures
  const textures = useTexture({
    artistic: '/assets/images/artistic_moon_v2.png',
    blue: '/assets/images/planet_blue.png'
  }, (tex) => {
    if (Array.isArray(tex)) return;

    // Common settings
    const configureTexture = (t: THREE.Texture) => {
      t.anisotropy = 16;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
    };

    if (tex.artistic) configureTexture(tex.artistic);
    if (tex.blue) configureTexture(tex.blue);
  });

  return (
    <mesh>
      <sphereGeometry args={[1.8, 128, 128]} />
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
          onBeforeCompile={patchSeam}
        />
      ) : (
        <meshStandardMaterial
          map={textures.blue}
          roughness={0.7}
          metalness={0.2}
          emissive="#7fbfff"
          emissiveIntensity={0.05}
          onBeforeCompile={patchSeam}
        />
      )}
    </mesh>
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
const MemoryStars: React.FC<{ onStarClick?: (id: string) => void }> = ({ onStarClick }) => {
  const { memories, selectedMemoryId, selectMemory, setFocusedMemory } = useStore();

  // One shared glow sprite for all stars.
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const handleClick = (id: string) => {
    selectMemory(id);
    setFocusedMemory(id);
    onStarClick?.(id);
  };

  const sortedMemories = sortMemoriesByDate(memories);

  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
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
            descriptionLength={countWords(memory.description || '')}
            glowTexture={glowTexture}
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
  glowTexture: THREE.Texture;
}> = ({ position, isSelected, onClick, photoCount, descriptionLength, glowTexture }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  // Eased "unit" scale (lerps toward target so selection grows in cinematically).
  const unitScaleRef = useRef(1);

  const maxPhotos = 5;
  const maxDescWords = 200;
  const photoScale = 1 + Math.min(photoCount, maxPhotos) * 0.1;
  const descScale = 1 + Math.min(descriptionLength, maxDescWords) * 0.003;

  useFrame(({ clock }) => {
    const reduce = isReducedMotion();
    const t = clock.getElapsedTime();
    const baseScale = isSelected ? STAR.selectedScale : 1;
    const hoverScale = hovered ? STAR.hoverScale : 1;
    const pulse = reduce ? 1 : Math.sin(t * STAR.pulseSpeed) * 0.1 + 1;
    const target = baseScale * hoverScale * photoScale * descScale * (isSelected ? pulse : 1);

    // Ease toward the target instead of snapping.
    unitScaleRef.current = reduce ? target : lerp(unitScaleRef.current, target, STAR.lerpFactor);
    const u = unitScaleRef.current;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(u * STAR.baseRadius);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(u * STAR.glowRadius);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isSelected ? 0.8 : 0.4;
      mat.opacity = reduce ? targetOpacity : lerp(mat.opacity, targetOpacity, STAR.lerpFactor);
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

// A faint thread linking the memory stars in chronological order — this pet's
// "constellation". Lives inside the rotating group so it moves/freezes with the stars.
const MemoryConstellation: React.FC = () => {
  const memories = useStore(s => s.memories);
  const points = useMemo(() => {
    const sorted = sortMemoriesByDate(memories);
    if (sorted.length < 2) return [];
    const ctrl = sorted.map((_, i) => new THREE.Vector3(...getStarPosition(i, sorted.length)));
    // Flow a smooth spline through the stars so the thread reads as a soft
    // curve like the orbit rings (not an angular polyline). 'centripetal'
    // avoids overshoot/cusps when the stars are unevenly spaced.
    const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal');
    return curve.getPoints(Math.max(ctrl.length * 16, 64));
  }, [memories]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#ffe6a0"
      lineWidth={1.4}
      transparent
      opacity={0.55}
      depthWrite={false}
    />
  );
};

interface PlanetProps {
  size: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt?: number;
  emissive?: string;
  emissiveIntensity?: number;
  hasRing?: boolean;
  ringColor?: string;
}

const Planet: React.FC<PlanetProps> = ({ size, color, orbitRadius, orbitSpeed, orbitTilt = 0, emissive, emissiveIntensity = 0, hasRing, ringColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/assets/images/planet_blue.png');

  useFrame(({ clock }) => {
    const reduce = isReducedMotion();
    if (groupRef.current) {
      // Freeze at a distinct per-planet angle when reduced motion is requested.
      const t = reduce ? orbitTilt * 4 : clock.getElapsedTime() * orbitSpeed;
      groupRef.current.position.x = Math.cos(t) * orbitRadius;
      groupRef.current.position.z = Math.sin(t) * orbitRadius;
      groupRef.current.position.y = Math.sin(t * 0.5 + orbitTilt) * orbitRadius * 0.3;
    }
    if (meshRef.current && !reduce) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          roughness={0.8}
          metalness={0.1}
          emissive={emissive || color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2.2, 32]} />
          <meshStandardMaterial
            color={ringColor || '#c9a86c'}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const SolarSystem: React.FC = () => {
  return (
    <>
      {/* Mercury - gray */}
      <Planet size={0.3} color="#a0a0a0" orbitRadius={18} orbitSpeed={0.04} orbitTilt={0.5} emissiveIntensity={0.05} />
      {/* Venus - yellowish white */}
      <Planet size={0.4} color="#e6d9b8" orbitRadius={24} orbitSpeed={0.03} orbitTilt={1.2} emissiveIntensity={0.1} />

      {/* Earth-like - the "Earth" (current planet) */}
      <Planet size={0.5} color="#4a90c2" orbitRadius={32} orbitSpeed={0.02} orbitTilt={2.5} emissive="#2a6090" emissiveIntensity={0.15} />

      {/* Mars - rusty red */}
      <Planet size={0.35} color="#c1440e" orbitRadius={37} orbitSpeed={0.018} orbitTilt={1.9} emissiveIntensity={0.15} />

      {/* Jupiter - orange-brown */}
      <Planet size={0.9} color="#c9a86c" orbitRadius={42} orbitSpeed={0.015} orbitTilt={0.8} emissiveIntensity={0.1} hasRing ringColor="#b8956c" />
      {/* Saturn - golden yellow */}
      <Planet size={0.75} color="#e8d5a3" orbitRadius={52} orbitSpeed={0.01} orbitTilt={3.2} hasRing ringColor="#c9b896" />
      {/* Uranus - cyan-blue */}
      <Planet size={0.55} color="#7fd0d0" orbitRadius={65} orbitSpeed={0.008} orbitTilt={1.8} emissive="#4aa0a0" emissiveIntensity={0.2} />
      {/* Neptune - deep blue */}
      <Planet size={0.52} color="#4b70dd" orbitRadius={75} orbitSpeed={0.006} orbitTilt={2.1} emissive="#2a4090" emissiveIntensity={0.2} />
      {/* Pluto - brownish gray */}
      <Planet size={0.15} color="#d4a574" orbitRadius={85} orbitSpeed={0.004} orbitTilt={2.8} emissiveIntensity={0.1} />
    </>
  );
};

const MoonSystem: React.FC<{
  onStarClick?: (id: string) => void;
  groupRef: React.RefObject<THREE.Group | null>;
  frozenRef: React.MutableRefObject<boolean>;
}> = ({ onStarClick, groupRef, frozenRef }) => {
  useFrame(({ pointer }, delta) => {
    const g = groupRef.current;
    if (!g || frozenRef.current) return; // held still while a star is focused
    const reduce = isReducedMotion();
    // Ambient auto-rotation — delta-based so pausing/resuming doesn't jump.
    if (!reduce) g.rotation.y += delta * SCENE.groupRotateSpeed;
    // Subtle pointer parallax so the scene gently breathes toward the cursor.
    const targetX = reduce ? 0 : pointer.y * SCENE.parallaxAmount;
    const targetZ = reduce ? 0 : -pointer.x * SCENE.parallaxAmount;
    g.rotation.x = lerp(g.rotation.x, targetX, SCENE.parallaxLerp);
    g.rotation.z = lerp(g.rotation.z, targetZ, SCENE.parallaxLerp);
  });

  return (
    <group ref={groupRef}>
      <MoonMesh />
      <OrbitRing />
      <OrbitRing2 />
      <MemoryConstellation />
      <MemoryStars onStarClick={onStarClick} />
      <SolarSystem />
    </group>
  );
};

// Drives the camera through three jobs: the opening dolly, flying in to frame a
// focused memory star (the scene's rotation is held still so the target doesn't
// drift), and flying back to wherever the user was. OrbitControls is disabled
// during the dolly/focus and handed back cleanly afterwards.
const CameraController: React.FC<{
  playIntro: boolean;
  restZ: number;
  controlsRef: React.RefObject<any>;
  groupRef: React.RefObject<THREE.Group | null>;
  frozenRef: React.MutableRefObject<boolean>;
  focusIndex: number;
  focusTotal: number;
}> = ({ playIntro, restZ, controlsRef, groupRef, frozenRef, focusIndex, focusTotal }) => {
  const phase = useRef<'intro' | 'idle' | 'focus' | 'return'>('intro');
  const introElapsed = useRef(0);
  const introStarted = useRef(false);
  const savedPos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const scratch = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current;
    const wantFocus = focusIndex >= 0 && !!groupRef.current;

    // ── Opening dolly ──
    if (phase.current === 'intro') {
      if (controls) controls.enabled = false;
      if (playIntro) {
        camera.position.set(0, 0, CAMERA.introZ);
        camera.lookAt(ORIGIN);
        return;
      }
      if (isReducedMotion()) {
        camera.position.set(0, 0, restZ);
        camera.lookAt(ORIGIN);
        phase.current = 'idle';
        return;
      }
      if (!introStarted.current) { introStarted.current = true; introElapsed.current = 0; }
      introElapsed.current += delta;
      const t = Math.min(introElapsed.current / DUR.cinematic, 1);
      camera.position.z = CAMERA.introZ + (restZ - CAMERA.introZ) * easeOutCubic(t);
      camera.lookAt(ORIGIN);
      if (t >= 1) phase.current = 'idle';
      return;
    }

    // ── Idle: OrbitControls owns the camera ──
    if (phase.current === 'idle') {
      if (controls) controls.enabled = true;
      frozenRef.current = false;
      if (wantFocus) {
        savedPos.current.copy(camera.position);
        look.current.copy(controls ? controls.target : ORIGIN);
        frozenRef.current = true;
        if (controls) controls.enabled = false;
        phase.current = 'focus';
      }
      return;
    }

    // ── Flying to / holding on the focused star ──
    if (phase.current === 'focus') {
      if (controls) controls.enabled = false;
      frozenRef.current = true;
      if (!wantFocus) { phase.current = 'return'; return; }
      const local = getStarPosition(focusIndex, focusTotal);
      const world = scratch.current.set(local[0], local[1], local[2]).applyEuler(groupRef.current!.rotation);
      look.current.lerp(world, STAR.focusLerp);
      // Desired camera position: stand off from the star along the outward radial.
      dir.current.copy(world).normalize().multiplyScalar(STAR.focusGap).add(world);
      camera.position.lerp(dir.current, STAR.focusLerp);
      camera.lookAt(look.current);
      return;
    }

    // ── Returning to where the user was ──
    if (phase.current === 'return') {
      if (controls) controls.enabled = false;
      if (wantFocus) { phase.current = 'focus'; return; }
      camera.position.lerp(savedPos.current, STAR.focusLerp);
      look.current.lerp(ORIGIN, STAR.focusLerp);
      camera.lookAt(look.current);
      if (camera.position.distanceTo(savedPos.current) < 0.03) {
        camera.position.copy(savedPos.current);
        if (controls) { controls.target.set(0, 0, 0); controls.update(); controls.enabled = true; }
        frozenRef.current = false;
        phase.current = 'idle';
      }
      return;
    }
  });

  return null;
};

interface MoonSceneProps {
  onStarClick?: (id: string) => void;
  /** True while the opening logo overlay is showing; gates the camera dolly. */
  playIntro?: boolean;
}

const MoonScene: React.FC<MoonSceneProps> = ({ onStarClick, playIntro = false }) => {
  const { theme, selectMemory, setFocusedMemory, memories, focusedMemoryId } = useStore();
  const isMemorial = useStore(s => !!s.pet.passDate);

  // Reactive breakpoint so camera framing + zoom limits follow window size
  // (was frozen at first render — the "phone mode" distance never updated).
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const frozenRef = useRef(false);

  const targetZ = isMobile ? CAMERA.zMobile : CAMERA.zDesktop;
  const minDistance = isMobile ? 4 : 3;

  // Which star (if any) the camera should fly to — same sort order as the stars.
  const sortedForFocus = sortMemoriesByDate(memories);
  const focusTotal = sortedForFocus.length;
  const focusIndex = focusedMemoryId ? sortedForFocus.findIndex(m => m.id === focusedMemoryId) : -1;

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
    <div className={`moon-scene ${themeConfig.bgClass} ${isMemorial ? 'moon-scene--memorial' : ''}`}>
      <Canvas
        camera={{ position: [0, 0, CAMERA.introZ], fov: CAMERA.fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onPointerMissed={() => { selectMemory(null); setFocusedMemory(null); }}
      >
        {/* Atmospheric depth — distant planets fade into the background colour. */}
        <fogExp2 attach="fog" args={[isMemorial ? '#150f28' : SCENE.fogColor, SCENE.fogDensity]} />
        <ambientLight intensity={themeConfig.ambient} />
        <directionalLight position={[5, 3, 5]} intensity={themeConfig.dirIntensity} color={themeConfig.dirColor} />
        <pointLight position={[-4, -2, 3]} intensity={themeConfig.pointIntensity} color={themeConfig.pointColor} />

        <CameraController
          playIntro={playIntro}
          restZ={targetZ}
          controlsRef={controlsRef}
          groupRef={groupRef}
          frozenRef={frozenRef}
          focusIndex={focusIndex}
          focusTotal={focusTotal}
        />

        <Suspense fallback={null}>
          <MoonSystem onStarClick={onStarClick} groupRef={groupRef} frozenRef={frozenRef} />
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
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={minDistance}
            maxDistance={12}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            autoRotate={false}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Memorial "rainbow bridge" aura */}
      {isMemorial && <div className="memorial-aura" />}

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
