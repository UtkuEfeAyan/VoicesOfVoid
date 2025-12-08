// ui.js
// Handles DOM, reads from prests.js, and keeping a simple editable config.
//DOM stuff was sugested by my father(who is a software engineer) for more dynamic and easier handling/editing
// also  he said that it would help me with structuring the code better and making it more modular
// i learned a lot from that advice while working on this project as it pushed me to learn a new sytem(DOMS)
// watched some tutoriels in how to use doms and with some questioning and help it was done
//i think it will be easier to expand in the future if i want to add more features as well
// also looks clearer and easier to read (to my brain at least(especially after labeleing everything properly))

const uiState = {
  activePresetId: "elven",
  config: null
};

// convenience, copy so edits don't mutate the original preset(no bugy references)
function clonePreset(preset) {
  return JSON.parse(JSON.stringify(preset));
}

// option labels   
const WORD_ORDER_OPTIONS = [
  { value: "svo", label: "SVO — subject–verb–object" },
  { value: "sov", label: "SOV — subject–object–verb" },
  { value: "vso", label: "VSO — verb–subject–object" },
  { value: "osv", label: "OSV — object–subject–verb" },
  { value: "ovs", label: "OVS — object–verb–subject" }
];

const WRITING_SYSTEM_OPTIONS = [
  { value: "alphabet", label: "Alphabet" },
  { value: "abjad", label: "Abjad" },
  { value: "abugida", label: "Abugida" },
  { value: "featural", label: "Featural" }
];

const SCRIPT_DIRECTION_OPTIONS = [
  { value: "ltr", label: "Left → Right" },
  { value: "rtl", label: "Right → Left" },
  { value: "ttb", label: "Top → Bottom" },
  { value: "btt", label: "Bottom → Top" }
];

// includes the patterns you  use in presets
const SYLLABLE_PATTERN_OPTIONS = [
  { value: "cv", label: "CV" },
  { value: "cvc", label: "CVC" },
  { value: "cv-cvc", label: "CV / CVC" },
  { value: "ccvc", label: "CCVC" },
  { value: "cvxl", label: "CVXL" },
  { value: "csv", label: "CSV" },
  { value: "csv-cvv", label: "CSV / CVV" },
  { value: "cxl", label: "CXL" },
  { value: "c-lv", label: "C–LV" }
];

// DOM refs   
const dom = {
  presetButtonsContainer: document.getElementById("preset-buttons"),

  wordOrderSelect: document.getElementById("word-order-select"),
  writingSystemSelect: document.getElementById("writing-system-select"),
  scriptDirectionSelect: document.getElementById("script-direction-select"),
  syllablePatternSelect: document.getElementById("syllable-pattern-select"),
  maxSyllablesSelect: document.getElementById("max-syllables-select"),

  consonantInput: document.getElementById("consonants-input"),
  vowelInput: document.getElementById("vowels-input"),

  resetToPresetButton: document.getElementById("reset-to-preset"),
  sendToGeneratorButton: document.getElementById("send-to-generator"),

  // new small controls for the generator output
  rerollLexiconButton: document.getElementById("reroll-lexicon"),
  rerollSentencesButton: document.getElementById("reroll-sentences"),

  languageName: document.getElementById("language-name"),
  languageTagline: document.getElementById("language-tagline"),

  metaPhonology: document.getElementById("meta-phonology"),
  metaMorphology: document.getElementById("meta-morphology"),
  metaLexicon: document.getElementById("meta-lexicon"),
  metaWriting: document.getElementById("meta-writing"),

  alphabetGrid: document.getElementById("alphabet-grid"),
  sentenceList: document.getElementById("sentence-list")
  // note: lexicon list is handled directly in generator.js with getElementById
};

//init   
document.addEventListener("DOMContentLoaded", function () {
  buildPresetButtons();
  buildSelect(dom.wordOrderSelect, WORD_ORDER_OPTIONS);
  buildSelect(dom.writingSystemSelect, WRITING_SYSTEM_OPTIONS);
  buildSelect(dom.scriptDirectionSelect, SCRIPT_DIRECTION_OPTIONS);
  buildSelect(dom.syllablePatternSelect, SYLLABLE_PATTERN_OPTIONS);
  buildMaxSyllableSelect(dom.maxSyllablesSelect, 1, 8);

  attachListeners();

  //start with the default preset
  applyPreset(uiState.activePresetId);

  //kick the generator once UI + config are ready
  if (window.LanguageGenerator && typeof window.LanguageGenerator.init === "function") {
    window.LanguageGenerator.init();
    if (typeof window.LanguageGenerator.receiveConfig === "function") {
      window.LanguageGenerator.receiveConfig(uiState.config);
    }
  } else if (window.LanguageGenerator && typeof window.LanguageGenerator.receiveConfig === "function") {
    // if there's no init(), at least send the config
    window.LanguageGenerator.receiveConfig(uiState.config);
  }
});

