import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import ItemNew from '../views/ItemNew.vue'
import ItemSingle from '../views/ItemSingle.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/items/',
  },
  {
    path: '/items/',
    name: 'List',
    component: Home,
  },
  {
    path: '/items/new',
    name: 'New',
    component: ItemNew,
  },
  {
    path: '/items/:id',
    name: 'Single',
    component: ItemSingle,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
