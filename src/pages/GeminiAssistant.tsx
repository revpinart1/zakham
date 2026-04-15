import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, BrainCircuit, Loader2, Eraser, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `
أنت "مساعد زخم الذكي"، خبير تعليمي متخصص في مساعدة طلاب المرحلة الثانوية في المملكة العربية السعودية لاختبارات القدرات والتحصيلي.
مهمتك هي:
1. شرح المسائل الرياضية (الكمي) بطرق مبسطة وسهلة الفهم.
2. مساعدة الطلاب في استيعاب المقروء والتناظر اللفظي (اللفظي).
3. تقديم نصائح للدراسة وتنظيم الوقت.
4. الإجابة على استفسارات الطلاب حول المناهج الدراسية.
يجب أن يكون أسلوبك ودوداً، مشجعاً، وباللغة العربية الفصحى البسيطة.
إذا سألك الطالب عن مسألة، حاول شرح الخطوات بدلاً من إعطاء الناتج مباشرة.
`;

export default function GeminiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحباً بك! أنا مساعد زخم الذكي. كيف يمكنني مساعدتك في دراستك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const speak = (text: string, index: number) => {
    if (!synthesisRef.current) return;

    if (isSpeaking === index) {
      synthesisRef.current.cancel();
      setIsSpeaking(null);
      return;
    }

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    
    utterance.onend = () => {
      setIsSpeaking(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    setIsSpeaking(index);
    synthesisRef.current.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage({ message: userMessage });
      const responseText = result.text;

      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (synthesisRef.current) synthesisRef.current.cancel();
    setIsSpeaking(null);
    setMessages([
      {
        role: "assistant",
        content: "مرحباً بك! أنا مساعد زخم الذكي. كيف يمكنني مساعدتك في دراستك اليوم؟",
      },
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-20 md:px-10 pt-32 max-w-[1400px]">
      <div className="grid lg:grid-cols-[380px_1fr] gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold flex items-center gap-4 text-slate-900">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              مساعد زخم الذكي
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              استخدم قوة الذكاء الاصطناعي (زخم) للحصول على شروحات فورية ومساعدة في حل المسائل الصعبة.
            </p>
          </div>

          <div className="tuwaiq-card bg-slate-100/50 border-2 border-slate-100 p-8 space-y-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">ماذا يمكنني أن أسأل؟</h3>
            <div className="space-y-4">
              {[
                "كيف أحل مسائل التناسب الطردي؟",
                "اشرح لي علاقة التناظر اللفظي.",
                "أعطني نصائح لتنظيم وقت المذاكرة."
              ].map((q) => (
                <button 
                  key={q}
                  className="w-full text-right p-5 bg-white rounded-2xl border-2 border-transparent text-lg font-bold text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm hover:scale-[1.02]"
                  onClick={() => setInput(q)}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-extrabold text-slate-500 border-2 border-slate-100 hover:bg-slate-50" onClick={clearChat}>
            <Eraser className="ml-3 h-5 w-5" />
            مسح المحادثة
          </Button>
        </div>

        {/* Chat Interface */}
        <div className="tuwaiq-card bg-white border-2 border-slate-100 h-[800px] flex flex-col p-0 overflow-hidden shadow-2xl shadow-slate-200/50">
          <div className="border-b-2 border-slate-50 bg-slate-50/30 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 border-4 border-white shadow-xl">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=zakhm" />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-4 border-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">مساعد زخم الذكي</h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">متصل الآن • مدعوم بـ Gemini</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-slate-50/20">
            <ScrollArea className="h-full p-8">
              <div className="space-y-10">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`flex gap-5 max-w-[85%] ${message.role === "user" ? "flex-row" : "flex-row-reverse"}`}>
                      <Avatar className="h-11 w-11 shrink-0 shadow-lg border-2 border-white">
                        {message.role === "user" ? (
                          <>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" />
                            <AvatarFallback><User /></AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=zakhm" />
                            <AvatarFallback><Bot /></AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div className="relative group">
                        <div className={`p-6 rounded-[28px] shadow-sm text-lg font-medium leading-relaxed ${
                          message.role === "user" 
                            ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                            : "bg-white border-2 border-slate-50 text-slate-800 rounded-tl-none"
                        }`}>
                          {message.content}
                        </div>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute -bottom-12 left-0 h-10 w-10 rounded-xl bg-white border-2 border-slate-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all ${isSpeaking === index ? "opacity-100 text-primary border-primary/20" : "text-slate-400 hover:text-primary"}`}
                            onClick={() => speak(message.content, index)}
                          >
                            {isSpeaking === index ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-end">
                    <div className="flex gap-5 max-w-[85%] flex-row-reverse">
                      <Avatar className="h-11 w-11 shrink-0 shadow-lg border-2 border-white">
                        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=zakhm" />
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                      <div className="p-6 rounded-[28px] bg-white border-2 border-slate-50 rounded-tl-none flex items-center gap-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-base text-slate-400 font-bold">يفكر المساعد...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="p-8 border-t-2 border-slate-50 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-4"
            >
              <Input
                placeholder="اكتب سؤالك هنا..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-2xl h-16 border-2 border-slate-50 bg-slate-50/50 focus-visible:ring-primary focus-visible:border-primary transition-all px-6 text-lg font-medium"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-16 w-16 rounded-2xl shrink-0 bg-primary hover:scale-[1.05] transition-transform shadow-xl shadow-primary/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Send className="h-7 w-7 rotate-180" />}
              </Button>
            </form>
            <p className="text-xs text-center text-slate-400 mt-6 font-bold uppercase tracking-wider">
              قد يخطئ الذكاء الاصطناعي أحياناً، يرجى مراجعة المعلومات الهامة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
