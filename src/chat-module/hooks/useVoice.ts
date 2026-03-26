import { useState, useCallback, useEffect, useRef } from 'react';

export interface VoiceHook {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  speak: (text: string, language: 'ar' | 'en') => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  supported: boolean;
}

export const useVoice = (onResult: (text: string) => void, language: 'ar' | 'en'): VoiceHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Use a ref for the callback to avoid re-running the effect when it changes
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'ar' ? 'ar-SA' : 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setIsProcessing(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResultRef.current(transcript);
        setIsProcessing(true);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };

      rec.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };

      setRecognition(rec);
    }
  }, [language]);

  const startRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    } else {
      alert(language === 'ar' ? 'متصفحك لا يدعم التعرف على الكلام' : 'Your browser does not support speech recognition');
    }
  }, [recognition, language]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const speak = useCallback((text: string, lang: 'ar' | 'en') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    isSpeaking,
    supported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
