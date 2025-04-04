export type RootStackParamList = {
  Home: undefined;
  PatientForm: undefined;
  VideoCapture: {
    patientName: string;
    patientAge: number;
    patientId: string;
  };
  Confirm: {
    patientName: string;
    patientAge: number;
    patientId: string;
    videoUri: string;
  };
};

export type TabParamList = {
  HomeTab: undefined;
  PatientsTab: undefined;
  VideosTab: undefined;
};



