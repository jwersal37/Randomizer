/**
 * Encodes text entries into a URL-safe base64 string
 * @param {string} text - The text to encode
 * @returns {string} - URL-safe encoded string
 */
export function encodeEntries(text) {
  if (!text || text.trim() === '') return '';
  try {
    const encoded = btoa(unescape(encodeURIComponent(text)));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Error encoding entries:', e);
    return '';
  }
}

/**
 * Decodes a URL-safe base64 string back to text entries
 * @param {string} encoded - The encoded string
 * @returns {string} - Decoded text
 */
export function decodeEntries(encoded) {
  if (!encoded) return '';
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = decodeURIComponent(escape(atob(base64 + padding)));
    return decoded;
  } catch (e) {
    console.error('Error decoding entries:', e);
    return '';
  }
}

/**
 * Generates a shareable URL with encoded entries
 * @param {string} text - The text to share
 * @returns {string} - Complete shareable URL
 */
export function generateShareUrl(text) {
  const encoded = encodeEntries(text);
  if (!encoded) return '';
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?entries=${encoded}`;
}

/**
 * Extracts encoded entries from URL query parameters
 * @returns {string|null} - Encoded entries string or null
 */
export function getEntriesFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('entries');
}
