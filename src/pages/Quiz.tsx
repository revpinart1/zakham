import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, BrainCircuit, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/src/contexts/AuthContext";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  mainCategory: "gat" | "saat";
  subCategory: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  // GAT - Quantitative
  {
    id: 1,
    mainCategory: "gat",
    subCategory: "quantitative",
    text: "إذا كان س + 3 = 10، فما قيمة 2س؟",
    options: ["7", "14", "20", "10"],
    correctAnswer: 1,
    explanation: "س + 3 = 10 => س = 7. إذاً 2س = 2 * 7 = 14.",
  },
  {
    id: 2,
    mainCategory: "gat",
    subCategory: "quantitative",
    text: "ما هو العدد الذي إذا أضفنا إليه نصفه وربعه أصبح الناتج 28؟",
    options: ["12", "14", "16", "20"],
    correctAnswer: 2,
    explanation: "س + 0.5س + 0.25س = 28 => 1.75س = 28 => س = 16.",
  },
  // GAT - Verbal
  {
    id: 3,
    mainCategory: "gat",
    subCategory: "verbal",
    text: "أكمل الجملة: العلم يبني بيوتاً لا .... لها، والجهل يهدم بيت العز والكرم.",
    options: ["أساس", "عماد", "سقف", "باب"],
    correctAnswer: 1,
    explanation: "البيت يحتاج إلى عماد ليقوم، والعلم يبني بيوتاً قوية.",
  },
  {
    id: 4,
    mainCategory: "gat",
    subCategory: "verbal",
    text: "علاقة (غابة : أشجار) هي علاقة:",
    options: ["سببية", "مكانية", "كل من جزء", "تضاد"],
    correctAnswer: 2,
    explanation: "الغابة تتكون من أشجار، فهي علاقة الكل بالجزء.",
  },
  // SAAT - Math
  {
    id: 5,
    mainCategory: "saat",
    subCategory: "math",
    text: "ما هي قيمة x في المعادلة log₂(x) = 3؟",
    options: ["6", "8", "9", "5"],
    correctAnswer: 1,
    explanation: "log₂(x) = 3 تعني أن 2³ = x، إذاً x = 8.",
  },
  // SAAT - Biology
  {
    id: 6,
    mainCategory: "saat",
    subCategory: "biology",
    text: "أي من التالي يعتبر وحدة البناء والوظيفة في الكائن الحي؟",
    options: ["النسيج", "العضو", "الخلية", "الجهاز"],
    correctAnswer: 2,
    explanation: "الخلية هي أصغر وحدة بناء ووظيفة في جميع الكائنات الحية.",
  },
  // SAAT - Chemistry
  {
    id: 7,
    mainCategory: "saat",
    subCategory: "chemistry",
    text: "ما هو الرمز الكيميائي لعنصر الصوديوم؟",
    options: ["S", "So", "Na", "Ni"],
    correctAnswer: 2,
    explanation: "الرمز الكيميائي للصوديوم هو Na.",
  },
  // SAAT - Physics
  {
    id: 8,
    mainCategory: "saat",
    subCategory: "physics",
    text: "ما هي وحدة قياس القوة في النظام الدولي للوحدات؟",
    options: ["الجول", "الواط", "النيوتن", "الباسكال"],
    correctAnswer: 2,
    explanation: "النيوتن هو وحدة قياس القوة في النظام الدولي.",
  },
];

import { cn } from "@/src/lib/utils";

