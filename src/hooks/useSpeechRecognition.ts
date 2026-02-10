import { useState, useCallback } from 'react';

// Simplified type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Browser not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    try {
        recognition.start();
    } catch (e) {
        console.error(e);
        setError("Failed to start recognition");
    }
  }, []);

  return { isListening, transcript, startListening, error };
};
