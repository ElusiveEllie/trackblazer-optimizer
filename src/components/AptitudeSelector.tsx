import type { Aptitudes } from '../types/Interfaces';

interface AptitudeSelectorProps {
  aptitudes: Aptitudes;
  onAptitudesChange: (aptitudes: Aptitudes) => void;
}

const GRADES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
const APTITUDE_KEYS: { key: keyof Aptitudes; label: string }[] = [
  { key: 'turf',   label: 'Turf'    },
  { key: 'dirt',   label: 'Dirt'    },
  { key: 'sprint', label: 'Sprint'  },
  { key: 'mile',   label: 'Mile'    },
  { key: 'medium', label: 'Medium'  },
  { key: 'long',   label: 'Long'    },
];

export function AptitudeSelector({ aptitudes, onAptitudesChange }: AptitudeSelectorProps) {
  const handleChange = (key: keyof Aptitudes, value: string) => {
    onAptitudesChange({ ...aptitudes, [key]: value });
  };

  return (
    <div>
      <h3 className="text-center">Aptitudes</h3>
      <div className="flex flex-row gap-4 justify-center">
        {APTITUDE_KEYS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs mb-0.5">{label}</label>
            <select
              value={aptitudes[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}