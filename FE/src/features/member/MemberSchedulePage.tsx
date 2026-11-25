import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Sparkles,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { ReviewTrainerModal } from './components/ReviewTrainerModal';

export const MemberSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelResult, setCancelResult] = useState<{ refunded: boolean; message: string } | null>(null);

  // Review PT modal state
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMemberBookings('MB-1001');
      setBookings(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      const res = await bookingService.cancelBooking(cancelTarget.id);
      setCancelResult(res);
      loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleReviewSubmit = async (
    bookingId: string,
    rating: number,
    comment?: string,
    tags?: string[]
  ) => {
    await bookingService.submitBookingReview(bookingId, rating, comment, tags);
    loadData();
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'NEEDS_RESCHEDULE'
  );
  const historyBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-darksidebar-bg" />
            Lịch Tập Của Tôi
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Theo dõi các ca tập cá nhân 1-1, kiểm tra lịch cần đổi và thực thi hủy lịch theo quy định
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="volt"
            size="sm"
            onClick={() => navigate('/app/booking/smart')}
            icon={<Sparkles className="w-4 h-4 stroke-[2.5]" />}
          >
            Xếp lịch CP-SAT
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/booking/manual')}
            icon={<Plus className="w-4 h-4" />}
          >
            Đặt lịch thủ công
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setTab('UPCOMING')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
            tab === 'UPCOMING'
              ? 'bg-slate-900 text-volt'
              : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
          }`}
        >
          Lịch sắp tới ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setTab('HISTORY')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
            tab === 'HISTORY'
              ? 'bg-slate-900 text-volt'
              : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
          }`}
        >
          Lịch sử tập ({historyBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải lịch tập của bạn...</div>
      ) : (tab === 'UPCOMING' ? upcomingBookings : historyBookings).length === 0 ? (
        <Card className="py-12 text-center text-text-secondary text-xs">
          Không có buổi tập nào trong mục này.
        </Card>
      ) : (
        <div className="space-y-4">
          {(tab === 'UPCOMING' ? upcomingBookings : historyBookings).map((booking) => {
            const start = new Date(booking.startsAt);
            const end = new Date(booking.endsAt);
            const isNeedsReschedule = booking.status === 'NEEDS_RESCHEDULE';
            return (
              <Card
                key={booking.id}
                className={`p-5 transition-all ${
                  isNeedsReschedule ? 'border-amber-400 bg-amber-50/40' : 'bg-surface'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{booking.id}</span>
                      {booking.status === 'CONFIRMED' && <Badge variant="success">Đã lên lịch</Badge>}
                      {isNeedsReschedule && (
                        <Badge variant="warning">PT nghỉ phép - Bảo lưu lượt</Badge>
                      )}
                      {booking.status === 'COMPLETED' && (
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">Đã hoàn thành</Badge>
                          {booking.rating ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{booking.rating}.0 • Đã đánh giá</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-amber-700 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
                              Chưa đánh giá
                            </span>
                          )}
                        </div>
                      )}
                      {booking.status === 'CANCELLED' && <Badge variant="danger">Đã hủy</Badge>}
                    </div>

                    <h3 className="font-bold text-base text-text-primary">
                      {booking.workoutTitle || 'Tập thể lực & sức bền toàn diện'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1 font-mono text-text-primary font-semibold">
                        <Clock className="w-3.5 h-3.5 text-volt-dark" />
                        {start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (
                        {start.toLocaleDateString('vi-VN')})
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Huấn luyện viên:{' '}
                        <strong className="text-text-primary">{booking.trainerName}</strong>
                      </span>
                    </div>

                    {booking.cancellationReason && (
                      <div className="text-xs text-amber-800 bg-amber-100/60 p-2 rounded border border-amber-200 mt-2">
                        {booking.cancellationReason}
                      </div>
                    )}

                    {/* Member's Rating & Review Details (if already submitted) */}
                    {booking.rating && (
                      <div className="p-3 rounded-md bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1.5 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(booking.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="font-bold text-[11px] text-amber-900">Đánh giá của bạn</span>
                          {booking.reviewedAt && (
                            <span className="text-[10px] text-slate-500 font-mono ml-auto">
                              {new Date(booking.reviewedAt).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                        {booking.reviewComment && (
                          <p className="text-[11px] text-slate-700 italic">"{booking.reviewComment}"</p>
                        )}
                        {booking.reviewTags && booking.reviewTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {booking.reviewTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-amber-300 text-amber-900 shadow-2xs"
                              >
                                ✓ {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status === 'CONFIRMED' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setCancelTarget(booking);
                          setCancelResult(null);
                        }}
                        icon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Hủy buổi tập
                      </Button>
                    </div>
                  )}

                  {/* Review Action Button for Completed & Unrated Sessions */}
                  {booking.status === 'COMPLETED' && !booking.rating && (
                    <div className="shrink-0">
                      <Button
                        variant="volt"
                        size="sm"
                        onClick={() => setReviewTarget(booking)}
                        icon={<Star className="w-3.5 h-3.5 fill-darksidebar-bg" />}
                        className="font-bold shadow-xs"
                      >
                        Đánh giá PT
                      </Button>
                    </div>
                  )}

                  {isNeedsReschedule && (
                    <div className="shrink-0">
                      <Button
                        variant="volt"
                        size="sm"
                        onClick={() => navigate('/app/booking/smart')}
                        icon={<Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />}
                      >
                        Chọn lịch thay thế
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        <DialogHeader
          title="Xác nhận Hủy Buổi tập"
          description={`Ca tập ${cancelTarget?.id} với PT ${cancelTarget?.trainerName}`}
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
                {cancelResult.refunded ? 'Được hoàn lại lượt tập' : 'Không hoàn lại lượt'}
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
                <strong>Chính sách bảo lưu & hủy lịch SmartGym (12 giờ):</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Nếu bạn hủy trước giờ tập ít nhất 12 tiếng: Lượt tập sẽ được hoàn lại 100% vào tài khoản.</li>
                  <li>Nếu bạn hủy muộn dưới 12 tiếng: Lượt tập sẽ tính vào số buổi đã dùng để bảo vệ thời gian của PT.</li>
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
              <Button variant="danger" onClick={handleCancel}>
                Xác nhận hủy buổi tập
              </Button>
            </>
          )}
        </DialogFooter>
      </Dialog>

      {/* Review Trainer Modal */}
      <ReviewTrainerModal
        booking={reviewTarget}
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};
