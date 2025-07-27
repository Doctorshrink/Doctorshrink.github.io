<script>
// Fixed songs.js with proper click handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Songs page JavaScript loaded');
    
    // Get all necessary elements
    const moodButtons = document.querySelectorAll('.mood-btn');
    const songCards = document.querySelectorAll('.song-card');
    const searchInput = document.getElementById('songSearch');
    const noResults = document.querySelector('.no-results');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    // Stats elements
    const totalSongsElement = document.getElementById('totalSongs');
    const visibleSongsElement = document.getElementById('visibleSongs');
    
    let currentMoodFilter = 'all';
    let currentSearchQuery = '';
    
    // Initialize stats
    updateStats();
    
    // FIXED: Mood filter functionality - only target mood buttons, not song cards
    moodButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active class from all mood buttons
            moodButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update current filter
            currentMoodFilter = this.getAttribute('data-mood');
            
            // Apply filters
            applyFilters();
        });
    });
    
    // FIXED: Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchQuery = this.value.toLowerCase().trim();
            applyFilters();
        });
    }
    
    // FIXED: Song card click handling - Allow navigation to work properly
    songCards.forEach(card => {
        // Remove any existing click handlers that might interfere
        card.style.cursor = 'pointer';
        
        // Handle clicks on the card itself (but not on links/buttons inside)
        card.addEventListener('click', function(e) {
            // Don't handle if click was on a link, button, or interactive element
            if (e.target.tagName === 'A' || 
                e.target.tagName === 'BUTTON' || 
                e.target.closest('a') || 
                e.target.closest('button')) {
                return; // Let the default behavior happen
            }
            
            // Find the main link in the card and navigate to it
            const mainLink = this.querySelector('.song-title a') || 
                            this.querySelector('.play-btn-link') ||
                            this.querySelector('.btn-primary');
            
            if (mainLink && mainLink.href) {
                window.location.href = mainLink.href;
            }
        });
    });
    
    // FIXED: Favorite button functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            
            const songName = this.getAttribute('data-song');
            this.classList.toggle('favorited');
            
            // Update button text/emoji based on state
            if (this.classList.contains('favorited')) {
                this.innerHTML = this.innerHTML.includes('💪') ? '💪' : '❤️';
                console.log(`Added "${songName}" to favorites`);
            } else {
                this.innerHTML = this.innerHTML.includes('💪') ? '💪' : '💙';
                console.log(`Removed "${songName}" from favorites`);
            }
        });
    });
    
    // Clear filters functionality
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset mood filter
            currentMoodFilter = 'all';
            moodButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            const allMoodBtn = document.querySelector('.mood-btn[data-mood="all"]');
            if (allMoodBtn) {
                allMoodBtn.classList.add('active');
                allMoodBtn.setAttribute('aria-selected', 'true');
            }
            
            // Reset search
            currentSearchQuery = '';
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Apply filters (show all)
            applyFilters();
        });
    }
    
    // FIXED: Filter application function
    function applyFilters() {
        let visibleCount = 0;
        
        songCards.forEach(card => {
            let shouldShow = true;
            
            // Check mood filter
            if (currentMoodFilter !== 'all') {
                const cardMoods = card.getAttribute('data-mood') || '';
                if (!cardMoods.includes(currentMoodFilter)) {
                    shouldShow = false;
                }
            }
            
            // Check search filter
            if (currentSearchQuery && shouldShow) {
                const title = card.querySelector('.song-title')?.textContent?.toLowerCase() || '';
                const description = card.querySelector('.song-description')?.textContent?.toLowerCase() || '';
                const artist = card.querySelector('.artist')?.textContent?.toLowerCase() || '';
                
                const searchableText = `${title} ${description} ${artist}`;
                if (!searchableText.includes(currentSearchQuery)) {
                    shouldShow = false;
                }
            }
            
            // Show/hide card with smooth transition
            if (shouldShow) {
                card.style.display = 'block';
                card.setAttribute('aria-hidden', 'false');
                visibleCount++;
                
                // Add a small delay for smooth appearance
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.setAttribute('aria-hidden', 'true');
                
                // Hide after transition
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
        
        // Update visible count
        if (visibleSongsElement) {
            visibleSongsElement.textContent = visibleCount;
        }
    }
    
    // Update stats function
    function updateStats() {
        if (totalSongsElement) {
            totalSongsElement.textContent = songCards.length;
        }
        if (visibleSongsElement) {
            visibleSongsElement.textContent = songCards.length;
        }
    }
    
    // Add smooth transitions to cards
    songCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Keyboard navigation support
    songCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const mainLink = this.querySelector('.song-title a') || 
                                this.querySelector('.btn-primary');
                if (mainLink) {
                    mainLink.click();
                }
            }
        });
    });
    
    console.log('Songs page initialized successfully');
});
</script>