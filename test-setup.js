import { vi } from 'vitest';

// Mock window object for tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
});

// Mock addEventListener and removeEventListener
window.addEventListener = vi.fn();
window.removeEventListener = vi.fn();