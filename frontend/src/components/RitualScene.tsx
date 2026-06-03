import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface RitualSceneProps {
  sceneType: 'HALL' | 'TOMBSTONE';
  sceneConfig: any;
}

function RitualObjects({ sceneType }: { sceneType: 'HALL' | 'TOMBSTONE' }) {
  // 根据场景类型渲染不同的对象
  if (sceneType === 'HALL') {
    // 祠堂场景 - 简单的祭台
    return (
      <group>
        {/* 祭台 */}
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[4, 1, 2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* 牌位 */}
        <mesh position={[0, 1, -2]}>
          <boxGeometry args={[1.5, 2, 0.2]} />
          <meshStandardMaterial color="#D4AF37" />
        </mesh>
        
        {/* 烛台 - 左 */}
        <mesh position={[-1.5, 0.5, -1.5]}>
          <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        
        {/* 烛台 - 右 */}
        <mesh position={[1.5, 0.5, -1.5]}>
          <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      </group>
    );
  } else {
    // 墓碑场景
    return (
      <group>
        {/* 墓碑 */}
        <mesh position={[0, 1.5, -2]}>
          <boxGeometry args={[2, 3, 0.5]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        
        {/* 基座 */}
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[2.5, 1, 1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        {/* 祭台 */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[3, 0.3, 1.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    );
  }
}

function Flowers({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.3 - 0.3, 0.3, 0]} rotation={[0, i * 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#228B22" />
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#FFB6C1" />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

function Candle({ position, lit }: { position: [number, number, number]; lit?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {lit && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
}

function Incense({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.2 - 0.2, 0.3, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
    </group>
  );
}

export default function RitualScene({ sceneType, sceneConfig }: RitualSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        
        {/* 平行光 */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* 点光源 - 蜡烛效果 */}
        <pointLight position={[-1.5, 1, -1.5]} intensity={0.5} color="#FFD700" />
        <pointLight position={[1.5, 1, -1.5]} intensity={0.5} color="#FFD700" />
        
        {/* 环境贴图 */}
        <Environment preset="sunset" />
        
        {/* 地面 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        
        {/* 场景对象 */}
        <Suspense fallback={null}>
          <RitualObjects sceneType={sceneType} />
        </Suspense>
      </Canvas>
    </div>
  );
}
