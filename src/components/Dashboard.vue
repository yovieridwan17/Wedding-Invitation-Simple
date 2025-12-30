<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '../supabase';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';
import { weddingData } from '../data.js';
import * as XLSX from 'xlsx'; // <--- 1. IMPORT LIBRARY XLSX

const router = useRouter();

// --- KONFIGURASI SESI ---
const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 30 * 60 * 1000;
let sessionTimer = null;

// --- LOGIN STATE ---
const isAuthenticated = ref(false);
const passwordInput = ref('');
const errorMsg = ref('');
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// --- LOGIC LOGIN (Sama) ---
const handleLogin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    const now = new Date();
    const sessionData = { value: true, expiry: now.getTime() + SESSION_DURATION };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    isAuthenticated.value = true;
    fetchGuests();
    startSessionTimer(SESSION_DURATION);
  } else {
    errorMsg.value = 'Password salah!';
  }
};

const logout = (isAuto = false) => {
  isAuthenticated.value = false;
  localStorage.removeItem(SESSION_KEY);
  if (sessionTimer) clearTimeout(sessionTimer);
  if (isAuto) alert("Sesi habis. Silakan login kembali.");
  router.push('/admin');
};

const checkSession = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return;
  const session = JSON.parse(sessionStr);
  const now = new Date().getTime();
  if (now > session.expiry) { logout(true); return; }
  isAuthenticated.value = true;
  fetchGuests();
  startSessionTimer(session.expiry - now);
};

const startSessionTimer = (duration) => {
  if (sessionTimer) clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => { logout(true); }, duration);
};

onMounted(() => { checkSession(); });
onBeforeUnmount(() => { if (sessionTimer) clearTimeout(sessionTimer); });

// --- CRUD DATA ---
const guests = ref([]);
const newName = ref('');
const newCategory = ref('Teman Kerja');
const isLoading = ref(false);
const categories = ['Keluarga', 'Teman Kerja', 'Teman Sekolah', 'VIP', 'Tetangga'];
const showQrModal = ref(false);
const qrValue = ref('');
const qrName = ref('');

// --- REF UNTUK FILE INPUT ---
const fileInput = ref(null); // <--- Referensi ke elemen input file

const fetchGuests = async () => {
  const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
  if (!error) guests.value = data;
};

const addGuest = async () => {
  if (!newName.value) return alert("Nama wajib diisi!");
  isLoading.value = true;
  const slug = newName.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-.,;()']+/g, '');
  const { error } = await supabase.from('guests').insert([{ name: newName.value, category: newCategory.value, slug: slug }]);
  isLoading.value = false;
  if (!error) { newName.value = ''; fetchGuests(); }
  else { alert("Gagal/Nama sudah ada."); }
};

const deleteGuest = async (id) => {
  if(!confirm("Hapus tamu ini?")) return;
  const { error } = await supabase.from('guests').delete().eq('id', id);
  if (!error) fetchGuests();
};

// --- 🔥 FITUR BARU: DOWNLOAD TEMPLATE ---
const downloadTemplate = () => {
  // 1. Buat Data Dummy untuk Contoh
  const templateData = [
    { "Nama Tamu": "Contoh: Budi Santoso", "Kategori": "Teman Kerja" },
    { "Nama Tamu": "Siti Aminah, S.Pd", "Kategori": "Keluarga" }
  ];

  // 2. Buat Worksheet & Workbook
  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");

  // 3. Download File
  XLSX.writeFile(wb, "Template_Undangan.xlsx");
};

