import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersistence({
  key: 'since-then',
  storage: window.localStorage,
  reducer: (state: any) => ({
    items: state.items,
  }),
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    ui: {
      reloading: false,
      worker: null,
      updateAvailable: false,
    },
    user: {
      timezone: 'Europe/London',
    },
    items: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'For example',
        datetime: '1989-03-25T00:18:00Z',
        timezone: 'Europe/London',
      },
    ],
  },
  getters: {
    getItemById: state => (id: string) => {
      return state.items.find(item => item.id === id)
    },
  },
  mutations: {
    addItem(state, item) {
      state.items.push(item)
    },
    updateItem(state, updatedItem) {
      const i = state.items.findIndex(item => item.id === updatedItem.id)
      state.items.splice(i, 1, updatedItem)
    },
    removeItemById(state, id) {
      const i = state.items.findIndex(item => item.id === id)
      state.items.splice(i, 1)
    },
    workerFoundUpdate(state, worker) {
      state.ui.worker = worker
      state.ui.updateAvailable = true
    },
  },
  actions: {},
  modules: {},
})
