import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchIslamicQuestion, getNoAnswerFound } from '../services/geminiService';
import { SearchResult } from '../types';
import { Loader2, AlertCircle, Book, User, Hash, ChevronLeft, ArrowRight, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { db, collection, addDoc, serverTimestamp } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';

const translations = {
  ar: {
    loading: "جاري البحث في المصادر الموثوقة...",
    error: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.",
    errorTitle: "عذراً، حدث خطأ",
    backHome: "العودة للرئيسية",
    noAnswerTitle: "لم يتم العثور على إجابة موثوقة",
    noAnswerText: "نعتذر، لم نتمكن من العثور على إجابة دقيقة لسؤالك في المصادر المعتمدة لدينا حالياً.",
    tryAnother: "جرب سؤالاً آخر",
    backSearch: "العودة للبحث",
    question: "السؤال",
    answer: "الإجابة",
    dalil: "الدليل الشرعي",
    sources: "المصادر والمراجع",
    viewDetails: "عرض التفاصيل",
    source: "المصدر",
    book: "الكتاب",
    reference: "المرجع"
  },
  en: {
    loading: "Searching in reliable sources...",
    error: "An error occurred while searching. Please try again.",
    errorTitle: "Sorry, an error occurred",
    backHome: "Back to Home",
    noAnswerTitle: "No reliable answer found",
    noAnswerText: "We apologize, we could not find an accurate answer to your question in our currently approved sources.",
    tryAnother: "Try another question",
    backSearch: "Back to search",
    question: "Question",
    answer: "Answer",
    dalil: "Sharia Evidence",
    sources: "Sources and References",
    viewDetails: "View Details",
    source: "Source",
    book: "Book",
    reference: "Reference"
  },
  fr: {
    loading: "Recherche dans des sources fiables...",
    error: "Une erreur s'est produite lors de la recherche. Veuillez réessayer.",
    errorTitle: "Désolé, une erreur s'est produite",
    backHome: "Retour à l'accueil",
    noAnswerTitle: "Aucune réponse fiable trouvée",
    noAnswerText: "Nous nous excusons, nous n'avons pas pu trouver de réponse précise à votre question dans nos sources actuellement approuvées.",
    tryAnother: "Essayer une autre question",
    backSearch: "Retour à la recherche",
    question: "Question",
    answer: "Réponse",
    dalil: "Preuve de la Charia",
    sources: "Sources et Références",
    viewDetails: "Voir les détails",
    source: "Source",
    book: "Livre",
    reference: "Référence"
  },
  de: {
    loading: "Suche in zuverlässigen Quellen...",
    error: "Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    errorTitle: "Entschuldigung, ein Fehler ist aufgetreten",
    backHome: "Zurück zur Startseite",
    noAnswerTitle: "Keine zuverlässige Antwort gefunden",
    noAnswerText: "Wir entschuldigen uns, wir konnten in unseren derzeit genehmigten Quellen keine genaue Antwort auf Ihre Frage finden.",
    tryAnother: "Andere Frage versuchen",
    backSearch: "Zurück zur Suche",
    question: "Frage",
    answer: "Antwort",
    dalil: "Scharia-Beweis",
    sources: "Quellen und Referenzen",
    viewDetails: "Details anzeigen",
    source: "Quelle",
    book: "Buch",
    reference: "Referenz"
  },
  es: {
    loading: "Buscando en fuentes confiables...",
    error: "Ocurrió un error al buscar. Por favor, inténtelo de nuevo.",
    errorTitle: "Lo sentimos, ocurrió un error",
    backHome: "Volver al inicio",
    noAnswerTitle: "No se encontró una respuesta confiable",
    noAnswerText: "Lo sentimos, no pudimos encontrar una respuesta precisa a su pregunta en nuestras fuentes actualmente aprobadas.",
    tryAnother: "Probar con otra pregunta",
    backSearch: "Volver a la búsqueda",
    question: "Pregunta",
    answer: "Respuesta",
    dalil: "Evidencia de la Sharia",
    sources: "Fuentes y Referencias",
    viewDetails: "Ver detalles",
    source: "Fuente",
    book: "Libro",
    reference: "Referencia"
  },
  id: {
    loading: "Mencari di sumber terpercaya...",
    error: "Terjadi kesalahan saat mencari. Silakan coba lagi.",
    errorTitle: "Maaf, terjadi kesalahan",
    backHome: "Kembali ke Beranda",
    noAnswerTitle: "Tidak ada jawaban yang dapat diandalkan ditemukan",
    noAnswerText: "Kami mohon maaf, kami tidak dapat menemukan jawaban yang akurat untuk pertanyaan Anda di sumber kami yang saat ini disetujui.",
    tryAnother: "Coba pertanyaan lain",
    backSearch: "Kembali ke pencarian",
    question: "Pertanyaan",
    answer: "Jawaban",
    dalil: "Dalil Syariah",
    sources: "Sumber dan Referensi",
    viewDetails: "Lihat Detail",
    source: "Sumber",
    book: "Buku",
    reference: "Referensi"
  }
};

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, language } = useAuth();
  const t = translations[language];
  const noAnswerMsg = getNoAnswerFound(language);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await searchIslamicQuestion(query, language);
        setResult(data);
        
        // Save to history if user is logged in
        if (user && data?.answer && data.answer !== noAnswerMsg) {
          await addDoc(collection(db, 'searchHistory'), {
            userId: user.uid,
            query: query || '',
            answer: data.answer,
            references: data.references || [],
            language: language,
            timestamp: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error(err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, user, language, noAnswerMsg, t.error]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
        <p className="text-stone-600 animate-pulse">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.errorTitle}</h2>
        <p className="text-stone-600 mb-6">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:underline">
          {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span>{t.backHome}</span>
        </Link>
      </div>
    );
  }

  if (!result || result.answer === noAnswerMsg) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-stone-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.noAnswerTitle}</h2>
        <p className="text-stone-600 mb-8">
          {t.noAnswerText}
        </p>
        <Link to="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all">
          {t.tryAnother}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-stone-500 hover:text-green-600 transition-colors text-sm font-medium">
          {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{t.backSearch}</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 text-stone-400 hover:text-green-600 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-stone-400 hover:text-green-600 transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-stone-100 mb-8"
      >
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-2 block">{t.question}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
            {query}
          </h1>
        </div>

        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-4 block">{t.answer}</span>
          <div className="markdown-body text-stone-800 leading-relaxed text-lg">
            <ReactMarkdown>{result.answer}</ReactMarkdown>
          </div>
        </div>

        {result.dalil && (
          <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
            <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-3 block">{t.dalil}</span>
            <p className="text-green-900 font-medium italic text-lg leading-relaxed">
              "{result.dalil}"
            </p>
          </div>
        )}
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 px-2">
          <Book size={24} className="text-green-600" />
          {t.sources}
        </h2>
        
        <div className="grid gap-4">
          {result.references.map((ref, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <User size={16} className="text-green-600" />
                      <span className="font-semibold text-stone-700">{ref.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Book size={16} className="text-green-600" />
                      <span className="font-semibold text-stone-700">{ref.book}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Hash size={16} className="text-green-600" />
                      <span className="font-semibold text-stone-700">{ref.reference}</span>
                    </div>
                  </div>
                  {ref.text && (
                    <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                      {ref.text}
                    </p>
                  )}
                </div>
                
                <Link 
                  to={`/source/${i}`} 
                  state={{ reference: ref }}
                  className="flex items-center gap-1 text-green-600 font-bold text-sm hover:gap-2 transition-all self-end md:self-center"
                >
                  <span>{t.viewDetails}</span>
                  {language === 'ar' ? <ChevronLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
