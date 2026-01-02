import { createRouter, createWebHashHistory } from 'vue-router'

// --- PERBAIKAN DI SINI ---
// Ubah '../components/...' menjadi '../views/...'
// Tanda titik dua (..) artinya: Keluar dari folder router, lalu masuk ke folder views
import Invitation from '../views/Invitation.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Invitation',
    component: Invitation
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router