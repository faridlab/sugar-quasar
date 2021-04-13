import { required } from '@vuelidate/validators'
import state from '../resources/state'
export const collection = 'countries'
export const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    format: (val, row) => `${row.first_name} ${row.last_name}`,
    sortable: true
  },
  {
    name: 'username',
    align: 'left',
    label: 'Username',
    field: 'username',
    sortable: true
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true
  },
  {
    name: 'phone',
    align: 'left',
    label: 'Phone',
    field: 'phone',
    sortable: true,
    format: (val, row) => val || ' - '
  },
  // Always give this columns as default
  {
    name: 'action',
    label: null,
    field: 'key'
  }
]

export const form = {
  isocode: null,
  name: null,
  phonecode: null
}

export const layout = [
  [
    {
      type: 'QInput',
      col: 'col-2',
      name: 'isocode',
      label: 'ISO Code',
      props: {
        maxlength: 2
      },
      events: {}
    },
    {
      type: 'QInput',
      col: 'col-6',
      name: 'name',
      label: 'Country Name',
      props: {
        maxlength: 50
      },
      events: {}
    },
    {
      type: 'QInput',
      col: 'col-2',
      name: 'phonecode',
      label: 'Phone Code',
      props: {
        maxlength: 3
      },
      events: {}
    }
  ]
]

export const validation = {
  isocode: {
    required
  },
  name: {
    required
  },
  phonecode: {
    required
  }
}

export default function () {
  return {
    ...state(),
    // Collection name
    collection,
    // Datatable config
    columns,
    form,
    layout,
    validation
  }
}