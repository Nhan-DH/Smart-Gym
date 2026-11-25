import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Settings,
  ShieldCheck,
  Clock,
  Users,
  Calendar,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    maxOccupancy: 60,
    ptSessionDurationMinutes: 60,
    cancellationThresholdHours: 12,
    openTime: '06:00',
    closeTime: '22:00',
    maxAdvanceBookingDays: 7,
    autoRescheduleNoticeHours: 24,
    gymName: 'SmartGym Fitness & Performance Center',
    branchCode: 'CN-01-CENTRAL',
    faceRecognitionConfidence: 0.85,
    qrValiditySeconds: 60,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-darksidebar-bg" />
          Cấu hình Vận hành Hệ thống (Gym Settings)
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Thiết lập các tham số nghiệp vụ cốt lõi theo quy chuẩn kỹ thuật đồ án SmartGym
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu toàn bộ cấu hình vận hành thành công! Các tham số đã được đồng bộ vào hệ thống.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Facility & Capacity */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Users className="w-4 h-4 text-darksidebar-bg" />
            <h2 className="font-bold text-sm text-text-primary">Sức chứa & Quy mô Cơ sở</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Tên trung tâm</label>
              <Input
                value={settings.gymName}
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Mã cơ sở (Single Branch)</label>
              <Input
                value={settings.branchCode}
                disabled
                className="bg-slate-100 font-mono text-text-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Sức chứa tối đa (Max Occupancy) *
              </label>
              <Input
                type="number"
                value={settings.maxOccupancy}
                onChange={(e) => setSettings({ ...settings, maxOccupancy: Number(e.target.value) })}
                required
              />
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Kiosk sẽ cảnh báo quá tải khi số người trong phòng chạm ngưỡng này.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Thời lượng ca PT chuẩn (Phút)
              </label>
              <Input
                type="number"
                value={settings.ptSessionDurationMinutes}
                disabled
                className="bg-slate-100 font-mono text-text-secondary"
              />
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Cố định 60 phút theo đặc tả nghiệp vụ design.md
              </span>
            </div>
          </div>
        </Card>

        {/* Section 2: Policies & Time Constraints */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Clock className="w-4 h-4 text-darksidebar-bg" />
            <h2 className="font-bold text-sm text-text-primary">Thời gian Hoạt động & Chính sách Hủy lịch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Giờ mở cửa</label>
              <Input
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Giờ đóng cửa</label>
              <Input
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Ngưỡng hủy lịch hoàn lượt (Giờ) *
              </label>
              <Input
                type="number"
                value={settings.cancellationThresholdHours}
                onChange={(e) =>
                  setSettings({ ...settings, cancellationThresholdHours: Number(e.target.value) })
                }
                required
              />
              <span className="text-[11px] text-amber-700 block mt-0.5">
                Hội viên hủy trước 12h: Hoàn lượt. Hủy muộn &lt; 12h: Trừ lượt tập.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Giới hạn đặt lịch trước tối đa (Ngày)
              </label>
              <Input
                type="number"
                value={settings.maxAdvanceBookingDays}
                onChange={(e) =>
                  setSettings({ ...settings, maxAdvanceBookingDays: Number(e.target.value) })
                }
                required
              />
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Cho phép đặt lịch trong vòng 7 ngày tới.
              </span>
            </div>
          </div>
        </Card>

        {/* Section 3: Biometrics & Kiosk */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Lock className="w-4 h-4 text-darksidebar-bg" />
            <h2 className="font-bold text-sm text-text-primary">Bảo mật Sinh trắc học & Kiosk Sảnh</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Ngưỡng độ tin cậy khuôn mặt (Cosine Threshold)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.5"
                max="0.99"
                value={settings.faceRecognitionConfidence}
                onChange={(e) =>
                  setSettings({ ...settings, faceRecognitionConfidence: Number(e.target.value) })
                }
                required
              />
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Độ tương đồng Cosine tối thiểu để chấp nhận mở cổng Kiosk (Khuyến nghị 0.85).
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">
                Thời gian hiệu lực Dynamic QR (Giây)
              </label>
              <Input
                type="number"
                value={settings.qrValiditySeconds}
                onChange={(e) =>
                  setSettings({ ...settings, qrValiditySeconds: Number(e.target.value) })
                }
                required
              />
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Mã QR ký HMAC trên điện thoại hội viên sẽ tự đổi sau 60 giây.
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="volt" size="lg" type="submit" icon={<Save className="w-4 h-4 stroke-[2.5]" />}>
            Lưu thay đổi cấu hình
          </Button>
        </div>
      </form>
    </div>
  );
};
