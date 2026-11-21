import { useApp } from '../context/AppContext.tsx';
import { soundController, KeySoundType, SwitchProfile } from '../utils/audio.ts';

export function useSound() {
  const { soundEnabled, toggleSound } = useApp();

  return {
    soundEnabled,
    toggleSound,
    volume: soundController.volume,
    setVolume: (v: number) => soundController.setVolume(v),
    profile: soundController.switchProfile,
    setProfile: (p: SwitchProfile) => soundController.setProfile(p),
    click: (type: KeySoundType = 'key') => {
      if (soundEnabled) soundController.playKeyClick(type);
    },
    error: () => {
      if (soundEnabled) soundController.playError();
    },
    celebrate: () => {
      if (soundEnabled) soundController.playSuccess();
    }
  };
}
