'use client';

import { useState, useCallback } from 'react';
import { SubscriptionPlan } from '@/lib/subscription-plans';

interface UsageMetrics {
  audioGenerationsUsed: number;
  customVoicesCreated: number;
}

export function useSubscriptionLimits(plan: SubscriptionPlan) {
  const [usage, setUsage] = useState<UsageMetrics>({
    audioGenerationsUsed: 0,
    customVoicesCreated: 0,
  });

  const checkTextLength = useCallback((text: string): boolean => {
    return text.length <= plan.limits.maxTextLength;
  }, [plan.limits.maxTextLength]);

  const checkAudioGenerationLimit = useCallback((): boolean => {
    return usage.audioGenerationsUsed < plan.limits.audioGenerations;
  }, [usage.audioGenerationsUsed, plan.limits.audioGenerations]);

  const checkCustomVoiceLimit = useCallback((): boolean => {
    return usage.customVoicesCreated < plan.limits.customVoices;
  }, [usage.customVoicesCreated, plan.limits.customVoices]);

  const checkConcurrentJobs = useCallback((currentJobs: number): boolean => {
    return currentJobs < plan.limits.concurrentJobs;
  }, [plan.limits.concurrentJobs]);

  const incrementAudioGeneration = useCallback(() => {
    setUsage(prev => ({
      ...prev,
      audioGenerationsUsed: prev.audioGenerationsUsed + 1
    }));
  }, []);

  const incrementCustomVoice = useCallback(() => {
    setUsage(prev => ({
      ...prev,
      customVoicesCreated: prev.customVoicesCreated + 1
    }));
  }, []);

  const getRemainingGenerations = useCallback((): number => {
    return Math.max(0, plan.limits.audioGenerations - usage.audioGenerationsUsed);
  }, [plan.limits.audioGenerations, usage.audioGenerationsUsed]);

  const getRemainingCustomVoices = useCallback((): number => {
    return Math.max(0, plan.limits.customVoices - usage.customVoicesCreated);
  }, [plan.limits.customVoices, usage.customVoicesCreated]);

  const isVoiceCloningAllowed = useCallback((): boolean => {
    return plan.limits.voiceCloning;
  }, [plan.limits.voiceCloning]);

  const getAvailableFormats = useCallback((): string[] => {
    return plan.limits.downloadFormats;
  }, [plan.limits.downloadFormats]);

  return {
    usage,
    checkTextLength,
    checkAudioGenerationLimit,
    checkCustomVoiceLimit,
    checkConcurrentJobs,
    incrementAudioGeneration,
    incrementCustomVoice,
    getRemainingGenerations,
    getRemainingCustomVoices,
    isVoiceCloningAllowed,
    getAvailableFormats,
  };
} 