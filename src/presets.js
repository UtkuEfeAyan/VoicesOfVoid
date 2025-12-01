// presets main structure was put into chatgpt then was given some prompts
// to do some of the tedious work of filling in the details
// however it wasnt able to do what i wanted for specific vowels and consonants
// so i went back and changed and refined the vowels and consonants manually
// for each of the different languages to fit what i wanted for the feel of the languages
// and this is the chat you can look at it https://chatgpt.com/share/692bc300-3e94-800a-860e-38db08fd6e88

const LANGUAGE_PRESETS = {
  elven: {
    id: "elven",
    label: "Elven",
    tagline:
      "Balanced inventory with bright vowels. Word order: VSO — verb–subject–object.",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "v", "s", "z", "ʃ", "h", "l", "r", "m", "n", "j", "w"],
      vowels: ["a", "e", "i", "o", "u", "y", "æ", "ø"],
      inventoryPreset: "balanced",
      classPreset: "cvxl",
      syllablePreset: "ccvc",
      maxSyllables: 4
    },
    grammar: {
      wordOrder: "vso",
      nounMorph: "rich",
      verbMorph: "rich",
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
    tagline:
      "Heavy clusters, back vowels, and chunky CVC words. Word order: SOV.",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "s", "z", "ʃ", "x", "ɣ", "m", "n", "r", "l", "ʀ", "ŋ"],
      vowels: ["a", "o", "u", "e", "i", "ɑ", "ɔ", "ɪ"],
      inventoryPreset: "heavy",
      classPreset: "cxl",
      syllablePreset: "cvc",
      maxSyllables: 4
    },
    grammar: {
      wordOrder: "sov",
      nounMorph: "rich",
      verbMorph: "moderate",
      derivation: "compounding"
    },
    lexicon: {
      size: "large",
      properNames: "very rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "abugida",
      direction: "ltr"
    }
  },

  englishModern: {
    id: "englishModern",
    label: "Modern English",
    tagline:
      "Modern spelling inventory (th/sh/ch) with flexible clusters. Word order: SVO.",
    phonology: {
      consonants: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "sh", "z", "y", "th", "ch"],
      vowels: ["a", "e", "i", "o", "u", "aa", "ee", "oo", "ii", "ai", "au", "oi", "ae", "oe", "ue"],
      inventoryPreset: "balanced",
      classPreset: "cvxl",
      syllablePreset: "ccvc",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "light",
      verbMorph: "light",
      derivation: "compounding"
    },
    lexicon: {
      size: "large",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  germanModern: {
    id: "germanModern",
    label: "Modern German",
    tagline:
      "Modern spelling (sch/ch/pf/ts) with strong clusters and compact compounds. Word order: SVO (with V2 flavor).",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "v", "s", "z", "sch", "ch", "h", "pf", "ts", "m", "n", "ng", "l", "r", "j", "w"],
      vowels: ["a", "e", "i", "o", "u", "ae", "oe", "ue", "aa", "ee", "ii", "oo", "uu"],
      inventoryPreset: "heavy",
      classPreset: "cxl",
      syllablePreset: "ccvc",
      maxSyllables: 2
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "moderate",
      verbMorph: "moderate",
      derivation: "compounding"
    },
    lexicon: {
      size: "large",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  russianModern: {
    id: "russianModern",
    label: "Modern Russian",
    tagline:
      "Romanized Cyrillic feel (sh/zh/kh/ts/ch/shch) with dense consonants. Word order: SVO (often free).",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "v", "s", "z", "sh", "zh", "kh", "ts", "ch", "shch", "m", "n", "r", "l", "y"],
      vowels: ["a", "e", "i", "o", "u", "y", "ya", "ye", "yo", "yu"],
      inventoryPreset: "heavy",
      classPreset: "cxl",
      syllablePreset: "ccvc",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "rich",
      verbMorph: "moderate",
      derivation: "suffixing"
    },
    lexicon: {
      size: "large",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  reptilian: {
    id: "reptilian",
    label: "Reptilian",
    tagline:
      "Hissing sibilants, long tense IPA vowels, and a slow coiled rhythm. Word order: SOV.",
    phonology: {
      consonants: ["s", "z", "sh", "zh", "ts", "ch", "k", "g", "t", "d", "p", "b", "kh", "gh", "h", "m", "n", "l", "r", "y", "w"],
      vowels: ["i", "e", "a", "o", "u", "y", "iː", "eː", "aː", "oː", "uː", "yː"],
      inventoryPreset: "balanced",
      classPreset: "cvxl",
      syllablePreset: "cvc",
      maxSyllables: 4
    },
    grammar: {
      wordOrder: "sov",
      nounMorph: "medium",
      verbMorph: "rich",
      derivation: "suffixing"
    },
    lexicon: {
      size: "medium",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "rtl"
    }
  },

  robotic: {
    id: "robotic",
    label: "Robotic",
    tagline:
      "Very regular and efficient, with a small clear inventory and a slightly synthetic IPA look. Mostly CV/CVC. Word order: SVO.",
    phonology: {
      consonants: ["p", "t", "k", "b", "d", "g", "m", "n", "s", "z", "l", "r", "ʔ", "ɸ", "ʃ"],
      vowels: ["a", "e", "i", "o", "u", "ə", "ɨ", "ʉ", "æ", "ɔ"],
      inventoryPreset: "light",
      classPreset: "cv",
      syllablePreset: "cvc",
      maxSyllables: 2
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "very light",
      verbMorph: "very light",
      derivation: "compounding"
    },
    lexicon: {
      size: "small",
      properNames: "light",
      etymology: "none"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  eldritch: {
    id: "eldritch",
    label: "Eldritch",
    tagline:
      "Alien and unsettling: harsh fricatives, strange vowels, and edge-clusters. Word order: VSO.",
    phonology: {
      consonants: ["ɣ", "χ", "ʁ", "ħ", "ʕ", "θ", "ð", "s", "z", "ʃ", "ʒ", "ɬ", "k", "q", "t", "p", "m", "ʀ", "ŋ", "l","ʔ", "ɸ", "β", "j", "w"],
      vowels: ["ø", "ɯ", "ɨ", "ə", "æ", "ɒ", "a", "e", "i", "o", "u", "ɪ", "ʊ"],
      inventoryPreset: "heavy",
      classPreset: "cxl",
      syllablePreset: "ccvc",
      maxSyllables: 5
    },
    grammar: {
      wordOrder: "vso",
      nounMorph: "complex",
      verbMorph: "complex",
      derivation: "mixed"
    },
    lexicon: {
      size: "large",
      properNames: "very rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "runes",
      direction: "ttb"
    }
  },

  cyberpunk: {
    id: "cyberpunk",
    label: "Cyberpunk",
    tagline:
      "Sharp, fast street-clipped sounds with tech bite. Short CV/CVC words. Word order: SVO.",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "v", "s", "z", "sh", "zh", "h", "ts", "ch", "j", "m", "n", "l", "r", "y", "w"],
      vowels: ["a", "e", "i", "o", "u", "uh", "ai"],
      inventoryPreset: "balanced",
      classPreset: "cv",
      syllablePreset: "cvc",
      maxSyllables: 2
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "light",
      verbMorph: "light",
      derivation: "compounding"
    },
    lexicon: {
      size: "medium",
      properNames: "medium",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  },

  steampunk: {
    id: "steampunk",
    label: "Steampunk",
    tagline:
      "Old industrial and faintly aristocratic: clusters, clear long vowels, and formal endings. Word order: SVO.",
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "v", "th", "s", "z", "sh", "zh", "h", "m", "n", "ng", "l", "r", "w", "y", "ts", "ch"],
      vowels: ["a", "e", "i", "o", "u", "ae", "oe", "aa", "ee", "ii", "oo", "uu"],
      inventoryPreset: "heavy",
      classPreset: "cxl",
      syllablePreset: "cvc",
      maxSyllables: 3
    },
    grammar: {
      wordOrder: "svo",
      nounMorph: "moderate",
      verbMorph: "moderate",
      derivation: "suffixing"
    },
    lexicon: {
      size: "large",
      properNames: "rich",
      etymology: "layered"
    },
    writing: {
      scriptType: "alphabet",
      direction: "ltr"
    }
  }
};

function getPresetById(id) {
  return LANGUAGE_PRESETS[id] || LANGUAGE_PRESETS.elven;
}

function getAllPresetOptions() {
  return Object.values(LANGUAGE_PRESETS).map((p) => ({
    id: p.id,
    label: p.label
  }));
}

window.LANGUAGE_PRESETS = LANGUAGE_PRESETS;
window.getPresetById = getPresetById;
window.getAllPresetOptions = getAllPresetOptions;
