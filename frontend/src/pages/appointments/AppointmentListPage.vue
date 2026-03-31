<template>
  <q-card bordered class="q-pa-sm">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold q-mb-sm">Consultas</div>
        <div class="text-subtitle2 text-grey-6">Gerencie seus agendamentos</div>
      </div>

      <q-btn color="primary" icon="add" label="Nova consulta" unelevated @click="goToCreate" />
    </div>

    <q-card>
      <q-card-section>
        <q-table :rows="rows" :columns="columns" row-key="id" :loading="loading" flat bordered>
          <template #body-cell-isPrivate="props">
            <q-td :props="props">
              <q-badge :color="props.row.isPrivate ? 'orange' : 'green'">
                {{ props.row.isPrivate ? 'Particular' : 'Plano' }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row q-gutter-sm justify-end">
                <q-btn dense flat round icon="visibility" color="primary" @click="goToDetails(props.row.id)" />
                <q-btn dense flat round icon="edit" color="warning" @click="goToEdit(props.row.id)" />
                <q-btn dense flat round icon="delete" color="negative" @click="handleDelete(props.row.id)" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, type QTableColumn } from 'quasar';
import axios from 'axios';
import { fetchAppointments, deleteAppointment } from 'src/services/appointment.service';
import type { Appointment } from 'src/types/appointment';

const router = useRouter();
const $q = useQuasar();

const loading = ref(false);
const appointments = ref<Appointment[]>([]);

const columns: QTableColumn[] = [
  { name: 'scheduledAt', label: 'Data/Hora', field: 'scheduledAt', align: 'left' },
  { name: 'patient', label: 'Paciente', field: 'patient', align: 'left' },
  { name: 'doctor', label: 'Médico', field: 'doctor', align: 'left' },
  { name: 'procedures', label: 'Procedimentos', field: 'procedures', align: 'left' },
  { name: 'isPrivate', label: 'Tipo', field: 'isPrivate', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

const rows = computed(() =>
  appointments.value.map((item) => ({
    id: item.id,
    scheduledAt: new Date(item.scheduledAt).toLocaleString('pt-BR'),
    patient: item.patient?.name || '-',
    doctor: item.doctor?.name || '-',
    procedures:
      item.appointmentProcedures
        ?.map((ap) => ap.procedure?.name)
        .filter((name): name is string => Boolean(name))
        .join(', ') || '-',
    isPrivate: item.isPrivate,
  })),
);

onMounted(() => {
  void loadAppointments();
});

async function loadAppointments() {
  loading.value = true;
  try {
    appointments.value = await fetchAppointments();
  } catch (error: unknown) {
    notifyError(error, 'Não foi possível carregar as consultas');
  } finally {
    loading.value = false;
  }
}

function handleDelete(id: string) {
  $q
    .dialog({
      title: 'Confirmar exclusão',
      message: 'Deseja realmente excluir esta consulta?',
      cancel: true,
      persistent: true,
    })
    .onOk(() => {
      void removeAppointment(id);
    });
}

async function removeAppointment(id: string) {
  try {
    await deleteAppointment(id);
    $q.notify({
      type: 'positive',
      message: 'Consulta removida com sucesso',
    });
    await loadAppointments();
  } catch (error: unknown) {
    notifyError(error, 'Não foi possível excluir a consulta');
  }
}

async function goToCreate() {
  await router.push('/appointments/new');
}

async function goToDetails(id: string) {
  await router.push(`/appointments/${id}`);
}

async function goToEdit(id: string) {
  await router.push(`/appointments/${id}/edit`);
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
