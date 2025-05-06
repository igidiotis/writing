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
}

export function SubmissionForm({ onSubmit, onCancel }: SubmissionFormProps) {
  const formStartTime = useRef(Date.now());
  
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
    const timeSpentMs = Date.now() - formStartTime.current;
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
      className="w-full max-w-2xl mx-auto"
    >
      <Card>
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
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-secondary/80 ${
                      errors.satisfaction ? "border-red-300" : "border-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={value}
                      {...register("satisfaction")}
                    />
                    <div className="text-2xl mb-1">
                      {value === "very-satisfied" && "😄"}
                      {value === "satisfied" && "🙂"}
                      {value === "neutral" && "😐"}
                      {value === "unsatisfied" && "🙁"}
                      {value === "very-unsatisfied" && "😞"}
                    </div>
                    <span className="text-xs">
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
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-secondary/80 ${
                      errors.challenge ? "border-red-300" : "border-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={value}
                      {...register("challenge")}
                    />
                    <span>
                      {value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </span>
                  </label>
                ))}
              </div>
              {errors.challenge && (
                <p className="text-sm text-red-500 mt-1">Please select an option</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Any other feedback? (Optional)
              </label>
              <textarea
                className="textarea w-full h-24"
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