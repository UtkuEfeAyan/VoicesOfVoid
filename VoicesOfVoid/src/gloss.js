(function () {
  function joinTokens(tokens) {
    if (!tokens || !tokens.length) return "";
    return tokens.join(" ");
  }

  function buildWordByWordGloss(foreignTokens, baseTokens) {
    const f = foreignTokens || [];
    const b = baseTokens || [];
    const len = Math.max(f.length, b.length);
    const pairs = [];
    for (let i = 0; i < len; i++) {
      const ft = f[i] || "";
      const bt = b[i] || "";
      if (!ft && !bt) continue;
      if (!bt) {
        pairs.push(ft);
      } else if (!ft) {
        pairs.push(bt);
      } else {
        pairs.push(ft + " = " + bt);
      }
    }
    return pairs.join(" | ");
  }

  function buildFreeTranslation(englishTokens) {
    return joinTokens(englishTokens);
  }

  function buildSentenceEntry(opts) {
    const foreignTokens = opts.foreignTokens || [];
    const englishTokens = opts.englishTokens || [];
    const meta = opts.meta || null;

    const foreign = joinTokens(foreignTokens);
    const gloss = buildWordByWordGloss(foreignTokens, englishTokens);
    const translation = buildFreeTranslation(englishTokens);

    return {
      foreign,
      gloss,
      translation,
      meta
    };
  }

  window.Gloss = {
    joinTokens,
    buildWordByWordGloss,
    buildFreeTranslation,
    buildSentenceEntry
  };
})();
