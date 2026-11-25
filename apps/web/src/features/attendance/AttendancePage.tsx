import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { attendanceService } from '../../mocks/services';
import { AttendanceSession } from '../../types';
import {
  Clock,
  ScanFace,
  QrCode,
  LogIn,
  LogOut,
  Edit3,
  AlertCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  // Correction state
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceSession | null>(null);
  const [correctionReason, setCorrectionReason] = useState('Hội viên quên quét mặt/mã QR khi rời phòng tập');
  const [correctionTime, setCorrectionTime] = useState('2026-11-24T18:30:00Z');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getSessions();
      setSessions(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCorrectSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget) return;
    try {
      await attendanceService.correctSession(correctionTarget.id, correctionTime, correctionReason);
      setCorrectionTarget(null);
      loadSessions();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterMode === 'OPEN') return !s.checkOutAt;
    if (filterMode === 'CLOSED') return !!s.checkOutAt;
    return true;
  });

  const activeInGymCount = sessions.filter((s) => !s.checkOutAt).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-darksidebar-bg" />
            Nhật ký Điểm danh & Ra vào Kiosk
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Giám sát phiên ra vào thời gian thực bằng Nhận diện khuôn mặt hoặc Dynamic QR Code
          </p>
        </div>

        {/* Live Active Pill */}
        <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-md shadow-sm">
          <Activity className="w-4 h-4 text-volt animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-400 block font-medium">Hội viên đang trong phòng:</span>
            <span className="text-volt font-black text-base">{activeInGymCount} / 60 người</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-3">
        <div className="flex items-center gap-2 text-xs">
          {[
            { label: 'Tất cả lượt ra vào', value: 'ALL' },
            { label: `Đang ở trong phòng (${activeInGymCount})`, value: 'OPEN' },
            { label: 'Đã check-out', value: 'CLOSED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterMode(tab.value as any)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterMode === tab.value
                  ? 'bg-slate-900 text-volt'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Sessions Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Hội viên</th>
                <th className="px-5 py-3">Phương thức Kiosk</th>
                <th className="px-5 py-3">Thời gian Vào (Check-in)</th>
                <th className="px-5 py-3">Thời gian Ra (Check-out)</th>
                <th className="px-5 py-3">Trạng thái phiên</th>
                <th className="px-5 py-3 text-right">Điều chỉnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                    Đang tải nhật ký điểm danh...
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                    Không tìm thấy phiên ra vào nào.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const isOpen = !session.checkOutAt;
                  return (
                    <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text-primary">{session.memberName}</div>
                        <div className="text-[10px] text-text-muted font-mono">{session.memberId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {session.method === 'FACE' ? (
                            <>
                              <ScanFace className="w-3.5 h-3.5 text-volt-dark" /> Nhận diện mặt
                            </>
                          ) : (
                            <>
                              <QrCode className="w-3.5 h-3.5 text-blue-600" /> Dynamic QR
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                          {new Date(session.checkInAt).toLocaleTimeString('vi-VN')}
                        </div>
                        <div className="text-[10px] text-text-secondary mt-0.5">
                          {new Date(session.checkInAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-text-primary">
                        {session.checkOutAt ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <LogOut className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(session.checkOutAt).toLocaleTimeString('vi-VN')}
                            </div>
                            {session.correctionReason && (
                              <div className="text-[10px] text-amber-600 italic mt-0.5">
                                (Đã sửa: {session.correctionReason})
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-text-muted italic">Chưa check-out</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isOpen ? (
                          <Badge variant="warning">Đang trong phòng</Badge>
                        ) : (
                          <Badge variant="neutral">Đã rời phòng</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isOpen && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit3 className="w-3.5 h-3.5" />}
                            onClick={() => {
                              setCorrectionTarget(session);
                              setCorrectionTime(new Date().toISOString());
                            }}
                          >
                            Đóng phiên
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Correction Dialog */}
      <Dialog isOpen={!!correctionTarget} onClose={() => setCorrectionTarget(null)}>
        <form onSubmit={handleCorrectSession}>
          <DialogHeader
            title="Điều chỉnh phiên Check-out Thủ công"
            description={`Đóng phiên điểm danh cho hội viên ${correctionTarget?.memberName}`}
          />
          <DialogBody className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Bắt buộc ghi nhận lý do đối soát:
              </div>
              <p className="mt-1 text-[11px]">
                Quy định phòng gym yêu cầu mọi điều chỉnh phiên mở phải có lý do cụ thể để kiểm toán số lượng hội viên trong phòng.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Thời gian Check-out dự kiến *</label>
              <Input
                type="text"
                value={correctionTime}
                onChange={(e) => setCorrectionTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Lý do đối soát *</label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-md bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-volt-dark"
                required
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setCorrectionTarget(null)}>
              Hủy
            </Button>
            <Button variant="volt" type="submit">
              Xác nhận đóng phiên
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
