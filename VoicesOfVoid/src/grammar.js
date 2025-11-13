(function () {
  function makeDefaultGrammar() {
    return {
      syllablePatterns: ["CV", "CVL", "VC"],
      wordPatterns: {
        default: ["S", "SS", "SSS"],
        noun: ["S", "SS", "SSS"],
        verb: ["S", "SS", "SSS"],
        verb_past: ["S", "SS", "SSS"],
        adjective: ["S", "SS"],
        adverb: ["SS"],
        pronoun: ["S"],
        article: ["V", "S"],
        preposition: ["S"],
        conjunction: ["S"],
        copula: ["V", "CV"]
      }
    };
  }

  function pick(list, rng) {
    if (!list || !list.length) return "";
    const r = rng ? rng() : Math.random();
    const i = Math.floor(r * list.length);
    return list[i];
  }

  function pickWordPattern(grammar, partOfSpeech, rng) {
    const patterns =
      (grammar.wordPatterns && grammar.wordPatterns[partOfSpeech]) ||
      (grammar.wordPatterns && grammar.wordPatterns.default) ||
      ["S"];
    return pick(patterns, rng);
  }

  function expandSyllables(grammar, rng) {
    const patterns = grammar.syllablePatterns || ["CV"];
    return pick(patterns, rng);
  }

  function expandPatternToClasses(pattern, grammar, rng) {
    if (!pattern) return "";
    let out = "";
    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i];
      if (c === "S") {
        out += expandSyllables(grammar, rng);
      } else {
        out += c;
      }
    }
    return out;
  }

  function buildSkeleton(partOfSpeech, grammar, rng) {
    const p = pickWordPattern(grammar, partOfSpeech, rng);
    const expanded = expandPatternToClasses(p, grammar, rng);
    return expanded.split("");
  }

  function realizeFromSkeleton(skeleton, inventory, rng) {
    if (!skeleton || !skeleton.length) return "";
    const classes = (inventory && inventory.classes) || {};
    let out = "";
    for (let i = 0; i < skeleton.length; i++) {
      const symbol = skeleton[i];
      const pool = classes[symbol];
      if (pool && pool.length) {
        out += pick(pool, rng);
      } else {
        out += symbol.toLowerCase();
      }
    }
    return out;
  }

  function generateWord(partOfSpeech, grammar, inventory, rng) {
    const g = grammar || makeDefaultGrammar();
    const skeleton = buildSkeleton(partOfSpeech, g, rng);
    const surface = realizeFromSkeleton(skeleton, inventory, rng);
    return {
      partOfSpeech,
      skeleton,
      surface
    };
  }

  window.Grammar = {
    makeDefaultGrammar,
    pickWordPattern,
    expandPatternToClasses,
    buildSkeleton,
    realizeFromSkeleton,
    generateWord
  };
})();
