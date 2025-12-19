<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="text-center">
          <q-icon name="block" size="128px" color="negative" />
          <div class="text-h3 q-mt-lg">403</div>
          <div class="text-h5 text-grey q-mt-md">Access Forbidden</div>
          <p class="text-grey q-mt-md">You don't have permission to access this page.</p>
          <div class="q-mt-lg q-gutter-sm">
            <q-btn color="primary" label="Go to Dashboard" :to="{ name: 'dashboard' }" />
            <q-btn flat label="Go Back" @click="goBack" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack(): void {
  router.back();
}
</script>
