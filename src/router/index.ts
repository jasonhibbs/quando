import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import ItemNew from '../views/ItemNew.vue'
import ItemSingle from '../views/ItemSingle.vue'
import ItemEdit from '../views/ItemEdit.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'List',
    component: Home,
  },
  {
    path: '/times/new',
    name: 'New',
    component: ItemNew,
  },
  {
    path: '/times/:id',
    name: 'Single',
    component: ItemSingle,
  },
  {
    path: '/times/:id/edit',
    name: 'Edit',
    component: ItemEdit,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
