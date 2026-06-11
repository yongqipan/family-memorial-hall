import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function MobileMemorialHall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hall' | 'tree' | 'photos' | 'messages'>('hall');
  const [offeringItems, setOfferingItems] = useState<Array<{ type: string; position: [number, number, number]; id: number }>>([]);

  // 祭拜动作配置
  const ritualActions = [
    { type: 'FLOWER', emoji: '💐', label: '献花', color: '#FFB6C1', gradient: 'from-pink-300 to-pink-500' },
    { type: 'CANDLE', emoji: '🕯️', label: '点烛', color: '#FFD700', gradient: 'from-yellow-300 to-yellow-500' },
    { type: 'INCENSE', emoji: '🪵', label: '上香', color: '#8B4513', gradient: 'from-amber-600 to-amber-800' },
    { type: 'BOW', emoji: '🙏', label: '鞠躬', color: '#4169E1', gradient: 'from-blue-400 to-blue-600' },
    { type: 'OFFERING', emoji: '🍎', label: '供奉', color: '#9370DB', gradient: 'from-purple-400 to-purple-600' },
  ];

  // 预创建 emoji 纹理
  const emojiTextures = useMemo(() => {
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
        ctx.font = '100px Arial';
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

  // 处理祭拜
  function handlePerformRitual(ritualType: string) {
    const action = ritualActions.find(a => a.type === ritualType);
    if (!action) return;

    setSelectedRitual(null);
    
    // 添加祭品到场景
    const newItem = {
      type: ritualType,
      id: Date.now(),
    };
    
    const newTotalCount = offeringItems.filter(item => item.type !== 'BOW').length + 1;
    
    const spacingConfig = [
      [],
      [0],
      [-0.4, 0.4],
      [-0.5, 0, 0.5],
      [-0.6, -0.2, 0.2, 0.6],
      [-0.8, -0.4, 0, 0.4, 0.8],
    ];
    
    const xPositions = spacingConfig[Math.min(newTotalCount, 5)];
    
    const updatedItems = [...offeringItems, newItem]
      .filter(item => item.type !== 'BOW')
      .map((item, index) => ({
        ...item,
        position: [xPositions[index], 1.25, -1.6] as [number, number, number],
      }));
    
    setOfferingItems(updatedItems);
  }

  // 渲染祭品
  function renderOffering(item: { type: string; position: [number, number, number]; id: number }) {
    return (
      <group key={item.id} position={item.position}>
        {item.type === 'FLOWER' && (
          <group>
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
              <meshStandardMaterial color="#654321" metalness={0.3} roughness={0.5} />
            </mesh>
            <group position={[0, 0.1, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#C71585" emissive="#C71585" emissiveIntensity={0.2} />
              </mesh>
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
          </group>
        )}
        {item.type === 'CANDLE' && (
          <group>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[0, 0.47, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0.56, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} transparent opacity={0.95} />
            </mesh>
            <mesh position={[0, 0.58, 0]} castShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} />
            </mesh>
            <pointLight position={[0, 0.65, 0]} intensity={1.0} distance={3} color="#FF6600" />
          </group>
        )}
        {item.type === 'INCENSE' && (
          <group>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.12, 16]} />
              <meshStandardMaterial color="#8B4513" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
              <meshStandardMaterial color="#D2B48C" />
            </mesh>
            {[-0.05, 0, 0.05].map((offset, i) => (
              <group key={i} position={[offset, 0.15, 0]}>
                <mesh position={[0, 0.15, 0]} castShadow>
                  <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 0.31, 0]} castShadow>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshStandardMaterial color="#CC0000" emissive="#CC0000" emissiveIntensity={1} />
                </mesh>
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
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.25, 0.08, 24]} />
              <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[-0.12, 0.1, -0.06]} castShadow>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0.1, 0.11, 0.04]} castShadow>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0.04, 0.09, -0.1]} castShadow>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#B22222" emissive="#B22222" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0.15, 0.08, -0.04]} castShadow>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[-0.08, 0.07, 0.08]} castShadow>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#FF8C00" emissive="#FF8C00" emissiveIntensity={0.1} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // 退出登录
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }

  // 渲染内容区域
  function renderContent() {
    switch (activeTab) {
      case 'hall':
        return (
          <div className="flex-1 relative">
            {/* 3D 场景 */}
            <div className="h-full w-full">
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  enableRotate={false}
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
                
                {/* 祭台 */}
                <mesh position={[0, 0.6, -1.8]} castShadow>
                  <boxGeometry args={[4, 1.2, 2.5]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                
                {/* 牌位 */}
                <mesh position={[0, 1.6, -2.8]} castShadow>
                  <boxGeometry args={[1.5, 2, 0.2]} />
                  <meshStandardMaterial color="#D4AF37" />
                </mesh>
                
                {/* 烛台 */}
                <mesh position={[-1.8, 1.2, -1.8]} castShadow>
                  <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
                  <meshStandardMaterial color="#C0C0C0" />
                </mesh>
                <mesh position={[1.8, 1.2, -1.8]} castShadow>
                  <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
                  <meshStandardMaterial color="#C0C0C0" />
                </mesh>
                
                {/* 祭拜物品 */}
                {offeringItems.map(renderOffering)}
              </Canvas>
            </div>

            {/* 祭拜确认对话框 */}
            {selectedRitual && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">确认祭拜</h2>
                  <p className="text-gray-600 mb-6">您确定要执行这个祭拜仪式吗？</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRitual(null)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handlePerformRitual(selectedRitual)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition shadow-lg"
                    >
                      确认
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'tree':
        return (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🌳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">家族树</h2>
              <p className="text-gray-600">家族树功能开发中...</p>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">照片墙</h2>
              <p className="text-gray-600">照片墙功能开发中...</p>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">留言</h2>
              <p className="text-gray-600">留言功能开发中...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 顶部导航栏 - 移动端优化 */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/family')}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <span className="text-2xl">🏠</span>
            </button>
            <div>
              <h1 className="text-lg font-bold">纪念堂</h1>
              <p className="text-xs text-amber-200">永远怀念，永远爱</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
          >
            退出
          </button>
        </div>
      </header>

      {/* 内容区域 */}
      {renderContent()}

      {/* 底部祭拜按钮栏 - 仅在祭拜页面显示 */}
      {activeTab === 'hall' && (
        <div className="bg-white border-t border-gray-200 px-3 py-3 safe-area-pb">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ritualActions.map((action) => (
              <button
                key={action.type}
                onClick={() => setSelectedRitual(action.type)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${action.gradient} flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95`}
              >
                <span className="text-3xl">{action.emoji}</span>
                <span className="text-xs font-medium text-white drop-shadow">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 底部导航栏 */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
        <div className="flex justify-around">
          {[
            { id: 'hall', icon: '🏛️', label: '祭拜' },
            { id: 'tree', icon: '🌳', label: '家族' },
            { id: 'photos', icon: '📸', label: '照片' },
            { id: 'messages', icon: '💌', label: '留言' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
                activeTab === tab.id
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
