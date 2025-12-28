import { createRouter, createWebHashHistory } from 'vue-router';

// Perhatikan titiknya CUMA SATU (.) karena folder components ada di sebelahnya
import Invitation from './components/Invitation.vue';
import Dashboard from './components/Dashboard.vue';
import QrScanner from './components/QrScanner.vue';

const routes = [
  { path: '/', name: 'Home', component: Invitation },
  { path: '/admin', name: 'Admin', component: Dashboard },
  { path: '/scan', name: 'Scan', component: QrScanner }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;