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
            <div class="text-subtitle1 text-grey">Sign in to your account</div>
          </q-card-section>

          <q-card-section>
            <q-banner v-if="authError" class="text-white bg-negative q-mb-md" rounded>
              {{ authError }}
            </q-banner>

            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.email"
                type="email"
                label="Email"
                outlined
                :error="!!errors.email"
                :error-message="errors.email"
                @update:model-value="clearFieldError('email')"
              >
                <template #prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                outlined
                :error="!!errors.password"
                :error-message="errors.password"
                @update:model-value="clearFieldError('password')"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <div class="row items-center justify-between">
                <q-checkbox v-model="form.rememberMe" label="Remember me" />
                <a href="#" class="text-primary">Forgot password?</a>
              </div>

              <q-btn
                type="submit"
                color="primary"
                label="Sign In"
                class="full-width"
                size="lg"
                :loading="isLoading"
                :disable="isLoading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuth, useNotification } from '@/presentation/composables';
import { loginCommandSchema } from '@/application/commands/auth/LoginCommand';

const { login, isLoading, error: authError, clearError } = useAuth();
const notification = useNotification();

const showPassword = ref(false);

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const errors = reactive<Record<string, string>>({});

const formAsCommand = computed(() => ({
  email: form.email,
  password: form.password,
  rememberMe: form.rememberMe,
}));

function clearFieldError(field: string): void {
  if (errors[field]) {
    delete errors[field];
  }
  clearError();
}

function validateForm(): boolean {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validate using Zod schema
  const result = loginCommandSchema.safeParse(formAsCommand.value);

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0];
      if (typeof field === 'string') {
        errors[field] = err.message;
      }
    });
    return false;
  }

  return true;
}

async function onSubmit(): Promise<void> {
  if (!validateForm()) {
    return;
  }

  const success = await login(formAsCommand.value, '/');

  if (success) {
    notification.success('Login successful');
  }
}

onMounted(() => {
  clearError();
});
</script>
