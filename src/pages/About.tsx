import React from 'react';
import { BookOpen, ShieldCheck, Search, Users, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const translations = {
  ar: {
    title: "عن منصة أسئلة دينية",
    subtitle: "نسعى لتوفير إجابات دينية موثوقة من المصادر الإسلامية الأصلية باستخدام أحدث تقنيات الذكاء الاصطناعي.",
    visionTitle: "رؤيتنا",
    visionText: "نهدف إلى سد الفجوة بين التكنولوجيا والعلوم الشرعية، من خلال توفير محرك بحث ذكي يفهم أسئلة المستخدمين ويستخرج الإجابات مباشرة من أمهات الكتب الإسلامية مثل صحيح البخاري ومسلم وتفاسير القرآن المعتمدة.",
    howTitle: "كيف نعمل؟",
    howText: "نستخدم نماذج لغوية متقدمة (LLMs) مدربة على فهم اللغة العربية الفصحى، ونقوم بربطها بقواعد بيانات ضخمة من النصوص الإسلامية لضمان دقة الإجابة ووجود الدليل الشرعي لكل فتوى أو معلومة.",
    valuesTitle: "قيمنا الأساسية",
    reliability: "الموثوقية",
    reliabilityText: "الاعتماد على المصادر الأصلية فقط.",
    simplicity: "السهولة",
    simplicityText: "واجهة بسيطة تناسب الجميع.",
    honesty: "الأمانة",
    honestyText: "نقل النصوص بدقة وأمانة علمية.",
    ctaTitle: "هل لديك سؤال ديني؟",
    ctaText: "ابدأ البحث الآن واحصل على إجابة موثوقة مع الدليل.",
    ctaBtn: "ابدأ البحث"
  },
  en: {
    title: "About Islamic Q&A Platform",
    subtitle: "We strive to provide reliable religious answers from original Islamic sources using the latest artificial intelligence technologies.",
    visionTitle: "Our Vision",
    visionText: "We aim to bridge the gap between technology and Sharia sciences by providing a smart search engine that understands user questions and extracts answers directly from major Islamic books like Sahih al-Bukhari, Muslim, and approved Quranic interpretations.",
    howTitle: "How We Work?",
    howText: "We use advanced language models (LLMs) trained to understand Classical Arabic, and we link them to huge databases of Islamic texts to ensure the accuracy of the answer and the presence of Sharia evidence for every fatwa or information.",
    valuesTitle: "Our Core Values",
    reliability: "Reliability",
    reliabilityText: "Relying on original sources only.",
    simplicity: "Simplicity",
    simplicityText: "Simple interface suitable for everyone.",
    honesty: "Honesty",
    honestyText: "Transferring texts with accuracy and scientific honesty.",
    ctaTitle: "Do you have a religious question?",
    ctaText: "Start searching now and get a reliable answer with evidence.",
    ctaBtn: "Start Search"
  },
  fr: {
    title: "À propos de la plateforme Q&R Islamiques",
    subtitle: "Nous nous efforçons de fournir des réponses religieuses fiables à partir de sources islamiques originales en utilisant les dernières technologies d'intelligence artificielle.",
    visionTitle: "Notre Vision",
    visionText: "Nous visons à combler le fossé entre la technologie et les sciences de la charia en fournissant un moteur de recherche intelligent qui comprend les questions des utilisateurs et extrait les réponses directement des principaux livres islamiques comme Sahih al-Bukhari, Muslim et les interprétations coraniques approuvées.",
    howTitle: "Comment nous travaillons ?",
    howText: "Nous utilisons des modèles linguistiques avancés (LLM) formés pour comprendre l'arabe classique, et nous les lions à d'énormes bases de données de textes islamiques pour garantir l'exactitude de la réponse et la présence de preuves de la charia pour chaque fatwa ou information.",
    valuesTitle: "Nos Valeurs Fondamentales",
    reliability: "Fiabilité",
    reliabilityText: "S'appuyer uniquement sur des sources originales.",
    simplicity: "Simplicité",
    simplicityText: "Interface simple adaptée à tous.",
    honesty: "Honnêteté",
    honestyText: "Transférer des textes avec précision et honnêteté scientifique.",
    ctaTitle: "Avez-vous une question religieuse ?",
    ctaText: "Commencez à chercher maintenant et obtenez une réponse fiable avec des preuves.",
    ctaBtn: "Commencer la recherche"
  },
  de: {
    title: "Über die Islamische Q&A Plattform",
    subtitle: "Wir bemühen uns, zuverlässige religiöse Antworten aus originalen islamischen Quellen unter Verwendung neuester Technologien der künstlichen Intelligenz bereitzustellen.",
    visionTitle: "Unsere Vision",
    visionText: "Wir wollen die Lücke zwischen Technologie und Scharia-Wissenschaften schließen, indem wir eine intelligente Suchmaschine bereitstellen, die Benutzerfragen versteht und Antworten direkt aus bedeutenden islamischen Büchern wie Sahih al-Bukhari, Muslim und anerkannten Koraninterpretationen extrahiert.",
    howTitle: "Wie wir arbeiten?",
    howText: "Wir verwenden fortschrittliche Sprachmodelle (LLMs), die darauf trainiert sind, klassisches Arabisch zu verstehen, und verknüpfen sie mit riesigen Datenbanken islamischer Texte, um die Genauigkeit der Antwort und das Vorhandensein von Scharia-Beweisen für jede Fatwa oder Information sicherzustellen.",
    valuesTitle: "Unsere Grundwerte",
    reliability: "Zuverlässigkeit",
    reliabilityText: "Nur auf Originalquellen vertrauen.",
    simplicity: "Einfachheit",
    simplicityText: "Einfache Benutzeroberfläche für jeden geeignet.",
    honesty: "Ehrlichkeit",
    honestyText: "Texte mit Genauigkeit und wissenschaftlicher Ehrlichkeit übertragen.",
    ctaTitle: "Haben Sie eine religiöse Frage?",
    ctaText: "Suchen Sie jetzt und erhalten Sie eine zuverlässige Antwort mit Beweisen.",
    ctaBtn: "Suche starten"
  },
  es: {
    title: "Acerca de la plataforma Q&A Islámico",
    subtitle: "Nos esforzamos por proporcionar respuestas religiosas confiables de fuentes islámicas originales utilizando las últimas tecnologías de inteligencia artificial.",
    visionTitle: "Nuestra Visión",
    visionText: "Nuestro objetivo es cerrar la brecha entre la tecnología y las ciencias de la Sharia mediante el suministro de un motor de búsqueda inteligente que comprenda las preguntas de los usuarios y extraiga respuestas directamente de los principales libros islámicos como Sahih al-Bukhari, Muslim e interpretaciones coránicas aprobadas.",
    howTitle: "¿Cómo trabajamos?",
    howText: "Utilizamos modelos de lenguaje avanzados (LLM) entrenados para comprender el árabe clásico y los vinculamos a enormes bases de datos de textos islámicos para garantizar la precisión de la respuesta y la presencia de evidencia de la Sharia para cada fatwa o información.",
    valuesTitle: "Nuestros Valores Fundamentales",
    reliability: "Fiabilidad",
    reliabilityText: "Confiar solo en fuentes originales.",
    simplicity: "Simplicidad",
    simplicityText: "Interfaz sencilla apta para todos.",
    honesty: "Honestidad",
    honestyText: "Transferencia de textos con precisión y honestidad científica.",
    ctaTitle: "¿Tienes alguna pregunta religiosa?",
    ctaText: "Comienza a buscar ahora y obtén una respuesta confiable con evidencia.",
    ctaBtn: "Iniciar búsqueda"
  },
  id: {
    title: "Tentang Platform Tanya Jawab Islam",
    subtitle: "Kami berusaha memberikan jawaban keagamaan yang terpercaya dari sumber-sumber Islam asli menggunakan teknologi kecerdasan buatan terbaru.",
    visionTitle: "Visi Kami",
    visionText: "Kami bertujuan untuk menjembatani kesenjangan antara teknologi dan ilmu syariah dengan menyediakan mesin pencari cerdas yang memahami pertanyaan pengguna dan mengekstrak jawaban langsung dari kitab-kitab Islam utama seperti Shahih al-Bukhari, Muslim, dan tafsir Al-Quran yang disetujui.",
    howTitle: "Bagaimana Kami Bekerja?",
    howText: "Kami menggunakan model bahasa tingkat lanjut (LLM) yang dilatih untuk memahami bahasa Arab Klasik, dan kami menghubungkannya ke database teks Islam yang sangat besar untuk memastikan keakuratan jawaban dan adanya dalil syariah untuk setiap fatwa atau informasi.",
    valuesTitle: "Nilai-Nilai Inti Kami",
    reliability: "Keandalan",
    reliabilityText: "Hanya mengandalkan sumber asli.",
    simplicity: "Kesederhanaan",
    simplicityText: "Antarmuka sederhana yang cocok untuk semua orang.",
    honesty: "Kejujuran",
    honestyText: "Mentransfer teks dengan akurasi dan kejujuran ilmiah.",
    ctaTitle: "Apakah Anda memiliki pertanyaan agama?",
    ctaText: "Mulai cari sekarang dan dapatkan jawaban terpercaya dengan dalil.",
    ctaBtn: "Mulai Cari"
  }
};

const About: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">{t.title}</h1>
        <p className="text-stone-600 text-lg">
          {t.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">{t.visionTitle}</h2>
          <p className="text-stone-600 leading-relaxed">
            {t.visionText}
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
            <Search size={28} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">{t.howTitle}</h2>
          <p className="text-stone-600 leading-relaxed">
            {t.howText}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-xl mb-20">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">{t.valuesTitle}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-green-600">
              <BookOpen size={32} />
            </div>
            <h3 className="font-bold">{t.reliability}</h3>
            <p className="text-xs text-stone-500">{t.reliabilityText}</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Users size={32} />
            </div>
            <h3 className="font-bold">{t.simplicity}</h3>
            <p className="text-xs text-stone-500">{t.simplicityText}</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Heart size={32} />
            </div>
            <h3 className="font-bold">{t.honesty}</h3>
            <p className="text-xs text-stone-500">{t.honestyText}</p>
          </div>
        </div>
      </div>

      <div className="text-center bg-green-600 p-12 rounded-3xl text-white">
        <h2 className="text-2xl font-bold mb-4">{t.ctaTitle}</h2>
        <p className="mb-8 text-green-100">{t.ctaText}</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-all">
          <span>{t.ctaBtn}</span>
          {language === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </Link>
      </div>
    </div>
  );
};

export default About;
