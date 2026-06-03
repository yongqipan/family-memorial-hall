import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x16213e);

    // 创建相机
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // 创建渲染器（只创建一次）
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    
    // 清空容器并添加 canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xFFD700, 0.5);
    pointLight1.position.set(-2, 2, -2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFD700, 0.5);
    pointLight2.position.set(2, 2, -2);
    scene.add(pointLight2);

    // 地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // 祭台
    const altarGeometry = new THREE.BoxGeometry(4, 1, 2);
    const altarMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const altar = new THREE.Mesh(altarGeometry, altarMaterial);
    altar.position.set(0, 0, -2);
    altar.castShadow = true;
    scene.add(altar);

    // 牌位
    const tabletGeometry = new THREE.BoxGeometry(1.5, 2, 0.2);
    const tabletMaterial = new THREE.MeshStandardMaterial({ color: 0xD4AF37 });
    const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
    tablet.position.set(0, 1, -2);
    tablet.castShadow = true;
    scene.add(tablet);

    // 烛台 - 左
    const candleLeftGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
    const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
    const candleLeft = new THREE.Mesh(candleLeftGeometry, candleMaterial);
    candleLeft.position.set(-1.5, 0.5, -1.5);
    candleLeft.castShadow = true;
    scene.add(candleLeft);

    // 烛台 - 右
    const candleRight = new THREE.Mesh(candleLeftGeometry, candleMaterial);
    candleRight.position.set(1.5, 0.5, -1.5);
    candleRight.castShadow = true;
    scene.add(candleRight);

    // 简单的轨道控制
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngleX = 0;
    let cameraAngleY = Math.PI / 4;
    let cameraDistance = 5;

    const updateCamera = () => {
      camera.position.x = cameraDistance * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraDistance * Math.sin(cameraAngleY);
      camera.position.z = cameraDistance * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(0, 0.5, -2);
    };
    updateCamera();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      cameraAngleX -= deltaX * 0.01;
      cameraAngleY = Math.max(0.1, Math.min(Math.PI / 2.2, cameraAngleY - deltaY * 0.01));
      updateCamera();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(2, Math.min(10, cameraDistance + e.deltaY * 0.01));
      updateCamera();
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 响应窗口大小变化
    const handleResize = () => {
      camera.aspect = (window.innerWidth / window.devicePixelRatio) / (window.innerHeight / window.devicePixelRatio);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
    };
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  const ritualActions = [
    { type: 'FLOWER', icon: '💐', label: '献花', color: '#FFB6C1' },
    { type: 'CANDLE', icon: '🕯️', label: '点烛', color: '#FFD700' },
    { type: 'INCENSE', icon: '🌿', label: '上香', color: '#8B4513' },
    { type: 'BOW', icon: '🙏', label: '鞠躬', color: '#4169E1' },
    { type: 'OFFERING', icon: '🍎', label: '供奉', color: '#9370DB' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <header style={{
        backgroundColor: 'white',
        padding: '12px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
          🏛️ 亲人纪念堂
        </h1>
      </header>

      {/* 3D 场景容器 */}
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
        }} 
      >
        {/* 祭拜按钮 */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          zIndex: 10,
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
              }}
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
                  onClick={() => {
                    alert('祭拜成功！');
                    setSelectedRitual(null);
                  }}
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
          zIndex: 10,
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

        {/* 操作提示 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
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
