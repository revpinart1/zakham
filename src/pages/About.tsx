import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GraduationCap, Target, Eye, Heart, CheckCircle2, Award, Users, Lightbulb } from "lucide-react";

import { cn } from "@/src/lib/utils";

export default function About() {
  const values = [
    { title: "الابتكار", icon: Lightbulb, desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتسهيل التعليم." },
    { title: "الجودة", icon: Award, desc: "نحرص على تقديم محتوى علمي دقيق ومحدث باستمرار." },
    { title: "الشمولية", icon: Users, desc: "منصة متكاملة تغطي كافة جوانب اختبارات القدرات والتحصيلي." },
    { title: "الشغف", icon: Heart, desc: "نعمل بشغف لمساعدة الطلاب على تحقيق أحلامهم الأكاديمية." },
  ];

  return (
    <div className="flex flex-col gap-24 pb-20 pt-32">
      {/* Hero */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="tuwaiq-card bg-linear-to-br from-[#EDE9FE] to-[#DBEAFE] text-center space-y-8 p-16 md:p-24">
          <Badge className="rounded-full px-6 py-2 bg-white/50 text-primary border-none backdrop-blur-sm text-sm font-bold">عن المنصة</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">منصة زخم الذكية</h1>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
تقوم منصة زخم على فكرة جعل رحلة الطالب نحو الجامعة أسهل وأكثر فاعلية، من خلال دمج التعليم بالذكاء الاصطناعي وتقديم تجربة تعليمية مبسطة وذكية  </p>      </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="tuwaiq-card bg-primary text-white p-12 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Eye className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-extrabold">رؤيتنا</h2>
              <p className="text-white/80 leading-relaxed text-xl font-medium">
                أن نكون المنصة التعليمية الرائدة في الشرق الأوسط التي تعيد تعريف مفهوم التعلم الذكي وتساهم في بناء جيل مبدع ومتميز أكاديمياً.
              </p>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="tuwaiq-card bg-slate-900 text-white p-12 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-extrabold">رسالتنا</h2>
              <p className="text-white/70 leading-relaxed text-xl font-medium">
                تمكين الطلاب من خلال توفير أدوات تعليمية ذكية، محتوى عالي الجودة، وبيئة تفاعلية تساعدهم على تجاوز اختبارات القدرات والتحصيلي بتفوق.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900">قيمنا الأساسية</h2>
          <p className="text-xl text-slate-500 font-medium">المبادئ التي توجهنا في كل ما نقدمه لطلابنا.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const colors = [
              "bg-[#EDE9FE] text-[#5B21B6]", // Purple
              "bg-[#D1FAE5] text-[#065F46]", // Green
              "bg-[#DBEAFE] text-[#1E40AF]", // Blue
              "bg-[#FEE2E2] text-[#991B1B]"  // Pink
            ];
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn("tuwaiq-card h-full text-center space-y-6 flex flex-col items-center", colors[index % colors.length])}>
                  <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center shadow-sm">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-extrabold text-2xl">{value.title}</h3>
                  <p className="text-lg opacity-80 font-medium leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team/Story */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">قصة زخم</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
أُنشئت منصة زخم من إبداع الأستاذة صيدة الشاعري بهدف تبسيط رحلة الطالب نحو الجامعة، عبر توظيف الذكاء الاصطناعي لتقديم تجربة تعليمية أكثر ذكاءً وفعالية            </p>
            <div className="space-y-4">
              {[
                "أكثر من 15 سنة من الخبرة في مجال التعليم",
                "فهم احتياجات الطلاب وتطوير حلول تعليمية أكثر فعالية",
                "شراكات تعليمية مع نخبة من المعلمين المتميزين",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200">
              <img 
                src="https://www.arageek.com/_next/image?url=https%3A%2F%2Fcdn.arageek.com%2Fmagazine%2FWebsite-Temps.-4-2.png&w=1920&q=75" 
                alt="Education" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border-2 border-slate-50 hidden md:block">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-primary">+10,000</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">ساعة تدريبية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
