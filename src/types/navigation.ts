import { Condition } from './models';
export type HomeStackParamList = {
  Home: undefined;
  PatientForm: undefined;
  ConditionInput: {
    patientId: string;
    patientName: string;
  };
  VideoCapture: {
    patientId: string;
    condition: Condition;
  };
  Confirm: {
    videoPath: string;
    patientId: string;
    condition: Condition;
  };
  VideoList: undefined;
};

export type PatientListStackParamList = {
  PatientList: undefined;
  PatientDetail: {
    patientId: string;
  };
};

export type VideoListStackParamList = {
  VideoList: undefined;
  VideoDetail: {
    recordId: string;
  };
};

export type TabParamList = {
  HomeTab: undefined;
  PatientsTab: undefined;
  VideosTab: undefined;
};



