import * as React from "react";
import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

const formSchema = z.object({
  satisfaction: z.enum(["very-satisfied", "satisfied", "neutral", "unsatisfied", "very-unsatisfied"]),
  challenge: z.enum(["too-easy", "just-right", "challenging", "too-difficult"]),
  feedback: z.string().min(0).max(500),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  prompts?: Array<{id: string, content: string}>;
}

export function SubmissionForm({ onSubmit, onCancel, prompts = [] }: SubmissionFormProps) {
  const formStartTime = useRef(Date.now());
  
  const hasPrompts = prompts.length > 0;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satisfaction: undefined,
      challenge: undefined,
      feedback: "",
    },
  });

  const onFormSubmit = (data: FormValues) => {
    // Add timing data
    const _timeSpentMs = Date.now() - formStartTime.current;
    // Add prompt count to the submission data
    const promptCount = prompts.length;
    onSubmit({
      ...data,
      // Attach any additional metadata about form completion timing if needed
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto relative z-10"
    >
      <Card className="relative">
        <CardHeader>
          <CardTitle>Reflect on Your Writing Experience</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How satisfied are you with your scenario?
              </label>
              <div className="flex flex-wrap gap-3">
                {["very-unsatisfied", "unsatisfied", "neutral", "satisfied", "very-satisfied"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.satisfaction ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("satisfaction")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "very-satisfied" && "😄"}
                      {value === "satisfied" && "🙂"}
                      {value === "neutral" && "😐"}
                      {value === "unsatisfied" && "🙁"}
                      {value === "very-unsatisfied" && "😞"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.satisfaction && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How challenging were the prompts?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["too-easy", "just-right", "challenging", "too-difficult"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.challenge ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("challenge")}
                    />
                    <span className="pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.challenge && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Only show prompts section if prompts exist */}
            {hasPrompts && (
              <div className="space-y-2 p-3 bg-secondary/10 rounded-lg">
                <h3 className="text-sm font-medium">Prompts you responded to:</h3>
                <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                  {prompts.map(prompt => (
                    <li key={prompt.id}>{prompt.content}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Any other feedback? (Optional)
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("feedback")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
            >
              Back to Writing
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}