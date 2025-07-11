// src/audio/fallback-audio-engine.js
/**
 * Stub helper used by ClearLodeAudio's Advanced Audio Fallback System.
 * Provides no-op implementations so the application can compile even when
 * advanced audio capabilities are unavailable.
 */

export class FallbackAudioEngine {
  playOscillatorTone(frequency, duration) {
    console.warn(`[FallbackAudioEngine] playOscillatorTone(${frequency}, ${duration})`);
  }

  playHTMLAudioSample(name) {
    console.warn(`[FallbackAudioEngine] playHTMLAudioSample(${name})`);
  }

  enhanceVisualFeedback() {
    console.warn('[FallbackAudioEngine] enhanceVisualFeedback() invoked');
  }
}