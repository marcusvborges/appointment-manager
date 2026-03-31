import { api } from './api';
import type { Appointment, AppointmentFilters, AppointmentPayload } from 'src/types/appointment';

export async function fetchAppointments(
  filters?: AppointmentFilters,
): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>('/appointments', {
    params: filters,
  });

  return data;
}

export async function fetchAppointmentById(id: string): Promise<Appointment> {
  const { data } = await api.get<Appointment>(`/appointments/${id}`);
  return data;
}

export async function createAppointment(
  payload: AppointmentPayload,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>('/appointments', payload);
  return data;
}

export async function updateAppointment(
  id: string,
  payload: AppointmentPayload,
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/appointments/${id}`, payload);
  return data;
}

export async function deleteAppointment(
  id: string,
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/appointments/${id}`);
  return data;
}
