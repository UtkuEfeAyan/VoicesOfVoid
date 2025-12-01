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
        // generate a completely new random word using phoneme rules
        const nativeWord = generateWord(state.config.phonology);
        return {
          gloss: gloss,
          native: nativeWord,
          pos: pos,
          root: nativeWord,
          forms: {
            base: nativeWord
          }
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

    const n = state.lexicon.nouns.length;
    const v = state.lexicon.verbs.length;
    const p = state.lexicon.prepositions.length;
    const a = state.lexicon.articles.length;
    const pr = state.lexicon.pronouns.length;
    const c = state.lexicon.conjunctions.length;
    const d = state.lexicon.descriptors.length;

    el.innerHTML = [
      '<div class="meta-line">nouns: ' + n + "</div>",
      '<div class="meta-line">verbs: ' + v + "</div>",
      '<div class="meta-line">prepositions: ' + p + "</div>",
      '<div class="meta-line">articles: ' + a + "</div>",
      '<div class="meta-line">pronouns: ' + pr + "</div>",
      '<div class="meta-line">conjunctions: ' + c + "</div>",
      '<div class="meta-line">descriptors: ' + d + "</div>"
    ].join("");
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
      colNative.textContent = entry.native;

      const colGloss = document.createElement("div");
      colGloss.className = "lex-col lex-gloss";
      colGloss.textContent = entry.gloss;

      row.appendChild(colNative);
      row.appendChild(colGloss);

      body.appendChild(row);
    });
  }

  function renderSentences() {
    const container = document.getElementById("sentence-list");
    if (!container) return;

    container.innerHTML = "";
    if (!hasLexicon()) return;

    const sentences = [];
    for (let i = 0; i < 3; i++) {
      sentences.push(makeSentence());
    }

    sentences.forEach(function (s) {
      const card = document.createElement("article");
      card.className = "sentence-card";

      // conlang line (the generated language)
      const line1 = document.createElement("div");
      line1.className = "sent-line sent-conlang";
      line1.textContent = s.conlang;

      // english translation (green)
      const line2 = document.createElement("div");
      line2.className = "sent-line sent-english";
      line2.textContent = s.english;

      card.appendChild(line1);
      card.appendChild(line2);
      container.appendChild(card);
    });
  }

  function makeSentence() {
    function pickRandom(arr) {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const order =
      (state.config &&
        state.config.grammar &&
        state.config.grammar.wordOrder) ||
      "svo";

    const subj = pickRandom(state.lexicon.nouns);
    const obj = pickRandom(state.lexicon.nouns);
    const verb = pickRandom(state.lexicon.verbs);
    const descAdj = pickRandom(state.lexicon.descriptors);
    const descAdv = pickRandom(state.lexicon.descriptors);

    // build both conlang and gloss data
    const slotsConlang = {
      S_adj: descAdj && descAdj.native,
      S: subj.native,
      V: verb.native,
      V_adv: descAdv && descAdv.native,
      O: obj.native
    };

    const slotsGloss = {
      S_adj: descAdj && descAdj.gloss,
      S: subj.gloss,
      V: verb.gloss,
      V_adv: descAdv && descAdv.gloss,
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
    const gloss = glossTokens.join(" ");

    // build english with better rules
    const english = generateEnglishSentence(slotsGloss);

    return { conlang: conlang, gloss: gloss, english: english };
  }

  function generateEnglishSentence(gloss) {
    // simple english template system with smart verb conjugation
    const hasAdj = gloss.S_adj && gloss.S_adj.length > 0;
    const hasAdv = gloss.V_adv && gloss.V_adv.length > 0;

    // conjugate verb for third-person singular present
    const verbForm = conjugateVerb(gloss.V, "present", "3sg");

    let engSentence;
    if (hasAdj && hasAdv) {
      engSentence =
        "the " +
        gloss.S_adj +
        " " +
        gloss.S +
        " " +
        verbForm +
        " the " +
        gloss.O +
        " " +
        gloss.V_adv +
        ".";
    } else if (hasAdj) {
      engSentence =
        "the " +
        gloss.S_adj +
        " " +
        gloss.S +
        " " +
        verbForm +
        " the " +
        gloss.O +
        ".";
    } else if (hasAdv) {
      engSentence =
        "the " +
        gloss.S +
        " " +
        verbForm +
        " the " +
        gloss.O +
        " " +
        gloss.V_adv +
        ".";
    } else {
      engSentence =
        "the " +
        gloss.S +
        " " +
        verbForm +
        " the " +
        gloss.O +
        ".";
    }

    return engSentence;
  }

  function conjugateVerb(verbGloss, tense, person) {
    // simple english verb conjugation
    // person: "3sg" (third singular), "other" (everything else)
    // tense: "present", "past", "progressive"
    
    if (tense === "past") {
      // simple past
      if (verbGloss.endsWith("e")) {
        return verbGloss + "d";
      } else if (verbGloss.endsWith("y")) {
        return verbGloss.slice(0, -1) + "ied";
      } else {
        return verbGloss + "ed";
      }
    } else if (tense === "progressive") {
      // ing form
      if (verbGloss.endsWith("e")) {
        return verbGloss.slice(0, -1) + "ing";
      } else {
        return verbGloss + "ing";
      }
    } else {
      // present tense
      if (person === "3sg") {
        // add s for third person singular
        if (verbGloss.endsWith("s") || verbGloss.endsWith("x") || verbGloss.endsWith("z")) {
          return verbGloss + "es";
        } else if (verbGloss.endsWith("y")) {
          return verbGloss.slice(0, -1) + "ies";
        } else {
          return verbGloss + "s";
        }
      } else {
        // other persons use base form
        return verbGloss;
      }
    }
  }

  function wordOrderToSequence(order) {
    const o = (order || "").toLowerCase();
    if (o === "sov") return ["S", "O", "V"];
    if (o === "vso") return ["V", "S", "O"];
    if (o === "osv") return ["O", "S", "V"];
    if (o === "ovs") return ["O", "V", "S"];
    return ["S", "V", "O"];
  }

  function generateWord(phonology) {
    if (!phonology || !phonology.consonants || !phonology.vowels) {
      return "err";
    }

    const maxSyl = phonology.maxSyllables || 3;
    const syllableCount = Math.floor(Math.random() * (maxSyl - 1)) + 1; // 1 to maxSyl
    const pattern = phonology.syllablePreset || "cvc";
    
    // split multi-part patterns like "cv-cvc"
    const patternParts = pattern.includes("-") ? pattern.split("-") : [pattern];
    const syllables = [];

    for (let s = 0; s < syllableCount; s++) {
      const selectedPattern = patternParts[s % patternParts.length];
      const syl = generateSyllable(selectedPattern, phonology);
      if (syl.length > 0) {
        syllables.push(syl);
      }
    }

    const result = syllables.join("");
    return result.length > 0 ? result : "word";
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
        // optional consonant (50% chance)
        if (Math.random() > 0.5) {
          const cons = pickRandom(phonology.consonants);
          if (cons) syllable.push(cons);
        }
      } else if (char === "L") {
        // liquid position prefer l/r
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
    if (!container || !state.config || !state.config.phonology) return;

    container.innerHTML = "";

    const consonants = state.config.phonology.consonants || [];
    const vowels = state.config.phonology.vowels || [];
    const allPhonemes = consonants.concat(vowels);

    // english counterpart mapping
    const englishMap = {
      "p": "p", "b": "b", "t": "t", "d": "d", "k": "k", "g": "g",
      "f": "f", "v": "v", "s": "s", "z": "z", "ʃ": "sh", "ʒ": "zh",
      "h": "h", "l": "l", "r": "r", "m": "m", "n": "n", "ŋ": "ng",
      "j": "y", "w": "w", "x": "x", "θ": "th", "ð": "dh",
      "ɣ": "gh", "χ": "kh", "ʁ": "rh", "ħ": "-", "ʕ": "-",
      "ɬ": "lh", "ɾ": "r", "ɹ": "r", "ʀ": "r", "β": "v",
      "ɸ": "f", "pf": "pf", "ts": "ts", "ch": "ch", "sch": "sch",
      "shch": "shch", "zh": "zh", "sh": "sh",
      "a": "a", "e": "e", "i": "i", "o": "o", "u": "u",
      "y": "y", "æ": "ae", "ø": "o", "ə": "-", "ɘ": "-",
      "ɯ": "u", "ɨ": "i", "ʉ": "u", "ɪ": "i", "ʊ": "u",
      "ɑ": "ah", "ɒ": "o", "ɔ": "aw",
      "aa": "aa", "ee": "ee", "ii": "ii", "oo": "oo", "uu": "uu",
      "ai": "ai", "au": "au", "oi": "oi", "ae": "ae", "oe": "oe",
      "ue": "ue", "ya": "ya", "ye": "ye", "yo": "yo", "yu": "yu",
      "iː": "ee", "eː": "eh", "aː": "ah", "oː": "oh", "uː": "oo",
      "yː": "yy", "ah": "ah", "uh": "uh", "q": "q", "c": "c"
    };

    allPhonemes.forEach(function (phoneme) {
      const row = document.createElement("div");
      row.className = "alphabet-row";

      const phonemeEl = document.createElement("div");
      phonemeEl.className = "alphabet-phoneme";
      phonemeEl.textContent = phoneme;

      const englishEl = document.createElement("div");
      englishEl.className = "alphabet-english";
      const englishCounterpart = englishMap[phoneme] || "-";
      englishEl.textContent = englishCounterpart;

      row.appendChild(phonemeEl);
      row.appendChild(englishEl);
      container.appendChild(row);
    });
  }

  window.LanguageGenerator = {
    init: init,
    receiveConfig: receiveConfig,
    rerollLexicon: rerollLexicon,
    rerollSentences: rerollSentences
  };
})();

