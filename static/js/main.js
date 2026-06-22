let currentCipher = null;
let solverType = 'VIGENERE';
let keyword = '';
let caesarShift = 3;
let decryptedText = '';
let activeTab = 'frequency';

let debounceTimer = null;
function debounce(fn, ms = 300) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function selectCipher(cipherId) {
  currentCipher = window.__CIPHERS__.find((c) => c.id === cipherId) || null;
  if (!currentCipher) return;

  const detailsEl = document.getElementById('cipher-details');
  if (detailsEl) {
    detailsEl.value = currentCipher.details || '';
  }

  const cipherControls = document.getElementById('cipher-controls');
  const solverControls = document.getElementById('solver-controls');
  if (cipherControls) cipherControls.classList.remove('hidden');
  if (solverControls) solverControls.classList.remove('hidden');

  const vigenereGroup = document.getElementById('vigenere-controls');
  const caesarGroup = document.getElementById('caesar-controls');
  const atbashGroup = document.getElementById('atbash-controls');

  if (vigenereGroup) vigenereGroup.classList.add('hidden');
  if (caesarGroup) caesarGroup.classList.add('hidden');
  if (atbashGroup) atbashGroup.classList.add('hidden');

  const cipherType = (currentCipher.type || '').toUpperCase();
  if (cipherType === 'VIGENERE' && vigenereGroup) {
    vigenereGroup.classList.remove('hidden');
    solverType = 'VIGENERE';
  } else if (cipherType === 'CAESAR' && caesarGroup) {
    caesarGroup.classList.remove('hidden');
    solverType = 'CAESAR';
  } else if (cipherType === 'ATBASH' && atbashGroup) {
    atbashGroup.classList.remove('hidden');
    solverType = 'ATBASH';
  }

  const solverTypeDisplay = document.getElementById('solver-type-display');
  if (solverTypeDisplay) solverTypeDisplay.textContent = solverType;

  const aiResults = document.getElementById('ai-results');
  if (aiResults) aiResults.innerHTML = '';

  const keywordSuggestions = document.getElementById('keyword-suggestions');
  if (keywordSuggestions) keywordSuggestions.innerHTML = '';

  loadWorkspace();

  const ciphertextInput = document.getElementById('ciphertext-input');
  if (ciphertextInput) {
    ciphertextInput.value = currentCipher.ciphertext || '';
    ciphertextInput.dispatchEvent(new Event('input'));
  }
}

function updateDecryptedText() {
  const ciphertext = (
    document.getElementById('ciphertext-input') || { value: '' }
  ).value;
  if (!ciphertext) {
    decryptedText = '';
    const el = document.getElementById('decrypted-text');
    if (el) el.textContent = '';
    return;
  }

  const st = (solverType || '').toUpperCase();
  let endpoint = '';
  let body = { ciphertext };

  if (st === 'VIGENERE' || st === 'VIGENÈRE') {
    endpoint = '/api/decrypt/vigenere';
    body.key = keyword || '';
  } else if (st === 'CAESAR') {
    endpoint = '/api/decrypt/caesar';
    body.shift = caesarShift;
  } else if (st === 'ATBASH') {
    endpoint = '/api/decrypt/atbash';
  } else {
    return;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      decryptedText = data.plaintext || '';
      const el = document.getElementById('decrypted-text');
      if (el) el.textContent = decryptedText;
    })
    .catch(() => {
      const el = document.getElementById('decrypted-text');
      if (el) el.textContent = 'Decryption failed';
    });
}

function handleAnalyze() {
  if (!currentCipher) return;

  const btn = document.getElementById('analyze-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
  }

  const ciphertextInput = (document.getElementById('ciphertext-input') || { value: '' }).value;
  const payload = {
    ciphertext: ciphertextInput || currentCipher.ciphertext || '',
    decrypted_text: decryptedText || '',
    keyword: keyword || '',
    cipher: currentCipher,
  };

  fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const results = document.getElementById('ai-results');
      if (results) {
        const markdown = data.analysis || data.result || '';
        results.innerHTML = markdown;
      }
      switchTab('ai-analysis');
    })
    .catch(() => {
      const results = document.getElementById('ai-results');
      if (results) results.innerHTML = '<p class="text-red-400">Analysis failed.</p>';
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Analyze with AI';
      }
    });
}

function handleSuggestKeywords() {
  if (!currentCipher) return;

  const btn = document.getElementById('suggest-keywords-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Suggesting...';
  }

  const payload = {
    cipher_id: currentCipher.id,
    ciphertext: currentCipher.ciphertext || '',
  };

  fetch('/api/ai/suggest-keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const container = document.getElementById('keyword-suggestions');
      if (!container) return;
      container.innerHTML = '';
      const keywords = data.keywords || data.suggestions || [];
      keywords.forEach((kw) => {
        const btn = document.createElement('button');
        btn.className =
          'px-3 py-1 bg-gray-700 hover:bg-indigo-600 rounded text-sm transition-all';
        btn.textContent = kw;
        btn.onclick = () => handleKeywordSelect(kw);
        container.appendChild(btn);
      });
    })
    .catch(() => {
      const container = document.getElementById('keyword-suggestions');
      if (container)
        container.innerHTML = '<p class="text-red-400">Failed to get suggestions.</p>';
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Suggest Keywords';
      }
    });
}

