export interface WildcardStoryOpener {
  id: string;
  text: string;
}

// Array of wildcard story openers related to future education
export const wildcardStoryOpeners: WildcardStoryOpener[] = [
  {
    id: "edu1",
    text: "The holographic classroom dissolved around me as I removed my neural interface. Ten years into the new education system, I still found myself nostalgic for physical textbooks and face-to-face discussions."
  },
  {
    id: "edu2",
    text: "Every student's personalized AI tutor spoke in a voice designed specifically for their learning style. Mine had a calm, methodical tone that contrasted sharply with the chaos of the learning hub I had just entered."
  },
  {
    id: "edu3",
    text: "The global education network crashed for the third time this week, sending millions of students back to emergency offline modules. Some children had never experienced education without constant connectivity."
  },
  {
    id: "edu4",
    text: "The Ministry of Adaptive Learning had just announced another curriculum overhaul—the fourth in as many years. As an educator, I wondered if we were finally getting closer to a system that truly served all students."
  },
  {
    id: "edu5",
    text: "My graduation certificate contained no grades, only a detailed neural map of my competencies and a personalized learning trajectory. Traditional universities had become obsolete five years ago."
  }
];

// Function to get a random wildcard story opener
export function getRandomWildcardStoryOpener(): WildcardStoryOpener {
  const randomIndex = Math.floor(Math.random() * wildcardStoryOpeners.length);
  return wildcardStoryOpeners[randomIndex];
} 