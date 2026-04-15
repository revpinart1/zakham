import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut, User as UserIcon, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/contexts/AuthContext";
import { logout } from "@/src/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "الأسئلة التفاعلية", path: "/quiz" },
    { name: "مساعد زخم الذكي", path: "/assistant" },
    { name: "عن المنصة", path: "/about" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 flex items-center",
      scrolled 
        ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" 
        : "bg-transparent py-6"
    )}>
      <div className="container mx-auto flex items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              منصة <span className="text-primary">  زخم الذكية</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-5 py-2.5 text-sm font-bold transition-all rounded-xl",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-600 hover:text-primary hover:bg-white"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="bg-primary/5 text-primary font-bold text-[10px]">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-bold text-slate-700">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="btn-tuwaiq">
                <LogIn className="h-5 w-5" />
                <span>تسجيل الدخول</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex items-center justify-center rounded-xl p-2 md:hidden bg-slate-100 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b shadow-xl md:hidden overflow-hidden p-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "p-4 text-lg font-bold rounded-2xl transition-all",
                    location.pathname === link.path 
                      ? "bg-primary text-white" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t mt-2">
                {user ? (
                  <Button variant="outline" className="w-full h-14 rounded-2xl text-red-600 border-red-100 bg-red-50" onClick={() => { logout(); setIsOpen(false); }}>
                    <LogOut className="h-5 w-5 ml-2" />
                    تسجيل الخروج
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl bg-primary text-white font-bold">
                      <LogIn className="h-5 w-5 ml-2" />
                      تسجيل الدخول
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
