Of course. The problem you're encountering is a classic issue when mixing large blocks of raw HTML, CSS, and JavaScript directly into a Quarto (`.qmd`) file.

Quarto's parser tries to interpret everything as Markdown unless you explicitly tell it not to. The special characters in your CSS (`{`, `}`, `::`, `>`) and JavaScript (`{`, `}`, `=>`) are confusing the parser, leading to incorrect rendering.

The fix is to wrap your CSS and JavaScript in the correct Quarto code blocks to tell Quarto: "Treat this as raw code and pass it directly to the output."

Here are the two changes needed:
  
  1.  **For the CSS:** Wrap the entire `<style>...</style>` block in a raw HTML block: ````{=html}`.
2.  **For the JavaScript:** Replace the `<script>...</script>` tags with a Quarto JavaScript block: ````{javascript}`. This is the idiomatic way to include executable JS in a Quarto HTML document.

### Corrected Quarto Document

Here is the full, corrected `.qmd` file. I've marked the specific areas that were changed.

```quarto
---
title: "Albums"
subtitle: "Experience musical therapy with Doctor Shrink's powerful anthems of resilience"
title-block-banner: true
page-layout: full
anchor-sections: false
css: tds-therapy.css
---

::: {.hero .songs-hero}
::: {.hero-content}
# Soulful Melodies from the Pacific {.hero-title aria-label="Soulful Melodies from the Pacific"}
::: {.hero-subtitle}
Where Oceanic Roots Meet Contemporary Poetry - Therapeutic anthems for healing and empowerment
:::
:::
:::

::: {.search-section}
::: {.search-container}
<div class="search-input-wrapper">
  <input type="search" id="songSearch" placeholder="Search songs, themes, or moods..." aria-label="Search songs">
  <span class="search-icon">🔍</span>
</div>
:::
:::

::: {.filter-section}
::: {.genre-filter role="tablist" aria-label="Genre filter"}
<button class="filter-btn active" data-genre="all" role="tab" aria-selected="true">All Genres</button>
<button class="filter-btn" data-genre="soul" role="tab" aria-selected="false">Soul</button>
<button class="filter-btn" data-genre="mental-health" role="tab" aria-selected="false">Mental Health</button>
<button class="filter-btn" data-genre="empowerment" role="tab" aria-selected="false">Empowerment</button>
<button class="filter-btn" data-genre="therapy" role="tab" aria-selected="false">Therapy</button>
<button class="filter-btn" data-genre="spiritual" role="tab" aria-selected="false">Spiritual</button>
:::

::: {.mood-filter role="tablist" aria-label="Mood filter"}
<button class="mood-btn active" data-mood="all" role="tab" aria-selected="true">All Moods</button>
<button class="mood-btn" data-mood="uplifting" role="tab" aria-selected="false">Uplifting</button>
<button class="mood-btn" data-mood="reflective" role="tab" aria-selected="false">Reflective</button>
<button class="mood-btn" data-mood="healing" role="tab" aria-selected="false">Healing</button>
<button class="mood-btn" data-mood="empowering" role="tab" aria-selected="false">Empowering</button>
:::
:::

::: {.songs-stats}
<div class="stats-container">
  <div class="stat-item">
    <span class="stat-number" id="totalSongs">1</span>
    <span class="stat-label">Songs</span>
  </div>
  <div class="stat-item">
    <span class="stat-number" id="totalGenres">6</span>
    <span class="stat-label">Genres</span>
  </div>
  <div class="stat-item">
    <span class="stat-number" id="visibleSongs">1</span>
    <span class="stat-label">Showing</span>
  </div>
</div>
:::

::: {.songs-grid}
<!-- Songs will be dynamically loaded here -->
<div class="song-card featured" data-genre="soul mental-health empowerment therapy spiritual" data-mood="uplifting empowering healing" data-location="Brisbane">
  <div class="song-image-container">
    <img src="images/iamdoctorshrink.jpg" alt="I Am Doctor Shrink album cover" loading="lazy" class="song-image">
    <div class="play-overlay">
      <button class="play-btn" aria-label="Play I Am Doctor Shrink">▶️</button>
    </div>
    <div class="song-badges">
      <span class="badge featured-badge">Featured</span>
      <span class="badge new-badge">New</span>
    </div>
  </div>
  
  <div class="song-content">
    <div class="song-header">
      <h3 class="song-title">
        <a href="iamdoctorshrink.qmd">I Am Doctor Shrink</a>
      </h3>
      <div class="song-meta">
        <span class="artist">Doctor Shrink</span>
        <span class="release-date">July 2025</span>
        <span class="location">Brisbane</span>
      </div>
    </div>
    
    <div class="song-description">
      <p>A powerful anthem of self-identity and therapeutic empowerment, blending soulful melodies with messages of healing and resilience.</p>
    </div>
    
    <div class="song-tags">
      <span class="tag">Soul</span>
      <span class="tag">Mental Health</span>
      <span class="tag">Empowerment</span>
      <span class="tag">Therapy</span>
      <span class="tag">Spiritual</span>
    </div>
    
    <div class="song-actions">
      <a href="iamdoctorshrink.qmd" class="btn btn-primary">Listen Now</a>
      <button class="btn btn-outline share-btn" data-song="I Am Doctor Shrink">Share</button>
      <button class="btn btn-outline favorite-btn" data-song="I Am Doctor Shrink" aria-label="Add to favorites">💙</button>
    </div>
  </div>
</div>

<!-- Placeholder for future songs -->
<div class="coming-soon-card">
  <div class="coming-soon-content">
    <div class="coming-soon-icon">🎵</div>
    <h3>More Songs Coming Soon</h3>
    <p>Doctor Shrink is working on new therapeutic anthems. Stay tuned for more soulful melodies that heal and inspire.</p>
    <button class="btn btn-outline notify-btn">Notify Me</button>
  </div>
</div>
:::

::: {.no-results .hidden}
<div class="no-results-content">
  <div class="no-results-icon">🔍</div>
  <h3>No songs found</h3>
  <p>Try adjusting your search terms or filters to discover more music.</p>
  <button class="btn btn-primary" id="clearFilters">Clear All Filters</button>
</div>
:::

<!-- FIX 1: Wrap the <style> tag in a raw HTML block -->
```{=html}
<style>
/* Albums-specific styles that extend tds-therapy.css */

