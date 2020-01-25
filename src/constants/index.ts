import { DayData, TripData } from '../types';

export const TripClasses = ['国内', '国外'];

export const JobTitles = [
  '選択してください',
  '教授',
  '准教授',
  '専任講師',
  '助教',
  '特任教授',
  '特任准教授',
  '特任講師',
  '特任助教',
  '客員教員',
  '研究員',
  '特別研究員（PD・RPD・SPD）',
  '特別研究員（DC1）',
  '特別研究員（DC2）',
  '博士課程4年',
  '博士課程3年',
  '博士課程2年',
  '博士課程1年',
  '修士課程2年',
  '修士課程1年',
  '学部6年',
  '学部5年',
  '学部4年',
  '教諭',
  '管理職職員',
  '非常勤講師（本務が教授相当）',
  '非常勤特任講師',
  '助教諭',
  '非常勤講師',
  'その他',
];

export const Destinations = [
  '',
  'アブダビ',
  'リヤド',
  'ジッダ',
  'クウェート',
  'シンガポール',
  'アビジャン',
  'アイスランド',
  'アイルランド',
  'アゼルバイジャン',
  'アルバニア',
  'アルメニア',
  'アンドラ',
  'イタリア',
  'ウクライナ',
  'ウズベキスタン',
  '英国',
  'エストニア',
  'オーストリア',
  'オランダ',
  'カザフスタン',
  'キプロス',
  'ギリシャ',
  'キルギス',
  'クロアチア',
  'コソボ',
  'サンマリノ',
  'ジョージア',
  'スイス',
  'スウェーデン',
  'スペイン',
  'スロバキア',
  'セルビア',
  'タジキスタン',
  'チェコ',
  'デンマーク',
  'ドイツ',
  'トルクメニスタン',
  'ノルウェー',
  'バチカン',
  'ハンガリー',
  'フィンランド',
  'フランス',
  'ブルガリア',
  'ベラルーシ',
  'ベルギー',
  'ポーランド',
  'ボスニア・ヘルツェゴビナ',
  'ポルトガル',
  'マケドニア旧ユーゴスラビア',
  'マルタ',
  'モナコ',
  'モルドバ',
  'モンテネグロ',
  'ラトビア',
  'リヒテンシュタイン',
  'リトアニア',
  'ルーマニア',
  'ルクセンブルク',
  'ロシア',
  '米国',
  'カナダ',
]

export const StayClasses = [
  '日帰り',
  '宿泊(滞在日)',
  '宿泊(出発日)',
  '宿泊(帰着日)',
];

export const Transportations = ['鉄道', '船舶'];

export const InitialDayData = (tripData: TripData, index: number): DayData => {
  const date = new Date(tripData.startDate);
  date.setDate(date.getDate() + index);
  return {
    date: date.toISOString().slice(0, 10),
    schedules: [],
  };
};
