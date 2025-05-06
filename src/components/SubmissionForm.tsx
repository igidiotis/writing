import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

const formSchema = z.object({
  // Overall experience assessment
  overallExperience: z.enum(["very-negative", "negative", "neutral", "positive", "very-positive"]),
  
  // Prompt effectiveness measurements (1-5 scale)
  promptEffectiveness: z.object({
    creativity: z.number().min(1).max(5),
    clarity: z.number().min(1).max(5),
    timing: z.number().min(1).max(5),
    relevance: z.number().min(1).max(5),
  }),
  
  // Writer engagement and flow state
  flowExperience: z.object({
    immersion: z.number().min(1).max(5),
    timePerception: z.number().min(1).max(5),
    ideaGeneration: z.number().min(1).max(5),
  }),
  
  // Specific prompt impact
  mostInfluentialPrompt: z.string(),
  leastHelpfulPrompt: z.string(),
  
  // Cognitive and emotional aspects
  emotionalResponse: z.enum(["inspired", "challenged", "frustrated", "surprised", "confused", "enlightened", "other"]),
  emotionalResponseOther: z.string().optional(),
  
  // Learning and educational value
  learningValue: z.enum(["none", "slight", "moderate", "significant", "transformative"]),
  
  // Narrative quality self-assessment
  narrativeQuality: z.object({
    coherence: z.number().min(1).max(5),
    originality: z.number().min(1).max(5),
    development: z.number().min(1).max(5),
  }),
  
  // Detailed feedback
  promptSuggestions: z.string().min(0).max(500),
  generalFeedback: z.string().min(0).max(500),
  
  // Optional contact information
  contactEmail: z.string().email().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  prompts: Array<{id: string, content: string}>;
}

export function SubmissionForm({ onSubmit, onCancel, prompts }: SubmissionFormProps) {
  const formStartTime = useRef(Date.now());
  const [emotionalResponseIsOther, setEmotionalResponseIsOther] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overallExperience: undefined,
      promptEffectiveness: {
        creativity: 3,
        clarity: 3, 
        timing: 3,
        relevance: 3,
      },
      flowExperience: {
        immersion: 3,
        timePerception: 3,
        ideaGeneration: 3,
      },
      mostInfluentialPrompt: "",
      leastHelpfulPrompt: "",
      emotionalResponse: undefined,
      emotionalResponseOther: "",
      learningValue: undefined,
      narrativeQuality: {
        coherence: 3,
        originality: 3,
        development: 3,
      },
      promptSuggestions: "",
      generalFeedback: "",
      contactEmail: "",
    },
  });

  // Watch emotional response to toggle "other" text field
  const emotionalResponseValue = watch("emotionalResponse");
  
  // Update the "other" flag when the selection changes
  React.useEffect(() => {
    setEmotionalResponseIsOther(emotionalResponseValue === "other");
  }, [emotionalResponseValue]);

  const onFormSubmit = (data: FormValues) => {
    const timeSpentMs = Date.now() - formStartTime.current;
    onSubmit({
      ...data,
      // Include time spent on feedback form
      _meta: {
        feedbackTimeMs: timeSpentMs
      }
    });
  };

  // Helper function for slider labels
  const getSliderLabel = (value: number, labels: string[]) => {
    return labels[value - 1] || "";
  };
  
  // Slider components with consistent styling
  const RatingSlider = ({ 
    name, 
    title, 
    labels,
    register,
    setValue,
    value
  }: { 
    name: string; 
    title: string; 
    labels: string[];
    register: any;
    setValue: any;
    value: number;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{title}</label>
        <span className="text-sm font-medium">{value}/5: {getSliderLabel(value, labels)}</span>
      </div>
      <Slider
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={(val) => setValue(name, val[0])}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto relative z-10"
    >
      <Card className="relative">
        <CardHeader>
          <CardTitle>Research Feedback: Your Writing Experience</CardTitle>
          <p className="text-sm text-muted-foreground">Your feedback helps us understand the impact of dynamic prompts on speculative writing</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-8">
            {/* Overall Experience */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Overall Experience</h3>
              <label className="block text-sm font-medium mb-2">
                How would you describe your overall writing experience?
              </label>
              <div className="flex flex-wrap gap-3">
                {["very-negative", "negative", "neutral", "positive", "very-positive"].map((value) => (
                  <label 
                    key={value} 
                    className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                    ${errors.overallExperience ? "border-red-300" : "border-muted"}
                    hover:bg-gradient-to-br hover:from-secondary/40 hover:to-secondary/60 hover:border-primary/30
                    [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/20 [&:has(input:checked)]:to-primary/30 
                    [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-sm`}
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
              <h3 className="text-lg font-medium">Prompt Effectiveness</h3>
              <p className="text-sm text-muted-foreground">Rate how the dynamic prompts influenced your writing process</p>
              
              <RatingSlider
                name="promptEffectiveness.creativity"
                title="Creativity Enhancement"
                labels={["Not at all", "Slightly", "Moderately", "Significantly", "Extremely"]}
                register={register}
                setValue={setValue}
                value={watch("promptEffectiveness.creativity")}
              />
              
              <RatingSlider
                name="promptEffectiveness.clarity"
                title="Clarity of Instructions"
                labels={["Very unclear", "Somewhat unclear", "Neutral", "Clear", "Extremely clear"]}
                register={register}
                setValue={setValue}
                value={watch("promptEffectiveness.clarity")}
              />
              
              <RatingSlider
                name="promptEffectiveness.timing"
                title="Timing of Prompts"
                labels={["Too early/late", "Slightly off", "Adequate", "Good", "Perfect"]}
                register={register}
                setValue={setValue}
                value={watch("promptEffectiveness.timing")}
              />
              
              <RatingSlider
                name="promptEffectiveness.relevance"
                title="Relevance to Education Future Theme"
                labels={["Not relevant", "Barely relevant", "Somewhat relevant", "Relevant", "Highly relevant"]}
                register={register}
                setValue={setValue}
                value={watch("promptEffectiveness.relevance")}
              />
            </div>

            {/* Flow State Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Flow State Experience</h3>
              <p className="text-sm text-muted-foreground">Assess your creative "flow" during the writing process</p>
              
              <RatingSlider
                name="flowExperience.immersion"
                title="Immersion in the Writing Process"
                labels={["Distracted", "Occasionally focused", "Moderately immersed", "Deeply immersed", "Completely absorbed"]}
                register={register}
                setValue={setValue}
                value={watch("flowExperience.immersion")}
              />
              
              <RatingSlider
                name="flowExperience.timePerception"
                title="Time Perception"
                labels={["Time dragged", "Noticed time passing", "Normal", "Time passed quickly", "Lost track of time"]}
                register={register}
                setValue={setValue}
                value={watch("flowExperience.timePerception")}
              />
              
              <RatingSlider
                name="flowExperience.ideaGeneration"
                title="Idea Generation"
                labels={["Struggled for ideas", "Some difficulty", "Moderate flow", "Ideas came easily", "Ideas flowed effortlessly"]}
                register={register}
                setValue={setValue}
                value={watch("flowExperience.ideaGeneration")}
              />
            </div>

            {/* Prompt Impact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Specific Prompt Impact</h3>
              <p className="text-sm text-muted-foreground">Identify which prompts had the greatest impact on your writing</p>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Which prompt most influenced or enhanced your writing?
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  {...register("mostInfluentialPrompt")}
                >
                  <option value="">-- Select a prompt --</option>
                  {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>
                      {prompt.content}
                    </option>
                  ))}
                </select>
                {errors.mostInfluentialPrompt && (
                  <p className="text-sm text-red-500 mt-1">Please select a prompt</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Which prompt was least helpful or most challenging to incorporate?
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  {...register("leastHelpfulPrompt")}
                >
                  <option value="">-- Select a prompt --</option>
                  {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>
                      {prompt.content}
                    </option>
                  ))}
                </select>
                {errors.leastHelpfulPrompt && (
                  <p className="text-sm text-red-500 mt-1">Please select a prompt</p>
                )}
              </div>
            </div>

            {/* Cognitive and Emotional Response */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cognitive and Emotional Response</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  What was your primary emotional response to the writing experience?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["inspired", "challenged", "frustrated", "surprised", "confused", "enlightened", "other"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                      ${errors.emotionalResponse ? "border-red-300" : "border-muted"}
                      hover:bg-gradient-to-br hover:from-secondary/40 hover:to-secondary/60 hover:border-primary/30
                      [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/20 [&:has(input:checked)]:to-primary/30 
                      [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-sm`}
                    >
                      <input
                        type="radio"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        value={value}
                        {...register("emotionalResponse")}
                      />
                      <span className="pointer-events-none capitalize">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.emotionalResponse && (
                  <p className="text-sm text-red-500 mt-1">Please select an option</p>
                )}
              </div>
              
              {emotionalResponseIsOther && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">
                    Please specify your emotional response:
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Describe your emotional response..."
                    {...register("emotionalResponseOther")}
                  />
                </div>
              )}
            </div>

            {/* Educational Value */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Learning and Educational Value</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  How much did this experience contribute to your thinking about the future of education?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["none", "slight", "moderate", "significant", "transformative"].map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                      ${errors.learningValue ? "border-red-300" : "border-muted"}
                      hover:bg-gradient-to-br hover:from-secondary/40 hover:to-secondary/60 hover:border-primary/30
                      [&:has(input:checked)]:bg-gradient-to-br [&:has(input:checked)]:from-primary/20 [&:has(input:checked)]:to-primary/30 
                      [&:has(input:checked)]:border-primary [&:has(input:checked)]:shadow-sm`}
                    >
                      <input
                        type="radio"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        value={value}
                        {...register("learningValue")}
                      />
                      <span className="pointer-events-none capitalize text-center">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.learningValue && (
                  <p className="text-sm text-red-500 mt-1">Please select an option</p>
                )}
              </div>
            </div>

            {/* Contact for Research (Optional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Further Research Participation (Optional)</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  placeholder="your.email@example.com"
                  {...register("contactEmail")}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your data will remain anonymous in our research. We'll only use your email if you wish to participate in future online focus groups or receive our research findings. Providing your email is completely optional.
                </p>
              </div>
            </div>

            {/* Narrative Quality */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Narrative Quality Self-Assessment</h3>
              <p className="text-sm text-muted-foreground">Evaluate the quality of the narrative you created</p>
              
              <RatingSlider
                name="narrativeQuality.coherence"
                title="Narrative Coherence"
                labels={["Disjointed", "Somewhat connected", "Coherent", "Well-structured", "Masterfully coherent"]}
                register={register}
                setValue={setValue}
                value={watch("narrativeQuality.coherence")}
              />
              
              <RatingSlider
                name="narrativeQuality.originality"
                title="Originality of Ideas"
                labels={["Conventional", "Somewhat novel", "Moderately original", "Highly original", "Groundbreaking"]}
                register={register}
                setValue={setValue}
                value={watch("narrativeQuality.originality")}
              />
              
              <RatingSlider
                name="narrativeQuality.development"
                title="Character/Concept Development"
                labels={["Undeveloped", "Minimally developed", "Adequately developed", "Well-developed", "Exceptionally developed"]}
                register={register}
                setValue={setValue}
                value={watch("narrativeQuality.development")}
              />
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Feedback</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  What suggestions do you have for improving the dynamic prompts?
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  placeholder="Suggest improvements to the prompts..."
                  {...register("promptSuggestions")}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Any other thoughts about your experience?
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  placeholder="Share additional thoughts..."
                  {...register("generalFeedback")}
                />
              </div>
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