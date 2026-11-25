import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  BarChart3,
  TrendingUp,
  Users,
  Dumbbell,
  Calendar,
  DollarSign,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const REVENUE_DATA = [
  { day: 'Thứ 2', revenue: 4500000, sessions: 18 },
  { day: 'Thứ 3', revenue: 7200000, sessions: 24 },
  { day: 'Thứ 4', revenue: 3800000, sessions: 16 },
  { day: 'Thứ 5', revenue: 9500000, sessions: 28 },
  { day: 'Thứ 6', revenue: 8400000, sessions: 22 },
  { day: 'Thứ 7', revenue: 14200000, sessions: 38 },
  { day: 'Chủ nhật', revenue: 11000000, sessions: 32 },
];

const PEAK_HOURS_DATA = [
  { hour: '06:00', count: 12 },
  { hour: '08:00', count: 22 },
  { hour: '10:00', count: 15 },
  { hour: '12:00', count: 18 },
  { hour: '14:00', count: 14 },
  { hour: '16:00', count: 32 },
  { hour: '17:00', count: 48 },
  { hour: '18:00', count: 56 },
  { hour: '19:00', count: 52 },
  { hour: '20:00', count: 38 },
  { hour: '21:00', count: 20 },
];

const COMPLETION_DATA = [
  { name: 'Đã hoàn thành', value: 78, color: '#16A34A' },
  { name: 'Hủy trước 12h (Hoàn)', value: 12, color: '#2563EB' },
  { name: 'Hủy muộn (Trừ lượt)', value: 6, color: '#D97706' },
  { name: 'Vắng mặt (No-show)', value: 4, color: '#DC2626' },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-darksidebar-bg" />
            Báo cáo Vận hành & Phân tích Doanh thu
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Tổng hợp doanh thu gói tập, mật độ khung giờ cao điểm và tỷ lệ hoàn thành ca tập PT
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Doanh thu tuần này</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">58.600.000 đ</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% so với tuần trước
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng số ca PT hoàn thành</span>
            <Dumbbell className="w-4 h-4 text-volt-dark" />
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">178 ca (60p)</div>
          <div className="text-[11px] text-text-secondary mt-1">Tỷ lệ hoàn thành: 92.4%</div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Khung giờ đông nhất</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">17:30 — 19:30</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Công suất đạt 93% (56/60)</div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-700 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">PT xuất sắc nhất</span>
            <Award className="w-4 h-4 text-volt" />
          </div>
          <div className="text-xl font-black text-volt tracking-tight">Lê Hoàng Long</div>
          <div className="text-[11px] text-slate-300 mt-1">68 ca tập • Đánh giá 4.9/5.0</div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart (2 cols) */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-text-primary">Doanh thu theo ngày trong tuần</h3>
              <p className="text-xs text-text-secondary mt-0.5">Số liệu phát sinh từ đơn đăng ký gói tập đã duyệt</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')} VND`, 'Doanh thu']}
                  contentStyle={{ backgroundColor: '#0A0D14', color: '#fff', borderRadius: '6px', fontSize: '11px' }}
                />
                <Bar dataKey="revenue" fill="#0A0D14" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* PT Session Completion Pie (1 col) */}
        <Card className="p-5">
          <h3 className="font-bold text-sm text-text-primary mb-1">Tỷ lệ thực hiện ca tập PT</h3>
          <p className="text-xs text-text-secondary mb-4">Phân tích thực thi chính sách hủy 12h</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLETION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COMPLETION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Tỷ lệ']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border">
            {COMPLETION_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-text-secondary truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Peak Hours Heatmap Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-text-primary">Mật độ tải phòng theo khung giờ trong ngày</h3>
            <p className="text-xs text-text-secondary mt-0.5">Số lượng hội viên check-in có mặt đồng thời (Giới hạn trần: 60)</p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PEAK_HOURS_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 60]} />
              <Tooltip
                formatter={(val: any) => [`${val} / 60 người`, 'Số người có mặt']}
                contentStyle={{ backgroundColor: '#0A0D14', color: '#fff', borderRadius: '6px', fontSize: '11px' }}
              />
              <Bar dataKey="count" fill="#D4F638" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
