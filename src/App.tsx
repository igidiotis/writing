import React, { useState } from 'react';
import SubmissionForm from './SubmissionForm';

const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [content, setContent] = useState('');
  const [rules, setRules] = useState([]);

  // Cancel submission and go back to writing
  const handleCancelSubmit = () => {
    // Save content to localStorage before canceling to ensure it's not lost
    const key = `draft_${sessionId}`;
    localStorage.setItem(key, content);
    
    setIsSubmitting(false);
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