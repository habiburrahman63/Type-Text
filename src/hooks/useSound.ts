import { useApp } from '../context/AppContext.tsx';
import { soundController } from '../utils/audio.ts';

export function useSound() {
  const { soundEnabled, toggleSound } = useApp();

  return {
    soundEnabled,
    toggleSound,
    click: () => {
      if (soundEnabled) soundController.playKeyClick();
    },
    error: () => {
      if (soundEnabled) soundController.playError();
    },
    celebrate: () => {
      if (soundEnabled) soundController.playSuccess();
    }
  };
}
