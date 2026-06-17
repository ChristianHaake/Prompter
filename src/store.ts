import type { AppState, PrompterProject } from './types';

const STORAGE_KEY = 'prompter_project_v1';

export const DEFAULT_PROJECT: PrompterProject = {
  version: "1.0",
  title: "Beispiel-Pitch",
  text: "Hallo und herzlich willkommen!\n\nMit PitchTimer kannst du deine Präsentationen ganz einfach ablesen und perfektionieren.\n\nDer Text scrollt automatisch nach oben. Du kannst die Geschwindigkeit jederzeit anpassen, den Text für Teleprompter-Spiegel umdrehen oder eine Fokus-Linie einschalten, um den Überblick zu behalten.\n\nProbier es einfach aus, indem du auf »Präsentieren« klickst!",
  targetDurationSeconds: 60,
  manualSpeed: 1.0,
  fontSize: 48,
  lineHeight: 1.5,
  theme: "light",
  mirrorMode: false,
  focusLine: false,
  countdownEnabled: true,
  updatedAt: new Date().toISOString(),
};

type Subscriber = (state: AppState) => void;

class Store {
  private state: AppState;
  private subscribers: Set<Subscriber> = new Set();

  constructor() {
    this.state = {
      project: this.loadFromStorage(),
      viewMode: 'editor'
    };
  }

  private loadFromStorage(): PrompterProject {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROJECT, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load project from local storage", e);
    }
    return { ...DEFAULT_PROJECT };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.project));
    } catch (e) {
      console.error("Failed to save project to local storage", e);
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public updateProject(partial: Partial<PrompterProject>) {
    this.state.project = {
      ...this.state.project,
      ...partial,
      updatedAt: new Date().toISOString()
    };
    this.saveToStorage();
    this.notify();
  }

  public setViewMode(mode: AppState['viewMode']) {
    this.state.viewMode = mode;
    this.notify();
  }
  
  public resetProject() {
    this.state.project = { ...DEFAULT_PROJECT };
    this.saveToStorage();
    this.notify();
  }

  public importProject(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        this.state.project = {
          ...DEFAULT_PROJECT,
          ...parsed,
          manualSpeed: Number(parsed.manualSpeed) || DEFAULT_PROJECT.manualSpeed,
          fontSize: Number(parsed.fontSize) || DEFAULT_PROJECT.fontSize,
          lineHeight: Number(parsed.lineHeight) || DEFAULT_PROJECT.lineHeight,
          mirrorMode: Boolean(parsed.mirrorMode),
          focusLine: Boolean(parsed.focusLine),
          countdownEnabled: Boolean(parsed.countdownEnabled),
          text: String(parsed.text || '')
        };
        this.saveToStorage();
        this.notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(sub => sub(this.state));
  }
}

export const store = new Store();