/*

improvements made:

1. buildLexicon() now creates full entry objects with:
   - gloss (english meaning)
   - native (generated conlang word)
   - pos (part of speech tag)
   - root and forms for future morphology expansion

2. generateWord() uses syllablePreset directly and creates varied word lengths
   generateSyllable() supports:
   - C = consonant
   - V = vowel  
   - X = optional consonant (50% chance)
   - L = liquid (prefers l/r if available)

3. makeSentence() builds two parallel token arrays:
   - conlangTokens = generated words
   - glossTokens = english glosses
   both follow the same word order, ensuring consistency

4. generateEnglishSentence() applies basic rules:
   - handles optional adjectives and adverbs
   - calls conjugateVerb() for smart verb forms

5. conjugateVerb() handles english rules:
   - 3rd person singular present adds -s/-es/-ies
   - past tense adds -ed or -d
   - progressive forms add -ing
   this keeps english translation cleaner

6. wordOrderToSequence() unchanged but all functions now use it consistently

ready for future expansions:
- morphology rules can use the entry.forms and entry.pos fields
- new templates can be added to sentence generation
- phoneme class constraints can filter pickRandom() calls

*/

/* archived experimental code */
/* collapsible lexicon feature not currently implemented */
/*
  // example placeholder for future collapsible rendering:
  // function renderLexiconCollapsible(entries, cardId) {
  //   const card = document.getElementById(cardId);
  //   if (!card) return;
  //   const header = card.querySelector('.collapsible-header');
  //   if (header) {
  //     header.addEventListener('click', function() {
  //       const content = card.querySelector('.lexicon-collapsible');
  //       if (content) {
  //         content.style.display = content.style.display === 'none' ? 'block' : 'none';
  //       }
  //     });
  //   }
  // }
*/

