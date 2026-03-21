
import { useState, useEffect } from 'react';
import { CharacterSelector, AptitudeSelector, ResultsDisplay } from './components';
import type { Character, Aptitudes, OptimizeResult } from './types/Interfaces';

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [aptitudes, setAptitudes] = useState<Aptitudes>({
    turf: 'G',
    dirt: 'G',
    sprint: 'G',
    mile: 'G',
    medium: 'G',
    long: 'G'
  });
  const [priorityDistance, setPriorityDistance] = useState<string>('Mile');
  const [cutoff, setCutoff] = useState<string>('B');
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}charactersData.json`)
      .then(response => {
        return response.json();
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        console.error('App: Error loading characters:', error);
        setIsLoading(false);
      });
  }, []);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setAptitudes({
      turf: character.aptitude[0],
      dirt: character.aptitude[1],
      sprint: character.aptitude[2],
      mile: character.aptitude[3],
      medium: character.aptitude[4],
      long: character.aptitude[5]
    });
    setOptimizeResult(null);
  };

  const handleAptitudesChange = (updated: Aptitudes) => {
    setAptitudes(updated);
    setOptimizeResult(null);
  };


  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1>Uma Race Optimizer</h1>

      <CharacterSelector
        selectedCharacter={selectedCharacter}
        onCharacterSelect={handleCharacterSelect}
      />

      <AptitudeSelector
        aptitudes={aptitudes}
        onAptitudesChange={handleAptitudesChange}
      />

      <div className="mt-5 flex justify-center gap-10">
        <div className="text-center">
          <h3>Priority Distance</h3>
          <select
            value={priorityDistance}
            onChange={(e) => { setPriorityDistance(e.target.value); setOptimizeResult(null); }}
          >
            {['Sprint', 'Mile', 'Medium', 'Long'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <h3>Cutoff</h3>
          <select
            value={cutoff}
            onChange={(e) => { setCutoff(e.target.value); setOptimizeResult(null); }}
          >
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={async () => {
            const response = await fetch('https://yudouwoodou-trackoptimizer.hf.space/optimize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                aptitudes: {
                  Turf: aptitudes.turf,
                  Dirt: aptitudes.dirt,
                  Sprint: aptitudes.sprint,
                  Mile: aptitudes.mile,
                  Medium: aptitudes.medium,
                  Long: aptitudes.long,
                },
                preferredDistance: priorityDistance.toLowerCase(),
                cutoff: cutoff.toLowerCase(),
                locked: {},
              }),
            });
            const result = await response.json();
            setOptimizeResult(result);
          }}
          className="px-8 py-2.5 text-base cursor-pointer"
        >
          Optimize
        </button>
      </div>

      {optimizeResult && <ResultsDisplay result={optimizeResult} />}
    </div>
  );
}

export default App;