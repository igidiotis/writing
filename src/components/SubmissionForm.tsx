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
  priorExposure: z.enum(["never-heard", "heard-never-read", "read-never-written", "read-and-written"]),
  motivation: z.enum(["professional-interest", "personal-curiosity", "other"]),
  biggestSurprise: z.string().min(0),
  realWorldApplication: z.string().min(0),
  interestInOthers: z.enum(["yes", "no"]),
  willingnessToShare: z.enum(["yes", "no"]),
  additionalFeedback: z.string().min(0).max(500),
  email: z.string().email().optional().or(z.literal("")),
  formCompletionTime: z.number().optional(),
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
    onSubmit({
      ...data,
      formCompletionTime: Date.now()
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
            {/* Ease of Use */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How easy was it to use the writing tool?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["very-difficult", "difficult", "neutral", "easy", "very-easy"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.easeOfUse && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Mental Effort */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How much mental effort did you expend to complete your story?
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
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.mentalEffort && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Interruptions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                During writing, how often did you have to pause and reread prompts or instructions?
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

            {/* Perceived Learning */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                To what extent did this exercise help you explore new perspectives on education?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["not-at-all", "a-little", "moderately", "a-great-deal"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.perceivedLearning && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Insightfulness */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How much insight into real-world educational challenges did crafting your story provide?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["none", "minimal", "significant", "transformative"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.insightfulness && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Plausibility */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How believable is the future scenario you described? (Note: a scenario does not need to be plausible in order to spark thinking)
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
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.plausibility && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Detail & Specificity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How richly did you describe technologies, policies, and contexts in your story?
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
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.detailSpecificity && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Prior Exposure */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Before today, how familiar were you with the concept of educational fiction?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "never-heard", label: "I'd never heard of it" },
                  { value: "heard-never-read", label: "I'd heard of it but never read or written it" },
                  { value: "read-never-written", label: "I'd read some but never written it" },
                  { value: "read-and-written", label: "I'd both read and written educational fiction" }
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">{label}</span>
                  </label>
                ))}
              </div>
              {errors.priorExposure && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                What was your primary motivation for writing a story today?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "professional-interest", label: "Professional interest" },
                  { value: "personal-curiosity", label: "Personal curiosity" },
                  { value: "other", label: "Other (please specify in comments)" }
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">{label}</span>
                  </label>
                ))}
              </div>
              {errors.motivation && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Biggest Surprise */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                What element of your own story surprised you the most?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("biggestSurprise")}
              />
            </div>

            {/* Real-World Application */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                How might the ideas in your story inform real educational policy or practice?
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Share your thoughts..."
                {...register("realWorldApplication")}
              />
            </div>

            {/* Interest in Others' Stories */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Would you be interested in reading future scenarios created by other participants?
              </label>
              <div className="flex gap-3">
                {["yes", "no"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.interestInOthers && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Willingness to Share */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Would you share your story with colleagues or students?
              </label>
              <div className="flex gap-3">
                {["yes", "no"].map((value) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300
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
                    <span className="pointer-events-none">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.willingnessToShare && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            {/* Additional Feedback */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Any other thoughts or feedback..."
                {...register("additionalFeedback")}
              />
            </div>

            {/* Email */}
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
              <p className="text-sm text-muted-foreground mt-1">
                Your email will only be used if you wish to participate in future research or receive updates about this project.
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