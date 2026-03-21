
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Character } from '../types/Interfaces';

interface CharacterSelectorProps {
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
}

function getCharacterImagePath(character: Character | null): string {
  if (!character || !character.id) {
    return `${import.meta.env.BASE_URL}chara/1000.png`;
  }
  return `${import.meta.env.BASE_URL}chara/${character.id}.png`;
}

// Module-level cache — survives StrictMode double-mount so images are only preloaded once
const imageCache: HTMLImageElement[] = [];

function preloadImages(characters: Character[]) {
  if (imageCache.length > 0) return;
  characters.forEach(character => {
    const img = new Image();
    imageCache.push(img);
    img.src = getCharacterImagePath(character);
  });
}

export function CharacterSelector({ selectedCharacter, onCharacterSelect }: CharacterSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/charactersData.json')
      .then(response => response.json())
      .then(data => {
        const releasedCharacters = data.filter((character: Character) => character.released);
        setCharacters(releasedCharacters);
        preloadImages(releasedCharacters);
      })
      .catch(error => {
        console.error('CharacterSelector: Error loading characters:', error);
      });
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isModalOpen]);

  const filteredCharacters = characters.filter(character =>
    character.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCharacterSelect = (character: Character) => {
    onCharacterSelect(character);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="border-none bg-transparent cursor-pointer p-2.5"
        >
          <img
            src={getCharacterImagePath(selectedCharacter)}
            alt={selectedCharacter ? selectedCharacter.name_en : "Select Character"}
            className="w-20 h-20 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = `${import.meta.env.BASE_URL}chara/1000.png`;
            }}
          />
        </button>
        {selectedCharacter && (
          <p className="text-center mt-1">
            {selectedCharacter.name_en}
          </p>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white rounded-xl p-5 max-w-[800px] max-h-[80vh] w-[90%] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2>Select Character</h2>
              <button
                onClick={handleCloseModal}
                className="bg-transparent border-none text-xl cursor-pointer text-gray-700"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2.5 mb-5 border border-gray-300 rounded text-base w-full"
            />

            <div className="grid gap-2.5 overflow-y-auto max-h-[400px]"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
            >
              {filteredCharacters.map((character) => (
                <button
                  key={character.name_en}
                  onClick={() => handleCharacterSelect(character)}
                  className="cursor-pointer flex flex-col items-center p-1 rounded-lg border-none bg-transparent transition-colors duration-200 hover:bg-gray-100"
                >
                  <img
                    src={getCharacterImagePath(character)}
                    alt={character.name_en}
                    className="w-[60px] h-[60px] rounded pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.src = `${import.meta.env.BASE_URL}chara/1000.png`;
                    }}
                  />
                  <div className="text-xs mt-1 pointer-events-none">
                    {character.name_en}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
