import { store } from './store';
import type { PrompterProject } from './types';

export class PresentationView {
  private container: HTMLElement;
  private project: PrompterProject;
  
  // State
  private isPlaying = false;
  private hasStarted = false;
  private countdownValue = 3;
  private elapsedSeconds = 0;
  private scrollPosition = 0;
  private lastFrameTime = 0;
  private animationFrameId: number | null = null;
  private totalScrollDistance = 0;

  // DOM Elements
  private textContainer!: HTMLDivElement;
  private viewport!: HTMLDivElement;
  private overlay!: HTMLDivElement;
  private progressBar!: HTMLDivElement;
  private timeElapsedEl!: HTMLSpanElement;
  private timeRemainingEl!: HTMLSpanElement;
  private playPauseBtn!: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.project = store.getState().project;
  }

  public mount() {
    this.render();
    this.attachEventListeners();
    this.calculateScrollDistance();
    
    if (this.project.countdownEnabled) {
      this.startCountdown();
    } else {
      this.hasStarted = true;
      this.startScrolling();
    }
  }

  public unmount() {
    this.stopScrolling();
    this.removeEventListeners();
    this.container.innerHTML = '';
  }

  private render() {
    const fontSize = this.project.fontSize || 48;
    const lineHeight = this.project.lineHeight || 1.5;
    
    this.container.innerHTML = `
      <div class="presentation-layout">
        <div class="presentation-header">
           <button id="btn-exit" class="secondary-btn">← Zurück</button>
           <div class="presentation-stats">
              <span id="time-elapsed">0:00</span>
              <div class="progress-track">
                <div id="progress-bar" class="progress-fill"></div>
              </div>
              <span id="time-remaining">${this.formatTime(this.project.targetDurationSeconds)}</span>
           </div>
           <div class="presentation-controls">
              <button id="btn-slower" class="icon-btn">-</button>
              <span class="speed-indicator">${this.project.manualSpeed.toFixed(1)}x</span>
              <button id="btn-faster" class="icon-btn">+</button>
           </div>
        </div>
        
        <div id="prompter-viewport" class="prompter-viewport">
          <div id="prompter-text" class="prompter-text" style="font-size: ${fontSize}px; line-height: ${lineHeight}; ${this.project.mirrorMode ? 'transform: scaleX(-1);' : ''}">
            ${this.project.text.replace(/\n/g, '<br>')}
          </div>
          <div id="countdown-overlay" class="countdown-overlay hidden">
            <span id="countdown-number">3</span>
          </div>
        </div>

        <div class="presentation-footer">
          <button id="btn-reset" class="secondary-btn">Reset (R)</button>
          <button id="btn-playpause" class="primary-btn">Start (Leertaste)</button>
        </div>
      </div>
    `;

    this.viewport = this.container.querySelector('#prompter-viewport') as HTMLDivElement;
    this.textContainer = this.container.querySelector('#prompter-text') as HTMLDivElement;
    this.overlay = this.container.querySelector('#countdown-overlay') as HTMLDivElement;
    this.progressBar = this.container.querySelector('#progress-bar') as HTMLDivElement;
    this.timeElapsedEl = this.container.querySelector('#time-elapsed') as HTMLSpanElement;
    this.timeRemainingEl = this.container.querySelector('#time-remaining') as HTMLSpanElement;
    this.playPauseBtn = this.container.querySelector('#btn-playpause') as HTMLButtonElement;
  }

  private calculateScrollDistance() {
    // Add padding so the text scrolls completely off screen
    const viewportHeight = this.viewport.clientHeight;
    this.textContainer.style.paddingTop = `${viewportHeight / 2}px`;
    this.textContainer.style.paddingBottom = `${viewportHeight / 2}px`;
    this.totalScrollDistance = this.textContainer.scrollHeight - viewportHeight;
  }

  private formatTime(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  }

  private startCountdown() {
    this.countdownValue = 3;
    this.overlay.classList.remove('hidden');
    this.overlay.querySelector('#countdown-number')!.textContent = this.countdownValue.toString();
    
    const interval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        this.overlay.querySelector('#countdown-number')!.textContent = this.countdownValue.toString();
      } else {
        clearInterval(interval);
        this.overlay.classList.add('hidden');
        this.hasStarted = true;
        this.startScrolling();
      }
    }, 1000);
  }

  private togglePlayPause = () => {
    if (!this.hasStarted) return;
    if (this.isPlaying) {
      this.stopScrolling();
      this.playPauseBtn.textContent = 'Fortsetzen (Leertaste)';
    } else {
      this.startScrolling();
      this.playPauseBtn.textContent = 'Pause (Leertaste)';
    }
  };

  private startScrolling() {
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.scrollLoop);
    this.playPauseBtn.textContent = 'Pause (Leertaste)';
  }

  private stopScrolling() {
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private reset = () => {
    this.stopScrolling();
    this.hasStarted = false;
    this.scrollPosition = 0;
    this.elapsedSeconds = 0;
    this.textContainer.style.transform = `translateY(0px)`;
    this.updateProgressUI();
    this.playPauseBtn.textContent = 'Start (Leertaste)';
    if (this.project.countdownEnabled) {
      this.startCountdown();
    } else {
      this.hasStarted = true;
      this.startScrolling();
    }
  };

  private scrollLoop = (time: number) => {
    if (!this.isPlaying) return;

    const deltaMs = time - this.lastFrameTime;
    this.lastFrameTime = time;

    // Calculate pixels per second based on target duration and manual speed multiplier
    const baseSpeed = this.totalScrollDistance / this.project.targetDurationSeconds;
    const currentSpeed = baseSpeed * this.project.manualSpeed;

    const deltaY = currentSpeed * (deltaMs / 1000);
    this.scrollPosition += deltaY;
    this.elapsedSeconds += (deltaMs / 1000) * this.project.manualSpeed;

    if (this.scrollPosition >= this.totalScrollDistance) {
      this.scrollPosition = this.totalScrollDistance;
      this.stopScrolling();
      this.playPauseBtn.textContent = 'Beendet';
    } else {
      this.animationFrameId = requestAnimationFrame(this.scrollLoop);
    }

    this.textContainer.style.transform = `translateY(-${this.scrollPosition}px)`;
    this.updateProgressUI();
  };

  private updateProgressUI() {
    const progress = Math.min(100, (this.scrollPosition / this.totalScrollDistance) * 100);
    this.progressBar.style.width = `${progress}%`;
    this.timeElapsedEl.textContent = this.formatTime(this.elapsedSeconds);
    const remaining = this.project.targetDurationSeconds - this.elapsedSeconds;
    this.timeRemainingEl.textContent = this.formatTime(remaining);
  }

  private adjustSpeed = (delta: number) => {
    const newSpeed = Math.max(0.1, this.project.manualSpeed + delta);
    store.updateProject({ manualSpeed: newSpeed });
    this.project = store.getState().project;
    this.container.querySelector('.speed-indicator')!.textContent = `${this.project.manualSpeed.toFixed(1)}x`;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        e.preventDefault();
        store.setViewMode('editor');
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.adjustSpeed(0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.adjustSpeed(-0.1);
        break;
      case 'KeyR':
        e.preventDefault();
        this.reset();
        break;
    }
  };

  private attachEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    
    this.container.querySelector('#btn-exit')?.addEventListener('click', () => {
      store.setViewMode('editor');
    });
    
    this.container.querySelector('#btn-playpause')?.addEventListener('click', this.togglePlayPause);
    this.container.querySelector('#btn-reset')?.addEventListener('click', this.reset);
    
    this.container.querySelector('#btn-faster')?.addEventListener('click', () => this.adjustSpeed(0.1));
    this.container.querySelector('#btn-slower')?.addEventListener('click', () => this.adjustSpeed(-0.1));
  }

  private removeEventListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
