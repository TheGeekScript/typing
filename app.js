// Enhanced Typing Tutor Application with Random Paragraphs

class TypingTutor {
    constructor() {
        // Array of diverse practice paragraphs
        this.sampleParagraphs = [
            "Technology has revolutionized the way we communicate and work. From smartphones to artificial intelligence, these innovations have transformed our daily lives. The rapid pace of technological advancement continues to reshape industries and create new opportunities. As we embrace these changes, we must also consider their impact on society and the environment.",
            "Reading is one of the most rewarding habits a person can develop. Books open doors to new worlds, ideas, and perspectives that broaden our understanding. Through reading, we can learn from the experiences of others and gain valuable insights. The knowledge gained from books becomes a permanent part of our intellectual growth.",
            "The natural world offers endless beauty and wonder for those who take time to observe. From towering mountains to delicate flowers, nature displays incredible diversity and complexity. Every ecosystem plays a vital role in maintaining the balance of life on Earth. Protecting these natural environments is essential for future generations.",
            "Education is the foundation upon which successful societies are built. Quality learning experiences prepare individuals for meaningful careers and informed citizenship. Teachers play a crucial role in inspiring students and fostering critical thinking skills. Lifelong learning has become increasingly important in our rapidly changing world.",
            "The history of human civilization is filled with remarkable achievements and important lessons. Ancient cultures developed innovations that continue to influence modern society. Understanding our past helps us make better decisions for the future. Historical knowledge provides context for current events and social developments.",
            "Scientific discoveries have led to countless improvements in human life and well-being. Medical breakthroughs have eliminated diseases and extended lifespans significantly. Research in physics and chemistry has enabled technological marvels we use daily. The scientific method remains our best tool for understanding the universe around us.",
            "Effective communication skills are essential for success in both personal and professional relationships. Clear expression of ideas helps prevent misunderstandings and builds trust. Active listening demonstrates respect and helps us understand different perspectives. Good communication creates stronger connections between people and communities.",
            "The art of cooking brings people together and celebrates cultural traditions. Preparing meals with fresh ingredients promotes health and creativity in the kitchen. Family recipes passed down through generations preserve important cultural heritage. Sharing food with others creates lasting memories and strengthens social bonds.",
            "Physical exercise provides numerous benefits for both body and mind. Regular activity improves cardiovascular health and strengthens muscles and bones. Exercise also releases endorphins that enhance mood and reduce stress levels. Maintaining an active lifestyle contributes to longevity and overall quality of life.",
            "Creative expression through art, music, and writing enriches the human experience. These activities allow us to explore emotions and share our unique perspectives. Creativity stimulates brain function and provides therapeutic benefits for mental health. Supporting the arts ensures that culture and imagination continue to flourish.",
            "Environmental conservation requires collective action from individuals, businesses, and governments worldwide. Small changes in daily habits can significantly reduce our ecological footprint. Renewable energy sources offer sustainable alternatives to fossil fuels and climate solutions. The health of our planet depends on the choices we make today.",
            "Time management skills help us balance multiple responsibilities and achieve our goals effectively. Planning and prioritizing tasks increases productivity and reduces unnecessary stress. Learning to say no to less important commitments protects our time for what matters most. Good time management creates opportunities for both work and personal fulfillment."
        ];

        this.currentText = '';
        this.currentParagraphIndex = -1; // Start with -1 to ensure first paragraph is selected properly
        this.currentPosition = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.statsInterval = null;
        this.isActive = false;
        this.selectedDuration = 300; // Default 5 minutes
        this.timeElapsed = 0;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.loadRandomParagraph();
        this.updateTimer(this.selectedDuration);
    }

    initializeElements() {
        // Statistics elements
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.errorsElement = document.getElementById('errors');
        this.timerElement = document.getElementById('timer');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.paragraphInfo = document.getElementById('paragraphInfo');

        // Control elements
        this.timerSelect = document.getElementById('timerSelect');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.newParagraphBtn = document.getElementById('newParagraphBtn');
        this.keyboardToggle = document.getElementById('keyboardToggle');

        // Display elements
        this.textDisplay = document.getElementById('textDisplay');
        this.textInput = document.getElementById('textInput');
        this.virtualKeyboard = document.getElementById('virtualKeyboard');

        // Modal elements
        this.resultsModalElement = document.getElementById('resultsModal');
        this.finalWPM = document.getElementById('finalWPM');
        this.finalAccuracy = document.getElementById('finalAccuracy');
        this.finalErrors = document.getElementById('finalErrors');
        this.finalTime = document.getElementById('finalTime');
        this.performanceMessage = document.getElementById('performanceMessage');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.newTextBtn = document.getElementById('newTextBtn');

        console.log('Elements initialized');
    }

