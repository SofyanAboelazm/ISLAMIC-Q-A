import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Reference } from '../types';
import { ArrowRight, ArrowLeft, Book, User, Hash, Share2, Printer, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

const translations = {
  ar: {
    notFound: "لم يتم العثور على تفاصيل المصدر",
    backHome: "العودة للرئيسية",
    backResults: "العودة للنتائج",
    title: "تفاصيل المصدر والمرجع",
    fullText: "النص الكامل",
    noText: "نص المصدر غير متوفر حالياً.",
    bookInfo: "معلومات الكتاب",
    bookName: "اسم الكتاب",
    author: "المؤلف/الراوي",
    refNumber: "رقم المرجع",
    importantNote: "تنبيه هام",
    noteText: "هذه المعلومات مستخرجة من المصادر الإسلامية المعتمدة. يرجى دائماً مراجعة الكتب الأصلية أو استشارة أهل العلم للمزيد من التفاصيل والتدقيق."
  },
  en: {
    notFound: "Source details not found",
    backHome: "Back to Home",
    backResults: "Back to Results",
    title: "Source and Reference Details",
    fullText: "Full Text",
    noText: "Source text is currently unavailable.",
    bookInfo: "Book Information",
    bookName: "Book Name",
    author: "Author/Narrator",
    refNumber: "Reference Number",
    importantNote: "Important Note",
    noteText: "This information is extracted from approved Islamic sources. Please always review the original books or consult scholars for more details and verification."
  },
  fr: {
    notFound: "Détails de la source non trouvés",
    backHome: "Retour à l'accueil",
    backResults: "Retour aux résultats",
    title: "Détails de la source et de la référence",
    fullText: "Texte intégral",
    noText: "Le texte de la source n'est pas disponible actuellement.",
    bookInfo: "Informations sur le livre",
    bookName: "Nom du livre",
    author: "Auteur/Narrateur",
    refNumber: "Numéro de référence",
    importantNote: "Note importante",
    noteText: "Ces informations sont extraites de sources islamiques approuvées. Veuillez toujours consulter les livres originaux ou consulter des savants pour plus de détails et de vérification."
  },
  de: {
    notFound: "Quelldetails nicht gefunden",
    backHome: "Zurück zur Startseite",
    backResults: "Zurück zu den Ergebnissen",
    title: "Quell- und Referenzdetails",
    fullText: "Volltext",
    noText: "Quelltext ist derzeit nicht verfügbar.",
    bookInfo: "Buchinformationen",
    bookName: "Buchname",
    author: "Autor/Erzähler",
    refNumber: "Referenznummer",
    importantNote: "Wichtiger Hinweis",
    noteText: "Diese Informationen stammen aus anerkannten islamischen Quellen. Bitte lesen Sie immer die Originalbücher oder konsultieren Sie Gelehrte für weitere Details und Überprüfungen."
  },
  es: {
    notFound: "Detalles de la fuente no encontrados",
    backHome: "Volver al inicio",
    backResults: "Volver a los resultados",
    title: "Detalles de la fuente y referencia",
    fullText: "Texto completo",
    noText: "El texto de la fuente no está disponible actualmente.",
    bookInfo: "Información del libro",
    bookName: "Nombre del libro",
    author: "Autor/Narrador",
    refNumber: "Número de referencia",
    importantNote: "Nota importante",
    noteText: "Esta información se extrae de fuentes islámicas aprobadas. Por favor, revise siempre los libros originales o consulte a eruditos para más detalles y verificación."
  },
  id: {
    notFound: "Detail sumber tidak ditemukan",
    backHome: "Kembali ke Beranda",
    backResults: "Kembali ke Hasil",
    title: "Detail Sumber dan Referensi",
    fullText: "Teks Lengkap",
    noText: "Teks sumber saat ini tidak tersedia.",
    bookInfo: "Informasi Buku",
    bookName: "Nama Buku",
    author: "Penulis/Narator",
    refNumber: "Nomor Referensi",
    importantNote: "Catatan Penting",
    noteText: "Informasi ini diambil dari sumber-sumber Islam yang disetujui. Harap selalu tinjau kitab asli atau berkonsultasi dengan ulama untuk detail dan verifikasi lebih lanjut."
  }
};

const SourceDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useAuth();
  const reference = location.state?.reference as Reference;
  const t = translations[language];

  if (!reference) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">{t.notFound}</h2>
        <Link to="/" className="text-green-600 font-bold hover:underline">{t.backHome}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-stone-500 hover:text-green-600 transition-colors text-sm font-medium">
          {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{t.backResults}</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 text-stone-400 hover:text-green-600 transition-colors">
            <Printer size={20} />
          </button>
          <button className="p-2 text-stone-400 hover:text-green-600 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-stone-400 hover:text-green-600 transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100"
      >
        <div className="bg-green-600 p-8 md:p-12 text-white">
          <div className="flex flex-wrap gap-6 items-center mb-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <User size={18} className="text-green-200" />
              <span>{reference.source}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <Book size={18} className="text-green-200" />
              <span>{reference.book}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <Hash size={18} className="text-green-200" />
              <span>{reference.reference}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {t.title}
          </h1>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
              {t.fullText}
            </h2>
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 text-stone-800 text-xl leading-loose font-medium italic text-center">
              {reference.text || t.noText}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900">{t.bookInfo}</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">{t.bookName}</span>
                  <span className="font-semibold">{reference.book}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">{t.author}</span>
                  <span className="font-semibold">{reference.source}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">{t.refNumber}</span>
                  <span className="font-semibold">{reference.reference}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-3">{t.importantNote}</h3>
              <p className="text-green-700 text-sm leading-relaxed">
                {t.noteText}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SourceDetails;
