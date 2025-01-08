export type Voice = 
  | `elevenlabs-${string}`
  | `openai-${string}`
  | `cartesia-${string}`;

export type Emotion = 
  | "normal"
  | "anger" 
  | "curiosity"
  | "positivity"
  | "suprise"
  | "sadness";

export type Pace = "normal" | "fast" | "slow";

export interface StoredVoice {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface Speaker {
  id: string;
  label: string;
  voiceId?: string;
  pace: Pace;
  stability: number;
}

export interface TTSFormData {
  text: string;
  voice: Voice;
  emotion?: Emotion;
  pace?: Pace;
  stability?: number;
  style?: number;
  wordTimestamps?: boolean;
  referenceAudio?: File;
  referenceAudioUrl?: string;
  storedVoiceId?: string;
  speakers: Speaker[];
  dialogue: DialogueLine[];
  currentSpeakerVoices: Record<string, string>;
}

export const VOICE_OPTIONS = {
  elevenlabs: [
    { value: "elevenlabs-voice-cloning", label: "Voice Cloning" },
    { value: "elevenlabs-rachel", label: "Rachel" },
    { value: "elevenlabs-alberto", label: "Alberto" },
    { value: "elevenlabs-gabriela", label: "Gabriela" },
    { value: "elevenlabs-darine", label: "Darine" },
    { value: "elevenlabs-maxime", label: "Maxime" }
  ],
  openai: [
    { value: "openai-alloy", label: "Alloy" },
    { value: "openai-echo", label: "Echo" },
    { value: "openai-onyx", label: "Onyx" },
    { value: "openai-nova", label: "Nova" },
    { value: "openai-shimmer", label: "Shimmer" },
    { value: "openai-alloy-hd", label: "Alloy HD" },
    { value: "openai-echo-hd", label: "Echo HD" },
    { value: "openai-onyx-hd", label: "Onyx HD" },
    { value: "openai-nova-hd", label: "Nova HD" },
    { value: "openai-shimmer-hd", label: "Shimmer HD" }
  ],
  cartesia: {
    english: [
      { value: "cartesia-voice-cloning", label: "Voice Cloning" },
      { value: "cartesia-reflective-woman", label: "Reflective Woman" },
      // ... add all other English voices
    ],
    british: [
      { value: "cartesia-british-customer-support-lady", label: "Customer Support Lady" },
      // ... add all other British voices
    ],
    // ... add other language categories
  }
} as const; 