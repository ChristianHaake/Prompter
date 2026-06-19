import { DEFAULT_PROJECT, MAX_PROJECT_FILE_BYTES, store } from './store';
import type { PrompterProject } from './types';
import { t } from './i18n';

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

export class EditorView {
  private container: HTMLElement;
  private unsubscribe: (() => void) | null = null;
  private currentProject: PrompterProject;

  // DOM Elements
  private presentBtn!: HTMLButtonElement;
  private wordCountEl!: HTMLSpanElement;
  private readTimeEl!: HTMLSpanElement;
  private exportBtn!: HTMLButtonElement;
  private importBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private titleInput!: HTMLInputElement;
  private durationInput!: HTMLInputElement;
  private fontSizeInput!: HTMLInputElement;
  private textInput!: HTMLTextAreaElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentProject = store.getState().project;
  }

  public mount() {
    this.render();
    this.attachEventListeners();
    this.unsubscribe = store.subscribe(() => {
      this.currentProject = store.getState().project;
      this.syncFormWithProject();
      this.updateStats();
    });
    this.syncFormWithProject();
    this.updateStats();
  }

  public unmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.removeEventListeners();
    this.container.innerHTML = '';
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

                <div class="field">
                  <label class="field-label" for="project-duration">${t('editor.settings.duration')}</label>
                  <input type="number" id="project-duration" value="${this.currentProject.targetDurationSeconds / 60}" min="0.5" step="0.5" />
                </div>

                <div class="field">
                  <label class="field-label" for="project-fontsize">${t('editor.settings.fontSize')}</label>
                  <input type="number" id="project-fontsize" value="${this.currentProject.fontSize}" min="16" max="200" step="4" />
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.mirrorMode')}</label>
                  <div class="segmented-control">
                    <label>
                      <input type="radio" name="mirror" value="false" ${!this.currentProject.mirrorMode ? 'checked' : ''} />
                      <span>Normal</span>
                    </label>
                    <label>
                      <input type="radio" name="mirror" value="true" ${this.currentProject.mirrorMode ? 'checked' : ''} />
                      <span>Mirror</span>
                    </label>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.focusLine')}</label>
                  <div class="segmented-control">
                    <label>
                      <input type="radio" name="focusLine" value="true" ${this.currentProject.focusLine ? 'checked' : ''} />
                      <span>An</span>
                    </label>
                    <label>
                      <input type="radio" name="focusLine" value="false" ${!this.currentProject.focusLine ? 'checked' : ''} />
                      <span>Aus</span>
                    </label>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label">${t('editor.settings.countdown')}</label>
                  <div class="segmented-control">
                    <label>
                      <input type="radio" name="countdown" value="true" ${this.currentProject.countdownEnabled ? 'checked' : ''} />
                      <span>An</span>
                    </label>
                    <label>
                      <input type="radio" name="countdown" value="false" ${!this.currentProject.countdownEnabled ? 'checked' : ''} />
                      <span>Aus</span>
                    </label>
                  </div>
                </div>

                <div style="margin-top: 1rem;">
                  <button id="btn-present" class="button button--primary" style="width: 100%;">
                    ${t('editor.actions.present')}
                  </button>
                </div>
                <button id="btn-reset-project" class="button button--secondary" type="button">
                  ${t('editor.actions.reset')}
                </button>
              </div>
            </div>

            <!-- Text Editor -->
            <div class="preview-panel">
              <div class="preview-panel__header">
                <h2>Text</h2>
                <div class="panel-actions">
                  <button id="btn-import" class="button button--secondary" style="height: 36px; font-size: 0.85rem;">${t('editor.actions.import')}</button>
                  <button id="btn-export" class="button button--secondary" style="height: 36px; font-size: 0.85rem;">${t('editor.actions.export')}</button>
                  <input type="file" id="file-import" accept=".prompter" style="display: none;" />
                </div>
              </div>
              <div class="preview-panel__content">
                <label class="visually-hidden" for="project-text">Präsentationstext</label>
                <textarea id="project-text" class="text-input" placeholder="${t('editor.placeholder.text')}">${escapeHtml(this.currentProject.text)}</textarea>
                <div class="action-bar">
                  <div class="stats">
                    <span id="word-count">0</span> ${t('editor.stats.words')}
                  </div>
                  <div class="stats">
                    ${t('editor.stats.readTime')} <span id="read-time">0:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;

    this.presentBtn = this.container.querySelector('#btn-present') as HTMLButtonElement;
    this.wordCountEl = this.container.querySelector('#word-count') as HTMLSpanElement;
    this.readTimeEl = this.container.querySelector('#read-time') as HTMLSpanElement;
    
    this.exportBtn = this.container.querySelector('#btn-export') as HTMLButtonElement;
    this.importBtn = this.container.querySelector('#btn-import') as HTMLButtonElement;
    this.resetBtn = this.container.querySelector('#btn-reset-project') as HTMLButtonElement;
    this.fileInput = this.container.querySelector('#file-import') as HTMLInputElement;
    this.titleInput = this.container.querySelector('#project-title') as HTMLInputElement;
    this.durationInput = this.container.querySelector('#project-duration') as HTMLInputElement;
    this.fontSizeInput = this.container.querySelector('#project-fontsize') as HTMLInputElement;
    this.textInput = this.container.querySelector('#project-text') as HTMLTextAreaElement;
  }

  private syncFormWithProject() {
    if (!this.titleInput) return;

    const activeElement = document.activeElement;
    if (activeElement !== this.titleInput || this.titleInput.value !== this.currentProject.title) {
      this.titleInput.value = this.currentProject.title;
    }
    if (activeElement !== this.durationInput || this.durationInput.value !== String(this.currentProject.targetDurationSeconds / 60)) {
      this.durationInput.value = String(this.currentProject.targetDurationSeconds / 60);
    }
    if (activeElement !== this.fontSizeInput || this.fontSizeInput.value !== String(this.currentProject.fontSize)) {
      this.fontSizeInput.value = String(this.currentProject.fontSize);
    }
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
  }

  private updateStats() {
    const text = this.currentProject.text.trim();
    const words = text ? text.split(/\s+/).length : 0;
    this.wordCountEl.textContent = words.toString();

    const readTimeMinutes = words / READING_SPEED_WPM;
    const minutes = Math.floor(readTimeMinutes);
    const seconds = Math.floor((readTimeMinutes - minutes) * 60);
    this.readTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'project-title') {
      store.updateProject({ title: (target as HTMLInputElement).value });
    } else if (target.id === 'project-text') {
      store.updateProject({ text: (target as HTMLTextAreaElement).value });
    } else if (target.id === 'project-duration') {
      const mins = parseFloat((target as HTMLInputElement).value) || 1;
      store.updateProject({ targetDurationSeconds: mins * 60 });
    } else if (target.id === 'project-fontsize') {
      const size = parseInt((target as HTMLInputElement).value, 10) || 48;
      store.updateProject({ fontSize: size });
    } else if ((target as HTMLInputElement).name === 'mirror') {
      store.updateProject({ mirrorMode: (target as HTMLInputElement).value === 'true' });
    } else if ((target as HTMLInputElement).name === 'focusLine') {
      store.updateProject({ focusLine: (target as HTMLInputElement).value === 'true' });
    } else if ((target as HTMLInputElement).name === 'countdown') {
      store.updateProject({ countdownEnabled: (target as HTMLInputElement).value === 'true' });
    }
  };

  private handlePresent = () => {
    store.setViewMode('presentation');
  };

  private handleExport = () => {
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
    const project = store.getState().project;
    const hasUserWork =
      project.text.trim() !== DEFAULT_PROJECT.text.trim() ||
      project.title.trim() !== DEFAULT_PROJECT.title.trim();

    if (hasUserWork) {
      const shouldReplace = window.confirm(
        'Das Öffnen einer Projektdatei ersetzt den aktuellen lokalen Entwurf. Trotzdem öffnen?',
      );
      if (!shouldReplace) return;
    }
    this.fileInput.click();
  };

  private handleImport = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    if (file.size > MAX_PROJECT_FILE_BYTES) {
      alert('Die Projektdatei ist zu groß. Bitte öffne eine .prompter-Datei unter 500 KB.');
      this.fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = store.importProject(content);
      if (result.ok) {
        this.fileInput.value = '';
      } else {
        alert(`Fehler beim Öffnen der Datei. ${result.reason}`);
      }
    };
    reader.readAsText(file);
  };

  private handleResetProject = () => {
    const shouldReset = window.confirm(
      'Lokale Daten zurücksetzen? Der aktuelle Entwurf wird aus diesem Browser entfernt.',
    );
    if (!shouldReset) return;
    store.resetProject();
  };

  private attachEventListeners() {
    this.container.addEventListener('input', this.handleInput);
    this.presentBtn.addEventListener('click', this.handlePresent);
    this.exportBtn.addEventListener('click', this.handleExport);
    this.importBtn.addEventListener('click', this.triggerImport);
    this.resetBtn.addEventListener('click', this.handleResetProject);
    this.fileInput.addEventListener('change', this.handleImport);
  }

  private removeEventListeners() {
    this.container.removeEventListener('input', this.handleInput);
    if (this.presentBtn) {
      this.presentBtn.removeEventListener('click', this.handlePresent);
      this.exportBtn.removeEventListener('click', this.handleExport);
      this.importBtn.removeEventListener('click', this.triggerImport);
      this.resetBtn.removeEventListener('click', this.handleResetProject);
      this.fileInput.removeEventListener('change', this.handleImport);
    }
  }
}