//building UI pieces   
function buildPresetButtons() {
  if (!dom.presetButtonsContainer) {
    console.warn("preset-buttons container not found.");
    return;
  }
  if (!window.LANGUAGE_PRESETS) {
    console.warn("LANGUAGE_PRESETS is not defined.");
    return;
  }

  const presets = Object.values(window.LANGUAGE_PRESETS);

  presets.forEach(function (preset) {
    if (!preset || !preset.id) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-pill";
    button.textContent = preset.label || preset.id;
    button.dataset.presetId = preset.id;

    button.addEventListener("click", function () {
      applyPreset(preset.id);
    });

    dom.presetButtonsContainer.appendChild(button);
  });
}

function buildSelect(selectEl, options) {
  if (!selectEl || !options) return;

  selectEl.innerHTML = "";

  options.forEach(function (opt) {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    selectEl.appendChild(option);
  });
}

function buildMaxSyllableSelect(selectEl, min, max) {
  if (!selectEl) return;

  selectEl.innerHTML = "";
  for (let i = min; i <= max; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    selectEl.appendChild(option);
  }
}

//event listeners   
function attachListeners() {
  if (dom.wordOrderSelect) {
    dom.wordOrderSelect.addEventListener("change", function (event) {
      if (!uiState.config || !uiState.config.grammar) return;
      uiState.config.grammar.wordOrder = event.target.value;
      refreshSummary();
    });
  }

  if (dom.writingSystemSelect) {
    dom.writingSystemSelect.addEventListener("change", function (event) {
      if (!uiState.config || !uiState.config.writing) return;
      uiState.config.writing.scriptType = event.target.value;
      refreshSummary();
    });
  }

  if (dom.scriptDirectionSelect) {
    dom.scriptDirectionSelect.addEventListener("change", function (event) {
      if (!uiState.config || !uiState.config.writing) return;
      uiState.config.writing.direction = event.target.value;
      refreshSummary();
    });
  }

  if (dom.syllablePatternSelect) {
    dom.syllablePatternSelect.addEventListener("change", function (event) {
      if (!uiState.config || !uiState.config.phonology) return;
      uiState.config.phonology.syllablePreset = event.target.value;
      refreshSummary();
    });
  }

  if (dom.maxSyllablesSelect) {
    dom.maxSyllablesSelect.addEventListener("change", function (event) {
      if (!uiState.config || !uiState.config.phonology) return;
      uiState.config.phonology.maxSyllables = Number(event.target.value);
      refreshSummary();
    });
  }

  if (dom.consonantInput) {
    dom.consonantInput.addEventListener("input", function (event) {
      if (!uiState.config || !uiState.config.phonology) return;
      uiState.config.phonology.consonants = splitPhonemeString(event.target.value);
      refreshSummary();
    });
  }

  if (dom.vowelInput) {
    dom.vowelInput.addEventListener("input", function (event) {
      if (!uiState.config || !uiState.config.phonology) return;
      uiState.config.phonology.vowels = splitPhonemeString(event.target.value);
      refreshSummary();
    });
  }

  if (dom.resetToPresetButton) {
    dom.resetToPresetButton.addEventListener("click", function () {
      applyPreset(uiState.activePresetId);
    });
  }

  if (dom.sendToGeneratorButton) {
    dom.sendToGeneratorButton.addEventListener("click", function () {
      if (window.LanguageGenerator && typeof window.LanguageGenerator.receiveConfig === "function") {
        window.LanguageGenerator.receiveConfig(uiState.config);
      } else {
        console.log("Generator hook not implemented yet.", uiState.config);
      }
    });
  }

  // small extra buttons for rerolling generator output (no fancy stuff)
  if (dom.rerollLexiconButton) {
    dom.rerollLexiconButton.addEventListener("click", function () {
      if (window.LanguageGenerator && typeof window.LanguageGenerator.rerollLexicon === "function") {
        window.LanguageGenerator.rerollLexicon();
      }
    });
  }

  if (dom.rerollSentencesButton) {
    dom.rerollSentencesButton.addEventListener("click", function () {
      if (window.LanguageGenerator && typeof window.LanguageGenerator.rerollSentences === "function") {
        window.LanguageGenerator.rerollSentences();
      }
    });
  }
}

//core behaviour 
function applyPreset(presetId) {
  if (!window.getPresetById) {
    console.error("getPresetById is not defined on window.");
    return;
  }

  const preset = window.getPresetById(presetId);
  if (!preset) {
    console.error("Preset not found for id:", presetId);
    return;
  }

  uiState.activePresetId = presetId;
  uiState.config = clonePreset(preset);

  updatePresetButtonStyles(presetId);
  fillControlsFromConfig();
  refreshSummary();
}

