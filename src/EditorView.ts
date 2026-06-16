import { store } from './store';
import type { PrompterProject } from './types';

export class EditorView {
  private container: HTMLElement;
  private unsubscribe: (() => void) | null = null;
  private currentProject: PrompterProject;

  // DOM Elements
  private textarea!: HTMLTextAreaElement;
  private wordCountSpan!: HTMLSpanElement;
  private readTimeSpan!: HTMLSpanElement;
  private titleInput!: HTMLInputElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentProject = store.getState().project;
  }

  public mount() {
    this.render();
    this.unsubscribe = store.subscribe((state) => {
      // Very basic diffing to avoid losing cursor focus in textarea
      if (this.currentProject.text !== state.project.text) {
         if (this.textarea && this.textarea.value !== state.project.text) {
            this.textarea.value = state.project.text;
         }
      }
      if (this.currentProject.title !== state.project.title) {
        if (this.titleInput && this.titleInput.value !== state.project.title) {
          this.titleInput.value = state.project.title;
        }
      }
      this.currentProject = state.project;
      this.updateStats();
    });
  }

  public unmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.container.innerHTML = '';
  }

  private calculateWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  private calculateEstimatedTime(words: number): number {
    const WPM = 130; // average spoken words per minute
    return Math.ceil((words / WPM) * 60);
  }

  private updateStats() {
    if (!this.wordCountSpan || !this.readTimeSpan) return;
    const words = this.calculateWordCount(this.currentProject.text);
    const estimatedSeconds = this.calculateEstimatedTime(words);
    
    this.wordCountSpan.textContent = `${words} Wörter`;
    
    const minutes = Math.floor(estimatedSeconds / 60);
    const seconds = estimatedSeconds % 60;
    this.readTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} Min. (geschätzt)`;
  }

  private handleFileImport = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          store.importProject(event.target.result as string);
        }
      };
      reader.readAsText(input.files[0]);
    }
  };

  private handleExport = () => {
    const json = JSON.stringify(store.getState().project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentProject.title || 'prompter'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  private render() {
    this.container.innerHTML = `
      <div class="editor-layout">
        <div class="editor-main surface">
          <input type="text" id="project-title" class="title-input" value="${this.currentProject.title}" placeholder="Projekttitel" />
          <textarea id="editor-textarea" class="text-input" placeholder="Gib hier deinen Sprechtext ein...">${this.currentProject.text}</textarea>
          <div class="stats-bar">
            <span id="word-count">0 Wörter</span>
            <span id="read-time">0:00 Min.</span>
          </div>
        </div>
        
        <div class="editor-sidebar surface">
          <h3>Zielzeit</h3>
          <div class="time-buttons">
            ${[30, 60, 90, 120, 180].map(t => `<button class="time-btn ${this.currentProject.targetDurationSeconds === t ? 'active' : ''}" data-time="${t}">${t}s</button>`).join('')}
          </div>
          <div style="margin-top: 1rem;">
             <label>Manuell (Sekunden):</label>
             <input type="number" id="manual-time" value="${this.currentProject.targetDurationSeconds}" min="1" class="number-input" />
          </div>

          <hr class="sidebar-divider" />

          <h3>Projekt-Aktionen</h3>
          <div class="action-buttons">
            <button id="btn-export" class="secondary-btn">Export (JSON)</button>
            <label class="secondary-btn file-upload">
              Import (JSON)
              <input type="file" id="btn-import" accept=".json" style="display:none;" />
            </label>
            <button id="btn-reset" class="danger-btn">Zurücksetzen</button>
          </div>

          <div class="present-container">
             <button id="btn-present" class="primary-btn huge">Präsentieren</button>
          </div>
        </div>
      </div>
    `;

    // Bind elements
    this.textarea = this.container.querySelector('#editor-textarea') as HTMLTextAreaElement;
    this.titleInput = this.container.querySelector('#project-title') as HTMLInputElement;
    this.wordCountSpan = this.container.querySelector('#word-count') as HTMLSpanElement;
    this.readTimeSpan = this.container.querySelector('#read-time') as HTMLSpanElement;

    this.updateStats();

    // Event Listeners
    this.textarea.addEventListener('input', (e) => {
      store.updateProject({ text: (e.target as HTMLTextAreaElement).value });
    });

    this.titleInput.addEventListener('input', (e) => {
      store.updateProject({ title: (e.target as HTMLInputElement).value });
    });

    this.container.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const time = parseInt((e.target as HTMLButtonElement).dataset.time!);
        store.updateProject({ targetDurationSeconds: time });
        // Re-render sidebar active state
        this.render(); 
      });
    });

    const manualTimeInput = this.container.querySelector('#manual-time') as HTMLInputElement;
    manualTimeInput.addEventListener('change', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(val) && val > 0) {
        store.updateProject({ targetDurationSeconds: val });
        this.render();
      }
    });

    this.container.querySelector('#btn-present')?.addEventListener('click', () => {
      store.setViewMode('presentation');
    });

    this.container.querySelector('#btn-reset')?.addEventListener('click', () => {
      if (confirm('Wirklich alles zurücksetzen?')) {
        store.resetProject();
        this.render(); // force full re-render
      }
    });

    this.container.querySelector('#btn-export')?.addEventListener('click', this.handleExport);
    this.container.querySelector('#btn-import')?.addEventListener('change', this.handleFileImport);
  }
}
