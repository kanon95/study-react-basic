import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginContainer } from '../features/login';
import { UserListContainer } from '../features/userList';
import { DashboardContainer } from '../features/dashboard';
import Layout from '../components/layout/Layout';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// 인증이 필요한 라우트를 위한 컴포넌트
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginContainer />} />

          {/* 보호된 라우트 - Layout 적용 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* 기본 경로는 대시보드로 리다이렉트 */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardContainer />} />
            <Route path="users" element={<UserListContainer />} />
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;