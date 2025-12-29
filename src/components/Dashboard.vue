<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'; // Tambah onBeforeUnmount
import { supabase } from '../supabase';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router'; 
import { weddingData } from '../data';


const router = useRouter();

// --- KONFIGURASI SESI ---
const SESSION_KEY = 'admin_session'; // Nama kunci di LocalStorage
const SESSION_DURATION = 30 * 60 * 1000; // 30 Menit dalam milidetik
let sessionTimer = null; // Variable untuk timer hitung mundur

// --- LOGIN STATE ---
const isAuthenticated = ref(false);
const passwordInput = ref('');
const errorMsg = ref('');
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; 

// 1. LOGIC LOGIN (Simpan Waktu Kadaluarsa)
const handleLogin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    const now = new Date();
    
    // Kita simpan Objek: { value: true, expiry: JamSekarang + 30menit }
    const sessionData = {
      value: true,
      expiry: now.getTime() + SESSION_DURATION,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    isAuthenticated.value = true;
    fetchGuests();
    
    // Mulai hitung mundur otomatis dari sekarang
    startSessionTimer(SESSION_DURATION);
  } else {
    errorMsg.value = 'Password salah !';
  }
};

// 2. LOGIC LOGOUT (Bersihkan Semuanya)
const logout = (isAuto = false) => {
  isAuthenticated.value = false;
  localStorage.removeItem(SESSION_KEY);
  
  if (sessionTimer) clearTimeout(sessionTimer); // Matikan timer
  
  if (isAuto) {
    alert("Sesi Anda telah habis (30 Menit). Silakan login kembali.");
  }
  
  // Opsional: Reload halaman biar bersih
  window.location.href = '/admin'; 
};

// 3. LOGIC CEK SESI (Saat Halaman Dibuka/Refresh)
const checkSession = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  
  // Kalau tidak ada data sesi -> Logout
  if (!sessionStr) return;

  const session = JSON.parse(sessionStr);
  const now = new Date().getTime();

  // Kalau Waktu Sekarang > Waktu Kadaluarsa -> Logout
  if (now > session.expiry) {
    logout(true); // True artinya logout otomatis karena expired
    return;
  }

  // Kalau Masih Berlaku -> Masuk
  isAuthenticated.value = true;
  fetchGuests();

  // Hitung sisa waktu yang ada, lalu pasang timer lagi
  // (Misal user refresh halaman di menit ke-10, berarti sisa 20 menit)
  const remainingTime = session.expiry - now;
  startSessionTimer(remainingTime);
};

// Helper: Timer Penghancur Sesi
const startSessionTimer = (duration) => {
  // Reset timer lama kalau ada
  if (sessionTimer) clearTimeout(sessionTimer);

  // Set timer baru sesuai sisa waktu
  sessionTimer = setTimeout(() => {
    logout(true);
  }, duration);
};

// --- LIFECYCLE VUE ---
onMounted(() => {
  checkSession(); // Cek saat pertama kali buka
});

onBeforeUnmount(() => {
  // Bersihkan timer kalau pindah halaman (biar memori aman)
  if (sessionTimer) clearTimeout(sessionTimer);
});
// logic share to Whatsapp 
const shareToWa = (guest) => {
    // 1. menyiapkan link unik tamu 
    const fullUrl = '${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}'
    const message = `Assalamu'alaikum Wr. Wb
Bismillahirahmanirrahim.

Yth. ${guest.name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

${weddingData.groom.nickName} & ${weddingData.bride.nickName}

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi :

${fullUrl}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini. Terima kasih banyak atas perhatiannya.

Wassalamu'alaikum Wr. Wb.
Terima Kasih.`;
const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};


// --- DASHBOARD LOGIC (SAMA SEPERTI SEBELUMNYA) ---
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
  
  const slug = newName.value.toLowerCase()
    .replace(/ /g, '-')                 // 1. Spasi jadi strip
    .replace(/[^\w-.,;()']+/g, '');     // 2. Hapus sisa sampah selain simbol di atas

  // Simpan ke database
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
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(slug)}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Link tersalin!\n" + fullUrl);
};

const slugToNiceName = (slug) => {
  return slug.replace(/-/g, '+').replace(/\b\w/g, l => l.toUpperCase());
}

const openQrCode = (guest) => {
  qrName.value = guest.name;
  qrValue.value = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  showQrModal.value = true;
};

// Fungsi ke Scanner
const goToScanner = () => {
  router.push('/scan');
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
      
     <div class="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
  
  <div>
    <h1 class="text-3xl font-bold text-dark">Dashboard Undangan</h1>
    <p class="text-gray-500 text-sm">Total Tamu: {{ guests.length }}</p>
  </div>

  <div class="flex gap-3">
    
    <button 
      @click="goToScanner" 
      class="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition"
    >
      📷 Scan QR
    </button>
    
    <button 
      @click="logout" 
      class="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-bold shadow-md transition"
    >
      Logout
    </button>

  </div>

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
                    <button @click="shareToWa(guest)" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition shadow-sm" title="Kirim WA">
                      📲 WA
                    </button>
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