export interface InstrumentDef {
  id: string;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  keyLabel: string;
  keyCode: string;
  type: 'glass_high' | 'bronze_medium' | 'wood_mokugyo' | 'temple_bonsho' | 'glass_low';
  baseFreq: number;
  decay: number; // seconds
  colorHex: string;
  accentGlow: string;
  xRatio: number; // 0 to 1 horizontal positioning across beam
  yOffset: number; // pixel vertical string drop length
}

export const INSTRUMENTS: InstrumentDef[] = [
  {
    id: 'glass-furin-1',
    nameJa: '清風風鈴',
    nameEn: 'Clear Glass Wind Chime',
    descriptionJa: '澄んだガラスの風鈴。微風にたゆたう涼やかな音色。',
    keyLabel: 'A',
    keyCode: 'KeyA',
    type: 'glass_high',
    baseFreq: 880, // A5
    decay: 2.5,
    colorHex: '#bae6fd',
    accentGlow: 'rgba(186, 230, 253, 0.7)',
    xRatio: 0.18,
    yOffset: 120,
  },
  {
    id: 'bronze-bell',
    nameJa: '青銅小鐘',
    nameEn: 'Medium Bronze Bell',
    descriptionJa: '古美た青銅の鐘。温かみのある余韻が広がる。',
    keyLabel: 'S',
    keyCode: 'KeyS',
    type: 'bronze_medium',
    baseFreq: 440, // A4
    decay: 4.0,
    colorHex: '#fcd34d',
    accentGlow: 'rgba(252, 211, 77, 0.7)',
    xRatio: 0.34,
    yOffset: 140,
  },
  {
    id: 'wood-mokugyo',
    nameJa: '木魚',
    nameEn: 'Wooden Percussion',
    descriptionJa: '刻まれた木魚。素朴で落ち着いた打撃音。',
    keyLabel: 'D',
    keyCode: 'KeyD',
    type: 'wood_mokugyo',
    baseFreq: 261.63, // C4
    decay: 0.8,
    colorHex: '#d97706',
    accentGlow: 'rgba(217, 119, 6, 0.6)',
    xRatio: 0.50,
    yOffset: 110,
  },
  {
    id: 'temple-bonsho',
    nameJa: '大梵鐘',
    nameEn: 'Grand Temple Bell (Bonshō)',
    descriptionJa: '静寂を揺らす大梵鐘。重厚で深く響き渡る。',
    keyLabel: 'F',
    keyCode: 'KeyF',
    type: 'temple_bonsho',
    baseFreq: 110, // A2
    decay: 7.5,
    colorHex: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.8)',
    xRatio: 0.66,
    yOffset: 160,
  },
  {
    id: 'glass-furin-2',
    nameJa: '夕霧風鈴',
    nameEn: 'Twilight Glass Chime',
    descriptionJa: '低音に調律された琥珀色のガラス風鈴。',
    keyLabel: 'G',
    keyCode: 'KeyG',
    type: 'glass_low',
    baseFreq: 587.33, // D5
    decay: 3.2,
    colorHex: '#fed7aa',
    accentGlow: 'rgba(254, 215, 170, 0.7)',
    xRatio: 0.82,
    yOffset: 130,
  },
];
