import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, BookOpen, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

const translations = {
  ar: {
    title: "ابحث عن إجابتك الدينية بثقة",
    subtitle: "محرك بحث ذكي يعتمد على المصادر الإسلامية الأصلية والموثوقة (البخاري، مسلم، تفسير ابن كثير، وغيرها).",
    placeholder: "اكتب سؤالك هنا... (مثال: ما فضل الصدقة؟)",
    search: "بحث",
    commonQuestions: "أسئلة شائعة",
    whyUs: "لماذا أسئلة دينية؟",
    reason1: "مصادر موثوقة فقط من الكتب الأصلية.",
    reason2: "إجابات دقيقة مع ذكر الدليل والراوي.",
    reason3: "تقنيات ذكاء اصطناعي لفهم الأسئلة المعقدة.",
    examples: [
      "ما هو فضل صيام يوم عرفة؟",
      "كيفية أداء صلاة الاستخارة؟",
      "ما هي شروط قبول التوبة؟",
      "ما حكم قراءة القرآن بدون وضوء؟",
      "حديث عن الصدق وأهميته",
    ]
  },
  en: {
    title: "Search for your religious answers with confidence",
    subtitle: "A smart search engine based on original and reliable Islamic sources (Bukhari, Muslim, Tafsir Ibn Kathir, and others).",
    placeholder: "Type your question here... (e.g., What is the virtue of charity?)",
    search: "Search",
    commonQuestions: "Common Questions",
    whyUs: "Why Islamic Q&A?",
    reason1: "Reliable sources only from original books.",
    reason2: "Accurate answers with mention of evidence and narrator.",
    reason3: "AI techniques to understand complex questions.",
    examples: [
      "What is the virtue of fasting on the day of Arafah?",
      "How to perform Istikhara prayer?",
      "What are the conditions for accepting repentance?",
      "What is the ruling on reading the Quran without Wudu?",
      "Hadith about honesty and its importance",
    ]
  },
  fr: {
    title: "Recherchez vos réponses religieuses en toute confiance",
    subtitle: "Un moteur de recherche intelligent basé sur des sources islamiques originales et fiables (Bukhari, Muslim, Tafsir Ibn Kathir, et autres).",
    placeholder: "Tapez votre question ici... (ex: Quelle est la vertu de l'aumône ?)",
    search: "Rechercher",
    commonQuestions: "Questions courantes",
    whyUs: "Pourquoi Q&R Islamiques ?",
    reason1: "Sources fiables uniquement à partir de livres originaux.",
    reason2: "Réponses précises avec mention des preuves et du narrateur.",
    reason3: "Techniques d'IA pour comprendre les questions complexes.",
    examples: [
      "Quelle est la vertu du jeûne le jour d'Arafah ?",
      "Comment accomplir la prière d'Istikhara ?",
      "Quelles sont les conditions pour accepter le repentir ?",
      "Quelle est la règle sur la lecture du Coran sans Wudu ?",
      "Hadith sur l'honnêteté et son importance",
    ]
  },
  de: {
    title: "Suchen Sie vertrauensvoll nach Ihren religiösen Antworten",
    subtitle: "Eine intelligente Suchmaschine basierend auf originalen und zuverlässigen islamischen Quellen (Bukhari, Muslim, Tafsir Ibn Kathir und andere).",
    placeholder: "Geben Sie Ihre Frage hier ein... (z.B. Was ist der Vorzug von Almosen?)",
    search: "Suchen",
    commonQuestions: "Häufige Fragen",
    whyUs: "Warum Islamische Q&A?",
    reason1: "Zuverlässige Quellen nur aus Originalbüchern.",
    reason2: "Genaue Antworten mit Angabe von Beweisen und Erzählern.",
    reason3: "KI-Techniken zum Verständnis komplexer Fragen.",
    examples: [
      "Was ist der Vorzug des Fastens am Tag von Arafah?",
      "Wie führt man das Istikhara-Gebet durch?",
      "Was sind die Bedingungen für die Annahme der Reue?",
      "Wie ist das Urteil über das Lesen des Korans ohne Wudu?",
      "Hadith über Ehrlichkeit und ihre Bedeutung",
    ]
  },
  es: {
    title: "Busque sus respuestas religiosas con confianza",
    subtitle: "Un motor de búsqueda inteligente basado en fuentes islámicas originales y confiables (Bukhari, Muslim, Tafsir Ibn Kathir y otros).",
    placeholder: "Escriba su pregunta aquí... (p. ej., ¿Cuál es la virtud de la caridad?)",
    search: "Buscar",
    commonQuestions: "Preguntas comunes",
    whyUs: "¿Por qué Q&A Islámico?",
    reason1: "Fuentes confiables solo de libros originales.",
    reason2: "Respuestas precisas con mención de evidencia y narrador.",
    reason3: "Técnicas de IA para comprender preguntas complejas.",
    examples: [
      "¿Cuál es la virtud de ayunar el día de Arafah?",
      "¿Cómo realizar la oración de Istikhara?",
      "¿Cuáles son las condiciones para aceptar el arrepentimiento?",
      "¿Cuál es el fallo sobre la lectura del Corán sin Wudu?",
      "Hadith sobre la honestidad y su importancia",
    ]
  },
  id: {
    title: "Cari jawaban keagamaan Anda dengan percaya diri",
    subtitle: "Mesin pencari cerdas berdasarkan sumber Islam asli dan terpercaya (Bukhari, Muslim, Tafsir Ibnu Katsir, dan lainnya).",
    placeholder: "Ketik pertanyaan Anda di sini... (misalnya, Apa keutamaan sedekah?)",
    search: "Cari",
    commonQuestions: "Pertanyaan Umum",
    whyUs: "Mengapa Tanya Jawab Islam?",
    reason1: "Sumber terpercaya hanya dari kitab-kitab asli.",
    reason2: "Jawaban akurat dengan menyebutkan dalil dan perawi.",
    reason3: "Teknik AI untuk memahami pertanyaan yang kompleks.",
    examples: [
      "Apa keutamaan puasa di hari Arafah?",
      "Bagaimana cara melakukan shalat Istikhara?",
      "Apa syarat-syarat diterimanya taubat?",
      "Apa hukum membaca Al-Quran tanpa Wudhu?",
      "Hadits tentang kejujuran dan pentingnya",
    ]
  }
};

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { language } = useAuth();
  const t = translations[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="inline-block p-3 sm:p-4 bg-green-50 rounded-full mb-4 sm:mb-6"
        >
          <BookOpen size={32} className="text-green-600 sm:hidden" />
          <BookOpen size={48} className="text-green-600 hidden sm:block" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight px-2">
          {t.title.split(' ').map((word, i) => (
            <span key={i} className={word === 'بثقة' || word === 'confidence' || word === 'confiance' || word === 'vertrauensvoll' || word === 'confianza' || word === 'percaya' ? 'text-green-600' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8 sm:mb-12 px-2">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className={`w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-stone-200 bg-white text-base sm:text-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none shadow-lg sm:shadow-xl group-hover:border-stone-300 ${language === 'ar' ? 'pr-12 pl-24 sm:pr-14 sm:pl-32' : 'pl-12 pr-24 sm:pl-14 sm:pr-32'}`}
          />
          <Search className={`absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-green-600 transition-colors ${language === 'ar' ? 'right-4 sm:right-5' : 'left-4 sm:left-5'}`} size={20} />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={`absolute top-1/2 -translate-y-1/2 h-8 sm:h-10 px-4 sm:px-6 bg-green-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1 sm:gap-2 ${language === 'ar' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}`}
          >
            {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span className="text-xs sm:text-sm">{t.search}</span>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold">
            <MessageCircleQuestion size={20} />
            <h2>{t.commonQuestions}</h2>
          </div>
          <div className="space-y-2">
            {t.examples.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(q);
                  navigate(`/results?q=${encodeURIComponent(q)}`);
                }}
                className={`w-full p-3 rounded-xl hover:bg-stone-50 text-stone-600 text-sm transition-colors border border-transparent hover:border-stone-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-green-400" />
              {t.whyUs}
            </h2>
            <ul className="space-y-4 text-sm text-green-100">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-800 flex items-center justify-center flex-shrink-0 text-[10px]">١</div>
                <p>{t.reason1}</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-800 flex items-center justify-center flex-shrink-0 text-[10px]">٢</div>
                <p>{t.reason2}</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-800 flex items-center justify-center flex-shrink-0 text-[10px]">٣</div>
                <p>{t.reason3}</p>
              </li>
            </ul>
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-800/50 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
