import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import WorkspaceView from '../views/WorkspaceView.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingView },
  { path: '/workspace', name: 'workspace', component: WorkspaceView },
  { path: '/workspace/:screen', name: 'workspace-screen', component: WorkspaceView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
