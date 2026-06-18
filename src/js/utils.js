/**
 * FOUNDERY927 — Utility Functions
 * Shared helpers used across all JS modules.
 */

/**
 * Split an element's text content into individually-wrapped words and characters.
 * Each word becomes <span class="word"> containing <span class="char"> per character.
 * Preserves spaces between words.
 *
 * @param {HTMLElement} element — The DOM element whose text to split
 * @returns {{ words: HTMLElement[], chars: HTMLElement[] }}
 */
export function splitText(element) {
  const text = element.textContent;
  const words = [];
  const chars = [];

  /* Clear existing content */
  element.innerHTML = '';

  /* Split by whitespace, filter empty strings */
  const wordStrings = text.split(/\s+/).filter(Boolean);

  wordStrings.forEach((wordStr, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';

    wordStr.split('').forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.classList.add('char');
      charSpan.style.display = 'inline-block';
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
      chars.push(charSpan);
    });

    element.appendChild(wordSpan);
    words.push(wordSpan);

    /* Add a space node between words (not after the last) */
    if (wordIndex < wordStrings.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  return { words, chars };
}

/**
 * Linear interpolation between two values.
 * @param {number} start
 * @param {number} end
 * @param {number} factor — 0 = start, 1 = end
 * @returns {number}
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Clamp a value between a minimum and maximum.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Extract normalised mouse/pointer coordinates from an event.
 * @param {MouseEvent|PointerEvent} e
 * @returns {{ x: number, y: number }}
 */
export function getMousePos(e) {
  return { x: e.clientX, y: e.clientY };
}

/**
 * Debounce a function — delays execution until `delay` ms after the last call.
 * @param {Function} fn
 * @param {number} delay — milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function — ensures it runs at most once per `delay` ms.
 * @param {Function} fn
 * @param {number} delay — milliseconds
 * @returns {Function}
 */
export function throttle(fn, delay) {
  let lastCall = 0;
  let timer;
  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    clearTimeout(timer);

    if (remaining <= 0) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Detect whether the device supports touch input.
 * @returns {boolean}
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if the user prefers reduced motion (accessibility).
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
