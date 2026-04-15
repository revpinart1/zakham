import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GraduationCap, BrainCircuit, Timer, MessageSquare, ArrowLeft, CheckCircle2, Users, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/src/lib/utils";

export default function Home() {
  const stats = [
    { label: "طالب مستفيد", value: "+50,000", icon: Users },
    { label: "سؤال تدريبي", value: "+10,000", icon: BrainCircuit },
    { label: "نسبة النجاح", value: "95%", icon: Trophy },
    { label: "تقييم المنصة", value: "4.9/5", icon: Star },
  ];

  const features = [
    {
      title: "أسئلة تفاعلية",
      description: "آلاف الأسئلة في القسم الكمي واللفظي مع شرح مفصل لكل سؤال.",
      icon: BrainCircuit,
      color: "bg-blue-500",
    },
    {
      title: "اختبارات محاكية",
      description: "اختبارات تجريبية بنفس نظام وتوقيت الاختبار الحقيقي لكسر حاجز الرهبة.",
      icon: Timer,
      color: "bg-purple-500",
    },
    {
      title: "مساعد ذكي (زخم)",
      description: "مساعد تعليمي متطور متاح على مدار الساعة للإجابة على استفساراتك وشرح المسائل الصعبة.",
      icon: MessageSquare,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-10 pt-32">
        <div className="relative overflow-hidden bg-linear-to-br from-[#EDE9FE] to-[#DBEAFE] rounded-[48px] p-12 md:p-24 min-h-[600px] flex flex-col justify-center">
          <div className="relative z-10 max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-5 py-2 text-sm font-bold rounded-full bg-white/50 text-primary border-none backdrop-blur-sm">
                مستقبلك يبدأ من هنا 🚀
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight"
            >
            منصة زخم الذكية <br />
              <span className="text-primary">خطوتك الأولى نحو التميز في القدرات والتحصيلي</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl leading-relaxed"
            >
الهدف العام للمنصة هو تمكين طلاب المرحلة الثانوية في السعودية من تحقيق التفوق في اختبارات القدرات والتحصيل عبر أدوات ذكية، تفاعلية، ومخصصة، تعزز من ثقتهم وتوفر لهم تجربة تعلم حديثة ومتكاملة            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-5"
            >
              <Link to="/quiz">
                <Button className="h-16 px-12 text-xl font-extrabold rounded-2xl bg-white text-primary hover:bg-white/90 border-2 border-primary shadow-xl shadow-primary/10">
                  ابدأ الآن
                  <ArrowLeft className="mr-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const colors = [
              "bg-[#D1FAE5] text-[#065F46]", // Cyan/Green
              "bg-[#FEE2E2] text-[#991B1B]", // Pink
              "bg-[#DBEAFE] text-[#1E40AF]", // Blue
              "bg-[#FEF3C7] text-[#92400E]"  // Yellow
            ];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn("tuwaiq-card h-full flex flex-col items-start gap-4", colors[index % colors.length])}>
                  <div className="p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                    <div className="text-sm font-bold opacity-80 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">برامجنا التعليمية</h2>
            <p className="text-xl text-slate-500 max-w-2xl">
              نقدم مجموعة متنوعة من المسارات التعليمية المصممة بعناية لتناسب احتياجاتك وتطلعاتك المهنية.
            </p>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-primary border-primary hover:bg-primary/5">
            عرض جميع البرامج
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const cardColors = [
              "bg-[#EDE9FE] text-[#5B21B6]", // Purple
              "bg-[#E0F2FE] text-[#0369A1]", // Sky
              "bg-[#F0FDF4] text-[#166534]"  // Green
            ];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={cn("tuwaiq-card h-full flex flex-col gap-8 group cursor-pointer", cardColors[index % cardColors.length])}>
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white transition-colors">
                      <ArrowLeft className="h-6 w-6 rotate-135" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-extrabold">{feature.title}</h3>
                    <p className="text-lg opacity-80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="bg-primary text-white rounded-[48px] overflow-hidden relative p-12 md:p-24 text-center shadow-2xl shadow-primary/20">
          <div className="relative z-10 flex flex-col items-center gap-10">
            <h2 className="text-4xl md:text-6xl font-extrabold max-w-4xl leading-tight">هل أنت مستعد لبدء رحلة النجاح؟</h2>
            <p className="text-white/80 text-xl max-w-2xl leading-relaxed">
              انضم إلى آلاف الطلاب الذين حققوا درجات متميزة بفضل الله ثم بفضل أدواتنا التعليمية الذكية.
            </p>
            <Link to="/auth?mode=signup">
              <Button className="bg-white text-primary hover:bg-white/90 h-16 px-12 text-xl font-extrabold rounded-2xl shadow-xl">
                سجل مجاناً الآن
              </Button>
            </Link>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>
    </div>
  );
}
