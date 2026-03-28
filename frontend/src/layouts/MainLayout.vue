<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Appointment Manager</q-toolbar-title>

        <q-btn flat label="Consultas" to="/appointments" />
        <q-space />
        <q-btn flat label="Sair" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { removeAccessToken } from 'src/utils/storage';

const router = useRouter();

async function handleLogout() {
  removeAccessToken();
  await router.push('/login');
}
</script>
