(function attachTravelGuideUtils(global) {
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const escapeHtml = (text) => {
    if (typeof text !== 'string') return String(text ?? '');
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
      const copied = document.execCommand('copy');
      document.body.removeChild(textArea);
      return copied;
    } catch (error) {
      console.warn('Copy failed', error);
      return false;
    }
  };

  const copyText = async (text) => {
    if (!text) return false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn('Clipboard API copy failed, falling back', error);
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
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

  const compressToBase64Url = async (value) => {
    if (typeof CompressionStream === 'undefined') {
      return encodeBase64Url(value);
    }
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    const bytes = new TextEncoder().encode(text);
    const cs = new CompressionStream('deflate-raw');
    const writer = cs.writable.getWriter();
    await writer.write(bytes);
    await writer.close();
    const chunks = [];
    const reader = cs.readable.getReader();
    for (;;) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      chunks.push(chunk);
    }
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const compressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      compressed.set(chunk, offset);
      offset += chunk.length;
    }
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < compressed.length; i += chunkSize) {
      binary += String.fromCharCode(...compressed.subarray(i, i + chunkSize));
    }
    return `z.${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
  };

  const decompressFromBase64Url = async (value) => {
    const raw = String(value || '');
    const isCompressed = raw.startsWith('z.');
    if (!isCompressed || typeof DecompressionStream === 'undefined') {
      return decodeBase64Url(isCompressed ? raw.slice(2) : raw);
    }
    const normalized = raw.slice(2).replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    await writer.write(bytes);
    await writer.close();
    const chunks = [];
    const reader = ds.readable.getReader();
    for (;;) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      chunks.push(chunk);
    }
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    let pos = 0;
    for (const chunk of chunks) {
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return new TextDecoder().decode(result);
  };

  const utils = {
    clone,
    escapeHtml,
    debounce,
    copyText,
    encodeBase64Url,
    decodeBase64Url,
    compressToBase64Url,
    decompressFromBase64Url
  };
  global.TravelGuideUtils = utils;
  global.Seoul2026Utils = utils;
})(window);
