import type {
  AppState,
  PitchRunRecord,
  PitchRunStatus,
  PrompterFontFamily,
  ProjectImportErrorCode,
  ProjectImportResult,
  PrompterProject,
  TextColorTheme,
  Theme,
} from './types';

export const STORAGE_KEY = 'prompter_project_v1';
export const PITCH_HISTORY_STORAGE_KEY = 'prompter_pitch_history_v1';
export const PROJECT_SCHEMA_VERSION = '1.0';
export const PITCH_HISTORY_SCHEMA_VERSION = 1;
export const MAX_PITCH_HISTORY_RECORDS = 50;
export const TIMER_PRESETS_SECONDS = [60, 90, 120] as const;
export const MAX_PROJECT_FILE_BYTES = 500_000;
export const MAX_TITLE_LENGTH = 120;
export const MAX_TEXT_LENGTH = 100_000;
export const MIN_DURATION_SECONDS = 10;
export const MAX_DURATION_SECONDS = 60 * 60;
export const MIN_FONT_SIZE = 16;
export const MAX_FONT_SIZE = 160;
export const MIN_MANUAL_SPEED = 0.25;
export const MAX_MANUAL_SPEED = 8;
export const MIN_LINE_HEIGHT = 1.1;
export const MAX_LINE_HEIGHT = 2.4;
export const MIN_FOCUS_LINE_POSITION = 20;
export const MAX_FOCUS_LINE_POSITION = 80;
export const DEFAULT_FOCUS_LINE_POSITION = 50;

export const DEFAULT_PROJECT: PrompterProject = {
  version: PROJECT_SCHEMA_VERSION,
  title: 'Beispiel-Pitch',
  text: 'Hallo und herzlich willkommen!\n\nMit Prompter kannst du deine Präsentationen ganz einfach ablesen und perfektionieren.\n\nDer Text scrollt automatisch nach oben. Du kannst die Geschwindigkeit jederzeit anpassen, den Text für Teleprompter-Spiegel umdrehen oder eine Fokus-Linie einschalten, um den Überblick zu behalten.\n\nProbier es einfach aus, indem du auf "Präsentieren" klickst!',
  targetDurationSeconds: 60,
  manualSpeed: 2.0,
  fontSize: 48,
  lineHeight: 1.5,
  theme: 'light',
  fontFamily: 'system',
  textColorTheme: 'dark',
  mirrorMode: false,
  focusLine: false,
  focusLinePosition: DEFAULT_FOCUS_LINE_POSITION,
  countdownEnabled: true,
  updatedAt: new Date().toISOString(),
};

type Subscriber = (state: AppState) => void;
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getBrowserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}

function parseTheme(value: unknown, fallback: Theme): Theme {
  return value === 'light' || value === 'dark' || value === 'highContrast' ? value : fallback;
}

function parseTextColorTheme(value: unknown, fallback: TextColorTheme): TextColorTheme {
  return value === 'dark' || value === 'light' || value === 'highContrast' ? value : fallback;
}

function parseFontFamily(value: unknown, fallback: PrompterFontFamily): PrompterFontFamily {
  return value === 'system' || value === 'serif' || value === 'mono' || value === 'dyslexic'
    ? value
    : fallback;
}

function parseString(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, maxLength);
}

function importError(errorCode: ProjectImportErrorCode, reason: string): ProjectImportResult {
  return { ok: false, errorCode, reason };
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function countScriptWords(text: string): number {
  const plainText = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_[\]()~|\\-]+/g, ' ')
    .trim();
  return plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
}

function isPitchRunRecord(value: unknown): value is PitchRunRecord {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    !Number.isNaN(Date.parse(value.date)) &&
    isFiniteNonNegativeNumber(value.targetDurationSeconds) &&
    isFiniteNonNegativeNumber(value.actualDurationSeconds) &&
    (value.wordCount === undefined || isFiniteNonNegativeNumber(value.wordCount)) &&
    (value.status === 'completed' || value.status === 'cancelled')
  );
}

function createRecordId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function decodePitchHistoryStorage(value: unknown): PitchRunRecord[] {
  const records =
    Array.isArray(value)
      ? value
      : isRecord(value) &&
          value.version === PITCH_HISTORY_SCHEMA_VERSION &&
          Array.isArray(value.records)
        ? value.records
        : null;

  if (!records) return [];
  return records
    .filter(isPitchRunRecord)
    .map(record => ({
      ...record,
      wordCount: Math.round(record.wordCount ?? 0),
    }))
    .slice(0, MAX_PITCH_HISTORY_RECORDS);
}

