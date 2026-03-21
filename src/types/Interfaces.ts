export interface Character {
    name_en: string;
    id: number;
    aptitude: string[];
    released: boolean;
}

export interface Race {
    name: string;
    grade: string;
    surface: string;
    distanceType: string;
    location: string;
    epithets: string[];
}

export interface RaceSlot {
    slot: number;
    year: string;
    month: number;
    monthName: string;
    half: string;
    summer: boolean;
    race: Race | null;
}

export interface OptimizeResult {
    slots: RaceSlot[];
    statTotal: number;
    skills: string[];
}

export interface Aptitudes {
    turf: string;
    dirt: string;
    sprint: string;
    mile: string;
    medium: string;
    long: string;
}