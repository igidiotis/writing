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
            {/* Overall Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Overall Experience
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

            {/* Prompt Effectiveness */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Prompt Effectiveness
              </label>
              
              {/* Creativity */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Creativity</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.promptEffectiveness?.creativity ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clarity */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Clarity</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.promptEffectiveness?.clarity ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Timing</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["poor", "fair", "good", "excellent"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.promptEffectiveness?.timing ? "border-red-300" : "border-muted"}
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
              </div>

              {/* Relevance */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Relevance</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.promptEffectiveness?.relevance ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Flow Experience */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Flow Experience
              </label>
              
              {/* Immersion */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Immersion</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.flowExperience?.immersion ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Perception */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Time Perception</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["distorted", "somewhat-distorted", "normal", "lost-track"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.flowExperience?.timePerception ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Idea Generation */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Idea Generation</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["struggled", "occasional", "consistent", "abundant"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.flowExperience?.ideaGeneration ? "border-red-300" : "border-muted"}
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
              </div>
            </div>

            {/* Specific Prompt Impact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Specific Prompt Impact
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">
                    Which prompt was most helpful?
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Enter the prompt that helped most..."
                    {...register("specificPromptImpact.mostHelpful")}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Which prompt was least helpful?
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Enter the prompt that was least useful..."
                    {...register("specificPromptImpact.leastHelpful")}
                  />
                </div>
              </div>
            </div>

            {/* Cognitive/Emotional Response */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Cognitive/Emotional Response (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["inspired", "challenged", "frustrated", "engaged", "bored", 
                  "confident", "anxious", "focused", "distracted", "other"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.cognitiveEmotionalResponse ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      value={value}
                      {...register("cognitiveEmotionalResponse")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.cognitiveEmotionalResponse && (
                <p className="text-sm text-red-500 mt-1">Please select at least one option</p>
              )}
            </div>

            {/* Learning Value */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Learning Value
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["none", "minimal", "moderate", "significant", "transformative"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.learningValue && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Narrative Quality */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Narrative Quality
              </label>
              
              {/* Coherence */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Coherence</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.narrativeQuality?.coherence ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Originality */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Originality</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["low", "medium", "high", "very-high"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.narrativeQuality?.originality ? "border-red-300" : "border-muted"}
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
                        {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Development */}
              <div className="ml-4 space-y-2">
                <label className="block text-sm mb-1">Development</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["poor", "fair", "good", "excellent"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                      ${errors.narrativeQuality?.development ? "border-red-300" : "border-muted"}
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
              </div>
            </div>

            {/* Additional Feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Suggestions for prompt improvement, general thoughts..."
                {...register("additionalFeedback")}
              />
            </div>

            {/* Optional Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Your email address..."
                {...register("email")}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your data will remain anonymous in our research. We'll only use your email if you wish to participate in future online focus groups or receive our research findings. Providing your email is completely optional.
              </p>
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