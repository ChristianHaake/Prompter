import { store } from './store';
import type { PrompterProject } from './types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { t } from './i18n';

type PresentationMode = 'preview' | 'presentation';

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
  private mode: PresentationMode;
  private unsubscribe: (() => void) | null = null;
  
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
  private sectionTargets: HTMLElement[] = [];
  private currentSectionIndex = 0;

  constructor(container: HTMLElement, mode: PresentationMode = 'presentation') {
    this.container = container;
    this.project = store.getState().project;
    this.mode = mode;
  }

  public mount() {
    this.isMounted = true;
    this.render();
    this.attachEventListeners();
    if (this.mode === 'preview') {
      this.unsubscribe = store.subscribe(state => {
        this.project = state.project;
        this.render();
        this.attachElementEventListeners();
        requestAnimationFrame(() => {
          this.calculateScrollDistance();
          this.updateProgressUI();
        });
      });
    }
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
    
    if (this.mode === 'preview') {
      this.hasStarted = false;
      this.playPauseBtn.textContent = t('preview.static');
      this.playPauseBtn.disabled = true;
    } else if (this.project.countdownEnabled) {
      this.startCountdown();
    } else {
      this.hasStarted = true;
      this.playPauseBtn.textContent = t('presentation.start');
    }
  }

  public unmount() {
    this.isMounted = false;
    if (this.mode === 'presentation') {
      this.recordCancelledRun();
    }
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.clearCountdown();
    this.stopScrolling();
    void this.releaseWakeLock();
    this.removeEventListeners();
    this.container.innerHTML = '';
  }

  private render() {
    const rawHtml = marked.parse(this.project.text, { breaks: true, async: false }) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    const isPreview = this.mode === 'preview';
    
    this.container.innerHTML = `
      <div class="presentation-layout presentation-layout--${this.mode} prompter-theme--${this.project.textColorTheme}">
        <div class="presentation-header">
           <button id="btn-exit" class="button button--secondary">← ${isPreview ? t('preview.back') : t('presentation.back')}</button>
           ${isPreview ? '' : `<button id="btn-fullscreen" class="button button--secondary">${t('presentation.fullscreen')}</button>`}
        </div>
        ${isPreview ? this.renderPreviewSettings() : ''}
        
        <div id="prompter-viewport" class="prompter-viewport" role="region" aria-label="${t('presentation.viewport')}">
          <div id="prompter-text" class="prompter-text" aria-live="${isPreview ? 'polite' : 'off'}">
            ${cleanHtml}
          </div>
          ${this.project.focusLine ? '<div class="focus-line"></div>' : ''}
          <div id="countdown-overlay" class="countdown-overlay hidden">
            <span id="countdown-number">3</span>
          </div>
        </div>

        <div class="presentation-footer">
           <span class="presentation-stats"><span class="visually-hidden">${t('presentation.elapsed')}</span><span id="time-elapsed">0:00</span></span>
           <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
             <div id="progress-bar" class="progress-fill"></div>
           </div>
           <span class="presentation-stats"><span class="visually-hidden">${t('presentation.remaining')}</span><span id="time-remaining">${this.formatTime(this.project.targetDurationSeconds)}</span></span>
          
           <div class="presentation-controls">
              <button id="btn-slower" class="icon-button" aria-label="${t('presentation.speedDecrease')}">-</button>
              <span class="speed-indicator" role="status" aria-live="polite">${this.project.manualSpeed.toFixed(1)}x</span>
              <button id="btn-faster" class="icon-button" aria-label="${t('presentation.speedIncrease')}">+</button>
           </div>
           <div class="section-controls" aria-label="${t('presentation.sections')}">
              <button id="btn-section-prev" class="icon-button" aria-label="${t('presentation.previousSection')}">↑</button>
              <button id="btn-section-next" class="icon-button" aria-label="${t('presentation.nextSection')}">↓</button>
           </div>
           
           ${isPreview ? '' : `<button id="btn-reset" class="icon-button" aria-label="${t('presentation.reset')}">↺</button>`}
           <button id="btn-playpause" class="button button--primary" ${isPreview ? 'disabled' : ''}>${isPreview ? t('preview.static') : t('presentation.startHint')}</button>
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
    this.sectionTargets = Array.from(
      this.textContainer.querySelectorAll<HTMLElement>('h1, h2, h3, hr'),
    );
    this.applyTextStyle();
    this.updateSectionButtons();
  }

  private renderPreviewSettings(): string {
    return `
      <div class="preview-settings" aria-label="${t('preview.settings')}">
        <label>
          <span>${t('editor.settings.fontSize')}</span>
          <input id="preview-fontsize" type="number" min="16" max="160" step="4" value="${this.project.fontSize}" />
        </label>
        <label>
          <span>${t('editor.settings.lineHeight')}</span>
          <input id="preview-lineheight" type="number" min="1.1" max="2.4" step="0.1" value="${this.project.lineHeight}" />
        </label>
        <label>
          <span>${t('editor.settings.focusLinePosition')}</span>
          <input id="preview-focus-position" type="range" min="20" max="80" step="1" value="${this.project.focusLinePosition}" aria-valuetext="${this.project.focusLinePosition}%" />
        </label>
        <label>
          <span>${t('editor.settings.mirrorMode')}</span>
          <select id="preview-mirror">
            <option value="false" ${!this.project.mirrorMode ? 'selected' : ''}>${t('editor.options.normal')}</option>
            <option value="true" ${this.project.mirrorMode ? 'selected' : ''}>${t('editor.options.mirror')}</option>
          </select>
        </label>
      </div>
    `;
  }

  private applyTextStyle() {
    this.textContainer.style.fontSize = `${this.project.fontSize || 48}px`;
    this.textContainer.style.lineHeight = String(this.project.lineHeight || 1.5);
    this.textContainer.style.fontFamily = this.getFontFamily();
    const focusLine = this.container.querySelector<HTMLElement>('.focus-line');
    if (focusLine) {
      focusLine.style.top = `${this.project.focusLinePosition}%`;
    }
    this.updateTextTransform();
  }

  private getFontFamily(): string {
    switch (this.project.fontFamily) {
      case 'serif':
        return 'Georgia, "Times New Roman", serif';
      case 'mono':
        return '"SFMono-Regular", Consolas, "Liberation Mono", monospace';
      case 'dyslexic':
        return '"Comic Sans MS", "Atkinson Hyperlegible", Verdana, sans-serif';
      case 'system':
      default:
        return 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    }
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
    if (this.mode === 'preview') return;
    if (this.mode === 'presentation') {
      this.recordCancelledRun();
    }
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
    this.progressBar.parentElement?.setAttribute('aria-valuenow', String(Math.round(progress)));
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

  private jumpToSection(delta: number) {
    if (this.sectionTargets.length === 0) return;
    this.currentSectionIndex = Math.min(
      this.sectionTargets.length - 1,
      Math.max(0, this.currentSectionIndex + delta),
    );
    const target = this.sectionTargets[this.currentSectionIndex];
    this.scrollPosition = Math.min(
      this.totalScrollDistance,
      Math.max(0, target.offsetTop - this.viewport.clientHeight * (this.project.focusLinePosition / 100)),
    );
    this.updateTextTransform();
    this.updateProgressUI();
    this.updateSectionButtons();
  }

  private updateSectionButtons() {
    const prevButton = this.container.querySelector<HTMLButtonElement>('#btn-section-prev');
    const nextButton = this.container.querySelector<HTMLButtonElement>('#btn-section-next');
    if (!prevButton || !nextButton) return;
    const hasSections = this.sectionTargets.length > 0;
    prevButton.disabled = !hasSections || this.currentSectionIndex <= 0;
    nextButton.disabled = !hasSections || this.currentSectionIndex >= this.sectionTargets.length - 1;
  }

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
    if (this.isEditableShortcutTarget(e.target)) return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        e.preventDefault();
        this.handleExit();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        this.jumpToSection(-1);
        break;
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        this.jumpToSection(1);
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

  private isEditableShortcutTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable
    );
  }

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
    if (this.mode !== 'presentation') return;
    if (this.hasRecordedRun) return;
    this.hasRecordedRun = true;
    this.runCompleted = true;
    store.addPitchRun('completed', this.elapsedSeconds);
    void playEndSignal();
  }

  private recordCancelledRun() {
    if (this.mode !== 'presentation') return;
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
    this.attachElementEventListeners();
    document.addEventListener('fullscreenchange', this.updateFullscreenButton);
  }

  private attachElementEventListeners() {
    this.container.querySelector('#btn-exit')?.addEventListener('click', this.handleExit);
    this.container.querySelector('#btn-fullscreen')?.addEventListener('click', this.toggleFullscreen);
    
    this.container.querySelector('#btn-playpause')?.addEventListener('click', this.togglePlayPause);
    this.container.querySelector('#btn-reset')?.addEventListener('click', this.reset);
    
    this.container.querySelector('#btn-faster')?.addEventListener('click', () => this.adjustSpeed(0.1));
    this.container.querySelector('#btn-slower')?.addEventListener('click', () => this.adjustSpeed(-0.1));
    this.container.querySelector('#btn-section-prev')?.addEventListener('click', () => this.jumpToSection(-1));
    this.container.querySelector('#btn-section-next')?.addEventListener('click', () => this.jumpToSection(1));
    this.container.querySelector('#preview-fontsize')?.addEventListener('input', event => {
      store.updateProject({ fontSize: Number((event.target as HTMLInputElement).value) || this.project.fontSize });
    });
    this.container.querySelector('#preview-lineheight')?.addEventListener('input', event => {
      store.updateProject({ lineHeight: Number((event.target as HTMLInputElement).value) || this.project.lineHeight });
    });
    this.container.querySelector('#preview-focus-position')?.addEventListener('input', event => {
      store.updateProject({
        focusLine: true,
        focusLinePosition: Number((event.target as HTMLInputElement).value) || this.project.focusLinePosition,
      });
    });
    this.container.querySelector('#preview-mirror')?.addEventListener('change', event => {
      store.updateProject({ mirrorMode: (event.target as HTMLSelectElement).value === 'true' });
    });
  }

  private removeEventListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('fullscreenchange', this.updateFullscreenButton);
  }
}
