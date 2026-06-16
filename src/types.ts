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

// Application View State
export type ViewMode = 'editor' | 'presentation';

export type AppState = {
  project: PrompterProject;
  viewMode: ViewMode;
};
