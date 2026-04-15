import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-16">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-2xl font-extrabold text-primary">منصة زخم الذكية</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة تعليمية ذكية تهدف إلى تمكين طلاب المرحلة الثانوية من تحقيق التميز في اختبارات القدرات والتحصيلي من خلال أدوات تعليمية متطورة.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "الرئيسية", path: "/" },
                { name: "الأسئلة التفاعلية", path: "/quiz" },
                { name: "مساعد زخم الذكي", path: "/assistant" },
                { name: "عن المنصة", path: "/about" }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">الأقسام</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "القسم الكمي", path: "/quiz?category=quantitative" },
                { name: "القسم اللفظي", path: "/quiz?category=verbal" },
                { name: "اختبار التحصيلي", path: "/quiz?category=tahsili" }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-widest text-xs">تواصل معنا</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">manasazakham@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">+966 54 915 8960</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-medium">المملكة العربية السعودية، القنفذة</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} منصة زخم الذكية. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