// --- 🔥 FITUR BARU: IMPORT EXCEL ---
const triggerFileInput = () => {
  fileInput.value.click(); // Klik input file yang tersembunyi
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      isLoading.value = true;
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil Sheet Pertama
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Ubah ke JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Proses Data (Mapping & Slug)
      const formattedData = jsonData.map(row => {
        // Ambil kolom berdasarkan nama header di template
        // Pakai '||' buat jaga-jaga kalau user nulis header beda dikit (lowercase)
        const rawName = row['Nama Tamu'] || row['nama tamu'] || row['Nama'] || '';
        const rawCategory = row['Kategori'] || row['kategori'] || 'Teman Kerja';

        if (!rawName) return null; // Skip kalau nama kosong

        // Buat Slug (Sama persis dengan Regex addGuest)
        const slug = rawName.toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-.,;()']+/g, '');

        return {
          name: rawName,
          category: rawCategory,
          slug: slug,
          status: 'Belum Hadir' // Default status
        };
      }).filter(item => item !== null); // Hapus yang kosong

      if (formattedData.length === 0) {
        alert("File kosong atau format salah!");
        isLoading.value = false;
        return;
      }

      // Masukkan ke Supabase (Bulk Insert)
      const { error } = await supabase.from('guests').insert(formattedData);

      if (error) {
        console.error(error);
        alert("Gagal Import! Mungkin ada nama yang duplikat.");
      } else {
        alert(`Berhasil import ${formattedData.length} tamu!`);
        fetchGuests(); // Refresh Tabel
      }

    } catch (err) {
      console.error(err);
      alert("Gagal membaca file Excel.");
    } finally {
      isLoading.value = false;
      event.target.value = ''; // Reset input file biar bisa upload file sama lagi
    }
  };

  reader.readAsArrayBuffer(file);
};

// --- HELPER LAINNYA ---
const slugToNiceName = (slug) => {
  if (!slug) return '';
  return slug.replace(/-/g, '+').replace(/\b\w/g, l => l.toUpperCase());
}

const copyLink = (slug) => {
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(slug)}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Link tersalin!\n" + fullUrl);
};

