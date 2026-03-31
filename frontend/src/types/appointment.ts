import type { Doctor, Patient, PatientPlan, Procedure } from './lookup';

export interface Appointment {
  id: string;
  scheduledAt: string;
  patientId: string;
  doctorId: string;
  patientPlanId?: string | null;
  isPrivate: boolean;
  patient: Patient;
  doctor: Doctor;
  patientPlan?: PatientPlan | null;
  appointmentProcedures: AppointmentProcedure[];
}

export interface AppointmentProcedure {
  id: string;
  appointmentId: string;
  procedureId: string;
  procedure: Procedure;
}

export interface AppointmentPayload {
  scheduledAt: string;
  patientId: string;
  doctorId: string;
  isPrivate: boolean;
  patientPlanId?: string | undefined;
  procedureIds: string[];
}

export interface AppointmentFilters {
  date?: string;
  doctorId?: string;
  patientId?: string;
}
