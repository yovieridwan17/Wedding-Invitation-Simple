<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import QrcodeVue from 'qrcode.vue'; // <-- 1. Import Library QR

// --- LOGIN STATE ---
const isAuthenticated = ref(false);
const passwordInput = ref('');
const errorMsg = ref('');
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; 

const handleLogin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true;
    localStorage.setItem('isAdmin', 'true');
    fetchGuests();
  } else {
    errorMsg.value = 'Password salah !';
  }
};

const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem('isAdmin');
  window.location.href = '/'; 
};

onMounted(() => {
  if (localStorage.getItem('isAdmin') === 'true') {
    isAuthenticated.value = true;
    fetchGuests();
  }
});

// --- DASHBOARD LOGIC ---
const guests = ref([]);
const newName = ref('');
const newCategory = ref('Teman Kerja');
const isLoading = ref(false);
const categories = ['Keluarga', 'Teman Kerja', 'Teman Sekolah', 'VIP', 'Tetangga'];

// STATE UNTUK MODAL QR
const showQrModal = ref(false);
const qrValue = ref('');
const qrName = ref('');

const fetchGuests = async () => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });
  if (!error) guests.value = data;
};

const addGuest = async () => {
  if (!newName.value) return alert("Nama wajib diisi!");
  isLoading.value = true;
  const slug = newName.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const { error } = await supabase
    .from('guests')
    .insert([{ name: newName.value, category: newCategory.value, slug: slug }]);

  isLoading.value = false;
  if (!error) {
    newName.value = '';
    fetchGuests();
  } else {
    alert("Gagal/Nama sudah ada.");
  }
};

const deleteGuest = async (id) => {
  if(!confirm("Hapus tamu ini?")) return;
  const { error } = await supabase.from('guests').delete().eq('id', id);
  if (!error) fetchGuests();
};

const copyLink = (slug) => {
  const fullUrl = `${window.location.origin}/?to=${slugToNiceName(slug)}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Link tersalin!\n" + fullUrl);
};

// Helper: Ubah slug jadi Nama Cantik untuk URL
const slugToNiceName = (slug) => {
  return slug.replace(/-/g, '+').replace(/\b\w/g, l => l.toUpperCase());
}

// FUNGSI BUKA MODAL QR
const openQrCode = (guest) => {
  qrName.value = guest.name;
  // Isi QR Code adalah Link Undangan Tamu tersebut
  // Jadi kalau discan, langsung buka undangan milik dia
  qrValue.value = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  showQrModal.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-body text-gray-800">
    
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen bg-dark">
      <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h2 class="text-2xl font-heading text-dark mb-2">Login Admin</h2>
        <form @submit.prevent="handleLogin" class="space-y-4 mt-6">
          <input v-model="passwordInput" type="password" placeholder="Password" class="w-full border p-3 rounded-lg text-center">
          <p v-if="errorMsg" class="text-red-500 text-xs">{{ errorMsg }}</p>
          <button type="submit" class="w-full bg-gold text-dark font-bold py-3 rounded-lg">Masuk</button>
        </form>
      </div>
    </div>

    <div v-else class="p-8 max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-8 border-b pb-4">
        <h1 class="text-3xl font-bold text-dark">Dashboard Undangan</h1>
        <button @click="logout" class="bg-gray-800 text-white px-4 py-2 rounded text-sm">Logout</button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <input v-model="newName" type="text" placeholder="Nama Tamu..." class="flex-1 border p-3 rounded-lg" @keyup.enter="addGuest">
          <select v-model="newCategory" class="border p-3 rounded-lg bg-gray-50"><option v-for="cat in categories" :key="cat">{{ cat }}</option></select>
          <button @click="addGuest" :disabled="isLoading" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">{{ isLoading ? '...' : '+ Tambah' }}</button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th class="p-4">Nama Tamu</th>
              <th class="p-4">Kategori</th>
              <th class="p-4 text-center">Status</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in guests" :key="guest.id" class="border-b hover:bg-gray-50">
              <td class="p-4 font-bold">{{ guest.name }}</td>
              <td class="p-4"><span class="bg-gray-200 px-2 py-1 rounded text-xs">{{ guest.category }}</span></td>
              <td class="p-4 text-center">
                 <span class="px-2 py-1 rounded text-xs font-bold" 
                   :class="guest.status === 'Hadir' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                   {{ guest.status }}
                 </span>
              </td>
              <td class="p-4 text-center">
                <div class="flex justify-center gap-2">
                  <button @click="copyLink(guest.slug)" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">🔗 Link</button>
                  
                  <button @click="openQrCode(guest)" class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    QR
                  </button>
                  
                  <button @click="deleteGuest(guest.id)" class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-if="showQrModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" @click="showQrModal = false">
      <div class="bg-white p-8 rounded-2xl max-w-sm w-full text-center" @click.stop>
        <h3 class="text-xl font-heading text-dark mb-2">QR Code Undangan</h3>
        <p class="text-lg font-bold text-gold mb-6">{{ qrName }}</p>
        
        <div class="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl inline-block mb-6">
          <QrcodeVue :value="qrValue" :size="200" level="H" />
        </div>

        <p class="text-xs text-gray-500 mb-6 break-all">{{ qrValue }}</p>

        <button @click="showQrModal = false" class="bg-gray-800 text-white w-full py-3 rounded-lg font-bold">Tutup</button>
      </div>
    </div>

  </div>
</template>