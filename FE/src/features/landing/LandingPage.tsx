import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Dumbbell,
  ScanFace,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Clock,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  MapPin,
  Phone,
  QrCode,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
  Flame,
  Scale,
  Calculator,
  Star,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  HeartPulse,
  Send,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // 1. Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'CHÚNG TÔI LÀ SMARTGYM',
      subtitle: 'TRANING TO DAY • BỨT PHÁ GIỚI HẠN BẢN THÂN',
      description:
        'Hơn cả một phòng tập, SmartGym kiến tạo lối sống khỏe mạnh, kỷ luật và tràn đầy năng lượng. Hệ thống quản lý thông minh 4.0 đồng hành cùng bạn trên từng bước tiến thể lực!',
      bgImage:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
      badge: 'CÔNG NGHỆ THỂ THAO 4.0',
      primaryBtn: 'ĐĂNG KÝ TẬP THỬ NGAY',
      primaryAction: '#trial-form',
      secondaryBtn: 'KHÁM PHÁ CƠ SỞ',
      secondaryAction: '#services',
    },
    {
      title: 'TIÊU CHUẨN CỦA SỰ ĐỔI MỚI',
      subtitle: 'CHECK-IN KHUÔN MẶT <0.8S & XẾP LỊCH PT THÔNG MINH',
      description:
        'Không cần mang thẻ nhựa, không lo quên mật mã. Kiosk cảm ứng DeepFace đón bạn ngay tại cửa và thuật toán CP-SAT giải bài toán ghép lịch 1:1 tối ưu nhất cho bạn và Huấn luyện viên.',
      bgImage:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80',
      badge: 'SINH TRẮC HỌC & AI CP-SAT',
      primaryBtn: 'TRẢI NGHIỆM MÀN HÌNH KIOSK',
      primaryAction: '/kiosk',
      secondaryBtn: 'XEM CỔNG HỘI VIÊN',
      secondaryAction: '/app',
    },
    {
      title: 'HỆ THỐNG LỚP GROUPX SÔI ĐỘNG',
      subtitle: 'BODY PUMP • BODY COMBAT • ZUMBA • AEROBICS',
      description:
        'Đốt cháy tới 650 kcal mỗi giờ cùng âm nhạc bùng nổ và HLV nhiệt huyết. Đa dạng bộ môn từ kháng lực, cardio boxing đến vũ điệu giải tỏa stress sau ngày làm việc.',
      bgImage:
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80',
      badge: 'ĐỐT CHÁY NĂNG LƯỢNG',
      primaryBtn: 'XEM BẢNG GIÁ THẺ TẬP',
      primaryAction: '#pricing',
      secondaryBtn: 'ĐẶT LỊCH HỌC NGAY',
      secondaryAction: '/app/schedule',
    },
  ];

  // Auto-advance slides every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 2. BMI Calculator State
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(65);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    advice: string;
    tdee: number;
  } | null>(null);

  const calculateBmi = () => {
    if (!height || !weight) return;
    const heightInMeters = height / 100;
    const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      category = 'Gầy / Thiếu cân';
      color = 'text-amber-400 border-amber-400/40 bg-amber-400/10';
      advice = 'Bạn nên tăng cường dinh dưỡng kết hợp giáo án Body Pump và Gym tăng cơ để cải thiện thể trạng.';
    } else if (bmi <= 24.9) {
      category = 'Bình thường / Lý tưởng';
      color = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
      advice = 'Vóc dáng rất cân đối! Duy trì tập luyện đều đặn 3-4 buổi/tuần cùng các lớp GroupX và Gym Cardio.';
    } else if (bmi <= 29.9) {
      category = 'Thừa cân';
      color = 'text-orange-400 border-orange-400/40 bg-orange-400/10';
      advice = 'Nên kết hợp chế độ ăn thâm hụt calo với các lớp Body Combat, Zumba và HIIT để đốt mỡ hiệu quả.';
    } else {
      category = 'Béo phì';
      color = 'text-rose-400 border-rose-400/40 bg-rose-400/10';
      advice = 'Khuyến nghị đăng ký gói Huấn luyện viên cá nhân (PT 1:1) để có phác đồ bài tập an toàn cho khớp.';
    }

    // Rough BMR / TDEE estimation
    const bmr =
      gender === 'MALE'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = Math.round(bmr * 1.55);

    setBmiResult({ bmi, category, color, advice, tdee });
  };

  // Run initial BMI calculation
  useEffect(() => {
    calculateBmi();
  }, [height, weight, age, gender]);

  // 3. Trial Form State
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialGoal, setTrialGoal] = useState('GIAM_MO');
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName || !trialPhone) return;
    setTrialSubmitted(true);
    setTimeout(() => {
      setTrialSubmitted(false);
      setTrialName('');
      setTrialPhone('');
    }, 4500);
  };

  // 4. GroupX / Services Catalog (Directly inspired by BlueGym)
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'GROUPX' | 'STRENGTH' | 'PT'>('ALL');

  const services = [
    {
      id: 'body-pump',
      name: 'BODY PUMP',
      category: 'GROUPX',
      tag: 'Đốt mỡ & Tăng cơ',
      duration: '60 Phút',
      calories: '550 - 650 kcal',
      desc: 'Bài tập kháng lực toàn thân cùng tạ đòn trên nền âm nhạc sôi động, định hình vóc dáng thon gọn và săn chắc.',
      image:
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'body-combat',
      name: 'BODY COMBAT',
      category: 'GROUPX',
      tag: 'Cardio & Phản xạ',
      duration: '50 Phút',
      calories: '600 - 740 kcal',
      desc: 'Bộ môn võ thuật kích thích giải phóng năng lượng mạnh mẽ kết hợp Boxing, Karate, Taekwondo và Muay Thai.',
      image:
        'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'zumba',
      name: 'ZUMBA DANCE',
      category: 'GROUPX',
      tag: 'Vũ điệu & Tươi vui',
      duration: '55 Phút',
      calories: '500 - 600 kcal',
      desc: 'Hòa mình vào vũ điệu Latin cuồng nhiệt, nhịp điệu bùng nổ giúp xả stress hoàn hảo và cải thiện hệ tim mạch.',
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'aerobics',
      name: 'AEROBICS & YOGA',
      category: 'GROUPX',
      tag: 'Dẻo dai & Săn chắc',
      duration: '60 Phút',
      calories: '400 - 500 kcal',
      desc: 'Rèn luyện sự uyển chuyển, kéo giãn cơ bắp, cân bằng hơi thở và phục hồi năng lượng tinh thần tối đa.',
      image:
        'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'gym-cardio',
      name: 'GYM & CARDIO MATRIX',
      category: 'STRENGTH',
      tag: 'Máy tập nhập khẩu',
      duration: 'Tự do',
      calories: '450 - 700 kcal',
      desc: 'Trang thiết bị Technogym chuẩn quốc tế: Dàn máy khối, khu tạ đơn 1-50kg, máy chạy bộ cảm ứng đa phương tiện.',
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'pt-1on1',
      name: 'HUẤN LUYỆN VIÊN 1 KÈM 1',
      category: 'PT',
      tag: 'Cá nhân hóa độc quyền',
      duration: '60 Phút/buổi',
      calories: '600 - 800 kcal',
      desc: 'Giáo án đo ni đóng giày theo chỉ số cơ thể, kèm cặp chuẩn form từng động tác, đánh giá 1-5 sao sau mỗi ca tập.',
      image:
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'ALL') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY BAR (Hotline, Hours, Branch Info)
      ────────────────────────────────────────────────────────────── */}
      <div className="bg-darksidebar-bg border-b border-darksidebar-border text-slate-300 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-volt" />
              <span>Hotline tư vấn:</span>
              <strong className="text-white hover:text-volt transition-colors">1900 6868 • 0987 562 211</strong>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-volt" />
              <span>Mở cửa: Thứ 2 - CN (05:30 - 21:30)</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-volt" />
              <span>Cơ sở chính: Tầng 2, Tòa nhà Thể Thao SmartGym, Hà Nội</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-volt/10 text-volt text-[11px] font-semibold border border-volt/30">
              <span className="w-1.5 h-1.5 rounded-full bg-volt animate-ping" />
              Phòng tập đang hoạt động: 32/60 Người
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. STICKY MAIN HEADER (Logo, Nav Links, CTAs, Theme Toggle)
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo - Bold Athletic BlueGym Vibe */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-darksidebar-bg border border-volt/40 flex items-center justify-center text-volt shadow-sm group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-xl sm:text-2xl tracking-tighter text-text-primary uppercase flex items-center gap-1">
                SMART<span className="text-volt">GYM</span>
              </div>
              <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">
                TRANING TO DAY
              </div>
            </div>
          </a>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-text-secondary">
            <a href="#services" className="hover:text-volt transition-colors py-1">
              Dịch vụ & Lớp học
            </a>
            <a href="#technology" className="hover:text-volt transition-colors py-1">
              Công nghệ 4.0
            </a>
            <a href="#bmi" className="hover:text-volt transition-colors py-1 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-volt" />
              <span>Tính chỉ số BMI</span>
            </a>
            <a href="#transformations" className="hover:text-volt transition-colors py-1">
              Before & After
            </a>
            <a href="#pricing" className="hover:text-volt transition-colors py-1">
              Bảng giá thẻ tập
            </a>
            <a href="#facilities" className="hover:text-volt transition-colors py-1">
              Cơ sở vật chất
            </a>
            <a href="#portals" className="hover:text-volt transition-colors py-1 text-volt-dark dark:text-volt font-bold">
              4 Cổng Hệ Thống
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Chuyển chế độ sáng tối"
              className="p-2 rounded-md border border-border bg-surface-subtle hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Quick Demo Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth/login')}
              className="text-xs font-bold border-border hidden sm:inline-flex"
            >
              Đăng nhập
            </Button>

            {/* Primary Action Button */}
            <a
              href="#trial-form"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-extrabold text-xs sm:text-sm shadow-md transition-all uppercase tracking-tight"
            >
              <Flame className="w-4 h-4 fill-darksidebar-bg" />
              <span>Đăng ký tập thử</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO CAROUSEL / SLIDER (Inspired directly by BlueGym Banner)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[560px] sm:h-[640px] md:h-[700px] w-full overflow-hidden bg-black select-none">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Dark Vignette Gradient */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out transform scale-105"
                style={{ backgroundImage: `url('${slide.bgImage}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              {/* Slide Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left z-20">
                <div className="max-w-2xl space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-volt/20 border border-volt/40 text-volt text-xs font-black tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <div className="text-base sm:text-xl font-extrabold text-volt tracking-tight uppercase">
                    {slide.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {slide.primaryAction.startsWith('#') ? (
                      <a
                        href={slide.primaryAction}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-volt/20 transition-transform active:scale-95"
                      >
                        <span>{slide.primaryBtn}</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(slide.primaryAction)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-volt/20 transition-transform active:scale-95"
                      >
                        <span>{slide.primaryBtn}</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    )}

                    {slide.secondaryAction.startsWith('#') ? (
                      <a
                        href={slide.secondaryAction}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-sm transition-colors"
                      >
                        <span>{slide.secondaryBtn}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(slide.secondaryAction)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-sm transition-colors"
                      >
                        <span>{slide.secondaryBtn}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Slide trước"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-volt text-white hover:text-black border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide tiếp theo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-volt text-white hover:text-black border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Chuyển tới slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-volt shadow-volt' : 'w-2.5 bg-white/40 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STATS TICKER STRIP (Key Operational Metrics)
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-darksidebar-bg border-y border-darksidebar-border text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-darksidebar-border">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-volt tracking-tight">32 / 60</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Sức chứa phòng tập</div>
              <div className="text-[10px] text-emerald-400 font-medium">● Đang hoạt động thông thoáng</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">&lt; 0.8 Giây</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Tốc độ Kiosk Face ID</div>
              <div className="text-[10px] text-volt font-medium">Bảo mật vector không lưu ảnh thô</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-volt tracking-tight">100% GiST</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Toàn vẹn lịch đặt 1:1</div>
              <div className="text-[10px] text-slate-400 font-medium">Khóa PostgreSQL chống race-condition</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">4.9 / 5.0 ★</div>
              <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Đánh giá Hội viên</div>
              <div className="text-[10px] text-amber-400 font-medium">100% đánh giá minh bạch sau buổi tập</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SERVICES & FITNESS CLASSES (Body Pump, Combat, Zumba, Gym, PT)
      ────────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 border-b border-border bg-surface-subtle/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="volt">BỘ MÔN & LỚP TẬP ĐA DẠNG</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase">
              CÁC DỊCH VỤ TẬP LUYỆN NỔI BẬT
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Khám phá thế giới rèn luyện thể lực toàn diện tại SmartGym. Dù mục tiêu của bạn là giảm cân, tăng cơ, cải thiện độ dẻo dai hay xả stress, chúng tôi đều có bộ môn lý tưởng dành riêng cho bạn.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { key: 'ALL', label: 'TẤT CẢ DỊCH VỤ' },
                { key: 'GROUPX', label: 'LỚP HỌC GROUPX' },
                { key: 'STRENGTH', label: 'GYM & TẠ ĐƠN' },
                { key: 'PT', label: 'HLV 1 KÈM 1' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase ${
                    activeCategory === tab.key
                      ? 'bg-volt text-darksidebar-bg shadow-sm'
                      : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group rounded-lg overflow-hidden bg-surface border border-border hover:border-volt/60 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-volt text-darksidebar-bg font-extrabold text-[11px] uppercase tracking-wide shadow">
                      {service.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-volt" />
                      <span>{service.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{service.calories}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tight group-hover:text-volt transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <a
                      href="#trial-form"
                      className="text-xs font-bold text-volt-dark dark:text-volt hover:underline flex items-center gap-1"
                    >
                      <span>Đăng ký tập thử lớp này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => navigate('/app/schedule')}
                      className="px-3 py-1.5 rounded text-[11px] font-bold bg-surface-subtle hover:bg-border text-text-primary transition-colors"
                    >
                      Xem lịch học
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. INTERACTIVE BMI CALCULATOR (Signature Feature of BlueGym)
      ────────────────────────────────────────────────────────────── */}
      <section id="bmi" className="py-20 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Description & Instructions */}
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="volt">CÔNG CỤ ĐO LƯỜNG THỂ TRẠNG</Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase leading-tight">
                TÍNH CHỈ SỐ BMI <br />
                <span className="text-volt">ĐỊNH HÌNH MỤC TIÊU TẬP LUYỆN</span>
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Chỉ số khối cơ thể (BMI - Body Mass Index) là công cụ tiêu chuẩn được WHO khuyến nghị để đánh giá tỷ lệ giữa chiều cao và cân nặng, giúp bạn xác định liệu cơ thể đang ở trạng thái chuẩn mực, gầy hay thừa cân.
              </p>

              <div className="space-y-3 pt-2 text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-volt/20 text-volt-dark dark:text-volt flex items-center justify-center font-bold">1</div>
                  <span>Nhập thông số chiều cao (cm), cân nặng (kg) và độ tuổi thực tế.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-volt/20 text-volt-dark dark:text-volt flex items-center justify-center font-bold">2</div>
                  <span>Hệ thống phân tích mức BMI chuẩn và lượng calo tiêu thụ TDEE.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-volt/20 text-volt-dark dark:text-volt flex items-center justify-center font-bold">3</div>
                  <span>Nhận lời khuyên dinh dưỡng và gợi ý gói tập phù hợp nhất tại SmartGym.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive BMI Form & Live Result Card */}
            <div className="lg:col-span-7 bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs Form */}
                <div className="space-y-5">
                  <h3 className="text-base font-extrabold text-text-primary uppercase tracking-tight flex items-center gap-2">
                    <Scale className="w-4 h-4 text-volt" />
                    <span>Nhập Thông Số Cơ Thể</span>
                  </h3>

                  {/* Gender Select */}
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Giới tính</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('MALE')}
                        className={`py-2 px-3 rounded-md text-xs font-bold border transition-all ${
                          gender === 'MALE'
                            ? 'bg-volt text-darksidebar-bg border-volt font-black shadow-sm'
                            : 'bg-surface-subtle border-border text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Nam Giới
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('FEMALE')}
                        className={`py-2 px-3 rounded-md text-xs font-bold border transition-all ${
                          gender === 'FEMALE'
                            ? 'bg-volt text-darksidebar-bg border-volt font-black shadow-sm'
                            : 'bg-surface-subtle border-border text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Nữ Giới
                      </button>
                    </div>
                  </div>

                  {/* Height Slider & Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Chiều cao</label>
                      <span className="text-xs font-extrabold text-text-primary">{height} cm</span>
                    </div>
                    <input
                      type="range"
                      min={120}
                      max={220}
                      value={height}
                      onChange={(e) => setHeight(+e.target.value)}
                      className="w-full accent-volt cursor-pointer"
                    />
                  </div>

                  {/* Weight Slider & Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Cân nặng</label>
                      <span className="text-xs font-extrabold text-text-primary">{weight} kg</span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={150}
                      value={weight}
                      onChange={(e) => setWeight(+e.target.value)}
                      className="w-full accent-volt cursor-pointer"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-text-secondary uppercase">Độ tuổi</label>
                      <span className="text-xs font-extrabold text-text-primary">{age} tuổi</span>
                    </div>
                    <input
                      type="range"
                      min={14}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(+e.target.value)}
                      className="w-full accent-volt cursor-pointer"
                    />
                  </div>
                </div>

                {/* Output Card */}
                {bmiResult && (
                  <div className="bg-surface-subtle/80 rounded-lg p-5 border border-border flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Kết quả phân tích thể trạng
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-text-primary tracking-tight">
                          {bmiResult.bmi}
                        </span>
                        <span className="text-xs font-bold text-text-secondary">BMI</span>
                      </div>

                      <div className={`inline-block px-3 py-1 rounded border text-xs font-extrabold uppercase ${bmiResult.color}`}>
                        {bmiResult.category}
                      </div>

                      {/* Visual BMI Scale */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
                          <span>Gầy (&lt;18.5)</span>
                          <span>Chuẩn (18.5 - 24.9)</span>
                          <span>Thừa (&gt;25)</span>
                        </div>
                        <div className="h-2 rounded-full w-full bg-slate-200 dark:bg-slate-700 flex overflow-hidden">
                          <div className="w-[30%] bg-amber-400" />
                          <div className="w-[40%] bg-emerald-400" />
                          <div className="w-[30%] bg-rose-400" />
                        </div>
                      </div>

                      <div className="pt-2 text-xs text-text-secondary leading-relaxed bg-surface p-3 rounded border border-border">
                        <strong>Lời khuyên chuyên gia:</strong> {bmiResult.advice}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-text-secondary font-medium">Calo duy trì (TDEE):</span>
                        <strong className="text-volt-dark dark:text-volt font-bold">{bmiResult.tdee} kcal/ngày</strong>
                      </div>
                    </div>

                    <a
                      href="#trial-form"
                      className="w-full py-2.5 px-3 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-extrabold text-xs text-center uppercase tracking-wide transition-all shadow-sm block"
                    >
                      Đăng ký gói tập theo chỉ số này
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SMARTGYM 4.0 TECHNOLOGY ECOSYSTEM (Differentiating Factor)
      ────────────────────────────────────────────────────────────── */}
      <section id="technology" className="py-20 border-b border-border bg-darksidebar-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded bg-volt/20 text-volt font-bold text-xs uppercase tracking-wider border border-volt/30">
              ĐỘT PHÁ CÔNG NGHỆ QUẢN LÝ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              HỆ SINH THÁI CÔNG NGHỆ 4.0 ĐỘC QUYỀN
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              SmartGym loại bỏ hoàn toàn các rào cản thủ công của phòng tập truyền thống. Mọi tương tác từ cửa ra vào, đặt lịch PT đến giáo án đều được tự động hóa chính xác tuyệt đối.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Face ID Kiosk */}
            <div className="p-6 rounded-lg bg-darksidebar-surface/80 border border-darksidebar-border hover:border-volt/60 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-lg bg-volt/10 text-volt flex items-center justify-center border border-volt/30">
                <ScanFace className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Kiosk Check-in Face ID &lt;0.8s
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Camera AI nhận diện khuôn mặt tức thì ngay khi bước tới cửa. Không lo mất thẻ, không phiền toái. Hệ thống mã hóa vector và tôn trọng quyền riêng tư GDPR.
              </p>
              <div className="pt-2 text-xs font-bold text-volt flex items-center gap-1">
                <span>Trải nghiệm tại Kiosk sảnh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 2: Google OR-Tools CP-SAT */}
            <div className="p-6 rounded-lg bg-darksidebar-surface/80 border border-darksidebar-border hover:border-volt/60 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-lg bg-volt/10 text-volt flex items-center justify-center border border-volt/30">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Xếp Lịch Thông Minh CP-SAT
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thuật toán tối ưu hóa của Google ghép lịch 1:1 tự động theo mục tiêu rèn luyện, khung giờ rảnh của bạn và lịch dạy của HLV mà không sợ bị trùng ca.
              </p>
              <div className="pt-2 text-xs font-bold text-volt flex items-center gap-1">
                <span>3 phương án tối ưu tự chọn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 3: Concurrency Integrity */}
            <div className="p-6 rounded-lg bg-darksidebar-surface/80 border border-darksidebar-border hover:border-volt/60 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-lg bg-volt/10 text-volt flex items-center justify-center border border-volt/30">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Toàn Vẹn Dữ Liệu Tuyệt Đối
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ràng buộc PostgreSQL GiST Exclusion ngăn chặn 100% tình trạng hai hội viên vô tình đặt chung một khung giờ PT. Minh bạch số lượt tập còn lại.
              </p>
              <div className="pt-2 text-xs font-bold text-volt flex items-center gap-1">
                <span>Chính sách hủy hoàn trước 12h</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 4: Digital Workout & Rating */}
            <div className="p-6 rounded-lg bg-darksidebar-surface/80 border border-darksidebar-border hover:border-volt/60 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-lg bg-volt/10 text-volt flex items-center justify-center border border-volt/30">
                <Star className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Giáo Án Số & Đánh Giá 1-5★
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Theo dõi tiến độ sets, reps, kg trực tiếp trên web. Sau mỗi ca tập hoàn thành, hội viên gửi đánh giá 1-5 sao và tiêu chí chất lượng cho HLV.
              </p>
              <div className="pt-2 text-xs font-bold text-volt flex items-center gap-1">
                <span>Nâng cao chất lượng dịch vụ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BEFORE & AFTER - MEMBER SUCCESS STORIES (BlueGym Style)
      ────────────────────────────────────────────────────────────── */}
      <section id="transformations" className="py-20 border-b border-border bg-surface-subtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="volt">KẾT QUẢ THỰC TẾ</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase">
              BEFORE & AFTER • CÂU CHUYỆN HỘI VIÊN
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              "Chỉ có luyện tập và luyện tập chăm chỉ sẽ là cách tốt nhất để bạn có thể dễ dàng chạm tới giấc mơ hình thể của mình! Hãy để SmartGym trở thành người đồng hành tin cậy cùng bạn."
            </p>
          </div>

          {/* Member Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm flex flex-col">
              <div className="h-60 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
                  alt="Hoàng Nam"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-darksidebar-bg/90 text-volt text-[11px] font-black px-2.5 py-1 rounded border border-volt/40">
                  GIẢM 14KG MỠ THỪA
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-text-primary">Anh Hoàng Nam (29 tuổi)</h3>
                    <span className="text-xs font-semibold text-text-secondary">Lộ trình 6 Tháng</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "Trước đây mình làm IT ngồi nhiều, bụng mỡ và đau lưng liên miên. Nhờ HLV tại SmartGym lên giáo án bài bản và theo dõi sát sao, mình đã lấy lại vóc dáng săn chắc và năng lượng tích cực mỗi ngày."
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span>Gói tập: <strong>6 Tháng PT 1:1</strong></span>
                  <span className="text-amber-500 font-bold">5.0 ★★★★★</span>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm flex flex-col">
              <div className="h-60 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
                  alt="Mai Phương"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-darksidebar-bg/90 text-volt text-[11px] font-black px-2.5 py-1 rounded border border-volt/40">
                  TĂNG 4.5KG CƠ THUẦN
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-text-primary">Chị Mai Phương (26 tuổi)</h3>
                    <span className="text-xs font-semibold text-text-secondary">Lộ trình 4 Tháng</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "Các lớp Body Pump và Zumba của phòng tập cực kỳ cuốn hút! Không gian sạch sẽ, phòng tắm nóng lạnh tiện nghi và đặc biệt là check-in quét mặt Kiosk chỉ mất chưa đến 1 giây."
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span>Gói tập: <strong>Thẻ 1 Năm GroupX</strong></span>
                  <span className="text-amber-500 font-bold">5.0 ★★★★★</span>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm flex flex-col">
              <div className="h-60 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
                  alt="Tuấn Anh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-darksidebar-bg/90 text-volt text-[11px] font-black px-2.5 py-1 rounded border border-volt/40">
                  TĂNG SỨC BỀN & TIM MẠCH
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-text-primary">Anh Tuấn Anh (35 tuổi)</h3>
                    <span className="text-xs font-semibold text-text-secondary">Lộ trình 8 Tháng</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "Điểm mình thích nhất là đặt lịch tập thông minh không bao giờ sợ trùng giờ với người khác. Máy móc Technogym chuẩn xịn, tạ luôn sắp xếp ngăn nắp, kỷ luật cao."
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span>Gói tập: <strong>VIP All-Inclusive</strong></span>
                  <span className="text-amber-500 font-bold">5.0 ★★★★★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. MEMBERSHIP PRICING (Clear, Transparent, BlueGym Structure)
      ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="volt">CHÍNH SÁCH GIÁ THẺ TẬP</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase">
              BẢNG GIÁ THẺ HỘI VIÊN MINH BẠCH
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Trọn gói quyền lợi tập luyện, không phụ phí ẩn. Hỗ trợ thanh toán nhanh bằng VietQR tự động hoặc tiền mặt tại quầy lễ tân.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Plan 1: Starter */}
            <div className="rounded-xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 shadow-sm hover:border-text-secondary transition-colors">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">Gói Khởi Động</div>
                  <h3 className="text-2xl font-black text-text-primary">THẺ 1 THÁNG</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-text-primary">500.000</span>
                  <span className="text-xs font-bold text-text-secondary">VNĐ / Tháng</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Lựa chọn hoàn hảo để trải nghiệm toàn bộ không gian phòng tập và tiện ích công nghệ cao.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tập luyện không giới hạn khung giờ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Check-in Kiosk Face ID & Dynamic QR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sử dụng phòng tắm nóng lạnh, locker</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]">—</span>
                    <span>Không kèm buổi HLV cá nhân (PT)</span>
                  </div>
                </div>
              </div>

              <a
                href="#trial-form"
                className="w-full py-3 px-4 rounded-md border border-border hover:bg-surface-subtle font-extrabold text-xs uppercase text-center text-text-primary transition-colors block"
              >
                Đăng ký tập thử gói này
              </a>
            </div>

            {/* Plan 2: Pro (Best Seller) */}
            <div className="rounded-xl border-2 border-volt bg-surface p-7 flex flex-col justify-between space-y-6 shadow-xl relative scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-volt text-darksidebar-bg text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">
                GÓI ĐƯỢC CHỌN NHIỀU NHẤT
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-volt-dark dark:text-volt">Phổ Biến Nhất</div>
                  <h3 className="text-2xl font-black text-text-primary">THẺ 3 THÁNG</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-volt-dark dark:text-volt">1.200.000</span>
                  <span className="text-xs font-bold text-text-secondary">VNĐ / 3 Tháng</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Tiết kiệm 20% chi phí. Đủ thời gian để cơ thể có sự chuyển biến rõ rệt về vóc dáng và sức bền.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border text-xs text-text-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-volt shrink-0" />
                    <span>Tất cả quyền lợi của Thẻ 1 Tháng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-volt shrink-0" />
                    <span>Tham gia toàn bộ các lớp GroupX sôi động</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-volt shrink-0" />
                    <span><strong>Tặng 1 buổi đo InBody & tư vấn PT 1:1</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-volt shrink-0" />
                    <span>Theo dõi giáo án trên Cổng Hội Viên</span>
                  </div>
                </div>
              </div>

              <a
                href="#trial-form"
                className="w-full py-3 px-4 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-black text-xs uppercase text-center tracking-wide transition-all shadow-md block"
              >
                Nhận ưu đãi gói 3 tháng
              </a>
            </div>

            {/* Plan 3: Ultimate (1 Year VIP) */}
            <div className="rounded-xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 shadow-sm hover:border-text-secondary transition-colors">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">Hội Viên VIP Toàn Diện</div>
                  <h3 className="text-2xl font-black text-text-primary">THẺ 1 NĂM (12 THÁNG)</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-text-primary">3.800.000</span>
                  <span className="text-xs font-bold text-text-secondary">VNĐ / Năm</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Cam kết dài lâu, tiết kiệm tối đa. Miễn phí gửi xe, tủ đồ cá nhân riêng và trọn bộ quyền lợi VIP.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tất cả quyền lợi của Thẻ 3 Tháng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Tặng 3 buổi tập chuyên sâu cùng PT 1:1</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Miễn phí tủ đồ cá nhân Locker riêng biệt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Miễn phí vé gửi xe cả năm tại tòa nhà</span>
                  </div>
                </div>
              </div>

              <a
                href="#trial-form"
                className="w-full py-3 px-4 rounded-md border border-border hover:bg-surface-subtle font-extrabold text-xs uppercase text-center text-text-primary transition-colors block"
              >
                Đăng ký Hội viên VIP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FACILITIES & OPERATING HOURS (BlueGym Standard)
      ────────────────────────────────────────────────────────────── */}
      <section id="facilities" className="py-20 border-b border-border bg-surface-subtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="volt">CƠ SỞ VẬT CHẤT</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary uppercase">
              KHÔNG GIAN TẬP HIỆN ĐẠI & TIỆN NGHI
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tọa lạc tại vị trí trung tâm thuận tiện, không gian rộng rãi với trần cao thoáng đãng, sàn cao su giảm chấn chuẩn phòng tập Olympic.
            </p>
          </div>

          {/* Facility Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden border border-border bg-surface">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
                  alt="Dàn máy Technogym"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-base text-text-primary">Dàn Máy Nhập Khẩu 100%</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Thiết bị tập khối và Cardio cao cấp giúp tác động chuẩn xác vào nhóm cơ mục tiêu, an toàn cho cột sống và khớp gối.
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-border bg-surface">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
                  alt="Phòng tập GroupX"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-base text-text-primary">Phòng GroupX Sàn Gỗ Đàn Hồi</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Hệ thống âm thanh ánh sáng chuyên nghiệp, điều hòa nhiệt độ tối ưu, tạo nguồn cảm hứng bùng nổ cho mỗi giờ nhảy.
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-border bg-surface">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80"
                  alt="Kiosk Sảnh & Locker"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-base text-text-primary">Kiosk Đón Tiếp & Locker Sang Trọng</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Check-in nhận diện khuôn mặt tự động, tủ đồ thông minh riêng tư, phòng thay đồ và phòng tắm nóng lạnh sạch sẽ tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. 4 PORTALS ACCESS (Live Graduation Project Showcase)
      ────────────────────────────────────────────────────────────── */}
      <section id="portals" className="py-20 border-b border-border bg-darksidebar-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded bg-volt/20 text-volt font-bold text-xs uppercase tracking-wider border border-volt/30">
              TRẢI NGHIỆM ĐỒ ÁN TỐT NGHIỆP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              TRUY CẬP TRỰC TIẾP 4 CỔNG PHÂN HỆ
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hệ thống SmartGym được phân định rõ ràng thành 4 cổng chuyên biệt, hoạt động đồng bộ trên nền tảng Web Responsive hiện đại:
            </p>
          </div>

          {/* 4 Portals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Portal 1: Member */}
            <div className="rounded-lg p-6 bg-darksidebar-surface/90 border border-darksidebar-border flex flex-col justify-between space-y-4 hover:border-volt/60 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-volt/10 text-volt flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-white">Cổng Hội Viên (Member)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Xem thẻ điện tử, Dynamic QR 60s, đặt lịch thủ công hoặc AI CP-SAT, giáo án luyện tập và đánh giá PT 1-5 sao.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/app')}
                className="w-full text-xs font-bold border-darksidebar-border text-volt hover:bg-volt hover:text-darksidebar-bg"
              >
                <span>Vào Cổng Hội Viên</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {/* Portal 2: PT */}
            <div className="rounded-lg p-6 bg-darksidebar-surface/90 border border-darksidebar-border flex flex-col justify-between space-y-4 hover:border-volt/60 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-volt/10 text-volt flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-white">Cổng Huấn Luyện Viên (PT)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Xem ca dạy trong ngày, nhận diện học viên đã vào phòng qua Kiosk, mở ca tập tính giờ, ghi nhận sets/reps và ký hoàn thành.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/trainer')}
                className="w-full text-xs font-bold border-darksidebar-border text-volt hover:bg-volt hover:text-darksidebar-bg"
              >
                <span>Vào Cổng PT</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {/* Portal 3: Manager */}
            <div className="rounded-lg p-6 bg-darksidebar-surface/90 border border-darksidebar-border flex flex-col justify-between space-y-4 hover:border-volt/60 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-volt/10 text-volt flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-white">Cổng Quản Trị (Manager)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dashboard mật độ, quản lý danh sách hội viên, cấp tài khoản tại quầy, duyệt đơn hàng, quản lý ca trực PT và báo cáo doanh thu.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full text-xs font-bold border-darksidebar-border text-volt hover:bg-volt hover:text-darksidebar-bg"
              >
                <span>Vào Cổng Quản Trị</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {/* Portal 4: Kiosk */}
            <div className="rounded-lg p-6 bg-darksidebar-surface/90 border border-darksidebar-border flex flex-col justify-between space-y-4 hover:border-volt/60 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-volt/10 text-volt flex items-center justify-center font-bold">
                  <ScanFace className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-white">Màn Hình Kiosk Sảnh</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Màn hình cảm ứng toàn màn hình đặt tại cửa sảnh: Quét khuôn mặt mở cửa trong 0.8s, quét Dynamic QR dự phòng và thanh mô phỏng test.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/kiosk')}
                className="w-full text-xs font-bold border-darksidebar-border text-volt hover:bg-volt hover:text-darksidebar-bg"
              >
                <span>Xem Màn Hình Kiosk</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. FREE TRIAL FORM (High-Converting BlueGym Style)
      ────────────────────────────────────────────────────────────── */}
      <section id="trial-form" className="py-20 border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-darksidebar-bg rounded-2xl border border-darksidebar-border p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-volt/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded bg-volt/20 text-volt font-bold text-xs uppercase tracking-wider border border-volt/30">
                  ƯU ĐÃI TẬP LUYỆN ĐẶC BIỆT
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                  ĐĂNG KÝ TẬP THỬ MIỄN PHÍ 01 BUỔI
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Trải nghiệm miễn phí không gian tập luyện hiện đại, đo chỉ số InBody và tư vấn lộ trình luyện tập cùng HLV chuyên nghiệp.
                </p>
              </div>

              {trialSubmitted ? (
                <div className="p-6 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-300">Đăng Ký Thành Công!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Bộ phận Lễ tân SmartGym sẽ liên hệ lại với bạn qua số điện thoại trong vòng 15 phút để xác nhận lịch hẹn và gửi vé tập thử qua tin nhắn.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTrialSubmit} className="space-y-4 max-w-xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Họ và tên của bạn *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={trialName}
                        onChange={(e) => setTrialName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-darksidebar-surface border border-darksidebar-border text-white text-xs focus:outline-none focus:border-volt"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ví dụ: 0912 345 678"
                        value={trialPhone}
                        onChange={(e) => setTrialPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-darksidebar-surface border border-darksidebar-border text-white text-xs focus:outline-none focus:border-volt"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Mục tiêu tập luyện chính của bạn
                    </label>
                    <select
                      value={trialGoal}
                      onChange={(e) => setTrialGoal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-darksidebar-surface border border-darksidebar-border text-white text-xs focus:outline-none focus:border-volt"
                    >
                      <option value="GIAM_MO">Giảm cân, đốt mỡ thừa toàn thân</option>
                      <option value="TANG_CO">Tăng cân, xây dựng cơ bắp săn chắc</option>
                      <option value="GROUPX">Tham gia các lớp nhảy sôi động (Body Pump, Zumba)</option>
                      <option value="SUC_BEN">Cải thiện độ dẻo dai và sức bền tim mạch</option>
                      <option value="PT">Muốn có Huấn luyện viên 1 kèm 1 riêng</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-md bg-volt hover:bg-volt-hover text-darksidebar-bg font-black text-sm uppercase tracking-wider shadow-lg shadow-volt/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>NHẬN VÉ TẬP THỬ MIỄN PHÍ NGAY</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    * Thông tin của bạn được bảo mật tuyệt đối. Chúng tôi cam kết không spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. FOOTER (BlueGym Inspired Layout & Details)
      ────────────────────────────────────────────────────────────── */}
      <footer className="bg-darksidebar-bg border-t border-darksidebar-border text-slate-400 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand & Slogan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-volt flex items-center justify-center text-darksidebar-bg font-black">
                  <Dumbbell className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">
                  SMART<span className="text-volt">GYM</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống phòng tập thể thao ứng dụng công nghệ thông minh 4.0 hàng đầu. Mang tới trải nghiệm rèn luyện thể lực kỷ luật, hiện đại và tràn đầy cảm hứng.
              </p>
              <div className="text-[11px] text-slate-500 font-semibold">
                Đồ án tốt nghiệp: Hệ thống quản lý phòng Gym thông minh (1 cơ sở).
              </div>
            </div>

            {/* Column 2: Branches & Addresses */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Hệ Thống Cơ Sở</h4>
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-200">1. SMARTGYM CƠ SỞ CHÍNH</div>
                <p className="text-slate-400">Tầng 2, Tòa nhà Thể Thao, 101 Võ Thị Sáu, Hai Bà Trưng, Hà Nội</p>
                <div className="text-volt font-bold">Hotline: 0987 562 211</div>
              </div>
              <div className="space-y-2 text-xs pt-1">
                <div className="font-semibold text-slate-200">2. CHI NHÁNH MỞ RỘNG (DỰ KIẾN)</div>
                <p className="text-slate-400">Toà nhà Ellipse, 112 Trần Phú, Mộ Lao, Hà Đông, Hà Nội</p>
              </div>
            </div>

            {/* Column 3: Hours & Services */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Thời Gian Hoạt Động</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-darksidebar-border">
                  <span>Thứ Hai - Thứ Sáu:</span>
                  <strong className="text-white">05:30 - 21:30</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-darksidebar-border">
                  <span>Thứ Bảy - Chủ Nhật:</span>
                  <strong className="text-white">05:30 - 20:30</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Ngày lễ / Tết:</span>
                  <strong className="text-volt">Theo thông báo</strong>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Sức chứa tối đa: <strong>60 người cùng lúc</strong> (kiểm soát mật độ tự động qua Kiosk).
              </div>
            </div>

            {/* Column 4: Quick Portals & Contact */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Liên Kết Nhanh</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href="#trial-form" className="hover:text-volt transition-colors">
                    • Đăng ký tập thử miễn phí
                  </a>
                </li>
                <li>
                  <a href="#bmi" className="hover:text-volt transition-colors">
                    • Công cụ tính chỉ số BMI
                  </a>
                </li>
                <li>
                  <button onClick={() => navigate('/app')} className="hover:text-volt transition-colors">
                    • Cổng Hội viên rèn luyện
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/trainer')} className="hover:text-volt transition-colors">
                    • Cổng Huấn luyện viên (PT)
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/admin/dashboard')} className="hover:text-volt transition-colors">
                    • Cổng Quản trị viên phòng tập
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/kiosk')} className="hover:text-volt transition-colors">
                    • Màn hình Kiosk Check-in Sảnh
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 border-t border-darksidebar-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              Copyright &copy; 2026 <strong>SmartGym</strong> — All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Chính sách bảo mật GDPR</span>
              <span>Điều khoản dịch vụ</span>
              <span>Đồ án tốt nghiệp CNTT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
