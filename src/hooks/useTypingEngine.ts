import { useState, useCallback, useRef } from 'react';
import { calculateTypingMetrics, getRecommendedFinger } from '../utils/typingEngine.ts';
import { soundController } from '../utils/audio.ts';

export interface UseTypingEngineProps {
  targetText: string;
  onComplete?: (wpm: number, accuracy: number, duration: number) => void;
}

export function useTypingEngine({ targetText, onComplete }: UseTypingEngineProps) {
  const [typedChars, setTypedChars] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const completedRef = useRef(false);

  const currentIndex = typedChars.length;
  const nextExpectedChar = targetText[currentIndex] || '';
  const fingerGuide = getRecommendedFinger(nextExpectedChar);

  const handleCharInput = useCallback(
    (char: string) => {
      if (isFinished || completedRef.current) return;

      const now = Date.now();
      let activeStartTime = startTime;
      if (!activeStartTime) {
        activeStartTime = now;
        setStartTime(now);
      }

      const expected = targetText[typedChars.length];
      if (char === expected) {
        soundController.playKeyClick();
        const nextTyped = typedChars + char;
        setTypedChars(nextTyped);

        if (nextTyped.length === targetText.length) {
          completedRef.current = true;
          setIsFinished(true);
          const durationSeconds = Math.max(1, Math.round((now - activeStartTime) / 1000));
          const metrics = calculateTypingMetrics({
            totalKeystrokes: nextTyped.length,
            correctKeystrokes: nextTyped.length - errorCount,
            uncorrectedErrors: 0,
            elapsedSeconds: durationSeconds
          });
          onComplete?.(metrics.netWpm, metrics.accuracy, durationSeconds);
        }
      } else {
        soundController.playError();
        setErrorCount(prev => prev + 1);
      }
    },
    [typedChars, targetText, startTime, errorCount, isFinished, onComplete]
  );

  const reset = useCallback(() => {
    setTypedChars('');
    setErrorCount(0);
    setStartTime(null);
    setIsFinished(false);
    completedRef.current = false;
  }, []);

  return {
    typedChars,
    errorCount,
    currentIndex,
    nextExpectedChar,
    fingerGuide,
    isFinished,
    handleCharInput,
    reset
  };
}
