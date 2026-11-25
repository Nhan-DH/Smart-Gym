import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { trainerService } from '../../mocks/services';
import { TrainerProfile, TrainerShift, LeaveRequest } from '../../types';
import {
  UserCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award,
  Users,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILES' | 'SHIFTS' | 'LEAVES'>('PROFILES');
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [shifts, setShifts] = useState<TrainerShift[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave approval confirmation
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tList, sList, lList] = await Promise.all([
        trainerService.getTrainers(),
        trainerService.getShifts(),
        trainerService.getLeaveRequests(),
      ]);
      setTrainers(tList);
      setShifts(sList);
      setLeaves(lList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveLeave = async () => {
    if (!selectedLeave) return;
    try {
      await trainerService.approveLeaveRequest(selectedLeave.id);
      setSelectedLeave(null);
      loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const pendingLeavesCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-darksidebar-bg" />
            Đội ngũ Huấn luyện viên (PT) & Ca trực
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý hồ sơ PT, phân ca làm việc cố định và phê duyệt đơn nghỉ phép bảo vệ lịch tập của hội viên
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('PROFILES')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
            activeTab === 'PROFILES'
              ? 'bg-slate-900 text-volt'
              : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
          }`}
        >
          Hồ sơ PT ({trainers.length})
        </button>
        <button
          onClick={() => setActiveTab('SHIFTS')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
            activeTab === 'SHIFTS'
              ? 'bg-slate-900 text-volt'
              : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
          }`}
        >
          Ca làm việc tuần (Shifts)
        </button>
        <button
          onClick={() => setActiveTab('LEAVES')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors relative ${
            activeTab === 'LEAVES'
              ? 'bg-slate-900 text-volt'
              : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
          }`}
        >
          Đơn nghỉ phép
          {pendingLeavesCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black">
              {pendingLeavesCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Profiles */}
      {activeTab === 'PROFILES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="relative p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md bg-slate-900 text-volt flex items-center justify-center font-black text-lg border border-slate-700 shrink-0">
                  {trainer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-text-primary">{trainer.name}</h3>
                    <Badge variant={trainer.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {trainer.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm nghỉ'}
                    </Badge>
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">{trainer.phone} • {trainer.email}</div>
                </div>
              </div>

              {/* Bio & Specialties */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="text-xs text-text-secondary line-clamp-2">{trainer.bio}</div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {trainer.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-slate-50 border border-border text-xs">
                <div>
                  <span className="text-text-secondary block text-[11px]">Học viên phụ trách</span>
                  <strong className="text-sm font-black text-text-primary flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-text-secondary" /> {trainer.assignedMembersCount} học viên
                  </strong>
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Số ca dạy tháng này</span>
                  <strong className="text-sm font-black text-text-primary flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-text-secondary" /> {trainer.completedSessionsCount} ca (60p)
                  </strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Shifts Table */}
      {activeTab === 'SHIFTS' && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-primary">Lịch ca làm việc cố định hàng tuần</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Ca sáng (06:00 - 14:00) và Ca chiều (14:00 - 22:00). Hội viên chỉ được xếp lịch PT vào ca trực của PT.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Huấn luyện viên</th>
                  <th className="px-5 py-3">Thứ trong tuần</th>
                  <th className="px-5 py-3">Khung giờ ca trực</th>
                  <th className="px-5 py-3">Tên ca</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-text-primary">{shift.trainerName}</td>
                    <td className="px-5 py-3.5 font-semibold text-text-secondary">
                      {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][shift.dayOfWeek]}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-text-primary">
                      {shift.startTime} — {shift.endTime}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                        {shift.shiftName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success">Đang áp dụng</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Leave Requests */}
      {activeTab === 'LEAVES' && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-text-primary">Danh sách Đơn xin nghỉ phép của PT</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Khi duyệt đơn: hệ thống tự động đánh dấu các buổi tập bị trùng giờ sang trạng thái NEEDS_RESCHEDULE và bảo lưu 100% lượt tập cho hội viên.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Mã đơn & PT</th>
                  <th className="px-5 py-3">Ngày xin nghỉ</th>
                  <th className="px-5 py-3">Lý do</th>
                  <th className="px-5 py-3">Lịch tập bị ảnh hưởng</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                      Hiện không có đơn nghỉ phép nào.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text-primary">{leave.trainerName}</div>
                        <div className="text-[10px] text-text-muted font-mono">{leave.id}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-text-primary">
                        {leave.startDate} {leave.endDate !== leave.startDate ? `đến ${leave.endDate}` : ''}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary max-w-xs">{leave.reason}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          {leave.affectedBookingsCount} buổi tập
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {leave.status === 'PENDING' ? (
                          <Badge variant="warning">Chờ quản lý duyệt</Badge>
                        ) : (
                          <Badge variant="success">Đã phê duyệt</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {leave.status === 'PENDING' ? (
                          <Button
                            variant="volt"
                            size="sm"
                            onClick={() => setSelectedLeave(leave)}
                            icon={<CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                          >
                            Duyệt đơn
                          </Button>
                        ) : (
                          <span className="text-[11px] text-text-muted">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Leave Approval Dialog */}
      <Dialog isOpen={!!selectedLeave} onClose={() => setSelectedLeave(null)}>
        <DialogHeader
          title="Xác nhận Phê duyệt Đơn nghỉ phép"
          description={`Duyệt đơn nghỉ phép cho PT ${selectedLeave?.trainerName} vào ngày ${selectedLeave?.startDate}`}
        />
        <DialogBody className="space-y-3 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Cảnh báo bảo vệ quyền lợi hội viên (Quy chuẩn T07):
            </div>
            <div>
              Có <strong>{selectedLeave?.affectedBookingsCount} buổi tập</strong> của hội viên đang trùng ca này. Sau khi duyệt, hệ thống sẽ:
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
              <li>Tự động chuyển các buổi tập sang trạng thái <strong>NEEDS_RESCHEDULE</strong>.</li>
              <li>Bảo lưu nguyên vẹn số lượt tập, không trừ lượt của hội viên.</li>
              <li>Gửi thông báo đến hội viên để chọn lại lịch hoặc đổi PT khác.</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-border">
            <span className="text-text-secondary block">Lý do nghỉ của PT:</span>
            <div className="text-text-primary font-medium mt-0.5">{selectedLeave?.reason}</div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setSelectedLeave(null)}>
            Hủy bỏ
          </Button>
          <Button variant="volt" onClick={handleApproveLeave}>
            Đồng ý phê duyệt đơn
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
