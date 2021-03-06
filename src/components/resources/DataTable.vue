<template>
  <q-table
    :title="collectionName"
    :data="data"
    :columns="columns"
    row-key="id"
    :pagination.sync="pagination"
    :rows-per-page-options="pageOptions"
    :loading="loading"
    :filter="filter"
    @request="onRequest"
    binary-state-sort
    :selected-rows-label="getSelectedString"
    selection="multiple"
    :selected.sync="selected"
  >
    <template v-slot:top-right>

      <q-btn flat round dense icon="visibility" class="q-mr-sm" v-if="selected.length==1&&isStateFormEntries" @click="showSelected()" />
      <q-btn flat round dense icon="create" class="q-mr-sm" v-if="selected.length==1&&isStateFormEntries" @click="editSelected()" />
      <q-separator vertical inset v-if="selected.length==1&&isStateFormEntries" />
      <q-btn flat round dense icon="delete" class="q-mr-sm q-ml-sm" color="negative"  v-if="selected.length>=1&&isStateFormEntries" @click="deleteSelected()" />

      <q-btn flat rounded dense icon="visibility" class="q-mr-sm" v-if="selected.length==1&&isStateFormTrash" @click="showSelected()" />
      <q-separator vertical inset v-if="selected.length==1&&isStateFormTrash" />
      <q-btn flat rounded dense icon="restore_from_trash" class="q-mr-sm q-ml-sm" v-if="selected.length>=1&&isStateFormTrash" @click="restoreSelected()"/>
      <q-btn flat rounded dense icon="delete_forever" class="q-mr-sm" color="negative"  v-if="selected.length>=1&&isStateFormTrash" @click="deleteSelected()" />

      <q-input filled dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body-cell-action="props">
      <q-td v-if="isStateFormEntries" :props="props">
        <q-btn flat round dense icon="more_vert">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <q-list>
              <q-item clickable v-close-popup tabindex="0" :to="`${collection}/${props.row.id}`">
                <q-item-section avatar>
                  <q-avatar icon="remove_red_eye" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Detail</q-item-label>
                  <q-item-label caption>Detail Record</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup tabindex="0" :to="`${collection}/${props.row.id}/edit`">
                <q-item-section avatar>
                  <q-avatar icon="edit" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Edit</q-item-label>
                  <q-item-label caption>Edit Record</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator inset spaced />
              <q-item clickable v-close-popup tabindex="0" @click="confirmDelete(props.row.id)">
                <q-item-section avatar>
                  <q-avatar icon="delete" color="negative" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Delete</q-item-label>
                  <q-item-label caption>Delete this record</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-td>
      <q-td v-if="isStateFormTrash" :props="props">
        <q-btn flat round dense icon="more_vert">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <q-list>
              <q-item clickable v-close-popup tabindex="0" :to="`/${collection}/${props.row.id}/trashed`">
                <q-item-section avatar>
                  <q-avatar icon="remove_red_eye" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Detail</q-item-label>
                  <q-item-label caption>Detail Record</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup tabindex="0" @click="confirmRestore(props.row.id)">
                <q-item-section avatar>
                  <q-avatar icon="restore_from_trash" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Restore</q-item-label>
                  <q-item-label caption>Restore</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator inset spaced />
              <q-item clickable v-close-popup tabindex="0" @click="confirmDelete(props.row.id)">
                <q-item-section avatar>
                  <q-avatar icon="delete" color="negative" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Delete</q-item-label>
                  <q-item-label caption>Delete forever</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-td>
    </template>

    <!-- Pass on all named slots -->
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
    <!-- Pass on all scoped slots -->
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>
  </q-table>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    collection: {
      type: String,
      default: () => ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    params: {
      type: Object,
      default: () => {}
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    destroy: {
      type: Function,
      default: () => {}
    },
    stateForm: {
      type: String,
      default: () => 'entries'
    },
    trash: {
      type: Function,
      default: () => {}
    },
    restore: {
      type: Function,
      default: () => {}
    },
    stateData: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      selected: [],
      selectedRow: null,
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 25, // limit default set 25
        rowsNumber: 0 // total records
      },
      pageOptions: [5, 10, 25, 50, 100],
      data: []
    }
  },
  mounted () {
    const pagination = this.pagination
    const filter = this.filter
    this.onRequest({ pagination, filter })
  },
  watch: {
    stateData: function (newVal, oldVal) {
      const pagination = this.pagination
      const filter = this.filter
      this.onRequest({ pagination, filter })
    },
    collection: function (newVal, oldVal) {
      this.collection = newVal
      const pagination = this.pagination
      const filter = this.filter
      this.data = []
      this.onRequest({ pagination, filter })
    }
  },
  methods: {
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      const params = {
        ...this.params,
        search: filter,
        page: page,
        limit: rowsPerPage,
        orderBy: {
          [sortBy]: descending ? 'desc' : 'asc'
        }
      }

      this.loading = true
      this.fetch({ params }).then((response) => {
        const { data, meta } = response
        this.data = data
        this.pagination.rowsNumber = meta.totalRecords

        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending
        this.loading = false
      }).catch(error => {
        if (error.response) {
          const { data } = error.response
          this.$q.dialog({
            title: `${data.status}`,
            message: `${data.message}`,
            ok: {
              flat: true
            },
            persistent: true
          })
        }
        this.loading = false
      })
    },

    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },

    getSelectedRows () {
      return this.selected.length
    },

    confirmDelete (id) {
      this.$q.dialog({
        title: 'Delete',
        message: 'Are you sure to delete?',
        ok: {
          label: 'Delete',
          color: 'negative',
          flat: true
        },
        cancel: {
          label: 'Cancel',
          color: 'white',
          textColor: 'black',
          flat: true

        },
        persistent: true
      }).onOk(() => {
        this.destroy({
          type: id,
          params: {}
        }).then((response) => {
          const { status, message } = response
          this.$q.dialog({
            title: `${status}`,
            message: `${message}`,
            ok: {
              flat: true
            },
            persistent: true
          }).onOk(() => {
            const pagination = this.pagination
            const filter = this.filter
            this.onRequest({ pagination, filter })
          })
        }).catch(error => {
          if (error.response) {
            const { data } = error.response
            this.$q.dialog({
              title: `${data.status}`,
              message: `${data.message}`,
              ok: {
                flat: true
              },
              persistent: true
            })
          }
          this.loading = false
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    showSelected () {
      const data = this.selected[0]
      this.$router.push(`${this.collection}/${data.id}`)
    },
    editSelected () {
      const data = this.selected[0]
      this.$router.push(`${this.collection}/${data.id}/edit`)
    },
    deleteSelected () {
      const ids = []
      for (const item of this.selected) {
        ids.push(item.id)
      }
      this.$q.dialog({
        title: 'Delete',
        message: 'Are you sure to delete?',
        ok: {
          label: 'Delete',
          color: 'negative',
          flat: true
        },
        cancel: {
          label: 'Cancel',
          color: 'white',
          textColor: 'black',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.destroy({
          type: 'selected',
          data: {
            selected: ids
          }
        }).then((response) => {
          const { status, message } = response
          this.$q.dialog({
            title: `${status}`,
            message: `${message}`,
            ok: {
              flat: true
            },
            persistent: true
          }).onOk(() => {
            const pagination = this.pagination
            const filter = this.filter
            this.onRequest({ pagination, filter })
          })
        }).catch(error => {
          if (error.response) {
            const { data } = error.response
            this.$q.dialog({
              title: `${data.status}`,
              message: `${data.message}`,
              ok: {
                flat: true
              },
              persistent: true
            })
          }
          this.loading = false
        })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    confirmRestore (id) {
      this.$q.dialog({
        title: 'Restore',
        message: 'Are you sure to restore?',
        ok: {
          label: 'Restore',
          color: 'secondary',
          flat: true
        },
        cancel: {
          label: 'Cancel',
          color: 'white',
          textColor: 'black',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.restore({
          type: id,
          params: {}
        }).then((response) => {
          const { status, message } = response
          this.$q.dialog({
            title: `${status}`,
            message: `${message}`,
            ok: {
              flat: true
            },
            persistent: true
          }).onOk(() => {
            const pagination = this.pagination
            const filter = this.filter
            this.onRequest({ pagination, filter })
          })
        }).catch(error => {
          if (error.response) {
            const { data } = error.response
            this.$q.dialog({
              title: `${data.status}`,
              message: `${data.message}`,
              ok: {
                flat: true
              },
              persistent: true
            })
          }
          this.loading = false
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    restoreSelected () {
      const ids = []
      for (const item of this.selected) {
        ids.push(item.id)
      }

      this.$q.dialog({
        title: 'Restore',
        message: 'Are you sure to restore?',
        ok: {
          label: 'Restore',
          color: 'secondary',
          flat: true
        },
        cancel: {
          label: 'Cancel',
          color: 'white',
          textColor: 'black',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.restore({
          type: 'selected',
          data: {
            selected: ids
          }
        }).then((response) => {
          const { status, message } = response
          this.$q.dialog({
            title: `${status}`,
            message: `${message}`,
            ok: {
              flat: true
            },
            persistent: true
          }).onOk(() => {
            const pagination = this.pagination
            const filter = this.filter
            this.onRequest({ pagination, filter })
          })
        }).catch(error => {
          if (error.response) {
            const { data } = error.response
            this.$q.dialog({
              title: `${data.status}`,
              message: `${data.message}`,
              ok: {
                flat: true
              },
              persistent: true
            })
          }
          this.loading = false
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  computed: {
    collectionName () {
      const words = this.collection.split('_')
      const titles = []
      for (const key in words) {
        const word = words[key]
        titles.push(word.charAt(0).toUpperCase() + word.slice(1))
      }
      return titles.join(' ')
    },
    isStateFormEntries () {
      return this.stateForm === 'entries'
    },
    isStateFormTrash () {
      return this.stateForm === 'trash'
    }
  }
}
</script>
