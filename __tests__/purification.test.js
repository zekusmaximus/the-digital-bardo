import { sanitizeText, sanitizeHTML } from '../src/utils/purification.js';

test('sanitizeText strips HTML', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('');
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
    expect(sanitizeText('Safe text')).toBe('Safe text');
    expect(sanitizeText('<b>Bold text</b>')).toBe('Bold text');
});

test('sanitizeHTML allows specific tags', () => {
    const input = '<pre class="glitching-text">Safe</pre><script>Bad</script>';
    const result = sanitizeHTML(input);
    expect(result).toBe('<pre class="glitching-text">Safe</pre>Bad');
});

test('sanitizeHTML filters classes', () => {
    const input = '<div class="glitching-text malicious-class">Content</div>';
    const result = sanitizeHTML(input);
    expect(result).toBe('<div class="glitching-text">Content</div>');
});

test('sanitizeHTML preserves data attributes', () => {
    const input = '<div data-birth-time="123" onclick="alert(1)" class="consciousness-fragment">Fragment</div>';
    const result = sanitizeHTML(input);
    expect(result).toBe('<div data-birth-time="123" class="consciousness-fragment">Fragment</div>');
});

test('sanitizeHTML handles malformed input gracefully', () => {
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
    expect(sanitizeHTML(123)).toBe('');
});
