import { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // 未登录时显示提示，但仍然允许访问（演示用）
    return (
      <>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fef3c7',
          padding: '10px',
          textAlign: 'center',
          borderBottom: '1px solid #fbbf24',
          zIndex: 9999
        }}>
          演示模式：未登录状态，部分功能不可用
        </div>
        <div style={{ marginTop: '40px' }}>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
