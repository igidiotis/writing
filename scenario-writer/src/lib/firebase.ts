import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

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
    satisfaction: string;
    challenge: string;
    feedback?: string;
    formCompletionTime: number;
  };
  checkIn?: {
    workplace: string;
    field: string;
    interests: string[];
  };
}

// Function to save a session to Firestore
export async function saveSession(session: WritingSession): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "sessions"), {
      ...session,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
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

// Function to download session as JSON file
export function downloadSessionAsJson(session: WritingSession): void {
  try {
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `scenario_${session.sessionId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error("Error generating download:", error);
  }
} 