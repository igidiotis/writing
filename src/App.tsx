import React, { useState } from 'react';
import { SubmissionForm } from './components/SubmissionForm';

// Define a type for the rules
interface Rule {
  id: string;
  content: string;
}

const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [content, setContent] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);

  // Cancel submission and go back to writing
  const handleCancelSubmit = () => {
    // Save content to localStorage before canceling to ensure it's not lost
    const key = `draft_${sessionId}`;
    localStorage.setItem(key, content);
    
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted with data:', formData);
    // Process the submitted data
    alert('Form submitted successfully!');
  };

  if (isSubmitting) {
    return (
      <SubmissionForm 
        onSubmit={handleFormSubmit} 
        onCancel={handleCancelSubmit}
        prompts={rules.map(rule => ({ id: rule.id, content: rule.content }))}
      />
    );
  }

  return (
    <div>
      {/* Render your existing components here */}
    </div>
  );
};

export default App; 