.songs-hero {
  background: linear-gradient(135deg, var(--bg-color) 0%, #1e3a3f 50%, var(--calm-blue-dark) 100%);
  position: relative;
  overflow: hidden;
}

.songs-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="music-notes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" font-size="12" fill="rgba(255,255,255,0.1)">♪</text></pattern></defs><rect width="100" height="100" fill="url(%23music-notes)"/></svg>');
  pointer-events: none;
}

.search-section {
  background: var(--bg-color-secondary);
  padding: 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

#songSearch {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  background: var(--bg-card);
  color: var(--text-color);
  font-size: 1.1rem;
  font-family: var(--font-primary);
  transition: all 0.3s ease;
}

#songSearch:focus {
  outline: none;
  border-color: var(--healing-green);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
}

.search-icon {
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
  color: var(--text-color-muted);
  pointer-events: none;
}

.filter-section {
  background: var(--bg-card);
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.genre-filter, .mood-filter {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-btn, .mood-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  background: transparent;
  color: var(--text-color-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover, .mood-btn:hover,
.filter-btn.active, .mood-btn.active {
  background: var(--healing-green);
  color: white;
  border-color: var(--healing-green);
}

.songs-stats {
  background: var(--bg-color-secondary);
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--healing-green);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-color-muted);
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.song-card {
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
}

.song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-color: var(--healing-green);
}

.song-card.featured {
  border: 2px solid var(--healing-green);
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.2);
}

.song-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.song-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.song-card:hover .song-image {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.song-card:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  background: var(--healing-green);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: var(--healing-green-dark);
  transform: scale(1.1);
}

.song-badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.featured-badge {
  background: var(--healing-green);
  color: white;
}

.new-badge {
  background: var(--calm-blue);
  color: white;
}

.song-content {
  padding: 1.5rem;
}

.song-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.song-title a {
  color: var(--text-color-headings);
  text-decoration: none;
}

.song-title a:hover {
  color: var(--healing-green);
}

.song-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text-color-muted);
}

.song-meta span::before {
  content: "• ";
  margin-right: 0.25rem;
}

.song-meta span:first-child::before {
  display: none;
}

.song-description {
  margin-bottom: 1rem;
}

.song-description p {
  font-size: 0.95rem;
  line-height: 1.6;
}

.song-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba(46, 204, 113, 0.1);
  color: var(--healing-green);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.song-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.song-actions .btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.coming-soon-card {
  background: var(--bg-card);
  border: 2px dashed var(--border-color);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: var(--text-color-muted);
}

