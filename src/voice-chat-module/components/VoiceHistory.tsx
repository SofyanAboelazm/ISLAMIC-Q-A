import React from 'react';
import { History, MessageSquare, Trash2, User, UserCheck } from 'lucide-react';
import { VoiceChatSession } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceHistoryProps {
  sessions: VoiceChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  language: 'ar' | 'en';
}

const VoiceHistory: React.FC<VoiceHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  language
}) => {
  const isRtl = language === 'ar';

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
      <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
        <History size={24} className="text-stone-400" />
        <h3 className="text-lg font-bold text-stone-900">
          {isRtl ? "سجل المحادثات الصوتية" : "Voice Chat History"}
        </h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>{isRtl ? "لا يوجد سجل محادثات حتى الآن" : "No chat history yet"}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  currentSessionId === session.id 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'bg-stone-50 border-stone-100 hover:bg-stone-100'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    session.voiceType === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                  }`}>
                    {session.voiceType === 'male' ? <User size={20} /> : <UserCheck size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate ${currentSessionId === session.id ? 'text-green-900' : 'text-stone-800'}`}>
                      {session.title}
                    </h4>
                    <p className="text-xs text-stone-400">
                      {session.createdAt?.toDate().toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default VoiceHistory;
