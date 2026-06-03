import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function MemorialHall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);

  const ritualActions = [
    { type: 'FLOWER', icon: '💐', label: '献花', color: '#FFB6C1' },
    { type: 'CANDLE', icon: '🕯️', label: '点烛', color: '#FFD700' },
    { type: 'INCENSE', icon: '🌿', label: '上香', color: '#8B4513' },
    { type: 'BOW', icon: '🙏', label: '鞠躬', color: '#4169E1' },
    { type: 'OFFERING', icon: '🍎', label: '供奉', color: '#9370DB' },
  ];

  async function handlePerformRitual(ritualType: string) {
    alert(`祭拜成功：${ritualType}`);
    setSelectedRitual(null);
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
          
          {/* 祭台 */}
          <mesh position={[0, 0, -2]} castShadow>
            <boxGeometry args={[4, 1, 2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* 牌位 */}
          <mesh position={[0, 1, -2]} castShadow>
            <boxGeometry args={[1.5, 2, 0.2]} />
            <meshStandardMaterial color="#D4AF37" />
          </mesh>
          
          {/* 烛台 - 左 */}
          <mesh position={[-1.5, 0.5, -1.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
          
          {/* 烛台 - 右 */}
          <mesh position={[1.5, 0.5, -1.5]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
        </Canvas>

        {/* 祭拜按钮 */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
        }}>
          {ritualActions.map((action) => (
            <button
              key={action.type}
              onClick={() => setSelectedRitual(action.type)}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: action.color,
                border: 'none',
                fontSize: '32px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title={action.label}
            />
          ))}
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

        {/* 统计信息 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span style={{ fontWeight: '500' }}>今日祭拜:</span>{' '}
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>0</span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <span style={{ fontWeight: '500' }}>累计祭拜:</span>{' '}
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>0</span>
          </div>
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
