export type Theme = 'light' | 'dark' | 'highContrast';
export type TextColorTheme = 'dark' | 'light' | 'highContrast';
export type PrompterFontFamily = 'system' | 'serif' | 'mono' | 'dyslexic';

export type PrompterProject = {
  version: string;
  title: string;
  text: string;
  targetDurationSeconds: number;
  manualSpeed: number; // Pixels per second, or arbitrary multiplier
  fontSize: number;
  lineHeight: number;
  theme: Theme;
  fontFamily: PrompterFontFamily;
  textColorTheme: TextColorTheme;
  mirrorMode: boolean;
  focusLine: boolean;
  focusLinePosition: number;
  countdownEnabled: boolean;
  updatedAt: string;
};

export type PitchRunStatus = 'completed' | 'cancelled';

export type PitchRunRecord = {
  id: string;
  date: string;
  targetDurationSeconds: number;
  actualDurationSeconds: number;
  wordCount: number;
  status: PitchRunStatus;
};

// Application View State
export type ViewMode = 'editor' | 'preview' | 'presentation';

export type Language = 'de' | 'en';

export type AppState = {
  project: PrompterProject;
  pitchHistory: PitchRunRecord[];
  viewMode: ViewMode;
  language: Language;
  lastUndoAction: UndoAction | null;
};

export type UndoAction =
  | { type: 'projectReset'; project: PrompterProject }
  | { type: 'historyClear'; pitchHistory: PitchRunRecord[] };

export type ProjectImportResult =
  | { ok: true; project: PrompterProject }
  | { ok: false; reason: string; errorCode: ProjectImportErrorCode };

export type ProjectImportErrorCode =
  | 'invalidJson'
  | 'invalidObject'
  | 'unsupportedVersion'
  | 'missingTitle'
  | 'missingText';
