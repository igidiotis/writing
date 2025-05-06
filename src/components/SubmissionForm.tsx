import * as React from "react";
import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

const formSchema = z.object({
  overallExperience: z.enum(["very-negative", "negative", "neutral", "positive", "very-positive"]),
  promptEffectiveness: z.object({
    creativity: z.enum(["low", "medium", "high", "very-high"]),
    clarity: z.enum(["low", "medium", "high", "very-high"]),
    timing: z.enum(["poor", "fair", "good", "excellent"]),
    relevance: z.enum(["low", "medium", "high", "very-high"]),
  }),
  flowExperience: z.object({
    immersion: z.enum(["low", "medium", "high", "very-high"]),
    timePerception: z.enum(["distorted", "somewhat-distorted", "normal", "lost-track"]),
    ideaGeneration: z.enum(["struggled", "occasional", "consistent", "abundant"]),
  }),
  specificPromptImpact: z.object({
    mostHelpful: z.string().min(0),
    leastHelpful: z.string().min(0),
  }),
  cognitiveEmotionalResponse: z.array(z.enum([
    "inspired", "challenged", "frustrated", "engaged", "bored", 
    "confident", "anxious", "focused", "distracted", "other"
  ])).min(1),
  learningValue: z.enum(["none", "minimal", "moderate", "significant", "transformative"]),
  narrativeQuality: z.object({
    coherence: z.enum(["low", "medium", "high", "very-high"]),
    originality: z.enum(["low", "medium", "high", "very-high"]),
    development: z.enum(["poor", "fair", "good", "excellent"]),
  }),
  additionalFeedback: z.string().min(0).max(500),
  email: z.string().email().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export function SubmissionForm({ onSubmit, onCancel }: SubmissionFormProps) {
  const formStartTime = useRef(Date.now());
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overallExperience: undefined,
      promptEffectiveness: {
        creativity: undefined,
        clarity: undefined,
        timing: undefined,
        relevance: undefined,
      },
      flowExperience: {
        immersion: undefined,
        timePerception: undefined,
        ideaGeneration: undefined,
      },
      specificPromptImpact: {
        mostHelpful: "",
        leastHelpful: "",
      },
      cognitiveEmotionalResponse: [],
      learningValue: undefined,
      narrativeQuality: {
        coherence: undefined,
        originality: undefined,
        development: undefined,
      },
      additionalFeedback: "",
      email: "",
    },
  });

  const onFormSubmit = (data: FormValues) => {
    // Add timing data
    const _timeSpentMs = Date.now() - formStartTime.current;
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
                {["very-negative", "negative", "neutral", "positive", "very-positive"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.overallExperience ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("overallExperience")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "very-positive" && "😄"}
                      {value === "positive" && "🙂"}
                      {value === "neutral" && "😐"}
                      {value === "negative" && "🙁"}
                      {value === "very-negative" && "😞"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.overallExperience && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How effective were the prompts?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.promptEffectiveness ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("promptEffectiveness.creativity")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.promptEffectiveness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How clear were the prompts?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.promptEffectiveness ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("promptEffectiveness.clarity")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.promptEffectiveness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How timely were the prompts?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["poor", "fair", "good", "excellent"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.promptEffectiveness ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("promptEffectiveness.timing")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.promptEffectiveness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How relevant were the prompts?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.promptEffectiveness ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("promptEffectiveness.relevance")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.promptEffectiveness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How immersive was the writing experience?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.flowExperience ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("flowExperience.immersion")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.flowExperience && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How distorted was your perception of time?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["distorted", "somewhat-distorted", "normal", "lost-track"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.flowExperience ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("flowExperience.timePerception")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.flowExperience && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How consistent was your idea generation?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["struggled", "occasional", "consistent", "abundant"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.flowExperience ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("flowExperience.ideaGeneration")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.flowExperience && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Which prompt was most helpful?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("specificPromptImpact.mostHelpful")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Which prompt was least helpful?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("specificPromptImpact.leastHelpful")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How did the prompts affect your cognitive and emotional state?
              </label>
              <div className="flex flex-wrap gap-3">
                {["inspired", "challenged", "frustrated", "engaged", "bored", 
                  "confident", "anxious", "focused", "distracted", "other"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.cognitiveEmotionalResponse ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="checkbox"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("cognitiveEmotionalResponse")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "inspired" && "😄"}
                      {value === "challenged" && "🙂"}
                      {value === "frustrated" && "🙁"}
                      {value === "engaged" && "😄"}
                      {value === "bored" && "😞"}
                      {value === "confident" && "😄"}
                      {value === "anxious" && "😞"}
                      {value === "focused" && "😄"}
                      {value === "distracted" && "😞"}
                      {value === "other" && "🤔"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.cognitiveEmotionalResponse && (
                <p className="text-sm text-red-500 mt-1">Please select at least one option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                What was the learning value of the experience?
              </label>
              <div className="flex flex-wrap gap-3">
                {["none", "minimal", "moderate", "significant", "transformative"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.learningValue ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("learningValue")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "transformative" && "😄"}
                      {value === "significant" && "🙂"}
                      {value === "moderate" && "😐"}
                      {value === "minimal" && "🙁"}
                      {value === "none" && "😞"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.learningValue && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How coherent was the narrative?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.narrativeQuality ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("narrativeQuality.coherence")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.narrativeQuality && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How original was the narrative?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.narrativeQuality ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("narrativeQuality.originality")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.narrativeQuality && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How developed was the narrative?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["poor", "fair", "good", "excellent"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.narrativeQuality ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("narrativeQuality.development")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.narrativeQuality && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Any other feedback? (Optional)
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("additionalFeedback")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="name@example.com"
                {...register("email")}
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