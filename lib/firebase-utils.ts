import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from './firebase';
import { StoredVoice } from './types';

export async function getStoredVoices(): Promise<StoredVoice[]> {
  const voices: StoredVoice[] = [];
  const storageRef = ref(storage, 'reference-audio');
  
  try {
    const result = await listAll(storageRef);
    
    for (const item of result.items) {
      const url = await getDownloadURL(item);
      const metadata = await getMetadata(item);
      
      voices.push({
        id: item.name,
        name: metadata.customMetadata?.displayName || item.name,
        url,
        createdAt: metadata.timeCreated ? new Date(metadata.timeCreated).getTime() : Date.now()
      });
    }
    
    // Sort by newest first
    return voices.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching stored voices:', error);
    return [];
  }
} 