import React, { useState, useEffect } from 'react';
import DashboardView from '../view/DashboardView';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  revenue: number;
}

const DashboardContainer: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    revenue: 0,
  });

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    // const fetchDashboardStats = async () => {
    //   const response = await fetch('/api/dashboard/stats');
    //   const data = await response.json();
    //   setStats(data);
    // };
    // fetchDashboardStats();

    // 임시 데이터
    const mockStats: DashboardStats = {
      totalUsers: 1234,
      totalProjects: 56,
      activeProjects: 23,
      revenue: 12500000,
    };

    setStats(mockStats);
  }, []);

  return <DashboardView stats={stats} />;
};

export default DashboardContainer;