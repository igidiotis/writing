import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

import { Editor } from "./components/Editor";
import { RulePanel, type Rule } from "./components/RulePanel";
import { SubmissionForm } from "../scenario-writer/src/components/SubmissionForm";
import { Button } from "./components/ui/button";
import { ToastProvider, useToast } from "./components/ui/toast";
import { saveSession, saveSessionToLocalStorage, downloadSessionAsJson, type WritingSession } from "./lib/firebase";

// Example rules - in a real app these might come from an API or config
const INITIAL_RULES: Rule[] = [
  {
    id: "structure1",
    content: "Consider setting your story at least 10 years from today",
    type: "optional",
    condition: { type: "wordCount", value: 10 },
    status: "inactive"
  },
  // ... rest of the rules ...
];

const App: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [events, setEvents] = useState<Array<{type: string; timestamp: number; [key: string]: any}>>([]);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const startTimeRef = useRef<number>(Date.now());

  // Cancel submission and go back to writing
  const handleCancelSubmit = () => {
    // Save content to localStorage before canceling to ensure it's not lost
    const key = `draft_${sessionId}`;
    localStorage.setItem(key, content);
    
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleFormSubmit = (formData: any) => {
    // Create the final session object
    const endTime = Date.now();
    const session: WritingSession = {
      sessionId,
      content,
      wordCount,
      startTime: startTimeRef.current,
      endTime,
      duration: endTime - startTimeRef.current,
      eventLog: events,
      rules: rules.map(({ id, content, type, status, completedAt, skippedAt }) => ({
        id,
        content,
        type,
        status,
        ...(completedAt ? { completedAt } : {}),
        ...(skippedAt ? { skippedAt } : {})
      })),
      feedback: {
        ...formData,
        formCompletionTime: Date.now()
      }
    };

    // Save to Firestore
    saveSession(session)
      .then((_docId) => {
        showToast("Your scenario has been successfully submitted!", "success");
        setIsComplete(true);
        // Optional: Clear the draft from localStorage
        localStorage.removeItem(`draft_${sessionId}`);
      })
      .catch((_error) => {
        showToast("Error saving to cloud. Backed up locally.", "error");
        // Save locally as fallback
        saveSessionToLocalStorage(session);
        // Offer to download JSON
        downloadSessionAsJson(session);
      });
  };

  if (isSubmitting) {
    return (
      <SubmissionForm 
        onSubmit={handleFormSubmit} 
        onCancel={handleCancelSubmit}
      />
    );
  }

  return (
    <div>
      {/* Render your existing components here */}
    </div>
  );
};

export default App; 