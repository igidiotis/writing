import { useEffect, useState, useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

interface EditorEvent {
  type: 'type' | 'delete' | 'paste' | 'pause' | 'resume';
  timestamp: number;
  content?: string;
  selection?: {
    start: number;
    end: number;
  };
}

export interface EditorProps {
  initialContent?: string;
  onContentChange: (content: string, wordCount: number) => void;
  onTrackEvent: (event: EditorEvent) => void;
}

export function Editor({ initialContent = "", onContentChange, onTrackEvent }: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // Initialize with initialContent when it changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);
  
  // Track word count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    onContentChange(content, words);
  }, [content, onContentChange]);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
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
        </CardContent>
      </Card>
    </motion.div>
  );
} 