import { describe, expect, test } from 'vitest';
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
      text: 'x'.repeat(120_000),
    }));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.project.targetDurationSeconds).toBe(3600);
      expect(result.project.manualSpeed).toBe(4);
      expect(result.project.fontSize).toBe(160);
      expect(result.project.lineHeight).toBe(2.4);
      expect(result.project.text).toHaveLength(100_000);
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
});
