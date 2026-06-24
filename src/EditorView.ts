import { DEFAULT_PROJECT, MAX_PROJECT_FILE_BYTES, TIMER_PRESETS_SECONDS, store } from './store';
import type { PitchRunRecord, ProjectImportResult, PrompterProject } from './types';
import { t, type TranslationKey } from './i18n';
import { calculatePitchAnalytics, exportPitchHistoryCsv, formatSignedSeconds } from './analytics';

const READING_SPEED_WPM = 130;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sanitizeFilename(value: string): string {
  const trimmed = value.trim() || 'Projekt';
  return trimmed
    .split('')
    .map(char => {
      const codePoint = char.codePointAt(0) ?? 0;
      return codePoint < 32 || '<>:"/\\|?*'.includes(char) ? '-' : char;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

function titleFromImportFilename(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, '').trim();
  return withoutExtension || DEFAULT_PROJECT.title;
}

function importErrorMessage(result: Extract<ProjectImportResult, { ok: false }>): string {
  const errorKey = `editor.importError.${result.errorCode}` as TranslationKey;
  return `${t('editor.alert.importFailure')} ${t(errorKey)}`;
}

function formatDuration(seconds: number): string {
  const rounded = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export class EditorView {
  private container: HTMLElement;
  private unsubscribe: (() => void) | null = null;
  private currentProject: PrompterProject;
  private currentPitchHistory: PitchRunRecord[];

  // DOM Elements
  private presentBtn!: HTMLButtonElement;
  private previewBtn!: HTMLButtonElement;
  private wordCountEl!: HTMLSpanElement;
  private charCountEl!: HTMLSpanElement;
  private readTimeEl!: HTMLSpanElement;
  private textPanelTitleEl!: HTMLHeadingElement;
  private exportBtn!: HTMLButtonElement;
  private importBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private titleInput!: HTMLInputElement;
  private durationInput!: HTMLInputElement;
  private fontSizeInput!: HTMLInputElement;
  private lineHeightInput!: HTMLInputElement;
  private themeSelect!: HTMLSelectElement;
  private fontFamilySelect!: HTMLSelectElement;
  private textColorThemeSelect!: HTMLSelectElement;
  private focusLinePositionInput!: HTMLInputElement;
  private textInput!: HTMLTextAreaElement;
  private pitchHistoryList!: HTMLDivElement;
  private analyticsEl!: HTMLDivElement;
  private undoBanner!: HTMLDivElement;
  private clearPitchHistoryBtn!: HTMLButtonElement;
  private exportHistoryBtn!: HTMLButtonElement;
  private pendingText: string | null = null;
  private textUpdateTimeoutId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentProject = store.getState().project;
    this.currentPitchHistory = store.getState().pitchHistory;
  }

  public mount() {
    this.render();
    this.attachEventListeners();
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.currentProject = state.project;
      this.currentPitchHistory = state.pitchHistory;
      this.syncFormWithProject();
      this.updateStats();
      this.updatePitchHistoryUI();
      this.updateUndoBanner();
    });
    this.syncFormWithProject();
    this.updateStats();
    this.updatePitchHistoryUI();
    this.updateUndoBanner();
  }

  public unmount() {
    this.flushPendingTextUpdate();
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.removeEventListeners();
    this.container.innerHTML = '';
  }

  private scheduleTextUpdate(value: string) {
    this.pendingText = value;
    if (this.textUpdateTimeoutId !== null) {
      window.clearTimeout(this.textUpdateTimeoutId);
    }
    this.textUpdateTimeoutId = window.setTimeout(() => {
      this.flushPendingTextUpdate();
    }, 150);
  }

  private flushPendingTextUpdate() {
    if (this.textUpdateTimeoutId !== null) {
      window.clearTimeout(this.textUpdateTimeoutId);
      this.textUpdateTimeoutId = null;
    }
    if (this.pendingText !== null) {
      const text = this.pendingText;
      this.pendingText = null;
      store.updateProject({ text });
    }
  }

  private clearPendingTextUpdate() {
    if (this.textUpdateTimeoutId !== null) {
      window.clearTimeout(this.textUpdateTimeoutId);
      this.textUpdateTimeoutId = null;
    }
    this.pendingText = null;
  }

  private getTextPanelTitle(): string {
    return this.currentProject.title.trim() || t('editor.text.title');
  }

  private render() {
    this.container.innerHTML = `
      <section class="intro">
        <div>
          <span class="eyebrow">${t('editor.intro.eyebrow')}</span>
          <h1>${t('editor.intro.title')}</h1>
          <p>${t('editor.intro.text')}</p>
        </div>
      </section>

      <div class="workspace">
            <!-- Sidebar / Settings -->
            <div class="editor-panel">
              <div class="panel-heading">
                <h2>${t('editor.settings.title')}</h2>
              </div>
              <div class="editor-form">
                <div class="field">
                  <label class="field-label" for="project-title">${t('editor.settings.projectTitle')}</label>
                  <input type="text" id="project-title" value="${escapeHtml(this.currentProject.title)}" placeholder="${t('editor.placeholder.title')}" />
                </div>

                <div class="field duration-control">
                  <label class="field-label" for="project-duration">${t('editor.settings.duration')}</label>
                  <div class="duration-control__body">
                    <div class="timer-preset-grid" role="group" aria-label="${t('editor.timer.presets')}">
                      ${TIMER_PRESETS_SECONDS.map(seconds => `
                        <button class="button button--secondary button--compact timer-preset-button" type="button" data-timer-preset="${seconds}">
                          ${seconds}s
                        </button>
                      `).join('')}
                    </div>
                    <label class="duration-custom" for="project-duration">
                      <span>${t('editor.timer.custom')}</span>
                      <input type="number" id="project-duration" value="${this.currentProject.targetDurationSeconds / 60}" min="0.5" step="0.5" />
                    </label>
                  </div>
                </div>

                <div class="settings-grid">
                  <div class="field field--compact">
                    <label class="field-label" for="project-fontsize">${t('editor.settings.fontSize')}</label>
                    <input type="number" id="project-fontsize" value="${this.currentProject.fontSize}" min="16" max="160" step="4" />
                  </div>

                  <div class="field field--compact">
                    <label class="field-label" for="project-lineheight">${t('editor.settings.lineHeight')}</label>
                    <input type="number" id="project-lineheight" value="${this.currentProject.lineHeight}" min="1.1" max="2.4" step="0.1" />
                  </div>

                  <div class="field field--compact">
                    <label class="field-label" for="project-fontfamily">${t('editor.settings.fontFamily')}</label>
                    <select id="project-fontfamily">
                      <option value="system" ${this.currentProject.fontFamily === 'system' ? 'selected' : ''}>${t('editor.font.system')}</option>
                      <option value="serif" ${this.currentProject.fontFamily === 'serif' ? 'selected' : ''}>${t('editor.font.serif')}</option>
                      <option value="mono" ${this.currentProject.fontFamily === 'mono' ? 'selected' : ''}>${t('editor.font.mono')}</option>
                      <option value="dyslexic" ${this.currentProject.fontFamily === 'dyslexic' ? 'selected' : ''}>${t('editor.font.dyslexic')}</option>
                    </select>
                  </div>

                  <div class="field field--compact">
                    <label class="field-label" for="project-theme">${t('editor.settings.theme')}</label>
                    <select id="project-theme">
                      <option value="light" ${this.currentProject.theme === 'light' ? 'selected' : ''}>${t('editor.settings.themeLight')}</option>
                      <option value="dark" ${this.currentProject.theme === 'dark' ? 'selected' : ''}>${t('editor.settings.themeDark')}</option>
                      <option value="highContrast" ${this.currentProject.theme === 'highContrast' ? 'selected' : ''}>${t('editor.settings.themeHighContrast')}</option>
                    </select>
                  </div>

                  <div class="field field--compact field--wide">
                    <label class="field-label" for="project-textcolor">${t('editor.settings.textColorTheme')}</label>
                    <select id="project-textcolor">
                      <option value="dark" ${this.currentProject.textColorTheme === 'dark' ? 'selected' : ''}>${t('editor.textColor.dark')}</option>
                      <option value="light" ${this.currentProject.textColorTheme === 'light' ? 'selected' : ''}>${t('editor.textColor.light')}</option>
                      <option value="highContrast" ${this.currentProject.textColorTheme === 'highContrast' ? 'selected' : ''}>${t('editor.textColor.highContrast')}</option>
                    </select>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.mirrorMode')}</label>
                  <div class="segmented-control" role="radiogroup" aria-label="${t('editor.settings.mirrorMode')}">
                    <label>
	                      <input type="radio" name="mirror" value="false" ${!this.currentProject.mirrorMode ? 'checked' : ''} />
	                      <span>${t('editor.options.normal')}</span>
	                    </label>
	                    <label>
	                      <input type="radio" name="mirror" value="true" ${this.currentProject.mirrorMode ? 'checked' : ''} />
	                      <span>${t('editor.options.mirror')}</span>
	                    </label>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.focusLine')}</label>
                  <div class="segmented-control" role="radiogroup" aria-label="${t('editor.settings.focusLine')}">
                    <label>
	                      <input type="radio" name="focusLine" value="true" ${this.currentProject.focusLine ? 'checked' : ''} />
	                      <span>${t('editor.options.on')}</span>
	                    </label>
	                    <label>
	                      <input type="radio" name="focusLine" value="false" ${!this.currentProject.focusLine ? 'checked' : ''} />
	                      <span>${t('editor.options.off')}</span>
	                    </label>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label" for="project-focus-position">${t('editor.settings.focusLinePosition')}</label>
                  <input type="range" id="project-focus-position" value="${this.currentProject.focusLinePosition}" min="20" max="80" step="1" aria-valuetext="${this.currentProject.focusLinePosition}%" />
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.countdown')}</label>
                  <div class="segmented-control" role="radiogroup" aria-label="${t('editor.settings.countdown')}">
                    <label>
	                      <input type="radio" name="countdown" value="true" ${this.currentProject.countdownEnabled ? 'checked' : ''} />
	                      <span>${t('editor.options.on')}</span>
	                    </label>
	                    <label>
	                      <input type="radio" name="countdown" value="false" ${!this.currentProject.countdownEnabled ? 'checked' : ''} />
	                      <span>${t('editor.options.off')}</span>
	                    </label>
                  </div>
                </div>

                  <details class="shortcuts-panel">
                    <summary>${t('editor.shortcuts.title')}</summary>
                    <dl>
                      <div><dt>Escape</dt><dd>${t('editor.shortcuts.preview')}</dd></div>
                      <div><dt>Space</dt><dd>${t('editor.shortcuts.playPause')}</dd></div>
                      <div><dt>Arrow Up / Down</dt><dd>${t('editor.shortcuts.speed')}</dd></div>
                      <div><dt>Arrow Left / Right</dt><dd>${t('editor.shortcuts.sections')}</dd></div>
                      <div><dt>R / Escape</dt><dd>${t('editor.shortcuts.resetExit')}</dd></div>
                    </dl>
                  </details>
	                <div class="pitch-history" aria-live="polite" aria-labelledby="pitch-history-title">
	                  <div class="pitch-history__header">
	                    <span id="pitch-history-title" class="field-label">${t('editor.history.title')}</span>
                      <div class="panel-actions">
  	                    <button id="btn-export-pitch-history" class="button button--secondary button--compact" type="button">
  	                      ${t('editor.history.exportCsv')}
  	                    </button>
  	                    <button id="btn-clear-pitch-history" class="button button--secondary button--compact" type="button">
  	                      ${t('editor.history.clear')}
  	                    </button>
                      </div>
	                  </div>
                    <div id="analytics-panel" class="analytics-panel" aria-label="${t('editor.analytics.averageWpm')}"></div>
	                  <div id="pitch-history-list" class="pitch-history__list"></div>
	                </div>
	              </div>
            </div>

            <!-- Text Editor -->
            <div class="preview-panel">
              <div class="preview-panel__header">
	                <h2 id="text-panel-title">${escapeHtml(this.getTextPanelTitle())}</h2>
	              </div>
	              <div class="preview-panel__content">
	                <label class="visually-hidden" for="project-text">${t('editor.text.label')}</label>
                <textarea id="project-text" class="text-input" placeholder="${t('editor.placeholder.text')}">${escapeHtml(this.currentProject.text)}</textarea>
                <div class="action-bar">
                  <div class="stats">
                    <span id="word-count">0</span> ${t('editor.stats.words')}
                  </div>
                  <div class="stats">
                    <span id="char-count">0</span> ${t('editor.stats.characters')}
                  </div>
                  <div class="stats">
                    ${t('editor.stats.readTime')} <span id="read-time">0:00</span>
                  </div>
                </div>
                <div class="editor-floating-actions" aria-label="${t('editor.text.title')}">
                  <div class="editor-floating-actions__row">
                    <button id="btn-preview" class="floating-pill" type="button">${t('editor.actions.preview')}</button>
                    <button id="btn-present" class="floating-pill floating-pill--primary" type="button">${t('editor.actions.present')}</button>
                    <button id="btn-reset-project" class="floating-pill floating-pill--danger" type="button">${t('editor.actions.reset')}</button>
                  </div>
                  <div class="editor-floating-actions__row">
                    <button id="btn-import" class="floating-pill" type="button">${t('editor.actions.import')}</button>
                    <button id="btn-export" class="floating-pill" type="button">${t('editor.actions.export')}</button>
                    <div id="undo-banner" class="undo-banner undo-banner--floating" role="status" aria-live="polite"></div>
                  </div>
                  <input type="file" id="file-import" accept=".prompter,.txt,.md,application/json,text/plain,text/markdown" hidden />
                </div>
              </div>
            </div>
          </div>
    `;

    this.presentBtn = this.container.querySelector('#btn-present') as HTMLButtonElement;
    this.previewBtn = this.container.querySelector('#btn-preview') as HTMLButtonElement;
    this.wordCountEl = this.container.querySelector('#word-count') as HTMLSpanElement;
    this.charCountEl = this.container.querySelector('#char-count') as HTMLSpanElement;
    this.readTimeEl = this.container.querySelector('#read-time') as HTMLSpanElement;
    this.textPanelTitleEl = this.container.querySelector('#text-panel-title') as HTMLHeadingElement;
    
    this.exportBtn = this.container.querySelector('#btn-export') as HTMLButtonElement;
    this.importBtn = this.container.querySelector('#btn-import') as HTMLButtonElement;
    this.resetBtn = this.container.querySelector('#btn-reset-project') as HTMLButtonElement;
    this.fileInput = this.container.querySelector('#file-import') as HTMLInputElement;
    this.titleInput = this.container.querySelector('#project-title') as HTMLInputElement;
    this.durationInput = this.container.querySelector('#project-duration') as HTMLInputElement;
    this.fontSizeInput = this.container.querySelector('#project-fontsize') as HTMLInputElement;
    this.lineHeightInput = this.container.querySelector('#project-lineheight') as HTMLInputElement;
    this.themeSelect = this.container.querySelector('#project-theme') as HTMLSelectElement;
    this.fontFamilySelect = this.container.querySelector('#project-fontfamily') as HTMLSelectElement;
    this.textColorThemeSelect = this.container.querySelector('#project-textcolor') as HTMLSelectElement;
    this.focusLinePositionInput = this.container.querySelector('#project-focus-position') as HTMLInputElement;
    this.textInput = this.container.querySelector('#project-text') as HTMLTextAreaElement;
    this.pitchHistoryList = this.container.querySelector('#pitch-history-list') as HTMLDivElement;
    this.analyticsEl = this.container.querySelector('#analytics-panel') as HTMLDivElement;
    this.undoBanner = this.container.querySelector('#undo-banner') as HTMLDivElement;
    this.clearPitchHistoryBtn = this.container.querySelector('#btn-clear-pitch-history') as HTMLButtonElement;
    this.exportHistoryBtn = this.container.querySelector('#btn-export-pitch-history') as HTMLButtonElement;
  }

  private syncFormWithProject() {
    if (!this.titleInput) return;

    const activeElement = document.activeElement;
    if (activeElement !== this.titleInput || this.titleInput.value !== this.currentProject.title) {
      this.titleInput.value = this.currentProject.title;
    }
    this.textPanelTitleEl.textContent = this.getTextPanelTitle();
    if (activeElement !== this.durationInput || this.durationInput.value !== String(this.currentProject.targetDurationSeconds / 60)) {
      this.durationInput.value = String(this.currentProject.targetDurationSeconds / 60);
    }
    if (activeElement !== this.fontSizeInput || this.fontSizeInput.value !== String(this.currentProject.fontSize)) {
      this.fontSizeInput.value = String(this.currentProject.fontSize);
    }
    if (activeElement !== this.lineHeightInput || this.lineHeightInput.value !== String(this.currentProject.lineHeight)) {
      this.lineHeightInput.value = String(this.currentProject.lineHeight);
    }
    if (activeElement !== this.fontFamilySelect || this.fontFamilySelect.value !== this.currentProject.fontFamily) {
      this.fontFamilySelect.value = this.currentProject.fontFamily;
    }
    if (activeElement !== this.themeSelect || this.themeSelect.value !== this.currentProject.theme) {
      this.themeSelect.value = this.currentProject.theme;
    }
    if (
      activeElement !== this.textColorThemeSelect ||
      this.textColorThemeSelect.value !== this.currentProject.textColorTheme
    ) {
      this.textColorThemeSelect.value = this.currentProject.textColorTheme;
    }
    if (
      activeElement !== this.focusLinePositionInput ||
      this.focusLinePositionInput.value !== String(this.currentProject.focusLinePosition)
    ) {
      this.focusLinePositionInput.value = String(this.currentProject.focusLinePosition);
    }
    this.focusLinePositionInput.setAttribute('aria-valuetext', `${this.currentProject.focusLinePosition}%`);
    if (activeElement !== this.textInput || this.textInput.value !== this.currentProject.text) {
      this.textInput.value = this.currentProject.text;
    }

    this.container
      .querySelectorAll<HTMLInputElement>('input[name="mirror"]')
      .forEach(input => {
        input.checked = String(this.currentProject.mirrorMode) === input.value;
      });
    this.container
      .querySelectorAll<HTMLInputElement>('input[name="focusLine"]')
      .forEach(input => {
        input.checked = String(this.currentProject.focusLine) === input.value;
      });
    this.container
      .querySelectorAll<HTMLInputElement>('input[name="countdown"]')
      .forEach(input => {
        input.checked = String(this.currentProject.countdownEnabled) === input.value;
      });
    this.container
      .querySelectorAll<HTMLButtonElement>('[data-timer-preset]')
      .forEach(button => {
        const seconds = Number(button.dataset.timerPreset);
        button.classList.toggle('is-active', seconds === this.currentProject.targetDurationSeconds);
      });
  }

  private updateStats() {
    const text = this.currentProject.text.trim();
    const words = text ? text.split(/\s+/).length : 0;
    this.wordCountEl.textContent = words.toString();
    this.charCountEl.textContent = this.currentProject.text.length.toString();

    const readTimeMinutes = words / READING_SPEED_WPM;
    const minutes = Math.floor(readTimeMinutes);
    const seconds = Math.floor((readTimeMinutes - minutes) * 60);
    this.readTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private updatePitchHistoryUI() {
    if (!this.pitchHistoryList) return;

    this.clearPitchHistoryBtn.disabled = this.currentPitchHistory.length === 0;
    this.exportHistoryBtn.disabled = this.currentPitchHistory.length === 0;
    if (this.currentPitchHistory.length === 0) {
      this.pitchHistoryList.innerHTML = `<p class="pitch-history__empty">${t('editor.history.empty')}</p>`;
      this.updateAnalyticsUI();
      return;
    }

    this.pitchHistoryList.innerHTML = this.currentPitchHistory
      .slice(0, 5)
      .map(record => {
        const statusLabel = record.status === 'completed'
          ? t('editor.history.completed')
          : t('editor.history.cancelled');
        const dateLabel = new Date(record.date).toLocaleString(store.getState().language);
        return `
          <div class="pitch-history__item">
            <div>
              <strong>${statusLabel}</strong>
              <span>${escapeHtml(dateLabel)}</span>
            </div>
            <div class="pitch-history__time">
              <span>${formatDuration(record.actualDurationSeconds)}</span>
              <small>/ ${formatDuration(record.targetDurationSeconds)}</small>
            </div>
          </div>
        `;
      })
      .join('');
    this.updateAnalyticsUI();
  }

  private updateAnalyticsUI() {
    if (!this.analyticsEl) return;
    const analytics = calculatePitchAnalytics(this.currentPitchHistory);
    const formatMetric = (value: number | null, suffix: string) =>
      value === null ? '-' : `${Math.round(value)}${suffix}`;

    this.analyticsEl.innerHTML = `
      <div>
        <span>${t('editor.analytics.completed')}</span>
        <strong>${analytics.completedRuns}</strong>
      </div>
      <div>
        <span>${t('editor.analytics.averageWpm')}</span>
        <strong>${formatMetric(analytics.averageWordsPerMinute, ' WPM')}</strong>
      </div>
      <div>
        <span>${t('editor.analytics.fastestSlowest')}</span>
        <strong>${formatMetric(analytics.fastestWordsPerMinute, '')} / ${formatMetric(analytics.slowestWordsPerMinute, '')}</strong>
      </div>
      <div>
        <span>${t('editor.analytics.averageDeviation')}</span>
        <strong>${formatSignedSeconds(analytics.averageDeviationSeconds)}</strong>
      </div>
      <div>
        <span>${t('editor.analytics.trend')}</span>
        <strong>${formatSignedSeconds(analytics.recentDeviationTrendSeconds)}</strong>
      </div>
    `;
  }

  private updateUndoBanner() {
    if (!this.undoBanner) return;
    const action = store.getState().lastUndoAction;
    if (!action) {
      this.undoBanner.innerHTML = '';
      this.undoBanner.hidden = true;
      return;
    }

    this.undoBanner.hidden = false;
    this.undoBanner.innerHTML = `
      <span>${action.type === 'projectReset' ? t('editor.undo.resetReady') : t('editor.undo.historyReady')}</span>
      <button id="btn-undo-last-action" class="button button--secondary button--compact" type="button">
        ${t('editor.undo.action')}
      </button>
    `;
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'project-title') {
      store.updateProject({ title: (target as HTMLInputElement).value });
    } else if (target.id === 'project-text') {
      this.scheduleTextUpdate((target as HTMLTextAreaElement).value);
    } else if (target.id === 'project-duration') {
      const mins = parseFloat((target as HTMLInputElement).value) || 1;
      store.updateProject({ targetDurationSeconds: mins * 60 });
    } else if (target.id === 'project-fontsize') {
      const size = parseInt((target as HTMLInputElement).value, 10) || 48;
      store.updateProject({ fontSize: size });
    } else if (target.id === 'project-lineheight') {
      const lineHeight = parseFloat((target as HTMLInputElement).value) || 1.5;
      store.updateProject({ lineHeight });
    } else if (target.id === 'project-fontfamily') {
      store.updateProject({ fontFamily: (target as HTMLSelectElement).value as PrompterProject['fontFamily'] });
    } else if (target.id === 'project-theme') {
      store.updateProject({ theme: (target as HTMLSelectElement).value as PrompterProject['theme'] });
    } else if (target.id === 'project-textcolor') {
      store.updateProject({ textColorTheme: (target as HTMLSelectElement).value as PrompterProject['textColorTheme'] });
    } else if (target.id === 'project-focus-position') {
      const focusLinePosition = parseFloat((target as HTMLInputElement).value) || 50;
      store.updateProject({ focusLine: true, focusLinePosition });
    } else if ((target as HTMLInputElement).name === 'mirror') {
      store.updateProject({ mirrorMode: (target as HTMLInputElement).value === 'true' });
    } else if ((target as HTMLInputElement).name === 'focusLine') {
      store.updateProject({ focusLine: (target as HTMLInputElement).value === 'true' });
    } else if ((target as HTMLInputElement).name === 'countdown') {
      store.updateProject({ countdownEnabled: (target as HTMLInputElement).value === 'true' });
    }
  };

  private handlePresent = () => {
    this.flushPendingTextUpdate();
    store.setViewMode('presentation');
  };

  private handlePreview = () => {
    this.flushPendingTextUpdate();
    store.setViewMode('preview');
  };

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const presetButton = target.closest<HTMLButtonElement>('[data-timer-preset]');
    if (presetButton) {
      const seconds = Number(presetButton.dataset.timerPreset);
      if (Number.isFinite(seconds)) {
        store.updateProject({ targetDurationSeconds: seconds });
      }
      return;
    }

    if (target.closest('#btn-clear-pitch-history')) {
      if (window.confirm(t('editor.history.clearConfirm'))) {
        store.clearPitchHistory();
      }
      return;
    }

    if (target.closest('#btn-undo-last-action')) {
      store.undoLastAction();
      return;
    }

    if (target.closest('#btn-export-pitch-history')) {
      this.handlePitchHistoryExport();
    }
  };

  private handleExport = () => {
    this.flushPendingTextUpdate();
    const project = store.getState().project;
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(project.title)}.prompter`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private triggerImport = () => {
    this.flushPendingTextUpdate();
    const project = store.getState().project;
    const hasUserWork =
      project.text.trim() !== DEFAULT_PROJECT.text.trim() ||
      project.title.trim() !== DEFAULT_PROJECT.title.trim();

    if (hasUserWork) {
      const shouldReplace = window.confirm(t('editor.prompt.importReplace'));
      if (!shouldReplace) return;
    }
    this.fileInput.click();
  };

  private handlePitchHistoryExport() {
    const csv = exportPitchHistoryCsv(store.getState().pitchHistory);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(store.getState().project.title)}-pitch-history.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private handleImport = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    if (file.size > MAX_PROJECT_FILE_BYTES) {
      alert(t('editor.alert.importTooLarge'));
      this.fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lowerName = file.name.toLowerCase();
      const isTextScript = lowerName.endsWith('.txt') || lowerName.endsWith('.md');
      if (isTextScript) {
        this.clearPendingTextUpdate();
        store.updateProject({
          title: titleFromImportFilename(file.name),
          text: content,
        });
        this.fileInput.value = '';
        return;
      }

      const result = store.importProject(content);
      if (result.ok) {
        this.fileInput.value = '';
      } else {
        alert(importErrorMessage(result));
        this.fileInput.value = '';
      }
    };
    reader.onerror = () => {
      alert(t('editor.alert.importReadError'));
      this.fileInput.value = '';
    };
    reader.onabort = () => {
      alert(t('editor.alert.importReadError'));
      this.fileInput.value = '';
    };
    reader.readAsText(file);
  };

  private handleResetProject = () => {
    const shouldReset = window.confirm(t('editor.prompt.resetLocal'));
    if (!shouldReset) return;
    this.flushPendingTextUpdate();
    store.resetProject();
  };

  private attachEventListeners() {
    this.container.addEventListener('input', this.handleInput);
    this.container.addEventListener('change', this.handleInput);
    this.container.addEventListener('click', this.handleClick);
    this.previewBtn.addEventListener('click', this.handlePreview);
    this.presentBtn.addEventListener('click', this.handlePresent);
    this.exportBtn.addEventListener('click', this.handleExport);
    this.importBtn.addEventListener('click', this.triggerImport);
    this.resetBtn.addEventListener('click', this.handleResetProject);
    this.fileInput.addEventListener('change', this.handleImport);
  }

  private removeEventListeners() {
    this.container.removeEventListener('input', this.handleInput);
    this.container.removeEventListener('change', this.handleInput);
    this.container.removeEventListener('click', this.handleClick);
    if (this.presentBtn) {
      this.previewBtn.removeEventListener('click', this.handlePreview);
      this.presentBtn.removeEventListener('click', this.handlePresent);
      this.exportBtn.removeEventListener('click', this.handleExport);
      this.importBtn.removeEventListener('click', this.triggerImport);
      this.resetBtn.removeEventListener('click', this.handleResetProject);
      this.fileInput.removeEventListener('change', this.handleImport);
    }
  }
}
