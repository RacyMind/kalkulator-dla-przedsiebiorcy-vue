import { Capacitor } from '@capacitor/core';
import { useReviewPromptStore } from 'stores/reviewPromptStore';

export function useReviewPrompt() {
  const isNative = Capacitor.isNativePlatform();

  const incrementCalculationCount = () => {
    if (!isNative) {
      return;
    }
    const store = useReviewPromptStore();
    store.incrementCalculationCount();
  };

  return {
    incrementCalculationCount,
  };
}
