export type AppState = 'idle' | 'recording' | 'processing' | 'complete' | 'showing-summary' | 'editing';

export interface Patient {
  id: string;
  name: string;
  room: string;
  avatar: string;
  isUrgent?: boolean;
  lastVisit: string;
  condition: string;
}

export interface Report {
  id: string;
  title: string;
  patientName: string;
  patientId: string;
  type: 'Assessment' | 'Lab Report' | 'Treatment' | 'Discharge' | 'Follow-up';
  date: string;
  generatedBy: 'AI Assistant' | 'Manual Entry';
  status: 'Generated' | 'Reviewed' | 'Approved';
}
