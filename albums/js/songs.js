// js/songs.js
// Vanilla JS; no external libraries.
// Builds mood chips dynamically from .song-card[data-mood],
// applies search + filter, updates stats, and normalizes CTAs to "Listen & Watch".
<script>
(() => {
  const q = (sel, el = document) => el.querySelector(sel);
  const qa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // --- DOM refs
  const cards = qa(".songs-grid .song-card");
  const moodFilterEl = q("#moodFilter");              // new dynamic chip container
  const searchInput = q("#songSearch");
  const totalSongsEl = q("#totalSongs");
  const totalMoodsEl = q("#totalMoods");
  const visibleSongsEl = q("#visibleSongs");
  const noResultsEl = q(".no-results");
  const clearFiltersBtn = q("#clearFilters");

  if (!cards.length) return; // nothing to do

  // --- State
  const state = {
    mood: "all",
    query: ""
  };

  // --- Utils
  const norm = s => (s || "").toLowerCase().trim();

  const tokenSet = (card) => {
    // Split moods on whitespace; supports multi-tag per card like "transformative gritty"
    const moods = norm(card.dataset.mood || "")
      .split(/\s+/)
      .filter(Boolean);
    return new Set(moods);
  };

  // Collect unique moods across all cards
  const getUniqueMoods = () => {
    const set = new Set();
    cards.forEach(card => {
      tokenSet(card).forEach(m => set.add(m));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  };

  // Renders mood chip buttons (including "All")
  const renderMoodButtons = () => {
    const moods = getUniqueMoods();
    moodFilterEl.innerHTML = ""; // reset

    const makeBtn = (label, value, isActive = false) => {
      const btn = document.createElement("button");
      btn.className = "mood-btn" + (isActive ? " active" : "");
      btn.type = "button";
      btn.role = "tab";
      btn.setAttribute("aria-selected", String(isActive));
      btn.dataset.mood = value;
      btn.textContent = label;
      btn.addEventListener("click", () => {
        state.mood = value;
        updateActiveButtons();
        applyFilters();
        pushUrlState();
      });
      return btn;
    };

    // "All" first
    moodFilterEl.appendChild(makeBtn("All Moods", "all", true));

    // Then each unique mood
    moods.forEach(m => {
      moodFilterEl.appendChild(makeBtn(titleCase(m), m, false));
    });

    // Keyboard nav (← →)
    moodFilterEl.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const btns = qa(".mood-btn", moodFilterEl);
      const idx = btns.findIndex(b => b.classList.contains("active"));
      if (idx === -1) return;
      let next = e.key === "ArrowRight" ? idx + 1 : idx - 1;
      if (next < 0) next = btns.length - 1;
      if (next >= btns.length) next = 0;
      btns[next].focus();
      btns[next].click();
    });

    // Set counts after building
    if (totalMoodsEl) totalMoodsEl.textContent = String(moods.length);
  };

  const titleCase = (s) => s.replace(/\b[a-z]/g, ch => ch.toUpperCase()).replace(/-/g, " ");

  const updateActiveButtons = () => {
    qa(".mood-btn", moodFilterEl).forEach(btn => {
      const active = btn.dataset.mood === state.mood;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  };

  // Filter logic: mood + search
  const applyFilters = () => {
    const qstr = norm(state.query);
    let visible = 0;

    cards.forEach(card => {
      const moods = tokenSet(card);
      const matchesMood = state.mood === "all" || moods.has(state.mood);

      // Search over title + description + badges text
      const title = norm(q(".song-title", card)?.textContent);
      const desc  = norm(q(".song-description", card)?.textContent);
      const badgesText = norm(qa(".song-badges .badge", card).map(b => b.textContent).join(" "));
      const matchesSearch = !qstr || [title, desc, badgesText].some(t => t.includes(qstr));

      const show = matchesMood && matchesSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (visibleSongsEl) visibleSongsEl.textContent = String(visible);
    if (noResultsEl) noResultsEl.classList.toggle("hidden", visible !== 0);
  };

  // Normalize all main CTAs to "Listen & Watch"
  const normalizeCTAs = () => {
    qa(".song-actions .btn-primary").forEach(btn => {
      // If the primary button is an <a> or <button>, set its label
      if (btn.textContent.trim() !== "Listen & Watch") {
        btn.textContent = "Listen & Watch";
      }
    });
  };

  // Stats (total songs)
  const setTotals = () => {
    if (totalSongsEl) totalSongsEl.textContent = String(cards.length);
  };

  // URL deep-linking: ?mood=transformative&q=father
  const readUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    const mood = norm(params.get("mood"));
    const qParam = params.get("q");
    if (mood) state.mood = mood;
    if (typeof qParam === "string") {
      state.query = qParam;
      if (searchInput) searchInput.value = qParam;
    }
  };

  const pushUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    state.mood && state.mood !== "all" ? params.set("mood", state.mood) : params.delete("mood");
    state.query ? params.set("q", state.query) : params.delete("q");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Clear all
  const clearAll = () => {
    state.mood = "all";
    state.query = "";
    if (searchInput) searchInput.value = "";
    updateActiveButtons();
    applyFilters();
    pushUrlState();
  };

  // --- Init
  document.addEventListener("DOMContentLoaded", () => {
    normalizeCTAs();   // ensure all are Listen & Watch
    setTotals();       // total song count
    renderMoodButtons();
    readUrlState();
    updateActiveButtons();
    applyFilters();

    // Search binding
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.query = e.target.value || "";
        applyFilters();
        pushUrlState();
      });
    }

    // Clear button (appears inside .no-results)
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", clearAll);
    }
  });
})();
</script>