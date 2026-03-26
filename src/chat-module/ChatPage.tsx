import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatSession, Message } from './types';
import { getSessions, getMessages, createNewChatSession, saveMessage, sendMessageToAI } from './chatService';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import { db, doc, deleteDoc } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, LogIn, Loader2, Menu, X, Plus, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from './hooks/useVoice';

const ChatPage: React.FC = () => {
  const { user, login, language } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const isRtl = language === 'ar';

  const { speak, stopSpeaking, isSpeaking } = useVoice(() => {}, language as 'ar' | 'en');

  useEffect(() => {
    if (user) {
      const unsubscribe = getSessions(user.uid, (data) => {
        setSessions(data);
        setSessionsLoading(false);
        if (data.length > 0 && !currentSessionId) {
          setCurrentSessionId(data[0].id);
        }
      });
      return () => unsubscribe();
    } else {
      setSessionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      const unsubscribe = getMessages(currentSessionId, (data) => {
        setMessages(data);
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    let sessionId = currentSessionId;
    setLoading(true);

    try {
      if (!sessionId) {
        sessionId = await createNewChatSession(user.uid, content);
        setCurrentSessionId(sessionId);
      }

      await saveMessage(sessionId, 'user', content);

      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await sendMessageToAI(content, history);
      await saveMessage(sessionId, 'model', aiResponse);

      if (autoSpeak) {
        speak(aiResponse, language as 'ar' | 'en');
      }
    } catch (error) {
      console.error("Error in chat flow:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'chatSessions', id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
          <MessageSquare size={32} className="sm:hidden" />
          <MessageSquare size={40} className="hidden sm:block" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
          {isRtl ? "سجل الدخول للمحادثة" : "Login to Chat"}
        </h2>
        <p className="text-stone-500 max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
          {isRtl 
            ? "يجب عليك تسجيل الدخول لحفظ سجل محادثاتك والوصول إليها من أي مكان." 
            : "You must login to save your chat history and access it from anywhere."}
        </p>
        <button
          onClick={login}
          className="flex items-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <LogIn size={20} />
          <span>{isRtl ? "دخول باستخدام جوجل" : "Login with Google"}</span>
        </button>
      </div>
    );
  }

  if (sessionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
        <p className="text-stone-600 animate-pulse">{isRtl ? "جاري تحميل المحادثات..." : "Loading chats..."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-stone-200 overflow-hidden relative">
      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button 
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAutoSpeak(!autoSpeak);
            }}
            className={`p-2 rounded-lg transition-colors ${autoSpeak ? 'bg-green-100 text-green-600' : 'text-stone-400 hover:bg-stone-100'}`}
            title={isRtl ? "القراءة التلقائية" : "Auto-read"}
          >
            {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
        <div className="font-bold text-green-800 text-sm truncate max-w-[150px]">
          {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : (isRtl ? "محادثة جديدة" : "New Chat")}
        </div>
        <button 
          onClick={() => {
            handleNewChat();
            setIsSidebarOpen(false);
          }}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title={isRtl ? "محادثة جديدة" : "New Chat"}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          language={language as 'ar' | 'en'}
          isOpen={isSidebarOpen}
        />
        
        <div className="flex-grow flex flex-col min-w-0">
          {/* Desktop Header / Info Bar */}
          <div className="hidden sm:flex items-center justify-between px-6 py-3 border-b border-stone-100 bg-white">
            <h2 className="font-bold text-stone-800">
              {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : (isRtl ? "محادثة جديدة" : "New Chat")}
            </h2>
            <button 
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                autoSpeak 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isRtl ? "القراءة التلقائية" : "Auto-read"}</span>
            </button>
          </div>

          <ChatArea
            messages={messages}
            loading={loading}
            language={language as 'ar' | 'en'}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            loading={loading}
            language={language as 'ar' | 'en'}
          />
        </div>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="sm:hidden absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
