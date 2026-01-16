import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import AIAsk from '../views/AIAsk.vue'
import NoteWeek from '@/views/NoteWeek.vue';
import ChatView from '@/views/ChatView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/chatview',
      name: 'view',
      component: ChatView,
    },
    {
      path: '/note',
      name: 'note',
      component: NoteWeek,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Register.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/AIAsk.vue'),
    }


  ],
})

export default router
