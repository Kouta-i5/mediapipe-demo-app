export type Sex = 'male' | 'female' | 'other';

export type Patient = {
  id: string;          // UUID
  name: string;        // 入力
  age: number;         // 入力
  sex: Sex;            // 入力
  patientId: string;   // 表示用ID（自動 or 入力）
  createdAt: string;   // ISO文字列
};

export type Record = {
  id: string;          // UUID
  patientId: string;   // 紐づく Patient.id
  videoUri: string;    // ファイルパス
  timestamp: string;   // 撮影日時
};


  