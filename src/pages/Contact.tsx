import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Github } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/src/lib/utils";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-20 md:px-10 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">تواصل معنا</h1>
          <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
            نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت. لا تتردد في مراسلتنا.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-10">
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold text-slate-900">معلومات الاتصال</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "البريد الإلكتروني", value: "manasazakham@gmail.com", color: "bg-[#EDE9FE] text-[#5B21B6]" },
                  { icon: Phone, title: "رقم الهاتف", value: "+966 54 915 8960", color: "bg-[#D1FAE5] text-[#065F46]" },
                  { icon: MapPin, title: "العنوان", value: "المملكة العربية السعودية، القنفذة  ", color: "bg-[#DBEAFE] text-[#1E40AF]" },
                ].map((item, i) => (
                  <div key={i} className={cn("tuwaiq-card p-6 flex items-start gap-6", item.color)}>
                    <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center shrink-0 shadow-sm">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold">{item.title}</h3>
                      <p className="text-base font-medium opacity-80">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900">تابعنا على</h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Twitter, color: "hover:bg-blue-400" },
                  { icon: Instagram, color: "hover:bg-pink-500" },
                  { icon: Github, color: "hover:bg-slate-800" },
                  { icon: MessageSquare, color: "hover:bg-green-500" },
                ].map((social, i) => (
                  <a key={i} href="#" className={cn("w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center text-slate-400 transition-all hover:scale-110 hover:text-white hover:border-transparent shadow-sm", social.color)}>
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 tuwaiq-card bg-white border-2 border-slate-100 shadow-2xl shadow-slate-200/50 p-10 md:p-16">
            <div className="space-y-2 mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">أرسل لنا رسالة</h2>
              <p className="text-lg font-medium text-slate-500">املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-700 mr-1">الاسم الكامل</Label>
                  <Input id="name" placeholder="أدخل اسمك هنا" required className="h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary transition-all px-6 text-lg" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700 mr-1">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="example@mail.com" required className="h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary transition-all px-6 text-lg" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-sm font-bold text-slate-700 mr-1">الموضوع</Label>
                <Input id="subject" placeholder="كيف يمكننا مساعدتك؟" required className="h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary transition-all px-6 text-lg" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="message" className="text-sm font-bold text-slate-700 mr-1">الرسالة</Label>
                <textarea 
                  id="message" 
                  rows={6} 
                  className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/50 px-6 py-4 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl text-xl font-extrabold bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                {!isSubmitting && <Send className="mr-3 h-6 w-6 rotate-180" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
