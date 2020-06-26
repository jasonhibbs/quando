import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import More from '../views/More.vue'
import ItemList from '../views/ItemList.vue'
import ItemSingle from '../views/ItemSingle.vue'
import ItemNew from '../views/ItemNew.vue'
import ItemEdit from '../views/ItemEdit.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/times/',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/times/',
  },
  {
    path: '/more/',
    name: 'More',
    component: More,
  },
  {
    path: '/times/',
    name: 'List',
    component: ItemList,
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
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

export default router
