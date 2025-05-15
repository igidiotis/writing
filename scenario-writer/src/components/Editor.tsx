import { useEffect, useState, useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { getRandomWildcardStoryOpener } from "../lib/wildcardStoryOpeners";
import { RulePanel, type Rule } from "./RulePanel";

interface EditorEvent {
  type: 'type' | 'delete' | 'paste' | 'pause' | 'resume' | 'consent' | 'wildcard_accepted' | 'wildcard_declined';
  timestamp: number;
  content?: string;
  selection?: {
    start: number;
    end: number;
  };
  wildcardId?: string;
}

export interface EditorProps {
  initialContent?: string;
  onContentChange: (content: string, wordCount: number) => void;
  onTrackEvent: (event: EditorEvent) => void;
  rules: Rule[];
  wordCount: number;
  startTime: number;
  onRuleInteraction: (ruleId: string, action: 'complete' | 'skip') => void;
  sessionId: string;
}

export function Editor({ 
  initialContent = "", 
  onContentChange, 
  onTrackEvent,
  rules,
  wordCount,
  startTime,
  onRuleInteraction,
  sessionId
}: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [consentOpen, setConsentOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [showWildcard, setShowWildcard] = useState(false);
  const [wildcardShown, setWildcardShown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const wildcardTimeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // Initialize with initialContent only on mount
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
    // Only run on mount!
    // eslint-disable-next-line
  }, []);
  
  // Track word count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    onContentChange(content, words);
  }, [content, onContentChange]);

  // Set up wildcard prompt timer
  useEffect(() => {
    // Only start wildcard timer if content is empty and wildcard hasn't been shown yet
    if (content.trim() === '' && !wildcardShown) {
      wildcardTimeoutRef.current = window.setTimeout(() => {
        setShowWildcard(true);
        setWildcardShown(true);
      }, 10000); // Show wildcard prompt after 10 seconds
    }

    return () => {
      if (wildcardTimeoutRef.current) {
        window.clearTimeout(wildcardTimeoutRef.current);
      }
    };
  }, [content, wildcardShown]);

  // Restore draft from localStorage on mount if available
  useEffect(() => {
    const savedDraft = localStorage.getItem('draft_' + sessionId);
    if (savedDraft && !content) {
      setContent(savedDraft);
    }
  }, [sessionId]);

  // Track user events
  const trackEvent = (type: EditorEvent['type'], additionalData = {}) => {
    const event: EditorEvent = {
      type,
      timestamp: Date.now(),
      ...additionalData
    };
    
    if (textareaRef.current) {
      event.selection = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      };
    }
    
    onTrackEvent(event);
    lastActivityRef.current = Date.now();
    
    // Reset pause timeout
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
    
    pauseTimeoutRef.current = window.setTimeout(() => {
      onTrackEvent({
        type: 'pause',
        timestamp: Date.now()
      });
      
      pauseTimeoutRef.current = null;
    }, 2000); // Consider paused after 2 seconds of inactivity
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (newContent.length > content.length) {
      trackEvent('type', { content: newContent });
    } else if (newContent.length < content.length) {
      trackEvent('delete', { content: newContent });
    }
    
    setContent(newContent);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    trackEvent('paste', { content: pastedText });
  };

  const handleKeyDown = (_e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Add additional tracking if needed
  };

  const handleConsent = () => {
    setHasConsented(true);
    trackEvent('consent', { timestamp: Date.now() });
    setConsentOpen(false);
  };

  const handleAcceptWildcard = () => {
    const wildcardOpener = getRandomWildcardStoryOpener();
    const newContent = wildcardOpener.text;
    
    setContent(newContent);
    trackEvent('wildcard_accepted', { 
      content: newContent,
      wildcardId: wildcardOpener.id
    });
    
    setShowWildcard(false);
    
    // Focus the textarea after inserting the wildcard text
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at the end of the text
      const length = newContent.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  const handleDeclineWildcard = () => {
    trackEvent('wildcard_declined', { timestamp: Date.now() });
    setShowWildcard(false);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="mb-3 text-center">
          <button 
            onClick={() => setConsentOpen(true)}
            className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Read more about consenting to participate in this research project
          </button>
        </div>
        
        <Card variant="glass" className="backdrop-blur-md">
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-medium">Write Your Scenario</h2>
              <div className="text-sm text-muted-foreground">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </div>
            </div>
            
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder="Begin writing your future scenario here..."
              className="min-h-[300px] text-base leading-relaxed focus:ring-primary/30"
            />
            
            {/* Consent Dialog */}
            <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Research Participation Consent</DialogTitle>
                </DialogHeader>
                <DialogDescription className="max-h-[70vh] overflow-y-auto py-4">
                  <div className="space-y-4 text-left">
                    <p>
                      The purpose of this research project is to examine the potential of using speculative storywriting to explore the long-term impact of artificial intelligence (AI) on future education contexts. Writing speculative stories helps us build alternative, (un)wanted education spaces or scenarios, offering insights that can inform present decisions and outlooks.
                    </p>
                    
                    <p>
                      You are invited to participate by contributing your own speculative story. Your participation will help us better understand various visions of future learning environments shaped by AI.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Project Methodology and Specifications</h3>
                    <p>
                      As part of this project, you will use a digital interactive scenario generator tool. Upon agreeing to participate, you will be prompted to generate four distinct elements from a digital card deck. These elements form the basis for a speculative story, which you will write in the space provided within the tool. You may also find prompts, examples, and guiding questions to support your writing process.
                    </p>
                    
                    <p>
                      After completing your story, you will have the option to "submit" it to a connected form. This form will also include fields for demographic information, such as your occupation, subject field, and country, as well as an optional email address field.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Information Collection</h3>
                    <p>
                      Within this research project, we will collect and register the following:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Written/generated story: The story you create is stored separately and will not be connected to any identifying personal information (unless you choose to provide such information in the form).</li>
                      <li>Email address (optional): Only if you choose to provide it.</li>
                      <li>Occupation, subject field, and country: General demographic information that helps us gauge the audience using the tool.</li>
                    </ul>
                    
                    <p>
                      The submitted stories and your feedback will be analyzed as part of the research project. Portions of these stories may also be cited or discussed in research publications and presentations, or used in subsequent focus groups or workshop discussions. However, no identifying information will be included in such discussions.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Voluntary Participation and Data Protection</h3>
                    <p>
                      Your participation in this study is completely voluntary. You may discontinue your participation at any point without providing a reason. Only authorized research team members will have access to data submitted through this project.
                    </p>
                    
                    <p>
                      No data will be shared beyond the immediate research team.
                    </p>
                    
                    <p>
                      We process your personal data on the basis of your consent, in accordance with Article 6(1)(a) of the GDPR, and (if applicable) for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes under Article 9(2)(j).
                    </p>
                    
                    <p>
                      Kungliga Tekniska högskolan (KTH) in Stockholm, Sweden, is the entity responsible for your personal information. When the project concludes, the data collected and generated within the project will be securely stored for archival purposes for at least 5 years.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Concerning Your Rights to Your Data</h3>
                    <p>
                      In line with EU data protection regulations (GDPR) and relevant national legislation, you have the right to:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Withdraw your consent without affecting the lawfulness of data processing already carried out before withdrawal.</li>
                      <li>Request access to your personal data.</li>
                      <li>Have your personal data corrected.</li>
                      <li>Have your personal data deleted.</li>
                      <li>Have the processing of your personal data restricted.</li>
                    </ul>
                    
                    <p>
                      Please note these rights can be limited under certain circumstances, such as confidentiality requirements or archival regulations.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Data Protection and Complaints</h3>
                    <p>
                      If you have questions about how your data is handled or wish to exercise any of your data protection rights, you may contact:
                    </p>
                    
                    <p>
                      KTH Data Protection Officer (DPO): <a href="mailto:dataskyddsombud@kth.se" className="text-primary hover:underline">dataskyddsombud@kth.se</a>
                    </p>
                    
                    <p>
                      You also have the right to lodge a complaint with the Swedish Privacy Protection Agency (<a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">imy.se</a>).
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Project Responsibility and Contact Information</h3>
                    <p>
                      Project Responsible (Researcher): <a href="mailto:gidiotis@kth.se" className="text-primary hover:underline">gidiotis@kth.se</a>
                    </p>
                    
                    <p>
                      Principal Research Supervisor: <a href="mailto:stefanhr@kth.se" className="text-primary hover:underline">stefanhr@kth.se</a>
                    </p>
                    
                    <p>
                      Mailing Address: BRINELLVÄGEN 68, 10044 STOCKHOLM, SWEDEN
                    </p>
                    
                    <p>
                      Note: Should you wish, you may request a summary of the study's findings once the research is completed by contacting the Project Responsible.
                    </p>
                  </div>
                </DialogDescription>
                <Button 
                  className="w-full" 
                  onClick={handleConsent}
                >
                  I consent to participating in this research
                </Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rule Panel with Wildcard */}
      <RulePanel 
        rules={rules}
        wordCount={wordCount}
        startTime={startTime}
        onRuleInteraction={onRuleInteraction}
        showWildcard={showWildcard}
        onWildcardAccept={handleAcceptWildcard}
        onWildcardDecline={handleDeclineWildcard}
      />
    </>
  );
} 