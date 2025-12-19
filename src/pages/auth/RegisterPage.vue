<template>
  <q-layout>
    <q-page-container>
      <q-page
        class="flex flex-center"
        style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
      >
        <q-card class="q-pa-lg" style="width: 450px; max-width: 90vw">
          <q-card-section class="text-center">
            <div class="text-h5 q-mb-md">Sugar Quasar</div>
            <div class="text-subtitle1 text-grey">Create your account</div>
          </q-card-section>

          <q-card-section>
            <q-banner v-if="error" class="text-white bg-negative q-mb-md" rounded>
              {{ error }}
            </q-banner>

            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.name"
                label="Full Name"
                outlined
                :error="!!errors.name"
                :error-message="errors.name"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="form.email"
                type="email"
                label="Email"
                outlined
                :error="!!errors.email"
                :error-message="errors.email"
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

              <q-input
                v-model="form.passwordConfirmation"
                :type="showPassword ? 'text' : 'password'"
                label="Confirm Password"
                outlined
                :error="!!errors.passwordConfirmation"
                :error-message="errors.passwordConfirmation"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-btn
                type="submit"
                color="primary"
                label="Create Account"
                class="full-width"
                size="lg"
                :loading="isLoading"
                :disable="isLoading"
              />
            </q-form>
          </q-card-section>

          <q-card-section class="text-center">
            <span class="text-grey">Already have an account? </span>
            <router-link to="/login" class="text-primary">Sign in</router-link>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth, useNotification } from '@/presentation/composables';
import { registerCommandSchema } from '@/application/commands/auth/RegisterCommand';

const { register, isLoading, error } = useAuth();
const notification = useNotification();

const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const errors = reactive<Record<string, string>>({});

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  const result = registerCommandSchema.safeParse(form);
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
  if (!validate()) return;

  const success = await register(form, '/');
  if (success) {
    notification.success('Account created successfully');
  }
}
</script>
