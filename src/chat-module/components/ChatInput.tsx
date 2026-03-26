import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  language: 'ar' | 'en';
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading, language }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRtl = language === 'ar';

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    supported
  } = useVoice((text) => {
    setMessage(text);
    // Optional: auto-send
    if (text.trim()) {
      onSendMessage(text.trim());
      setMessage('');
    }
  }, language);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRtl ? "اكتب رسالتك هنا..." : "Type your message here..."}
            className={`w-full p-3 sm:p-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl border border-stone-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none text-sm leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}
            disabled={loading || isRecording}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {supported && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all active:scale-95 flex-shrink-0 ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-red-200 shadow-lg' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title={isRtl ? "اضغط للتحدث" : "Click to speak"}
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isRecording ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!message.trim() || loading || isRecording}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className={isRtl ? 'rotate-180' : ''} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
