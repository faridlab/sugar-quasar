import { useQuasar } from 'quasar'
import { toRefs, ref } from 'vue'
export default function useDatatableRepositories(props) {

  const $q = useQuasar()
  const { fetch, params } = props
  const rows = ref([])
  const filter = ref('')
  let loading = ref(false)
  const pagination = ref({
    sortBy: 'id',
    descending: true,
    page: 1,
    rowsPerPage: 10, // limit default set 25
    rowsNumber: 0 // total records
  })
  const pageOptions = ref([5, 10, 25, 50, 100])

  const onRequest = async ({ filters, pagination }) => {
    const { page, rowsPerPage, sortBy, descending } = pagination
    let filter = {}
    if(filters) {
      filter = { ...filters }
    }
    const search = filter
    const parameters = {
      ...params,
      ...filter,
      // search,
      page: page,
      limit: rowsPerPage,
      // [`orderby[${sortBy}]`]: descending ? 'desc' : 'asc'
    }

    const orderby = Object.keys(parameters).find((index, item) => index.startsWith("orderby"))
    if(!orderby && sortBy) {
      parameters[[`orderby[${sortBy}]`]] = descending ? 'desc' : 'asc'
    }

    loading = true
    fetch({ params: parameters }).then((response) => {
      const { data, meta } = response
      pagination.rowsNumber = meta.recordsFiltered
      pagination.page = page
      pagination.rowsPerPage = rowsPerPage
      pagination.sortBy = sortBy
      pagination.descending = descending
      rows.value = data
      loading = false
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
      loading = false
    })
  }

  return {
    rows,
    filter,
    loading,
    pagination,
    pageOptions,
    onRequest
  }
}
