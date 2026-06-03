import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x16213e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    
    const canvasWrapper = document.createElement('div');
    canvasWrapper.style.position = 'absolute';
    canvasWrapper.style.top = '0';
    canvasWrapper.style.left = '0';
    canvasWrapper.style.width = '100%';
    canvasWrapper.style.height = '100%';
    canvasWrapper.style.zIndex = '1';
    canvasContainerRef.current = canvasWrapper;
    
    canvasWrapper.appendChild(renderer.domElement);
    containerRef.current.appendChild(canvasWrapper);

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

    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const altarGeometry = new THREE.BoxGeometry(4, 1, 2);
    const altarMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const altar = new THREE.Mesh(altarGeometry, altarMaterial);
    altar.position.set(0, 0, -2);
    altar.castShadow = true;
    scene.add(altar);

    const tabletGeometry = new THREE.BoxGeometry(1.5, 2, 0.2);
    const tabletMaterial = new THREE.MeshStandardMaterial({ color: 0xD4AF37 });
    const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
    tablet.position.set(0, 1, -2);
    tablet.castShadow = true;
    scene.add(tablet);

    const candleLeftGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
    const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
    const candleLeft = new THREE.Mesh(candleLeftGeometry, candleMaterial);
    candleLeft.position.set(-1.5, 0.5, -1.5);
    candleLeft.castShadow = true;
    scene.add(candleLeft);

    const candleRight = new THREE.Mesh(candleLeftGeometry, candleMaterial);
    candleRight.position.set(1.5, 0.5, -1.5);
    candleRight.castShadow = true;
    scene.add(candleRight);

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

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = (window.innerWidth / window.devicePixelRatio) / (window.innerHeight / window.devicePixelRatio);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (canvasContainerRef.current && containerRef.current) {
        containerRef.current.removeChild(canvasContainerRef.current);
      }
    };
  }, []);

  const performRitual = (type: string) => {
    if (!sceneRef.current || isAnimating) return;
    setIsAnimating(true);

    if (type === 'FLOWER') {
      const flowerGroup = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        const flowerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xFFB6C1, emissive: 0xFFB6C1, emissiveIntensity: 0.3 });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.y = 0.25;
        stem.add(flower);
        stem.position.x = (i - 2) * 0.1;
        stem.rotation.z = (Math.random() - 0.5) * 0.3;
        flowerGroup.add(stem);
      }
      flowerGroup.position.set(0, 2, 3);
      sceneRef.current.add(flowerGroup);
      let progress = 0;
      const animateDrop = () => {
        progress += 0.02;
        if (progress >= 1) { setIsAnimating(false); return; }
        flowerGroup.position.y = 2 - (2 - 0.6) * progress;
        flowerGroup.position.z = 3 - (3 - -1.8) * progress;
        flowerGroup.rotation.x = -Math.PI / 4 + (Math.PI / 4) * progress;
        requestAnimationFrame(animateDrop);
      };
      animateDrop();
    } else if (type === 'CANDLE') {
      const candleGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
      const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.2 });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      const flameGeometry = new THREE.SphereGeometry(0.06, 8, 8);
      const flameMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6600, emissive: 0xFF6600, emissiveIntensity: 1 });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.y = 0.2;
      candle.add(flame);
      const flameLight = new THREE.PointLight(0xFF6600, 1, 3);
      flameLight.position.y = 0.25;
      candle.add(flameLight);
      candle.position.set(0, 2, 3);
      sceneRef.current.add(candle);
      let progress = 0;
      const animateDrop = () => {
        progress += 0.02;
        if (progress >= 1) {
          const flicker = () => {
            flame.scale.setScalar(1 + Math.sin(Date.now() * 0.01) * 0.1);
            flameLight.intensity = 1 + Math.sin(Date.now() * 0.01) * 0.3;
            requestAnimationFrame(flicker);
          };
          flicker();
          setIsAnimating(false);
          return;
        }
        candle.position.y = 2 - (2 - 0.65) * progress;
        candle.position.z = 3 - (3 - -1.9) * progress;
        requestAnimationFrame(animateDrop);
      };
      animateDrop();
    } else if (type === 'INCENSE') {
      const incenseGroup = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const incenseGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6);
        const incenseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const incense = new THREE.Mesh(incenseGeometry, incenseMaterial);
        const tipGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 6);
        const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xCC0000, emissive: 0xCC0000, emissiveIntensity: 0.5 });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.y = 0.225;
        incense.add(tip);
        incense.position.x = (i - 1) * 0.08;
        incenseGroup.add(incense);
      }
      incenseGroup.position.set(0, 2, 3);
      sceneRef.current.add(incenseGroup);
      let progress = 0;
      const animateDrop = () => {
        progress += 0.02;
        if (progress >= 1) { setIsAnimating(false); return; }
        incenseGroup.position.y = 2 - (2 - 0.65) * progress;
        incenseGroup.position.z = 3 - (3 - -1.85) * progress;
        requestAnimationFrame(animateDrop);
      };
      animateDrop();
    } else if (type === 'BOW') {
      const personGroup = new THREE.Group();
      const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      personGroup.add(body);
      const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.5;
      personGroup.add(head);
      personGroup.position.set(0, 0, 1);
      sceneRef.current.add(personGroup);
      let bowAngle = 0;
      let bowDirection = 1;
      let bowCount = 0;
      const animateBow = () => {
        bowAngle += 0.05 * bowDirection;
        if (bowAngle >= Math.PI / 4) bowDirection = -1;
        else if (bowAngle <= 0) {
          bowDirection = 1;
          bowCount++;
          if (bowCount >= 3) {
            let fadeOut = 0;
            const fadeAnimation = () => {
              fadeOut += 0.05;
              personGroup.scale.setScalar(1 - fadeOut);
              if (fadeOut < 1) requestAnimationFrame(fadeAnimation);
              else { sceneRef.current?.remove(personGroup); setIsAnimating(false); }
            };
            fadeAnimation();
            return;
          }
        }
        personGroup.rotation.x = bowAngle;
        requestAnimationFrame(animateBow);
      };
      animateBow();
    } else if (type === 'OFFERING') {
      const offeringGroup = new THREE.Group();
      const plateGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.05, 16);
      const plateMaterial = new THREE.MeshStandardMaterial({ color: 0xD4AF37 });
      const plate = new THREE.Mesh(plateGeometry, plateMaterial);
      offeringGroup.add(plate);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const appleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, emissive: 0xFF0000, emissiveIntensity: 0.2 });
        const apple = new THREE.Mesh(appleGeometry, appleMaterial);
        apple.position.set(Math.cos(angle) * 0.2, 0.1, Math.sin(angle) * 0.2);
        plate.add(apple);
      }
      offeringGroup.position.set(0, 2, 3);
      sceneRef.current.add(offeringGroup);
      let progress = 0;
      const animateDrop = () => {
        progress += 0.02;
        if (progress >= 1) {
          const glow = () => {
            const intensity = 0.2 + Math.sin(Date.now() * 0.005) * 0.1;
            offeringGroup.children.forEach((child: any) => {
              if (child.material.emissive) child.material.emissiveIntensity = intensity;
            });
            requestAnimationFrame(glow);
          };
          glow();
          setIsAnimating(false);
          return;
        }
        offeringGroup.position.y = 2 - (2 - 0.65) * progress;
        offeringGroup.position.z = 3 - (3 - -1.7) * progress;
        requestAnimationFrame(animateDrop);
      };
      animateDrop();
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: 'white', padding: '12px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>🏛️ 亲人纪念堂</h1>
      </header>
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* 3D 场景区域 */}
        <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10 }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}><span style={{ fontWeight: '500' }}>今日祭拜:</span> <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>0</span></div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}><span style={{ fontWeight: '500' }}>累计祭拜:</span> <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37' }}>0</span></div>
          </div>
          <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '8px', color: '#6b7280', fontSize: '13px', zIndex: 10 }}>🖱️ 拖拽旋转视角 | 滚轮缩放</div>
        </div>

        {/* 右侧祭拜物品栏 */}
        <div style={{ 
          width: '120px', 
          backgroundColor: '#f8f9fa',
          borderLeft: '1px solid #e0e0e0',
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          zIndex: 20,
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>祭拜物品</div>
          
          {/* 鲜花 */}
          <div 
            onClick={() => performRitual('FLOWER')}
            style={{ 
              width: '70px', 
              height: '70px', 
              backgroundColor: '#FFB6C1',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1)')}
            title="献花"
          >
            <span style={{ fontSize: '32px' }}>💐</span>
            <span style={{ fontSize: '12px', color: '#333', marginTop: '4px' }}>献花</span>
          </div>

          {/* 蜡烛 */}
          <div 
            onClick={() => performRitual('CANDLE')}
            style={{ 
              width: '70px', 
              height: '70px', 
              backgroundColor: '#FFD700',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1)')}
            title="点烛"
          >
            <span style={{ fontSize: '32px' }}>🕯️</span>
            <span style={{ fontSize: '12px', color: '#333', marginTop: '4px' }}>点烛</span>
          </div>

          {/* 香 */}
          <div 
            onClick={() => performRitual('INCENSE')}
            style={{ 
              width: '70px', 
              height: '70px', 
              backgroundColor: '#8B4513',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1)')}
            title="上香"
          >
            <span style={{ fontSize: '32px' }}>🌿</span>
            <span style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>上香</span>
          </div>

          {/* 鞠躬 */}
          <div 
            onClick={() => performRitual('BOW')}
            style={{ 
              width: '70px', 
              height: '70px', 
              backgroundColor: '#4169E1',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1)')}
            title="鞠躬"
          >
            <span style={{ fontSize: '32px' }}>🙏</span>
            <span style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>鞠躬</span>
          </div>

          {/* 供奉 */}
          <div 
            onClick={() => performRitual('OFFERING')}
            style={{ 
              width: '70px', 
              height: '70px', 
              backgroundColor: '#9370DB',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isAnimating && (e.currentTarget.style.transform = 'scale(1)')}
            title="供奉"
          >
            <span style={{ fontSize: '32px' }}>🍎</span>
            <span style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>供奉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
