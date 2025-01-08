'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Play, Settings, Upload, Pause, Download, Loader2, Info, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { TTSFormData, Voice, Emotion, Pace, VOICE_OPTIONS, DialogueLine } from '@/lib/types';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStoredVoices } from '@/lib/firebase-utils';
import { StoredVoice } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const isVoiceCloning = (voice: Voice) => {
  return voice.includes('voice-cloning');
};

const MAX_CONCURRENT_JOBS = 3; // Adjust based on API limits

const fetchAudioBuffer = async (url: string, audioContext: AudioContext): Promise<AudioBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

const concatenateAudioBuffers = (audioBuffers: AudioBuffer[], audioContext: AudioContext): AudioBuffer => {
  // Calculate total duration
  const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const numberOfChannels = Math.max(...audioBuffers.map(buffer => buffer.numberOfChannels));
  
  // Create the final buffer with maximum channels found
  const finalBuffer = audioContext.createBuffer(
    numberOfChannels,
    totalLength,
    audioBuffers[0].sampleRate
  );

  // Fill each channel
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const finalChannelData = finalBuffer.getChannelData(channel);
    let offset = 0;

    audioBuffers.forEach(buffer => {
      // If buffer has this channel, copy it
      if (channel < buffer.numberOfChannels) {
        const channelData = buffer.getChannelData(channel);
        finalChannelData.set(channelData, offset);
      }
      offset += buffer.length;
    });
  }

  return finalBuffer;
};

