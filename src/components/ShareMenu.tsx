import React, { useState } from 'react';
import { Share2, MessageCircle, Facebook, Twitter, Link as LinkIcon, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchResult, Language } from '../types';

interface ShareMenuProps {
  query: string;
  result: SearchResult;
  language: Language;
}

const translations = {
  ar: {
    share: "مشاركة",
    whatsapp: "واتساب",
    facebook: "فيسبوك",
    twitter: "تويتر (X)",
    copyLink: "نسخ الرابط",
    copied: "تم نسخ الرابط",
    questionLabel: "📌 السؤال:",
    answerLabel: "📖 الإجابة:",
    referenceLabel: "📚 المرجع:",
  },
  en: {
    share: "Share",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    twitter: "Twitter (X)",
    copyLink: "Copy Link",
    copied: "Link Copied",
    questionLabel: "📌 Question:",
    answerLabel: "📖 Answer:",
    referenceLabel: "📚 Reference:",
  },
  fr: {
    share: "Partager",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    twitter: "Twitter (X)",
    copyLink: "Copier le lien",
    copied: "Lien copié",
    questionLabel: "📌 Question:",
    answerLabel: "📖 Réponse:",
    referenceLabel: "📚 Référence:",
  },
  de: {
    share: "Teilen",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    twitter: "Twitter (X)",
    copyLink: "Link kopieren",
    copied: "Link kopiert",
    questionLabel: "📌 Frage:",
    answerLabel: "📖 Antwort:",
    referenceLabel: "📚 Referenz:",
  },
  es: {
    share: "Compartir",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    twitter: "Twitter (X)",
    copyLink: "Copiar enlace",
    copied: "Enlace copiado",
    questionLabel: "📌 Pregunta:",
    answerLabel: "📖 Respuesta:",
    referenceLabel: "📚 Referencia:",
  },
  id: {
    share: "Bagikan",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    twitter: "Twitter (X)",
    copyLink: "Salin Tautan",
    copied: "Tautan Disalin",
    questionLabel: "📌 Pertanyaan:",
    answerLabel: "📖 Jawaban:",
    referenceLabel: "📚 Referensi:",
  }
};

const ShareMenu: React.FC<ShareMenuProps> = ({ query, result, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  const getShareText = () => {
    const firstRef = result.references[0];
    const referenceText = firstRef 
      ? `${firstRef.book} - ${firstRef.reference}${firstRef.source ? ` (${firstRef.source})` : ''}`
      : '';

    return `${t.questionLabel}\n${query}\n\n${t.answerLabel}\n${result.answer}\n\n${t.referenceLabel}\n${referenceText}\n\n${window.location.href}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: t.share,
      text: getShareText(),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-stone-100 text-stone-700 px-6 py-3 rounded-full font-bold hover:bg-stone-200 transition-all active:scale-95"
      >
        <Share2 size={20} className="text-green-600" />
        <span>{t.share}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute bottom-full mb-4 ${isRtl ? 'right-0' : 'left-0'} w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 p-4 z-50`}
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-stone-900">{t.share}</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-stone-400" />
                </button>
              </div>

              <div className="grid gap-2">
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <MessageCircle size={20} />
                  </div>
                  <span className="font-medium text-stone-700">{t.whatsapp}</span>
                </button>

                <button
                  onClick={shareOnFacebook}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Facebook size={20} />
                  </div>
                  <span className="font-medium text-stone-700">{t.facebook}</span>
                </button>

                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                    <Twitter size={20} />
                  </div>
                  <span className="font-medium text-stone-700">{t.twitter}</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-stone-50 transition-colors group"
                >
                  <div className={`w-10 h-10 ${copied ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-600'} rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all`}>
                    {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                  </div>
                  <span className="font-medium text-stone-700">
                    {copied ? t.copied : t.copyLink}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareMenu;
