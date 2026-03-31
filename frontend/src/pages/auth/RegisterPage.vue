<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card style="width: 100%; max-width: 420px">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Cadastro</div>
        <div class="text-subtitle2 text-grey-7">
          Crie seu acesso ao sistema
        </div>
      </q-card-section>

      <q-form @submit="handleSubmit">
        <q-card-section class="column q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined :disable="loading" />
          <q-input v-model="form.email" label="E-mail" type="email" outlined :disable="loading" />
          <q-input v-model="form.password" label="Senha" type="password" outlined :disable="loading" />
        </q-card-section>

        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat label="Voltar" color="primary" @click="goToLogin" />
          <q-btn color="primary" label="Cadastrar" type="submit" :loading="loading" :disable="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { register } from 'src/services/auth.service';
import axios from 'axios';

const router = useRouter();
const $q = useQuasar();

const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
});

async function handleSubmit() {
  loading.value = true;

  try {
    await register(form);

    $q.notify({
      type: 'positive',
      message: 'Cadastro realizado com sucesso',
    });

    await router.push('/login');
  } catch (error: unknown) {
    notifyError(error, 'Falha ao realizar cadastro');
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

async function goToLogin() {
  await router.push('/login');
}
</script>
