<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Welcome Card -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h5">Welcome back, {{ userFullName }}!</div>
            <div class="text-subtitle2 text-grey">{{ userEmail }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Stats Cards -->
      <div class="col-12 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Users</div>
            <div class="text-h3">{{ stats.users }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Roles</div>
            <div class="text-h3">{{ stats.roles }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Permissions</div>
            <div class="text-h3">{{ stats.permissions }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Active Sessions</div>
            <div class="text-h3">{{ stats.sessions }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Quick Actions</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="person_add"
                label="Add User"
                :to="{ name: 'users.create' }"
              />
              <q-btn color="secondary" icon="people" label="View Users" :to="{ name: 'users' }" />
              <q-btn color="accent" icon="person" label="My Profile" :to="{ name: 'profile' }" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- User Info -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Your Roles</div>
          </q-card-section>
          <q-card-section>
            <q-chip
              v-for="role in userRoles"
              :key="role.id"
              color="primary"
              text-color="white"
              icon="verified_user"
            >
              {{ role.name }}
            </q-chip>
            <div v-if="userRoles.length === 0" class="text-grey">No roles assigned</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useAuth } from '@/presentation/composables';

const { user, userFullName, userEmail } = useAuth();

const userRoles = computed(() => user.value?.roles ?? []);

// Mock stats - in real app, fetch from API
const stats = reactive({
  users: 150,
  roles: 5,
  permissions: 24,
  sessions: 42,
});
</script>
