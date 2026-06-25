import type { PitchRunRecord } from './types';

export type PitchAnalytics = {
  completedRuns: number;
  averageWordsPerMinute: number | null;
  fastestWordsPerMinute: number | null;
  slowestWordsPerMinute: number | null;
  averageDeviationSeconds: number | null;
  recentDeviationTrendSeconds: number | null;
};

function wordsPerMinute(record: PitchRunRecord): number | null {
  if (record.status !== 'completed' || record.actualDurationSeconds <= 0 || record.wordCount <= 0) {
    return null;
  }
  return record.wordCount / (record.actualDurationSeconds / 60);
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculatePitchAnalytics(records: PitchRunRecord[]): PitchAnalytics {
  const completedRecords = records.filter(record => record.status === 'completed');
  const wpmValues = completedRecords
    .map(wordsPerMinute)
    .filter((value): value is number => value !== null);
  const deviationValues = completedRecords.map(
    record => record.actualDurationSeconds - record.targetDurationSeconds,
  );
  const recentDeviations = completedRecords
    .slice(0, 5)
    .map(record => record.actualDurationSeconds - record.targetDurationSeconds);

  return {
    completedRuns: completedRecords.length,
    averageWordsPerMinute: average(wpmValues),
    fastestWordsPerMinute: wpmValues.length > 0 ? Math.max(...wpmValues) : null,
    slowestWordsPerMinute: wpmValues.length > 0 ? Math.min(...wpmValues) : null,
    averageDeviationSeconds: average(deviationValues),
    recentDeviationTrendSeconds:
      recentDeviations.length >= 2
        ? recentDeviations[0] - recentDeviations[recentDeviations.length - 1]
        : null,
  };
}

function escapeCsvCell(value: string | number): string {
  let text = String(value);
  const firstNonWhitespace = text.trimStart().charAt(0);
  if (/^[\t\r\n]/.test(text) || '=+-@'.includes(firstNonWhitespace)) {
    text = `'${text}`;
  }
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

export function exportPitchHistoryCsv(records: PitchRunRecord[]): string {
  const header = [
    'id',
    'date',
    'status',
    'targetDurationSeconds',
    'actualDurationSeconds',
    'deviationSeconds',
    'wordCount',
    'wordsPerMinute',
  ];
  const rows = records.map(record => {
    const wpm = wordsPerMinute(record);
    return [
      record.id,
      record.date,
      record.status,
      record.targetDurationSeconds,
      record.actualDurationSeconds,
      record.actualDurationSeconds - record.targetDurationSeconds,
      record.wordCount,
      wpm === null ? '' : Math.round(wpm),
    ];
  });

  return [header, ...rows]
    .map(row => row.map(cell => escapeCsvCell(cell)).join(','))
    .join('\n');
}

export function formatSignedSeconds(seconds: number | null): string {
  if (seconds === null) return '-';
  const rounded = Math.round(seconds);
  if (rounded === 0) return '0s';
  return `${rounded > 0 ? '+' : ''}${rounded}s`;
}
