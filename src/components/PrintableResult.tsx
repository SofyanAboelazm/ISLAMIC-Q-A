import React from 'react';
import { SearchResult, Language } from '../types';
import { BookOpen } from 'lucide-react';

interface PrintableResultProps {
  query: string;
  result: SearchResult;
  language: Language;
}

const translations = {
  ar: {
    title: "أسئلة دينية",
    subtitle: "Islamic Q&A",
    question: "السؤال",
    answer: "الإجابة",
    dalil: "الدليل الشرعي",
    sources: "المصادر والمراجع",
    source: "المصدر",
    book: "الكتاب",
    reference: "المرجع",
    generatedFrom: "تم الاستخراج من:",
    date: "تاريخ التصدير:"
  },
  en: {
    title: "Islamic Q&A",
    subtitle: "Religious Questions",
    question: "Question",
    answer: "Answer",
    dalil: "Sharia Evidence",
    sources: "Sources and References",
    source: "Source",
    book: "Book",
    reference: "Reference",
    generatedFrom: "Generated from:",
    date: "Date of export:"
  },
  fr: {
    title: "Q&R Islamiques",
    subtitle: "Questions Religieuses",
    question: "Question",
    answer: "Réponse",
    dalil: "Preuve de la Charia",
    sources: "Sources et Références",
    source: "Source",
    book: "Livre",
    reference: "Référence",
    generatedFrom: "Généré à partir de:",
    date: "Date d'exportation:"
  },
  de: {
    title: "Islamische Q&A",
    subtitle: "Religiöse Fragen",
    question: "Frage",
    answer: "Antwort",
    dalil: "Scharia-Beweis",
    sources: "Quellen und Referenzen",
    source: "Quelle",
    book: "Buch",
    reference: "Referenz",
    generatedFrom: "Generiert von:",
    date: "Exportdatum:"
  },
  es: {
    title: "Q&A Islámico",
    subtitle: "Preguntas Religiosas",
    question: "Pregunta",
    answer: "Respuesta",
    dalil: "Evidencia de la Sharia",
    sources: "Fuentes y Referencias",
    source: "Fuente",
    book: "Libro",
    reference: "Referencia",
    generatedFrom: "Generado desde:",
    date: "Fecha de exportación:"
  },
  id: {
    title: "Tanya Jawab Islam",
    subtitle: "Pertanyaan Agama",
    question: "Pertanyaan",
    answer: "Jawaban",
    dalil: "Dalil Syariah",
    sources: "Sumber dan Referensi",
    source: "Sumber",
    book: "Buku",
    reference: "Referensi",
    generatedFrom: "Dihasilkan dari:",
    date: "Tanggal ekspor:"
  }
};

const PrintableResult: React.FC<PrintableResultProps> = ({ query, result, language }) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  // Hex colors to avoid oklch parsing errors in html2canvas
  const colors = {
    white: '#ffffff',
    green600: '#16a34a',
    green800: '#166534',
    green900: '#14532d',
    green50: '#f0fdf4',
    green100: '#dcfce7',
    stone50: '#fafaf9',
    stone100: '#f5f5f4',
    stone400: '#a8a29e',
    stone500: '#78716c',
    stone600: '#57534e',
    stone700: '#44403c',
    stone800: '#292524',
    stone900: '#1c1917',
  };

  return (
    <div 
      id="printable-content" 
      className={`p-10 font-sans ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ 
        direction: isRtl ? 'rtl' : 'ltr', 
        width: '800px', 
        backgroundColor: colors.white, 
        color: colors.stone900 
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between pb-6 mb-8"
        style={{ borderBottom: `2px solid ${colors.green600}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: colors.green600,
              color: colors.white,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <BookOpen size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold leading-tight" style={{ color: colors.green800 }}>{t.title}</span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.stone500 }}>{t.subtitle}</span>
          </div>
        </div>
        <div className="text-right text-xs font-medium" style={{ color: colors.stone400 }}>
          {t.date} {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Question */}
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: colors.stone50, borderColor: colors.stone100 }}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: colors.green600 }}>{t.question}</span>
          <h1 className="text-2xl font-bold leading-tight" style={{ color: colors.stone900 }}>
            {query}
          </h1>
        </div>

        {/* Answer */}
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold mb-4 block" style={{ color: colors.green600 }}>{t.answer}</span>
          <div className="leading-relaxed text-lg whitespace-pre-wrap" style={{ color: colors.stone800 }}>
            {result.answer}
          </div>
        </div>

        {/* Dalil */}
        {result.dalil && (
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: colors.green50, borderColor: colors.green100 }}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold mb-3 block" style={{ color: colors.green600 }}>{t.dalil}</span>
            <p className="font-medium italic text-lg leading-relaxed" style={{ color: colors.green900 }}>
              "{result.dalil}"
            </p>
          </div>
        )}

        {/* Sources */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.stone900 }}>
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.green600 }}></div>
            {t.sources}
          </h2>
          
          <div className="grid gap-4">
            {result.references.map((ref, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: colors.white, 
                  borderColor: colors.stone100,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: colors.green600 }}>{t.source}:</span>
                    <span style={{ color: colors.stone700 }}>{ref.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: colors.green600 }}>{t.book}:</span>
                    <span style={{ color: colors.stone700 }}>{ref.book}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: colors.green600 }}>{t.reference}:</span>
                    <span style={{ color: colors.stone700 }}>{ref.reference}</span>
                  </div>
                </div>
                {ref.text && (
                  <p 
                    className="text-xs mt-3 leading-relaxed italic border-t pt-2"
                    style={{ color: colors.stone600, borderTopColor: colors.stone50 }}
                  >
                    {ref.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="mt-12 pt-6 border-t flex justify-between items-center text-[10px] font-medium"
        style={{ borderTopColor: colors.stone100, color: colors.stone400 }}
      >
        <div>
          {t.generatedFrom} {window.location.origin}
        </div>
        <div>
          © {new Date().getFullYear()} {t.title}
        </div>
      </div>
    </div>
  );
};

export default PrintableResult;
