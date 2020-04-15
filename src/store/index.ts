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
    user: {
      timezone: 'Europe/London',
    },
    items: [
      {
        id: 'B86A31DD-46D3-4B5E-948D-C1428BC546C2',
        label: 'I was born',
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
  },
  actions: {},
  modules: {},
})
