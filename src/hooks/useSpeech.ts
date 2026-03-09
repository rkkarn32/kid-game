import { useCallback, useEffect, useRef, useState } from 'react';

export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.error("Speech synthesis not supported");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Try to find a good English voice
      const preferredVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        (v.lang.startsWith('en') && v.default)
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Keep reference to prevent GC
      utteranceRef.current = utterance;
      
      utterance.onend = () => {
        utteranceRef.current = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech generation execution error:", e);
    }
  }, [voices]);

  return { speak };
};
