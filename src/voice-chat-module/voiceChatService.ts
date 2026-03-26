import { db, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from '../lib/firebase';
import { GoogleGenAI } from "@google/genai";
import { VoiceChatSession, VoiceChatMessage } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getVoiceSessions = (userId: string, callback: (sessions: VoiceChatSession[]) => void) => {
  const q = query(
    collection(db, 'voiceChatSessions'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VoiceChatSession));
    callback(sessions);
  });
};

export const getVoiceMessages = (sessionId: string, callback: (messages: VoiceChatMessage[]) => void) => {
  const q = query(
    collection(db, 'voiceChatSessions', sessionId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VoiceChatMessage));
    callback(messages);
  });
};

export const createVoiceSession = async (userId: string, voiceType: 'male' | 'female', title: string) => {
  const docRef = await addDoc(collection(db, 'voiceChatSessions'), {
    userId,
    voiceType,
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const saveVoiceMessage = async (sessionId: string, role: 'user' | 'model', content: string) => {
  await addDoc(collection(db, 'voiceChatSessions', sessionId, 'messages'), {
    role,
    content,
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, 'voiceChatSessions', sessionId), {
    updatedAt: serverTimestamp(),
  });
};

export const sendVoiceMessageToAI = async (message: string, history: any[], voiceType: 'male' | 'female') => {
  const systemInstruction = `You are a helpful assistant in a real-time voice conversation. 
  Keep your responses concise, natural, and conversational. 
  The user has selected a ${voiceType} voice for you, so respond accordingly.
  Primary language is Arabic, but respond in the language the user speaks.
  Avoid long lists or complex formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text || "";
};
