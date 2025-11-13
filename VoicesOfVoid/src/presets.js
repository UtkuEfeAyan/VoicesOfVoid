const LANGUAGE_PRESETS = {
  elven: {
    id: "elven",
    label: "Elven",
    phonology: {
      consonants: ["f", "v", "s", "z", "ʃ", "h", "l", "r", "m", "n"],
      vowels: ["a", "e", "i", "o", "u", "y"],
      inventoryPreset: "simple-5",
      classPreset: "cvl",
      syllablePreset: "cv-cv",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "light",
      verbMorph: "light",
      derivation: "suffixing"
    },
    lexicon: {
      size: "medium",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  dwarven: {
    id: "dwarven",
    label: "Dwarven",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "s", "z", "ʃ", "m", "n", "r", "l"],
      vowels: ["a", "o", "u", "e", "i"],
      inventoryPreset: "balanced",
      classPreset: "cvlx",
      syllablePreset: "cvc",
      maxSyllables: 2
    },
    grammar: {
      wordOrder: "sov",
      nounMorph: "rich",
      verbMorph: "light",
      derivation: "suffixing"
    },
    lexicon: {
      size: "medium",
      properNames: "rich",
      etymology: "light"
    },
    writing: {
      scriptType: "abjad",
      direction: "rtl"
    }
  },

  eldritch: {
    id: "eldritch",
    label: "Eldritch",
    phonology: {
      consonants: ["k", "g", "q", "x", "χ", "s", "z", "ʃ", "ʂ", "ɣ", "ʀ", "h", "ʔ", "ŋ", "ɬ"],
      vowels: ["a", "e", "i", "o", "u", "y", "ɨ", "ə"],
      inventoryPreset: "dense",
      classPreset: "cvlx",
      syllablePreset: "wild",
      maxSyllables: 4
    },
    grammar: {
      wordOrder: "vso",
      nounMorph: "rich",
      verbMorph: "rich",
      derivation: "mixed"
    },
    lexicon: {
      size: "large",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "btt"
    }
  },

  cyberpunk: {
    id: "cyberpunk",
    label: "Cyberpunk",
    phonology: {
      consonants: ["t", "d", "k", "g", "p", "b", "s", "z", "ʃ", "ʒ", "f", "v", "m", "n", "r", "l", "j"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ɔ"],
      inventoryPreset: "balanced",
      classPreset: "cvlx",
      syllablePreset: "cv",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "isolating",
      verbMorph: "light",
      derivation: "suffixing"
    },
    lexicon: {
      size: "medium",
      properNames: "rich",
      etymology: "light"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  reptilian: {
    id: "reptilian",
    label: "Reptilian",
    phonology: {
      consonants: ["s", "z", "ʂ", "ʃ", "ts", "ks", "k", "g", "r", "ʀ", "h"],
      vowels: ["a", "e", "i", "o", "u", "ɜ"],
      inventoryPreset: "balanced",
      classPreset: "cvlx",
      syllablePreset: "cvcc",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "sov",
      nounMorph: "light",
      verbMorph: "rich",
      derivation: "prefixing"
    },
    lexicon: {
      size: "small",
      properNames: "simple",
      etymology: "light"
    },
    writing: {
      scriptType: "syllabary",
      direction: "rtl"
    }
  },

  robotic: {
    id: "robotic",
    label: "Robotic",
    phonology: {
      consonants: ["p", "t", "k", "b", "d", "g", "f", "s", "z", "ʃ", "m", "n", "l", "r"],
      vowels: ["i", "e", "a", "o", "u", "ə"],
      inventoryPreset: "simple-5",
      classPreset: "cvl",
      syllablePreset: "cv",
      maxSyllables: 2
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "isolating",
      verbMorph: "isolating",
      derivation: "suffixing"
    },
    lexicon: {
      size: "small",
      properNames: "simple",
      etymology: "none"
    },
    writing: {
      scriptType: "featural",
      direction: "ltr"
    }
  }
};

function getPresetById(id) {
  return LANGUAGE_PRESETS[id] || LANGUAGE_PRESETS.elven;
}

function getAllPresetOptions() {
  return Object.values(LANGUAGE_PRESETS).map(p => ({
    id: p.id,
    label: p.label
  }));
}

window.LANGUAGE_PRESETS = LANGUAGE_PRESETS;
window.getPresetById = getPresetById;
window.getAllPresetOptions = getAllPresetOptions;
