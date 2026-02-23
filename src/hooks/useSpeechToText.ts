import { useState, useCallback, useRef } from 'react';

export const useSpeechToText = (language: 'en' | 'hi' | 'ta' = 'en') => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback((onResult: (text: string) => void) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log('Voice transcript:', transcript);
            onResult(transcript);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error('Recognition start error:', e);
            recognitionRef.current = null;
            setIsListening(false);
        }
    }, [language]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                console.error('Stop error:', e);
            }
            setIsListening(false);
            recognitionRef.current = null;
        }
    }, []);

    return { isListening, startListening, stopListening, error };
};
