import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';
import { useReviewPromptStore } from 'stores/reviewPromptStore';

export default () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const store = useReviewPromptStore();

  if (!store.shouldShowPrompt()) {
    return;
  }

  InAppReview.requestReview()
    .then(() => {
      store.recordPromptShown();
    })
    .catch((error) => {
      console.error('[ReviewPrompt] requestReview failed:', error);
      store.recordPromptShown();
    });
};
