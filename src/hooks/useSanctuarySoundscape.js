/**
 * Sanctuary Soundscape Hook
 *
 * Ambient audio for the Sanctuary experience.
 * Plays soft, sacred ambience when the Sanctuary is active.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { useEffect, useRef, useState } from 'react';

/**
 * useSanctuarySoundscape
 *
 * @param {Object} options
 * @param {string} options.audioSrc - Path to ambient audio file
 * @param {number} options.volume - Volume level (0-1)
 * @param {boolean} options.enabled - Whether soundscape is enabled
 * @param {number} options.fadeInDuration - Fade in duration in ms
 * @param {number} options.fadeOutDuration - Fade out duration in ms
 */
export function useSanctuarySoundscape({
  audioSrc = '/sounds/sanctuary-ambience.mp3',
  volume = 0.3,
  enabled = true,
  fadeInDuration = 2000,
  fadeOutDuration = 1500
} = {}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Handle load
    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    // Handle errors gracefully - soundscape is optional
    const handleError = (e) => {
      console.warn('Sanctuary soundscape not available:', e.message || 'Audio file not found');
      setIsLoaded(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Try to play with fade in
    const playWithFadeIn = async () => {
      try {
        await audio.play();
        setIsPlaying(true);

        // Fade in
        const startTime = Date.now();
        const fadeIn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / fadeInDuration, 1);
          audio.volume = progress * volume;

          if (progress < 1) {
            requestAnimationFrame(fadeIn);
          }
        };
        fadeIn();
      } catch (err) {
        // Autoplay blocked - this is expected behavior
        console.log('Sanctuary soundscape waiting for user interaction');
      }
    };

    // Small delay before attempting play
    const playTimer = setTimeout(playWithFadeIn, 500);

    // Cleanup with fade out
    return () => {
      clearTimeout(playTimer);

      if (audioRef.current) {
        const audio = audioRef.current;

        // Fade out
        const startVolume = audio.volume;
        const startTime = Date.now();

        const fadeOut = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / fadeOutDuration, 1);
          audio.volume = startVolume * (1 - progress);

          if (progress < 1) {
            requestAnimationFrame(fadeOut);
          } else {
            audio.pause();
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
          }
        };

        fadeOut();
      }
    };
  }, [audioSrc, volume, enabled, fadeInDuration, fadeOutDuration]);

  /**
   * Manual play trigger (for user interaction requirement)
   */
  const play = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);

        // Fade in
        const startTime = Date.now();
        const fadeIn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / fadeInDuration, 1);
          audioRef.current.volume = progress * volume;

          if (progress < 1) {
            requestAnimationFrame(fadeIn);
          }
        };
        fadeIn();
      } catch (err) {
        console.warn('Could not play sanctuary soundscape:', err);
      }
    }
  };

  /**
   * Manual pause trigger
   */
  const pause = () => {
    if (audioRef.current && isPlaying) {
      const audio = audioRef.current;
      const startVolume = audio.volume;
      const startTime = Date.now();

      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);
        audio.volume = startVolume * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      };

      fadeOut();
    }
  };

  /**
   * Set volume
   */
  const setVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    isPlaying,
    isLoaded,
    play,
    pause,
    setVolume
  };
}

export default useSanctuarySoundscape;
