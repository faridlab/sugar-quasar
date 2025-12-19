<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" :to="{ name: 'users' }" />
        <div class="text-h5 q-ml-sm">User Details</div>
      </div>
      <div v-if="user" class="q-gutter-sm">
        <q-btn
          color="warning"
          icon="edit"
          label="Edit"
          :to="{ name: 'users.edit', params: { id: user.id } }"
        />
        <q-btn
          color="negative"
          icon="delete"
          label="Delete"
          :loading="isDeleting"
          @click="confirmDelete"
        />
      </div>
    </div>

    <div v-if="isLoading" class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <q-skeleton type="text" width="30%" class="q-mb-md" />
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else-if="user" class="row q-col-gutter-md">
      <!-- User Info -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">User Information</div>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Name</q-item-label>
                  <q-item-label>{{ user.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="email" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label>{{ user.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="verified_user" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Status</q-item-label>
                  <q-item-label>
                    <q-badge :color="user.isActive ? 'positive' : 'negative'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="calendar_today" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Created At</q-item-label>
                  <q-item-label>{{ user.createdAt }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Roles -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Roles</div>
            <div class="q-gutter-sm">
              <q-chip
                v-for="role in user.roles"
                :key="role.id"
                color="primary"
                text-color="white"
                icon="verified_user"
              >
                {{ role.name }}
              </q-chip>
              <div v-if="!user.roles?.length" class="text-grey">No roles assigned</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Permissions</div>
            <div class="q-gutter-sm">
              <q-chip
                v-for="permission in userPermissions"
                :key="permission"
                size="sm"
                color="secondary"
                text-color="white"
              >
                {{ permission }}
              </q-chip>
              <div v-if="!userPermissions.length" class="text-grey">No permissions</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card v-else>
      <q-card-section class="text-center text-grey">
        <q-icon name="error" size="3em" />
        <div class="q-mt-md">User not found</div>
        <q-btn flat color="primary" label="Back to Users" :to="{ name: 'users' }" class="q-mt-md" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser, useUserMutations, useNotification } from '@/presentation/composables';

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const notification = useNotification();
const { user, isLoading } = useUser(userId);
const { deleteUser, isDeleting } = useUserMutations();

const userPermissions = computed(() => {
  const permissions = new Set<string>();
  user.value?.roles?.forEach((role) => {
    role.permissions?.forEach((p) => permissions.add(p.name));
  });
  return Array.from(permissions);
});

async function confirmDelete(): Promise<void> {
  if (!user.value) return;

  const confirmed = await notification.confirm(
    `Are you sure you want to delete "${user.value.name}"?`,
    'Delete User'
  );

  if (confirmed) {
    await deleteUser(user.value.id);
    router.push({ name: 'users' });
  }
}
</script>
