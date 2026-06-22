<script>
// poems.js — search + theme-filter for the Poeții Noștri index.
// Adapted from albums/js/songs.js: builds theme chips from .song-card[data-mood],
// live-searches title + poet + theme, updates stats. Romanian labels; no CTA rewrite.
(() => {
  const q = (sel, el = document) => el.querySelector(sel);
  const qa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const cards = qa(".songs-grid .song-card");
  const moodFilterEl = q("#moodFilter");
  const searchInput = q("#songSearch");
  const totalSongsEl = q("#totalSongs");
  const totalMoodsEl = q("#totalMoods");
  const visibleSongsEl = q("#visibleSongs");
  const noResultsEl = q(".no-results");
  const clearFiltersBtn = q("#clearFilters");
  if (!cards.length) return;

  const state = { mood: "all", query: "" };
  const norm = s => (s || "").toLowerCase().trim();
  const titleCase = (s) => s.replace(/\b[a-z]/g, ch => ch.toUpperCase()).replace(/-/g, " ");

  const tokenSet = (card) =>
    new Set(norm(card.dataset.mood || "").split(/\s+/).filter(Boolean));

  const getUniqueMoods = () => {
    const set = new Set();
    cards.forEach(card => tokenSet(card).forEach(m => set.add(m)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  };

  const makeBtn = (label, value, isActive = false) => {
    const btn = document.createElement("button");
    btn.className = "mood-btn" + (isActive ? " active" : "");
    btn.type = "button"; btn.role = "tab";
    btn.setAttribute("aria-selected", String(isActive));
    btn.dataset.mood = value; btn.textContent = label;
    btn.addEventListener("click", () => {
      state.mood = value; updateActiveButtons(); applyFilters(); pushUrlState();
    });
    return btn;
  };

  const renderMoodButtons = () => {
    const moods = getUniqueMoods();
    moodFilterEl.innerHTML = "";
    moodFilterEl.appendChild(makeBtn("Toate temele", "all", true));
    moods.forEach(m => moodFilterEl.appendChild(makeBtn(titleCase(m), m, false)));
    if (totalMoodsEl) totalMoodsEl.textContent = String(moods.length);
  };

  const updateActiveButtons = () => {
    qa(".mood-btn", moodFilterEl).forEach(btn => {
      const active = btn.dataset.mood === state.mood;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  };

  const applyFilters = () => {
    const qstr = norm(state.query);
    let visible = 0;
    cards.forEach(card => {
      const matchesMood = state.mood === "all" || tokenSet(card).has(state.mood);
      const title = norm(q(".song-title", card)?.textContent);
      const meta  = norm(q(".song-meta", card)?.textContent);
      const desc  = norm(q(".song-description", card)?.textContent);
      const badges = norm(qa(".song-badges .badge", card).map(b => b.textContent).join(" "));
      const matchesSearch = !qstr || [title, meta, desc, badges].some(t => t.includes(qstr));
      const show = matchesMood && matchesSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (visibleSongsEl) visibleSongsEl.textContent = String(visible);
    if (noResultsEl) noResultsEl.classList.toggle("hidden", visible !== 0);
  };

  const setTotals = () => { if (totalSongsEl) totalSongsEl.textContent = String(cards.length); };

  const readUrlState = () => {
    const p = new URLSearchParams(window.location.search);
    const mood = norm(p.get("mood")); const qp = p.get("q");
    if (mood) state.mood = mood;
    if (typeof qp === "string") { state.query = qp; if (searchInput) searchInput.value = qp; }
  };
  const pushUrlState = () => {
    const p = new URLSearchParams(window.location.search);
    state.mood && state.mood !== "all" ? p.set("mood", state.mood) : p.delete("mood");
    state.query ? p.set("q", state.query) : p.delete("q");
    window.history.replaceState({}, "", `${window.location.pathname}?${p.toString()}`);
  };
  const clearAll = () => {
    state.mood = "all"; state.query = "";
    if (searchInput) searchInput.value = "";
    updateActiveButtons(); applyFilters(); pushUrlState();
  };

  document.addEventListener("DOMContentLoaded", () => {
    setTotals(); renderMoodButtons(); readUrlState(); updateActiveButtons(); applyFilters();
    if (searchInput) searchInput.addEventListener("input", (e) => {
      state.query = e.target.value || ""; applyFilters(); pushUrlState();
    });
    if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAll);
  });
})();
</script>
