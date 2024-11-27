import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  targetTime: number; // Initial time in seconds
  onFinish?: () => void;
}

const useTimer = ({ targetTime, onFinish }: UseTimerProps) => {
  const [currentTime, setCurrentTime] = useState<number>(targetTime);
  const timer = useRef<NodeJS.Timeout | null>();

  const startTimer = useCallback(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        setCurrentTime((prevTime) => prevTime - 1);
      }, 1000);
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setCurrentTime(() => targetTime);
  }, [targetTime]);

  const restartTimer = useCallback(() => {
    stopTimer();
    resetTimer();
    startTimer();
  }, [targetTime]);

  useEffect(() => {
    stopTimer();
    startTimer();
    return () => {
      stopTimer();
    };
  }, [targetTime]);

  useEffect(() => {
    if (currentTime <= 0) {
      stopTimer();
      if (onFinish) {
        onFinish();
      }
    }
  }, [currentTime]);

  return { currentTime, resetTimer, restartTimer, startTimer, stopTimer };
};

export default useTimer;
