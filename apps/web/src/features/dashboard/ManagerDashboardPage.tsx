import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { OccupancyStats, Order, AttendanceSession } from '../../types';
import { occupancyService, orderService } from '../../mocks/services';
import { formatVND } from '../../lib/utils';
import { OccupancyChart } from './components/OccupancyChart';
import { PendingOrdersCard } from './components/PendingOrdersCard';
import { ActiveSessionsCard } from './components/ActiveSessionsCard';
import { Users, CreditCard, Dumbbell, Activity, Calendar } from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<OccupancyStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [statsData, ordersData, sessionsData] = await Promise.all([
        occupancyService.getStats(),
        orderService.getOrders(),
        occupancyService.getActiveSessions(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setActiveSessions(sessionsData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface rounded-lg border border-border" />
          ))}
        </div>
        <div className="h-80 bg-surface rounded-lg border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Dashboard Tổng quan</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Giám sát vận hành thời gian thực, mật độ phòng tập và đối soát đơn hàng
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border text-xs font-medium text-text-secondary shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Hôm nay: {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Mật độ */}
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between text-text-secondary text-xs font-semibold uppercase tracking-wider">
            <span>Mật độ phòng tập</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">
              {stats.current} <span className="text-sm font-normal text-text-secondary">/ {stats.capacity}</span>
            </span>
            <span className="text-xs font-semibold text-primary">{stats.percentage}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-text-secondary mt-2">Trạng thái: Ổn định, không tắc nghẽn</div>
        </Card>

        {/* KPI 2: Hội viên Active */}
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between text-text-secondary text-xs font-semibold uppercase tracking-wider">
            <span>Hội viên đang hoạt động</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{stats.activeMembers}</span>
            <span className="text-xs text-status-success font-medium">+5 tuần này</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-5">Có thẻ còn hạn và quyền vào phòng</div>
        </Card>

        {/* KPI 3: Doanh thu */}
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between text-text-secondary text-xs font-semibold uppercase tracking-wider">
            <span>Doanh thu hôm nay</span>
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">{formatVND(stats.revenueTodayVnd)}</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-5">Đã đối soát trừ đi hoàn tiền</div>
        </Card>

        {/* KPI 4: Buổi PT hoàn thành */}
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between text-text-secondary text-xs font-semibold uppercase tracking-wider">
            <span>Buổi PT hoàn thành</span>
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{stats.completedPtToday} buổi</span>
            <span className="text-xs text-primary font-medium">2 buổi đang tập</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-5">Số buổi PT đã chốt kết quả</div>
        </Card>
      </div>

      {/* Main Grid: Chart & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Occupancy Chart & Active Sessions */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Biểu đồ Mật độ Theo Giờ Trong Ngày"
            subtitle="So sánh dữ liệu điểm danh thực tế với mức trung bình (baseline)"
          >
            <OccupancyChart data={stats.hourlyData} />
          </Card>

          <Card
            title={`Phiên Đang Tập Trong Phòng (${activeSessions.length})`}
            subtitle="Danh sách hội viên đã check-in và chưa check-out tại Kiosk"
          >
            <ActiveSessionsCard sessions={activeSessions} />
          </Card>
        </div>

        {/* Right Column (5 cols): Pending Orders for Reconciliation */}
        <div className="lg:col-span-5">
          <Card
            title="Đơn Hàng Chờ Đối Soát"
            subtitle="Kiểm tra tiền mặt / chuyển khoản để kích hoạt gói tập"
          >
            <PendingOrdersCard orders={orders} onOrderUpdated={loadData} />
          </Card>
        </div>
      </div>
    </div>
  );
};
