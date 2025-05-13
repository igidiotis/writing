import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const interests = [
  "Aesthetics and Good Design",
  "Education",
  "Energy",
  "Freedom and Independence",
  "Community and Family",
  "Justice, Equality, and Equity",
  "Health",
  "Industry and Economy",
  "Mobility",
  "Safety and Security",
  "Environment and Climate",
  "Living Space"
];

const formSchema = z.object({
  workplace: z.string().min(1, "Please tell us where you work"),
  field: z.string().min(1, "Please tell us your field"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckInFormProps {
  onSubmit: (data: FormValues) => void;
}

export function CheckInForm({ onSubmit }: CheckInFormProps) {
  const [consentOpen, setConsentOpen] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workplace: "",
      field: "",
      interests: [],
    },
  });
  
  const selectedInterests = watch("interests");

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    const currentInterests = [...selectedInterests];
    
    if (checked) {
      setValue("interests", [...currentInterests, interest], { shouldValidate: true });
    } else {
      setValue(
        "interests",
        currentInterests.filter((item) => item !== interest),
        { shouldValidate: true }
      );
    }
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
          <CardTitle>Before We Begin</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-6">
            <div className="mb-3 text-center">
              <button 
                type="button"
                onClick={() => setConsentOpen(true)}
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Read more about consenting to participate in this research project
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="text-lg">
                I work for <Input 
                  {...register("workplace")} 
                  placeholder="the type of your workplace" 
                  className="inline-block w-64 mx-2"
                /> in the field of <Input 
                  {...register("field")} 
                  placeholder="your field" 
                  className="inline-block w-64 mx-2"
                />.
              </div>
              {errors.workplace && (
                <p className="text-sm text-red-500">{errors.workplace.message}</p>
              )}
              {errors.field && (
                <p className="text-sm text-red-500">{errors.field.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-lg">These aspects are important to me today:</Label>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-start space-x-2">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleInterestChange(interest, checked);
                        }
                      }}
                    />
                    <Label
                      htmlFor={interest}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-500">{errors.interests.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" size="lg">
              Begin Writing
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Consent Dialog */}
      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Research Participation Consent</DialogTitle>
          </DialogHeader>
          <DialogDescription className="max-h-[70vh] overflow-y-auto py-4">
            <div className="space-y-4 text-left">
            <p>
                      The purpose of this research project is to examine the potential of using speculative storywriting to explore the long-term impact of artificial intelligence (AI) on future education contexts. Writing speculative stories helps us build alternative, (un)wanted education spaces or scenarios, offering insights that can inform present decisions and outlooks.
                    </p>
                    
                    <p>
                      You are invited to participate by contributing your own speculative story. Your participation will help us better understand various visions of future learning environments shaped by AI.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Project Methodology and Specifications</h3>
                    <p>
                      As part of this project, you will use a digital interactive scenario generator tool. Upon agreeing to participate, you will be prompted to generate four distinct elements from a digital card deck. These elements form the basis for a speculative story, which you will write in the space provided within the tool. You may also find prompts, examples, and guiding questions to support your writing process.
                    </p>
                    
                    <p>
                      After completing your story, you will have the option to "submit" it to a connected form. This form will also include fields for demographic information, such as your occupation, subject field, and country, as well as an optional email address field.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Information Collection</h3>
                    <p>
                      Within this research project, we will collect and register the following:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Written/generated story: The story you create is stored separately and will not be connected to any identifying personal information (unless you choose to provide such information in the form).</li>
                      <li>Email address (optional): Only if you choose to provide it.</li>
                      <li>Occupation, subject field, and country: General demographic information that helps us gauge the audience using the tool.</li>
                    </ul>
                    
                    <p>
                      The submitted stories and your feedback will be analyzed as part of the research project. Portions of these stories may also be cited or discussed in research publications and presentations, or used in subsequent focus groups or workshop discussions. However, no identifying information will be included in such discussions.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Voluntary Participation and Data Protection</h3>
                    <p>
                      Your participation in this study is completely voluntary. You may discontinue your participation at any point without providing a reason. Only authorized research team members will have access to data submitted through this project.
                    </p>
                    
                    <p>
                      No data will be shared beyond the immediate research team.
                    </p>
                    
                    <p>
                      We process your personal data on the basis of your consent, in accordance with Article 6(1)(a) of the GDPR, and (if applicable) for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes under Article 9(2)(j).
                    </p>
                    
                    <p>
                      Kungliga Tekniska högskolan (KTH) in Stockholm, Sweden, is the entity responsible for your personal information. When the project concludes, the data collected and generated within the project will be securely stored for archival purposes for at least 5 years.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Concerning Your Rights to Your Data</h3>
                    <p>
                      In line with EU data protection regulations (GDPR) and relevant national legislation, you have the right to:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Withdraw your consent without affecting the lawfulness of data processing already carried out before withdrawal.</li>
                      <li>Request access to your personal data.</li>
                      <li>Have your personal data corrected.</li>
                      <li>Have your personal data deleted.</li>
                      <li>Have the processing of your personal data restricted.</li>
                    </ul>
                    
                    <p>
                      Please note these rights can be limited under certain circumstances, such as confidentiality requirements or archival regulations.
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Data Protection and Complaints</h3>
                    <p>
                      If you have questions about how your data is handled or wish to exercise any of your data protection rights, you may contact:
                    </p>
                    
                    <p>
                      KTH Data Protection Officer (DPO): <a href="mailto:dataskyddsombud@kth.se" className="text-primary hover:underline">dataskyddsombud@kth.se</a>
                    </p>
                    
                    <p>
                      You also have the right to lodge a complaint with the Swedish Privacy Protection Agency (<a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">imy.se</a>).
                    </p>
                    
                    <h3 className="font-bold text-base mt-4">Project Responsibility and Contact Information</h3>
                    <p>
                      Project Responsible (Researcher): <a href="mailto:gidiotis@kth.se" className="text-primary hover:underline">gidiotis@kth.se</a>
                    </p>
                    
                    <p>
                      Principal Research Supervisor: <a href="mailto:stefanhr@kth.se" className="text-primary hover:underline">stefanhr@kth.se</a>
                    </p>
                    
                    <p>
                      Mailing Address: BRINELLVÄGEN 68, 10044 STOCKHOLM, SWEDEN
                    </p>
                    
                    <p>
                      Note: Should you wish, you may request a summary of the study's findings once the research is completed by contacting the Project Responsible.
                    </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 