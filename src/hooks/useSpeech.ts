import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1; 
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
};
