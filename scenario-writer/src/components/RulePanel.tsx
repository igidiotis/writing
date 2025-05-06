import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export interface Rule {
  id: string;
  content: string;
  type: 'mandatory' | 'optional';
  condition: {
    type: 'wordCount' | 'time' | 'manual';
    value: number; // word count threshold or time in seconds
  };
  status: 'inactive' | 'active' | 'completed' | 'skipped';
  completedAt?: number;
  skippedAt?: number;
}

interface RulePanelProps {
  rules: Rule[];
  wordCount: number;
  startTime: number;
  onRuleInteraction: (ruleId: string, action: 'complete' | 'skip') => void;
}

export function RulePanel({ rules, wordCount, startTime, onRuleInteraction }: RulePanelProps) {
  const [activeRules, setActiveRules] = useState<Rule[]>([]);
  
  // Update active rules based on conditions
  useEffect(() => {
    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;
    
    const updatedRules = rules.map(rule => {
      // Skip rules that are already completed or skipped
      if (rule.status === 'completed' || rule.status === 'skipped') {
        return rule;
      }
      
      // Check if rule should be activated
      let shouldActivate = false;
      
      if (rule.condition.type === 'wordCount' && wordCount >= rule.condition.value) {
        shouldActivate = true;
      } else if (rule.condition.type === 'time' && elapsedSeconds >= rule.condition.value) {
        shouldActivate = true;
      }
      
      return {
        ...rule,
        status: shouldActivate ? 'active' as const : 'inactive' as const
      };
    });
    
    setActiveRules(updatedRules.filter(rule => rule.status === 'active'));
  }, [rules, wordCount, startTime]);
  
  const handleComplete = (ruleId: string) => {
    onRuleInteraction(ruleId, 'complete');
  };
  
  const handleSkip = (ruleId: string) => {
    onRuleInteraction(ruleId, 'skip');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Writing Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          {activeRules.length === 0 ? (
            <p className="text-center text-muted-foreground italic">
              Keep writing! Prompts will appear as you progress...
            </p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {activeRules.map(rule => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card variant="neomorphic" className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${
                                rule.type === 'mandatory' ? 'bg-primary' : 'bg-muted'
                              }`} />
                              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                {rule.type === 'mandatory' ? 'Required' : 'Optional'}
                              </span>
                            </div>
                            <p>{rule.content}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleComplete(rule.id)}
                            >
                              Complete
                            </Button>
                            {rule.type === 'optional' && (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleSkip(rule.id)}
                              >
                                Skip
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 