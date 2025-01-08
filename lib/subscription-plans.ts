export interface SubscriptionFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  interval: 'month' | 'year';
  features: SubscriptionFeature[];
  limits: {
    audioGenerations: number;
    maxTextLength: number;
    concurrentJobs: number;
    voiceCloning: boolean;
    customVoices: number;
    downloadFormats: string[];
  };
  stripeProductId?: string; // Will be added when we set up Stripe
  stripePriceId?: string; // Will be added when we set up Stripe
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our service',
    price: 0,
    interval: 'month',
    features: [
      {
        name: 'Audio Generations',
        description: 'Number of text-to-speech conversions per month',
        included: true,
        limit: 10,
        unit: 'generations'
      },
      {
        name: 'Text Length',
        description: 'Maximum characters per generation',
        included: true,
        limit: 500,
        unit: 'characters'
      },
      {
        name: 'Voice Cloning',
        description: 'Create custom voices from audio samples',
        included: false
      },
      {
        name: 'Concurrent Jobs',
        description: 'Number of simultaneous generations',
        included: true,
        limit: 1
      },
      {
        name: 'Download Formats',
        description: 'Available audio formats',
        included: true
      }
    ],
    limits: {
      audioGenerations: 10,
      maxTextLength: 500,
      concurrentJobs: 1,
      voiceCloning: false,
      customVoices: 0,
      downloadFormats: ['mp3']
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for content creators and professionals',
    price: 999, // $9.99
    interval: 'month',
    features: [
      {
        name: 'Audio Generations',
        description: 'Number of text-to-speech conversions per month',
        included: true,
        limit: 100,
        unit: 'generations'
      },
      {
        name: 'Text Length',
        description: 'Maximum characters per generation',
        included: true,
        limit: 2000,
        unit: 'characters'
      },
      {
        name: 'Voice Cloning',
        description: 'Create custom voices from audio samples',
        included: true,
        limit: 1
      },
      {
        name: 'Concurrent Jobs',
        description: 'Number of simultaneous generations',
        included: true,
        limit: 2
      },
      {
        name: 'Download Formats',
        description: 'Available audio formats',
        included: true
      }
    ],
    limits: {
      audioGenerations: 100,
      maxTextLength: 2000,
      concurrentJobs: 2,
      voiceCloning: true,
      customVoices: 1,
      downloadFormats: ['mp3', 'wav']
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for agencies and production studios',
    price: 2999, // $29.99
    interval: 'month',
    features: [
      {
        name: 'Audio Generations',
        description: 'Number of text-to-speech conversions per month',
        included: true,
        limit: 1000,
        unit: 'generations'
      },
      {
        name: 'Text Length',
        description: 'Maximum characters per generation',
        included: true,
        limit: 10000,
        unit: 'characters'
      },
      {
        name: 'Voice Cloning',
        description: 'Create custom voices from audio samples',
        included: true,
        limit: 5
      },
      {
        name: 'Concurrent Jobs',
        description: 'Number of simultaneous generations',
        included: true,
        limit: 5
      },
      {
        name: 'Download Formats',
        description: 'Available audio formats',
        included: true
      }
    ],
    limits: {
      audioGenerations: 1000,
      maxTextLength: 10000,
      concurrentJobs: 5,
      voiceCloning: true,
      customVoices: 5,
      downloadFormats: ['mp3', 'wav', 'flac']
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 9999, // $99.99
    interval: 'month',
    features: [
      {
        name: 'Audio Generations',
        description: 'Number of text-to-speech conversions per month',
        included: true,
        limit: 10000,
        unit: 'generations'
      },
      {
        name: 'Text Length',
        description: 'Maximum characters per generation',
        included: true,
        limit: 50000,
        unit: 'characters'
      },
      {
        name: 'Voice Cloning',
        description: 'Create custom voices from audio samples',
        included: true,
        limit: 20
      },
      {
        name: 'Concurrent Jobs',
        description: 'Number of simultaneous generations',
        included: true,
        limit: 20
      },
      {
        name: 'Download Formats',
        description: 'Available audio formats',
        included: true
      }
    ],
    limits: {
      audioGenerations: 10000,
      maxTextLength: 50000,
      concurrentJobs: 20,
      voiceCloning: true,
      customVoices: 20,
      downloadFormats: ['mp3', 'wav', 'flac', 'ogg']
    }
  }
]; 