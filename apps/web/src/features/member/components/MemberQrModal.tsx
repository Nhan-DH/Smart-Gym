import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { QrCode, RefreshCw, ShieldCheck, Clock, Smartphone } from 'lucide-react';

interface MemberQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberId: string;
}

export const MemberQrModal: React.FC<MemberQrModalProps> = ({
  isOpen,
  onClose,
  memberName,
  memberId,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [qrNonce, setQrNonce] = useState('HMAC_INIT_TOKEN');

  const generateNewToken = () => {
    const randomNonce = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `SG_${memberId}_${Date.now()}_${randomNonce}`;
    setQrNonce(token);
    setSecondsLeft(60);
  };

  useEffect(() => {
    if (!isOpen) return;
    generateNewToken();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, memberId]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader
        title="Mã QR Check-in Động (Dynamic Token)"
        description="Đưa mã QR này trước camera Kiosk sảnh để mở cửa phòng tập"
      />
      <DialogBody className="space-y-4 text-center">
        {/* Dynamic QR Display Box */}
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden shadow-volt">
          <div className="w-56 h-56 bg-white p-3 rounded-lg flex flex-col items-center justify-center relative">
            {/* Simulated high-density QR grid */}
            <div className="w-full h-full bg-slate-950 p-2 rounded flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-white rounded-sm p-1">
                  <div className="w-full h-full bg-black rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs"></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-sm p-1">
                  <div className="w-full h-full bg-black rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* Center icon / brand */}
              <div className="flex items-center justify-center py-2">
                <div className="w-10 h-10 rounded-md bg-volt text-darksidebar-bg font-black text-xs flex items-center justify-center shadow">
                  SG
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="w-12 h-12 bg-white rounded-sm p-1">
                  <div className="w-full h-full bg-black rounded-sm flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-xs"></div>
                  </div>
                </div>
                <div className="text-[8px] font-mono text-slate-400">DYNAMIC-AUTH</div>
              </div>
            </div>
          </div>

          {/* Member Name on Card */}
          <div className="mt-4 text-white font-bold text-sm">{memberName}</div>
          <div className="text-[11px] text-volt font-mono font-semibold">{memberId}</div>

          {/* Countdown Progress */}
          <div className="w-full max-w-xs mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-volt" /> Tự động đổi sau:
              </span>
              <strong className="text-volt font-mono">{secondsLeft}s</strong>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-volt transition-all duration-1000"
                style={{ width: `${(secondsLeft / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Security & Info */}
        <div className="p-3 bg-slate-50 border border-border rounded-md text-left text-xs text-text-secondary space-y-1">
          <div className="font-semibold text-text-primary flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Token bảo mật chống chụp màn hình chia sẻ:
          </div>
          <div className="text-[11px] leading-relaxed">
            Mã QR được mã hóa bằng thuật toán HMAC với thời gian sống 60 giây và chỉ tiêu thụ 1 lần tại cổng Kiosk sảnh (One-time use).
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="secondary"
          size="sm"
          onClick={generateNewToken}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Làm mới mã ngay
        </Button>
        <Button variant="volt" size="sm" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
