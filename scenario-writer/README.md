# Future Scenario Writer

A modern web application for writing speculative future scenarios with dynamic writing prompts.

## Features

- **Clean, Minimalist macOS-inspired UI**: Glass-like cards, neumorphic elements, and smooth animations
- **Real-time Writing Tracking**: Captures and logs all user interactions during writing
- **Dynamic Rule System**: Prompts that evolve as you write based on word count and time
- **Reflection Form**: Post-writing questionnaire to gather insights about the experience
- **Cloud Storage**: Firebase integration for data persistence
- **Offline Fallbacks**: Local storage and JSON export options

## Tech Stack

- React + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- Firebase Firestore for data storage
- React Hook Form + Zod for form validation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/components/ui`: Reusable UI components (Button, Card, Textarea, etc.)
- `/src/components`: Application-specific components (Editor, RulePanel, etc.)
- `/src/lib`: Utility functions, Firebase integration, and types

## Deployment

The application can be deployed to Vercel by connecting your GitHub repository. Make sure to set up the environment variables in your Vercel project settings.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore database
3. Add a web app to your project
4. Copy the Firebase configuration to your `.env.local` file

## Credits

Design inspired by Apple's macOS/iOS interface guidelines.

## License

MIT
