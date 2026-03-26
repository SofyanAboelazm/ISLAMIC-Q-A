import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceInterfaceProps {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onToggleRecording: () => void;
  onNewChat: () => void;
  status: string;
  language: 'ar' | 'en';
  transcript: string;
  aiResponse: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isRecording,
  isProcessing,
  isSpeaking,
  onToggleRecording,
  onNewChat,
  status,
  language,
  transcript,
  aiResponse
}) => {
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col items-center justify-between h-full py-12 px-6 text-center">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-12">
        <h2 className="text-xl font-bold text-stone-800">
          {isRtl ? "الدردشة الصوتية" : "Voice Chat"}
        </h2>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-bold transition-all active:scale-95"
        >
          <RotateCcw size={16} />
          <span>{isRtl ? "محادثة جديدة" : "New Chat"}</span>
        </button>
      </div>

      {/* Center Area: Wave Animation */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl relative">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={isRecording || isSpeaking ? { scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full border-4 ${isRecording ? 'border-red-500' : isSpeaking ? 'border-green-500' : 'border-stone-200'}`}
          />
          
          {/* Inner Ring */}
          <motion.div
            animate={isRecording || isSpeaking ? { scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] } : { scale: 1, opacity: 0.05 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full border-2 ${isRecording ? 'border-red-400' : isSpeaking ? 'border-green-400' : 'border-stone-100'}`}
          />

          {/* Core Icon */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
            isRecording ? 'bg-red-500 text-white' : isSpeaking ? 'bg-green-600 text-white' : 'bg-white text-stone-400'
          }`}>
            {isProcessing ? (
              <Loader2 className="animate-spin" size={48} />
            ) : isRecording ? (
              <Mic size={48} />
            ) : isSpeaking ? (
              <Volume2 size={48} />
            ) : (
              <MicOff size={48} />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-12 h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-lg font-bold ${isRecording ? 'text-red-500' : isSpeaking ? 'text-green-600' : 'text-stone-500'}`}
            >
              {status}
            </motion.p>
          </AnimatePresence>
          
          <div className="mt-4 max-w-md">
            <p className="text-stone-400 text-sm italic line-clamp-2">
              {isRecording ? transcript : isSpeaking ? aiResponse : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-2xl flex items-center justify-center gap-8 mt-12">
        <button
          onClick={onToggleRecording}
          disabled={isProcessing || isSpeaking}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording ? 'bg-stone-800 text-white' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceInterface;
