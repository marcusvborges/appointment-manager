import { api } from './api';
import type { Doctor, Patient, PatientPlan, Procedure } from 'src/types/lookup';

export async function fetchPatients(): Promise<Patient[]> {
  const { data } = await api.get<Patient[]>('/patients');
  return data;
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const { data } = await api.get<Doctor[]>('/doctors');
  return data;
}

export async function fetchProcedures(): Promise<Procedure[]> {
  const { data } = await api.get<Procedure[]>('/procedures');
  return data;
}

export async function fetchPatientHealthPlans(patientId: string): Promise<PatientPlan[]> {
  const { data } = await api.get<PatientPlan[]>(`/patients/${patientId}/health-plans`);
  return data;
}
