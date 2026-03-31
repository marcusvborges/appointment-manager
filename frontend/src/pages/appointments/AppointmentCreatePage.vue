<template>
  <q-card class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Nova consulta</div>

    <q-card>
      <q-card-section>
        <AppointmentForm v-model="form" :patients="patients" :doctors="doctors" :procedures="procedures"
          :patient-plans="patientPlans" :loading="loading" :loading-patient-plans="loadingPatientPlans"
          @submit="handleSubmit" @patient-change="handlePatientChange" />
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';
import AppointmentForm from './AppointmentForm.vue';
import { createAppointment } from 'src/services/appointment.service';
import {
  fetchDoctors,
  fetchPatients,
  fetchPatientHealthPlans,
  fetchProcedures,
} from 'src/services/lookup.service';
import type { AppointmentPayload } from 'src/types/appointment';
import type { Doctor, Patient, PatientPlan, Procedure } from 'src/types/lookup';

const router = useRouter();
const $q = useQuasar();

const loading = ref(false);
const loadingPatientPlans = ref(false);

const patients = ref<Patient[]>([]);
const doctors = ref<Doctor[]>([]);
const procedures = ref<Procedure[]>([]);
const patientPlans = ref<PatientPlan[]>([]);

const form = reactive<AppointmentPayload>({
  scheduledAt: '',
  patientId: '',
  doctorId: '',
  isPrivate: true,
  patientPlanId: undefined,
  procedureIds: [],
});

onMounted(async () => {
  await Promise.all([loadPatients(), loadDoctors(), loadProcedures()]);
});

async function loadPatients() {
  patients.value = await fetchPatients();
}

async function loadDoctors() {
  doctors.value = await fetchDoctors();
}

async function loadProcedures() {
  procedures.value = await fetchProcedures();
}

async function handlePatientChange(patientId: string) {
  loadingPatientPlans.value = true;
  try {
    patientPlans.value = await fetchPatientHealthPlans(patientId);
  } catch {
    patientPlans.value = [];
  } finally {
    loadingPatientPlans.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;

  try {
    await createAppointment({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      ...(form.isPrivate ? {} : { patientPlanId: form.patientPlanId }),
    });

    $q.notify({
      type: 'positive',
      message: 'Consulta criada com sucesso',
    });

    await router.push('/appointments');
  } catch (error: unknown) {
    notifyError(error, 'Não foi possível criar a consulta');
  } finally {
    loading.value = false;
  }
}

function notifyError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    $q.notify({
      type: 'negative',
      message: Array.isArray(message)
        ? message.join(', ')
        : typeof message === 'string'
          ? message
          : fallback,
    });

    return;
  }

  $q.notify({
    type: 'negative',
    message: fallback,
  });
}
</script>
