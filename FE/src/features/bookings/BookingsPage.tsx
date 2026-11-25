import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { bookingService } from '../../mocks/services';
import { Booking } from '../../types';
import {
  CalendarDays,
  Clock,
  User,
  Dumbbell,
  AlertCircle,
  XCircle,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Cancel action state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelResult, setCancelResult] = useState<{ refunded: boolean; message: string } | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBookings();
      setBookings(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelTarget) return;
    try {
      const res = await bookingService.cancelBooking(cancelTarget.id);
      setCancelResult(res);
      loadBookings();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-darksidebar-bg" />
            Lịch Tập Toàn Phòng (Master Gym Schedule)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Theo dõi các ca tập 1-1, kiểm soát xung đột khung giờ và thực thi chính sách hủy lịch trước 12h
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { label: 'Tất cả ca tập', value: 'ALL' },
            { label: 'Đã xác nhận (CONFIRMED)', value: 'CONFIRMED' },
            { label: 'Cần đổi lịch (NEEDS_RESCHEDULE)', value: 'NEEDS_RESCHEDULE' },
            { label: 'Đã hoàn thành (COMPLETED)', value: 'COMPLETED' },
            { label: 'Đã hủy (CANCELLED)', value: 'CANCELLED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-slate-900 text-volt'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Mã & Giờ tập (60p)</th>
                <th className="px-5 py-3">Hội viên</th>
                <th className="px-5 py-3">Huấn luyện viên phụ trách</th>
                <th className="px-5 py-3">Nội dung bài tập</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                    Đang tải lịch tập...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                    Không có lịch tập nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const startTime = new Date(b.startsAt);
                  const endTime = new Date(b.endsAt);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text-primary flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-volt-dark" />
                          {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {startTime.toLocaleDateString('vi-VN')} ({b.id})
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-text-primary">{b.memberName}</div>
                        <div className="text-[10px] text-text-muted font-mono">{b.memberId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-text-primary">{b.trainerName}</div>
                        <div className="text-[10px] text-text-muted">{b.trainerId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-text-primary">
                          {b.workoutTitle || 'Tập thể lực & sức bền'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {b.status === 'CONFIRMED' && <Badge variant="success">Đã lên lịch</Badge>}
                        {b.status === 'NEEDS_RESCHEDULE' && (
                          <Badge variant="warning">PT nghỉ - Đổi lịch</Badge>
                        )}
                        {b.status === 'COMPLETED' && <Badge variant="neutral">Đã hoàn thành</Badge>}
                        {b.status === 'CANCELLED' && <Badge variant="danger">Đã hủy</Badge>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(b)}
                          >
                            Chi tiết
                          </Button>
                          {b.status === 'CONFIRMED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setCancelTarget(b);
                                setCancelResult(null);
                              }}
                              icon={<XCircle className="w-3.5 h-3.5" />}
                            >
                              Hủy lịch
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        <DialogHeader
          title="Xác nhận Hủy lịch tập"
          description={`Ca tập ${cancelTarget?.id} của hội viên ${cancelTarget?.memberName} với PT ${cancelTarget?.trainerName}`}
        />
        <DialogBody className="space-y-3 text-xs">
          {cancelResult ? (
            <div
              className={`p-3 rounded-md border ${
                cancelResult.refunded
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="font-bold mb-1">
                {cancelResult.refunded ? 'Được hoàn lượt tập' : 'Không được hoàn lượt'}
              </div>
              <div>{cancelResult.message}</div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-slate-50 rounded-md border border-border">
                <div className="text-text-secondary">Thời gian ca tập:</div>
                <div className="font-bold text-text-primary text-sm mt-0.5">
                  {cancelTarget?.startsAt && new Date(cancelTarget.startsAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-[11px] leading-relaxed">
                <strong>Chính sách hủy lịch SmartGym (12 giờ):</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Nếu hủy trước 12h: Hoàn lại lượt tập vào tài khoản hội viên.</li>
                  <li>Nếu hủy muộn dưới 12h: Tính vào số lượt tập đã dùng (trừ lượt).</li>
                </ul>
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter>
          {cancelResult ? (
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              Đóng
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setCancelTarget(null)}>
                Không hủy
              </Button>
              <Button variant="danger" onClick={handleCancelBooking}>
                Thực hiện hủy ca tập
              </Button>
            </>
          )}
        </DialogFooter>
      </Dialog>

      {/* Booking Detail Modal */}
      <Dialog isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
        <DialogHeader
          title={`Chi tiết Buổi tập: ${selectedBooking?.id}`}
          description="Thông tin ca tập 1 kèm 1"
        />
        <DialogBody className="space-y-4 text-xs">
          {selectedBooking && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-md border border-border">
                <div>
                  <span className="text-text-secondary block">Hội viên:</span>
                  <strong className="text-text-primary text-sm">{selectedBooking.memberName}</strong>
                  <div className="text-[10px] text-text-muted">{selectedBooking.memberId}</div>
                </div>
                <div>
                  <span className="text-text-secondary block">Huấn luyện viên:</span>
                  <strong className="text-text-primary text-sm">{selectedBooking.trainerName}</strong>
                  <div className="text-[10px] text-text-muted">{selectedBooking.trainerId}</div>
                </div>
                <div>
                  <span className="text-text-secondary block">Thời gian:</span>
                  <strong className="text-text-primary">
                    {new Date(selectedBooking.startsAt).toLocaleString('vi-VN')}
                  </strong>
                </div>
                <div>
                  <span className="text-text-secondary block">Thời lượng:</span>
                  <strong className="text-text-primary">60 phút chuẩn</strong>
                </div>
              </div>

              {selectedBooking.cancellationReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <div className="font-bold">Ghi chú hủy:</div>
                  <div>{selectedBooking.cancellationReason}</div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
