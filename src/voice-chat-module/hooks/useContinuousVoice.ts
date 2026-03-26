import { useState, useCallback, useEffect, useRef } from 'react';

export interface VoiceHook {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  speak: (text: string, voiceType: 'male' | 'female', language: 'ar' | 'en') => void;
  stopSpeaking: () => void;
  supported: boolean;
}

export const useContinuousVoice = (onResult: (text: string) => void, language: 'ar' | 'en'): VoiceHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  
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

      recognitionRef.current = rec;
    }
  }, [language]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string, voiceType: 'male' | 'female', lang: 'ar' | 'en') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      
      // Attempt to find a suitable voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        const matchesLang = v.lang.includes(lang === 'ar' ? 'ar' : 'en');
        if (voiceType === 'male') {
          return matchesLang && (name.includes('male') || name.includes('david') || name.includes('mark'));
        } else {
          return matchesLang && (name.includes('female') || name.includes('zira') || name.includes('samantha'));
        }
      });

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Adjust pitch/rate based on voice type
      if (voiceType === 'male') {
        utterance.pitch = 0.8;
        utterance.rate = 0.9;
      } else {
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
      }

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
    isSpeaking,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    supported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
};
