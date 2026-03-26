import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { db, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc, updateDoc, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Message, ChatSession } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
أنت مساعد ذكي متخصص في المعرفة الإسلامية. 
يجب أن تكون إجاباتك دقيقة، محترمة، ومبنية على المصادر الموثوقة. 
أجب باللغة العربية بأسلوب واضح ومبسط. 
يمكنك إجراء محادثات عامة ولكن بصبغة إسلامية وأخلاقية. 
إذا سُئلت عن فتوى، وجه السائل للمصادر المعتمدة أو العلماء المختصين مع تقديم الرأي الفقهي العام إن أمكن. 
حاول توفير المراجع (القرآن، السنة، كتب الفقه) كلما كان ذلك ممكناً.
`;

export const sendMessageToAI = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });

    const response = await model;
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const createNewChatSession = async (userId: string, firstMessage: string) => {
  const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
  const path = 'chatSessions';
  
  try {
    const sessionRef = await addDoc(collection(db, path), {
      userId,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: firstMessage
    });

    return sessionRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
};

export const saveMessage = async (sessionId: string, role: 'user' | 'model', content: string) => {
  const messagesPath = `chatSessions/${sessionId}/messages`;
  const sessionPath = `chatSessions/${sessionId}`;

  try {
    const sessionDoc = await getDoc(doc(db, 'chatSessions', sessionId));
    const userId = sessionDoc.exists() ? sessionDoc.data().userId : null;

    await addDoc(collection(db, messagesPath), {
      role,
      content,
      userId, // Denormalize userId for security rules
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, 'chatSessions', sessionId), {
      updatedAt: serverTimestamp(),
      lastMessage: content
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, messagesPath);
    throw error;
  }
};

export const getMessages = (sessionId: string, callback: (messages: Message[]) => void) => {
  const path = `chatSessions/${sessionId}/messages`;
  const userId = auth.currentUser?.uid;

  if (!userId) return () => {};

  const q = query(
    collection(db, path),
    where('userId', '==', userId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const getSessions = (userId: string, callback: (sessions: ChatSession[]) => void) => {
  const path = 'chatSessions';
  const q = query(
    collection(db, path),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[];
    callback(sessions);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
