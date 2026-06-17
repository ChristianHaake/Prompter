import { describe, expect, test } from 'vitest';
import {
  DEFAULT_PROJECT,
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

  test('reset clears persisted project data and restores defaults in memory', () => {
    const storage = new MemoryStorage();
    const store = new Store(storage);
    store.updateProject({ title: 'Weg damit', text: 'Wird geloescht' });

    store.resetProject();

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(store.getState().project.title).toBe(DEFAULT_PROJECT.title);
    expect(store.getState().project.text).toBe(DEFAULT_PROJECT.text);
  });
});
