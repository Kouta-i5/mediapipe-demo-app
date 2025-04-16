export type Gender = '男性' | '女性' | 'その他' | '未回答';

export type FootCondition = 'マット上立位' | '平地上立位';
export type StandingCondition =
  | '開眼・開脚'
  | '開眼・閉脚'
  | '閉眼・開脚'
  | '閉眼・閉脚';

export type Condition = {
  footCondition: FootCondition;
  standingCondition: StandingCondition;
  legWidth: number; // cm単位の開脚幅
};

export type PatientCreateSchema = {
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
};

export type PatientSchema = {
  uuid: string;
  patientId: string;   // 表示用ID（入力 or 自動生成）
  createdAt: string;   // ISO形式（例: 2025-04-16T12:00:00.000Z）
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
};

export type RecordCreateSchema = {
  patientId: string;   // 紐づく Patient.id
  conditions: Condition[];
  videoPath: string;   // 動画ファイルのパス
};

export type RecordSchema = {
  uuid: string;
  createdAt: string;      // ISO形式
  videoPath: string;      // 動画ファイルパス or URI
  patientId: string;
  conditions: Condition[];
};

