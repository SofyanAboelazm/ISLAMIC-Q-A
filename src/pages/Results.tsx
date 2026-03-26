import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { searchIslamicQuestion, getNoAnswerFound } from '../services/geminiService';
import { SearchResult } from '../types';
import { Loader2, AlertCircle, Book, User, Hash, ChevronLeft, ArrowRight, Share2, Bookmark, ArrowLeft, Printer, FileDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { db, collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import PrintableResult from '../components/PrintableResult';
import ShareMenu from '../components/ShareMenu';
import SocialCard from '../components/SocialCard';
// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import html2canvas from 'html2canvas';

const translations = {
  // ... (keep translations as is)
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
    reference: "المرجع",
    printPdf: "طباعة / حفظ PDF"
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
    reference: "Reference",
    printPdf: "Print / Save PDF"
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
    reference: "Référence",
    printPdf: "Imprimer / Enregistrer PDF"
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
    reference: "Referenz",
    printPdf: "Drucken / Als PDF speichern"
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
    reference: "Referencia",
    printPdf: "Imprimir / Guardar PDF"
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
    reference: "Referensi",
    printPdf: "Cetak / Simpan PDF"
  }
};

const Results: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  const idParam = searchParams.get('id');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [query, setQuery] = useState<string | null>(queryParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [resultId, setResultId] = useState<string | null>(idParam);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const { user, language } = useAuth();
  const t = translations[language];
  const noAnswerMsg = getNoAnswerFound(language);
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (idParam) {
        setLoading(true);
        try {
          const docRef = doc(db, 'searchHistory', idParam);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setResult({
              answer: data.answer,
              dalil: data.dalil || '',
              references: data.references || []
            });
            setQuery(data.query);
            setResultId(idParam);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching result by ID:", err);
        }
      }

      if (!queryParam) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchIslamicQuestion(queryParam, language);
        setResult(data);
        setQuery(queryParam);
        
        // Save to history and get ID
        if (data?.answer && data.answer !== noAnswerMsg) {
          const docRef = await addDoc(collection(db, 'searchHistory'), {
            userId: user?.uid || 'anonymous',
            query: queryParam || '',
            answer: data.answer,
            dalil: data.dalil || '',
            references: data.references || [],
            language: language,
            timestamp: serverTimestamp(),
          });
          setResultId(docRef.id);
          // Update URL to include ID for sharing
          setSearchParams({ q: queryParam, id: docRef.id });
        }
      } catch (err) {
        console.error(err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [queryParam, idParam, user, language, noAnswerMsg, t.error, setSearchParams]);

  // Social Card Generation
  useEffect(() => {
    const generateSocialCard = async () => {
      if (!result || !resultId || !query || isGeneratingCard) return;

      // Check if image already exists in doc
      try {
        const docRef = doc(db, 'searchHistory', resultId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ogImageUrl) {
          return;
        }
      } catch (err) {
        console.error("Error checking for existing OG image:", err);
      }

      setIsGeneratingCard(true);
      
      // Wait for the card to be rendered
      setTimeout(async () => {
        const element = document.getElementById('social-card-capture');
        if (!element) {
          setIsGeneratingCard(false);
          return;
        }

        try {
          const canvas = await html2canvas(element, {
            width: 1200,
            height: 630,
            scale: 1,
            useCORS: true,
            backgroundColor: '#ffffff'
          });

          canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) {
              setIsGeneratingCard(false);
              return;
            }

            const imageRef = ref(storage, `generated-cards/${resultId}.png`);
            await uploadBytes(imageRef, blob);
            const downloadUrl = await getDownloadURL(imageRef);

            // Update Firestore with the image URL
            await updateDoc(doc(db, 'searchHistory', resultId), {
              ogImageUrl: downloadUrl
            });
            
            setIsGeneratingCard(false);
          }, 'image/png');
        } catch (err) {
          console.error("Error generating social card:", err);
          setIsGeneratingCard(false);
        }
      }, 1000); // Give it time to render
    };

    if (result && resultId && query) {
      generateSocialCard();
    }
  }, [result, resultId, query, isGeneratingCard]);

  const handleExportPdf = async () => {
    if (!result || !query) return;
    
    setIsPrinting(true);
    
    // Wait for the printable component to be rendered
    setTimeout(async () => {
      const element = document.getElementById('printable-content');
      if (!element) {
        setIsPrinting(false);
        return;
      }

      const opt = {
        margin: 10,
        filename: `Islamic_QA_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      try {
        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error('PDF Export Error:', err);
      } finally {
        setIsPrinting(false);
      }
    }, 100);
  };

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
        className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-stone-100 mb-8"
      >
        <div className="mb-6 sm:mb-8">
          <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-2 block">{t.question}</span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
            {query}
          </h1>
        </div>

        <div className="mb-8 sm:mb-10">
          <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-4 block">{t.answer}</span>
          <div className="markdown-body text-stone-800 leading-relaxed text-base sm:text-lg mb-8">
            <ReactMarkdown>{result.answer}</ReactMarkdown>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button 
              onClick={handleExportPdf}
              disabled={isPrinting}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPrinting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <FileDown size={20} />
              )}
              <span className="text-sm sm:text-base">{t.printPdf}</span>
            </button>

            {result && query && (
              <div className="flex justify-center">
                <ShareMenu query={query} result={result} language={language} />
              </div>
            )}
          </div>
        </div>

        {result.dalil && (
          <div className="p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100">
            <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-3 block">{t.dalil}</span>
            <p className="text-green-900 font-medium italic text-base sm:text-lg leading-relaxed">
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

      {/* Hidden printable component */}
      <div className="fixed left-[-9999px] top-0">
        {isPrinting && result && query && (
          <PrintableResult query={query} result={result} language={language} />
        )}
      </div>

      {/* Hidden Social Card component for capture */}
      <div className="fixed left-[-9999px] top-0">
        {result && query && (
          <SocialCard query={query} result={result} language={language} />
        )}
      </div>
    </div>
  );
};

export default Results;
