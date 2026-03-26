import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { Loader2, MessageSquare, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  language: 'ar' | 'en';
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, loading, language }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRtl = language === 'ar';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-white islamic-pattern-light">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-green-600 mb-4 sm:mb-6 shadow-sm">
              <Bot size={32} className="sm:hidden" />
              <Bot size={48} className="hidden sm:block" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 px-4">
              {isRtl ? "مرحباً بك في الدردشة الإسلامية" : "Welcome to Islamic Chat"}
            </h2>
            <p className="text-stone-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed px-6">
              {isRtl 
                ? "أنا هنا لمساعدتك في أي استفسارات دينية أو محادثات عامة بصبغة إسلامية. اسألني أي شيء!" 
                : "I'm here to help you with any religious inquiries or general conversations with an Islamic flavor. Ask me anything!"}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mb-6"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot size={20} />
            </div>
            <div className="bg-white text-stone-800 border border-stone-100 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-green-600" size={16} />
              <span className="text-sm text-stone-500">{isRtl ? "جاري التفكير..." : "Thinking..."}</span>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ChatArea;
