import { describe, expect, test } from 'vitest';
import { calculatePitchAnalytics, exportPitchHistoryCsv } from '../src/analytics';
import {
  decodePitchHistoryStorage,
  DEFAULT_PROJECT,
  PITCH_HISTORY_SCHEMA_VERSION,
  PITCH_HISTORY_STORAGE_KEY,
  PROJECT_SCHEMA_VERSION,
  STORAGE_KEY,
  Store,
  validateProjectImport,
} from '../src/store';

class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

function validProject(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    ...DEFAULT_PROJECT,
    version: PROJECT_SCHEMA_VERSION,
    title: 'Importiert',
    text: 'Importierter Text',
    ...overrides,
  });
}

describe('Store persistence and imports', () => {
  test('autosaves updates and restores them from storage', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);

    store.updateProject({ title: 'Gespeichert', text: 'Lokaler Entwurf' });

    const restored = new Store(storage);
    expect(restored.getState().project.title).toBe('Gespeichert');
    expect(restored.getState().project.text).toBe('Lokaler Entwurf');
  });

  test('imports a valid project and persists it', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);

    const result = store.importProject(validProject({ fontSize: 72, manualSpeed: 1.5 }));

    expect(result.ok).toBe(true);
    expect(store.getState().project.title).toBe('Importiert');
    expect(store.getState().project.fontSize).toBe(72);
    expect(store.getState().project.manualSpeed).toBe(1.5);
    expect(storage.getItem(STORAGE_KEY)).toContain('Importierter Text');
  });

  test('rejects invalid imports without replacing current work', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ title: 'Aktuell', text: 'Bleibt erhalten' });

    const result = store.importProject('{"version":"1.0","title":"Kaputt"}');

    expect(result.ok).toBe(false);
    expect(store.getState().project.title).toBe('Aktuell');
    expect(store.getState().project.text).toBe('Bleibt erhalten');
  });

  test('rejects future project versions', () => {
    const result = validateProjectImport(validProject({ version: '9.0' }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain(PROJECT_SCHEMA_VERSION);
    }
  });

  test('clamps imported numeric settings and truncates long text', () => {
    const result = validateProjectImport(validProject({
      targetDurationSeconds: 999999,
      manualSpeed: 99,
      fontSize: 999,
      lineHeight: 99,
      focusLinePosition: 99,
      text: 'x'.repeat(120_000),
    }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.project.targetDurationSeconds).toBe(3600);
      expect(result.project.manualSpeed).toBe(8);
      expect(result.project.fontSize).toBe(160);
      expect(result.project.lineHeight).toBe(2.4);
      expect(result.project.focusLinePosition).toBe(80);
      expect(result.project.text).toHaveLength(100_000);
    }
  });

  test('defaults optional v1 project fields for older files', () => {
    const result = validateProjectImport(JSON.stringify({
      version: PROJECT_SCHEMA_VERSION,
      title: 'Alt',
      text: 'Alter Text',
      targetDurationSeconds: 60,
      manualSpeed: 1,
      fontSize: 48,
      lineHeight: 1.5,
      theme: 'unknown',
      mirrorMode: false,
      focusLine: false,
      countdownEnabled: true,
      updatedAt: new Date().toISOString(),
    }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.project.theme).toBe(DEFAULT_PROJECT.theme);
      expect(result.project.fontFamily).toBe(DEFAULT_PROJECT.fontFamily);
      expect(result.project.textColorTheme).toBe(DEFAULT_PROJECT.textColorTheme);
      expect(result.project.focusLinePosition).toBe(DEFAULT_PROJECT.focusLinePosition);
    }
  });

  test('persists language preference independently from project data', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);

    store.setLanguage('en');

    const restored = new Store(storage);
    expect(restored.getState().language).toBe('en');
    expect(restored.getState().project.title).toBe(DEFAULT_PROJECT.title);
  });

  test('reset clears persisted project data and restores defaults in memory', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ title: 'Weg damit', text: 'Wird geloescht' });

    store.resetProject();

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(store.getState().project.title).toBe(DEFAULT_PROJECT.title);
    expect(store.getState().project.text).toBe(DEFAULT_PROJECT.text);
  });

  test('undo restores reset project until a further edit happens', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ title: 'Undo Titel', text: 'Undo Text' });

    store.resetProject();
    expect(store.getState().lastUndoAction?.type).toBe('projectReset');
    expect(store.undoLastAction()).toBe(true);
    expect(store.getState().project.title).toBe('Undo Titel');
    expect(store.getState().project.text).toBe('Undo Text');

    store.resetProject();
    store.updateProject({ title: 'Neue Arbeit' });
    expect(store.getState().lastUndoAction).toBeNull();
    expect(store.undoLastAction()).toBe(false);
  });

  test('records, restores, and clears capped pitch history', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ targetDurationSeconds: 90 });

    store.addPitchRun('completed', 88.4);
    store.addPitchRun('cancelled', 12.2);

    expect(store.getState().pitchHistory).toHaveLength(2);
    expect(store.getState().pitchHistory[0].status).toBe('cancelled');
    expect(store.getState().pitchHistory[0].actualDurationSeconds).toBe(12);
    expect(storage.getItem(PITCH_HISTORY_STORAGE_KEY)).toContain('"version":1');

    const restored = new Store(storage);
    expect(restored.getState().pitchHistory).toHaveLength(2);

    restored.clearPitchHistory();
    expect(restored.getState().pitchHistory).toEqual([]);
    expect(storage.getItem(PITCH_HISTORY_STORAGE_KEY)).toBeNull();
  });

  test('undo restores cleared pitch history', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ text: 'Eins zwei drei vier', targetDurationSeconds: 30 });
    store.addPitchRun('completed', 30);

    store.clearPitchHistory();
    expect(store.getState().pitchHistory).toHaveLength(0);
    expect(store.undoLastAction()).toBe(true);
    expect(store.getState().pitchHistory).toHaveLength(1);
    expect(store.getState().pitchHistory[0].wordCount).toBe(4);
  });

  test('decodes only valid pitch history records from versioned storage', () => {
    const records = Array.from({ length: 55 }, (_, index) => ({
      id: `run-${index}`,
      date: new Date(2026, 0, index + 1).toISOString(),
      targetDurationSeconds: 60,
      actualDurationSeconds: index,
      status: index % 2 === 0 ? 'completed' : 'cancelled',
    }));

    const decoded = decodePitchHistoryStorage({
      version: PITCH_HISTORY_SCHEMA_VERSION,
      records: [
        ...records,
        { id: 'invalid', date: 'nope', targetDurationSeconds: 60, actualDurationSeconds: 1, status: 'completed' },
      ],
    });

    expect(decoded).toHaveLength(50);
    expect(decoded[0].id).toBe('run-0');
      expect(decodePitchHistoryStorage({ version: 999, records })).toEqual([]);
  });

  test('calculates pitch analytics and exports escaped CSV', () => {
    const records = [
      {
        id: '=run,1',
        date: '2026-01-02T03:04:05.000Z',
        targetDurationSeconds: 60,
        actualDurationSeconds: 45,
        wordCount: 120,
        status: 'completed' as const,
      },
      {
        id: 'run-2',
        date: '2026-01-03T03:04:05.000Z',
        targetDurationSeconds: 60,
        actualDurationSeconds: 90,
        wordCount: 120,
        status: 'completed' as const,
      },
      {
        id: 'run-3',
        date: '2026-01-04T03:04:05.000Z',
        targetDurationSeconds: 60,
        actualDurationSeconds: 10,
        wordCount: 120,
        status: 'cancelled' as const,
      },
    ];

    const analytics = calculatePitchAnalytics(records);
    expect(analytics.completedRuns).toBe(2);
    expect(Math.round(analytics.averageWordsPerMinute ?? 0)).toBe(120);
    expect(Math.round(analytics.fastestWordsPerMinute ?? 0)).toBe(160);
    expect(Math.round(analytics.slowestWordsPerMinute ?? 0)).toBe(80);
    expect(analytics.averageDeviationSeconds).toBe(7.5);

    const csv = exportPitchHistoryCsv(records);
    expect(csv).toContain('"\'=run,1"');
    expect(csv).toContain('deviationSeconds');
    expect(csv).toContain('160');
  });
});
