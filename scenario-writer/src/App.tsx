import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

import { Editor } from "./components/Editor";
import { RulePanel, type Rule } from "./components/RulePanel";
import { SubmissionForm } from "./components/SubmissionForm";
import { Button } from "./components/ui/button";
import { ToastProvider, useToast } from "./components/ui/toast";
import { saveSession, saveSessionToLocalStorage, downloadSessionAsJson, type WritingSession } from "./lib/firebase";

// Example rules - in a real app these might come from an API or config
const INITIAL_RULES: Rule[] = [
  {
    id: "rule1",
    content: "Write from the perspective of someone living 50 years in the future",
    type: "mandatory",
    condition: { type: "wordCount", value: 10 },
    status: "inactive",
  },
  {
    id: "rule2",
    content: "Include a reference to a technology that doesn't exist yet",
    type: "mandatory",
    condition: { type: "wordCount", value: 100 },
    status: "inactive",
  },
  {
    id: "rule3",
    content: "Mention how climate change has affected daily life",
    type: "optional",
    condition: { type: "wordCount", value: 200 },
    status: "inactive",
  },
  {
    id: "rule4",
    content: "Describe a cultural tradition that has evolved over time",
    type: "optional",
    condition: { type: "time", value: 120 }, // After 2 minutes
    status: "inactive",
  },
  {
    id: "rule5",
    content: "Include a moment of personal reflection about society",
    type: "mandatory",
    condition: { type: "wordCount", value: 300 },
    status: "inactive",
  },
];

function MainApp() {
  const { showToast } = useToast();
  const [sessionId] = useState(() => uuidv4());
  const startTimeRef = useRef<number>(Date.now());
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [events, setEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  // Handle auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        const key = `draft_${sessionId}`;
        localStorage.setItem(key, content);
        // Optional: show a subtle auto-save indicator
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [sessionId, content]);
  
  // Handle content changes from the editor
  const handleContentChange = (newContent: string, newWordCount: number) => {
    setContent(newContent);
    setWordCount(newWordCount);
  };
  
  // Track editor events
  const handleTrackEvent = (event: any) => {
    setEvents(prev => [...prev, event]);
  };
  
  // Handle rule interactions
  const handleRuleInteraction = (ruleId: string, action: 'complete' | 'skip') => {
    setRules(currentRules => 
      currentRules.map(rule => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            status: action === 'complete' ? 'completed' : 'skipped',
            ...(action === 'complete' ? { completedAt: Date.now() } : { skippedAt: Date.now() })
          };
        }
        return rule;
      })
    );
    
    // Track the event
    handleTrackEvent({
      type: `rule_${action}`,
      timestamp: Date.now(),
      ruleId,
    });
    
    // Show feedback
    showToast(
      action === 'complete' 
        ? "Rule completed! Well done." 
        : "Rule skipped. Moving on...",
      action === 'complete' ? "success" : "info"
    );
  };
  
  // Handle submit button click
  const handleSubmitClick = () => {
    // Check if all mandatory rules are completed
    const mandatoryRules = rules.filter(r => r.type === 'mandatory');
    const incompleteMandatory = mandatoryRules.filter(
      r => r.status !== 'completed' && r.status === 'active'
    );
    
    if (incompleteMandatory.length > 0) {
      showToast("Please complete all required prompts before submitting", "error");
      return;
    }
    
    setIsSubmitting(true);
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
      .then((docId) => {
        showToast("Your scenario has been successfully submitted!", "success");
        setIsComplete(true);
        // Optional: Clear the draft from localStorage
        localStorage.removeItem(`draft_${sessionId}`);
      })
      .catch((error) => {
        showToast("Error saving to cloud. Backed up locally.", "error");
        // Save locally as fallback
        saveSessionToLocalStorage(session);
        // Offer to download JSON
        downloadSessionAsJson(session);
      });
  };
  
  // Cancel submission and go back to writing
  const handleCancelSubmit = () => {
    setIsSubmitting(false);
  };
  
  // Start a new session
  const handleStartNew = () => {
    window.location.reload();
  };
  
  // Render appropriate view based on state
  const renderView = () => {
    if (isComplete) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h1 className="text-3xl font-bold mb-6">Submission Complete!</h1>
          <p className="text-lg mb-8">Thank you for sharing your future scenario.</p>
          <Button onClick={handleStartNew} size="lg">
            Start a New Scenario
          </Button>
        </motion.div>
      );
    }
    
    if (isSubmitting) {
      return (
        <SubmissionForm 
          onSubmit={handleFormSubmit} 
          onCancel={handleCancelSubmit} 
        />
      );
    }
    
    return (
      <>
        <Editor 
          onContentChange={handleContentChange} 
          onTrackEvent={handleTrackEvent} 
        />
        
        <RulePanel 
          rules={rules}
          wordCount={wordCount}
          startTime={startTimeRef.current}
          onRuleInteraction={handleRuleInteraction}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-3xl mx-auto mt-8 flex justify-end"
        >
          <Button 
            onClick={handleSubmitClick}
            disabled={content.trim().length < 50}
            size="lg"
          >
            Submit Story
          </Button>
        </motion.div>
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <header className="w-full max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Future Scenario Writer</h1>
        <p className="text-muted-foreground mt-2">
          Create a speculative story about our future world
        </p>
      </header>
      
      <main>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
