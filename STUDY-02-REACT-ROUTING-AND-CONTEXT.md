# React Router와 Context API를 활용한 인증 시스템 구축

## 개요
React Router를 사용한 페이지 라우팅과 Context API를 활용한 전역 상태 관리를 학습합니다.
로그인, 대시보드, 사용자 목록 페이지를 구현하며 인증 기반 라우팅을 구현합니다.

## 프로젝트 구조

```
src/
├── features/
│   ├── login/
│   │   ├── container/
│   │   │   └── LoginContainer.tsx
│   │   └── view/
│   │       └── LoginView.tsx
│   ├── dashboard/
│   │   ├── container/
│   │   │   └── DashboardContainer.tsx
│   │   ├── view/
│   │   │   └── DashboardView.tsx
│   │   └── index.ts
│   └── userList/
│       ├── container/
│       │   └── UserListContainer.tsx
│       ├── view/
│       │   └── UserListView.tsx
│       └── index.ts
├── components/
│   └── layout/
│       ├── Header.tsx           # 상단 헤더 (사용자명, 로그아웃)
│       ├── Sidebar.tsx          # 좌측 메뉴
│       └── Layout.tsx           # Header + Sidebar 조합
├── contexts/
│   └── AuthContext.tsx          # 인증 상태 전역 관리
├── routes/
│   └── AppRouter.tsx            # 라우팅 설정
└── hooks/
    └── useAuth.ts               # (구버전 - Context로 대체)
```

## 1. React Router 설치

```bash
npm install react-router-dom
```

## 2. Layout 컴포넌트 구현

### 2.1 Header 컴포넌트
**파일:** [src/components/layout/Header.tsx](src/components/layout/Header.tsx)

```typescript
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          React Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            {userName}님 환영합니다
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
```

**주요 기능:**
- 상단 고정 헤더 (`position="fixed"`)
- 사용자명 표시
- 로그아웃 버튼

### 2.2 Sidebar 컴포넌트
**파일:** [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)

```typescript
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
  { text: '사용자 목록', icon: <PeopleIcon />, path: '/users' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
```

**주요 기능:**
- `useNavigate()`: 페이지 이동
- `useLocation()`: 현재 경로 확인
- `selected` 속성으로 현재 페이지 강조

### 2.3 Layout 컴포넌트
**파일:** [src/components/layout/Layout.tsx](src/components/layout/Layout.tsx)

```typescript
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header userName={user?.name || '사용자'} onLogout={handleLogout} />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
```

**주요 포인트:**
- `<Outlet />`: 자식 라우트 렌더링 위치
- `useAuth()`: Context에서 인증 상태 가져오기

## 3. Context API로 전역 인증 상태 관리

### 3.1 AuthContext 생성
**파일:** [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 불러오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, name: string) => {
    const userData = { email, name };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**핵심 개념:**
- `createContext()`: Context 생성
- `AuthProvider`: 전역 상태를 제공하는 Provider 컴포넌트
- `useAuth()`: Context 값을 쉽게 사용할 수 있는 커스텀 훅
- `localStorage`: 새로고침 후에도 로그인 상태 유지

### 3.2 왜 Context API를 사용하는가?

**문제:**
```typescript
// 각 컴포넌트에서 useState를 사용하면
const LoginContainer = () => {
  const [user, setUser] = useState(null);  // 독립적인 상태
};

const Layout = () => {
  const [user, setUser] = useState(null);  // 또 다른 독립적인 상태
};
```
→ 각 컴포넌트가 **독립적인 상태**를 가지므로 공유되지 않음!

**해결:**
```typescript
// AuthProvider로 감싸면 모든 하위 컴포넌트가 같은 상태 공유
<AuthProvider>
  <LoginContainer />  // 같은 user 상태
  <Layout />          // 같은 user 상태
</AuthProvider>
```

## 4. React Router 설정

### 4.1 AppRouter 구현
**파일:** [src/routes/AppRouter.tsx](src/routes/AppRouter.tsx)

```typescript
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
```

**라우팅 구조:**
```
/login              → LoginContainer (인증 불필요)
/                   → Layout (인증 필요)
  ├── /dashboard    → DashboardContainer
  └── /users        → UserListContainer
```

**핵심 개념:**
- `<BrowserRouter>`: HTML5 History API를 사용한 라우팅
- `<Routes>` / `<Route>`: 경로 정의
- `<Navigate>`: 리다이렉트
- `<Outlet>`: 중첩 라우트 렌더링 위치
- `PrivateRoute`: 인증되지 않은 사용자는 로그인 페이지로 리다이렉트

### 4.2 App.tsx 수정
**파일:** [src/App.tsx](src/App.tsx)

```typescript
import React from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
```

## 5. LoginContainer 수정

**파일:** [src/features/login/container/LoginContainer.tsx](src/features/login/container/LoginContainer.tsx)

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from '../view/LoginView';
import { useAuth } from '../../../contexts/AuthContext';

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();  // Context에서 login 함수 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 임시 로그인 로직
      await new Promise(resolve => setTimeout(resolve, 1000));

      const name = email.split('@')[0];

      // Context의 login 함수 호출
      login(email, name);

      // 대시보드로 이동
      navigate('/dashboard');

    } catch (err) {
      setError('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
};
```

**핵심 포인트:**
- `useAuth()`: Context에서 login 함수 가져오기
- `useNavigate()`: 로그인 성공 시 페이지 이동
- `login(email, name)`: 전역 상태 업데이트
- `navigate('/dashboard')`: 대시보드로 이동

## 6. Feature 페이지 구현

### 6.1 Dashboard
**Container:** [src/features/dashboard/container/DashboardContainer.tsx](src/features/dashboard/container/DashboardContainer.tsx)
**View:** [src/features/dashboard/view/DashboardView.tsx](src/features/dashboard/view/DashboardView.tsx)

통계 카드 4개 표시:
- 총 사용자
- 총 프로젝트
- 진행중인 프로젝트
- 수익

**CSS Grid 사용:**
```typescript
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(1, 1fr)',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(4, 1fr)',
    },
    gap: 3,
  }}
