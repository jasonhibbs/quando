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
    items: [
      {
        id: 'B86A31DD-46D3-4B5E-948D-C1428BC546C2',
        label: 'I was born',
        datetime: '1989-03-25T00:18:00Z',
      },
      {
        id: '0992CCBB-1C8F-47E6-8D30-34F17AEAE4C9',
        label: 'Helen was born',
        datetime: '1991-12-18T00:00:00Z',
      },
      {
        id: '58BD9FE9-148D-48D0-885B-91DF80633296',
        label: 'Moved in',
        datetime: '2020-02-24T12:00:00Z',
      },
      {
        id: '7874D847-08B1-4AE9-ADF2-8217BC2EA923',
        label: 'Lockdown',
        datetime: '2020-03-24T13:02:00Z',
      },
      {
        id: 'AFF4FA6D-CCA4-40A3-9B7B-1177B05F6D16',
        label: 'I’m 40',
        datetime: '2029-03-25T00:18:00Z',
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
    removeItemById(state, id) {
      const i = state.items.findIndex(item => item.id === id)
      state.items.splice(i, 1)
    },
  },
  actions: {},
  modules: {},
})
