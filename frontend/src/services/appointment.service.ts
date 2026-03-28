import { api } from './api';
import type { Appointment } from 'src/types/appointment';

interface AppointmentFilters {
  date?: string;
  doctorId?: string;
  patientId?: string;
}

export async function fetchAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>('/appointments', {
    params: filters,
  });

  return data;
}
