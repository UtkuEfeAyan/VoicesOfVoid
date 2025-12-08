// generator.js
// handles vocab loading, lexicon building, and sample sentences

(function () {
  const state = {
    config: null,
    vocab: null,
    lexicon: {
      nouns: [],
      verbs: [],
      prepositions: [],
      articles: [],
      pronouns: [],
      conjunctions: [],
      descriptors: []
    }
  };

  function init() {
    loadVocabulary()
      .then(function () {
        rebuildIfReady();
      })
      .catch(function (err) {
        console.error("failed to load vocabulary.json:", err);
      });
  }

  function receiveConfig(cfg) {
    state.config = cfg;
    rebuildIfReady();
  }

  function rerollLexicon() {
    if (!state.vocab || !state.config) {
      console.error("Cannot reroll: vocab or config missing");
      return;
    }
    buildLexicon();
    renderLexicon();
    renderAlphabetMap();
    renderSentences();
  }

  function rerollSentences() {
    if (!hasLexicon()) {
      console.error("Cannot reroll sentences: no lexicon");
      return;
    }
    renderSentences();
  }

  async function loadVocabulary() {
    try {
      const res = await fetch("data/vocabulary.json");
      if (!res.ok) throw new Error("Failed to load vocabulary.json");
      state.vocab = await res.json();
    } catch (err) {
      throw new Error("Could not load vocabulary.json: " + err.message);
    }
  }

  function rebuildIfReady() {
    if (!state.vocab || !state.config) return;
    buildLexicon();
    renderLexicon();
    renderAlphabetMap();
    renderSentences();
  }

  function hasLexicon() {
    return state.lexicon.verbs && state.lexicon.verbs.length > 0;
  }

  function buildLexicon() {
    function buildEntries(list, pos) {
      if (!Array.isArray(list)) return [];
      return list.map(function (gloss) {
        const nativeWord = generateWord(state.config.phonology, state.config.writing, state.config.grammar, state.config.lexicon);
        return {
          gloss: gloss,
          native: nativeWord,
          pos: pos,
          root: nativeWord,
          forms: {
            base: nativeWord
          },
          etymology: state.config.lexicon?.etymology || "layered",
          properName: shouldBeProperName(pos, state.config.lexicon?.properNames),
          nounMorphology: state.config.grammar?.nounMorph,
          verbMorphology: state.config.grammar?.verbMorph
        };
      });
    }

    state.lexicon.nouns = buildEntries(state.vocab.nouns || [], "noun");
    state.lexicon.verbs = buildEntries(state.vocab.verbs || [], "verb");
    state.lexicon.prepositions = buildEntries(state.vocab.prepositions || [], "preposition");
    state.lexicon.articles = buildEntries(state.vocab.articles || [], "article");
    state.lexicon.pronouns = buildEntries(state.vocab.pronouns || [], "pronoun");
    state.lexicon.conjunctions = buildEntries(state.vocab.conjunctions || [], "conjunction");
    state.lexicon.descriptors = buildEntries(state.vocab.descriptors || [], "descriptor");
  }

  function shouldBeProperName(pos, properNameSetting) {
    if (!properNameSetting || properNameSetting === "none") return false;
    if (properNameSetting === "light") return Math.random() < 0.1;
    if (properNameSetting === "rich") return Math.random() < 0.3;
    if (properNameSetting === "very rich") return Math.random() < 0.5;
    return false;
  }



  function renderLexicon() {
    renderWordCategorySummary();

    renderLexiconTable(state.lexicon.nouns, ["lexicon-nouns-body"]);
    renderLexiconTable(state.lexicon.verbs, ["lexicon-verbs-body"]);
    renderLexiconTable(state.lexicon.prepositions, ["lexicon-prepositions-body"]);
    renderLexiconTable(state.lexicon.articles, ["lexicon-articles-body"]);
    renderLexiconTable(state.lexicon.pronouns, ["lexicon-pronouns-body"]);
    renderLexiconTable(state.lexicon.conjunctions, ["lexicon-conjunctions-body"]);
    renderLexiconTable(state.lexicon.descriptors, ["lexicon-descriptors-body"]);
  }

  function renderWordCategorySummary() {
    const el = document.getElementById("word-category-summary");
    if (!el) return;

    const categories = [
      { label: "nouns", count: state.lexicon.nouns.length },
      { label: "verbs", count: state.lexicon.verbs.length },
      { label: "prepositions", count: state.lexicon.prepositions.length },
      { label: "articles", count: state.lexicon.articles.length },
      { label: "pronouns", count: state.lexicon.pronouns.length },
      { label: "conjunctions", count: state.lexicon.conjunctions.length },
      { label: "descriptors", count: state.lexicon.descriptors.length }
    ];

    el.innerHTML = categories
      .map(function (cat) { return `<div class="meta-line">${cat.label}: ${cat.count}</div>`; })
      .join("");
  }

  function renderLexiconTable(entries, targetIds) {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];

    let body = null;
    for (let i = 0; i < ids.length; i++) {
      if (!ids[i]) continue;
      body = document.getElementById(ids[i]);
      if (body) break;
    }
    if (!body) return;

    body.innerHTML = "";

    entries.forEach(function (entry) {
      const row = document.createElement("div");
      row.className = "lex-row";

      const colNative = document.createElement("div");
      colNative.className = "lex-col lex-native";
      const displayNative = entry.properName ? capitalizeWord(entry.native) : entry.native;
      colNative.textContent = displayNative;

      const colGloss = document.createElement("div");
      colGloss.className = "lex-col lex-gloss";
      colGloss.textContent = entry.gloss;

      row.appendChild(colNative);
      row.appendChild(colGloss);

      body.appendChild(row);
    });
  }

  function capitalizeWord(word) {
    if (!word || word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function renderSentences() {
    const container = document.getElementById("sentence-list");
    if (!container) return;

    container.innerHTML = "";
    if (!hasLexicon()) return;

    const direction = state.config?.writing?.direction || "ltr";
    
    // Add vertical-sentences class for top-to-bottom and bottom-to-top directions
    if (direction === "ttb" || direction === "btt") {
      container.classList.add("vertical-sentences");
    } else {
      container.classList.remove("vertical-sentences");
    }
    
    const sentences = [];
    for (let i = 0; i < 3; i++) {
      sentences.push(makeSentence());
    }

    sentences.forEach(function (s) {
      const card = document.createElement("article");
      card.className = "sentence-card";
      
      // Add vertical-mode class for top-to-bottom and bottom-to-top
      if (direction === "ttb" || direction === "btt") {
        card.classList.add("vertical-mode");
      }
      
      // Apply direction-specific styling
      applyDirectionStyle(card, direction);

      const line1 = document.createElement("div");
      line1.className = "sent-line sent-conlang";
      line1.textContent = s.conlang;
      applyDirectionStyle(line1, direction);

      const line2 = document.createElement("div");
      line2.className = "sent-line sent-english";
      line2.textContent = s.english;
      applyDirectionStyle(line2, direction);

      card.appendChild(line1);
      card.appendChild(line2);
      container.appendChild(card);
    });
  }

  function applyDirectionStyle(element, direction) {
    if (direction === "rtl") {
      element.style.direction = "rtl";
      element.style.textAlign = "right";
    } else if (direction === "ttb") {
      // Top-to-bottom: stack characters vertically
      element.style.writingMode = "vertical-rl";
      element.style.textOrientation = "upright";
      element.style.display = "flex";
      element.style.justifyContent = "flex-start";
    } else if (direction === "btt") {
      // Bottom-to-top: stack characters vertically in reverse
      element.style.writingMode = "vertical-lr";
      element.style.textOrientation = "upright";
      element.style.display = "flex";
      element.style.justifyContent = "flex-start";
    } else {
      // ltr (default)
      element.style.direction = "ltr";
      element.style.textAlign = "left";
    }
  }

  function makeSentence() {
    const order = (state.config?.grammar?.wordOrder) || "svo";
    const nounMorph = state.config?.grammar?.nounMorph || "moderate";
    const verbMorph = state.config?.grammar?.verbMorph || "moderate";
    const derivation = state.config?.grammar?.derivation || "suffixing";

    const subj = pickRandom(state.lexicon.nouns);
    const obj = pickRandom(state.lexicon.nouns);
    const verb = pickRandom(state.lexicon.verbs);
    const descAdj = pickRandom(state.lexicon.descriptors);
    const descAdv = pickRandom(state.lexicon.descriptors);

    // Apply morphological complexity to words
    const subjForm = applyNounMorphology(subj.native, nounMorph, derivation);
    const objForm = applyNounMorphology(obj.native, nounMorph, derivation);
    const verbForm = applyVerbMorphology(verb.native, verbMorph, derivation);

    const slotsConlang = {
      S_adj: descAdj?.native,
      S: subjForm,
      V: verbForm,
      V_adv: descAdv?.native,
      O: objForm
    };

    const slotsGloss = {
      S_adj: descAdj?.gloss,
      S: subj.gloss,
      V: verb.gloss,
      V_adv: descAdv?.gloss,
      O: obj.gloss
    };

    const seq = wordOrderToSequence(order);
    const conlangTokens = [];
    const glossTokens = [];

    seq.forEach(function (code) {
      if (code === "S") {
        if (slotsConlang.S_adj) {
          conlangTokens.push(slotsConlang.S_adj);
          glossTokens.push(slotsGloss.S_adj + " (adj)");
        }
        conlangTokens.push(slotsConlang.S);
        glossTokens.push(slotsGloss.S);
      } else if (code === "V") {
        conlangTokens.push(slotsConlang.V);
        glossTokens.push(slotsGloss.V);
        if (slotsConlang.V_adv) {
          conlangTokens.push(slotsConlang.V_adv);
          glossTokens.push(slotsGloss.V_adv + " (adv)");
        }
      } else if (code === "O") {
        conlangTokens.push(slotsConlang.O);
        glossTokens.push(slotsGloss.O);
      }
    });

    const conlang = conlangTokens.join(" ");
    const english = generateEnglishSentence(slotsGloss);

    return { conlang, english };
  }

  function applyNounMorphology(base, nounMorph, derivation) {
    // Apply case endings or other nominal morphology based on complexity level
    if (nounMorph === "rich") {
      // Rich morphology: multiple cases, more variety
      const caseMorphemes = [
        { marker: "", gloss: "nominative" },
        { marker: "-em", gloss: "ergative" },
        { marker: "-el", gloss: "genitive" },
        { marker: "-ur", gloss: "locative" },
        { marker: "-is", gloss: "accusative" }
      ];
      if (Math.random() < 0.6) {
        const morph = caseMorphemes[Math.floor(Math.random() * caseMorphemes.length)];
        return base + morph.marker;
      }
      return base;
    } else if (nounMorph === "moderate") {
      // Moderate morphology: occasional endings
      if (Math.random() < 0.35) {
        const endings = ["-em", "-el", "-ur"];
        return base + endings[Math.floor(Math.random() * endings.length)];
      }
      return base;
    } else {
      // Light morphology: minimal endings
      if (Math.random() < 0.1) {
        return base + (Math.random() > 0.5 ? "-s" : "-e");
      }
      return base;
    }
  }

  function applyVerbMorphology(base, verbMorph, derivation) {
    // Apply tense/aspect/mood markers to verbs based on complexity level
    if (verbMorph === "rich") {
      // Rich morphology: multiple TAM categories
      const affixesByType = {
        prefixing: ["ta-", "si-", "vel-", ""],
        suffixing: ["-ta", "-sin", "-vel", "-sa", ""],
        compounding: ["", "-ta", "-sin"]
      };
      
      const affixes = affixesByType[derivation] || affixesByType.suffixing;
      if (Math.random() < 0.65) {
        const affix = affixes[Math.floor(Math.random() * affixes.length)];
        if (derivation === "prefixing" && affix) {
          return affix + base;
        } else {
          return base + affix;
        }
      }
      return base;
    } else if (verbMorph === "moderate") {
      // Moderate morphology: occasional tense markers
      if (Math.random() < 0.4) {
        const endings = ["-ta", "-sin", "-sa"];
        return base + endings[Math.floor(Math.random() * endings.length)];
      }
      return base;
    } else {
      // Light morphology: minimal verb marking
      if (Math.random() < 0.15) {
        return base + (Math.random() > 0.5 ? "-ta" : "-ed");
      }
      return base;
    }
  }

  function generateEnglishSentence(gloss) {
    const hasAdj = gloss.S_adj && gloss.S_adj.length > 0;
    const hasAdv = gloss.V_adv && gloss.V_adv.length > 0;
    const verbForm = conjugateVerb(gloss.V, "present", "3sg");

    let engSentence;
    if (hasAdj && hasAdv) {
      engSentence = `${gloss.S_adj} ${gloss.S} ${verbForm} ${gloss.O} ${gloss.V_adv}.`;
    } else if (hasAdj) {
      engSentence = `${gloss.S_adj} ${gloss.S} ${verbForm} ${gloss.O}.`;
    } else if (hasAdv) {
      engSentence = `${gloss.S} ${verbForm} ${gloss.O} ${gloss.V_adv}.`;
    } else {
      engSentence = `${gloss.S} ${verbForm} ${gloss.O}.`;
    }

    return engSentence;
  }

  function conjugateVerb(verbGloss, tense, person) {
    if (tense === "past") {
      if (verbGloss.endsWith("e")) return verbGloss + "d";
      if (verbGloss.endsWith("y")) return verbGloss.slice(0, -1) + "ied";
      return verbGloss + "ed";
    } else if (tense === "progressive") {
      if (verbGloss.endsWith("e")) return verbGloss.slice(0, -1) + "ing";
      return verbGloss + "ing";
    } else if (person === "3sg") {
      if (verbGloss.endsWith("s") || verbGloss.endsWith("x") || verbGloss.endsWith("z")) {
        return verbGloss + "es";
      } else if (verbGloss.endsWith("y")) {
        return verbGloss.slice(0, -1) + "ies";
      } else {
        return verbGloss + "s";
      }
    }
    return verbGloss;
  }

  function wordOrderToSequence(order) {
    const orders = {
      "sov": ["S", "O", "V"],
      "vso": ["V", "S", "O"],
      "osv": ["O", "S", "V"],
      "ovs": ["O", "V", "S"]
    };
    return orders[(order || "").toLowerCase()] || ["S", "V", "O"];
  }

  function generateWord(phonology, writing, grammar, lexicon) {
    if (!phonology?.consonants || !phonology?.vowels) {
      return "err";
    }

    const maxSyl = phonology.maxSyllables || 3;
    const syllableCount = Math.floor(Math.random() * (maxSyl - 1)) + 1;
    const pattern = phonology.syllablePreset || "cvc";
    const patternParts = pattern.includes("-") ? pattern.split("-") : [pattern];
    const syllables = [];

    for (let s = 0; s < syllableCount; s++) {
      const selectedPattern = patternParts[s % patternParts.length];
      const syl = generateSyllable(selectedPattern, phonology);
      if (syl.length > 0) {
        syllables.push(syl);
      }
    }

    let result = syllables.join("");
    result = result.length > 0 ? result : "word";

    // Apply derivational morphology based on grammar settings
    const morphChance = getMorphChance(grammar?.nounMorph, grammar?.verbMorph);
    if (Math.random() < morphChance) {
      if (grammar?.derivation === "prefixing") {
        const prefix = generateSyllable("cv", phonology);
        result = prefix + result;
      } else if (grammar?.derivation === "suffixing") {
        const suffix = generateSyllable("cv", phonology);
        result = result + suffix;
      } else if (grammar?.derivation === "infixing") {
        const splitPoint = Math.floor(result.length / 2);
        const infix = generateSyllable("cv", phonology);
        result = result.slice(0, splitPoint) + infix + result.slice(splitPoint);
      }
    }

    // Apply etymology-based sound changes
    if (lexicon?.etymology === "layered" && Math.random() < 0.15) {
      result = applyRandomSoundChange(result, phonology);
    }

    // RTL writing direction handled at display level, not generation
    return result;
  }

  function getMorphChance(nounMorph, verbMorph) {
    const nounChance = nounMorph === "rich" ? 0.35 : nounMorph === "moderate" ? 0.15 : 0.05;
    const verbChance = verbMorph === "rich" ? 0.35 : verbMorph === "moderate" ? 0.15 : 0.05;
    return Math.max(nounChance, verbChance);
  }

  function applyRandomSoundChange(word, phonology) {
    if (word.length < 2) return word;
    
    const changes = [
      function (w) { return w.replace(/p/g, "f").replace(/b/g, "v").replace(/t/g, "s").replace(/d/g, "z"); },
      function (w) { return w.replace(/k/g, "x").replace(/g/g, "ɣ"); },
      function (w) { return w.replace(/s/g, "ʃ").replace(/z/g, "ʒ"); }
    ];
    
    const randomChange = changes[Math.floor(Math.random() * changes.length)];
    return randomChange(word);
  }

  function reverseString(str) {
    return str;
  }

  function generateSyllable(pattern, phonology) {
    if (!pattern || !phonology) return "";
    
    const syllable = [];

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i].toUpperCase();

      if (char === "C") {
        const cons = pickRandom(phonology.consonants);
        if (cons) syllable.push(cons);
      } else if (char === "V") {
        const vowel = pickRandom(phonology.vowels);
        if (vowel) syllable.push(vowel);
      } else if (char === "X") {
        if (Math.random() > 0.5) {
          const cons = pickRandom(phonology.consonants);
          if (cons) syllable.push(cons);
        }
      } else if (char === "L") {
        const liquids = phonology.consonants.filter(function (c) {
          return c === "l" || c === "r" || c === "ɾ" || c === "ɹ";
        });
        if (liquids.length > 0) {
          syllable.push(pickRandom(liquids));
        } else {
          const cons = pickRandom(phonology.consonants);
          if (cons) syllable.push(cons);
        }
      }
    }

    return syllable.join("");
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function renderAlphabetMap() {
    const container = document.getElementById("alphabet-grid");
    if (!container || !state.config?.phonology) return;

    container.innerHTML = "";

    const englishVowels = ["a", "e", "i", "o", "u", "aa", "ee", "ii", "oo", "uu", "ae", "oe", "ue"];
    const englishConsonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "sh", "th", "ch"];

    const conlangVowels = state.config.phonology.vowels || [];
    const conlangConsonants = state.config.phonology.consonants || [];

    const vowelMapping = buildMapping(conlangVowels, englishVowels);
    const consonantMapping = buildMapping(conlangConsonants, englishConsonants);

    const vowelHeader = document.createElement("div");
    vowelHeader.className = "alphabet-section-header";
    vowelHeader.textContent = "Vowels";
    container.appendChild(vowelHeader);

    englishVowels.forEach(function (englishLetter) {
      const row = document.createElement("div");
      row.className = "alphabet-row";

      const englishEl = document.createElement("div");
      englishEl.className = "alphabet-english";
      englishEl.textContent = englishLetter;

      const conlangEl = document.createElement("div");
      conlangEl.className = "alphabet-conlang";
      conlangEl.textContent = vowelMapping[englishLetter] || "-";

      row.appendChild(englishEl);
      row.appendChild(conlangEl);
      container.appendChild(row);
    });

    const consonantHeader = document.createElement("div");
    consonantHeader.className = "alphabet-section-header";
    consonantHeader.textContent = "Consonants";
    container.appendChild(consonantHeader);

    englishConsonants.forEach(function (englishLetter) {
      const row = document.createElement("div");
      row.className = "alphabet-row";

      const englishEl = document.createElement("div");
      englishEl.className = "alphabet-english";
      englishEl.textContent = englishLetter;

      const conlangEl = document.createElement("div");
      conlangEl.className = "alphabet-conlang";
      conlangEl.textContent = consonantMapping[englishLetter] || "-";

      row.appendChild(englishEl);
      row.appendChild(conlangEl);
      container.appendChild(row);
    });
  }

  function buildMapping(conlangPhonemes, englishSlots) {
    const mapping = {};
    conlangPhonemes.forEach(function (phoneme, idx) {
      if (idx < englishSlots.length) {
        mapping[englishSlots[idx]] = phoneme;
      }
    });
    return mapping;
  }

  window.LanguageGenerator = {
    init,
    receiveConfig,
    rerollLexicon,
    rerollSentences
  };
})();

