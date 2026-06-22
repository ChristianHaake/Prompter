export type Theme = "light" | "dark";

export type PrompterProject = {
  version: string;
  title: string;
  text: string;
  targetDurationSeconds: number;
  manualSpeed: number; // Pixels per second, or arbitrary multiplier
  fontSize: number;
  lineHeight: number;
  theme: Theme;
  mirrorMode: boolean;
  focusLine: boolean;
  countdownEnabled: boolean;
  updatedAt: string;
};

export type PitchRunStatus = 'completed' | 'cancelled';

export type PitchRunRecord = {
  id: string;
  date: string;
  targetDurationSeconds: number;
  actualDurationSeconds: number;
  status: PitchRunStatus;
};

// Application View State
export type ViewMode = 'editor' | 'presentation';

export type Language = 'de' | 'en';

export type AppState = {
  project: PrompterProject;
  pitchHistory: PitchRunRecord[];
  viewMode: ViewMode;
  language: Language;
};

export type ProjectImportResult =
  | { ok: true; project: PrompterProject }
  | { ok: false; reason: string; errorCode: ProjectImportErrorCode };

export type ProjectImportErrorCode =
  | 'invalidJson'
  | 'invalidObject'
  | 'unsupportedVersion'
  | 'missingTitle'
  | 'missingText';
