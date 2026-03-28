export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  isPrivate: boolean;
  patientPlanId?: string | null;
}