.coming-soon-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.coming-soon-card h3 {
  color: var(--text-color-headings);
  margin-bottom: 1rem;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-color-muted);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hidden {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .songs-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .stats-container {
    gap: 1rem;
  }
  
  .genre-filter, .mood-filter {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .filter-btn, .mood-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .song-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .song-actions .btn {
    width: 100%;
  }
}
</style>
```

<!-- FIX 2: Replace <script> tag with a Quarto javascript block -->
```{javascript}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('songSearch');
  const filterButtons = document.querySelectorAll('[data-genre]');
  const moodButtons = document.querySelectorAll('[data-mood]');
  const songCards = document.querySelectorAll('.song-card:not(.coming-soon-card)');
  const noResults = document.querySelector('.no-results');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const visibleSongsCounter = document.getElementById('visibleSongs');
  
  let currentGenre = 'all';
  let currentMood = 'all';
  let currentSearch = '';

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    filterSongs();
  });

  // Genre filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentGenre = button.dataset.genre;
      updateActiveFilter(filterButtons, button);
      filterSongs();
    });
  });

  // Mood filter functionality
  moodButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentMood = button.dataset.mood;
      updateActiveFilter(moodButtons, button);
      filterSongs();
    });
  });

  // Clear filters
  clearFiltersBtn.addEventListener('click', () => {
    currentGenre = 'all';
    currentMood = 'all';
    currentSearch = '';
    searchInput.value = '';
    
    // Reset active states
    filterButtons.forEach(btn => btn.classList.remove('active'));
    moodButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active');
    moodButtons[0].classList.add('active');
    
    filterSongs();
  });

  // Share functionality
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const songTitle = e.target.dataset.song;
      if (navigator.share) {
        try {
          await navigator.share({
            title: songTitle,
            text: `Check out "${songTitle}" by Doctor Shrink`,
            url: window.location.href
          });
        } catch (err) {
          console.log('Error sharing:', err);
        }
      } else {
        // Fallback for browsers without Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Share', 2000);
      }
    });
  });

  // Favorite functionality
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const songTitle = e.target.dataset.song;
      const isFavorited = btn.classList.contains('favorited');
      
      if (isFavorited) {
        btn.classList.remove('favorited');
        btn.textContent = '💙';
        btn.setAttribute('aria-label', 'Add to favorites');
      } else {
        btn.classList.add('favorited');
        btn.textContent = '❤️';
        btn.setAttribute('aria-label', 'Remove from favorites');
      }
      
      // Here you could save to localStorage or send to server
      console.log(`${isFavorited ? 'Removed' : 'Added'} "${songTitle}" ${isFavorited ? 'from' : 'to'} favorites`);
    });
  });

  // Notification signup
  document.querySelector('.notify-btn')?.addEventListener('click', () => {
    alert('Thanks for your interest! We\'ll notify you when new songs are available.');
  });

  function updateActiveFilter(buttons, activeButton) {
    buttons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
  }

  function filterSongs() {
    let visibleCount = 0;
    
    songCards.forEach(card => {
      const genres = card.dataset.genre?.split(' ') || [];
      const moods = card.dataset.mood?.split(' ') || [];
      const title = card.querySelector('.song-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.song-description')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
      
      const matchesGenre = currentGenre === 'all' || genres.includes(currentGenre);
      const matchesMood = currentMood === 'all' || moods.includes(currentMood);
      const matchesSearch = currentSearch === '' || 
        title.includes(currentSearch) || 
        description.includes(currentSearch) ||
        tags.some(tag => tag.includes(currentSearch));
      
      const shouldShow = matchesGenre && matchesMood && matchesSearch;
      
      if (shouldShow) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update visible count
    visibleSongsCounter.textContent = visibleCount;
    
    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
    }
  }

  // Keyboard accessibility for filters
  [...filterButtons, ...moodButtons].forEach(button => {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  images.forEach(img => imageObserver.observe(img));

  // Initialize filters
  filterSongs();
});
```

### Pro-Tip for Future Projects

While embedding CSS and JS like this works for a single page, a more organized approach for larger projects is to keep them in separate files.

You could create `albums.css` and `albums.js` files and link them in the YAML header:

```yaml
---
title: "Albums"
# ... other options
format: html
css:
  - tds-therapy.css
  - albums.css
include-in-header:
  - albums.js
---
```

This keeps your `.qmd` file focused on content and makes your code more modular and reusable. However, the fix provided above is the most direct solution to your rendering problem.