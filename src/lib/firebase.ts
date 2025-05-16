import { initializeApp } from "firebase/app";
import { getFirestore, collection, Timestamp, setDoc, doc } from "firebase/firestore";

// Initialize Firebase - Replace with your own Firebase config
// These should ideally be in .env files
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Session type definition
export interface WritingSession {
  sessionId: string;
  content: string;
  wordCount: number;
  startTime: number;
  endTime: number;
  duration: number; // In milliseconds
  eventLog: Array<{
    type: string;
    timestamp: number;
    wildcardId?: string; // Added wildcardId for tracking wildcard usage
    [key: string]: any;
  }>;
  rules: Array<{
    id: string;
    content: string;
    type: string;
    status: string;
    completedAt?: number;
    skippedAt?: number;
  }>;
  feedback?: {
    overallExperience: "very-negative" | "negative" | "neutral" | "positive" | "very-positive";
    promptEffectiveness: {
      creativity: "low" | "medium" | "high" | "very-high";
      clarity: "low" | "medium" | "high" | "very-high";
      timing: "poor" | "fair" | "good" | "excellent";
      relevance: "low" | "medium" | "high" | "very-high";
    };
    flowExperience: {
      immersion: "low" | "medium" | "high" | "very-high";
      timePerception: "distorted" | "somewhat-distorted" | "normal" | "lost-track";
      ideaGeneration: "struggled" | "occasional" | "consistent" | "abundant";
    };
    specificPromptImpact: {
      mostHelpful: string;
      leastHelpful: string;
    };
    cognitiveEmotionalResponse: Array<
      "inspired" | "challenged" | "frustrated" | "engaged" | "bored" |
      "confident" | "anxious" | "focused" | "distracted" | "other"
    >;
    learningValue: "none" | "minimal" | "moderate" | "significant" | "transformative";
    narrativeQuality: {
      coherence: "low" | "medium" | "high" | "very-high";
      originality: "low" | "medium" | "high" | "very-high";
      development: "poor" | "fair" | "good" | "excellent";
    };
    additionalFeedback?: string;
    email?: string;
    formCompletionTime: number;
  };
}

// Function to save a session to Firestore
export async function saveSession(session: WritingSession): Promise<string> {
  try {
    const docRef = doc(db, "sessions", session.sessionId);
    await setDoc(docRef, {
      ...session,
      createdAt: Timestamp.now(),
    });
    return session.sessionId;
  } catch (error) {
    console.error("Error saving session to Firestore:", error);
    // Fallback: Save to localStorage
    const key = `session_${session.sessionId}`;
    localStorage.setItem(key, JSON.stringify(session));
    throw error;
  }
}

// Function to save session to localStorage (fallback option)
export function saveSessionToLocalStorage(session: WritingSession): void {
  try {
    const key = `session_${session.sessionId}`;
    localStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving session to localStorage:", error);
  }
}

// Download session as JSON file
export function downloadSessionAsJson(session: WritingSession): void {
  try {
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `scenario_session_${session.sessionId}.json`);
    linkElement.click();
  } catch (error) {
    console.error("Error downloading session:", error);
  }
} 