import React from 'react';
import { User, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceSelectionProps {
  onSelect: (type: 'male' | 'female') => void;
  language: 'ar' | 'en';
}

const VoiceSelection: React.FC<VoiceSelectionProps> = ({ onSelect, language }) => {
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-stone-100"
      >
        <h2 className="text-2xl font-bold text-stone-900 mb-8">
          {isRtl ? "اختر نوع الصوت" : "Select Voice Type"}
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => onSelect('male')}
            className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-stone-50 hover:bg-green-50 border border-stone-100 hover:border-green-200 transition-all active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-400 group-hover:text-green-600 shadow-sm transition-colors">
              <User size={32} />
            </div>
            <span className="font-bold text-stone-700 group-hover:text-green-700">
              {isRtl ? "👨 ذكر" : "👨 Male"}
            </span>
          </button>

          <button
            onClick={() => onSelect('female')}
            className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-stone-50 hover:bg-green-50 border border-stone-100 hover:border-green-200 transition-all active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-400 group-hover:text-green-600 shadow-sm transition-colors">
              <UserCheck size={32} />
            </div>
            <span className="font-bold text-stone-700 group-hover:text-green-700">
              {isRtl ? "👩 أنثى" : "👩 Female"}
            </span>
          </button>
        </div>

        <p className="mt-8 text-stone-500 text-sm leading-relaxed">
          {isRtl 
            ? "سيقوم الذكاء الاصطناعي بالرد عليك باستخدام نوع الصوت الذي تختاره." 
            : "The AI will respond to you using the voice type you select."}
        </p>
      </motion.div>
    </div>
  );
};

export default VoiceSelection;
