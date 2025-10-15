import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  revenue: number;
}

interface DashboardViewProps {
  stats: DashboardStats;
}

const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  const statCards = [
    {
      title: '총 사용자',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: '총 프로젝트',
      value: stats.totalProjects,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: '진행중인 프로젝트',
      value: stats.activeProjects,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: '수익',
      value: `${stats.revenue.toLocaleString()}원`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        대시보드
      </Typography>
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
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            최근 활동
          </Typography>
          <Typography color="textSecondary">
            최근 활동 내역이 여기에 표시됩니다.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardView;