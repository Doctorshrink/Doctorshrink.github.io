<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('songSearch');
  const filterButtons = document.querySelectorAll('[data-genre]');
  const moodButtons = document.querySelectorAll('[data-mood]');
  const songCards = document.querySelectorAll('.song-card');
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
      
      console.log(`${isFavorited ? 'Removed' : 'Added'} "${songTitle}" ${isFavorited ? 'from' : 'to'} favorites`);
    });
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
</script>