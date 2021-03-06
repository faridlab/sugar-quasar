import state from '../resources/state'
export const collection = 'schemes'
export const columns = []
export const form = {}
export const layout = []
export const validation = {}
export const schemes = [
  'users',
  'roles',
  'permissions',
  'countries',
  'provinces',
  'cities',
  'addresses',
  'contacts',
  'files',
  'images'
]

export default function () {
  return {
    ...state(),
    // Collection name
    collection,
    // Datatable config
    columns,
    form,
    layout,
    validation,
    schemes
  }
}