>
  {/* 카드들 */}
</Box>
```

### 6.2 UserList
**Container:** [src/features/userList/container/UserListContainer.tsx](src/features/userList/container/UserListContainer.tsx)
**View:** [src/features/userList/view/UserListView.tsx](src/features/userList/view/UserListView.tsx)

MUI Table을 사용한 사용자 목록 표시

## 7. MUI Icons 설치

```bash
npm install @mui/icons-material
```

## 8. 실행 및 테스트

```bash
npm start
```

**테스트 시나리오:**
1. 로그인 페이지에서 아무 이메일/비밀번호 입력
2. 로그인 → 자동으로 대시보드로 이동
3. 좌측 메뉴에서 "사용자 목록" 클릭 → 사용자 목록 페이지 이동
4. 상단 헤더에서 로그아웃 → 로그인 페이지로 이동

## 9. 핵심 개념 정리

### 9.1 React Router
- **BrowserRouter**: HTML5 History API 기반 라우팅
- **Routes / Route**: 경로와 컴포넌트 매핑
- **Navigate**: 프로그래매틱 리다이렉션
- **useNavigate()**: 함수로 페이지 이동
- **useLocation()**: 현재 경로 정보 가져오기
- **Outlet**: 중첩 라우트의 자식 렌더링

### 9.2 Context API
- **createContext()**: Context 객체 생성
- **Provider**: 하위 컴포넌트에 값 제공
- **useContext()**: Context 값 소비
- **장점**: Props drilling 없이 전역 상태 관리

### 9.3 인증 플로우
```
1. 로그인 → login(email, name) 호출
2. AuthContext 상태 업데이트 (isAuthenticated = true)
3. navigate('/dashboard') 실행
4. PrivateRoute에서 isAuthenticated 확인
5. true면 Dashboard 렌더링, false면 /login으로 리다이렉트
```

### 9.4 Container / View 패턴
- **Container**: 비즈니스 로직, 상태 관리
- **View**: UI 렌더링 (순수 컴포넌트)
- **장점**: 관심사 분리, 재사용성, 테스트 용이

## 10. 문제 해결

### 문제 1: 로그인 후 대시보드로 이동하지 않음
**원인:** 각 컴포넌트에서 `useAuth()`를 호출할 때마다 독립적인 상태 생성

**해결:** Context API로 전역 상태 관리
```typescript
// Before: 독립적인 상태
const useAuth = () => {
  const [user, setUser] = useState(null);  // 각자 다른 상태
};

// After: 공유 상태
<AuthProvider>  {/* 모든 하위 컴포넌트가 같은 상태 공유 */}
  <App />
</AuthProvider>
```

### 문제 2: MUI Grid TypeScript 오류
**원인:** MUI v5의 Grid 컴포넌트 타입 이슈

**해결:** CSS Grid 사용
```typescript
// MUI Grid 대신
<Box sx={{ display: 'grid', gridTemplateColumns: '...' }}>
```

## 11. 다음 단계

- [ ] 실제 API 연동
- [ ] Form Validation (react-hook-form)
- [ ] 로딩 상태 관리
- [ ] 에러 처리
- [ ] 리프레시 토큰
- [ ] Protected Route 고도화