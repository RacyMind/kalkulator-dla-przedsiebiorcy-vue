import { acceptHMRUpdate, defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const MIN_CALCULATIONS_FOR_PROMPT = 5;
export const COOLDOWN_DAYS = 90;
export const MAX_PROMPT_COUNT = 3;

export const useReviewPromptStore = defineStore('reviewPromptStore', {
  state: () => ({
    calculationCount: useLocalStorage('reviewPrompt/calculationCount', 0),
    lastPromptDate: useLocalStorage<string | null>(
      'reviewPrompt/lastPromptDate',
      null,
    ),
    promptCount: useLocalStorage('reviewPrompt/promptCount', 0),
  }),
  actions: {
    incrementCalculationCount() {
      this.calculationCount++;
    },
    shouldShowPrompt(): boolean {
      if (this.calculationCount < MIN_CALCULATIONS_FOR_PROMPT) {
        return false;
      }
      if (this.promptCount >= MAX_PROMPT_COUNT) {
        return false;
      }
      if (this.lastPromptDate !== null) {
        const lastDate = new Date(this.lastPromptDate);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays < COOLDOWN_DAYS) {
          return false;
        }
      }
      return true;
    },
    recordPromptShown() {
      this.lastPromptDate = new Date().toISOString().split('T')[0];
      this.promptCount++;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useReviewPromptStore, import.meta.hot),
  );
}
