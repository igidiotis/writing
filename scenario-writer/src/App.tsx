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
    id: "structure1",
    content: "Write from the perspective of someone at least 10 years from today.",
    type: "mandatory",
    condition: { type: "wordCount", value: 10 },
    status: "inactive",
  },
  {
    id: "structure2",
    content: "Include at least one dialogue exchange between people with different views on education",
    type: "optional", 
    condition: { type: "wordCount", value: 30 },
    status: "inactive",
  },
  {
    id: "structure3",
    content: "Compare and contrast this future education system with today's approach",
    type: "mandatory",
    condition: { type: "time", value: 90 }, // After 1.5 minutes
    status: "inactive",
  },
  {
    id: "structure4",
    content: "Consider ending with a reflection on how these educational changes have impacted society",
    type: "mandatory",
    condition: { type: "wordCount", value: 60 },
    status: "inactive",
  },
  
  // Content/Creative Prompts (Optional)
  {
    id: "content1",
    content: "Describe a new learning technology that has revolutionized education",
    type: "optional",
    condition: { type: "wordCount", value: 40 },
    status: "inactive",
  },
  {
    id: "content2",
    content: "Include a character who resists or struggles with the new education system",
    type: "optional",
    condition: { type: "wordCount", value: 75 },
    status: "inactive",
  },
  {
    id: "content3",
    content: "Describe how the physical spaces for learning have changed",
    type: "mandatory",
    condition: { type: "time", value: 180 }, // After 3 minutes
    status: "inactive",
  },
  {
    id: "content4",
    content: "Incorporate how global events (climate, politics, etc.) have shaped education",
    type: "optional",
    condition: { type: "wordCount", value: 90 },
    status: "inactive",
  },
  {
    id: "content5",
    content: "Include a reference to how the role of teachers has evolved",
    type: "optional",
    condition: { type: "wordCount", value: 40 },
    status: "inactive",
  },
  {
    id: "wildcard",
    content: "Add an unexpected disruption or innovation that changed education forever",
    type: "optional",
    condition: { type: "time", value: 180 }, // After 3 minutes
    status: "inactive",
  }
];

function MainApp() {
  const { showToast } = useToast();
  const [sessionId] = useState(() => uuidv4());
  const startTimeRef = useRef<number>(Date.now());
  const [content, setContent] = useState<string>(() => {
    // Initialize content from localStorage if it exists
    const savedDraft = localStorage.getItem(`draft_${sessionId}`);
    return savedDraft || "";
  });
  const [wordCount, setWordCount] = useState<number>(0);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [events, setEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  // Calculate initial word count from saved content
  useEffect(() => {
    if (content) {
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  }, []);
  
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
    
    // Save to localStorage immediately
    if (newContent.trim()) {
      const key = `draft_${sessionId}`;
      localStorage.setItem(key, newContent);
    }
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
    
    // Save current content to localStorage before switching to submission form
    const key = `draft_${sessionId}`;
    localStorage.setItem(key, content);
    
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
  
  // Cancel submission and go back to writing
  const handleCancelSubmit = () => {
    // Retrieve the content from localStorage before setting isSubmitting to false
    const key = `draft_${sessionId}`;
    const savedContent = localStorage.getItem(key);
    
    // Only update content if there's something saved in localStorage
    if (savedContent) {
      setContent(savedContent);
    }
    
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
          initialContent={content}
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
      {/* Credit Button */}
      <a 
        href="https://www.kth.se/profile/gidiotis" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 px-4 py-2 text-sm font-medium text-white rounded-full 
                 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80
                 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105
                 sm:text-xs sm:py-1.5 sm:px-3"
      >
        Created by Iosif Gidiotis
      </a>
      
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
