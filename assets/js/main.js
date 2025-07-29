/* Dr. Shrink Landing Page - Enhanced JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // Hero button scroll and recorder initialization
  const heroBtn = document.getElementById('heroMic');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const micComponent = document.getElementById('micComponent');
      if (micComponent) {
        micComponent.scrollIntoView({ behavior: 'smooth' });
        // Initialize the full recorder UI
        initRecorder('#micComponent');
      }
    });
  }

  // Initialize testimonial carousel with simple rotation (no Swiper dependency)
  initTestimonialCarousel();
  
  // Initialize example audio players
  initExamplePlayers();
});

/* Simple Testimonial Carousel */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const testimonials = carousel.querySelectorAll('blockquote');
  if (testimonials.length <= 1) return;

  let currentIndex = 0;
  
  // Hide all testimonials except the first
  testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
      testimonial.style.display = 'none';
    }
  });

  // Rotate testimonials every 5 seconds
  setInterval(() => {
    testimonials[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % testimonials.length;
    testimonials[currentIndex].style.display = 'block';
  }, 5000);
}

/* Enhanced Recorder Component */
function initRecorder(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Create the full recorder UI
  container.innerHTML = `
    <div class="mic-section">
      <div class="instructions" id="instructions">Tap the mic and speak for up to 60 seconds</div>
      <div class="sub-instructions">Your voice stays private and isn't stored anywhere</div>
      
      <button class="mic-button" id="micButton" aria-label="Start recording">
        <i class="fas fa-microphone mic-icon"></i>
      </button>
      
      <div class="transcript-box" id="transcriptBox">
        <div class="transcript-placeholder">Your words will appear here...</div>
      </div>
      
      <div class="control-buttons">
        <button class="btn btn-danger" id="stopButton" disabled>
          <i class="fas fa-stop"></i> Stop Recording
        </button>
      </div>
      
      <!-- Step 2: Customization -->
      <div id="step2" class="hidden">
        <h3 class="section-heading">Customize Your Healing Song</h3>
        
        <div class="form-group">
          <label for="musicGenre">Music Genre:</label>
          <select id="musicGenre">
            <option value="Ambient/Meditative">Ambient/Meditative</option>
            <option value="Acoustic Folk">Acoustic Folk</option>
            <option value="Piano Ballad">Piano Ballad</option>
            <option value="Soft Rock">Soft Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Classical">Classical</option>
            <option value="Lo-fi Hip Hop">Lo-fi Hip Hop</option>
            <option value="Indie Pop">Indie Pop</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="primaryFeeling">Primary Emotion to Address:</label>
          <select id="primaryFeeling">
            <option value="Anxiety/Stress">Anxiety/Stress</option>
            <option value="Sadness/Depression">Sadness/Depression</option>
            <option value="Grief/Loss">Grief/Loss</option>
            <option value="Anger/Frustration">Anger/Frustration</option>
            <option value="Loneliness">Loneliness</option>
            <option value="Fear/Uncertainty">Fear/Uncertainty</option>
            <option value="Overwhelm">Overwhelm</option>
            <option value="Heartbreak">Heartbreak</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="songVibe">Desired Song Vibe:</label>
          <select id="songVibe">
            <option value="Gentle and soothing">Gentle and soothing</option>
            <option value="Empowering and uplifting">Empowering and uplifting</option>
            <option value="Reflective and contemplative">Reflective and contemplative</option>
            <option value="Hopeful and inspiring">Hopeful and inspiring</option>
            <option value="Cathartic and releasing">Cathartic and releasing</option>
            <option value="Peaceful and calming">Peaceful and calming</option>
          </select>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="includeTranscript" checked>
          <label for="includeTranscript">Include my personal story in the song prompt</label>
        </div>
        
        <button class="btn btn-primary" id="generateBtn">
          <i class="fas fa-magic"></i> Generate My Healing Song Prompt
        </button>
      </div>
      
      <!-- Step 3: Generated Prompt -->
      <div id="step3" class="prompt-container hidden">
        <h3 class="section-heading">Your Personalized Song Prompt</h3>
        
        <div class="prompt-wrapper">
          <div class="prompt-header">
            <h4>Ready to copy & paste into any AI music platform:</h4>
            <button class="copy-btn" id="copyPromptBtn">
              <i class="fas fa-copy"></i> Copy Prompt
            </button>
          </div>
          <div class="prompt-box" id="promptBox"></div>
        </div>
        
        <div class="ai-platforms">
          <a href="https://suno.com" target="_blank" rel="noopener" class="ai-platform">Suno AI</a>
          <a href="https://udio.com" target="_blank" rel="noopener" class="ai-platform">Udio</a>
          <a href="https://soundraw.io" target="_blank" rel="noopener" class="ai-platform">Soundraw</a>
          <a href="https://boomy.com" target="_blank" rel="noopener" class="ai-platform">Boomy</a>
        </div>
        
        <button class="btn btn-outline" id="emailBtn">
          <i class="fas fa-envelope"></i> Email This Prompt to Me
        </button>
      </div>
    </div>
    
    <div class="privacy-note">
      <strong>🔒 Your Privacy Matters:</strong> Your voice recording happens entirely in your browser and is never uploaded to our servers. We don't store, analyze, or have access to anything you say. This tool is designed to be completely private and secure.
    </div>
  `;

  // Initialize the recorder functionality
  initRecorderLogic();
}

