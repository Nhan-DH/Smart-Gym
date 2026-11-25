import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { memberService, bookingService } from '../../mocks/services';
import { DetailedMember, Booking } from '../../types';
import {
  CreditCard,
  Calendar,
  Sparkles,
  Dumbbell,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  QrCode,
} from 'lucide-react';
import { MemberQrModal } from './components/MemberQrModal';

export const MemberHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<DetailedMember | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [m, b] = await Promise.all([
          memberService.getMemberById('MB-1001'),
          bookingService.getMemberBookings('MB-1001'),
        ]);
        setMember(m);
        setBookings(b);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const membership = member?.membership;
  const totalPt = membership?.totalPt || 0;
  const usedPt = membership?.usedPt || 0;
  const reservedPt = membership?.reservedPt || 0;
  const availablePt = Math.max(0, totalPt - usedPt - reservedPt);

  const nextBooking = bookings.find((b) => b.status === 'CONFIRMED');

  if (loading || !member) {
    return <div className="py-12 text-center text-text-secondary text-sm">Đang tải thông tin hội viên...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Xin chào, {member.name}! 👋
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Mã hội viên: <strong className="font-mono text-text-primary">{member.id}</strong> • Chúc bạn một buổi tập luyện tràn đầy năng lượng!
          </p>
        </div>
        <Button
          variant="volt"
          onClick={() => setIsQrOpen(true)}
          icon={<QrCode className="w-4 h-4 stroke-[2.5]" />}
          className="shadow-sm"
        >
          Mở Mã QR Điểm danh
        </Button>
      </div>

      {/* Main Grid: Digital Card & PT Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Membership Card (1 Col) */}
        <div className="p-6 rounded-xl bg-darksidebar-bg border border-darksidebar-border text-white relative overflow-hidden flex flex-col justify-between shadow-md">
          {/* Top of Card */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-volt text-darksidebar-bg flex items-center justify-center font-black text-xs">
                SG
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block leading-none">SmartGym</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-semibold mt-0.5">
                  Member Pass
                </span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              ĐANG KÍCH HOẠT
            </div>
          </div>

          {/* Center Chip & Package */}
          <div className="my-8">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Gói tập hiện tại</div>
            <div className="text-lg font-black text-volt tracking-tight mt-0.5">
              {membership?.planName || 'Chưa có gói tập'}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              Hạn dùng đến: {membership?.endsAt || 'N/A'}
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Họ và tên</div>
              <div className="font-bold text-white tracking-wide">{member.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">ID Hội viên</div>
              <div className="font-mono text-volt font-bold">{member.id}</div>
            </div>
          </div>
        </div>

        {/* PT Session Balance Counters (2 Cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between bg-surface border-volt-border/60 ring-1 ring-volt/20">
            <div>
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Khả dụng để đặt</span>
                <Sparkles className="w-4 h-4 text-volt-dark" />
              </div>
              <div className="text-3xl font-black text-text-primary tracking-tight">
                {availablePt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-3 pt-3 border-t border-border">
              (Tổng {totalPt} - Đã tập {usedPt} - Giữ {reservedPt})
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between bg-surface">
            <div>
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Đang giữ chỗ</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-600 tracking-tight">
                {reservedPt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
              </div>
            </div>
            <div className="text-[11px] text-text-secondary mt-3 pt-3 border-t border-border">
              Lịch đã xếp trong tương lai
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between bg-surface">
            <div>
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Đã hoàn thành</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-text-primary tracking-tight">
                {usedPt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
              </div>
            </div>
            <div className="text-[11px] text-text-secondary mt-3 pt-3 border-t border-border">
              Số ca đã được PT ký duyệt
            </div>
          </Card>

          {/* Smart Booking CTA Banner */}
          <div className="sm:col-span-3 p-5 rounded-lg bg-slate-900 border border-slate-700 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-volt text-darksidebar-bg uppercase tracking-wider">
                <Sparkles className="w-3 h-3 stroke-[2.5]" /> Google OR-Tools CP-SAT
              </div>
              <h3 className="font-bold text-base text-white">
                Tối ưu hóa Lịch tập Thông minh tuần này
              </h3>
              <p className="text-xs text-slate-300">
                Thuật toán tự động tìm 3 phương án khung giờ lý tưởng nhất khớp ca trực của Huấn luyện viên, tránh giờ đông người.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="volt"
                onClick={() => navigate('/app/booking/smart')}
                icon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              >
                Xếp lịch tự động
              </Button>
              <Button
                variant="outline"
                className="text-white border-slate-600 hover:bg-slate-800"
                onClick={() => navigate('/app/booking/manual')}
              >
                Đặt thủ công
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Booking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Session Card */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-volt-dark" /> Ca tập sắp diễn ra
            </h3>
            <span className="text-xs text-volt-dark font-bold">1 kèm 1</span>
          </div>

          {nextBooking ? (
            <div className="p-4 rounded-md bg-slate-50 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-text-secondary">Nội dung bài tập:</div>
                  <strong className="text-base text-text-primary block font-bold">
                    {nextBooking.workoutTitle || 'Tập thể lực & sức bền'}
                  </strong>
                </div>
                <Badge variant="success">Đã lên lịch</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                <div>
                  <span className="text-text-secondary block">Thời gian:</span>
                  <strong className="text-text-primary font-mono">
                    {new Date(nextBooking.startsAt).toLocaleString('vi-VN')}
                  </strong>
                </div>
                <div>
                  <span className="text-text-secondary block">Huấn luyện viên:</span>
                  <strong className="text-text-primary">{nextBooking.trainerName}</strong>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary bg-white p-2 rounded border border-border/80 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Quy định: Hủy lịch trước ít nhất 12 giờ để được hoàn lại lượt tập.</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-text-secondary text-xs">
              Bạn chưa có lịch tập nào sắp tới. Hãy bấm Đặt lịch để sắp xếp buổi tập với Huấn luyện viên!
            </div>
          )}
        </Card>

        {/* Biometric Status & Quick Tips */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Trạng thái Nhận diện Khuôn mặt
              </h3>
              <Badge variant={member.faceRegistered ? 'success' : 'warning'}>
                {member.faceRegistered ? 'Đã kích hoạt' : 'Chưa đăng ký'}
              </Badge>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {member.faceRegistered
                ? 'Hồ sơ khuôn mặt của bạn đã được mã hóa vector bảo mật theo chuẩn DeepFace. Bạn có thể bước qua cổng Kiosk sảnh mà không cần quét thẻ hay mã QR.'
                : 'Bạn chưa kích hoạt nhận diện khuôn mặt. Vui lòng liên hệ quầy lễ tân để chụp 3-5 mẫu khuôn mặt hoặc sử dụng Dynamic QR Code để check-in.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-secondary">Quyền riêng tư GDPR</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/profile')}
              className="text-text-primary hover:text-volt-dark"
            >
              Cài đặt sinh trắc &rarr;
            </Button>
          </div>
        </Card>
      </div>

      {/* Dynamic QR Modal */}
      <MemberQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        memberName={member.name}
        memberId={member.id}
      />
    </div>
  );
};
