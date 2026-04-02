(function attachSeoul2026Utils(global) {
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const escapeHtml = (text) => {
    if (typeof text !== 'string') return text;
    const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (match) => htmlEntities[match]);
  };

  const debounce = (fn, delay) => {
    let timeoutId = null;
    let lastArgs = [];

    const debounced = (...args) => {
      lastArgs = args;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };

    debounced.flush = () => {
      if (!timeoutId) return;
      clearTimeout(timeoutId);
      timeoutId = null;
      fn(...lastArgs);
    };

    return debounced;
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (error) {
      console.warn('Copy failed', error);
    }
  };

  const copyText = (text) => {
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      return;
    }
    fallbackCopy(text);
  };

  const encodeBase64Url = (value) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, index + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  };

  const decodeBase64Url = (value) => {
    if (!value) return '';
    const normalized = String(value)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  global.Seoul2026Utils = {
    clone,
    escapeHtml,
    debounce,
    copyText,
    encodeBase64Url,
    decodeBase64Url
  };
})(window);
