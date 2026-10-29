import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'fr-FR', label: 'Français (French)' },
  { code: 'de-DE', label: 'Deutsch (German)' },
  { code: 'es-ES', label: 'Español (Spanish)' },
  { code: 'pt-BR', label: 'Português (Portuguese)' },
  { code: 'ar-SA', label: 'العربية (Arabic)' },
  { code: 'zh-CN', label: '中文 (Chinese)' },
  { code: 'ja-JP', label: '日本語 (Japanese)' },
  { code: 'ko-KR', label: '한국어 (Korean)' },
];

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function SpeechToText({ onTranscript, className }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, language, onTranscript]);

  if (!isSupported) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[180px] h-9 text-xs bg-background">
          <Globe className="w-3 h-3 mr-1 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover max-h-[250px]">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant={isListening ? 'destructive' : 'outline'}
        size="sm"
        onClick={toggleListening}
        className={cn(isListening && 'animate-pulse')}
      >
        {isListening ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
        {isListening ? 'Stop' : 'Speak'}
      </Button>
    </div>
  );
}
