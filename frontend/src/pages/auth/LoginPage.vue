<template>
  <q-page class="row items-center justify-center q-pa-md">
    <div style="width: 100%; max-width: 400px">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-weight-bold">Login</div>
          <div class="text-subtitle2 text-grey-7">Acesse o sistema de agendamento de consultas</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.email" label="E-mail" type="email" outlined :disable="loading" />

          <q-input
            v-model="form.password"
            label="Senha"
            type="password"
            outlined
            :disable="loading"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Entrar" :loading="loading" @click="handleSubmit" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { login } from 'src/services/auth.service';
import { setAccessToken } from 'src/utils/storage';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  email: '',
  password: '',
});

async function handleSubmit() {
  try {
    loading.value = true;

    const response = await login({
      email: form.email,
      password: form.password,
    });

    setAccessToken(response.accessToken);

    Notify.create({
      type: 'positive',
      message: 'Login realizado com sucesso',
    });

    await router.push('/appointments');
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Credenciais inválidas',
    });
  } finally {
    loading.value = false;
  }
}
</script>
