import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { attendanceService, memberService } from '../../mocks/services';
import {
  ScanFace,
  QrCode,
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Camera,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

type KioskMode = 'CHECK_IN' | 'CHECK_OUT';
type ScannerMode = 'FACE' | 'QR' | 'STAFF_ENROLL';

interface RecognitionResult {
  success: boolean;
  memberName?: string;
  memberId?: string;
  planName?: string;
  remainingDays?: number;
  availablePt?: number;
  error?: string;
}

export const KioskPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [kioskMode, setKioskMode] = useState<KioskMode>('CHECK_IN');
  const [scannerMode, setScannerMode] = useState<ScannerMode>('FACE');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [occupancyCount, setOccupancyCount] = useState<number>(32);
  const [maxOccupancy] = useState<number>(60);

  // Recognition result popup state
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  // Staff Enrollment State
  const [enrollSamples, setEnrollSamples] = useState<number>(0);
  const [enrollTargetMemberId, setEnrollTargetMemberId] = useState('MB-1002');
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Real clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto clear recognition popup after 4 seconds
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      setResult(null);
    }, 4000);
    return () => clearInterval(timer);
  }, [result]);

  // Simulate Face Scan with specific test cases
  const triggerSimulatedScan = async (testCase: 'VALID' | 'LOCKED' | 'NOT_FOUND' | 'CAPACITY_FULL') => {
    setIsScanning(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650)); // < 0.8s reaction time
    setIsScanning(false);

    if (testCase === 'CAPACITY_FULL') {
      setResult({
        success: false,
        error: 'Phòng tập đã đạt trần sức chứa (60/60 người). Vui lòng chờ hội viên khác check-out!',
      });
      return;
    }

    if (testCase === 'NOT_FOUND') {
      setResult({
        success: false,
        error: 'Không nhận diện được khuôn mặt. Vui lòng thử lại hoặc sử dụng Mã Dynamic QR!',
      });
      return;
    }

    if (testCase === 'LOCKED') {
      setResult({
        success: false,
        error: 'Tài khoản của bạn đã bị tạm khóa do vi phạm nội quy. Vui lòng gặp Quầy Lễ Tân!',
      });
      return;
    }

    // VALID CASE
    try {
      const res = await attendanceService.checkInMember('MB-1001', scannerMode === 'FACE' ? 'FACE' : 'QR');
      setOccupancyCount((prev) => (kioskMode === 'CHECK_IN' ? prev + 1 : Math.max(0, prev - 1)));
      setResult({
        success: true,
        memberName: res.memberName,
        memberId: 'MB-1001',
        planName: 'Gói Combo Toàn Diện 3 Tháng + 24 Buổi PT',
        remainingDays: res.remainingDays,
        availablePt: res.availablePt,
      });
    } catch (err) {
      setResult({
        success: false,
        error: (err as Error).message,
      });
    }
  };

  // Staff Enrollment capture
  const handleCaptureSample = () => {
    if (enrollSamples < 4) {
      setEnrollSamples((prev) => prev + 1);
    } else {
      setEnrollSamples(5);
      setTimeout(() => {
        alert(`Đã thu thập đủ 5 mẫu vector khuôn mặt cho hội viên ${enrollTargetMemberId} có kèm bản ghi consent_at!`);
        setScannerMode('FACE');
        setEnrollSamples(0);
      }, 500);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none font-sans relative">
      {/* Kiosk Header */}
      <header className="h-20 bg-slate-900/90 border-b border-slate-800 px-6 sm:px-10 flex items-center justify-between shrink-0">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-volt text-darksidebar-bg flex items-center justify-center font-black shadow-volt">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight block leading-none text-white">
              Smart<span className="text-volt">Gym</span>
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1 block">
              Kiosk Điểm Danh Sảnh Ra Vào
            </span>
          </div>
        </div>

        {/* Live Occupancy Gauge & Digital Clock */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-lg">
            <Activity className="w-4 h-4 text-volt animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mật độ phòng tập:</span>
              <strong className="text-volt font-black text-sm">
                {occupancyCount} / {maxOccupancy} người
              </strong>{' '}
              <span className="text-slate-400 text-[11px]">
                ({Math.round((occupancyCount / maxOccupancy) * 100)}%)
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black font-mono text-white tracking-wider">
              {currentTime || '08:00:00'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Chi nhánh 01 (Cơ sở chính)
            </div>
          </div>

          {/* Quick Exit to Manager Portal */}
          <button
            onClick={() => {
              switchRole('MANAGER');
              navigate('/admin/dashboard');
            }}
            title="Thoát Kiosk về Quản lý"
            className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Kiosk Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Big Dual-Mode Switcher: [ VÀO (CHECK-IN) ] / [ RA (CHECK-OUT) ] */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-6">
          <button
            onClick={() => setKioskMode('CHECK_IN')}
            className={`py-4 px-6 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
              kioskMode === 'CHECK_IN'
                ? 'bg-volt text-darksidebar-bg ring-4 ring-volt/40 scale-102 font-black'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <LogIn className="w-6 h-6 stroke-[3]" />
            <span>VÀO PHÒNG (CHECK-IN)</span>
          </button>

          <button
            onClick={() => setKioskMode('CHECK_OUT')}
            className={`py-4 px-6 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
              kioskMode === 'CHECK_OUT'
                ? 'bg-white text-darksidebar-bg ring-4 ring-white/40 scale-102 font-black'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <LogOut className="w-6 h-6 stroke-[3]" />
            <span>RỜI PHÒNG (CHECK-OUT)</span>
          </button>
        </div>

        {/* Central Scanner Window */}
        <div className="w-full max-w-lg aspect-4/3 bg-slate-900 rounded-2xl border-2 border-slate-700 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          {/* Simulated Camera Video Stream */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900/90 to-slate-950 flex items-center justify-center">
            {/* Camera grid overlay */}
            <div className="absolute inset-4 border border-dashed border-slate-700/60 rounded-xl pointer-events-none" />

            {/* Scanning radar line */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-volt shadow-volt animate-bounce" />
            )}
          </div>

          {scannerMode === 'FACE' && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
              <div
                className={`w-40 h-40 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  isScanning
                    ? 'border-volt text-volt shadow-volt scale-105'
                    : 'border-slate-500 text-slate-400'
                }`}
              >
                <ScanFace className="w-20 h-20 stroke-[1.5]" />
              </div>
              <div className="text-white font-bold text-base">
                {isScanning ? 'Đang trích xuất vector khuôn mặt...' : 'Nhìn thẳng vào khung hình để quét mặt'}
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                Hệ thống DeepFace tự động so khớp vector Cosine Similarity &lt; 0.8 giây
              </p>
            </div>
          )}

          {scannerMode === 'QR' && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-40 h-40 rounded-2xl border-2 border-volt text-volt flex items-center justify-center bg-slate-950/60 shadow-volt">
                <QrCode className="w-20 h-20 stroke-[1.5]" />
              </div>
              <div className="text-white font-bold text-base">
                Hướng mã Dynamic QR trên điện thoại vào camera
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                Mã QR ký HMAC đổi sau 60 giây dùng 1 lần duy nhất
              </p>
            </div>
          )}

          {scannerMode === 'STAFF_ENROLL' && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3 w-full max-w-sm">
              <div className="w-28 h-28 rounded-xl border-2 border-emerald-400 text-emerald-400 flex items-center justify-center bg-slate-950/80">
                <Camera className="w-14 h-14" />
              </div>
              <div className="text-white font-bold text-sm">Chế độ Đăng ký Mẫu Khuôn mặt có Nhân viên</div>
              <div className="text-xs text-slate-300">
                Tiến độ: <strong className="text-volt">{enrollSamples} / 5 mẫu</strong>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-volt h-full transition-all"
                  style={{ width: `${(enrollSamples / 5) * 100}%` }}
                />
              </div>
              <Button
                variant="volt"
                size="sm"
                onClick={handleCaptureSample}
                icon={<Camera className="w-4 h-4 stroke-[2.5]" />}
              >
                Chụp mẫu tiếp theo
              </Button>
            </div>
          )}

          {/* Recognition Result Modal / Overlay (< 0.8s reaction feedback) */}
          {result && (
            <div
              className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200 ${
                result.success
                  ? 'bg-slate-950/95 border-4 border-emerald-500'
                  : 'bg-slate-950/95 border-4 border-red-500'
              }`}
            >
              {result.success ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-400 uppercase tracking-wider border border-emerald-500">
                      CỬA ĐÃ MỞ (GATE OPENED)
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2">{result.memberName}</h2>
                    <div className="text-xs text-volt font-mono font-bold">{result.memberId}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1 max-w-sm mx-auto text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gói tập:</span>
                      <strong className="text-white truncate">{result.planName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời hạn còn lại:</span>
                      <strong className="text-emerald-400 font-bold">{result.remainingDays} ngày</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số buổi PT 1-1 còn:</span>
                      <strong className="text-volt font-bold">{result.availablePt} buổi</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Chào mừng bạn đến phòng tập! Cửa sẽ tự động đóng sau 3 giây.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <XCircle className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-red-950 text-red-400 uppercase tracking-wider border border-red-700">
                      TỪ CHỐI RA VÀO (ACCESS DENIED)
                    </span>
                    <h2 className="text-lg font-bold text-white mt-2 max-w-xs mx-auto">
                      {result.error}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-400">
                    Vui lòng liên hệ nhân viên Lễ tân tại quầy để được hỗ trợ.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mode Switcher Tabs (Face / QR / Staff Enroll) */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setScannerMode('FACE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              scannerMode === 'FACE'
                ? 'bg-volt text-darksidebar-bg shadow-volt'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>Nhận diện Khuôn mặt</span>
          </button>

          <button
            onClick={() => setScannerMode('QR')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              scannerMode === 'QR'
                ? 'bg-volt text-darksidebar-bg shadow-volt'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Quét Mã Dynamic QR</span>
          </button>

          <button
            onClick={() => setScannerMode('STAFF_ENROLL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              scannerMode === 'STAFF_ENROLL'
                ? 'bg-volt text-darksidebar-bg shadow-volt'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng ký Face ID (Lễ tân)</span>
          </button>
        </div>
      </main>

      {/* Demo Simulation Trigger Bar (Footer) */}
      <footer className="h-16 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-between text-xs shrink-0">
        <div className="text-slate-400 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-volt" />
          <span>Mô phỏng phản hồi kiểm thử Kiosk (&lt; 0.8s):</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="volt"
            size="sm"
            onClick={() => triggerSimulatedScan('VALID')}
            isLoading={isScanning}
          >
            Ca 1: Hội viên Hợp lệ (Mở cửa)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="text-amber-500 border-slate-700"
            onClick={() => triggerSimulatedScan('LOCKED')}
          >
            Ca 2: Tài khoản bị khóa
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="text-slate-300 border-slate-700"
            onClick={() => triggerSimulatedScan('NOT_FOUND')}
          >
            Ca 3: Không khớp mặt
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="text-red-400 border-slate-700"
            onClick={() => triggerSimulatedScan('CAPACITY_FULL')}
          >
            Ca 4: Quá tải (60/60)
          </Button>
        </div>
      </footer>
    </div>
  );
};
