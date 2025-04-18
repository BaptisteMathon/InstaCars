import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFoundView from '../views/NotFoundView.vue'
import Authentification from '../views/Authentification.vue'
import Profil from '../views/Profil.vue'
import Search from '../views/Search.vue'
import Publish from '../views/Publish.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/auth',
      name: 'auth',
      component: Authentification,
    },
    {
      path: '/search',
      name: 'seatch',
      component: Search
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil,
    },
    {
      path: '/profil/:id',
      name: 'profilId',
      component: Profil,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    }
  ],
})

export default router
