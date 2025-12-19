<template>
  <q-layout>
    <q-page-container>
      <q-page
        class="flex flex-center"
        style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
      >
        <q-card class="q-pa-lg" style="width: 400px; max-width: 90vw">
          <q-card-section class="text-center">
            <div class="text-h5 q-mb-md">Sugar Quasar</div>
            <div class="text-subtitle1 text-grey">Reset your password</div>
          </q-card-section>

          <q-card-section v-if="!emailSent">
            <q-banner v-if="error" class="text-white bg-negative q-mb-md" rounded>
              {{ error }}
            </q-banner>

            <p class="text-grey q-mb-md">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              <q-input
                v-model="email"
                type="email"
                label="Email"
                outlined
                :error="!!emailError"
                :error-message="emailError"
              >
                <template #prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-btn
                type="submit"
                color="primary"
                label="Send Reset Link"
                class="full-width"
                size="lg"
                :loading="isLoading"
              />
            </q-form>
          </q-card-section>

          <q-card-section v-else class="text-center">
            <q-icon name="mark_email_read" size="64px" color="positive" />
            <div class="text-h6 q-mt-md">Check your email</div>
            <p class="text-grey">
              We've sent a password reset link to <strong>{{ email }}</strong>
            </p>
            <q-btn flat color="primary" label="Send again" @click="emailSent = false" />
          </q-card-section>

          <q-card-section class="text-center">
            <router-link to="/login" class="text-primary">Back to Sign in</router-link>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useNotification } from '@/presentation/composables';

const notification = useNotification();

const email = ref('');
const emailError = ref('');
const error = ref('');
const isLoading = ref(false);
const emailSent = ref(false);

const emailSchema = z.string().email('Please enter a valid email');

async function onSubmit(): Promise<void> {
  emailError.value = '';
  error.value = '';

  const result = emailSchema.safeParse(email.value);
  if (!result.success) {
    emailError.value = result.error.errors[0]?.message ?? 'Invalid email';
    return;
  }

  isLoading.value = true;
  try {
    // TODO: Implement forgot password API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    emailSent.value = true;
    notification.success('Password reset email sent');
  } catch {
    error.value = 'Failed to send reset email. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>
