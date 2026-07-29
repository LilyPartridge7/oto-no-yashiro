export interface MoodDef {
  id: 'morning_mist' | 'twilight' | 'moonlit_night';
  nameJa: string;
  nameEn: string;
  kanji: string;
  skyGradient: string;
  mistColor: string;
  mistDensity: number; // 0 to 1
  lanternIntensity: number; // 0 to 1
  windVol: number;
  waterVol: number;
  birdsVol: number;
  reverbTime: number; // seconds
  tempoMultiplier: number;
}

export const MOODS: MoodDef[] = [
  {
    id: 'morning_mist',
    nameJa: '朝霧',
    nameEn: 'Morning Mist',
    kanji: '朝霧',
    skyGradient: 'linear-gradient(to bottom, #1e1b4b 0%, #312e81 35%, #4c0519 70%, #9a3412 100%)',
    mistColor: 'rgba(254, 205, 211, 0.18)',
    mistDensity: 0.8,
    lanternIntensity: 0.5,
    windVol: 0.2,
    waterVol: 0.5,
    birdsVol: 0.6,
    reverbTime: 2.5,
    tempoMultiplier: 1.0,
  },
  {
    id: 'twilight',
    nameJa: '夕暮れ',
    nameEn: 'Twilight',
    kanji: '夕暮れ',
    skyGradient: 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 35%, #831843 75%, #451a03 100%)',
    mistColor: 'rgba(251, 146, 60, 0.12)',
    mistDensity: 0.5,
    lanternIntensity: 0.85,
    windVol: 0.35,
    waterVol: 0.35,
    birdsVol: 0.25,
    reverbTime: 3.8,
    tempoMultiplier: 0.85,
  },
  {
    id: 'moonlit_night',
    nameJa: '月夜',
    nameEn: 'Moonlit Night',
    kanji: '月夜',
    skyGradient: 'linear-gradient(to bottom, #030712 0%, #0b1329 45%, #1e293b 80%, #0f172a 100%)',
    mistColor: 'rgba(186, 230, 253, 0.08)',
    mistDensity: 0.35,
    lanternIntensity: 1.0,
    windVol: 0.45,
    waterVol: 0.2,
    birdsVol: 0.05,
    reverbTime: 5.2,
    tempoMultiplier: 0.7,
  },
];
