import { createRouter, createWebHashHistory } from 'vue-router';

// Import Halaman
import Invitation from '../components/Hero.vue'; // Pastikan path ini benar sesuai file bapak (Hero/Invitation)
import Dashboard from '../components/Dashboard.vue';
import QrScanner from '../components/QrScanner.vue';

const routes = [
  { 
    path: '/',          
    name: 'Home', 
    component: Invitation 
  },
  { 
    path: '/admin',     
    name: 'Admin', 
    component: Dashboard 
  },
  {
    path : '/scan',
    name : 'scan',
    component : QrScanner
  }
];

const router = createRouter({
  // --- BAGIAN INI YANG PENTING DIUBAH ---
  // Gunakan createWebHashHistory() agar tidak error 404 di Vercel
  history: createWebHashHistory(),
  routes,
});

export default router;