/**
 * Lightweight i18n Engine for QR Code Generator
 * Supports English (en) and Arabic (ar) with RTL
 */
(function() {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'ar'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'lang';
  const RTL_LANGS = ['ar'];

  let dictionaries = {};
  let currentLang = DEFAULT_LANG;
  let isInitialized = false;

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - The object to search
   * @param {string} path - Dot-notated path (e.g., "input.size.label")
   * @returns {string|undefined}
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get translation for a key with optional interpolation
   * @param {string} key - Translation key (e.g., "button.generate")
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} - Translated string or fallback
   */
  function t(key, params = {}) {
    // Try current language
    let value = getNestedValue(dictionaries[currentLang], key);

    // Fallback to English if not found
    if (value === undefined && currentLang !== 'en') {
      value = getNestedValue(dictionaries['en'], key);
    }

    // Fallback to key if still not found
    if (value === undefined) {
      console.warn(`[i18n] Missing translation for key: ${key}`);
      return key;
    }

    // Handle interpolation {{param}}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        value = value.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }

    return value;
  }

  /**
   * Get current language
   * @returns {string}
   */
  function getLang() {
    return currentLang;
  }

  /**
   * Set language and apply translations
   * @param {string} lang - Language code ('en' or 'ar')
   * @returns {Promise<void>}
   */
  async function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn(`[i18n] Unsupported language: ${lang}. Using default.`);
      lang = DEFAULT_LANG;
    }

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Update HTML attributes
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL_LANGS.includes(lang) ? 'rtl' : 'ltr');

    // Update body classes
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(RTL_LANGS.includes(lang) ? 'rtl' : 'ltr');

    // Apply translations
    apply();

    // Update page title
    document.title = t('app.title');
  }

  /**
   * Apply translations to DOM elements
   * @param {HTMLElement} root - Root element to search (default: document)
   */
  function apply(root = document) {
    // data-i18n: textContent
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // data-i18n-html: innerHTML (use sparingly)
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    // data-i18n-placeholder: placeholder attribute
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    // data-i18n-title: title attribute
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(key));
    });

    // data-i18n-aria: aria-label attribute
    root.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });

    // Update language switcher active state
    root.querySelectorAll('[data-lang-switch]').forEach(el => {
      const switchLang = el.getAttribute('data-lang-switch');
      el.classList.toggle('active', switchLang === currentLang);
    });
  }

  /**
   * Load translation dictionaries
   * @returns {Promise<void>}
   */
  async function loadDictionaries() {
    const promises = SUPPORTED_LANGS.map(async (lang) => {
      try {
        const response = await fetch(`i18n/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        dictionaries[lang] = await response.json();
      } catch (error) {
        console.error(`[i18n] Failed to load ${lang}.json:`, error);
        dictionaries[lang] = {};
      }
    });

    await Promise.all(promises);
  }

  /**
   * Initialize i18n system
   * @returns {Promise<void>}
   */
  async function init() {
    if (isInitialized) return;

    // Load dictionaries
    await loadDictionaries();

    // Get saved language or use default
    const savedLang = localStorage.getItem(STORAGE_KEY);
    const initialLang = savedLang && SUPPORTED_LANGS.includes(savedLang)
      ? savedLang
      : DEFAULT_LANG;

    // Set language (this also applies translations)
    await setLang(initialLang);

    isInitialized = true;
  }

  // Expose global API
  window.i18n = {
    t,
    getLang,
    setLang,
    apply,
    init
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
