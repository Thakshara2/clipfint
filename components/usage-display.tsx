'use client';

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { useSubscriptionLimits } from "@/hooks/use-subscription-limits";
import { Download, Mic, Users } from "lucide-react";

interface UsageDisplayProps {
  plan: SubscriptionPlan;
}

export function UsageDisplay({ plan }: UsageDisplayProps) {
  const {
    usage,
    getRemainingGenerations,
    getRemainingCustomVoices,
    getAvailableFormats,
  } = useSubscriptionLimits(plan);

  const audioGenerationPercentage = 
    (usage.audioGenerationsUsed / plan.limits.audioGenerations) * 100;
  
  const customVoicesPercentage = 
    (usage.customVoicesCreated / plan.limits.customVoices) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Audio Generations
          </CardTitle>
          <Mic className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              {usage.audioGenerationsUsed} / {plan.limits.audioGenerations}
            </p>
            <Progress value={audioGenerationPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getRemainingGenerations()} generations remaining this month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Custom Voices
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              {usage.customVoicesCreated} / {plan.limits.customVoices}
            </p>
            <Progress value={customVoicesPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getRemainingCustomVoices()} custom voices available
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Download Formats
          </CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {getAvailableFormats().map((format) => (
                <span
                  key={format}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Available download formats
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 