export function validateProjectImport(jsonString: string): ProjectImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return importError('invalidJson', 'Die Datei enthält kein gültiges JSON.');
  }

  if (!isRecord(parsed)) {
    return importError('invalidObject', 'Die Projektdatei hat kein gültiges Objektformat.');
  }

  if (parsed.version !== PROJECT_SCHEMA_VERSION) {
    return importError('unsupportedVersion', `Unterstützt wird nur Projektversion ${PROJECT_SCHEMA_VERSION}.`);
  }

  if (typeof parsed.title !== 'string') {
    return importError('missingTitle', 'Der Projekttitel fehlt oder ist ungültig.');
  }

  if (typeof parsed.text !== 'string') {
    return importError('missingText', 'Der Projekttext fehlt oder ist ungültig.');
  }

  const targetDurationSeconds = clamp(
    parseFiniteNumber(parsed.targetDurationSeconds, DEFAULT_PROJECT.targetDurationSeconds),
    MIN_DURATION_SECONDS,
    MAX_DURATION_SECONDS,
  );

  const manualSpeed = clamp(
    parseFiniteNumber(parsed.manualSpeed, DEFAULT_PROJECT.manualSpeed),
    MIN_MANUAL_SPEED,
    MAX_MANUAL_SPEED,
  );

  const fontSize = clamp(
    parseFiniteNumber(parsed.fontSize, DEFAULT_PROJECT.fontSize),
    MIN_FONT_SIZE,
    MAX_FONT_SIZE,
  );

  const lineHeight = clamp(
    parseFiniteNumber(parsed.lineHeight, DEFAULT_PROJECT.lineHeight),
    MIN_LINE_HEIGHT,
    MAX_LINE_HEIGHT,
  );

  const theme = parseTheme(parsed.theme, DEFAULT_PROJECT.theme);
  const fontFamily = parseFontFamily(parsed.fontFamily, DEFAULT_PROJECT.fontFamily);
  const textColorTheme = parseTextColorTheme(parsed.textColorTheme, DEFAULT_PROJECT.textColorTheme);
  const focusLinePosition = clamp(
    parseFiniteNumber(parsed.focusLinePosition, DEFAULT_PROJECT.focusLinePosition),
    MIN_FOCUS_LINE_POSITION,
    MAX_FOCUS_LINE_POSITION,
  );

  return {
    ok: true,
    project: {
      ...DEFAULT_PROJECT,
      version: PROJECT_SCHEMA_VERSION,
      title: parseString(parsed.title, DEFAULT_PROJECT.title, MAX_TITLE_LENGTH).trim() || DEFAULT_PROJECT.title,
      text: parseString(parsed.text, '', MAX_TEXT_LENGTH),
      targetDurationSeconds,
      manualSpeed,
      fontSize,
      lineHeight,
      theme,
      fontFamily,
      textColorTheme,
      mirrorMode: parseBoolean(parsed.mirrorMode, DEFAULT_PROJECT.mirrorMode),
      focusLine: parseBoolean(parsed.focusLine, DEFAULT_PROJECT.focusLine),
      focusLinePosition,
      countdownEnabled: parseBoolean(parsed.countdownEnabled, DEFAULT_PROJECT.countdownEnabled),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function sanitizeProjectForUpdate(project: PrompterProject): PrompterProject {
  return {
    ...project,
    version: PROJECT_SCHEMA_VERSION,
    title: project.title.slice(0, MAX_TITLE_LENGTH),
    text: project.text.slice(0, MAX_TEXT_LENGTH),
    targetDurationSeconds: clamp(project.targetDurationSeconds, MIN_DURATION_SECONDS, MAX_DURATION_SECONDS),
    manualSpeed: clamp(project.manualSpeed, MIN_MANUAL_SPEED, MAX_MANUAL_SPEED),
    fontSize: clamp(project.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE),
    lineHeight: clamp(project.lineHeight, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT),
    theme: parseTheme(project.theme, DEFAULT_PROJECT.theme),
    fontFamily: parseFontFamily(project.fontFamily, DEFAULT_PROJECT.fontFamily),
    textColorTheme: parseTextColorTheme(project.textColorTheme, DEFAULT_PROJECT.textColorTheme),
    focusLinePosition: clamp(
      project.focusLinePosition,
      MIN_FOCUS_LINE_POSITION,
      MAX_FOCUS_LINE_POSITION,
    ),
  };
}

export class Store {
  private state: AppState;
  private subscribers: Set<Subscriber> = new Set();
  private storage: StorageLike | null;

  constructor(storage: StorageLike | null = getBrowserStorage()) {
    this.storage = storage;
    this.state = {
      project: this.loadFromStorage(),
      pitchHistory: this.loadPitchHistoryFromStorage(),
      viewMode: 'editor',
      language: this.loadLanguageFromStorage(),
      lastUndoAction: null,
    };
  }

  private loadFromStorage(): PrompterProject {
    try {
      const stored = this.storage?.getItem(STORAGE_KEY);
      if (stored) {
        const result = validateProjectImport(stored);
        if (result.ok) return result.project;
      }
    } catch (e) {
      console.error('Failed to load project from local storage', e);
    }
    return { ...DEFAULT_PROJECT };
  }

  private loadPitchHistoryFromStorage(): PitchRunRecord[] {
    try {
      const stored = this.storage?.getItem(PITCH_HISTORY_STORAGE_KEY);
      if (!stored) return [];
      return decodePitchHistoryStorage(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load pitch history from local storage', e);
      return [];
    }
  }

  private saveToStorage() {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.state.project));
    } catch (e) {
      console.error('Failed to save project to local storage', e);
    }
  }

  private savePitchHistoryToStorage() {
    try {
      this.storage?.setItem(
        PITCH_HISTORY_STORAGE_KEY,
        JSON.stringify({
          version: PITCH_HISTORY_SCHEMA_VERSION,
          records: this.state.pitchHistory,
        }),
      );
    } catch (e) {
      console.error('Failed to save pitch history to local storage', e);
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public updateProject(partial: Partial<PrompterProject>) {
    this.clearUndoAction();
    this.state.project = sanitizeProjectForUpdate({
      ...this.state.project,
      ...partial,
      updatedAt: new Date().toISOString()
    });
    this.saveToStorage();
    this.notify();
  }

  public setViewMode(mode: AppState['viewMode']) {
    this.state.viewMode = mode;
    this.notify();
  }

  public addPitchRun(status: PitchRunStatus, actualDurationSeconds: number) {
    this.clearUndoAction();
    const project = this.state.project;
    const record: PitchRunRecord = {
      id: createRecordId(),
      date: new Date().toISOString(),
      targetDurationSeconds: project.targetDurationSeconds,
      actualDurationSeconds: Math.max(0, Math.round(actualDurationSeconds)),
      wordCount: countScriptWords(project.text),
      status,
    };
    this.state.pitchHistory = [record, ...this.state.pitchHistory].slice(0, MAX_PITCH_HISTORY_RECORDS);
    this.savePitchHistoryToStorage();
    this.notify();
  }

  public clearPitchHistory() {
    this.state.lastUndoAction = {
      type: 'historyClear',
      pitchHistory: [...this.state.pitchHistory],
    };
    this.state.pitchHistory = [];
    try {
      this.storage?.removeItem(PITCH_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear pitch history from local storage', e);
    }
    this.notify();
  }

  private loadLanguageFromStorage(): 'de' | 'en' {
    try {
      const stored = this.storage?.getItem('prompter_language');
      if (stored === 'de' || stored === 'en') return stored;
    } catch {
      // ignore
    }
    // Default based on browser language if needed, but for simplicity default to 'de'
    return 'de';
  }

  public setLanguage(lang: 'de' | 'en') {
    this.state.language = lang;
    try {
      this.storage?.setItem('prompter_language', lang);
    } catch {
      // ignore
    }
    this.notify();
  }
  
  public resetProject() {
    this.state.lastUndoAction = {
      type: 'projectReset',
      project: { ...this.state.project },
    };
    this.state.project = { ...DEFAULT_PROJECT, updatedAt: new Date().toISOString() };
    try {
      this.storage?.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear project from local storage', e);
    }
    this.notify();
  }

  public importProject(jsonString: string): ProjectImportResult {
    const result = validateProjectImport(jsonString);
    if (result.ok) {
      this.clearUndoAction();
      this.state.project = result.project;
      this.saveToStorage();
      this.notify();
    }
    return result;
  }

  public undoLastAction(): boolean {
    const action = this.state.lastUndoAction;
    if (!action) return false;

    if (action.type === 'projectReset') {
      this.state.project = sanitizeProjectForUpdate(action.project);
      this.saveToStorage();
    } else {
      this.state.pitchHistory = action.pitchHistory.slice(0, MAX_PITCH_HISTORY_RECORDS);
      this.savePitchHistoryToStorage();
    }

    this.state.lastUndoAction = null;
    this.notify();
    return true;
  }

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(sub => sub(this.state));
  }

  private clearUndoAction() {
    this.state.lastUndoAction = null;
  }
}

export const store = new Store();
