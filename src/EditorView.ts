import { store } from './store';
import type { PrompterProject } from './types';

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
  private fileInput!: HTMLInputElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentProject = store.getState().project;
  }

  public mount() {
    this.render();
    this.attachEventListeners();
    this.unsubscribe = store.subscribe(() => {
      this.currentProject = store.getState().project;
      this.updateStats();
    });
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
          <span class="eyebrow">LOKAL. EXPORTIERBAR. BROWSERBASIERT.</span>
          <h1>Perfektioniere deine Pitches.</h1>
          <p>Gestalte deine Skripte und nutze den integrierten Teleprompter, um deine Präsentationen fehlerfrei zu halten. Ohne Anmeldung und ohne Upload.</p>
        </div>
      </section>

      <div class="workspace">
            <!-- Sidebar / Settings -->
            <div class="editor-panel">
              <div class="panel-heading">
                <h2>Einstellungen</h2>
              </div>
              <div class="editor-form">
                <div class="field">
                  <label class="field-label">Titel</label>
                  <input type="text" id="project-title" value="${this.currentProject.title}" placeholder="Neues Projekt" />
                </div>

                <div class="field">
                  <label class="field-label">Zieldauer (Minuten)</label>
                  <input type="number" id="project-duration" value="${this.currentProject.targetDurationSeconds / 60}" min="0.5" step="0.5" />
                </div>

                <div class="field">
                  <label class="field-label">Schriftgröße</label>
                  <input type="number" id="project-fontsize" value="${this.currentProject.fontSize}" min="16" max="200" step="4" />
                </div>

                <div class="field">
                  <label class="field-label">Spiegelmodus (für Teleprompter-Glas)</label>
                  <div class="segmented-control">
                    <label>
                      <input type="radio" name="mirror" value="false" ${!this.currentProject.mirrorMode ? 'checked' : ''} />
                      <span>Normal</span>
                    </label>
                    <label>
                      <input type="radio" name="mirror" value="true" ${this.currentProject.mirrorMode ? 'checked' : ''} />
                      <span>Gespiegelt</span>
                    </label>
                  </div>
                </div>

                <div class="field">
                  <label class="field-label">Fokus-Linie</label>
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
                  <label class="field-label">3-Sekunden Countdown</label>
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
                    Präsentieren
                  </button>
                </div>
              </div>
            </div>

            <!-- Text Editor -->
            <div class="preview-panel">
              <div class="preview-panel__header">
                <h2>Text</h2>
                <div class="panel-actions">
                  <button id="btn-import" class="button button--secondary" style="height: 36px; font-size: 0.85rem;">Öffnen</button>
                  <button id="btn-export" class="button button--secondary" style="height: 36px; font-size: 0.85rem;">Speichern</button>
                  <input type="file" id="file-import" accept=".prompter" style="display: none;" />
                </div>
              </div>
              <div class="preview-panel__content">
                <textarea id="project-text" class="text-input" placeholder="Füge hier deinen Text ein...">${this.currentProject.text}</textarea>
                <div class="action-bar">
                  <div class="stats">
                    <span id="word-count">0</span> Wörter
                  </div>
                  <div class="stats">
                    Lesezeit ca. <span id="read-time">0:00</span>
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
    this.fileInput = this.container.querySelector('#file-import') as HTMLInputElement;
  }

  private updateStats() {
    const text = this.currentProject.text.trim();
    const words = text ? text.split(/\\s+/).length : 0;
    this.wordCountEl.textContent = words.toString();

    // Average reading speed: 130 words per minute
    const readTimeMinutes = words / 130;
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
    a.download = `${project.title || 'Projekt'}.prompter`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private triggerImport = () => {
    this.fileInput.click();
  };

  private handleImport = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (store.importProject(content)) {
        // Re-render implicitly handled by store subscription in main.ts, but let's clear the input
        this.fileInput.value = '';
      } else {
        alert("Fehler beim Importieren der Datei. Ist es eine gültige .prompter Datei?");
      }
    };
    reader.readAsText(file);
  };

  private attachEventListeners() {
    this.container.addEventListener('input', this.handleInput);
    this.presentBtn.addEventListener('click', this.handlePresent);
    this.exportBtn.addEventListener('click', this.handleExport);
    this.importBtn.addEventListener('click', this.triggerImport);
    this.fileInput.addEventListener('change', this.handleImport);
  }

  private removeEventListeners() {
    this.container.removeEventListener('input', this.handleInput);
    if (this.presentBtn) {
      this.presentBtn.removeEventListener('click', this.handlePresent);
      this.exportBtn.removeEventListener('click', this.handleExport);
      this.importBtn.removeEventListener('click', this.triggerImport);
      this.fileInput.removeEventListener('change', this.handleImport);
    }
  }
}
