import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { memberService, bookingService } from '../../mocks/services';
import { DetailedMember, Booking } from '../../types';
import {
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Dumbbell,
  User,
  Zap,
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

      {/* Row 1: 3 Balanced Cards with Identical Height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Card 1: Digital Membership Pass */}
        <div className="p-5 rounded-xl bg-darksidebar-bg border border-darksidebar-border text-white flex flex-col justify-between shadow-md h-full min-h-[220px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-volt text-darksidebar-bg flex items-center justify-center font-black text-xs shadow-volt">
                SG
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block leading-none">SmartGym Pass</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-semibold mt-0.5">
                  Member Card
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              ACTIVE
            </span>
          </div>

          <div className="my-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gói tập sở hữu</div>
            <div className="text-base font-black text-volt tracking-tight mt-0.5 line-clamp-1">
              {membership?.planName || 'Chưa đăng ký gói'}
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-mono">
              Hạn dùng đến: {membership?.endsAt || 'N/A'}
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-slate-800 text-xs mt-auto">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Hội viên</div>
              <div className="font-bold text-white tracking-wide">{member.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 uppercase">ID</div>
              <div className="font-mono text-volt font-bold">{member.id}</div>
            </div>
          </div>
        </div>

        {/* Card 2: Next Upcoming Session */}
        <Card className="p-5 flex flex-col justify-between h-full min-h-[220px]">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-text-primary">
              <Calendar className="w-4 h-4 text-volt-dark" />
              <span>Ca tập sắp tới</span>
            </div>
            <span className="text-[10px] font-bold text-volt-dark uppercase">1 kèm 1</span>
          </div>

          {nextBooking ? (
            <div className="my-auto py-2 space-y-2">
              <div className="font-bold text-sm text-text-primary line-clamp-1">
                {nextBooking.workoutTitle || 'Tập thể lực & sức bền toàn diện'}
              </div>
              <div className="text-xs text-text-secondary flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-volt-dark" />
                {new Date(nextBooking.startsAt).toLocaleString('vi-VN')}
              </div>
              <div className="text-xs text-text-secondary">
                PT phụ trách: <strong className="text-text-primary">{nextBooking.trainerName}</strong>
              </div>
            </div>
          ) : (
            <div className="my-auto py-3 text-center text-xs text-text-secondary">
              Bạn chưa có ca tập nào sắp tới.
            </div>
          )}

          <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
            <span className="text-[10px] text-amber-700 font-medium">Hủy trước 12h hoàn lượt</span>
            <button
              onClick={() => navigate('/app/schedule')}
              className="text-xs font-bold text-text-primary hover:text-volt-dark flex items-center gap-1"
            >
              Xem lịch &rarr;
            </button>
          </div>
        </Card>

        {/* Card 3: Biometric & Dynamic QR Status */}
        <Card className="p-5 flex flex-col justify-between h-full min-h-[220px]">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sinh trắc & Check-in</span>
            </div>
            <Badge variant={member.faceRegistered ? 'success' : 'neutral'}>
              {member.faceRegistered ? 'Face ID Sẵn sàng' : 'Dùng Dynamic QR'}
            </Badge>
          </div>

          <div className="my-auto py-2 space-y-1.5 text-xs text-text-secondary">
            <p className="leading-relaxed text-[11px]">
              {member.faceRegistered
                ? 'Hồ sơ khuôn mặt mã hóa DeepFace. Bạn có thể tự do bước qua cửa Kiosk không cần chạm.'
                : 'Bạn đang sử dụng mã QR động HMAC 60s để mở cửa. Có thể liên hệ lễ tân để đăng ký Face ID.'}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Quyền riêng tư GDPR: Được bảo vệ
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
            <button
              onClick={() => setIsQrOpen(true)}
              className="text-xs font-bold text-volt-dark hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" /> Mở mã QR sảnh
            </button>
            <button
              onClick={() => navigate('/app/profile')}
              className="text-xs text-text-secondary hover:text-text-primary"
            >
              Cài đặt &rarr;
            </button>
          </div>
        </Card>
      </div>

      {/* Row 2: 3 PT Session Balance Counters - Equal Height */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col justify-between bg-surface border-volt-border/60 ring-1 ring-volt/20">
          <div>
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Khả dụng để đặt</span>
              <Sparkles className="w-4 h-4 text-volt-dark" />
            </div>
            <div className="text-3xl font-black text-text-primary tracking-tight">
              {availablePt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-3 pt-2.5 border-t border-border">
            (Tổng {totalPt} - Đã tập {usedPt} - Giữ {reservedPt})
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between bg-surface">
          <div>
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Đang giữ chỗ</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              {reservedPt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
            </div>
          </div>
          <div className="text-[11px] text-text-secondary mt-3 pt-2.5 border-t border-border">
            Lịch đã xếp trong tương lai
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between bg-surface">
          <div>
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Đã hoàn thành</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-text-primary tracking-tight">
              {usedPt} <span className="text-xs font-bold text-text-secondary uppercase">buổi</span>
            </div>
          </div>
          <div className="text-[11px] text-text-secondary mt-3 pt-2.5 border-t border-border">
            Số ca đã được PT ký duyệt
          </div>
        </Card>
      </div>

      {/* Row 3: Smart Booking CTA Banner - Full Width Symmetrical */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-700 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-volt text-darksidebar-bg uppercase tracking-wider">
            <Sparkles className="w-3 h-3 stroke-[2.5]" /> Google OR-Tools CP-SAT
          </div>
          <h2 className="font-black text-base text-white">
            Tối ưu hóa Lịch tập Thông minh tuần này
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Thuật toán tự động tìm 3 phương án khung giờ lý tưởng nhất khớp ca trực của Huấn luyện viên, tự động giãn cách 48 tiếng nghỉ ngơi và tránh giờ cao điểm phòng tập.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="volt"
            size="md"
            onClick={() => navigate('/app/booking/smart')}
            icon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          >
            Xếp lịch tự động
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="text-white border-slate-700 hover:bg-slate-800"
            onClick={() => navigate('/app/booking/manual')}
          >
            Đặt thủ công
          </Button>
        </div>
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
