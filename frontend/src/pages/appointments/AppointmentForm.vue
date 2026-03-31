<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="localForm.patientId"
          :options="patientOptions"
          label="Paciente"
          outlined
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :disable="loading || readonly"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="localForm.doctorId"
          :options="doctorOptions"
          label="Médico"
          outlined
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :disable="loading || readonly"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="localForm.scheduledAt"
          label="Data e hora"
          type="datetime-local"
          outlined
          :disable="loading || readonly"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-toggle
          v-model="localForm.isPrivate"
          label="Consulta particular"
          :disable="loading || readonly"
        />
      </div>

      <div class="col-12">
        <q-select
          v-model="localForm.procedureIds"
          :options="procedureOptions"
          label="Procedimentos da consulta"
          hint="Selecione os procedimentos que serão realizados nesta consulta"
          outlined
          multiple
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :disable="loading || readonly"
        />
      </div>

      <div class="col-12" v-if="!localForm.isPrivate">
        <q-select
          v-model="localForm.patientPlanId"
          :options="patientPlanOptions"
          label="Plano / vínculo"
          outlined
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :disable="loading || readonly"
          :loading="loadingPatientPlans"
        />
      </div>
    </div>

    <div v-if="!readonly" class="row justify-end">
      <q-btn color="primary" label="Salvar" type="submit" :loading="loading" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { AppointmentPayload } from 'src/types/appointment';
import type { Doctor, Patient, PatientPlan, Procedure } from 'src/types/lookup';

const props = defineProps<{
  modelValue: AppointmentPayload;
  patients: Patient[];
  doctors: Doctor[];
  procedures: Procedure[];
  patientPlans: PatientPlan[];
  loading?: boolean;
  loadingPatientPlans?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: AppointmentPayload): void;
  (e: 'submit'): void;
  (e: 'patient-change', patientId: string): void;
}>();

const localForm = reactive<AppointmentPayload>({
  scheduledAt: props.modelValue.scheduledAt,
  patientId: props.modelValue.patientId,
  doctorId: props.modelValue.doctorId,
  isPrivate: props.modelValue.isPrivate,
  patientPlanId: props.modelValue.patientPlanId,
  procedureIds: [...props.modelValue.procedureIds],
});

watch(
  () => props.modelValue,
  (value) => {
    localForm.scheduledAt = value.scheduledAt;
    localForm.patientId = value.patientId;
    localForm.doctorId = value.doctorId;
    localForm.isPrivate = value.isPrivate;
    localForm.patientPlanId = value.patientPlanId;
    localForm.procedureIds = value.procedureIds;
  },
  { deep: true },
);

watch(
  () => localForm.patientId,
  (patientId) => {
    emitForm();
    if (patientId) {
      emit('patient-change', patientId);
    }
  },
);

watch(
  () => localForm.isPrivate,
  (isPrivate) => {
    if (isPrivate) {
      localForm.patientPlanId = undefined;
    }
    emitForm();
  },
);

watch(
  () => [localForm.doctorId, localForm.scheduledAt, localForm.patientPlanId, localForm.procedureIds],
  () => emitForm(),
  { deep: true },
);

const patientOptions = computed(() =>
  props.patients.map((patient) => ({
    label: patient.name,
    value: patient.id,
  })),
);

const doctorOptions = computed(() =>
  props.doctors.map((doctor) => ({
    label: `${doctor.name} - ${doctor.specialty?.name ?? 'Sem especialidade'}`,
    value: doctor.id,
  })),
);

const procedureOptions = computed(() =>
  props.procedures.map((procedure) => ({
    label: procedure.price != null
      ? `${procedure.name} - R$ ${Number(procedure.price).toFixed(2)}`
      : procedure.name,
    value: procedure.id,
  })),
);

const patientPlanOptions = computed(() =>
  props.patientPlans.map((item) => ({
    label: `${item.healthPlan?.name || 'Plano'} - contrato ${item.contractNumber}`,
    value: item.id,
  })),
);

function emitForm() {
  emit('update:modelValue', {
    scheduledAt: localForm.scheduledAt,
    patientId: localForm.patientId,
    doctorId: localForm.doctorId,
    isPrivate: localForm.isPrivate,
    patientPlanId: localForm.patientPlanId,
    procedureIds: [...localForm.procedureIds],
  });
}

function onSubmit() {
  emit('submit');
}
</script>
