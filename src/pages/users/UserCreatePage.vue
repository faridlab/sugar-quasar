<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <q-btn flat round icon="arrow_back" :to="{ name: 'users' }" />
      <div class="text-h5 q-ml-sm">Create User</div>
    </div>

    <q-card style="max-width: 600px">
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Name"
            outlined
            :error="!!errors.name"
            :error-message="errors.name"
          />

          <q-input
            v-model="form.email"
            type="email"
            label="Email"
            outlined
            :error="!!errors.email"
            :error-message="errors.email"
          />

          <q-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            outlined
            :error="!!errors.password"
            :error-message="errors.password"
          >
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
          />

          <q-select
            v-model="form.roleIds"
            label="Roles"
            outlined
            multiple
            :options="roleOptions"
            emit-value
            map-options
            use-chips
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancel" :to="{ name: 'users' }" />
            <q-btn type="submit" color="primary" label="Create User" :loading="isCreating" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { useUserMutations } from '@/presentation/composables';

const router = useRouter();
const { createUser, isCreating } = useUserMutations();

const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  roleIds: [] as string[],
});

const errors = reactive<Record<string, string>>({});

// Mock role options - in real app, fetch from API
const roleOptions = [
  { label: 'Administrator', value: '1' },
  { label: 'Manager', value: '2' },
  { label: 'User', value: '3' },
];

const createUserSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string(),
    roleIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  const result = createUserSchema.safeParse(form);
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

  try {
    await createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      passwordConfirmation: form.passwordConfirmation,
      roleIds: form.roleIds,
    });
    router.push({ name: 'users' });
  } catch {
    // Error handled by mutation
  }
}
</script>
