import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const localStorageKey = 'quando'

const vuexLocalStorage = new VuexPersistence({
  key: localStorageKey,
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
      consent: false,
    },
    items: [] as any[],
  },
  getters: {
    getItemById: state => (id: string) => {
      return state.items.find(item => item.id === id)
    },
  },
  mutations: {
    pushDemoItems(state) {
      const existing = state.items.map((x: any) => x.id)
      for (const item of demoItems) {
        if (!existing.includes(item.id)) {
          state.items.push(item)
        }
      }
    },
    removeItems(state) {
      state.items = []
      window.setTimeout(() => {
        window.localStorage.removeItem(localStorageKey)
      }, 10)
    },
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

const demoItems = [
  {
    id: 'demo-0001',
    label: 'WHO declared COVID-19 a pandemic',
    datetime: '2020-03-11T22:00:00Z',
    timezone: 'Europe/London',
  },
  {
    id: 'demo-0002',
    label: 'Fall of the Berlin Wall',
    datetime: '1989-11-09T18:53:00Z',
    timezone: 'Europe/Berlin',
  },
  {
    id: 'demo-0003',
    label: '2024 UK General Election',
    datetime: '2024-05-02T07:00:00Z',
    timezone: 'Europe/London',
  },
  {
    id: 'demo-0004',
    label: '2030',
    datetime: '2030-01-01T00:00:00Z',
    timezone: 'Europe/London',
  },
  {
    id: 'demo-0005',
    label: '2020 US Presidential Election',
    datetime: '2020-11-03T07:00:00Z',
    timezone: 'America/New_York',
  },
  {
    id: 'demo-0006',
    label: 'WHO declared COVID-19 a pandemic',
    datetime: '2020-03-11T22:00:00Z',
    timezone: 'Europe/London',
  },
]
