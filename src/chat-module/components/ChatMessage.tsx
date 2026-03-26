import React from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${isUser ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm ${isUser ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'}`}>
          <div className="markdown-body text-xs sm:text-sm leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        {message.timestamp && (
          <span className="text-[10px] text-stone-400 mt-1 px-1">
            {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
