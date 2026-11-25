import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { trainerService, bookingService } from '../../mocks/services';
import { TrainerShift, Booking, LeaveRequest } from '../../types';
import {
  CalendarDays,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export const TrainerSchedulePage: React.FC = () => {
  const [shifts, setShifts] = useState<TrainerShift[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave request modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2026-12-05');
  const [leaveReason, setLeaveReason] = useState('Việc gia đình đột xuất');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sList, bList, lList] = await Promise.all([
        trainerService.getShifts('PT-201'),
        bookingService.getTrainerBookings('PT-201'),
        trainerService.getLeaveRequests(),
      ]);
      setShifts(sList);
      setBookings(bList);
      setLeaves(lList.filter((l) => l.trainerId === 'PT-201'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await trainerService.submitLeaveRequest({
        trainerId: 'PT-201',
        trainerName: 'Lê Hoàng Long',
        startDate: leaveDate,
        endDate: leaveDate,
        reason: leaveReason,
        affectedBookingsCount: 2,
      });
      setIsLeaveModalOpen(false);
      setLeaveSuccess(true);
      loadData();
      setTimeout(() => setLeaveSuccess(false), 4000);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-darksidebar-bg" />
            Lịch Làm Việc Tuần & Đơn Nghỉ Phép
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Ca làm việc cố định hàng tuần và quy trình xin nghỉ phép bảo vệ quyền lợi hội viên (T07)
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsLeaveModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Tạo đơn xin nghỉ phép
        </Button>
      </div>

      {leaveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã gửi đơn xin nghỉ phép đến Quản lý! Các lịch tập của học viên sẽ được bảo lưu theo quy định T07.
        </div>
      )}

      {/* Shifts Card */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Ca trực phòng tập của bạn trong tuần</h2>
          <span className="text-xs text-text-secondary">Chi nhánh 01 (Cơ sở chính)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
          {shifts.map((s) => (
            <div key={s.id} className="p-3.5 rounded-md border border-border bg-surface space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text-primary">
                  {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][s.dayOfWeek]}
                </span>
                <Badge variant="success">Ca trực</Badge>
              </div>
              <div className="text-xs font-mono font-bold text-volt-dark">
                {s.startTime} — {s.endTime}
              </div>
              <div className="text-[11px] text-text-secondary">{s.shiftName}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leave Requests Log */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Lịch sử Đơn xin nghỉ phép của bạn</h2>
        </div>
        <div className="divide-y divide-border text-xs">
          {leaves.length === 0 ? (
            <div className="p-6 text-center text-text-secondary">Bạn chưa có đơn xin nghỉ nào.</div>
          ) : (
            leaves.map((l) => (
              <div key={l.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-text-primary font-mono">{l.startDate}</div>
                  <div className="text-text-secondary mt-0.5">{l.reason}</div>
                  <div className="text-[10px] text-amber-700 mt-1">
                    Ảnh hưởng: {l.affectedBookingsCount} buổi tập của học viên
                  </div>
                </div>
                <Badge variant={l.status === 'APPROVED' ? 'success' : 'warning'}>
                  {l.status === 'APPROVED' ? 'Đã duyệt (Bảo lưu lịch)' : 'Đang chờ duyệt'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Leave Request Dialog */}
      <Dialog isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)}>
        <form onSubmit={handleSubmitLeave}>
          <DialogHeader
            title="Tạo Đơn xin nghỉ phép"
            description="Khai báo ngày xin nghỉ để hệ thống kích hoạt cơ chế bảo lưu lịch tập cho học viên (T07)"
          />
          <DialogBody className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Cơ chế tự động bảo vệ hội viên:
              </div>
              <p className="text-[11px] leading-relaxed">
                Khi quản lý phê duyệt đơn nghỉ, mọi buổi tập trùng giờ sẽ chuyển sang trạng thái <strong>NEEDS_RESCHEDULE</strong>, số lượt tập của học viên được bảo lưu trọn vẹn.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Ngày xin nghỉ *</label>
              <Input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Lý do xin nghỉ *</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-md bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-volt-dark"
                required
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setIsLeaveModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="volt" type="submit">
              Nộp đơn xin nghỉ
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
