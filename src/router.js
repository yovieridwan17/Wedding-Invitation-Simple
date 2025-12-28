import { createRouter, createWebHistory } from 'vue-router';

// Import Halaman
import Invitation from './components/Invitation.vue';
import Dashboard from './components/Dashboard.vue';
import QrScanner from './components/QrScanner.vue';

const routes = [
  { 
    path: '/',          // URL: domain.com/
    name: 'Home', 
    component: Invitation 
  },
  { 
    path: '/admin',     // URL: domain.com/admin
    name: 'Admin', 
    component: Dashboard 
  },
  // Nanti kita tambah halaman Scan QR di sini
  {
    path : '/scan',
    name : 'scan',
    component : QrScanner
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;