(function () {
  const presets = {
    neutral: {
      label: "neutral",
      consonants: ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y", "z"],
      vowels: ["a", "e", "i", "o", "u"],
      wordStructures: ["CV", "CVC", "CVCV"]
    },

    elven: {
      label: "elven",
      consonants: ["l", "m", "n", "r", "s", "v", "y", "h", "th", "dh"],
      vowels: ["a", "e", "i", "o", "u", "ai", "ea", "ie"],
      wordStructures: ["CV", "CVV", "CVL", "LVC", "CVCV"]
    },

    dwarven: {
      label: "dwarven",
      consonants: [
        "b", "d", "g", "k", "p", "t", "r", "z",
        "kh", "gr", "dr", "kr", "tr", "br"
      ],
      vowels: ["a", "o", "u", "ai", "oi"],
      wordStructures: ["CVC", "CVCC", "CCVC", "CVCVC"]
    },

    eldritch: {
      label: "eldritch",
      consonants: ["k", "x", "ʃ", "ʒ", "θ", "ð", "ŋ", "r", "h", "ʔ"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ʊ", "ɔ", "æ"],
      wordStructures: ["CVC", "VCVC", "CVCVC", "VCCVC"]
    },

    scifi: {
      label: "sci-fi",
      consonants: ["z", "x", "k", "t", "v", "s", "r", "n", "m", "ʃ"],
      vowels: ["a", "e", "i", "o", "u", "y"],
      wordStructures: ["CV", "CVC", "CVCC", "CVCV"]
    }
  };

  function parsePhonemeInput(text) {
    if (!text) return [];
    return text
      .split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function getProfile(key, overrides) {
    const preset = presets[key] || presets.neutral;

    let consonants = preset.consonants.slice();
    let vowels = preset.vowels.slice();
    const wordStructures = preset.wordStructures.slice();

    if (overrides && overrides.customConsonantsText) {
      const parsed = parsePhonemeInput(overrides.customConsonantsText);
      if (parsed.length > 0) consonants = parsed;
    }

    if (overrides && overrides.customVowelsText) {
      const parsed = parsePhonemeInput(overrides.customVowelsText);
      if (parsed.length > 0) vowels = parsed;
    }

    return {
      label: preset.label,
      consonants,
      vowels,
      wordStructures
    };
  }

  window.Phonemes = {
    presets,
    getProfile
  };
})();
