<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Users</div>
      <q-btn color="primary" icon="add" label="Add User" :to="{ name: 'users.create' }" />
    </div>

    <!-- Filters -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchText"
              dense
              outlined
              placeholder="Search users..."
              debounce="300"
              @update:model-value="handleSearch"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
              <template v-if="searchText" #append>
                <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="statusFilter"
              dense
              outlined
              :options="statusOptions"
              label="Status"
              emit-value
              map-options
              clearable
              @update:model-value="handleStatusChange"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Users Table -->
    <q-card>
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="isLoading"
        :pagination="pagination"
        @request="onRequest"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <router-link
              :to="{ name: 'users.show', params: { id: props.row.id } }"
              class="text-primary"
            >
              {{ props.row.name }}
            </router-link>
          </q-td>
        </template>

        <template #body-cell-roles="props">
          <q-td :props="props">
            <q-chip
              v-for="role in props.row.roles"
              :key="role.id"
              size="sm"
              color="primary"
              text-color="white"
            >
              {{ role.name }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-isActive="props">
          <q-td :props="props">
            <q-badge :color="props.row.isActive ? 'positive' : 'negative'">
              {{ props.row.isActive ? 'Active' : 'Inactive' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="info"
              :to="{ name: 'users.show', params: { id: props.row.id } }"
            >
              <q-tooltip>View</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="warning"
              :to="{ name: 'users.edit', params: { id: props.row.id } }"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              :loading="isDeleting"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey">
            <q-icon name="people" size="2em" class="q-mr-sm" />
            No users found
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { QTableProps } from 'quasar';
import { useUsersList, useUserMutations, useNotification } from '@/presentation/composables';
import type { UserDTO } from '@/application/dtos';

const notification = useNotification();
const { users, isLoading, total, currentPage, setPage, setSearch, setFilters } = useUsersList();
const { deleteUser, isDeleting } = useUserMutations();

const searchText = ref('');
const statusFilter = ref<string | null>(null);

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'roles', label: 'Roles', field: 'roles', align: 'left' },
  { name: 'isActive', label: 'Status', field: 'isActive', align: 'center' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
];

const pagination = computed(() => ({
  page: currentPage.value,
  rowsPerPage: 15,
  rowsNumber: total.value,
}));

function onRequest(props: { pagination: { page: number; rowsPerPage: number } }): void {
  setPage(props.pagination.page);
}

function handleSearch(value: string | number | null): void {
  setSearch(String(value ?? ''));
}

function clearSearch(): void {
  searchText.value = '';
  setSearch('');
}

function handleStatusChange(value: string | null): void {
  setFilters({ status: value as 'active' | 'inactive' | undefined });
}

async function confirmDelete(user: UserDTO): Promise<void> {
  const confirmed = await notification.confirm(
    `Are you sure you want to delete "${user.name}"?`,
    'Delete User'
  );

  if (confirmed) {
    await deleteUser(user.id);
  }
}
</script>
