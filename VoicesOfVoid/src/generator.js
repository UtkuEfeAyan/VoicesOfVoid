
function randomChoice(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// convert a string like "b d g k" into ["b","d","g","k"]
// cf no spaces, treat each character as its own symbol.
function normalizePhonemeList(source) {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source.slice();
  }

  const str = String(source).trim();

  if (str.includes(' ')) {
    return str
      .split(/\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // fo spaces: treat each char as a unit
  return [...str];
}

// fallback phoneme presets in case phonemes.js isn't loaded
const FALLBACK_PHONEMES = {
  neutral: {
    consonants: ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v'],
    vowels: ['a', 'e', 'i', 'o', 'u']
  }
};

// resolve phonemes for a given style + optional overrides from UI
function resolvePhonemes(style, options = {}) {
  const styleKey = style || 'neutral';
  const presetSource =
    (window.PHONEME_PRESETS && window.PHONEME_PRESETS[styleKey]) ||
    FALLBACK_PHONEMES.neutral;

  // clone so we don't mutate globals
  const phonemes = {
    consonants: presetSource.consonants ? presetSource.consonants.slice() : [],
    vowels: presetSource.vowels ? presetSource.vowels.slice() : []
  };

  if (options.consonantInput && options.consonantInput.trim().length > 0) {
    phonemes.consonants = normalizePhonemeList(options.consonantInput);
  }
  if (options.vowelInput && options.vowelInput.trim().length > 0) {
    phonemes.vowels = normalizePhonemeList(options.vowelInput);
  }

  return phonemes;
}

// word pattern templates 
const DEFAULT_WORD_PATTERNS = ['CV', 'CVC', 'VC', 'CVV', 'CCV'];

// build a single pseudo-word from phonemes + a pattern
function generateWordFromPattern(phonemes, pattern) {
  const { consonants, vowels } = phonemes;
  let result = '';

  for (const ch of pattern) {
    if (ch === 'C') {
      const c = randomChoice(consonants);
      if (c) result += c;
    } else if (ch === 'V') {
      const v = randomChoice(vowels);
      if (v) result += v;
    } else {
      // literal characters might be supported later or like have a glyph genrator
      result += ch;
    }
  }

  return result || 'ø';
}

// build an alphabet of size N consisting of unique symbols
function generateAlphabet(phonemes, size) {
  const target = size || 26;
  const set = new Set();
  let safety = target * 20;

  while (set.size < target && safety > 0) {
    const pattern = randomChoice(DEFAULT_WORD_PATTERNS);
    const glyph = generateWordFromPattern(phonemes, pattern);
    set.add(glyph);
    safety--;
  }

  return Array.from(set);
}


// wimple sentence patterns. Each entry is an array of POS keys from the vocabulary.
const SENTENCE_PATTERNS = [
  // i quietly watch the ancient tree.
  ['pronouns', 'adverbs?', 'verbs', 'articles', 'adjectives?', 'nouns'],

  // the red warrior marches slowly.
  ['articles', 'adjectives?', 'nouns', 'verbs', 'adverbs?'],

  //wWe travel through the misty forest.
  ['pronouns', 'verbs', 'prepositions', 'articles', 'adjectives?', 'nouns'],

  // the sun rises above the silent mountain.
  ['articles', 'nouns', 'verbs', 'prepositions', 'articles', 'adjectives?', 'nouns']
];

// Map vocabulary keys to gloss tags
const POS_TO_GLOSS = {
  pronouns: 'PRON',
  nouns: 'N',
  verbs: 'V',
  adjectives: 'ADJ',
  adverbs: 'ADV',
  prepositions: 'PREP',
  articles: 'ART',
  conjunctions: 'CONJ'
};

// generate single sentence (english + conlang + gloss info)
function generateSentence(vocab, phonemes, style = 'neutral') {
  const pattern = randomChoice(SENTENCE_PATTERNS) || SENTENCE_PATTERNS[0];

  const englishWords = [];
  const conlangWords = [];
  const posTags = [];

  for (let rawSlot of pattern) {
    let isOptional = false;

    if (rawSlot.endsWith('?')) {
      isOptional = true;
      rawSlot = rawSlot.slice(0, -1);
      // 50/50 chance to include optional slot
      if (Math.random() < 0.5) {
        continue;
      }
    }

    const bucket = vocab[rawSlot];
    if (!bucket || bucket.length === 0) continue;

    const eng = randomChoice(bucket);
    englishWords.push(eng);

    // conlang word   build from phonemes
    const wordPattern = randomChoice(DEFAULT_WORD_PATTERNS);
    const con = generateWordFromPattern(phonemes, wordPattern);
    conlangWords.push(con);

    posTags.push(POS_TO_GLOSS[rawSlot] || '?');
  }

  if (englishWords.length === 0) {
    return {
      english: '',
      conlang: '',
      words: [],
      conlangWords: [],
      pos: [],
      gloss: ''
    };
  }

  const englishSentence = capitalize(englishWords.join(' ')) + '.';
  const conlangSentence = capitalize(conlangWords.join(' ')) + '.';
  const glossLine = posTags.join(' ');

  return {
    english: englishSentence,
    conlang: conlangSentence,
    words: englishWords,
    conlangWords,
    pos: posTags,
    gloss: glossLine
  };
}

//generating function main
function generateLanguage(vocab, options = {}) {
  const style = options.style || 'neutral';
  const preset =
    (window.LANGUAGE_PRESETS && window.LANGUAGE_PRESETS[style]) ||
    (window.LANGUAGE_PRESETS && window.LANGUAGE_PRESETS.neutral) ||
    null;

  const phonemes = resolvePhonemes(style, options);

  const alphabetSize = options.alphabetSize || 26;
  const sentenceCount = options.sentenceCount || 5;

  const alphabet = generateAlphabet(phonemes, alphabetSize);
  const sentences = [];

  for (let i = 0; i < sentenceCount; i++) {
    const s = generateSentence(vocab, phonemes, style);
    if (s.english) {
      sentences.push(s);
    }
  }

  return {
    style,
    preset,
    phonemes,
    alphabet,
    sentences
  };
}

//expose globally for ui.js
window.LanguageGenerator = {
  generateLanguage,
  generateSentence,
  generateAlphabet,
  resolvePhonemes
};

//provide a simple global function for older calls, if i need any in future
window.generateLanguage = generateLanguage;
