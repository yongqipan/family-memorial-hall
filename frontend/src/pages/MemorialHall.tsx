import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function getIconEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    'FLOWER': '💐',
    'CANDLE': '🕯️',
    'INCENSE': '🪵',
    'BOW': '🙏',
    'OFFERING': '🍎',
  };
  return emojiMap[type] || '💐';
}

export default function MemorialHall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const [animationMessage, setAnimationMessage] = useState<string | null>(null);
  const [offeringItems, setOfferingItems] = useState<Array<{ type: string; position: [number, number, number]; id: number }>>([]);

  const ritualActions = [
    { type: 'FLOWER', emoji: '💐', label: '献花', color: '#FFB6C1' },
    { type: 'CANDLE', emoji: '🕯️', label: '点烛', color: '#FFD700' },
    { type: 'INCENSE', emoji: '🪵', label: '上香', color: '#8B4513' },
    { type: 'BOW', emoji: '🙏', label: '鞠躬', color: '#4169E1' },
    { type: 'OFFERING', emoji: '🍎', label: '供奉', color: '#9370DB' },
  ];

  // 预创建 emoji 纹理
  const emojiTextures = React.useMemo(() => {
    const textures: Record<string, THREE.CanvasTexture> = {};
    const emojis: Record<string, string> = {
      FLOWER: '💐',
      CANDLE: '🕯️',
      INCENSE: '🪵',
      OFFERING: '🍎',
    };
    
    Object.entries(emojis).forEach(([type, emoji]) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      textures[type] = texture;
    });
    
    return textures;
  }, []);

  async function handlePerformRitual(ritualType: string) {
    const action = ritualActions.find(a => a.type === ritualType);
    if (!action) return;

    setSelectedRitual(null);
    setAnimationMessage(`${action.emoji} ${action.label}成功！`);
    
    // 添加祭品到场景 - 摆放在祭台桌面上，牌位前方
    const itemCount = offeringItems.filter(item => item.type !== 'BOW').length;
    // 祭台表面 y=1.2, 物品底部放在 y=1.25（略高于表面）
    // z 轴：牌位在 z=-2.8（牌位底部），祭品放在 z=-1.6 左右（祭台前方区域）
    const positions = [
      [-0.8, 1.25, -1.6],  // 左
      [-0.4, 1.25, -1.6],  // 左中
      [0, 1.25, -1.6],     // 中
      [0.4, 1.25, -1.6],   // 右中
      [0.8, 1.25, -1.6],   // 右
    ];
    
    if (ritualType !== 'BOW' && itemCount < 5) {
      setOfferingItems(prev => [
        ...prev,
        {
          type: ritualType,
          position: [
            positions[itemCount][0],
            1.25,  // 祭台表面高度
            -1.6,  // 放在祭台前方
          ],
          id: Date.now(),
        },
      ]);
    }
    
    // 显示动画消息 2 秒后消失
    setTimeout(() => {
      setAnimationMessage(null);
    }, 2000);
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '12px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/family')}
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
              }}
            >
              🏠
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>纪念堂</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate(`/memorials/${id}/biography`)} style={navButtonStyle}>生平故事</button>
            <button onClick={() => navigate(`/memorials/${id}/media`)} style={navButtonStyle}>照片墙</button>
            <button onClick={() => navigate(`/memorials/${id}/messages`)} style={navButtonStyle}>留言</button>
          </div>
        </div>
      </header>

      {/* 3D 场景 */}
      <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}>
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-2, 2, -2]} intensity={0.5} color="#FFD700" />
          <pointLight position={[2, 2, -2]} intensity={0.5} color="#FFD700" />
          
          {/* 地面 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#2F4F4F" />
          </mesh>
          
          {/* 祭台 - 祭台表面在 y=0.6 */}
          <mesh position={[0, 0.6, -1.8]} castShadow>
            <boxGeometry args={[4, 1.2, 2.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* 牌位 - 立在祭台后方 */}
          <mesh position={[0, 1.6, -2.8]} castShadow>
            <boxGeometry args={[1.5, 2, 0.2]} />
            <meshStandardMaterial color="#D4AF37" />
          </mesh>
          
          {/* 烛台 - 左（在祭台两侧） */}
          <mesh position={[-1.8, 1.2, -1.8]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
          
          {/* 烛台 - 右 */}
          <mesh position={[1.8, 1.2, -1.8]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>

          {/* 祭拜物品 */}
          {offeringItems.map((item) => (
            <group key={item.id} position={item.position}>
              {item.type === 'FLOWER' && (
                <group>
                  {/* 花瓶 - 底部在 y=0 */}
                  <mesh position={[0, 0.04, 0]} castShadow>
                    <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
                    <meshStandardMaterial color="#654321" metalness={0.3} roughness={0.5} />
                  </mesh>
                  {/* 花束 */}
                  <group position={[0, 0.1, 0]}>
                    {/* 中心玫瑰花 - 多层花瓣 */}
                    <group position={[0, 0.08, 0]}>
                      {/* 花心 */}
                      <mesh castShadow>
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshStandardMaterial color="#C71585" emissive="#C71585" emissiveIntensity={0.2} />
                      </mesh>
                      {/* 内层花瓣 - 5 片 */}
                      {[0, 72, 144, 216, 288].map((angleDeg, i) => (
                        <mesh
                          key={i}
                          position={[
                            Math.sin((angleDeg * Math.PI) / 180) * 0.035,
                            0.02,
                            Math.cos((angleDeg * Math.PI) / 180) * 0.035,
                          ]}
                          rotation={[-0.4, (angleDeg * Math.PI) / 180, 0]}
                          scale={[1, 0.6, 1]}
                          castShadow
                        >
                          <sphereGeometry args={[0.038, 8, 8]} />
                          <meshStandardMaterial color="#DB7093" emissive="#DB7093" emissiveIntensity={0.15} />
                        </mesh>
                      ))}
                      {/* 中层花瓣 - 8 片 */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angleDeg, i) => (
                        <mesh
                          key={i}
                          position={[
                            Math.sin((angleDeg * Math.PI) / 180) * 0.055,
                            0,
                            Math.cos((angleDeg * Math.PI) / 180) * 0.055,
                          ]}
                          rotation={[-0.25, (angleDeg * Math.PI) / 180, 0]}
                          scale={[1.2, 0.5, 1.2]}
                          castShadow
                        >
                          <sphereGeometry args={[0.045, 8, 8]} />
                          <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.12} />
                        </mesh>
                      ))}
                      {/* 外层花瓣 - 10 片 */}
                      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angleDeg, i) => (
                        <mesh
                          key={i}
                          position={[
                            Math.sin((angleDeg * Math.PI) / 180) * 0.075,
                            -0.02,
                            Math.cos((angleDeg * Math.PI) / 180) * 0.075,
                          ]}
                          rotation={[0.15, (angleDeg * Math.PI) / 180, 0]}
                          scale={[1.3, 0.4, 1.3]}
                          castShadow
                        >
                          <sphereGeometry args={[0.05, 8, 8]} />
                          <meshStandardMaterial color="#FFB6C1" emissive="#FFB6C1" emissiveIntensity={0.1} />
                        </mesh>
                      ))}
                    </group>
                    {/* 周围小花苞 - 4 个 */}
                    {[45, 135, 225, 315].map((angleDeg, i) => {
                      const angle = (angleDeg * Math.PI) / 180;
                      return (
                        <group
                          key={i}
                          position={[
                            Math.sin(angle) * 0.1,
                            0.03,
                            Math.cos(angle) * 0.1,
                          ]}
                          rotation={[0.2, angle, 0]}
                        >
                          <mesh position={[0, 0.03, 0]} castShadow>
                            <coneGeometry args={[0.025, 0.06, 8]} />
                            <meshStandardMaterial color="#FFB6C1" emissive="#FFB6C1" emissiveIntensity={0.1} />
                          </mesh>
                        </group>
                      );
                    })}
                    {/* 绿叶 - 5 片 */}
                    {[0, 72, 144, 216, 288].map((angleDeg, i) => {
                      const angle = (angleDeg * Math.PI) / 180;
                      return (
                        <mesh
                          key={i}
                          position={[
                            Math.sin(angle) * 0.07,
                            -0.03,
                            Math.cos(angle) * 0.07,
                          ]}
                          rotation={[0.5, angle, 0]}
                          scale={[1, 0.3, 1.5]}
                          castShadow
                        >
                          <sphereGeometry args={[0.035, 8, 8]} />
                          <meshStandardMaterial color="#228B22" />
                        </mesh>
                      );
                    })}
                  </group>
                </group>
              )}
              {item.type === 'CANDLE' && (
                <group>
                  {/* 金色底座 - 底部在 y=0 */}
                  <mesh position={[0, 0.05, 0]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                    <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.3} />
                  </mesh>
                  {/* 蜡烛主体 */}
                  <mesh position={[0, 0.25, 0]} castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
                  </mesh>
                  {/* 烛芯 */}
                  <mesh position={[0, 0.47, 0]} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
                    <meshStandardMaterial color="#1a1a1a" />
                  </mesh>
                  {/* 火焰 */}
                  <mesh position={[0, 0.56, 0]} castShadow>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} transparent opacity={0.95} />
                  </mesh>
                  {/* 火焰中心 */}
                  <mesh position={[0, 0.58, 0]} castShadow>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} />
                  </mesh>
                  {/* 烛光点光源 */}
                  <pointLight position={[0, 0.65, 0]} intensity={1.0} distance={3} color="#FF6600" />
                </group>
              )}
              {item.type === 'INCENSE' && (
                <group>
                  {/* 香炉底座 - 底部在 y=0 */}
                  <mesh position={[0, 0.06, 0]} castShadow>
                    <cylinderGeometry args={[0.18, 0.22, 0.12, 16]} />
                    <meshStandardMaterial color="#8B4513" metalness={0.4} roughness={0.5} />
                  </mesh>
                  {/* 香炉中的沙子 */}
                  <mesh position={[0, 0.12, 0]} castShadow>
                    <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
                    <meshStandardMaterial color="#D2B48C" />
                  </mesh>
                  {/* 3 根香 - 插在沙子里 */}
                  {[-0.05, 0, 0.05].map((offset, i) => (
                    <group key={i} position={[offset, 0.15, 0]}>
                      {/* 香身 */}
                      <mesh position={[0, 0.15, 0]} castShadow>
                        <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
                        <meshStandardMaterial color="#8B4513" />
                      </mesh>
                      {/* 燃烧的红色香头 */}
                      <mesh position={[0, 0.31, 0]} castShadow>
                        <sphereGeometry args={[0.025, 8, 8]} />
                        <meshStandardMaterial color="#CC0000" emissive="#CC0000" emissiveIntensity={1} />
                      </mesh>
                      {/* 烟雾 */}
                      <mesh position={[0, 0.38, 0]} castShadow>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshStandardMaterial color="#DDD" transparent opacity={0.4} />
                      </mesh>
                    </group>
                  ))}
                </group>
              )}
              {item.type === 'OFFERING' && (
                <group>
                  {/* 金色果盘 - 底部在 y=0 */}
                  <mesh position={[0, 0.04, 0]} castShadow>
                    <cylinderGeometry args={[0.3, 0.25, 0.08, 24]} />
                    <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.2} />
                  </mesh>
                  {/* 红苹果 1 */}
                  <mesh position={[-0.12, 0.1, -0.06]} castShadow>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.1} />
                  </mesh>
                  {/* 红苹果 2 */}
                  <mesh position={[0.1, 0.11, 0.04]} castShadow>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.1} />
                  </mesh>
                  {/* 红苹果 3 */}
                  <mesh position={[0.04, 0.09, -0.1]} castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#B22222" emissive="#B22222" emissiveIntensity={0.1} />
                  </mesh>
                  {/* 橘子 1 */}
                  <mesh position={[0.15, 0.08, -0.04]} castShadow>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={0.1} />
                  </mesh>
                  {/* 橘子 2 */}
                  <mesh position={[-0.08, 0.07, 0.08]} castShadow>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#FF8C00" emissive="#FF8C00" emissiveIntensity={0.1} />
                  </mesh>
                </group>
              )}
            </group>
          ))}
        </Canvas>

        {/* 右侧祭拜物品栏 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 20,
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', textAlign: 'center' }}>
            祭拜物品
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ritualActions.map((action) => (
              <button
                key={action.type}
                onClick={() => setSelectedRitual(action.type)}
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'white',
                  border: '2px solid ' + action.color,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                title={action.label}
              >
                <span style={{ fontSize: '36px' }}>{getIconEmoji(action.type)}</span>
                <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 祭拜确认对话框 */}
        {selectedRitual && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              maxWidth: '400px',
              margin: '0 20px',
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                确认祭拜
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                您确定要执行这个祭拜仪式吗？
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedRitual(null)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => handlePerformRitual(selectedRitual)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#D4AF37',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 祭拜成功动画 */}
        {animationMessage && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255,215,0,0.95)',
            padding: '24px 48px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 30,
            animation: 'fadeInOut 2s ease-in-out',
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center' }}>
              {animationMessage}
            </div>
          </div>
        )}

        {/* 操作提示 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '12px',
          borderRadius: '8px',
          color: '#6b7280',
          fontSize: '13px',
          zIndex: 10,
        }}>
          🖱️ 拖拽旋转视角 | 滚轮缩放
        </div>
      </div>
    </div>
  );
}

const navButtonStyle = {
  padding: '8px 12px',
  fontSize: '14px',
  color: '#4b5563',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: 'background-color 0.2s',
};

// 添加动画样式
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }
    40% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
  }
`;
if (!document.getElementById('memorial-hall-styles')) {
  styleElement.id = 'memorial-hall-styles';
  document.head.appendChild(styleElement);
}