function handleKeywordSelect(selectedKeyword) {
  keyword = selectedKeyword;
  const keywordInput = document.getElementById('keyword-input');
  if (keywordInput) keywordInput.value = keyword;
  updateDecryptedText();
  setTimeout(() => handleAnalyze(), 100);
}

function switchTab(tabName) {
  activeTab = tabName;

  const tabs = ['frequency', 'kasiski', 'ngram', 'unique-chars', 'ai-analysis'];
  tabs.forEach((t) => {
    const panel = document.getElementById(`tab-${t}`);
    if (panel) panel.classList.toggle('hidden', t !== tabName);

    const btn = document.querySelector(`[data-tab="${t}"]`);
    if (btn) {
      if (t === tabName) {
        btn.classList.remove('tab-inactive');
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
      }
    }
  });
}

function fetchAndUpdateFrequencies() {
  const ciphertext = (
    document.getElementById('ciphertext-input') || { value: '' }
  ).value;
  if (!ciphertext) return;

  fetch('/api/analyze/frequencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ciphertext,
      cipher: currentCipher || { id: 'custom', name: 'Custom', type: 'CUSTOM', description: '', ciphertext },
    }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const freqs = data.frequencies || [];
      if (typeof window.updateFrequencyCharts === 'function') {
        window.updateFrequencyCharts(freqs, {});
      }
    })
    .catch(() => {});
}

function updateKasiskiAnalysis() {
  const ciphertext = (
    document.getElementById('ciphertext-input') || { value: '' }
  ).value;
  if (!ciphertext) return;

  fetch('/api/analyze/kasiski', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ciphertext,
      cipher: currentCipher || { id: 'custom', name: 'Custom', type: 'CUSTOM', description: '', ciphertext },
    }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const repeatsEl = document.getElementById('kasiski-repeats');
      if (repeatsEl && data.sequence_details) {
        repeatsEl.innerHTML = data.sequence_details
          .map(
            (r) =>
              `<tr><td class="px-2 py-1 font-mono">${r.sequence}</td><td class="px-2 py-1">${(r.positions || []).join(', ')}</td><td class="px-2 py-1">${(r.distances || []).join(', ')}</td><td class="px-2 py-1">${r.gcd || ''}</td></tr>`
          )
          .join('');
      }

      const factorsEl = document.getElementById('kasiski-factors');
      if (factorsEl && data.factor_counts) {
        const factors = Object.entries(data.factor_counts)
          .map(([factor, count]) => ({ factor, count }))
          .sort((a, b) => b.count - a.count);
        factorsEl.innerHTML = factors
          .map(
            (f) =>
              `<tr><td class="px-2 py-1">${f.factor}</td><td class="px-2 py-1">${f.count}</td></tr>`
          )
          .join('');
      }
    })
    .catch(() => {});
}

function updateNgramAnalysis() {
  const ciphertext = (
    document.getElementById('ciphertext-input') || { value: '' }
  ).value;
  if (!ciphertext) return;

  Promise.all([
    fetch('/api/analyze/ngrams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ciphertext, n: 2 }),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
    fetch('/api/analyze/ngrams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ciphertext, n: 3 }),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
  ])
    .then(([digramData, trigramData]) => {
      const freqSum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

      const digramsEl = document.getElementById('ngram-digrams');
      if (digramsEl && digramData.ngrams) {
        const total2 = freqSum(digramData.ngrams);
        const items = Object.entries(digramData.ngrams)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);
        digramsEl.innerHTML = items
          .map(
            ([ngram, count]) =>
              `<tr><td class="px-2 py-1 font-mono">${ngram}</td><td class="px-2 py-1">${count}</td><td class="px-2 py-1">${(count / total2 * 100).toFixed(2)}%</td></tr>`
          )
          .join('');
      }

      const trigramsEl = document.getElementById('ngram-trigrams');
      if (trigramsEl && trigramData.ngrams) {
        const total3 = freqSum(trigramData.ngrams);
        const items = Object.entries(trigramData.ngrams)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);
        trigramsEl.innerHTML = items
          .map(
            ([ngram, count]) =>
              `<tr><td class="px-2 py-1 font-mono">${ngram}</td><td class="px-2 py-1">${count}</td><td class="px-2 py-1">${(count / total3 * 100).toFixed(2)}%</td></tr>`
          )
          .join('');
      }
    })
    .catch(() => {});
}

function updateUniqueChars() {
  const ciphertext = (
    document.getElementById('ciphertext-input') || { value: '' }
  ).value;
  if (!ciphertext) return;

  fetch('/api/analyze/unique-chars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ciphertext,
      cipher: currentCipher || { id: 'custom', name: 'Custom', type: 'CUSTOM', description: '', ciphertext },
    }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const grid = document.getElementById('unique-chars-grid');
      if (!grid) return;
      grid.innerHTML = '';
      const chars = data.characters || [];
      chars.forEach((c) => {
        const span = document.createElement('span');
        span.className =
          'inline-flex items-center justify-center w-8 h-8 bg-gray-700 rounded text-sm font-mono';
        span.textContent = c;
        grid.appendChild(span);
      });
    })
    .catch(() => {});
}

