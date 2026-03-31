<template>
  <q-card class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Detalhes da consulta</div>

    <q-card v-if="appointment">
      <q-card-section class="q-gutter-md">
        <div><strong>Paciente:</strong> {{ appointment.patient?.name }}</div>
        <div><strong>Médico:</strong> {{ appointment.doctor?.name }}</div>
        <div><strong>Data/Hora:</strong> {{ new Date(appointment.scheduledAt).toLocaleString('pt-BR') }}</div>
        <div><strong>Tipo:</strong> {{ appointment.isPrivate ? 'Particular' : 'Plano' }}</div>
        <div v-if="appointment.patientPlan">
          <strong>Plano:</strong>
          {{ appointment.patientPlan.healthPlan?.name }} - contrato {{ appointment.patientPlan.contractNumber }}
        </div>
        <div>
          <strong>Procedimentos:</strong>
          {{
            appointment.appointmentProcedures
              .map((item) => item.procedure?.name)
              .filter(Boolean)
              .join(', ')
          }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Voltar" color="primary" @click="goBack" />
        <q-btn flat label="Editar" color="warning" @click="goToEdit" />
      </q-card-actions>
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { fetchAppointmentById } from 'src/services/appointment.service';
import type { Appointment } from 'src/types/appointment';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const id = route.params.id as string;
const appointment = ref<Appointment | null>(null);

onMounted(async () => {
  try {
    appointment.value = await fetchAppointmentById(id);
  } catch (error: unknown) {
    notifyError(error, 'Não foi possível carregar a consulta');
    await router.push('/appointments');
  }
});

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

async function goBack() {
  await router.push('/appointments');
}

async function goToEdit() {
  await router.push(`/appointments/${id}/edit`);
}
</script>
