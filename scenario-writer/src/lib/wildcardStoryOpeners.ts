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
    "text": "My neural profile updated in real-time as I walked through campus, the invisible data collection barely noticeable anymore. The AI had already determined my aptitudes before I'd even chosen a field—literature reviews and research synthesis now happened while I slept."
  },
  {
    "id": "universal-university",
    "text": "I adjusted my haptic gloves before entering the immersive lab simulation, connecting with classmates scattered across six continents. The physical campus, where I'd never actually set foot, existed primarily as a research hub and community anchor."
  },
  {
    "id": "extreme-unbundling",
    "text": "My reputation score fluctuated as student reviews of my latest micro-lecture came in. Ten learning shots per day was barely enough to cover my basic expenses, unlike Professor Chen whose courses commanded premium prices on all major education platforms."
  },
  {
    "id": "justice-driven",
    "text": "Our transdisciplinary team had just secured another community partnership focused on equitable water access. The university's transition from academic publisher to social change engine had transformed both our research methods and teaching philosophy."
  },
  {
    "id": "ivory-tower",
    "text": "The campus gates closed behind me as I crossed the historic quadrangle, acutely aware of my privilege. Only fifty students per year were admitted to this program, a stark contrast to the digital upskilling centers that served the majority of the population."
  },
  {
    "id": "ennui",
    "text": "My lifelong learning subscription auto-renewed for another decade as my posthuman philosophy course began. With work obsolete and AIs managing production, understanding the purpose of human existence had become the central question of higher education."
  },
  {
    "id": "enhancement",
    "text": "I administered my focus enhancer before the exam, just like everyone else. The brain-computer interface tuned to my neural patterns, triggering the familiar sensation of heightened cognition—those who studied without augmentation were increasingly rare."
  }
];

// Function to get a random wildcard story opener
export function getRandomWildcardStoryOpener(): WildcardStoryOpener {
  const randomIndex = Math.floor(Math.random() * wildcardStoryOpeners.length);
  return wildcardStoryOpeners[randomIndex];
} 