const shareToWa = (guest) => {
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  const groom = weddingData?.groom?.nickName || "Pria";
  const bride = weddingData?.bride?.nickName || "Wanita";
  const coupleName = `${groom} & ${bride}`;

const shareToWa = async (guest) => {
  // 1. BUAT LINK & PESAN (Sama seperti sebelumnya)
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  const groom = weddingData?.groom?.nickName || "Pria";
  const bride = weddingData?.bride?.nickName || "Wanita";
  const coupleName = `${groom} & ${bride}`;

  const message = `Assalamu'alaikum Wr. Wb
Bismillahirahmanirrahim.

Yth. ${guest.name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

${coupleName}

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi :

${fullUrl}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini. Terima kasih banyak atas perhatiannya.

Wassalamu'alaikum Wr. Wb.
Terima Kasih.`;

  // 2. BUKA WHATSAPP
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');

  // 3. UPDATE STATUS KE DATABASE (NEW FITUR) 🔥
  // Kita update kolom 'invitation_sent' jadi true
  const { error } = await supabase
    .from('guests')
    .update({ invitation_sent: true })
    .eq('id', guest.id);

  if (!error) {
    // Update tampilan di tabel secara langsung (biar gak perlu refresh page)
    guest.invitation_sent = true;
  } else {
    console.error("Gagal update status kirim", error);
  }
};

const openQrCode = (guest) => {
  qrName.value = guest.name;
  qrValue.value = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  showQrModal.value = true;
};

const goToScanner = () => { router.push('/scan'); };
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-body text-gray-800">
    <div
      v-if="!isAuthenticated"
      class="flex items-center justify-center min-h-screen bg-gray-900"
    >
      <div
        class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Login Admin</h2>
        <form @submit.prevent="handleLogin" class="space-y-4 mt-6">
          <input
            v-model="passwordInput"
            type="password"
            placeholder="Password"
            class="w-full border p-3 rounded-lg text-center"
          />
          <p v-if="errorMsg" class="text-red-500 text-xs font-bold">
            {{ errorMsg }}
          </p>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>

    <div v-else class="p-4 md:p-8 max-w-6xl mx-auto">
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Dashboard Tamu</h1>
          <p class="text-gray-500 text-sm">
            Total: {{ guests.length }} | Hadir:
            {{ guests.filter((g) => g.status === "Hadir").length }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="goToScanner"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition transform hover:scale-105"
          >
            📷 Scan QR
          </button>
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 class="font-bold text-gray-700 mb-4 border-b pb-2">
          Tambah Manual
        </h3>
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <input
            v-model="newName"
            type="text"
            placeholder="Nama Tamu..."
            class="flex-1 border p-3 rounded-lg"
            @keyup.enter="addGuest"
          />
          <select
            v-model="newCategory"
            class="border p-3 rounded-lg bg-gray-50"
          >
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
          <button
            @click="addGuest"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            {{ isLoading ? "..." : "+ Tambah" }}
          </button>
        </div>

        <h3
          class="font-bold text-gray-700 mb-4 border-b pb-2 flex justify-between items-center"
        >
          <span>Import dari Excel</span>
          <button
            @click="downloadTemplate"
            class="text-sm text-green-600 hover:underline flex items-center gap-1"
          >
            📥 Download Template
          </button>
        </h3>

        <div
          class="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300"
        >
          <div class="text-sm text-gray-500 flex-1">
            <p>1. Download template di atas.</p>
            <p>2. Isi data (Jangan ubah judul kolom).</p>
            <p>3. Upload file Excel (.xlsx) di sini.</p>
          </div>

          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept=".xlsx, .xls"
            class="hidden"
          />

          <button
            @click="triggerFileInput"
            :disabled="isLoading"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2 transition"
          >
            📂 {{ isLoading ? "Sedang Proses..." : "Upload Excel" }}
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th class="p-4 border-b">Nama Tamu</th>
                <th class="p-4 border-b">Kategori</th>
                <th class="p-4 border-b text-center">Status</th>
                <th class="p-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="guest in guests"
                :key="guest.id"
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="p-4 font-bold text-gray-800">{{ guest.name }}</td>
                <td class="p-4">
                  <span
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold"
                    >{{ guest.category }}</span
                  >
                </td>
                <td class="p-4 text-center">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold border"
                    :class="
                      guest.status === 'Hadir'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    "
                  >
                    {{ guest.status }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2 flex-wrap">
                    @click="shareToWa(guest)" :disabled="guest.invitation_sent"
                    class="px-3 py-1 rounded text-sm flex items-center gap-1
                    transition shadow-sm border" :class="guest.invitation_sent ?
                    'bg-gray-100 text-gray-400 border-gray-200
                    cursor-not-allowed' /* Style kalau SUDAH dikirim */ :
                    'bg-green-500 hover:bg-green-600 text-white
                    border-green-500'" /* Style kalau BELUM dikirim */
                    title="Kirim WA" >
                    <span v-if="guest.invitation_sent">✅ Terkirim</span>
                    <button
                      @click="copyLink(guest.slug)"
                      class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm border transition"
                    >
                      🔗 Copy
                    </button>
                    <button
                      @click="openQrCode(guest)"
                      class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm border border-purple-200 flex items-center gap-1 transition"
                    >
                      📱 QR
                    </button>
                    <button
                      @click="deleteGuest(guest.id)"
                      class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm border border-red-200 transition"
                    >
                      ❌ delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showQrModal"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      @click="showQrModal = false"
    >
      <div
        class="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-800 mb-2">QR Code Tamu</h3>
        <p class="text-lg font-bold text-blue-600 mb-6">{{ qrName }}</p>
        <div
          class="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl inline-block mb-6"
        >
          <QrcodeVue :value="qrValue" :size="200" level="H" />
        </div>
        <p class="text-xs text-gray-400 mb-6 break-all bg-gray-50 p-2 rounded">
          {{ qrValue }}
        </p>
        <button
          @click="showQrModal = false"
          class="bg-gray-800 text-white w-full py-3 rounded-lg font-bold"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
