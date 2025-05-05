import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFoundView from '../views/NotFoundView.vue'
import Authentification from '../views/Authentification.vue'
import Profil from '../views/Profil.vue'
import Search from '../views/Search.vue'
import Publish from '../views/Publish.vue'
import EditProfil from '@/views/EditProfil.vue'
import Forum from '../views/Forum.vue'
import ForumDetail from '@/views/ForumDetail.vue'

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
      name: 'search',
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
      path: '/forum',
      name: 'forum',
      component: Forum,
    },
    {
      path: '/profil/:id',
      name: 'profilId',
      component: Profil,
      props: true,
    },
    {
      path: '/editProfil/:id',
      name: 'editProfil',
      component: EditProfil,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'forumDetail',
      component: ForumDetail,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    }
  ],
})

export default router
