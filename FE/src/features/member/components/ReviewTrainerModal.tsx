import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { Booking } from '../../../types';
import { Star, Award, CheckCircle2, User, Clock } from 'lucide-react';

interface ReviewTrainerModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingId: string, rating: number, comment?: string, tags?: string[]) => Promise<void>;
}

const AVAILABLE_TAGS = [
  'Đúng giờ',
  'Kỹ thuật chuẩn xác',
  'Động viên nhiệt tình',
  'Bài tập vừa sức',
  'Cường độ cao, hiệu quả',
  'Thái độ chuyên nghiệp',
  'Giải thích động tác kỹ',
];

export const ReviewTrainerModal: React.FC<ReviewTrainerModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Kỹ thuật chuẩn xác',
    'Động viên nhiệt tình',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!booking) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Xuất sắc — Rất hài lòng!';
      case 4:
        return 'Tốt — Hài lòng với buổi tập';
      case 3:
        return 'Bình thường — Đạt yêu cầu';
      case 2:
        return 'Cần cải thiện thêm';
      case 1:
        return 'Không hài lòng';
      default:
        return 'Chọn mức độ đánh giá';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(booking.id, rating, comment, selectedTags);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeScore = hoverRating || rating;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader
        title="Đánh Giá Buổi Tập Với Huấn Luyện Viên"
        description={`Ca tập ngày ${new Date(booking.startsAt).toLocaleDateString('vi-VN')} với PT ${booking.trainerName}`}
      />
      {isSuccess ? (
        <DialogBody className="py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-text-primary">Gửi đánh giá thành công!</h3>
          <p className="text-xs text-text-secondary">
            Cảm ơn bạn đã đóng góp phản hồi giúp Huấn luyện viên {booking.trainerName} và SmartGym nâng cao chất lượng dịch vụ.
          </p>
        </DialogBody>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4 text-xs">
            {/* Trainer Info Snapshot */}
            <div className="p-3 bg-slate-50 border border-border rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-volt font-bold flex items-center justify-center border border-slate-700 shrink-0">
                {booking.trainerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text-primary text-sm">{booking.trainerName}</div>
                <div className="text-[11px] text-text-secondary flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-volt-dark" />
                    {new Date(booking.startsAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(booking.endsAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>•</span>
                  <span>{booking.workoutTitle || 'Huấn luyện 1-1'}</span>
                </div>
              </div>
            </div>

            {/* Interactive Star Rating */}
            <div className="text-center space-y-2 py-2">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider text-slate-500">
                Chất lượng hướng dẫn của PT
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= activeScore
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-amber-700 min-h-[18px]">
                {getRatingLabel(activeScore)}
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary">
                Điểm bạn ấn tượng ở buổi tập này:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                        selected
                          ? 'border-volt-dark bg-slate-900 text-volt shadow-xs'
                          : 'border-border bg-surface text-text-secondary hover:bg-slate-50'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Comment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary">
                Nhận xét chi tiết hoặc lời nhắn cho PT (tùy chọn)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Ví dụ: PT Long hướng dẫn động tác Squat rất kỹ, chỉnh form chuẩn và động viên nhiệt tình trong các hiệp nặng..."
                className="w-full rounded-md bg-surface border border-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-darksidebar-bg focus:ring-1 focus:ring-darksidebar-bg"
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="volt" isLoading={isLoading} className="font-bold">
              Gửi đánh giá buổi tập
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
};
