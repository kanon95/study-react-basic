import React, { useState, useEffect } from 'react';
import UserListView, { User } from '../view/UserListView';

const UserListContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    // const fetchUsers = async () => {
    //   const response = await fetch('/api/users');
    //   const data = await response.json();
    //   setUsers(data);
    // };
    // fetchUsers();

    // 임시 데이터
    const mockUsers: User[] = [
      {
        id: 1,
        name: '김철수',
        email: 'kim@example.com',
        role: '관리자',
        status: 'active',
      },
      {
        id: 2,
        name: '이영희',
        email: 'lee@example.com',
        role: '사용자',
        status: 'active',
      },
      {
        id: 3,
        name: '박민수',
        email: 'park@example.com',
        role: '사용자',
        status: 'inactive',
      },
      {
        id: 4,
        name: '최지은',
        email: 'choi@example.com',
        role: '매니저',
        status: 'active',
      },
    ];

    setUsers(mockUsers);
  }, []);

  return <UserListView users={users} />;
};

export default UserListContainer;