export function TextToSpeechForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState<TTSFormData>({
    text: '',
    voice: 'elevenlabs-rachel',
    emotion: 'normal',
    pace: 'normal',
    stability: 0.9,
    style: 0.4,
    wordTimestamps: false,
    speakers: [
      { id: 'A', label: 'Speaker A', pace: 'normal', stability: 0.9 },
      { id: 'B', label: 'Speaker B', pace: 'normal', stability: 0.9 },
      { id: 'C', label: 'Speaker C', pace: 'normal', stability: 0.9 },
      { id: 'D', label: 'Speaker D', pace: 'normal', stability: 0.9 },
      { id: 'E', label: 'Speaker E', pace: 'normal', stability: 0.9 },
      { id: 'F', label: 'Speaker F', pace: 'normal', stability: 0.9 },
    ],
    dialogue: [],
    currentSpeakerVoices: {},
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [storedVoices, setStoredVoices] = useState<StoredVoice[]>([]);
  const scriptFileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState<number | null>(null);
  const [generatedAudios, setGeneratedAudios] = useState<Record<number, string>>({});
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_SIEVE_API_KEY || '');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState<Record<number, number>>({});
  const [isRegenerating, setIsRegenerating] = useState<Record<number, boolean>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [singleGenerationProgress, setSingleGenerationProgress] = useState(0);

  useEffect(() => {
    const loadStoredVoices = async () => {
      const voices = await getStoredVoices();
      setStoredVoices(voices);
    };
    
    loadStoredVoices();
  }, []);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('sieve_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `reference-audio/${fileName}`);
        
        const metadata = {
          customMetadata: {
            displayName: file.name,
          }
        };
        
        await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(storageRef);
        
        const newVoice: StoredVoice = {
          id: fileName,
          name: file.name,
          url: downloadURL,
          createdAt: Date.now()
        };
        
        setStoredVoices(prev => [newVoice, ...prev]);
        
        setFormData(prev => ({ 
          ...prev, 
          referenceAudio: file,
          referenceAudioUrl: downloadURL,
          storedVoiceId: fileName
        }));

        toast.success('Reference audio uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload reference audio');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) {
      toast.error('Please enter some text to convert');
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setSingleGenerationProgress(0);
    
    try {
      const defaultReferenceAudio = {
        url: "https://storage.googleapis.com/sieve-prod-us-central1-public-file-upload-bucket/482b91af-e737-48ea-b76d-4bb22d77fb56/caa0664b-f530-4406-858a-99837eb4b354-input-reference_audio.wav"
      };

      const payload = {
        function: 'sieve/tts',
        inputs: {
          text: formData.text,
          voice: formData.voice,
          emotion: formData.emotion,
          pace: formData.pace,
          stability: formData.stability,
          style: formData.style,
          word_timestamps: formData.wordTimestamps,
          reference_audio: formData.referenceAudioUrl 
            ? { url: formData.referenceAudioUrl }
            : defaultReferenceAudio
        }
      };

      const response = await fetch('https://mango.sievedata.com/v2/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate speech');
      }

      const data = await response.json();
      console.log('Initial response:', data);
      
      if (!data.id) {
        throw new Error('No job ID received from API');
      }

      const checkJobStatus = async (jobId: string) => {
        console.log('Checking job status for:', jobId);
        
        const jobResponse = await fetch(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
          headers: {
            'X-API-Key': process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
          }
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to check job status');
        }

        const jobData = await jobResponse.json();
        console.log('Job status:', jobData);
        
        if (jobData.status === 'finished') {
          if (jobData.outputs?.[0]?.data?.url) {
            setAudioUrl(jobData.outputs[0].data.url);
            toast.success('Speech generated successfully!');
            return true;
          }
          
          if (jobData.outputs?.['0']?.data?.url) {
            setAudioUrl(jobData.outputs['0'].data.url);
            toast.success('Speech generated successfully!');
            return true;
          }
          
          if (jobData.outputs?.output_0?.data?.url) {
            setAudioUrl(jobData.outputs.output_0.data.url);
            toast.success('Speech generated successfully!');
            return true;
          }

          console.error('Job finished but no URL found in response:', jobData);
          throw new Error('Could not find audio URL in API response');
        } else if (jobData.status === 'error') {
          throw new Error(jobData.error || 'Job failed');
        }
        
        return false;
      };

      let attempts = 0;
      const maxAttempts = 30;
      
      const pollInterval = setInterval(async () => {
        try {
          attempts++;
          const isComplete = await checkJobStatus(data.id);
          setSingleGenerationProgress(Math.min(90, (attempts / maxAttempts) * 100));
          
          if (isComplete || attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setIsGenerating(false);
            setSingleGenerationProgress(100);
            
            if (attempts >= maxAttempts) {
              throw new Error('Generation timed out');
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          setIsGenerating(false);
          setSingleGenerationProgress(0);
          throw error;
        }
      }, 2000);

    } catch (error) {
      console.error('Error details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate speech');
      setIsGenerating(false);
      setSingleGenerationProgress(0);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Playback error:', error);
              toast.error('Failed to play audio');
            });
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Audio control error:', error);
        toast.error('Failed to control audio playback');
      }
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `speech-${Date.now()}.mp3`; // or appropriate extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size too large. Please upload a file smaller than 5MB');
      return;
    }

    if (!file.type.startsWith('text/')) {
      toast.error('Please upload a text file');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      
      const dialogue: DialogueLine[] = [];
      const speakerRegex = /^Speaker\s*([A-F])\s*:\s*(.+)$/i;
      
      lines.forEach(line => {
        const match = line.match(speakerRegex);
        if (match) {
          dialogue.push({
            speaker: match[1].toUpperCase(),
            text: match[2].trim()
          });
        } else {
          console.log('Line did not match format:', line);
        }
      });
      
      if (dialogue.length > 0) {
        setFormData(prev => ({
          ...prev,
          dialogue
        }));
        toast.success(`Loaded ${dialogue.length} lines of dialogue`);
      } else {
        console.log('No matches found in lines:', lines);
        toast.error('No valid dialogue lines found in the script. Format should be "Speaker X: Text"');
      }
    };
    
    reader.readAsText(file);
  };

  const handleSpeakerVoiceChange = (speakerId: string, voiceId: string) => {
    setFormData(prev => ({
      ...prev,
      currentSpeakerVoices: {
        ...prev.currentSpeakerVoices,
        [speakerId]: voiceId
      }
    }));
  };

  const handleSpeakerSettingChange = (speakerId: string, setting: 'pace' | 'stability', value: any) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map(speaker => 
        speaker.id === speakerId 
          ? { ...speaker, [setting]: value }
          : speaker
      )
    }));
  };

  const generateSingleSpeech = async (text: string, voiceId: string, lineIndex: number): Promise<string> => {
    if (!voiceId) {
      throw new Error('No voice selected for speaker');
    }

    const speaker = formData.speakers.find(s => s.id === formData.dialogue[lineIndex].speaker);
    if (!speaker) {
      throw new Error('Speaker not found');
    }

    setCurrentGeneratingIndex(lineIndex);
    
    const voice = storedVoices.find(v => v.id === voiceId);
    if (!voice) {
      throw new Error('Selected voice not found');
    }

    const payload = {
      function: 'sieve/tts',
      inputs: {
        text: text,
        voice: 'elevenlabs-voice-cloning',
        emotion: formData.emotion,
        pace: speaker.pace,
        stability: speaker.stability,
        style: formData.style,
        word_timestamps: formData.wordTimestamps,
        reference_audio: { url: voice.url }
      }
    };

    const response = await fetch('https://mango.sievedata.com/v2/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey || process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error('No job ID received');
    }

    // Wait for job completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const jobResponse = await fetch(`https://mango.sievedata.com/v2/jobs/${data.id}`, {
        headers: {
          'X-API-Key': apiKey || process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
        }
      });

      const jobData = await jobResponse.json();
      
      if (jobData.status === 'finished') {
        const audioUrl = jobData.outputs?.[0]?.data?.url;
        if (audioUrl) {
          return audioUrl;
        }
        throw new Error('No audio URL in response');
      } else if (jobData.status === 'error') {
        throw new Error(jobData.error || 'Generation failed');
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Generation timed out');
  };

  const generateSpeech = async (text: string, voiceId: string, lineIndex?: number) => {
    if (!voiceId) {
      toast.error('No voice selected for this speaker');
      return;
    }

    if (lineIndex !== undefined) {
      setIsGenerating(true);
      setCurrentGeneratingIndex(lineIndex);
      setGenerationProgress({ ...generationProgress, [lineIndex]: 0 });
      setIsRegenerating({ ...isRegenerating, [lineIndex]: !!generatedAudios[lineIndex] });
    }
    
    try {
      const voice = storedVoices.find(v => v.id === voiceId);
      if (!voice) {
        throw new Error('Selected voice not found');
      }

      // Ensure the reference audio URL has a scheme
      const referenceAudioUrl = voice.url.startsWith('http') 
        ? voice.url 
        : `https://${voice.url}`;

      const payload = {
        function: 'sieve/tts',
        inputs: {
          text: text,
          voice: 'elevenlabs-voice-cloning',
          emotion: formData.emotion,
          pace: formData.pace,
          stability: formData.stability,
          style: formData.style,
          word_timestamps: formData.wordTimestamps,
          reference_audio: { url: referenceAudioUrl }
        }
      };

      const response = await fetch('https://mango.sievedata.com/v2/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey || process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error('No job ID received');
      }

      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        const jobResponse = await fetch(`https://mango.sievedata.com/v2/jobs/${data.id}`, {
          headers: {
            'X-API-Key': apiKey || process.env.NEXT_PUBLIC_SIEVE_API_KEY || '',
          }
        });

        const jobData = await jobResponse.json();
        
        if (jobData.status === 'finished') {
          const audioUrl = jobData.outputs?.[0]?.data?.url;
          if (audioUrl) {
            if (lineIndex !== undefined) {
              setGeneratedAudios(prev => ({ ...prev, [lineIndex]: audioUrl }));
              setGenerationProgress(prev => ({ ...prev, [lineIndex]: 100 }));
            } else {
              setAudioUrl(audioUrl);
            }
            toast.success('Speech generated successfully!');
            break;
          }
          throw new Error('No audio URL in response');
        } else if (jobData.status === 'error') {
          throw new Error(jobData.error || 'Generation failed');
        }
        
        // Update progress
        if (lineIndex !== undefined) {
          const progress = Math.min(90, (attempts / maxAttempts) * 100);
          setGenerationProgress(prev => ({ ...prev, [lineIndex]: progress }));
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (attempts >= maxAttempts) {
        throw new Error('Generation timed out');
      }

    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate speech');
    } finally {
      setIsGenerating(false);
      if (lineIndex !== undefined) {
        setCurrentGeneratingIndex(null);
        setIsRegenerating(prev => ({ ...prev, [lineIndex]: false }));
      }
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    const results: Record<number, string> = {};
    const pendingLines = formData.dialogue.map((line, index) => ({ line, index }));
    
    const processQueue = async () => {
      while (pendingLines.length > 0) {
        const batch = pendingLines.splice(0, MAX_CONCURRENT_JOBS);
        const batchPromises = batch.map(({ line, index }) => 
          generateSingleSpeech(line.text, formData.currentSpeakerVoices[line.speaker], index)
        );

        try {
          const batchResults = await Promise.allSettled(batchPromises);
          batchResults.forEach((result, i) => {
            const originalIndex = batch[i].index;
            if (result.status === 'fulfilled' && result.value) {
              results[originalIndex] = result.value;
            } else if (result.status === 'rejected') {
              console.error(`Failed to generate speech for line ${originalIndex}:`, result.reason);
              toast.error(`Failed to generate speech for Speaker ${batch[i].line.speaker}`);
            }
          });
        } catch (error) {
          console.error('Batch processing error:', error);
        }
      }
    };

    try {
      await processQueue();
      setGeneratedAudios(results);
      toast.success('All speeches generated successfully!');
    } catch (error) {
      console.error('Error in generate all:', error);
      toast.error('Some generations failed');
    } finally {
      setIsGeneratingAll(false);
      setCurrentGeneratingIndex(null);
    }
  };

  const mergeAndDownloadAudios = useCallback(async () => {
    setIsLoading(true);
    try {
      const audioUrls = Object.entries(generatedAudios)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([_, url]) => url);

      if (audioUrls.length === 0) {
        toast.error('No audio files generated yet');
        return;
      }

      toast.loading('Merging audio files...');

      // Create AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Fetch and decode all audio files
      const audioBuffers = await Promise.all(
        audioUrls.map(url => fetchAudioBuffer(url, audioContext))
      );

      // Concatenate all buffers
      const finalBuffer = concatenateAudioBuffers(audioBuffers, audioContext);

      // Convert to WAV
      const numberOfChannels = finalBuffer.numberOfChannels;
      const length = finalBuffer.length * numberOfChannels * 2;
      const buffer = new ArrayBuffer(44 + length);
      const view = new DataView(buffer);

      // Write WAV header
      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, finalBuffer.sampleRate, true);
      view.setUint32(28, finalBuffer.sampleRate * numberOfChannels * 2, true);
      view.setUint16(32, numberOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, length, true);

      // Write audio data
      const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
          const s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
      };

      let offset = 44;
      for (let i = 0; i < finalBuffer.numberOfChannels; i++) {
        floatTo16BitPCM(view, offset, finalBuffer.getChannelData(i));
        offset += finalBuffer.length * 2;
      }

      // Create blob and download
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-speech-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Audio files merged and downloaded successfully');
      
      // Clean up
      audioContext.close();
    } catch (error) {
      console.error('Error merging audio:', error);
      toast.error('Failed to merge audio files');
    } finally {
      setIsLoading(false);
    }
  }, [generatedAudios]);

  const handleApiKeyUpdate = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('sieve_api_key', newKey);
    toast.success('API key updated successfully');
  };

  const handleEditLine = (index: number) => {
    setEditText(formData.dialogue[index].text);
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number) => {
    if (editText.trim()) {
      setFormData(prev => ({
        ...prev,
        dialogue: prev.dialogue.map((line, i) => 
          i === index ? { ...line, text: editText } : line
        )
      }));
    }
    setEditingIndex(null);
    setEditText('');
  };

  const handleRemoveLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dialogue: prev.dialogue.filter((_, i) => i !== index)
    }));
    // Clean up any generated audio for this line
    if (generatedAudios[index]) {
      const newGeneratedAudios = { ...generatedAudios };
      delete newGeneratedAudios[index];
      setGeneratedAudios(newGeneratedAudios);
    }
  };

  const handleTextAreaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setFormData(prev => ({ ...prev, text: textarea.value }));
  };

  useEffect(() => {
    // Store ref in a variable to avoid stale ref in cleanup
    const currentAudioRef = audioRef.current;

    return () => {
      // Use the stored ref variable
      if (currentAudioRef) {
        currentAudioRef.pause();
        currentAudioRef.src = '';
      }
      // Cleanup object URLs
      Object.values(generatedAudios).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [generatedAudios]);

  return (
    <Card className="w-full bg-background/80 backdrop-blur-sm border shadow-lg rounded-xl overflow-hidden">
      <Tabs defaultValue="single" className="p-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Text to Speech
            </h1>
            <p className="text-sm text-muted-foreground">
              Convert your text into natural-sounding speech
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-primary/50 hover:bg-primary/10 transition-colors"
            onClick={() => setShowApiConfig(!showApiConfig)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {showApiConfig && (
          <div className="mb-6 p-4 rounded-lg border-2 bg-card/50 backdrop-blur-sm animate-in fade-in-50 duration-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">API Configuration</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiConfig(false)}
                  className="hover:bg-background/50"
                >
                  ✕
                </Button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Sieve API key"
                  className="flex-1 px-3 py-2 text-sm rounded-md border bg-background/50 backdrop-blur-sm focus:border-primary/50 transition-colors"
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApiKeyUpdate(apiKey)}
                  className="px-4"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="single" className="data-[state=active]:bg-primary/10">
            Single Voice
          </TabsTrigger>
          <TabsTrigger value="multi" className="data-[state=active]:bg-primary/10">
            Multiple Speakers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Text to Convert</Label>
              <Textarea
                placeholder="Enter text to convert to speech..."
                value={formData.text}
                onChange={handleTextAreaResize}
                className="min-h-[200px] resize-none transition-height duration-150 text-base leading-relaxed"
                onFocus={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Voice</Label>
                <Select
                  value={formData.voice}
                  onValueChange={(value: Voice) => setFormData(prev => ({ ...prev, voice: value }))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.elevenlabs.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Emotion</Label>
                <Select
                  value={formData.emotion}
                  onValueChange={(value: Emotion) => setFormData(prev => ({ ...prev, emotion: value }))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="anger">Anger</SelectItem>
                    <SelectItem value="curiosity">Curiosity</SelectItem>
                    <SelectItem value="positivity">Positivity</SelectItem>
                    <SelectItem value="suprise">Surprise</SelectItem>
                    <SelectItem value="sadness">Sadness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pace</Label>
                <Select
                  value={formData.pace}
                  onValueChange={(value: Pace) => setFormData(prev => ({ ...prev, pace: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reference Audio</Label>
                <div className="space-y-2">
                  <Select
                    value={formData.storedVoiceId}
                    onValueChange={(value) => {
                      const selectedVoice = storedVoices.find(v => v.id === value);
                      if (selectedVoice) {
                        setFormData(prev => ({
                          ...prev,
                          storedVoiceId: value,
                          referenceAudioUrl: selectedVoice.url
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select saved voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {storedVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {formData.referenceAudio ? formData.referenceAudio.name : 'Upload New Voice'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
                {formData.referenceAudioUrl && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                      {formData.storedVoiceId 
                        ? `Using: ${storedVoices.find(v => v.id === formData.storedVoiceId)?.name}`
                        : 'New voice uploaded'}
                    </Badge>
                    <audio
                      src={formData.referenceAudioUrl}
                      controls
                      className="h-8 w-32"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Style ({formData.style})</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Style Control</h4>
                        <p className="text-sm text-muted-foreground">
                          Controls how much the voice cloning should match the reference audio&apos;s style. Higher values mean stronger style matching.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Slider
                  value={[formData.style || 0]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, style: value }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="[&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Stability ({formData.stability})</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Stability Control</h4>
                        <p className="text-sm text-muted-foreground">
                          Controls the stability of the voice. Higher values will make the voice more consistent but may sound less natural.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Slider
                  value={[formData.stability || 0]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, stability: value }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="[&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.wordTimestamps}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wordTimestamps: checked }))}
                />
                <Label>Generate word timestamps</Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Word Timestamps</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate timing information for each word in the generated speech. Useful for synchronization and subtitles.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            {/* Generation Controls */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isGenerating || !formData.text}
                onClick={handleSubmit}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    <Progress 
                      value={singleGenerationProgress} 
                      className="absolute bottom-0 left-0 h-1 w-full bg-primary-foreground/20" 
                    />
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Speech
                  </>
                )}
              </Button>
              
              {audioUrl && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-2 border-primary/50 hover:bg-primary/10"
                    onClick={handlePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-2 border-primary/50 hover:bg-primary/10"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Audio Preview */}
            {audioUrl && (
              <div className="flex items-center gap-4 animate-in fade-in-50 duration-200">
                <div className="flex-1 bg-background rounded-lg p-3 border-2 hover:border-primary/50 transition-colors">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    controls
                    className="w-full h-8"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="multi">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {formData.speakers.map((speaker) => (
                <div key={speaker.id} className="p-3 rounded-lg border-2 bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="px-2 py-0.5 text-xs">
                      {speaker.label}
                    </Badge>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 text-xs"
                      disabled={!formData.currentSpeakerVoices[speaker.id]}
                      onClick={() => {
                        const lines = formData.dialogue.filter(line => line.speaker === speaker.id);
                        lines.forEach((line, idx) => {
                          const dialogueIndex = formData.dialogue.findIndex(l => l === line);
                          generateSpeech(line.text, formData.currentSpeakerVoices[speaker.id], dialogueIndex);
                        });
                      }}
                    >
                      Generate All Lines
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Select
                      value={formData.currentSpeakerVoices[speaker.id]}
                      onValueChange={(value) => handleSpeakerVoiceChange(speaker.id, value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {storedVoices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Pace</Label>
                        <Select
                          value={speaker.pace}
                          onValueChange={(value: Pace) => handleSpeakerSettingChange(speaker.id, 'pace', value)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select pace" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="fast">Fast</SelectItem>
                            <SelectItem value="slow">Slow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Stability ({speaker.stability})</Label>
                        <Slider
                          value={[speaker.stability]}
                          onValueChange={([value]) => handleSpeakerSettingChange(speaker.id, 'stability', value)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Script</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => scriptFileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Script
                </Button>
                <input
                  ref={scriptFileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {formData.dialogue.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Script Preview</h2>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Voice Generation Status</h4>
                              <p className="text-sm text-muted-foreground">
                                Generated: {Object.keys(generatedAudios).length} of {formData.dialogue.length} lines
                              </p>
                              <Progress 
                                value={(Object.keys(generatedAudios).length / formData.dialogue.length) * 100} 
                                className="h-2"
                              />
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isGeneratingAll ? 
                          `Generating ${currentGeneratingIndex !== null ? currentGeneratingIndex + 1 : 0} of ${formData.dialogue.length} lines` :
                          `${Object.keys(generatedAudios).length} of ${formData.dialogue.length} lines generated`
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="bg-primary hover:bg-primary/90 relative"
                        disabled={isGeneratingAll || !formData.dialogue.some(line => formData.currentSpeakerVoices[line.speaker])}
                        onClick={handleGenerateAll}
                      >
                        {isGeneratingAll ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                            <Progress 
                              value={(currentGeneratingIndex !== null ? (currentGeneratingIndex + 1) : 0) / formData.dialogue.length * 100}
                              className="absolute bottom-0 left-0 h-1 w-full bg-primary-foreground/20"
                            />
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Generate All
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary hover:bg-primary/10"
                        disabled={Object.keys(generatedAudios).length === 0}
                        onClick={mergeAndDownloadAudios}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download All
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 bg-card">
                    {formData.dialogue.map((line, index) => (
                      <div key={index} className={cn(
                        "border-b last:border-0",
                        currentGeneratingIndex === index && "bg-muted/50"
                      )}>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant={generatedAudios[index] ? "default" : "outline"}
                                className={cn(
                                  "px-4 py-1.5 text-sm font-medium rounded-full",
                                  currentGeneratingIndex === index && "animate-pulse"
                                )}
                              >
                                Speaker {line.speaker}
                              </Badge>
                              {formData.currentSpeakerVoices[line.speaker] && (
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    generatedAudios[index] ? "bg-green-500" : "bg-yellow-500"
                                  )} />
                                  {storedVoices.find(v => v.id === formData.currentSpeakerVoices[line.speaker])?.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditLine(index)}
                                disabled={isGenerating || isGeneratingAll}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveLine(index)}
                                disabled={isGenerating || isGeneratingAll}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={generatedAudios[index] ? "secondary" : "default"}
                                size="sm"
                                className={cn(
                                  "transition-all duration-200",
                                  !formData.currentSpeakerVoices[line.speaker] && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={isGenerating || isGeneratingAll || !formData.currentSpeakerVoices[line.speaker]}
                                onClick={() => generateSpeech(line.text, formData.currentSpeakerVoices[line.speaker], index)}
                              >
                                {isGenerating && currentGeneratingIndex === index ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2">
                                      {isRegenerating[index] ? 'Regenerating...' : 'Generating...'}
                                    </span>
                                  </>
                                ) : generatedAudios[index] ? (
                                  <>
                                    <Play className="h-4 w-4" />
                                    <span className="ml-2">Regenerate</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    <span className="ml-2">Generate</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {editingIndex === index ? (
                            <div className="flex gap-2">
                              <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1"
                              />
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveEdit(index)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingIndex(null);
                                    setEditText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-base leading-relaxed">{line.text}</p>
                          )}

                          {(isGenerating && currentGeneratingIndex === index) && (
                            <div className="w-full">
                              <Progress value={generationProgress[index]} className="h-1" />
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                {Math.round(generationProgress[index])}%
                              </p>
                            </div>
                          )}

                          {generatedAudios[index] && (
                            <div className="flex items-center gap-4 animate-in fade-in-50 duration-200">
                              <div className="flex-1 bg-background rounded-lg p-3 border-2 hover:border-primary/50 transition-colors">
                                <audio
                                  src={generatedAudios[index]}
                                  controls
                                  className="w-full h-8"
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 border-2 border-primary/50 hover:bg-primary/10 transition-colors"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = generatedAudios[index];
                                  link.download = `speaker-${line.speaker}-line-${index + 1}.mp3`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}