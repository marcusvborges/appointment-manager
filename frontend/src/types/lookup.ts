export interface Specialty {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialtyId: string;
  specialty?: Specialty;
}

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
}

export interface HealthPlan {
  id: string;
  name: string;
  phone: string;
}

export interface PatientPlan {
  id: string;
  patientId: string;
  healthPlanId: string;
  contractNumber: string;
  patient?: Patient;
  healthPlan?: HealthPlan;
}

export interface Procedure {
  id: string;
  name: string;
  price?: number | null;
}