/* Core Recorder Logic */
function initRecorderLogic() {
  const micButton = document.getElementById('micButton');
  const instructions = document.getElementById('instructions');
  const transcriptBox = document.getElementById('transcriptBox');
  const stopButton = document.getElementById('stopButton');
  const generateBtn = document.getElementById('generateBtn');
  const copyPromptBtn = document.getElementById('copyPromptBtn');
  const emailBtn = document.getElementById('emailBtn');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const promptBox = document.getElementById('promptBox');

  let recognition;
  let isRecording = false;
  let transcript = '';
  let generatedPrompt = '';

  // Initialize Speech Recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
      isRecording = true;
      micButton.classList.add('recording');
      instructions.textContent = "Listening... speak freely about what's on your mind";
      transcriptBox.classList.add('active');
      stopButton.disabled = false;
      transcriptBox.innerHTML = '<div class="transcript-placeholder">Listening...</div>';
    };

    recognition.onresult = function(event) {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      transcript = transcript + finalTranscript;
      
      if (transcript || interimTranscript) {
        transcriptBox.innerHTML = `
          <div class="transcript-content">
            ${transcript}<span style="color: var(--accent); opacity: 0.7;">${interimTranscript}</span>
          </div>`;
      }
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      stopRecording();
      instructions.textContent = "Microphone access denied or error occurred. Please try again.";
    };

    recognition.onend = function() {
      if (isRecording) {
        stopRecording();
      }
    };

    micButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);

  } else {
    micButton.style.cursor = 'not-allowed';
    micButton.style.opacity = '0.5';
    instructions.textContent = "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.";
  }

  function startRecording() {
    if (!recognition || isRecording) return;
    
    transcript = '';
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      instructions.textContent = "Failed to start recording. Please try again.";
    }
  }

  function stopRecording() {
    if (!isRecording) return;

    recognition.stop();
    isRecording = false;
    micButton.classList.remove('recording');
    transcriptBox.classList.remove('active');
    stopButton.disabled = true;

    if (transcript.trim() !== '') {
      instructions.textContent = "Great! Now let's customize your healing song.";
      transcriptBox.innerHTML = `<div class="transcript-content">${transcript}</div>`;
      showCustomizationStep();
    } else {
      instructions.textContent = "No speech detected. Please try again.";
      transcriptBox.innerHTML = '<div class="transcript-placeholder">No speech detected. Try speaking louder or closer to your microphone.</div>';
    }
  }

  function showCustomizationStep() {
    step2.classList.remove('hidden');
    step2.scrollIntoView({ behavior: 'smooth' });
  }

  function generatePrompt() {
    const genre = document.getElementById('musicGenre').value;
    const feeling = document.getElementById('primaryFeeling').value;
    const vibe = document.getElementById('songVibe').value;
    const includeTranscript = document.getElementById('includeTranscript').checked;

    let prompt = `Create a therapeutic song with these specifications:\n\n`;
    prompt += `🎵 Genre: ${genre}\n`;
    prompt += `💭 Primary Emotion: ${feeling}\n`;
    prompt += `✨ Vibe: ${vibe}\n\n`;

    if (includeTranscript && transcript.trim() !== '') {
      prompt += `📖 Inspired by this personal story:\n"${transcript}"\n\n`;
    }

    prompt += `🎯 The song should include:\n`;
    prompt += `• 3-4 verses that progress emotionally from the current state to a place of healing\n`;
    prompt += `• A powerful, memorable chorus that encapsulates the core feeling\n`;
    prompt += `• A bridge that offers a moment of transformation or new perspective\n`;
    prompt += `• Lyrics that validate the emotion and gently guide toward growth and release\n\n`;
    prompt += `📝 Please provide:\n`;
    prompt += `1. Complete song lyrics with clear [Verse], [Chorus], and [Bridge] labels\n`;
    prompt += `2. A brief description of the suggested melody and chord progression\n\n`;
    prompt += `🎼 Make it meaningful, authentic, and healing.`;

    generatedPrompt = prompt;
    promptBox.textContent = prompt;
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    step3.scrollIntoView({ behavior: 'smooth' });
  }

  function copyPromptToClipboard() {
    if (!generatedPrompt) return;

    navigator.clipboard.writeText(generatedPrompt).then(() => {
      const originalText = copyPromptBtn.innerHTML;
      copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyPromptBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

      setTimeout(() => {
        copyPromptBtn.innerHTML = originalText;
        copyPromptBtn.style.background = 'linear-gradient(135deg, var(--accent), var(--warm-orange))';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    });
  }

  function sendEmail() {
    if (!generatedPrompt) {
      alert('Please generate a prompt first!');
      return;
    }

    const genre = document.getElementById('musicGenre').value;
    const feeling = document.getElementById('primaryFeeling').value;
    const vibe = document.getElementById('songVibe').value;
    const subject = `🎵 My Dr. Shrink Healing Song Prompt - ${genre} for ${feeling}`;
    const body = `Here's my personalized healing song prompt from Dr. Shrink:\n\n${generatedPrompt}\n\n---\nGenerated at ${new Date().toLocaleString()}\nFrom: https://thedoctorshrink.com`;
    
    const emailUrl = `mailto:hello@thedoctorshrink.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;

    const originalText = emailBtn.innerHTML;
    emailBtn.innerHTML = '<i class="fas fa-check"></i> Email Opened!';
    emailBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    setTimeout(() => {
      emailBtn.innerHTML = originalText;
      emailBtn.style.background = 'linear-gradient(135deg, var(--accent), var(--warm-orange))';
    }, 3000);
  }

  // Event listeners
  if (generateBtn) generateBtn.addEventListener('click', generatePrompt);
  if (copyPromptBtn) copyPromptBtn.addEventListener('click', copyPromptToClipboard);
  if (emailBtn) emailBtn.addEventListener('click', sendEmail);
}

/* Example Audio Player Enhancement */
function initExamplePlayers() {
  const examplePlayButtons = document.querySelectorAll('.play-button-example');
  const audioTracks = {
    anxiety: '/albums/HorizonLines.mp3',
    hope: '/albums/MelttheGlacier.mp3',
    grief: '/albums/LuminousGround.mp3'
  };
  
  let currentlyPlayingButton = null;
  let currentAudio = null;

  examplePlayButtons.forEach(button => {
    button.addEventListener('click', () => {
      const trackKey = button.dataset.track;
      const trackSrc = audioTracks[trackKey];

      // Stop any currently playing audio
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Reset previous button
      if (currentlyPlayingButton && currentlyPlayingButton !== button) {
        currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i>';
      }

      // Toggle current button
      if (currentlyPlayingButton === button) {
        button.innerHTML = '<i class="fas fa-play"></i>';
        currentlyPlayingButton = null;
        currentAudio = null;
      } else {
        // Create new audio element
        currentAudio = new Audio(trackSrc);
        currentAudio.play().catch(err => {
          console.error('Audio playback failed:', err);
          button.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
          setTimeout(() => {
            button.innerHTML = '<i class="fas fa-play"></i>';
          }, 2000);
          return;
        });

        button.innerHTML = '<i class="fas fa-pause"></i>';
        currentlyPlayingButton = button;

        // Reset when audio ends
        currentAudio.addEventListener('ended', () => {
          button.innerHTML = '<i class="fas fa-play"></i>';
          currentlyPlayingButton = null;
          currentAudio = null;
        });

        // Handle audio errors
        currentAudio.addEventListener('error', () => {
          console.error('Audio loading error for:', trackSrc);
          button.innerHTML = '<i class="fas fa-play"></i>';
          currentlyPlayingButton = null;
          currentAudio = null;
        });
      }
    });
  });
}

/* Dr. Shrink Landing Page - Enhanced JavaScript */

/* Dr. Shrink Landing Page - Enhanced JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // ONE domReady block only
  initHeroButton();
  initTestimonialCarousel();
  initExamplePlayers();
});

/* --------------------------------- Hero Button */
function initHeroButton() {
  const heroBtn = document.getElementById('heroMic');
  if (!heroBtn) return;
  let recorderInjected = false;                       // ➊ PATCH

  heroBtn.addEventListener('click', () => {
    const micComponent = document.getElementById('micComponent');
    if (!micComponent) return;

    if (!recorderInjected) {                          // ➋ PATCH
      initRecorder('#micComponent');
      recorderInjected = true;                        // ➌ PATCH
    }
    micComponent.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ------------------------------- Testimonial carousel */
function initTestimonialCarousel() { /* unchanged */ }

/* ----------------------------- Recorder Component */
function initRecorder(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = recorderMarkup();             // extract template into fn
  initRecorderLogic(container);                       // pass container for scoped query
}

function recorderMarkup() { /* return the long template string */ }

/* -------------- Core Recorder Logic (scoped to this container) */
function initRecorderLogic(root) {                    // ➍ PATCH
  // query *inside* root so IDs needn’t be global duplicates
  const micButton  = root.querySelector('#micButton');
  const stopButton = root.querySelector('#stopButton');
  const instructions   = root.querySelector('#instructions');
  const transcriptBox  = root.querySelector('#transcriptBox');
  const step2 = root.querySelector('#step2');
  const promptBox = root.querySelector('#promptBox');
  let copyPromptBtn, emailBtn;                        // ➎ declare now, attach later

  /* Speech‑recognition logic … (unchanged) */

  function generatePrompt() {
    /* build prompt text … */
    promptBox.textContent = generatedPrompt;
    step2.classList.add('hidden');

    const step3 = root.querySelector('#step3');       // ➏ re‑query after it exists
    step3.classList.remove('hidden');
    step3.scrollIntoView({ behavior: 'smooth' });

    copyPromptBtn = root.querySelector('#copyPromptBtn'); // ➐ now they exist
    emailBtn      = root.querySelector('#emailBtn');
    copyPromptBtn.addEventListener('click', copyPromptToClipboard);
    emailBtn.addEventListener('click', sendEmail);
  }

  root.querySelector('#generateBtn')
      .addEventListener('click', generatePrompt);
}

/* ---------------- Example Audio Players (unchanged) */
function initExamplePlayers() { /* unchanged */ }