    bindEvents() {
        // Control events
        this.startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.startSession();
        });
        
        this.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.resetSession();
        });
        
        this.newParagraphBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('New Paragraph button clicked');
            this.loadRandomParagraph();
        });
        
        this.timerSelect.addEventListener('change', () => {
            this.selectedDuration = parseInt(this.timerSelect.value);
            if (!this.isActive) {
                this.updateTimer(this.selectedDuration);
            }
        });
        
        this.keyboardToggle.addEventListener('change', () => {
            this.toggleKeyboard();
        });
        
        this.tryAgainBtn.addEventListener('click', () => {
            this.hideModal();
            this.resetSession();
        });

        this.newTextBtn.addEventListener('click', () => {
            this.hideModal();
            this.loadRandomParagraph();
        });

        // Input events
        this.textInput.addEventListener('input', (e) => {
            this.handleInput(e);
        });
        
        this.textInput.addEventListener('focus', () => {
            if (!this.isActive) {
                this.startSession();
            }
        });
        
        this.textInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        this.textInput.addEventListener('paste', (e) => {
            e.preventDefault();
        });

        console.log('Events bound');
    }

    loadRandomParagraph() {
        console.log('Loading new random paragraph...');
        
        // Stop any active session first
        if (this.isActive) {
            this.resetSession();
        }
        
        // Show loading state
        if (this.textDisplay) {
            this.textDisplay.classList.add('loading-paragraph');
        }
        if (this.newParagraphBtn) {
            this.newParagraphBtn.disabled = true;
            this.newParagraphBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Loading...';
        }
        
        // Simulate brief loading delay for better UX
        setTimeout(() => {
            // Get a random paragraph different from current one
            let newIndex;
            if (this.sampleParagraphs.length === 1) {
                newIndex = 0;
            } else {
                do {
                    newIndex = Math.floor(Math.random() * this.sampleParagraphs.length);
                } while (newIndex === this.currentParagraphIndex);
            }
            
            this.currentParagraphIndex = newIndex;
            this.currentText = this.sampleParagraphs[this.currentParagraphIndex];
            
            console.log(`Selected paragraph ${this.currentParagraphIndex + 1}: "${this.currentText.substring(0, 50)}..."`);
            
            // Update paragraph info
            if (this.paragraphInfo) {
                this.paragraphInfo.textContent = `Paragraph ${this.currentParagraphIndex + 1} of ${this.sampleParagraphs.length}`;
            }
            
            // Display the new text
            this.displayText();
            
            // Reset all session data
            this.resetSessionData();
            
            // Remove loading state
            if (this.textDisplay) {
                this.textDisplay.classList.remove('loading-paragraph');
                this.textDisplay.classList.add('text-fade-in');
            }
            if (this.newParagraphBtn) {
                this.newParagraphBtn.disabled = false;
                this.newParagraphBtn.innerHTML = '<i class="fas fa-random me-1"></i>New Paragraph';
            }
            
            // Remove fade-in class after animation
            setTimeout(() => {
                if (this.textDisplay) {
                    this.textDisplay.classList.remove('text-fade-in');
                }
            }, 500);
            
            console.log(`Successfully loaded paragraph ${this.currentParagraphIndex + 1}`);
        }, 300);
    }

    displayText() {
        if (!this.textDisplay || !this.currentText) {
            console.error('Cannot display text: missing textDisplay element or currentText');
            return;
        }
        
        this.textDisplay.innerHTML = '';
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            if (i === 0) {
                span.classList.add('current');
            }
            this.textDisplay.appendChild(span);
        }
        console.log('Text displayed successfully');
    }

    resetSessionData() {
        this.currentPosition = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        this.startTime = null;
        this.endTime = null;
        this.timeElapsed = 0;
        
        if (this.textInput) {
            this.textInput.value = '';
        }
        
        this.updateStatistics();
        this.updateTimer(this.selectedDuration);
    }

    startSession() {
        if (this.isActive) return;
        
        console.log('Starting session...');
        this.isActive = true;
        this.startTime = new Date();
        this.timeElapsed = 0;
        
        if (this.textInput) {
            this.textInput.disabled = false;
            this.textInput.focus();
        }
        if (this.startBtn) {
            this.startBtn.innerHTML = '<i class="fas fa-pause me-1"></i>Running';
            this.startBtn.disabled = true;
        }
        if (this.newParagraphBtn) {
            this.newParagraphBtn.disabled = true;
        }
        
        this.startTimer();
        this.startStatsUpdater();
    }

    resetSession() {
        console.log('Resetting session...');
        this.isActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = null;
        }

        this.resetSessionData();
        
        if (this.textInput) {
            this.textInput.disabled = true;
        }
        if (this.startBtn) {
            this.startBtn.innerHTML = '<i class="fas fa-play me-1"></i>Start';
            this.startBtn.disabled = false;
        }
        if (this.newParagraphBtn) {
            this.newParagraphBtn.disabled = false;
        }
        
        this.displayText();
        this.clearKeyboardHighlight();
    }

    handleInput(e) {
        if (!this.isActive) return;

        const inputText = e.target.value;
        this.totalChars = inputText.length;
        this.currentPosition = Math.min(inputText.length, this.currentText.length);
        
        let correctCount = 0;

        // Update character highlighting
        const chars = this.textDisplay.children;
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            char.className = 'char';
            
            if (i < inputText.length) {
                if (inputText[i] === this.currentText[i]) {
                    char.classList.add('correct');
                    correctCount++;
                } else {
                    char.classList.add('incorrect');
                }
            } else if (i === inputText.length) {
                char.classList.add('current');
            }
        }

        this.correctChars = correctCount;
        this.errors = this.totalChars - this.correctChars;
        
        // Highlight current key on virtual keyboard
        this.highlightCurrentKey();
        
        // Update statistics immediately
        this.updateStatistics();
        
        // Check if text is completed
        if (inputText.length >= this.currentText.length) {
            this.endSession();
        }
    }

    handleKeydown(e) {
        if (!this.isActive) return;
        
        // Prevent backspace and arrow key navigation
        if (e.key === 'Backspace' || e.key.startsWith('Arrow')) {
            e.preventDefault();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            const remaining = this.selectedDuration - this.timeElapsed;
            
            if (remaining <= 0) {
                this.endSession();
                return;
            }
            
            this.updateTimer(remaining);
        }, 1000);
    }

    startStatsUpdater() {
        this.statsInterval = setInterval(() => {
            this.updateStatistics();
        }, 100);
    }

    updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (this.timerElement) {
            this.timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    updateStatistics() {
        // Calculate WPM
        let wpm = 0;
        if (this.isActive && this.timeElapsed > 0) {
            const timeElapsedMinutes = this.timeElapsed / 60;
            wpm = Math.round((this.correctChars / 5) / timeElapsedMinutes);
        }
        if (this.wpmElement) {
            this.wpmElement.textContent = wpm;
        }

        // Calculate accuracy
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        if (this.accuracyElement) {
            this.accuracyElement.textContent = `${accuracy}%`;
        }

        // Update errors
        if (this.errorsElement) {
            this.errorsElement.textContent = this.errors;
        }

        // Update progress
        const progress = this.currentText.length > 0 ? Math.round((this.currentPosition / this.currentText.length) * 100) : 0;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
            this.progressBar.setAttribute('aria-valuenow', progress);
        }
        if (this.progressText) {
            this.progressText.textContent = `${progress}%`;
        }
    }

    highlightCurrentKey() {
        this.clearKeyboardHighlight();
        
        if (this.currentPosition < this.currentText.length) {
            const currentChar = this.currentText[this.currentPosition].toLowerCase();
            const keyElement = document.querySelector(`[data-key="${currentChar}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }
        }
    }

    clearKeyboardHighlight() {
        document.querySelectorAll('.keyboard-key').forEach(key => {
            key.classList.remove('active');
        });
    }

    toggleKeyboard() {
        if (this.keyboardToggle && this.virtualKeyboard) {
            if (this.keyboardToggle.checked) {
                this.virtualKeyboard.style.display = 'block';
                this.highlightCurrentKey();
            } else {
                this.virtualKeyboard.style.display = 'none';
            }
        }
    }

    endSession() {
        console.log('Ending session...');
        this.isActive = false;
        this.endTime = new Date();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = null;
        }
        
        if (this.textInput) {
            this.textInput.disabled = true;
        }
        if (this.startBtn) {
            this.startBtn.innerHTML = '<i class="fas fa-play me-1"></i>Start';
            this.startBtn.disabled = false;
        }
        if (this.newParagraphBtn) {
            this.newParagraphBtn.disabled = false;
        }
        
        this.clearKeyboardHighlight();
        this.showResults();
    }

    showResults() {
        const timeElapsedTotal = this.timeElapsed;
        const minutes = Math.floor(timeElapsedTotal / 60);
        const seconds = timeElapsedTotal % 60;
        
        const wpm = this.timeElapsed > 0 ? Math.round((this.correctChars / 5) / (this.timeElapsed / 60)) : 0;
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        
        // Update modal content
        if (this.finalWPM) this.finalWPM.textContent = wpm;
        if (this.finalAccuracy) this.finalAccuracy.textContent = `${accuracy}%`;
        if (this.finalErrors) this.finalErrors.textContent = this.errors;
        if (this.finalTime) this.finalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Performance message
        let message = '';
        let alertClass = 'alert-info';
        
        if (wpm >= 60 && accuracy >= 95) {
            message = 'Outstanding! You\'re a typing master! 🏆 Try a new paragraph for more practice!';
            alertClass = 'alert-success';
        } else if (wpm >= 40 && accuracy >= 90) {
            message = 'Great job! Your typing skills are impressive! 🎉 Keep practicing with new paragraphs!';
            alertClass = 'alert-success';
        } else if (wpm >= 25 && accuracy >= 80) {
            message = 'Good work! Keep practicing to improve further! 👍 Try different paragraphs for variety!';
            alertClass = 'alert-info';
        } else {
            message = 'Keep practicing! Focus on accuracy first, then speed! 💪 New paragraphs await!';
            alertClass = 'alert-warning';
        }
        
        if (this.performanceMessage) {
            this.performanceMessage.textContent = message;
            this.performanceMessage.className = `alert ${alertClass} mt-3`;
        }
        
        // Show modal using Bootstrap
        this.showModal();
    }

    showModal() {
        if (window.bootstrap && window.bootstrap.Modal && this.resultsModalElement) {
            const modal = new window.bootstrap.Modal(this.resultsModalElement);
            modal.show();
        }
    }

    hideModal() {
        if (window.bootstrap && window.bootstrap.Modal && this.resultsModalElement) {
            const modal = window.bootstrap.Modal.getInstance(this.resultsModalElement);
            if (modal) {
                modal.hide();
            }
        }
    }
}

// Initialize the application
let typingTutor;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Enhanced Typing Tutor with Random Paragraphs Loading...');
    
    typingTutor = new TypingTutor();
    window.typingTutor = typingTutor;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (!typingTutor) return;
        
        // ESC to reset
        if (e.key === 'Escape' && typingTutor.isActive) {
            typingTutor.resetSession();
        }
        
        // Enter to start (when not typing)
        if (e.key === 'Enter' && !typingTutor.isActive && document.activeElement !== typingTutor.textInput) {
            e.preventDefault();
            typingTutor.startSession();
        }
        
        // Ctrl+N for new paragraph (when not typing)
        if (e.ctrlKey && e.key === 'n' && !typingTutor.isActive) {
            e.preventDefault();
            typingTutor.loadRandomParagraph();
        }
    });
});

console.log('💡 Tips: Use ESC to reset, Enter to start, Ctrl+N for new paragraph');
console.log('📝 12 diverse paragraphs available for endless practice!');
console.log('⌨️ Focus on accuracy first, speed will come naturally!');