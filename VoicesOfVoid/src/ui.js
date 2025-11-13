(function () {
  let currentSpec = null;
  let activePresetId = "elven";

  const presetRow = document.getElementById("presetRow");

  const phonInventorySelect = document.getElementById("phonInventorySelect");
  const phonClassSelect = document.getElementById("phonClassSelect");
  const syllableShapeSelect = document.getElementById("syllableShapeSelect");
  const maxSyllablesSelect = document.getElementById("maxSyllablesSelect");
  const consonantDisplay = document.getElementById("consonantDisplay");
  const vowelDisplay = document.getElementById("vowelDisplay");

  const wordOrderSelect = document.getElementById("wordOrderSelect");
  const nounMorphSelect = document.getElementById("nounMorphSelect");
  const verbMorphSelect = document.getElementById("verbMorphSelect");
  const derivationSelect = document.getElementById("derivationSelect");

  const vocabSizeSelect = document.getElementById("vocabSizeSelect");
  const properNounSelect = document.getElementById("properNounSelect");
  const etymologySelect = document.getElementById("etymologySelect");

  const scriptTypeSelect = document.getElementById("scriptTypeSelect");
  const directionSelect = document.getElementById("directionSelect");

  const generateBtn = document.getElementById("generateBtn");
  const editPhonemesBtn = document.getElementById("editPhonemesBtn");

  const presetSummaryEl = document.getElementById("presetSummary");
  const phonemeSummaryEl = document.getElementById("phonemeSummary");
  const patternSummaryEl = document.getElementById("patternSummary");
  const specPreviewEl = document.getElementById("specPreview");

  function initPresets() {
    const presets = window.getAllPresetOptions();
    presets.forEach(p => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "preset-pill";
      pill.textContent = p.label;
      pill.dataset.presetId = p.id;
      presetRow.appendChild(pill);
    });

    setActivePreset(presets[0].id);

    presetRow.addEventListener("click", e => {
      const pill = e.target.closest(".preset-pill");
      if (!pill) return;
      setActivePreset(pill.dataset.presetId);
    });
  }

  function setActivePreset(id) {
    activePresetId = id;
    Array.from(presetRow.querySelectorAll(".preset-pill")).forEach(pill => {
      pill.classList.toggle("active", pill.dataset.presetId === id);
    });
    const p = window.getPresetById(id);
    applyPreset(p);
  }

  function clonePreset(p) {
    return JSON.parse(JSON.stringify(p));
  }

  function applyPreset(preset) {
    currentSpec = clonePreset(preset);

    phonInventorySelect.value = preset.phonology.inventoryPreset;
    phonClassSelect.value = preset.phonology.classPreset;
    syllableShapeSelect.value = preset.phonology.syllablePreset;
    maxSyllablesSelect.value = String(preset.phonology.maxSyllables);

    wordOrderSelect.value = preset.grammar.wordOrder;
    nounMorphSelect.value = preset.grammar.nounMorph;
    verbMorphSelect.value = preset.grammar.verbMorph;
    derivationSelect.value = preset.grammar.derivation;

    vocabSizeSelect.value = preset.lexicon.size;
    properNounSelect.value = preset.lexicon.properNames;
    etymologySelect.value = preset.lexicon.etymology;

    scriptTypeSelect.value = preset.writing.scriptType;
    directionSelect.value = preset.writing.direction;

    updatePhonemeDisplays();
    renderSummaries();
  }

  function refreshSpecFromControls() {
    const base = window.getPresetById(activePresetId);
    const spec = clonePreset(base);

    spec.phonology.inventoryPreset = phonInventorySelect.value;
    spec.phonology.classPreset = phonClassSelect.value;
    spec.phonology.syllablePreset = syllableShapeSelect.value;
    spec.phonology.maxSyllables = parseInt(maxSyllablesSelect.value, 10) || 1;

    spec.grammar.wordOrder = wordOrderSelect.value;
    spec.grammar.nounMorph = nounMorphSelect.value;
    spec.grammar.verbMorph = verbMorphSelect.value;
    spec.grammar.derivation = derivationSelect.value;

    spec.lexicon.size = vocabSizeSelect.value;
    spec.lexicon.properNames = properNounSelect.value;
    spec.lexicon.etymology = etymologySelect.value;

    spec.writing.scriptType = scriptTypeSelect.value;
    spec.writing.direction = directionSelect.value;

    currentSpec = spec;
  }

  function updatePhonemeDisplays() {
    if (!currentSpec) return;
    const c = currentSpec.phonology.consonants || [];
    const v = currentSpec.phonology.vowels || [];
    consonantDisplay.textContent = c.join(" ");
    vowelDisplay.textContent = v.join(" ");
  }


  function describeInventory(inv) {
    if (inv === "simple-5") return "simple inventory with a classic 5-vowel core.";
    if (inv === "dense") return "dense, complex inventory with many contrasts.";
    return "balanced inventory with a mix of consonants and vowels.";
  }

  function describeWordOrder(order) {
    switch (order) {
      case "sov": return "SOV — subject–object–verb.";
      case "vso": return "VSO — verb–subject–object.";
      case "vos": return "VOS — verb–object–subject.";
      case "osv": return "OSV — object–subject–verb.";
      case "ovs": return "OVS — object–verb–subject.";
      case "free": return "Free word order with heavy marking.";
      default: return "SVO — subject–verb–object.";
    }
  }

  function describeScript(type) {
    if (type === "logography") return "logography: symbols stand for words/morphemes.";
    if (type === "syllabary") return "syllabary: symbols represent syllables.";
    if (type === "alphabet") return "alphabet: symbols represent individual sounds.";
    if (type === "abjad") return "abjad: mostly consonants, vowels inferred.";
    if (type === "abugida") return "abugida: consonant base plus vowel marks.";
    if (type === "featural") return "featural: shapes encode phonological features.";
    return "";
  }

  function describeDirection(dir) {
    if (dir === "ltr") return "left → right";
    if (dir === "rtl") return "right → left";
    if (dir === "ttb") return "top → bottom";
    if (dir === "btt") return "bottom → top";
    if (dir === "boustro") return "boustrophedon alternating lines";
    return "";
  }

  function renderSummaries() {
    if (!currentSpec) return;

    const name = window.getPresetById(currentSpec.id).label;

    if (presetSummaryEl) {
      presetSummaryEl.innerHTML =
        `<div class="language-name">${name}</div>` +
        `<div class="language-tagline">${describeInventory(
          currentSpec.phonology.inventoryPreset
        )} Word order: ${describeWordOrder(
          currentSpec.grammar.wordOrder
        )}</div>`;
    }

    if (phonemeSummaryEl) {
      phonemeSummaryEl.textContent =
        `Phoneme classes: ${currentSpec.phonology.classPreset.toUpperCase()} · ` +
        `Syllables: ${currentSpec.phonology.syllablePreset} · ` +
        `Max syllables per word: ${currentSpec.phonology.maxSyllables}\n` +
        `C: ${consonantDisplay.textContent}\n` +
        `V: ${vowelDisplay.textContent}`;
    }

    if (patternSummaryEl) {
      patternSummaryEl.textContent =
        `Morphology — nouns: ${currentSpec.grammar.nounMorph}, ` +
        `verbs: ${currentSpec.grammar.verbMorph}, derivation: ${currentSpec.grammar.derivation}\n` +
        `Lexicon — size: ${currentSpec.lexicon.size}, proper names: ${currentSpec.lexicon.properNames}, ` +
        `etymology: ${currentSpec.lexicon.etymology}\n` +
        `Writing — ${describeScript(currentSpec.writing.scriptType)}; ` +
        `direction: ${describeDirection(currentSpec.writing.direction)}.`;
    }

    if (specPreviewEl) {
      specPreviewEl.textContent = JSON.stringify(currentSpec, null, 2);
    }
  }

  function onControlChange() {
    refreshSpecFromControls();
    updatePhonemeDisplays();
    renderSummaries();
  }

  function wireControls() {
    [
      phonInventorySelect,
      phonClassSelect,
      syllableShapeSelect,
      maxSyllablesSelect,
      wordOrderSelect,
      nounMorphSelect,
      verbMorphSelect,
      derivationSelect,
      vocabSizeSelect,
      properNounSelect,
      etymologySelect,
      scriptTypeSelect,
      directionSelect
    ].forEach(el => el && el.addEventListener("change", onControlChange));

    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        refreshSpecFromControls();
        console.log("language spec:", currentSpec);
        alert("Language spec printed in console for now.\nNext step = hook generator into this.");
      });
    }

    if (editPhonemesBtn) {
      editPhonemesBtn.addEventListener("click", () => {
        alert(
          "Phoneme editor will use the current preset.\n" +
          "We can wire a dedicated editor panel here later."
        );
      });
    }

    window.getSelectedPresetId = function () {
      return activePresetId;
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    initPresets();
    wireControls();
  });
})();
