import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface WildcardPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function WildcardPrompt({ onAccept, onDecline }: WildcardPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="neomorphic" className="overflow-hidden border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Wildcard
                </span>
              </div>
              <p className="mb-2 text-sm font-medium">
                Would you like a wildcard opening to your story to inspire you to begin?
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={onAccept}
              >
                Yes
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onDecline}
              >
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 