import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
// import SecureLS from 'secure-ls'
// var ls = new SecureLS({ isCompression: false })

import resources from './resources'
import schemes from './schemes'
import sysparam from './sysparam'
import auth from './auth'
import users from './users'
import roles from './roles'
import permissions from './permissions'

import countries from './countries'
import provinces from './provinces'
import cities from './cities'

import addresses from './addresses'
import contacts from './contacts'
import distributions from './distributions'
import files from './files'
import images from './images'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      resources,
      schemes,
      sysparam,
      auth,
      users,
      roles,
      permissions,

      countries,
      provinces,
      cities,

      addresses,
      contacts,
      files,
      images

    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    // FIXME: Should we lose store strict?
    strict: false,
    plugins: [
      // createPersistedState({
      //   storage: {
      //     getItem: (key) => ls.get(key),
      //     setItem: (key, value) => ls.set(key, value),
      //     removeItem: (key) => ls.remove(key)
      //   }
      // })
    ]
  })

  return Store
}
