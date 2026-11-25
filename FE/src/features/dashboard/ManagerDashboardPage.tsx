import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { OccupancyStats, Order, AttendanceSession } from '../../types';
import { occupancyService, orderService } from '../../mocks/services';
import { formatVND } from '../../lib/utils';
import { OccupancyChart } from './components/OccupancyChart';
import { PendingOrdersCard } from './components/PendingOrdersCard';
import { ActiveSessionsCard } from './components/ActiveSessionsCard';
import { Users, CreditCard, Dumbbell, Activity, Calendar, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
            <div key={i} className="h-32 bg-surface rounded-lg border border-border" />
          ))}
        </div>
        <div className="h-80 bg-surface rounded-lg border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Date Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Dashboard Tổng Quan</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Giám sát vận hành thời gian thực, mật độ phòng tập và đối soát đơn hàng
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border text-xs font-semibold text-text-secondary shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-volt-dark" />
          <span>Hôm nay: {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>

      {/* 4 KPI Cards - Perfectly Aligned Heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Mật độ */}
        <Card className="p-4 border-border h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-secondary text-xs font-bold uppercase tracking-wider">
              <span>Mật độ phòng tập</span>
              <Activity className="w-4 h-4 text-volt-dark" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary tracking-tight">
                {stats.current} <span className="text-xs font-bold text-text-secondary">/ {stats.capacity}</span>
              </span>
              <span className="text-xs font-bold text-volt-dark">({stats.percentage}%)</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border/80">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-volt-dark h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-text-secondary mt-1 flex justify-between">
              <span>Trạng thái: Ổn định</span>
              <span className="font-semibold text-emerald-600">Còn 28 chỗ</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Hội viên Active */}
        <Card className="p-4 border-border h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-secondary text-xs font-bold uppercase tracking-wider">
              <span>Hội viên đang hoạt động</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary tracking-tight">{stats.activeMembers}</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +5 tuần này
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border/80 text-[11px] text-text-secondary flex items-center justify-between">
            <span>Thẻ còn hạn & quyền vào</span>
            <span className="font-semibold text-text-primary">100% hợp lệ</span>
          </div>
        </Card>

        {/* KPI 3: Doanh thu */}
        <Card className="p-4 border-border h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-secondary text-xs font-bold uppercase tracking-wider">
              <span>Doanh thu hôm nay</span>
              <CreditCard className="w-4 h-4 text-volt-dark" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary tracking-tight">{formatVND(stats.revenueTodayVnd)}</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border/80 text-[11px] text-text-secondary flex items-center justify-between">
            <span>Đã đối soát trừ hoàn tiền</span>
            <span className="font-semibold text-emerald-600">Đã chốt sổ</span>
          </div>
        </Card>

        {/* KPI 4: Buổi PT hoàn thành */}
        <Card className="p-4 border-border h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-text-secondary text-xs font-bold uppercase tracking-wider">
              <span>Buổi PT hoàn thành</span>
              <Dumbbell className="w-4 h-4 text-volt-dark" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary tracking-tight">{stats.completedPtToday} ca</span>
              <span className="text-xs text-volt-dark font-bold">2 ca đang tập</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-border/80 text-[11px] text-text-secondary flex items-center justify-between">
            <span>Số ca PT đã chốt kết quả</span>
            <span className="font-semibold text-text-primary">Đúng tiến độ</span>
          </div>
        </Card>
      </div>

      {/* Main Grid Row 1: Occupancy Chart (8 cols) + Facility Live Status (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <Card
            title="Biểu đồ Mật độ Theo Giờ Trong Ngày"
            subtitle="So sánh dữ liệu điểm danh thực tế với mức trung bình (baseline) để nhận diện giờ cao điểm"
            className="h-full flex flex-col justify-between"
          >
            <OccupancyChart data={stats.hourlyData} />
          </Card>
        </div>

        {/* Live Capacity & Facility Quick Info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <Card
            title="Giám Sát Vận Hành Cơ Sở"
            subtitle="Thông số kỹ thuật ca trực & năng lực phục vụ"
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-3.5 my-auto py-2">
              <div className="p-3 bg-slate-50 rounded-md border border-border space-y-1">
                <div className="text-xs text-text-secondary flex justify-between">
                  <span>Trần tải phòng tập:</span>
                  <strong className="text-text-primary">60 người tối đa</strong>
                </div>
                <div className="text-xs text-text-secondary flex justify-between">
                  <span>Số người đang trong phòng:</span>
                  <strong className="text-volt-dark font-black text-sm">{stats.current} người</strong>
                </div>
                <div className="text-xs text-text-secondary flex justify-between">
                  <span>Khung giờ cao điểm:</span>
                  <strong className="text-amber-700">17:30 — 19:30</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-md space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Cổng Kiosk Tự Động</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Thiết bị nhận diện khuôn mặt DeepFace và Dynamic QR hoạt động ổn định, độ trễ trung bình &lt; 0.8 giây.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Hệ thống bảo mật
              </span>
              <span className="font-mono text-text-muted">Chi nhánh 01</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Grid Row 2: Symmetrical 6 cols / 6 cols - Equal Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Pending Orders (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <Card
            title="Đơn Hàng Chờ Đối Soát"
            subtitle="Kiểm tra tiền mặt / chuyển khoản để kích hoạt gói tập cho hội viên"
            className="h-full flex flex-col"
          >
            <PendingOrdersCard orders={orders} onOrderUpdated={loadData} />
          </Card>
        </div>

        {/* Active Sessions in Gym (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <Card
            title={`Phiên Đang Tập Trong Phòng (${activeSessions.length})`}
            subtitle="Danh sách hội viên đã check-in qua Kiosk sảnh và chưa check-out"
            className="h-full flex flex-col"
          >
            <ActiveSessionsCard sessions={activeSessions} />
          </Card>
        </div>
      </div>
    </div>
  );
};
