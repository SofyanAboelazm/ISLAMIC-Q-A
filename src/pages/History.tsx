import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, collection, query, where, orderBy, onSnapshot } from '../lib/firebase';
import { SearchHistoryItem } from '../types';
import { History as HistoryIcon, Search, Calendar, ChevronLeft, LogIn, Loader2, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const translations = {
  ar: {
    loading: "جاري تحميل سجل البحث...",
    loginTitle: "سجل البحث متاح للأعضاء",
    loginText: "يرجى تسجيل الدخول لتتمكن من حفظ سجل عمليات البحث الخاصة بك والرجوع إليها في أي وقت.",
    loginBtn: "تسجيل الدخول باستخدام جوجل",
    emptyTitle: "سجل البحث فارغ",
    emptyText: "لم تقم بإجراء أي عمليات بحث بعد.",
    startSearch: "ابدأ البحث الآن",
    title: "سجل البحث",
    searchCount: "عمليات بحث",
    dateLocale: 'ar-EG'
  },
  en: {
    loading: "Loading search history...",
    loginTitle: "Search history available for members",
    loginText: "Please log in to save your search history and access it at any time.",
    loginBtn: "Login with Google",
    emptyTitle: "Search history is empty",
    emptyText: "You haven't performed any searches yet.",
    startSearch: "Start searching now",
    title: "Search History",
    searchCount: "searches",
    dateLocale: 'en-US'
  },
  fr: {
    loading: "Chargement de l'historique...",
    loginTitle: "Historique disponible pour les membres",
    loginText: "Veuillez vous connecter pour enregistrer votre historique de recherche.",
    loginBtn: "Connexion avec Google",
    emptyTitle: "L'historique est vide",
    emptyText: "Vous n'avez pas encore effectué de recherches.",
    startSearch: "Commencer la recherche",
    title: "Historique",
    searchCount: "recherches",
    dateLocale: 'fr-FR'
  },
  de: {
    loading: "Suchverlauf wird geladen...",
    loginTitle: "Suchverlauf für Mitglieder verfügbar",
    loginText: "Bitte melden Sie sich an, um Ihren Suchverlauf zu speichern.",
    loginBtn: "Mit Google anmelden",
    emptyTitle: "Suchverlauf ist leer",
    emptyText: "Sie haben noch keine Suchanfragen durchgeführt.",
    startSearch: "Suche starten",
    title: "Suchverlauf",
    searchCount: "Suchanfragen",
    dateLocale: 'de-DE'
  },
  es: {
    loading: "Cargando historial...",
    loginTitle: "Historial disponible para miembros",
    loginText: "Inicie sesión para guardar su historial de búsqueda.",
    loginBtn: "Iniciar sesión con Google",
    emptyTitle: "El historial está vacío",
    emptyText: "Aún no has realizado ninguna búsqueda.",
    startSearch: "Empezar a buscar",
    title: "Historial",
    searchCount: "búsquedas",
    dateLocale: 'es-ES'
  },
  id: {
    loading: "Memuat riwayat pencarian...",
    loginTitle: "Riwayat pencarian tersedia untuk anggota",
    loginText: "Silakan masuk untuk menyimpan riwayat pencarian Anda.",
    loginBtn: "Masuk dengan Google",
    emptyTitle: "Riwayat pencarian kosong",
    emptyText: "Anda belum melakukan pencarian apa pun.",
    startSearch: "Mulai mencari sekarang",
    title: "Riwayat Pencarian",
    searchCount: "pencarian",
    dateLocale: 'id-ID'
  }
};

const History: React.FC = () => {
  const { user, login, loading: authLoading, language } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'searchHistory'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SearchHistoryItem[];
      setHistory(items);
      setLoading(false);
    }, (error) => {
      console.error("History Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
        <p className="text-stone-600">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-xl">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="text-stone-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.loginTitle}</h2>
        <p className="text-stone-600 mb-8 px-8">
          {t.loginText}
        </p>
        <button 
          onClick={login}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-md"
        >
          {t.loginBtn}
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HistoryIcon className="text-stone-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.emptyTitle}</h2>
        <p className="text-stone-600 mb-8">{t.emptyText}</p>
        <Link to="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all">
          {t.startSearch}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
          <HistoryIcon size={32} className="text-green-600" />
          {t.title}
        </h1>
        <span className="text-sm text-stone-500 font-medium">{history.length} {t.searchCount}</span>
      </div>

      <div className="space-y-4">
        {history.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={() => navigate(`/results?q=${encodeURIComponent(item.query)}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                  <Calendar size={14} />
                  <span>{item.timestamp?.toDate().toLocaleDateString(t.dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {item.language && (
                    <span className="bg-stone-100 px-2 py-0.5 rounded uppercase text-[10px] font-bold text-stone-500">{item.language}</span>
                  )}
                </div>
                <h3 className={`text-lg font-bold text-stone-800 group-hover:text-green-600 transition-colors ${item.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {item.query}
                </h3>
                <p className={`text-stone-500 text-sm line-clamp-2 leading-relaxed ${item.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {item.answer}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  {language === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;
