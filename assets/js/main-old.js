/* Dr. Shrink – legacy recorder + player logic  (main-old.js) */
document.addEventListener('DOMContentLoaded', function () {
  /* ---------- DOM refs ---------- */
  const micButton      = document.getElementById('micButton');
  const instructions   = document.getElementById('instructions');
  const transcriptBox  = document.getElementById('transcriptBox');
  const stopButton     = document.getElementById('stopButton');
  const generateBtn    = document.getElementById('generateBtn');
  const copyPromptBtn  = document.getElementById('copyPromptBtn');
  const emailBtn       = document.getElementById('emailBtn');
  const step1          = document.getElementById('step1');
  const step2          = document.getElementById('step2');
  const step3          = document.getElementById('step3');
  const promptBox      = document.getElementById('promptBox');

  const examplePlayButtons = document.querySelectorAll('.play-button-example');
  const audioPlayer        = document.getElementById('example-audio-player');

  /* ---------- Example‑track handling ---------- */
  const audioTracks = {
    anxiety: '/albums/HorizonLines.mp3',
    hope:    '/albums/MelttheGlacier.mp3',
    grief:   '/albums/LuminousGround.mp3'
  };
  let currentlyPlayingButton = null;

  examplePlayButtons.forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.track;
    const src = audioTracks[key];

    if (currentlyPlayingButton === btn) {
      audioPlayer.pause();
      btn.innerHTML = '<i class="fas fa-play"></i>';
      currentlyPlayingButton = null;
    } else {
      if (currentlyPlayingButton) {
        currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i>';
      }
      audioPlayer.src = src;
      audioPlayer.load();
      audioPlayer.play();
      btn.innerHTML = '<i class="fas fa-pause"></i>';
      currentlyPlayingButton = btn;
    }
  }));

  audioPlayer.addEventListener('ended', () => {
    if (currentlyPlayingButton) {
      currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i>';
      currentlyPlayingButton = null;
    }
  });
  audioPlayer.addEventListener('error', showAudioError);
  audioPlayer.addEventListener('pause', () => {
    if (currentlyPlayingButton) {
      currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i>';
      currentlyPlayingButton = null;
    }
  });

  function showAudioError(msg) {
    console.error('Audio error:', msg);
    if (currentlyPlayingButton) {
      currentlyPlayingButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      setTimeout(() => {
        currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i>';
      }, 2000);
    }
  }

  /* ---------- Speech‑to‑text ---------- */
  let recognition, isRecording = false, transcript = '', generatedPrompt = '';

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecording = true;
      micButton.classList.add('recording');
      instructions.textContent = 'Listening... speak freely';
      transcriptBox.classList.add('active');
      stopButton.disabled = false;
      transcriptBox.innerHTML = '<div class="transcript-placeholder">Listening...</div>';
    };

    recognition.onresult = (e) => {
      let interim = '', fin = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) { fin    += e.results[i][0].transcript + ' '; }
        else                     { interim += e.results[i][0].transcript; }
      }
      transcript += fin;
      if (transcript || interim) {
        transcriptBox.innerHTML =
          `<div class="transcript-content">${transcript}<span style="color: var(--healing-green); opacity:.7;">${interim}</span></div>`;
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error', e.error);
      stopRecording();
      instructions.textContent = 'Error or mic access denied. Please try again.';
    };
    recognition.onend = () => { if (isRecording) stopRecording(); };

    micButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
  } else {
    micButton.style.cursor = 'not-allowed';
    instructions.textContent = 'Speech recognition not supported in this browser.';
  }

  function startRecording() {
    if (!recognition || isRecording) return;
    transcript = '';
    try { recognition.start(); }
    catch (err) {
      console.error('Failed to start recording:', err);
      instructions.textContent = 'Failed to start recording. Please try again.';
    }
  }
  function stopRecording() {
    if (!isRecording) return;
    recognition.stop();
    isRecording = false;
    micButton.classList.remove('recording');
    transcriptBox.classList.remove('active');
    stopButton.disabled = true;

    if (transcript.trim()) {
      instructions.textContent = 'Tap to start speaking';
      transcriptBox.innerHTML = `<div class="transcript-content">${transcript}</div>`;
      showCustomizationStep();
    } else {
      instructions.textContent = 'No speech detected. Tap to try again.';
      transcriptBox.innerHTML = '<div class="transcript-placeholder">No speech detected.</div>';
    }
  }
  function showCustomizationStep() {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  }

  /* ---------- Prompt generator ---------- */
  function generatePrompt() {
    const genre   = document.getElementById('musicGenre').value;
    const feeling = document.getElementById('primaryFeeling').value;
    const vibe    = document.getElementById('songVibe').value;
    const include = document.getElementById('includeTranscript').checked;

    let prompt = `Create a therapeutic song with these specifications:\n\n`;
    prompt += `🎵 Genre: ${genre}\n`;
    prompt += `💭 Primary Emotion: ${feeling}\n`;
    prompt += `✨ Vibe: ${vibe}\n\n`;

    if (include && transcript.trim()) {
      prompt += `📖 Inspired by this personal story:\n"${transcript}"\n\n`;
    }

    prompt += `🎯 The song should include:\n`;
    prompt += `• 3-4 verses that progress emotionally from the current state to a place of healing.\n`;
    prompt += `• A powerful, memorable chorus that encapsulates the core feeling.\n`;
    prompt += `• A bridge that offers a moment of transformation or a new perspective.\n`;
    prompt += `• Lyrics that validate the emotion and gently guide toward growth and release.\n\n`;
    prompt += `📝 Please provide:\n`;
    prompt += `1. Complete song lyrics with clear [Verse], [Chorus], and [Bridge] labels.\n`;
    prompt += `2. A brief description of the suggested melody and chord progression.\n\n`;
    prompt += `🎼 Make it meaningful, authentic, and healing.`;

    generatedPrompt = prompt;
    promptBox.textContent = prompt;
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
  }

  function copyPromptToClipboard() {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      const ori = copyPromptBtn.innerHTML;
      copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyPromptBtn.style.background = 'linear-gradient(135deg,#28a745,#20c997)';
      setTimeout(() => {
        copyPromptBtn.innerHTML = ori;
        copyPromptBtn.style.background = 'linear-gradient(135deg,var(--healing-green),var(--warm-orange))';
      }, 2000);
    }).catch(fallbackCopy);
  }
  function fallbackCopy() {
    const ta = document.createElement('textarea');
    ta.value = generatedPrompt;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); }
    catch (err) { console.error('Fallback copy failed', err); }
    document.body.removeChild(ta);
  }

  function sendEmail() {
    if (!generatedPrompt) { alert('Please generate a prompt first!'); return; }
    const genre   = document.getElementById('musicGenre').value;
    const feeling = document.getElementById('primaryFeeling').value;
    const subject = `🎵 My Dr. Shrink Healing Song Prompt – ${genre} for ${feeling}`;
    const body    = generatedPrompt;
    window.location.href =
      `mailto:hello@thedoctorshrink.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const ori = emailBtn.innerHTML;
    emailBtn.innerHTML = '<i class="fas fa-check"></i> Email Opened!';
    emailBtn.style.background = 'linear-gradient(135deg,#28a745,#20c997)';
    setTimeout(() => {
      emailBtn.innerHTML = ori;
      emailBtn.style.background = 'linear-gradient(135deg,var(--healing-green),var(--warm-orange))';
    }, 3000);
  }

  /* ---------- Event bindings ---------- */
  generateBtn .addEventListener('click', generatePrompt);
  copyPromptBtn.addEventListener('click', copyPromptToClipboard);
  emailBtn     && emailBtn.addEventListener('click', sendEmail);
});