export default function Quiz() {
  const { user } = useAuth();
  const [view, setView] = useState<"main" | "sub" | "quiz">("main");
  const [selectedMainCategory, setSelectedMainCategory] = useState<"gat" | "saat" | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startQuiz = (mainCat: "gat" | "saat" | "all", subCat: string) => {
    let filtered = SAMPLE_QUESTIONS;
    
    if (mainCat !== "all") {
      filtered = filtered.filter(q => q.mainCategory === mainCat);
    }
    
    if (subCat !== "all") {
      filtered = filtered.filter(q => q.subCategory === subCat);
    }
    
    // Shuffle questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    setQuestions(shuffled);
    setSelectedMainCategory(mainCat === "all" ? null : mainCat);
    setSelectedSubCategory(subCat);
    setQuizStarted(true);
    setView("quiz");
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const saveResults = useCallback(async (finalScore: number) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "quizResults"), {
        userId: user.uid,
        score: finalScore,
        totalQuestions: questions.length,
        mainCategory: selectedMainCategory || "all",
        subCategory: selectedSubCategory,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving quiz results:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, questions.length, selectedMainCategory, selectedSubCategory]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
    } else {
      setShowResults(true);
      saveResults(score);
    }
  }, [currentQuestionIndex, questions.length, score, saveResults]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !showResults && timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
      setTimeout(handleNextQuestion, 2000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, showResults, timeLeft, isAnswered, handleNextQuestion]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    let newScore = score;
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(handleNextQuestion, 3000);
  };

  if (view === "main") {
    return (
      <div className="container mx-auto pt-30 px-4 py-12 md:px-8 max-w-6xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-slate-900">الأسئلة التفاعلية</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">اختر نوع الاختبار الذي ترغب في التدرب عليه.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "gat", name: "اختبار القدرات (GAT)", icon: BrainCircuit, desc: "يشمل القسم الكمي واللفظي لتطوير مهارات التفكير المنطقي", color: "bg-[#EDE9FE] text-[#5B21B6]" },
              { id: "saat", name: "اختبار التحصيلي (SAAT)", icon: Timer, desc: "يشمل المواد العلمية: رياضيات، فيزياء، كيمياء، وأحياء", color: "bg-[#D1FAE5] text-[#065F46]" },
              { id: "all", name: "الاختبار الشامل", icon: Trophy, desc: "تحدي عشوائي يجمع بين أسئلة القدرات والتحصيلي معاً", color: "bg-[#DBEAFE] text-[#1E40AF]" },
            ].map((cat) => (
              <div 
                key={cat.id} 
                className={cn("tuwaiq-card flex flex-col items-center text-center gap-6 cursor-pointer group hover:scale-105 transition-transform p-8", cat.color)} 
                onClick={() => {
                  if (cat.id === "all") {
                    startQuiz("all", "all");
                  } else {
                    setSelectedMainCategory(cat.id as any);
                    setView("sub");
                  }
                }}
              >
                <div className="w-20 h-20 rounded-3xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:bg-white transition-colors">
                  <cat.icon className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold">{cat.name}</h3>
                  <p className="text-sm opacity-80 font-medium leading-relaxed">{cat.desc}</p>
                </div>
                <Button className="mt-4 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-bold px-8 h-12 text-base">
                  {cat.id === "all" ? "ابدأ التحدي" : "استعراض الأقسام"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "sub") {
    const subCategories = selectedMainCategory === "gat" 
      ? [
          { id: "all", name: "الشامل", icon: BrainCircuit, desc: "أسئلة عشوائية من القسمين الكمي واللفظي", color: "bg-primary text-white" },
          { id: "quantitative", name: "القسم الكمي", icon: Timer, desc: "مسائل رياضية وهندسية ومنطقية", color: "bg-white text-slate-900 border-2 border-slate-100" },
          { id: "verbal", name: "القسم اللفظي", icon: MessageSquare, desc: "تناظر لفظي، إكمال جمل، واستيعاب مقروء", color: "bg-white text-slate-900 border-2 border-slate-100" },
        ]
      : [
          { id: "all", name: "الشامل", icon: BrainCircuit, desc: "أسئلة عشوائية من جميع المواد العلمية", color: "bg-primary text-white" },
          { id: "math", name: "رياضيات", icon: Timer, desc: "جبر، هندسة، حساب مثلثات، وتفاضل وتكامل", color: "bg-white text-slate-900 border-2 border-slate-100" },
          { id: "physics", name: "فيزياء", icon: Timer, desc: "ميكانيكا، كهرباء، ضوء، وفيزياء حديثة", color: "bg-white text-slate-900 border-2 border-slate-100" },
          { id: "chemistry", name: "كيمياء", icon: Timer, desc: "كيمياء عضوية، غير عضوية، وحساب كيميائي", color: "bg-white text-slate-900 border-2 border-slate-100" },
          { id: "biology", name: "أحياء", icon: Timer, desc: "علم الخلية، الوراثة، والبيئة", color: "bg-white text-slate-900 border-2 border-slate-100" },
        ];

    return (
      <div className="container mx-auto pt-30 px-4 py-12 md:px-8 max-w-6xl">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setView("main")} className="rounded-xl font-bold">
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              العودة للرئيسية
            </Button>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-slate-900">
              {selectedMainCategory === "gat" ? "أقسام القدرات" : "أقسام التحصيلي"}
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">اختر القسم الفرعي للبدء في التدريب المكثف.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {subCategories.map((sub) => (
              <div 
                key={sub.id} 
                className={cn("tuwaiq-card flex flex-col items-center text-center gap-4 cursor-pointer group hover:scale-105 transition-transform shadow-lg", sub.color)} 
                onClick={() => startQuiz(selectedMainCategory!, sub.id)}
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-colors", sub.id === "all" ? "bg-white/20" : "bg-slate-50 group-hover:bg-primary/10")}>
                  <sub.icon className={cn("h-8 w-8", sub.id === "all" ? "text-white" : "text-primary")} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold">{sub.name}</h3>
                  <p className="text-xs opacity-80 font-medium leading-relaxed">{sub.desc}</p>
                </div>
                <Button className={cn("mt-2 rounded-xl font-bold px-6 h-10", sub.id === "all" ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white")}>ابدأ</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="tuwaiq-card bg-white border-2 border-slate-100 text-center space-y-8 shadow-2xl shadow-slate-200/50">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-[32px] bg-[#FEF3C7] flex items-center justify-center text-[#92400E]">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold text-slate-900">انتهى الاختبار!</h2>
              <p className="text-xl text-slate-500 font-medium">لقد أتممت جميع الأسئلة بنجاح.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="tuwaiq-card bg-[#DBEAFE] text-[#1E40AF] p-6">
                <div className="text-sm font-bold opacity-70 uppercase tracking-wider mb-1">النتيجة</div>
                <div className="text-4xl font-extrabold">{score} / {questions.length}</div>
              </div>
              <div className="tuwaiq-card bg-[#D1FAE5] text-[#065F46] p-6">
                <div className="text-sm font-bold opacity-70 uppercase tracking-wider mb-1">النسبة</div>
                <div className="text-4xl font-extrabold">{Math.round((score / questions.length) * 100)}%</div>
              </div>
            </div>

            {isSaving && (
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري حفظ النتائج...
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button onClick={() => startQuiz(selectedMainCategory || "all", selectedSubCategory)} className="h-16 rounded-2xl bg-primary text-white font-extrabold text-xl shadow-lg shadow-primary/20">
                <RotateCcw className="ml-3 h-6 w-6" />
                إعادة المحاولة
              </Button>
              <Button variant="outline" onClick={() => setView("main")} className="h-16 rounded-2xl border-2 border-slate-200 font-extrabold text-xl text-slate-600 hover:bg-slate-50">
                العودة للقائمة الرئيسية
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-[1400px] pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-8">
        {/* Left Sidebar: Stats */}
        <aside className="space-y-8 hidden lg:block">
          <div className="tuwaiq-card bg-white border-2 border-slate-100 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">إحصائيات المنصة</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="tuwaiq-card p-4 bg-[#E0F2FE] text-[#0369A1] text-center">
                <div className="text-2xl font-extrabold">50K+</div>
                <div className="text-[10px] font-bold opacity-70 uppercase">طالب</div>
              </div>
              <div className="tuwaiq-card p-4 bg-[#F0FDF4] text-[#166534] text-center">
                <div className="text-2xl font-extrabold">98%</div>
                <div className="text-[10px] font-bold opacity-70 uppercase">نجاح</div>
              </div>
              <div className="tuwaiq-card p-4 bg-[#EDE9FE] text-[#5B21B6] text-center">
                <div className="text-2xl font-extrabold">1.2M</div>
                <div className="text-[10px] font-bold opacity-70 uppercase">سؤال</div>
              </div>
              <div className="tuwaiq-card p-4 bg-[#FEF3C7] text-[#92400E] text-center">
                <div className="text-2xl font-extrabold">4.9</div>
                <div className="text-[10px] font-bold opacity-70 uppercase">تقييم</div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-sm font-bold text-slate-900 mb-4">تقدمك الحالي</h3>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-3 bg-slate-100" />
              <p className="text-xs font-bold text-slate-400 mt-3">
                تم إنجاز {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% من الاختبار
              </p>
            </div>
          </div>

          <div className="tuwaiq-card bg-[#FEF3C7] text-[#92400E]">
            <h3 className="text-lg font-extrabold mb-3">تنبيه</h3>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              تذكر أن كل سؤال له وقت محدد. التركيز هو مفتاح النجاح في اختبار القدرات والتحصيلي.
            </p>
          </div>
        </aside>

        {/* Main Quiz Area */}
        <main className="space-y-8">
          <div className="tuwaiq-card bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-bold">
                  {selectedMainCategory === "gat" ? "القدرات" : selectedMainCategory === "saat" ? "التحصيلي" : "اختبار شامل"} - {selectedSubCategory === "all" ? "شامل" : selectedSubCategory}
                </Badge>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-bold text-slate-400">سؤال {currentQuestionIndex + 1} من {questions.length}</span>
              </div>
              <div className={cn(
                "flex items-center gap-3 px-6 py-2 rounded-2xl font-mono text-2xl font-extrabold transition-all",
                timeLeft < 10 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-50 text-slate-900"
              )}>
                <Timer className={cn("h-6 w-6", timeLeft < 10 ? "text-red-500" : "text-slate-400")} />
                {timeLeft < 10 ? "00:0" : "00:"}{timeLeft}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-12 text-slate-900">
                  {currentQuestion.text}
                </h2>

                <div className="grid gap-4 mb-12">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isSelected = index === selectedOption;
                    
                    let className = "tuwaiq-card flex items-center w-full p-6 border-2 text-right transition-all group ";
                    
                    if (isAnswered) {
                      if (isCorrect) className += "border-green-500 bg-green-50 text-green-700";
                      else if (isSelected) className += "border-red-500 bg-red-50 text-red-700";
                      else className += "border-slate-50 opacity-50";
                    } else {
                      className += isSelected 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-50 bg-slate-50/50 hover:border-primary/30 hover:bg-slate-50";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={isAnswered}
                        className={className}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center ml-6 text-lg font-extrabold shrink-0 transition-all",
                          isAnswered && isCorrect ? "bg-green-500 text-white" : 
                          isAnswered && isSelected ? "bg-red-500 text-white" :
                          isSelected ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:bg-primary group-hover:text-white"
                        )}>
                          {["أ", "ب", "ج", "د"][index]}
                        </div>
                        <span className="text-xl font-bold">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="tuwaiq-card bg-[#E0F2FE] text-[#0369A1] mb-12"
                  >
                    <h4 className="text-xl font-extrabold mb-3 flex items-center gap-3">
                      <BrainCircuit className="h-6 w-6" />
                      شرح الحل:
                    </h4>
                    <p className="text-lg font-medium leading-relaxed opacity-90">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}

                <div className="mt-auto pt-8 border-t flex justify-between items-center">
                  <Button variant="ghost" onClick={() => setView("main")} className="text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-xl">
                    إنهاء الاختبار
                  </Button>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    السؤال {currentQuestionIndex + 1} من {questions.length}
                  </div>
                  <Button 
                    className="h-14 px-10 rounded-2xl bg-primary text-white font-extrabold shadow-lg shadow-primary/20" 
                    disabled={!isAnswered}
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex === questions.length - 1 ? "عرض النتائج" : "السؤال التالي"}
                    <ArrowLeft className="mr-3 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar: AI Panel */}
        <aside className="hidden lg:block">
          <div className="tuwaiq-card bg-primary text-white h-full flex flex-col shadow-xl shadow-primary/20">
            <div className="bg-white/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase mb-6 tracking-widest backdrop-blur-sm">
              مدعوم بذكاء Gemini AI
            </div>
            <h3 className="text-2xl font-extrabold mb-4">المساعد الذكي</h3>
            <p className="text-lg font-medium opacity-90 leading-relaxed mb-8">
              مرحباً بك! أنا هنا لمساعدتك في فهم القوانين الصعبة وتبسيط المسائل المعقدة. اسألني أي شيء عن القدرات أو التحصيلي.
            </p>
            
            <div className="mt-auto tuwaiq-card bg-white/10 border border-white/20 text-lg font-medium leading-relaxed italic">
              <strong>زخم:</strong> تذكر أن التركيز في قراءة السؤال يوفر عليك نصف وقت الحل. هل تريد شرحاً لقانون معين؟
            </div>
            
            <div className="mt-8">
              <Link to="/assistant">
                <Button className="w-full h-16 bg-white text-primary hover:bg-white/90 font-extrabold text-xl rounded-2xl shadow-xl">
                  تحدث مع زخم
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
