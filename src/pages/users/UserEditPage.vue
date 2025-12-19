<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <q-btn flat round icon="arrow_back" :to="{ name: 'users' }" />
      <div class="text-h5 q-ml-sm">Edit User</div>
    </div>

    <q-card v-if="isLoading" style="max-width: 600px">
      <q-card-section>
        <q-skeleton type="text" class="q-mb-md" />
        <q-skeleton type="text" class="q-mb-md" />
        <q-skeleton type="text" class="q-mb-md" />
        <q-skeleton type="text" />
      </q-card-section>
    </q-card>

    <q-card v-else-if="user" style="max-width: 600px">
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
            label="New Password (leave empty to keep current)"
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
            label="Confirm New Password"
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

          <q-toggle v-model="form.isActive" label="Active" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancel" :to="{ name: 'users' }" />
            <q-btn type="submit" color="primary" label="Update User" :loading="isUpdating" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card v-else style="max-width: 600px">
      <q-card-section class="text-center text-grey">
        <q-icon name="error" size="3em" />
        <div class="q-mt-md">User not found</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { useUser, useUserMutations } from '@/presentation/composables';

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const { user, isLoading } = useUser(userId);
const { updateUser, isUpdating } = useUserMutations();

const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  roleIds: [] as string[],
  isActive: true,
});

const errors = reactive<Record<string, string>>({});

// Mock role options - in real app, fetch from API
const roleOptions = [
  { label: 'Administrator', value: '1' },
  { label: 'Manager', value: '2' },
  { label: 'User', value: '3' },
];

// Populate form when user data loads
watch(
  user,
  (newUser) => {
    if (newUser) {
      form.name = newUser.name;
      form.email = newUser.email;
      form.roleIds = newUser.roles?.map((r) => r.id) ?? [];
      form.isActive = newUser.isActive ?? true;
    }
  },
  { immediate: true }
);

const updateUserSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    passwordConfirmation: z.string().optional().or(z.literal('')),
    roleIds: z.array(z.string()).optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.passwordConfirmation;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }
  );

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);

  const result = updateUserSchema.safeParse(form);
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
    await updateUser({
      id: userId,
      data: {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        passwordConfirmation: form.passwordConfirmation || undefined,
        roleIds: form.roleIds,
        isActive: form.isActive,
      },
    });
    router.push({ name: 'users' });
  } catch {
    // Error handled by mutation
  }
}
</script>
