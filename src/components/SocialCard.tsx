import React from 'react';
import { SearchResult, Language } from '../types';
import { BookOpen } from 'lucide-react';

interface SocialCardProps {
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
    reference: "المرجع",
  },
  en: {
    title: "Islamic Q&A",
    subtitle: "Religious Questions",
    question: "Question",
    answer: "Answer",
    reference: "Reference",
  },
  fr: {
    title: "Q&R Islamiques",
    subtitle: "Questions Religieuses",
    question: "Question",
    answer: "Réponse",
    reference: "Référence",
  },
  de: {
    title: "Islamische Q&A",
    subtitle: "Religiöse Fragen",
    question: "Frage",
    answer: "Antwort",
    reference: "Referenz",
  },
  es: {
    title: "Q&A Islámico",
    subtitle: "Preguntas Religiosas",
    question: "Pregunta",
    answer: "Respuesta",
    reference: "Referencia",
  },
  id: {
    title: "Tanya Jawab Islam",
    subtitle: "Pertanyaan Agama",
    question: "Pertanyaan",
    answer: "Jawaban",
    reference: "Referensi",
  }
};

const SocialCard: React.FC<SocialCardProps> = ({ query, result, language }) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  const colors = {
    white: '#ffffff',
    green600: '#16a34a',
    green800: '#166534',
    green50: '#f0fdf4',
    stone50: '#fafaf9',
    stone100: '#f5f5f4',
    stone500: '#78716c',
    stone700: '#44403c',
    stone800: '#292524',
    stone900: '#1c1917',
  };

  const firstRef = result.references[0];
  const referenceText = firstRef 
    ? `${firstRef.book} - ${firstRef.reference}${firstRef.source ? ` (${firstRef.source})` : ''}`
    : '';

  // Truncate answer for the card
  const truncatedAnswer = result.answer.length > 250 
    ? result.answer.substring(0, 250) + '...' 
    : result.answer;

  return (
    <div 
      id="social-card-capture" 
      className="font-sans"
      style={{ 
        width: '1200px', 
        height: '630px', 
        backgroundColor: colors.white, 
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        direction: isRtl ? 'rtl' : 'ltr',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern (Watermark-like) */}
      <div 
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          backgroundColor: colors.green50,
          borderRadius: '50%',
          opacity: 0.5,
          zIndex: 0
        }}
      />

      <div style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: colors.green600,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <BookOpen size={48} />
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: '42px', fontWeight: 'bold', color: colors.green800, lineHeight: 1 }}>{t.title}</span>
            <span style={{ fontSize: '18px', color: colors.stone500, textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '600' }}>{t.subtitle}</span>
          </div>
        </div>

        {/* Question */}
        <div 
          style={{ 
            backgroundColor: colors.stone50, 
            padding: '30px', 
            borderRadius: '24px', 
            border: `1px solid ${colors.stone100}`,
            marginBottom: '40px'
          }}
        >
          <span style={{ fontSize: '14px', color: colors.green600, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>{t.question}</span>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: colors.stone900, lineHeight: 1.2, margin: 0 }}>
            {query}
          </h1>
        </div>

        {/* Answer */}
        <div style={{ padding: '0 10px' }}>
          <span style={{ fontSize: '14px', color: colors.green600, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '15px' }}>{t.answer}</span>
          <p style={{ fontSize: '28px', color: colors.stone800, lineHeight: 1.5, margin: 0 }}>
            {truncatedAnswer}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div 
        style={{ 
          borderTop: `1px solid ${colors.stone100}`, 
          paddingTop: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          zIndex: 1
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: colors.green600 }}>{t.reference}:</span>
          <span style={{ fontSize: '16px', color: colors.stone700 }}>{referenceText}</span>
        </div>
        <div style={{ fontSize: '16px', color: colors.stone500, fontWeight: '600' }}>
          islamic-qa.app
        </div>
      </div>
    </div>
  );
};

export default SocialCard;