function calculateGematria() {
  const input = (
    document.getElementById('gematria-input') || { value: '' }
  ).value;
  if (!input) return;

  const schema =
    (document.getElementById('gematria-schema') || { value: 'pythagorean' }).value;

  fetch('/api/gematria', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input, schema }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const result = document.getElementById('gematria-result');
      if (result) {
        result.textContent = data.value !== undefined ? String(data.value) : '';
      }
    })
    .catch(() => {});
}

function generateCartouche() {
  const name = (
    document.getElementById('hieroglyph-name') || { value: '' }
  ).value;
  if (!name) return;

  fetch('/api/hieroglyphs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: name }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => {
      const container = document.getElementById('cartouche-display');
      if (!container) return;
      container.innerHTML = '';
      if (data.glyphs) {
        const p = document.createElement('p');
        p.className = 'text-2xl font-mono text-cyan-300 text-center tracking-widest';
        p.innerHTML = `&#x13007;${data.glyphs}&#x13007;`;
        container.appendChild(p);
      }
    })
    .catch(() => {});
}

function saveWorkspace() {
  if (!currentCipher) return;
  const notes = (
    document.getElementById('workspace-notes') || { value: '' }
  ).value;
  try {
    localStorage.setItem(`workspace_${currentCipher.id}`, notes);
  } catch (e) {}
}

function loadWorkspace() {
  if (!currentCipher) return;
  const notesEl = document.getElementById('workspace-notes');
  if (!notesEl) return;
  try {
    const saved = localStorage.getItem(`workspace_${currentCipher.id}`);
    notesEl.value = saved || '';
  } catch (e) {
    notesEl.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cipherSelect = document.getElementById('cipher-select');
  if (cipherSelect) {
    cipherSelect.addEventListener('change', (e) => selectCipher(e.target.value));
  }

  const ciphertextInput = document.getElementById('ciphertext-input');
  if (ciphertextInput) {
    ciphertextInput.addEventListener(
      'input',
      debounce(() => {
        updateDecryptedText();
        fetchAndUpdateFrequencies();
        updateKasiskiAnalysis();
        updateNgramAnalysis();
        updateUniqueChars();
      })
    );
  }

  const keywordInput = document.getElementById('keyword-input');
  if (keywordInput) {
    keywordInput.addEventListener(
      'input',
      debounce(() => {
        keyword = keywordInput.value;
        updateDecryptedText();
      })
    );
  }

  const caesarShiftEl = document.getElementById('caesar-shift');
  if (caesarShiftEl) {
    caesarShiftEl.addEventListener('input', () => {
      caesarShift = parseInt(caesarShiftEl.value, 10) || 0;
      updateDecryptedText();
    });
  }

  const solverTypeEl = document.getElementById('solver-type');
  if (solverTypeEl) {
    solverTypeEl.addEventListener('change', (e) => {
      solverType = e.target.value;
      const vigenereGroup = document.getElementById('vigenere-controls');
      const caesarGroup = document.getElementById('caesar-controls');
      const atbashGroup = document.getElementById('atbash-controls');
      if (vigenereGroup) vigenereGroup.classList.toggle('hidden', solverType.toUpperCase() !== 'VIGENERE');
      if (caesarGroup) caesarGroup.classList.toggle('hidden', solverType.toUpperCase() !== 'CAESAR');
      if (atbashGroup) atbashGroup.classList.toggle('hidden', solverType.toUpperCase() !== 'ATBASH');
      updateDecryptedText();
    });
  }

  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) analyzeBtn.addEventListener('click', handleAnalyze);

  const suggestBtn = document.getElementById('suggest-keywords-btn');
  if (suggestBtn) suggestBtn.addEventListener('click', handleSuggestKeywords);

  const gematriaInput = document.getElementById('gematria-input');
  if (gematriaInput) {
    gematriaInput.addEventListener('input', debounce(calculateGematria));
  }

  const gematriaSchema = document.getElementById('gematria-schema');
  if (gematriaSchema) {
    gematriaSchema.addEventListener('change', calculateGematria);
  }

  const hieroglyphName = document.getElementById('hieroglyph-name');
  if (hieroglyphName) {
    hieroglyphName.addEventListener('input', debounce(generateCartouche));
  }

  const workspaceNotes = document.getElementById('workspace-notes');
  if (workspaceNotes) {
    workspaceNotes.addEventListener('input', debounce(saveWorkspace, 500));
  }

  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  if (window.__CIPHERS__ && window.__CIPHERS__.length > 0) {
    const initialId =
      window.__SELECTED_CIPHER_ID__ || window.__CIPHERS__[0].id;
    if (cipherSelect) cipherSelect.value = initialId;
    selectCipher(initialId);
  }

  loadWorkspace();

  if (typeof initFrequencyCharts === 'function') initFrequencyCharts();
  if (typeof initIocChart === 'function') initIocChart();
});