function updatePresetButtonStyles(activeId) {
  if (!dom.presetButtonsContainer) return;

  const buttons = dom.presetButtonsContainer.querySelectorAll(".preset-pill");

  buttons.forEach(function (btn) {
    if (btn.dataset.presetId === activeId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function fillControlsFromConfig() {
  const cfg = uiState.config;
  if (!cfg) return;

  if (dom.wordOrderSelect && cfg.grammar) {
    dom.wordOrderSelect.value = cfg.grammar.wordOrder;
  }
  if (dom.writingSystemSelect && cfg.writing) {
    dom.writingSystemSelect.value = cfg.writing.scriptType;
  }
  if (dom.scriptDirectionSelect && cfg.writing) {
    dom.scriptDirectionSelect.value = cfg.writing.direction;
  }
  if (dom.syllablePatternSelect && cfg.phonology) {
    dom.syllablePatternSelect.value = cfg.phonology.syllablePreset;
  }
  if (dom.maxSyllablesSelect && cfg.phonology) {
    dom.maxSyllablesSelect.value = String(cfg.phonology.maxSyllables);
  }

  if (dom.consonantInput && cfg.phonology) {
    dom.consonantInput.value = cfg.phonology.consonants.join(" ");
  }
  if (dom.vowelInput && cfg.phonology) {
    dom.vowelInput.value = cfg.phonology.vowels.join(" ");
  }
}

//summary rendering   
function refreshSummary() {
  const cfg = uiState.config;
  if (!cfg) return;

  if (!window.getPresetById) {
    console.error("getPresetById is not defined on window.");
    return;
  }

  const preset = window.getPresetById(uiState.activePresetId);
  if (!preset) return;

  //title + tagline
  if (dom.languageName) {
    dom.languageName.textContent = preset.label;
  }
  if (dom.languageTagline) {
    dom.languageTagline.textContent = preset.tagline;
  }

  //phonology block
  const wordOrderLabel = findLabel(WORD_ORDER_OPTIONS, cfg.grammar.wordOrder);
  const syllPatternLabel =
    findLabel(SYLLABLE_PATTERN_OPTIONS, cfg.phonology.syllablePreset) ||
    cfg.phonology.syllablePreset.toUpperCase();

  if (dom.metaPhonology) {
    dom.metaPhonology.innerHTML = [
      `<div class="meta-line">${wordOrderLabel}</div>`,
      `<div class="meta-line">Syllables: ${syllPatternLabel},</div>`,
      `<div class="meta-line">max syllables per word: ${cfg.phonology.maxSyllables}.</div>`
    ].join("");
  }

  //morphology block
  if (dom.metaMorphology) {
    dom.metaMorphology.innerHTML = [
      `<div class="meta-line">nouns: ${cfg.grammar.nounMorph},</div>`,
      `<div class="meta-line">verbs: ${cfg.grammar.verbMorph},</div>`,
      `<div class="meta-line">derivation: ${cfg.grammar.derivation}.</div>`
    ].join("");
  }

  //lexicon block
  if (dom.metaLexicon) {
    dom.metaLexicon.innerHTML = [
      `<div class="meta-line">size: ${cfg.lexicon.size},</div>`,
      `<div class="meta-line">proper names: ${cfg.lexicon.properNames},</div>`,
      `<div class="meta-line">etymology: ${cfg.lexicon.etymology}.</div>`
    ].join("");
  }

  //writing block
  const scriptLabel = findLabel(WRITING_SYSTEM_OPTIONS, cfg.writing.scriptType);
  const directionLabel = findLabel(
    SCRIPT_DIRECTION_OPTIONS,
    cfg.writing.direction
  );

  if (dom.metaWriting) {
    const scriptText = (scriptLabel || "").toLowerCase();
    const dirText = (directionLabel || "").toLowerCase();

    dom.metaWriting.innerHTML = [
      `<div class="meta-line">${scriptText}: symbols represent individual sounds.</div>`,
      `<div class="meta-line">direction: ${dirText}.</div>`
    ].join("");
  }

  //alphabet chips(hnadled just below in helper)
  renderAlphabetChips(cfg);
}

//helper make small chips for consonants + vowels (alphabet)
//  did this way cause looks more fancy
function renderAlphabetChips(cfg) {
  if (!dom.alphabetGrid || !cfg || !cfg.phonology) return;

  dom.alphabetGrid.innerHTML = "";

  const allSymbols = cfg.phonology.consonants.concat(cfg.phonology.vowels);

  allSymbols.forEach(function (sym) {
    const chip = document.createElement("div");
    chip.className = "alphabet-chip";
    chip.textContent = sym;
    dom.alphabetGrid.appendChild(chip);
  });
}

//other helpers   
function splitPhonemeString(value) {
  return value
    .split(/\s+/)
    .map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; });
}

function findLabel(options, value) {
  const match = options.find(function (opt) { return opt.value === value; });
  return match ? match.label : value;
}
