import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { useTheme } from '@/utils/useTheme';
import { ORBIT_SKILLS } from './content';
import styles from './style.module.css';

type SceneColors = {
  core: string;
  wire: string;
  node: string;
  particle: string;
};

// The palette lives in CSS (index.css) so both themes are defined in one place; the scene just reads it.
function useSceneColors(): SceneColors {
  const theme = useTheme();

  return useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string) => css.getPropertyValue(name).trim();

    return {
      core: read('--scene-core'),
      wire: read('--scene-wire'),
      node: read('--scene-node'),
      particle: read('--scene-particle'),
    };
    // theme is the trigger: the CSS variables change with <html data-theme>.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Core({ colors }: { colors: SceneColors }) {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (shell.current) {
      shell.current.rotation.x += delta * 0.15;
      shell.current.rotation.y += delta * 0.2;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.35;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color={colors.wire} wireframe transparent opacity={0.55} />
      </mesh>

      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function SkillOrbit({ colors }: { colors: SceneColors }) {
  const group = useRef<THREE.Group>(null);
  // Html labels are sized in CSS pixels, so shrink them along with the canvas on small screens.
  const width = useThree((state) => state.size.width);
  const labelScale = 8 * Math.min(1, width / 560);

  const nodes = useMemo(
    () =>
      ORBIT_SKILLS.map((skill, index) => {
        const angle = (index / ORBIT_SKILLS.length) * Math.PI * 2;
        // Alternate the height so labels don't sit on a flat ring.
        const y = index % 2 === 0 ? 0.45 : -0.45;
        return { skill, position: [Math.cos(angle) * 2.6, y, Math.sin(angle) * 2.6] as const };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group} rotation={[0.22, 0, -0.12]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.006, 8, 160]} />
        <meshBasicMaterial color={colors.wire} transparent opacity={0.35} />
      </mesh>

      {nodes.map(({ skill, position }) => (
        <group key={skill} position={position}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={colors.node} />
          </mesh>
          <Html center distanceFactor={labelScale} zIndexRange={[10, 0]}>
            <span className={styles.orbitLabel}>{skill}</span>
          </Html>
        </group>
      ))}
    </group>
  );
}

function Particles({ colors, count = 420 }: { colors: SceneColors; count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread on a thick spherical shell around the core.
      const radius = 3.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi);
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y -= delta * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={colors.particle} size={0.03} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

// A floor of bars that ripples like a 3D contribution chart. Decorative only, not real data.
function ContributionFloor({ colors }: { colors: SceneColors }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const columns = 22;
  const rows = 8;
  const gap = 0.26;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: columns * rows }, () => Math.random()), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();

    for (let x = 0; x < columns; x++) {
      for (let z = 0; z < rows; z++) {
        const index = x * rows + z;
        const wave = Math.sin(x * 0.45 + time * 1.2) * Math.cos(z * 0.6 + time * 0.8);
        const height = 0.04 + Math.max(0, wave * 0.35 + seeds[index] * 0.25);

        dummy.position.set((x - columns / 2) * gap, -2.3 + height / 2, (z - rows / 2) * gap);
        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(index, dummy.matrix);
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, columns * rows]}>
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshStandardMaterial color={colors.core} transparent opacity={0.55} roughness={0.5} />
    </instancedMesh>
  );
}

// Pulls the camera back on narrow stages so the whole orbit (plus a margin) fits horizontally.
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const halfFov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2);
    const distance = 3.7 / (Math.tan(halfFov) * aspect);
    camera.position.setLength(THREE.MathUtils.clamp(distance, 7.5, 12));
  }, [camera, size]);

  return null;
}

// Tilts the whole scene a little toward the pointer for a parallax feel.
function PointerParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    const ease = 1 - Math.exp(-delta * 3);
    group.current.rotation.y += (pointer.x * 0.25 - group.current.rotation.y) * ease;
    group.current.rotation.x += (-pointer.y * 0.15 - group.current.rotation.x) * ease;
  });

  return <group ref={group}>{children}</group>;
}

export default function Scene3D() {
  const colors = useSceneColors();
  const reducedMotion = useMemo(prefersReducedMotion, []);

  return (
    <Canvas
      className={styles.canvas}
      camera={{ position: [0, 0.6, 7.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // With reduced motion the scene renders once and only updates on interaction.
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color={colors.core} />
      <pointLight position={[-4, -2, -3]} intensity={25} color={colors.node} />

      <PointerParallax>
        <Core colors={colors} />
        <SkillOrbit colors={colors} />
        <Particles colors={colors} />
        <ContributionFloor colors={colors} />
      </PointerParallax>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
