import state from '../resources/state'
export const collection = 'countries'
export const columns = [
  {
    name: 'isocode',
    required: true,
    label: 'ISO Code ',
    align: 'left',
    field: 'isocode',
    format: (val) => val,
    sortable: false // FIXME: sortable off for temporary
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    format: (val) => val,
    sortable: false // FIXME: sortable off for temporary
  },
  {
    name: 'phonecode',
    required: true,
    label: 'Phone Code',
    align: 'left',
    field: 'phonecode',
    format: (val) => val,
    sortable: false // FIXME: sortable off for temporary
  },
  // Always give this columns as default
  {
    name: 'action',
    label: null,
    field: 'key'
  }
]

export default function () {
  return {
    ...state(),
    // Collection name
    collection,
    // Datatable config
    columns
  }
}
