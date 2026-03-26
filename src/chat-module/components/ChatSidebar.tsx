import React from 'react';
import { ChatSession } from '../types';
import { Plus, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  language: 'ar' | 'en';
  isOpen?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessions, currentSessionId, onSelectSession, onNewChat, onDeleteSession, language, isOpen }) => {
  const isRtl = language === 'ar';

  return (
    <div className={`
      fixed sm:relative inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-20
      w-72 sm:w-80 h-full bg-stone-50 border-r border-stone-200 flex flex-col 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
      sm:translate-x-0
      ${isRtl ? 'sm:order-last sm:border-l sm:border-r-0' : ''}
    `}>
      <div className="p-4 border-b border-stone-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>{isRtl ? "محادثة جديدة" : "New Chat"}</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-sm">
            {isRtl ? "لا توجد محادثات سابقة" : "No previous chats"}
          </div>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id ? 'bg-green-50 text-green-800 border border-green-100' : 'hover:bg-stone-100 text-stone-600 border border-transparent'}`}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare size={18} className={currentSessionId === session.id ? 'text-green-600' : 'text-stone-400'} />
              <div className="flex-grow overflow-hidden">
                <div className="text-sm font-semibold truncate">{session.title}</div>
                <div className="text-[10px] text-stone-400 truncate">{session.lastMessage || '...'}</div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-stone-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <MessageSquare size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-800">{isRtl ? "سجل الدردشة" : "Chat History"}</span>
            <span className="text-[10px] text-stone-500">{sessions.length} {isRtl ? "محادثات" : "conversations"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
