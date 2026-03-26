import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, History, Info, LogIn, User, BookOpen, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

const translations = {
  ar: {
    search: "البحث",
    history: "السجل",
    about: "عن الموقع",
    login: "دخول",
    logout: "تسجيل الخروج",
    title: "أسئلة دينية",
    subtitle: "Islamic Q&A",
    footerText: "منصة إسلامية موثوقة للبحث عن الإجابات الدينية من المصادر الأصلية.",
    rights: "جميع الحقوق محفوظة"
  },
  en: {
    search: "Search",
    history: "History",
    about: "About",
    login: "Login",
    logout: "Logout",
    title: "Islamic Q&A",
    subtitle: "Religious Questions",
    footerText: "A reliable Islamic platform for searching religious answers from original sources.",
    rights: "All rights reserved"
  },
  fr: {
    search: "Recherche",
    history: "Histoire",
    about: "À propos",
    login: "Connexion",
    logout: "Déconnexion",
    title: "Q&R Islamiques",
    subtitle: "Questions Religieuses",
    footerText: "Une plateforme islamique fiable pour rechercher des réponses religieuses à partir de sources originales.",
    rights: "Tous droits réservés"
  },
  de: {
    search: "Suche",
    history: "Verlauf",
    about: "Über uns",
    login: "Anmelden",
    logout: "Abmelden",
    title: "Islamische Q&A",
    subtitle: "Religiöse Fragen",
    footerText: "Eine zuverlässige islamische Plattform für die Suche nach religiösen Antworten aus Originalquellen.",
    rights: "Alle Rechte vorbehalten"
  },
  es: {
    search: "Buscar",
    history: "Historial",
    about: "Acerca de",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    title: "Q&A Islámico",
    subtitle: "Preguntas Religiosas",
    footerText: "Una plataforma islámica confiable para buscar respuestas religiosas de fuentes originales.",
    rights: "Todos los derechos reservados"
  },
  id: {
    search: "Cari",
    history: "Riwayat",
    about: "Tentang",
    login: "Masuk",
    logout: "Keluar",
    title: "Tanya Jawab Islam",
    subtitle: "Pertanyaan Agama",
    footerText: "Platform Islam terpercaya untuk mencari jawaban keagamaan dari sumber asli.",
    rights: "Seluruh hak cipta"
  }
};

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, login, signOut, language, setLanguage } = useAuth();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col islamic-pattern bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:bg-green-700 transition-colors">
              <BookOpen size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-800 leading-tight">{t.title}</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">{t.subtitle}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-green-600' : 'text-stone-600 hover:text-green-600'}`}>
              <Search size={18} />
              <span>{t.search}</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-green-600' : 'text-stone-600 hover:text-green-600'}`}>
              <History size={18} />
              <span>{t.history}</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-green-600' : 'text-stone-600 hover:text-green-600'}`}>
              <Info size={18} />
              <span>{t.about}</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-stone-50">
                <Globe size={18} />
                <span className="hidden sm:inline">{languages.find(l => l.code === language)?.name}</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-stone-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors flex items-center justify-between ${language === lang.code ? 'text-green-600 font-bold bg-green-50' : 'text-stone-600'}`}
                  >
                    <span>{lang.name}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-stone-800">{profile?.displayName || user.email}</span>
                  <button onClick={signOut} className="text-[10px] text-red-600 hover:underline">{t.logout}</button>
                </div>
                <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <LogIn size={18} />
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-white border-t border-stone-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white">
                  <BookOpen size={14} />
                </div>
                <span className="font-bold text-green-800">{t.title}</span>
              </div>
              <p className="text-stone-500 text-xs text-center md:text-start">
                {t.footerText}
              </p>
            </div>
            
            <div className="flex items-center gap-8 text-xs font-medium text-stone-400">
              <Link to="/about" className="hover:text-green-600 transition-colors">{t.about}</Link>
              <a href="https://islamweb.net/" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">إسلام ويب</a>
              <span>© {new Date().getFullYear()} {t.rights}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
