export interface WildcardStoryOpener {
  id: string;
  text: string;
}

// Array of wildcard story openers related to future education
export const wildcardStoryOpeners: WildcardStoryOpener[] = [
  {
    "id": "extinction-era",
    "text": "The university farm's irrigation system hummed with recycled water as I logged into another global crisis response meeting. My climate migration research had become essential curriculum in the survival education networks spanning what used to be national borders."
  },
  {
    "id": "ai-academy",
    "text": " No one questioned Maya’s top ranking; after all, the algorithm had calculated it from five years of neurodata and social behavior logs, but she still missed the satisfaction of writing her own ideas down."
  },
  {
    "id": "universal-university",
    "text": " Lina didn’t think much of starting her degree from a fishing village in the Philippines, but when her VR lecture began with a simulated walk through ancient Athens, she realized the global classroom had truly arrived."
  },
  {
    "id": "extreme-unbundling",
    "text": " At 17, Ari had already completed 43 micro-courses, but still couldn’t explain to her grandfather what it all added up to—only that her reputation score kept climbing."
  },
  {
    "id": "justice-driven",
    "text": "Amira’s education began not in a classroom but in a city council meeting, where she helped redesign a local housing project as part of her university’s justice and governance challenge."
  },
  {
    "id": "ivory-tower",
    "text": "Elias passed the national screening exam with the highest score in a decade, earning a place at the gated Nova Collegium—one of the last true universities, reserved for society’s chosen few."
  },
  {
    "id": "ennui",
    "text": "With nothing left to automate, humans turned inward, and so Jonah enrolled in his tenth philosophy program- not to find a job, but to find meaning."
  },
  {
    "id": "enhancement",
    "text": "Every morning before class, Leila clipped on her neurostim headset and swallowed two focus pills— because in a campus built on metrics, natural thinking was a liability."
  }
];

// Function to get a random wildcard story opener
export function getRandomWildcardStoryOpener(): WildcardStoryOpener {
  const randomIndex = Math.floor(Math.random() * wildcardStoryOpeners.length);
  return wildcardStoryOpeners[randomIndex];
} 

