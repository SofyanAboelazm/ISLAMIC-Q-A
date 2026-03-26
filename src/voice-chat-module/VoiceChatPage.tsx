import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { VoiceChatSession, VoiceChatMessage } from './types';
import { getVoiceSessions, getVoiceMessages, createVoiceSession, saveVoiceMessage, sendVoiceMessageToAI } from './voiceChatService';
import VoiceSelection from './components/VoiceSelection';
import VoiceInterface from './components/VoiceInterface';
import VoiceHistory from './components/VoiceHistory';
import { useContinuousVoice } from './hooks/useContinuousVoice';
import { db, doc, deleteDoc } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, LogIn, Loader2 } from 'lucide-react';

const VoiceChatPage: React.FC = () => {
  const { user, login, language } = useAuth();
  const [sessions, setSessions] = useState<VoiceChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [voiceType, setVoiceType] = useState<'male' | 'female' | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");

  const isRtl = language === 'ar';

  const handleVoiceResult = useCallback(async (text: string) => {
    if (!user || !voiceType || !currentSessionId) return;

    setTranscript(text);
    setStatus(isRtl ? "جاري الرد..." : "Responding...");
    setLoading(true);

    try {
      // Save user message
      await saveVoiceMessage(currentSessionId, 'user', text);

      // Prepare history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      // Get AI response
      const response = await sendVoiceMessageToAI(text, history, voiceType);
      setAiResponse(response);
      
      // Save AI message
      await saveVoiceMessage(currentSessionId, 'model', response);

      // Speak AI response
      speak(response, voiceType, language as 'ar' | 'en');
    } catch (error) {
      console.error("Error in voice chat flow:", error);
      setStatus(isRtl ? "حدث خطأ ما" : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [user, voiceType, currentSessionId, messages, language, isRtl]);

  const {
    isRecording,
    isProcessing,
    isSpeaking,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    supported
  } = useContinuousVoice(handleVoiceResult, language as 'ar' | 'en');

  useEffect(() => {
    if (user) {
      const unsubscribe = getVoiceSessions(user.uid, (data) => {
        setSessions(data);
        setSessionsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setSessionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      const unsubscribe = getMessages(currentSessionId);
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const getMessages = (sessionId: string) => {
    return getVoiceMessages(sessionId, (data) => {
      setMessages(data);
    });
  };

  useEffect(() => {
    if (isRecording) {
      setStatus(isRtl ? "جاري الاستماع..." : "Listening...");
    } else if (isSpeaking) {
      setStatus(isRtl ? "جاري الرد..." : "Responding...");
    } else if (isProcessing) {
      setStatus(isRtl ? "جاري المعالجة..." : "Processing...");
    } else {
      setStatus(isRtl ? "اضغط للتحدث" : "Tap to speak");
    }
  }, [isRecording, isSpeaking, isProcessing, isRtl]);

  const handleSelectVoice = async (type: 'male' | 'female') => {
    if (!user) return;
    setVoiceType(type);
    
    // Create a new session automatically
    const title = isRtl ? `محادثة صوتية (${type === 'male' ? 'ذكر' : 'أنثى'})` : `Voice Chat (${type === 'male' ? 'Male' : 'Female'})`;
    const sessionId = await createVoiceSession(user.uid, type, title);
    setCurrentSessionId(sessionId);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (isSpeaking) stopSpeaking();
      startRecording();
    }
  };

  const handleNewChat = () => {
    setVoiceType(null);
    setCurrentSessionId(null);
    setMessages([]);
    setTranscript("");
    setAiResponse("");
    stopSpeaking();
    stopRecording();
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'voiceChatSessions', id));
      if (currentSessionId === id) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setVoiceType(session.voiceType);
      setCurrentSessionId(id);
      setTranscript("");
      setAiResponse("");
      stopSpeaking();
      stopRecording();
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
          <MessageSquare size={40} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-4">
          {isRtl ? "سجل الدخول للمحادثة الصوتية" : "Login to Voice Chat"}
        </h2>
        <button
          onClick={login}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95"
        >
          {isRtl ? "دخول باستخدام جوجل" : "Login with Google"}
        </button>
      </div>
    );
  }

  if (sessionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
        <p className="text-stone-600">{isRtl ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-stone-50/30 rounded-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        {!voiceType ? (
          <VoiceSelection key="selection" onSelect={handleSelectVoice} language={language as 'ar' | 'en'} />
        ) : (
          <motion.div
            key="interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row h-full"
          >
            <div className="flex-grow">
              <VoiceInterface
                isRecording={isRecording}
                isProcessing={isProcessing || loading}
                isSpeaking={isSpeaking}
                onToggleRecording={handleToggleRecording}
                onNewChat={handleNewChat}
                status={status}
                language={language as 'ar' | 'en'}
                transcript={transcript}
                aiResponse={aiResponse}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 pb-12">
        <VoiceHistory
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          language={language as 'ar' | 'en'}
        />
      </div>
    </div>
  );
};

export default VoiceChatPage;
