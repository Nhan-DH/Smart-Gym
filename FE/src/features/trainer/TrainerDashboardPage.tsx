import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { bookingService, attendanceService } from '../../mocks/services';
import { Booking, AttendanceSession } from '../../types';
import {
  LayoutDashboard,
  Clock,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Users,
  Award,
  Calendar,
  LogIn,
} from 'lucide-react';

export const TrainerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [bList, aList] = await Promise.all([
          bookingService.getTrainerBookings('PT-201'),
          attendanceService.getSessions(),
        ]);
        setBookings(bList);
        setSessions(aList);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Check if member is currently checked in at the gym via Kiosk
  const isMemberInGym = (memberId: string) => {
    return sessions.some((s) => s.memberId === memberId && !s.checkOutAt);
  };

  const todayBookings = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-darksidebar-bg" />
            Ca Dạy Hôm Nay (Today's Training Sessions)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Theo dõi trạng thái check-in sảnh của học viên và tiến hành ghi nhận buổi tập 60 phút
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lịch dạy hôm nay</span>
            <Calendar className="w-4 h-4 text-volt-dark" />
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">
            {todayBookings.length} ca tập
          </div>
          <div className="text-[11px] text-text-secondary mt-1">Chuẩn 60 phút/ca kèm 1-1</div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Học viên đang phụ trách</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-text-primary tracking-tight">18 học viên</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Tỷ lệ chuyên cần: 96%</div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-700 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đánh giá chất lượng</span>
            <Award className="w-4 h-4 text-volt" />
          </div>
          <div className="text-2xl font-black text-volt tracking-tight">4.9 / 5.0 ★</div>
          <div className="text-[11px] text-slate-300 mt-1">Dựa trên 68 phản hồi của học viên</div>
        </Card>
      </div>

      {/* Today's Schedule List */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Danh sách Ca tập 1 kèm 1 trong ngày</h2>
          <span className="text-xs text-text-secondary">
            Chỉ báo xanh: Học viên đã check-in qua Kiosk sảnh
          </span>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-xs text-text-secondary">Đang tải lịch tập hôm nay...</div>
          ) : todayBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-secondary">
              Hôm nay bạn không có lịch dạy nào. Hãy kiểm tra tab Lịch tuần!
            </div>
          ) : (
            todayBookings.map((b) => {
              const start = new Date(b.startsAt);
              const end = new Date(b.endsAt);
              const inGym = isMemberInGym(b.memberId);

              return (
                <div
                  key={b.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-text-primary flex items-center gap-1.5 font-mono">
                        <Clock className="w-4 h-4 text-volt-dark" />
                        {start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {inGym ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <LogIn className="w-3 h-3" /> Đã có mặt tại phòng tập
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          Chưa check-in sảnh
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <strong className="text-base text-text-primary">{b.memberName}</strong>
                      <span className="text-xs text-text-muted font-mono">({b.memberId})</span>
                    </div>

                    <div className="text-xs text-text-secondary">
                      Nội dung trọng tâm:{' '}
                      <strong className="text-text-primary">{b.workoutTitle || 'Tập Thân trên & Ngực'}</strong>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      variant="volt"
                      size="md"
                      onClick={() => navigate(`/trainer/sessions/${b.id}`)}
                      icon={<PlayCircle className="w-4 h-4 stroke-[2.5]" />}
                    >
                      Bắt đầu Buổi tập (60p)
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
