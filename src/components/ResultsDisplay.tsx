import type { OptimizeResult, RaceSlot } from '../types/Interfaces';

interface ResultsDisplayProps {
  result: OptimizeResult;
}

const YEARS = ['Junior', 'Classic', 'Senior'] as const;

// Each pair of months occupies one row (4 cells: Early/Late × 2 months)
const MONTH_PAIRS = [
  [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12],
] as const;

const MONTH_NAMES: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
  5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug',
  9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
};

type SlotMap = Record<string, Record<number, Record<string, RaceSlot>>>;

function buildSlotMap(slots: RaceSlot[]): SlotMap {
  const map: SlotMap = {};
  for (const slot of slots) {
    (map[slot.year] ??= {})[slot.month] ??= {};
    map[slot.year][slot.month][slot.half] = slot;
  }
  return map;
}

function CalendarCell({ slot }: { slot: RaceSlot | undefined }) {
  const race = slot?.race ?? null;

  return (
    <div className="w-full aspect-[2/1] rounded-md bg-gray-200 dark:bg-gray-600 overflow-hidden">
      {race && (
        <img
          src={`${import.meta.env.BASE_URL}races/${race.name.replace(/ \((Junior|Classic|Senior)\)$/, '')}.png`}
          alt={race.name}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}

function YearCalendar({ year, slotMap }: { year: string; slotMap: SlotMap }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="bg-gradient-to-b from-green-400 to-green-600 text-white text-center rounded-full py-1 px-3 mb-3 font-bold text-sm shadow">
        {year} Year
      </div>
      <div className="grid grid-cols-4 gap-1">
        {MONTH_PAIRS.flatMap(([m1, m2]) =>
          [m1, m2].flatMap(month =>
            ['Early', 'Late'].map(half => {
              const slot = slotMap[year]?.[month]?.[half];
              return (
                <div key={`${month}-${half}`} className="flex flex-col items-center gap-0 px-[1px] py-[4px]">
                  <CalendarCell slot={slot} />
                  <span className="text-xs font-semibold leading-none mt-0.5">
                    {half} {MONTH_NAMES[month]}
                  </span>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const slotMap = buildSlotMap(result.slots);
  const raceCount = result.slots.filter(s => s.race !== null).length;

  return (
    <div className="mt-8">
      <div className="text-sm mb-4 flex gap-6 justify-center">
        <span>Stat Total: <strong>{result.statTotal}</strong></span>
        <span>Races Scheduled: <strong>{raceCount}</strong></span>
        {result.skills.length > 0 && (
          <span>Skills: <strong>{result.skills.join(', ')}</strong></span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {YEARS.map(year => (
          <YearCalendar key={year} year={year} slotMap={slotMap} />
        ))}
      </div>
    </div>
  );
}
