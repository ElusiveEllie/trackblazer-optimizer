import type { OptimizeResult } from '../types/Interfaces';

interface ResultsDisplayProps {
  result: OptimizeResult;
}

const YEARS = ['Junior', 'Classic', 'Senior'] as const;
const SEP = '─'.repeat(60);
const COL_SEP = `  ${'─'.repeat(10)} ${'─'.repeat(8)} ${'─'.repeat(32)} ${'─'.repeat(6)}`;

function formatLines(result: OptimizeResult): string {
  const lines: string[] = [];
  const raceCount = result.slots.filter(s => s.race !== null).length;

  lines.push(`Stat Total: ${result.statTotal}`);
  lines.push(`Races Scheduled: ${raceCount}`);
  if (result.skills.length > 0) {
    lines.push(`Skills: ${result.skills.join(', ')}`);
  }

  const slotsBySlot = Object.fromEntries(result.slots.map(s => [s.slot, s]));

  for (const year of YEARS) {
    const yearSlots = result.slots.filter(s => s.year === year);
    if (yearSlots.length === 0) continue;
    const startSlot = yearSlots[0].slot;

    lines.push('');
    lines.push(SEP);
    lines.push(`  ${year.toUpperCase()} YEAR`);
    lines.push(SEP);
    lines.push(`  ${'Month'.padEnd(10)} ${'Half'.padEnd(8)} ${'Race'.padEnd(32)} Grade`);
    lines.push(COL_SEP);

    for (let i = startSlot; i < startSlot + 24; i++) {
      const slot = slotsBySlot[i];
      if (!slot || slot.summer || !slot.race) continue;
      lines.push(
        `  ${slot.monthName.padEnd(10)} ${slot.half.padEnd(8)} ${slot.race.name.padEnd(32)} ${slot.race.grade}`
      );
    }
  }

  return lines.join('\n');
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <pre className="mt-8 font-mono whitespace-pre-wrap text-left">
      {formatLines(result)}
    </pre>
  );
}
