
async function loadVocabulary() {
  if (window.VOCABULARY) {
    return window.VOCABULARY;
  }

  try {
    const response = await fetch('data/vocabulary.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    window.VOCABULARY = data;
    return data;
  } catch (err) {
    console.error('[loadVocabulary] Failed to load data/vocabulary.json', err);

    if (window.VOCAB_FALLBACK) {
      console.warn('[loadVocabulary] Using VOCAB_FALLBACK from vocabulary.js');
      window.VOCABULARY = window.VOCAB_FALLBACK;
      return window.VOCAB_FALLBACK;
    }

    throw err;
  }
}

// expose globally so ui.js can call it
window.loadVocabulary = loadVocabulary;
