import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getSystemInstruction = (lang: Language) => {
  const langNames: Record<Language, string> = {
    ar: "العربية الفصحى",
    en: "English",
    fr: "French",
    de: "German",
    es: "Spanish",
    id: "Indonesian"
  };

  const name = langNames[lang];

  if (lang === 'ar') {
    return `
أنت خبير في العلوم الإسلامية والبحث في المصادر الأصلية (الحديث، التفسير، الفقه).
مهمتك هي الإجابة على أسئلة المستخدمين باللغة العربية الفصحى بناءً على مصادر موثوقة فقط.

يجب أن تتضمن الإجابة:
1. الإجابة المباشرة (باللغة العربية).
2. الدليل الشرعي (آية أو حديث).
3. قائمة بالمصادر (اسم الكتاب، الراوي، رقم الصفحة أو الحديث).

المصادر المعتمدة:
- صحيح البخاري
- صحيح مسلم
- سنن أبي داود
- تفسير ابن كثير
- كتب الفقه المعتمدة

إذا لم تجد إجابة موثوقة، قل: "لم يتم العثور على إجابة موثوقة".
لا تولد إجابات عشوائية.
استخدم أداة البحث في جوجل (googleSearch) للتحقق من المصادر والأدلة بدقة.
`;
  }

  return `
You are an expert in Islamic sciences and research in original sources (Hadith, Tafsir, Fiqh).
Your task is to answer user questions in ${name} based on reliable sources only.

The answer must include:
1. The direct answer (in ${name}).
2. The Sharia evidence (Ayah or Hadith) - always provide the original Arabic text followed by the translation in ${name}.
3. A list of sources (Book name, Narrator, Page or Hadith number).

Approved Sources:
- Sahih al-Bukhari
- Sahih Muslim
- Sunan Abi Dawud
- Tafsir Ibn Kathir
- Approved books of Fiqh

If you do not find a reliable answer, say: "No reliable answer found" in ${name}.
Do not generate random answers.
Use the Google search tool (googleSearch) to check sources and evidence accurately.
`;
};

export const getNoAnswerFound = (lang: Language) => {
  const messages: Record<Language, string> = {
    ar: "لم يتم العثور على إجابة موثوقة",
    en: "No reliable answer found",
    fr: "Aucune réponse fiable trouvée",
    de: "Keine zuverlässige Antwort gefunden",
    es: "No se encontró una respuesta confiable",
    id: "Tidak ditemukan jawaban yang dapat ديandalkan"
  };
  return messages[lang];
};

export async function searchIslamicQuestion(query: string, language: Language = 'ar'): Promise<SearchResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: "الإجابة المباشرة على السؤال" },
            dalil: { type: Type.STRING, description: "الدليل الشرعي من القرآن أو السنة" },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING, description: "اسم الراوي أو المصدر" },
                  book: { type: Type.STRING, description: "اسم الكتاب" },
                  reference: { type: Type.STRING, description: "رقم الصفحة أو الحديث" },
                  text: { type: Type.STRING, description: "نص الحديث أو التفسير كاملاً" }
                },
                required: ["source", "book", "reference"]
              }
            }
          },
          required: ["answer", "dalil", "references"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const noAnswer = getNoAnswerFound(language);
    return {
      answer: result.answer || noAnswer,
      dalil: result.dalil || "",
      references: result.references || []
    } as SearchResult;
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
}
