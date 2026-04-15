import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Mail, Lock, User, Loader2, Github } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithGoogle, registerUser, loginUser } from "@/src/lib/auth";

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === "signup") {
        await registerUser(email, password, name);
      } else {
        await loginUser(email, password);
      }
      navigate("/");
    } catch (err) {
      setError("حدث خطأ أثناء العملية");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch {
      setError("خطأ في تسجيل جوجل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 pt-30 pb-30">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">

        <div className="flex flex-col items-center gap-6 mb-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">مرحباً بك</h1>
            <p className="text-slate-500 text-sm">ابدأ رحلتك الآن</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden w-full p-6">

            {/* Tabs inside card */}
            <TabsList className="grid grid-cols-2 w-full h-12 bg-slate-100 rounded-xl p-1 mb-6">
              <TabsTrigger
                value="login"
                className="rounded-lg text-sm font-bold text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg text-sm font-bold text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="space-y-5 mt-0">
              <form onSubmit={handleAuth} className="space-y-4">

                <div>
                  <Label className="text-sm font-bold mb-1 block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pr-10 h-12" value={email} onChange={(e)=>setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold mb-1 block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="password" className="pr-10 h-12" value={password} onChange={(e)=>setPassword(e.target.value)} />
                  </div>
                </div>

                <Button className="w-full h-12 font-bold">
                  {isLoading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
                </Button>

              </form>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup" className="space-y-5 mt-0">
              <form onSubmit={handleAuth} className="space-y-4">

                <div>
                  <Label className="text-sm font-bold mb-1 block">الاسم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pr-10 h-12" value={name} onChange={(e)=>setName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold mb-1 block">البريد</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pr-10 h-12" value={email} onChange={(e)=>setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold mb-1 block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="password" className="pr-10 h-12" value={password} onChange={(e)=>setPassword(e.target.value)} />
                  </div>
                </div>

                <Button className="w-full h-12 font-bold">
                  {isLoading ? <Loader2 className="animate-spin" /> : "إنشاء حساب"}
                </Button>

              </form>
            </TabsContent>

            {/* Social */}
            <div className="mt-6">
              <div className="text-center text-xs text-slate-400 mb-4">أو</div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" />
                  Google
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Github className="h-5 w-5" />
                  Github
                </Button>
              </div>
            </div>

          </div>
        </Tabs>

      </motion.div>
    </div>
  
  );
}