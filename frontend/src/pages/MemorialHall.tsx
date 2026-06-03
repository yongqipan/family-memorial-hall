import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RitualScene from '../components/RitualScene';
import { performRitual } from '../services/memorial.service';
import { Flower, Candlestick, Flame, User, Gift, MessageSquare, Image, Home, User as UserIcon } from 'lucide-react';

export default function MemorialHall() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRitualMenu, setShowRitualMenu] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<'FLOWER' | 'CANDLE' | 'INCENSE' | 'BOW' | 'OFFERING' | null>(null);

  const ritualActions = [
    { type: 'FLOWER' as const, icon: Flower, label: '献花', color: 'bg-pink-500' },
    { type: 'CANDLE' as const, icon: Candlestick, label: '点烛', color: 'bg-yellow-500' },
    { type: 'INCENSE' as const, icon: Flame, label: '上香', color: 'bg-amber-700' },
    { type: 'BOW' as const, icon: User, label: '鞠躬', color: 'bg-blue-500' },
    { type: 'OFFERING' as const, icon: Gift, label: '供奉', color: 'bg-purple-500' },
  ];

  async function handlePerformRitual(ritualType: typeof selectedRitual) {
    if (!id || !ritualType) return;
    
    try {
      await performRitual(id, {
        ritualType,
        ritualData: {
          flowerType: 'chrysanthemum',
          color: 'white',
        },
      });
      alert('祭拜成功');
      setShowRitualMenu(false);
      setSelectedRitual(null);
    } catch (error) {
      console.error('祭拜失败:', error);
      alert('祭拜失败，请稍后重试');
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/family')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Home className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">纪念堂</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/memorials/${id}/biography`)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              生平故事
            </button>
            <button
              onClick={() => navigate(`/memorials/${id}/media`)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              照片墙
            </button>
            <button
              onClick={() => navigate(`/memorials/${id}/messages`)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              留言
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* 3D 场景 */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-gray-800">
        <Canvas shadows className="w-full h-full">
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={2}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-2, 2, -2]} intensity={0.5} color="#FFD700" />
          <pointLight position={[2, 2, -2]} intensity={0.5} color="#FFD700" />
          <RitualScene sceneType="HALL" sceneConfig={{}} />
        </Canvas>

        {/* 祭拜按钮 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {ritualActions.map((action) => (
            <button
              key={action.type}
              onClick={() => {
                setSelectedRitual(action.type);
                setShowRitualMenu(true);
              }}
              className={`${action.color} text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform`}
              title={action.label}
            >
              <action.icon className="w-6 h-6" />
            </button>
          ))}
        </div>

        {/* 祭拜确认对话框 */}
        {showRitualMenu && selectedRitual && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                确认{ritualActions.find(a => a.type === selectedRitual)?.label}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                您确定要执行这个祭拜仪式吗？
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowRitualMenu(false);
                    setSelectedRitual(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={() => handlePerformRitual(selectedRitual)}
                  className="flex-1 px-4 py-2 bg-ceremonial-gold text-white rounded-lg hover:bg-yellow-600"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="mb-2">
              <span className="font-medium">今日祭拜:</span>{' '}
              <span className="text-lg font-bold text-ceremonial-gold">0</span>
            </div>
            <div>
              <span className="font-medium">累计祭拜:</span>{' '}
              <span className="text-lg font-bold text-ceremonial-gold">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
