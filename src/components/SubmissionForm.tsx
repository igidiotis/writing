import * as React from "react";
import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

const formSchema = z.object({
  easeOfUse: z.enum(["very-difficult", "difficult", "neutral", "easy", "very-easy"]),
  mentalEffort: z.enum(["low", "medium", "high", "very-high"]),
  interruptions: z.enum(["never", "occasionally", "often", "always"]),
  perceivedLearning: z.enum(["not-at-all", "a-little", "moderately", "a-great-deal"]),
  insightfulness: z.enum(["none", "minimal", "significant", "transformative"]),
  plausibility: z.enum(["not-at-all-plausible", "somewhat-plausible", "quite-plausible", "highly-plausible"]),
  detailSpecificity: z.enum(["very-sparse", "some-detail", "rich-detail", "extremely-rich-detail"]),
  priorExposure: z.enum([
    "never-heard",
    "heard-never-read",
    "read-never-written",
    "read-and-written"
  ]),
  motivation: z.enum([
    "professional-interest",
    "academic-requirement",
    "personal-curiosity",
    "other"
  ]),
  biggestSurprise: z.string().min(0),
  realWorldApplication: z.string().min(0),
  interestInOthers: z.enum(["yes", "no"]),
  willingnessToShare: z.enum(["yes", "no"]),
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
      easeOfUse: undefined,
      mentalEffort: undefined,
      interruptions: undefined,
      perceivedLearning: undefined,
      insightfulness: undefined,
      plausibility: undefined,
      detailSpecificity: undefined,
      priorExposure: undefined,
      motivation: undefined,
      biggestSurprise: "",
      realWorldApplication: "",
      interestInOthers: undefined,
      willingnessToShare: undefined,
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
                How easy was it to use the tool?
              </label>
              <div className="flex flex-wrap gap-3">
                {["very-difficult", "difficult", "neutral", "easy", "very-easy"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.easeOfUse ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("easeOfUse")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "very-easy" && "😄"}
                      {value === "easy" && "🙂"}
                      {value === "neutral" && "😐"}
                      {value === "difficult" && "🙁"}
                      {value === "very-difficult" && "😞"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.easeOfUse && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How much mental effort did you put into using the tool?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["low", "medium", "high", "very-high"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.mentalEffort ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("mentalEffort")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.mentalEffort && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How often were you interrupted while using the tool?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["never", "occasionally", "often", "always"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.interruptions ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("interruptions")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.interruptions && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How much did you learn from using the tool?
              </label>
              <div className="flex flex-wrap gap-3">
                {["not-at-all", "a-little", "moderately", "a-great-deal"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.perceivedLearning ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("perceivedLearning")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "a-great-deal" && "😄"}
                      {value === "moderately" && "🙂"}
                      {value === "a-little" && "😐"}
                      {value === "not-at-all" && "🙁"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.perceivedLearning && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How insightful was the experience?
              </label>
              <div className="flex flex-wrap gap-3">
                {["none", "minimal", "significant", "transformative"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.insightfulness ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("insightfulness")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "transformative" && "😄"}
                      {value === "significant" && "🙂"}
                      {value === "minimal" && "🙁"}
                      {value === "none" && "😞"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.insightfulness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How plausible was the scenario?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["not-at-all-plausible", "somewhat-plausible", "quite-plausible", "highly-plausible"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.plausibility ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("plausibility")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.plausibility && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How detailed was the scenario?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["very-sparse", "some-detail", "rich-detail", "extremely-rich-detail"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.detailSpecificity ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("detailSpecificity")}
                    />
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.detailSpecificity && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How much prior exposure did you have to the topic?
              </label>
              <div className="flex flex-wrap gap-3">
                {["never-heard", "heard-never-read", "read-never-written", "read-and-written"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.priorExposure ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("priorExposure")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "read-and-written" && "😄"}
                      {value === "read-never-written" && "🙂"}
                      {value === "heard-never-read" && "😐"}
                      {value === "never-heard" && "🙁"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.priorExposure && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                What motivated you to use the tool?
              </label>
              <div className="flex flex-wrap gap-3">
                {["professional-interest", "academic-requirement", "personal-curiosity", "other"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.motivation ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("motivation")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "professional-interest" && "😄"}
                      {value === "academic-requirement" && "🙂"}
                      {value === "personal-curiosity" && "😄"}
                      {value === "other" && "🤔"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.motivation && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                What was the biggest surprise in the experience?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("biggestSurprise")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How would you apply this experience in the real world?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("realWorldApplication")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Are you interested in sharing this experience with others?
              </label>
              <div className="flex flex-wrap gap-3">
                {["yes", "no"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.interestInOthers ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("interestInOthers")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "yes" && "😄"}
                      {value === "no" && "🙁"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.interestInOthers && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Are you willing to share this experience with others?
              </label>
              <div className="flex flex-wrap gap-3">
                {["yes", "no"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
                    ${errors.willingnessToShare ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/40 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/10 [&:has(input:checked)]:to-primary/20 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-md [&:has(input:checked)]:scale-105`}
                  >
                    <input
                      type="radio"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={value}
                      {...register("willingnessToShare")}
                    />
                    <div className="text-2xl mb-1 pointer-events-none">
                      {value === "yes" && "😄"}
                      {value === "no" && "🙁"}
                    </div>
                    <span className="text-xs pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.willingnessToShare && (
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