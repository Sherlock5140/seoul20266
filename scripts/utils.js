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

  global.Seoul2026Utils = {
    clone,
    escapeHtml,
    debounce,
    copyText
  };
})(window);
