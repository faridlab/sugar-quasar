<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">My Profile</div>

    <div class="row q-col-gutter-md">
      <!-- Profile Info -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Profile Information</div>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="64px">
                    {{ userInitials }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6">{{ userFullName }}</q-item-label>
                  <q-item-label caption>{{ userEmail }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Roles & Permissions -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">My Roles</div>
            <div class="q-gutter-sm">
              <q-chip
                v-for="role in userRoles"
                :key="role.id"
                color="primary"
                text-color="white"
                icon="verified_user"
              >
                {{ role.name }}
              </q-chip>
              <div v-if="!userRoles.length" class="text-grey">No roles assigned</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Update Profile Form -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Update Profile</div>
            <q-form @submit.prevent="updateProfile" class="q-gutter-md">
              <q-input v-model="profileForm.name" label="Name" outlined />
              <q-input v-model="profileForm.email" type="email" label="Email" outlined disabled />
              <q-btn type="submit" color="primary" label="Update Profile" :loading="isUpdating" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Change Password Form -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Change Password</div>
            <q-form @submit.prevent="changePassword" class="q-gutter-md">
              <q-input
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                label="Current Password"
                outlined
              >
                <template #append>
                  <q-icon
                    :name="showCurrentPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showCurrentPassword = !showCurrentPassword"
                  />
                </template>
              </q-input>
              <q-input
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                label="New Password"
                outlined
              >
                <template #append>
                  <q-icon
                    :name="showNewPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </q-input>
              <q-input
                v-model="passwordForm.confirmPassword"
                :type="showNewPassword ? 'text' : 'password'"
                label="Confirm New Password"
                outlined
              />
              <q-btn
                type="submit"
                color="primary"
                label="Change Password"
                :loading="isChangingPassword"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useAuth, useNotification } from '@/presentation/composables';

const { user, userFullName, userEmail } = useAuth();
const notification = useNotification();

const isUpdating = ref(false);
const isChangingPassword = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

const userRoles = computed(() => user.value?.roles ?? []);
const userInitials = computed(() => {
  const name = userFullName.value;
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const profileForm = reactive({
  name: '',
  email: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      profileForm.name = newUser.name;
      profileForm.email = newUser.email;
    }
  },
  { immediate: true }
);

async function updateProfile(): Promise<void> {
  isUpdating.value = true;
  try {
    // TODO: Implement profile update API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notification.success('Profile updated successfully');
  } catch {
    notification.error('Failed to update profile');
  } finally {
    isUpdating.value = false;
  }
}

async function changePassword(): Promise<void> {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    notification.error('Passwords do not match');
    return;
  }

  isChangingPassword.value = true;
  try {
    // TODO: Implement password change API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notification.success('Password changed successfully');
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch {
    notification.error('Failed to change password');
  } finally {
    isChangingPassword.value = false;
  }
}
</script>
