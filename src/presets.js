//presets mai n structure was put into chat gtp then was given some prompts 
// to do some of the tedious work of filling in the details 
//however it wasnt able to do wha ti wanted for specific wovels and consonants 
// so i went back and changed/refined the  wovels and consonants manually 
// for each of the different languages to fit what i wanted for teh feel of the languages
// and thsi is the chat you can look at it https://chatgpt.com/share/692bc300-3e94-800a-860e-38db08fd6e88

window.LANGUAGE_PRESETS = {
  elven: {
    id: "elven",
    name: "Elven",
    description: "Balanced inventory with bright vowels. Word order: VSO — verb–subject–object.",
    grammar: {
      wordOrder: "vso",
      syllablePattern: "cvc",
      maxSyllables: 4
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z", "sh", "th", "ch", "ð", "θ", "ʃ", "ʒ"],
      vowels: ["a", "e", "i", "o", "u", "æ", "ø", "aa", "ee", "oo", "ii", "ai", "au", "oi", "ae", "oe", "ue", "eː", "iː", "oː"],
      syllablePreset: "cvc",
      maxSyllables: 4
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  dwarven: {
    id: "dwarven",
    name: "Dwarven",
    description: "Heavy clusters, back vowels, and chunky CVC words. Word order: SOV.",
    grammar: {
      wordOrder: "sov",
      syllablePattern: "ccvc",
      maxSyllables: 3
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "t", "v", "w", "ɣ", "ʀ", "ŋ", "x", "χ", "ʁ", "kh", "gh", "th"],
      vowels: ["a", "o", "u", "ɑ", "ɔ", "ɪ", "ʊ", "aa", "oo", "uu", "au", "ao", "ou", "aː", "oː", "uː"],
      syllablePreset: "ccvc",
      maxSyllables: 3
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  englishModern: {
    id: "englishModern",
    name: "Futuristic/Standard",
    description: "Clean, efficient modern sounds with clear phoneme distinctions. Contemporary feel. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "cvc",
      maxSyllables: 4
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z", "sh", "th", "ch", "ŋ", "ʃ", "ð", "θ"],
      vowels: ["a", "e", "i", "o", "u", "æ", "ɪ", "ɛ", "ʊ", "ɔ", "ə", "ai", "au", "oi", "iː", "eː", "oː", "uː"],
      syllablePreset: "cvc",
      maxSyllables: 4
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  germanModern: {
    id: "germanModern",
    name: "Germanic",
    description: "Strong consonant clusters, umlauts, and gutturals. Classic Germanic features. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "ccvc",
      maxSyllables: 3
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z", "ch", "sch", "pf", "ts", "ŋ", "x", "ʃ", "ʒ", "ç"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ʊ", "ɛ", "ɔ", "ø", "ʏ", "aa", "ee", "ii", "oo", "uu", "ai", "au", "ei", "aː", "eː", "iː", "oː", "uː"],
      syllablePreset: "ccvc",
      maxSyllables: 3
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  russianModern: {
    id: "russianModern",
    name: "Slavic",
    description: "Dense consonant clusters, palatal sounds, and Cyrillic-inspired phonology. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "ccvc",
      maxSyllables: 4
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "z", "sh", "zh", "kh", "ts", "ch", "ŋ", "ʃ", "ʒ", "x", "ʂ", "ʐ"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ə", "ɛ", "ɔ", "ʊ", "yː", "ə", "aa", "ee", "ii", "oo", "uu", "ai", "au", "oi", "aː", "eː", "iː", "oː", "uː"],
      syllablePreset: "ccvc",
      maxSyllables: 4
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  reptilian: {
    id: "reptilian",
    name: "Reptilian",
    description: "Hissing sibilants, long tense vowels, and a slow coiled rhythm. Word order: SOV.",
    grammar: {
      wordOrder: "sov",
      syllablePattern: "cvc",
      maxSyllables: 3
    },
    phonology: {
      consonants: ["s", "z", "sh", "zh", "ts", "k", "kh", "g", "l", "n", "ʃ", "ʒ", "ɕ", "ʂ", "ʐ", "x", "ɣ", "ŋ", "ɬ"],
      vowels: ["i", "u", "a", "iː", "uː", "aː", "ɪ", "ʊ", "ɔ", "ii", "uu", "aa", "ai", "au", "ia", "ua"],
      syllablePreset: "cvc",
      maxSyllables: 3
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  robotic: {
    id: "robotic",
    name: "Robotic",
    description: "Very regular and efficient, with a small clear inventory and a slightly synthetic look. Mostly CV/CVC. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "cv",
      maxSyllables: 2
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "k", "l", "m", "n", "p", "r", "s", "t", "z", "sh", "th", "x", "ʃ"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ə", "eː", "iː", "oː", "uː", "aa", "ee", "oo", "ii"],
      syllablePreset: "cv",
      maxSyllables: 2
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  eldritch: {
    id: "eldritch",
    name: "Eldritch",
    description: "Alien and unsettling: harsh fricatives, strange vowels, and edge-clusters. Word order: VSO.",
    grammar: {
      wordOrder: "vso",
      syllablePattern: "ccvc",
      maxSyllables: 4
    },
    phonology: {
      consonants: ["p", "b", "t", "d", "k", "g", "f", "s", "z", "ʃ", "x", "ɣ", "m", "n", "r", "l", "ʀ", "ŋ", "sh", "y", "th", "ch", "χ", "ʁ", "ħ", "ʕ", "θ", "ð", "ʔ", "ʒ", "ɬ", "ɸ", "β"],
      vowels: ["a", "o", "u", "e", "i", "ɑ", "ɔ", "ɪ", "æ", "ø", "aa", "ee", "oo", "ii", "ai", "au", "oi", "ae", "oe", "ue", "iː", "eː", "aː", "oː", "uː", "yː", "ɨ", "ʉ", "ɔ", "ʊ"],
      syllablePreset: "ccvc",
      maxSyllables: 4
    },
    writing: {
      system: "alphabet",
      direction: "rtl"
    }
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Sharp, fast street-clipped sounds with tech bite. Short CV/CVC words. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "cvc",
      maxSyllables: 2
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "z", "sh", "x", "ts", "ʃ", "ʒ", "ɕ", "ʂ", "ʐ"],
      vowels: ["a", "e", "i", "o", "u", "ɪ", "ə", "ɛ", "æ", "ai", "ei", "oi", "iː", "eː", "oː", "uː"],
      syllablePreset: "cvc",
      maxSyllables: 2
    },
    writing: {
      system: "alphabet",
      direction: "ltr"
    }
  },
  steampunk: {
    id: "steampunk",
    name: "Steampunk",
    description: "Old industrial and faintly aristocratic: clusters, clear vowels, and formal endings. Word order: SVO.",
    grammar: {
      wordOrder: "svo",
      syllablePattern: "ccvc",
      maxSyllables: 4
    },
    phonology: {
      consonants: ["b", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z", "th", "ch", "sh", "ʃ", "ʒ", "θ", "ð", "kh", "ŋ"],
      vowels: ["a", "e", "i", "o", "u", "æ", "ɔ", "aa", "ee", "oo", "ii", "ai", "au", "oi", "ae", "oe", "aː", "eː", "iː", "oː"],
      syllablePreset: "ccvc",
      maxSyllables: 4
    },
    writing: {
      system: "alphabet",
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
    name: p.name
  }));
}

window.LANGUAGE_PRESETS = LANGUAGE_PRESETS;
window.getPresetById = getPresetById;
window.getAllPresetOptions = getAllPresetOptions;
