import { store } from './store';
import type { PrompterProject } from './types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { t } from './i18n';

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  addEventListener?: (type: 'release', listener: () => void) => void;
  removeEventListener?: (type: 'release', listener: () => void) => void;
};

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

type WebKitAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

async function playEndSignal() {
  try {
    const AudioContextClass = window.AudioContext || (window as WebKitAudioWindow).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.35);

    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // End signal is non-critical and must never block the presentation.
  }
}

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
  private countdownIntervalId: number | null = null;
  private totalScrollDistance = 0;
  private hasRecordedRun = false;
  private runCompleted = false;
  private wakeLockSentinel: WakeLockSentinelLike | null = null;
  private wakeLockRequestId = 0;
  private isMounted = false;

  // DOM Elements
  private textContainer!: HTMLDivElement;
  private viewport!: HTMLDivElement;
  private overlay!: HTMLDivElement;
  private progressBar!: HTMLDivElement;
  private timeElapsedEl!: HTMLSpanElement;
  private timeRemainingEl!: HTMLSpanElement;
  private playPauseBtn!: HTMLButtonElement;
  private fullscreenBtn!: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.project = store.getState().project;
  }

  public mount() {
    this.isMounted = true;
    this.render();
    this.attachEventListeners();
    requestAnimationFrame(() => {
      this.calculateScrollDistance();
      this.updateProgressUI();
    });
    
    // Focus play button for accessibility
    setTimeout(() => {
      if (this.playPauseBtn) {
        this.playPauseBtn.focus();
      }
    }, 50);
    
    if (this.project.countdownEnabled) {
      this.startCountdown();
    } else {
      this.hasStarted = true;
      this.playPauseBtn.textContent = t('presentation.start');
    }
  }

  public unmount() {
    this.isMounted = false;
    this.recordCancelledRun();
    this.clearCountdown();
    this.stopScrolling();
    void this.releaseWakeLock();
    this.removeEventListeners();
    this.container.innerHTML = '';
  }

  private render() {
    const rawHtml = marked.parse(this.project.text, { breaks: true, async: false }) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    
    this.container.innerHTML = `
      <div class="presentation-layout">
        <div class="presentation-header">
           <button id="btn-exit" class="button button--secondary">← ${t('presentation.back')}</button>
           <button id="btn-fullscreen" class="button button--secondary">${t('presentation.fullscreen')}</button>
        </div>
        
        <div id="prompter-viewport" class="prompter-viewport">
          <div id="prompter-text" class="prompter-text">
            ${cleanHtml}
          </div>
          ${this.project.focusLine ? '<div class="focus-line"></div>' : ''}
          <div id="countdown-overlay" class="countdown-overlay hidden">
            <span id="countdown-number">3</span>
          </div>
        </div>

        <div class="presentation-footer">
           <span id="time-elapsed" class="presentation-stats">0:00</span>
           <div class="progress-track">
             <div id="progress-bar" class="progress-fill"></div>
           </div>
           <span id="time-remaining" class="presentation-stats">${this.formatTime(this.project.targetDurationSeconds)}</span>
           
           <div class="presentation-controls">
              <button id="btn-slower" class="icon-button" aria-label="${t('presentation.speedDecrease')}">-</button>
              <span class="speed-indicator">${this.project.manualSpeed.toFixed(1)}x</span>
              <button id="btn-faster" class="icon-button" aria-label="${t('presentation.speedIncrease')}">+</button>
           </div>
           
           <button id="btn-reset" class="icon-button" aria-label="${t('presentation.reset')}">↺</button>
           <button id="btn-playpause" class="button button--primary">${t('presentation.startHint')}</button>
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
    this.fullscreenBtn = this.container.querySelector('#btn-fullscreen') as HTMLButtonElement;
    this.applyTextStyle();
  }

  private applyTextStyle() {
    this.textContainer.style.fontSize = `${this.project.fontSize || 48}px`;
    this.textContainer.style.lineHeight = String(this.project.lineHeight || 1.5);
    this.updateTextTransform();
  }

  private updateTextTransform() {
    this.textContainer.style.transform = `translateY(-${this.scrollPosition}px) ${this.project.mirrorMode ? 'scaleX(-1)' : ''}`;
  }

  private calculateScrollDistance() {
    const viewportHeight = this.viewport.clientHeight;
    this.textContainer.style.paddingTop = `${viewportHeight / 2}px`;
    this.textContainer.style.paddingBottom = `${viewportHeight / 2}px`;
    this.totalScrollDistance = Math.max(0, this.textContainer.scrollHeight - viewportHeight);
  }

  private handleResize = () => {
    const progress =
      this.totalScrollDistance <= 0 ? 0 : this.scrollPosition / this.totalScrollDistance;
    this.calculateScrollDistance();
    this.scrollPosition = this.totalScrollDistance * progress;
    this.updateTextTransform();
    this.updateProgressUI();
  };

  private formatTime(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  }

  private startCountdown() {
    this.clearCountdown();
    this.stopScrolling();
    this.countdownValue = 3;
    this.playPauseBtn.textContent = t('presentation.countdown');
    this.overlay.classList.remove('hidden');
    this.overlay.querySelector('#countdown-number')!.textContent = this.countdownValue.toString();
    
    this.countdownIntervalId = window.setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        this.overlay.querySelector('#countdown-number')!.textContent = this.countdownValue.toString();
      } else {
        this.clearCountdown();
        this.overlay.classList.add('hidden');
        this.hasStarted = true;
        this.startScrolling();
      }
    }, 1000);
  }

  private clearCountdown() {
    if (this.countdownIntervalId !== null) {
      window.clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  private togglePlayPause = () => {
    if (!this.hasStarted) return;
    if (this.isPlaying) {
      this.stopScrolling();
      this.playPauseBtn.textContent = t('presentation.resume');
    } else {
      this.startScrolling();
      this.playPauseBtn.textContent = t('presentation.pause');
    }
  };

  private startScrolling() {
    this.clearCountdown();
    const timerComplete =
      this.totalScrollDistance <= 0 && this.elapsedSeconds >= this.project.targetDurationSeconds;
    const scrollComplete =
      this.totalScrollDistance > 0 && this.scrollPosition >= this.totalScrollDistance;
    if (timerComplete || scrollComplete) {
      this.scrollPosition = 0;
      this.elapsedSeconds = 0;
      this.hasRecordedRun = false;
      this.runCompleted = false;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.scrollLoop);
    this.playPauseBtn.textContent = t('presentation.pause');
    void this.requestWakeLock();
  }

  private stopScrolling() {
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private reset = () => {
    this.recordCancelledRun();
    this.clearCountdown();
    this.stopScrolling();
    void this.releaseWakeLock();
    this.hasStarted = false;
    this.hasRecordedRun = false;
    this.runCompleted = false;
    this.scrollPosition = 0;
    this.elapsedSeconds = 0;
    this.updateTextTransform();
    this.updateProgressUI();
    this.playPauseBtn.textContent = t('presentation.start');
    if (this.project.countdownEnabled) {
      this.startCountdown();
    } else {
      this.hasStarted = true;
      this.playPauseBtn.textContent = t('presentation.start');
    }
  };

  private scrollLoop = (time: number) => {
    if (!this.isPlaying) return;

    const deltaMs = time - this.lastFrameTime;
    this.lastFrameTime = time;

    const baseSpeed = this.getBaseSpeed();
    const currentSpeed = baseSpeed * this.project.manualSpeed;

    const deltaY = currentSpeed * (deltaMs / 1000);
    this.elapsedSeconds += deltaMs / 1000;

    if (this.totalScrollDistance <= 0) {
      if (this.elapsedSeconds >= this.project.targetDurationSeconds) {
        this.elapsedSeconds = this.project.targetDurationSeconds;
        this.stopScrolling();
        this.playPauseBtn.textContent = t('presentation.end');
        this.recordCompletedRun();
        void this.releaseWakeLock();
      } else {
        this.animationFrameId = requestAnimationFrame(this.scrollLoop);
      }

      this.updateProgressUI();
      return;
    }

    this.scrollPosition += deltaY;

    if (this.scrollPosition >= this.totalScrollDistance) {
      this.scrollPosition = this.totalScrollDistance;
      this.stopScrolling();
      this.playPauseBtn.textContent = t('presentation.end');
      this.recordCompletedRun();
      void this.releaseWakeLock();
    } else {
      this.animationFrameId = requestAnimationFrame(this.scrollLoop);
    }

    this.updateTextTransform();
    this.updateProgressUI();
  };

  private updateProgressUI() {
    const progress =
      this.totalScrollDistance <= 0
        ? Math.min(100, (this.elapsedSeconds / Math.max(1, this.project.targetDurationSeconds)) * 100)
        : Math.min(100, (this.scrollPosition / this.totalScrollDistance) * 100);
    this.progressBar.style.width = `${progress}%`;
    this.timeElapsedEl.textContent = this.formatTime(this.elapsedSeconds);
    const remaining = this.getRemainingSeconds();
    this.timeRemainingEl.textContent = this.formatTime(remaining);
  }

  private getBaseSpeed(): number {
    if (this.totalScrollDistance <= 0) return 0;
    return this.totalScrollDistance / Math.max(1, this.project.targetDurationSeconds);
  }

  private getRemainingSeconds(): number {
    if (this.totalScrollDistance <= 0) {
      return Math.max(0, this.project.targetDurationSeconds - this.elapsedSeconds);
    }
    const currentSpeed = this.getBaseSpeed() * this.project.manualSpeed;
    if (currentSpeed <= 0) return 0;
    const remainingDistance = Math.max(0, this.totalScrollDistance - this.scrollPosition);
    return remainingDistance / currentSpeed;
  }

  private adjustSpeed = (delta: number) => {
    const newSpeed = Math.max(0.1, this.project.manualSpeed + delta);
    store.updateProject({ manualSpeed: newSpeed });
    this.project = store.getState().project;
    this.container.querySelector('.speed-indicator')!.textContent = `${this.project.manualSpeed.toFixed(1)}x`;
    this.updateProgressUI();
  };

  private toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await this.container.querySelector('.presentation-layout')?.requestFullscreen();
      }
      this.updateFullscreenButton();
    } catch {
      this.fullscreenBtn.textContent = t('presentation.fullscreenUnavailable');
      window.setTimeout(() => this.updateFullscreenButton(), 1800);
    }
  };

  private updateFullscreenButton = () => {
    if (!this.fullscreenBtn) return;
    this.fullscreenBtn.textContent = document.fullscreenElement
      ? t('presentation.fullscreenExit')
      : t('presentation.fullscreen');
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        e.preventDefault();
        this.handleExit();
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

  private handleExit = () => {
    this.recordCancelledRun();
    void this.releaseWakeLock();
    store.setViewMode('editor');
    // Set focus back to 'Präsentieren' button when Editor mounts
    setTimeout(() => {
      const presentBtn = document.getElementById('btn-present');
      if (presentBtn) {
        presentBtn.focus();
      }
    }, 50);
  };

  private recordCompletedRun() {
    if (this.hasRecordedRun) return;
    this.hasRecordedRun = true;
    this.runCompleted = true;
    store.addPitchRun('completed', this.elapsedSeconds);
    void playEndSignal();
  }

  private recordCancelledRun() {
    if (this.hasRecordedRun || this.runCompleted || this.elapsedSeconds <= 0) return;
    this.hasRecordedRun = true;
    store.addPitchRun('cancelled', this.elapsedSeconds);
  }

  private async requestWakeLock() {
    if (this.wakeLockSentinel) return;
    const requestId = ++this.wakeLockRequestId;
    try {
      const wakeLock = (navigator as WakeLockNavigator).wakeLock;
      if (!wakeLock) return;
      const sentinel = await wakeLock.request('screen');
      if (!this.isMounted || requestId !== this.wakeLockRequestId || this.wakeLockSentinel) {
        await sentinel.release().catch(() => undefined);
        return;
      }
      this.wakeLockSentinel = sentinel;
      sentinel.addEventListener?.('release', this.handleWakeLockRelease);
    } catch {
      if (requestId === this.wakeLockRequestId) {
        this.wakeLockSentinel = null;
      }
    }
  }

  private async releaseWakeLock() {
    this.wakeLockRequestId++;
    const sentinel = this.wakeLockSentinel;
    if (!sentinel) return;
    this.wakeLockSentinel = null;
    sentinel.removeEventListener?.('release', this.handleWakeLockRelease);
    try {
      await sentinel.release();
    } catch {
      // Browser already released the lock.
    }
  }

  private handleWakeLockRelease = () => {
    this.wakeLockSentinel = null;
  };

  private attachEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
    
    this.container.querySelector('#btn-exit')?.addEventListener('click', this.handleExit);
    this.container.querySelector('#btn-fullscreen')?.addEventListener('click', this.toggleFullscreen);
    
    this.container.querySelector('#btn-playpause')?.addEventListener('click', this.togglePlayPause);
    this.container.querySelector('#btn-reset')?.addEventListener('click', this.reset);
    
    this.container.querySelector('#btn-faster')?.addEventListener('click', () => this.adjustSpeed(0.1));
    this.container.querySelector('#btn-slower')?.addEventListener('click', () => this.adjustSpeed(-0.1));
    document.addEventListener('fullscreenchange', this.updateFullscreenButton);
  }

  private removeEventListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('fullscreenchange', this.updateFullscreenButton);
  }
}
