<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { supabase } from "../lib/supabase";
import QrcodeVue from "qrcode.vue";
import { useRouter } from "vue-router";
import { weddingData } from "../utilities/data.js";
import * as XLSX from "xlsx";

const router = useRouter();

// --- KONFIGURASI SESI ---
const SESSION_KEY = "admin_session";
const SESSION_DURATION = 30 * 60 * 1000;
let sessionTimer = null;

// --- LOGIN STATE ---
const isAuthenticated = ref(false);
const passwordInput = ref("");
const errorMsg = ref("");
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// --- PAGINATION & FILTER STATE ---
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedFilterCategory = ref(""); // State untuk Filter Kategori

// --- LOGIC LOGIN ---
const handleLogin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    const now = new Date();
    const sessionData = {
      value: true,
      expiry: now.getTime() + SESSION_DURATION,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    isAuthenticated.value = true;
    fetchGuests();
    startSessionTimer(SESSION_DURATION);
  } else {
    errorMsg.value = "Password salah!";
  }
};

const logout = (isAuto = false) => {
  isAuthenticated.value = false;
  localStorage.removeItem(SESSION_KEY);
  if (sessionTimer) clearTimeout(sessionTimer);
  if (isAuto) alert("Sesi habis. Silakan login kembali.");
  router.push("/admin");
};

const checkSession = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return;
  const session = JSON.parse(sessionStr);
  const now = new Date().getTime();
  if (now > session.expiry) {
    logout(true);
    return;
  }
  isAuthenticated.value = true;
  fetchGuests();
  startSessionTimer(session.expiry - now);
};

const startSessionTimer = (duration) => {
  if (sessionTimer) clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    logout(true);
  }, duration);
};

onMounted(() => {
  checkSession();
});
onBeforeUnmount(() => {
  if (sessionTimer) clearTimeout(sessionTimer);
});

// --- CRUD DATA ---
const guests = ref([]);
const newName = ref("");
const newCategory = ref("Teman Kerja");
const isLoading = ref(false);
const categories = [
  "Keluarga",
  "Teman Kerja",
  "SMK",
  "Kuliah",
  "VIP",
  "Tetangga",
];
const showQrModal = ref(false);
const qrValue = ref("");
const qrName = ref("");
const fileInput = ref(null);

const fetchGuests = async () => {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });
  if (!error) guests.value = data;
};

// --- FILTER & PAGINATION LOGIC (UPDATED) ---

// 1. Filter Data Dulu
const filteredGuests = computed(() => {
  if (!selectedFilterCategory.value) {
    return guests.value; // Jika kosong, tampilkan semua
  }
  return guests.value.filter(
    (g) => g.category === selectedFilterCategory.value
  );
});

// 2. Hitung Total Halaman berdasarkan Data yang sudah di-Filter
const totalPages = computed(() => {
  return Math.ceil(filteredGuests.value.length / itemsPerPage.value);
});

// 3. Potong Data (Slice) untuk halaman aktif
const paginatedGuests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredGuests.value.slice(start, end);
});

// Reset halaman ke 1 jika filter atau itemsPerPage berubah
const handleFilterChange = () => {
  currentPage.value = 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const addGuest = async () => {
  if (!newName.value) return alert("Nama wajib diisi!");
  isLoading.value = true;
  const slug = newName.value
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-.,;()']+/g, "");
  const { error } = await supabase
    .from("guests")
    .insert([{ name: newName.value, category: newCategory.value, slug: slug }]);
  isLoading.value = false;
  if (!error) {
    newName.value = "";
    fetchGuests();
  } else {
    alert("Gagal/Nama sudah ada.");
  }
};

const deleteGuest = async (id) => {
  if (!confirm("Hapus tamu ini?")) return;
  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (!error) fetchGuests();
};

// --- EXCEL LOGIC ---
const downloadTemplate = () => {
  const templateData = [
    { "Nama Tamu": "Contoh: Budi Santoso", Kategori: "Teman Kerja" },
    { "Nama Tamu": "Siti Aminah, S.Pd", Kategori: "Keluarga" },
  ];
  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");
  XLSX.writeFile(wb, "Template_Undangan.xlsx");
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      isLoading.value = true;
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData
        .map((row) => {
          const rawName =
            row["Nama Tamu"] || row["nama tamu"] || row["Nama"] || "";
          const rawCategory =
            row["Kategori"] || row["kategori"] || "Teman Kerja";
          if (!rawName) return null;
          const slug = rawName
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-.,;()']+/g, "");
          return {
            name: rawName,
            category: rawCategory,
            slug: slug,
            status: "Belum Hadir",
          };
        })
        .filter((item) => item !== null);

      if (formattedData.length === 0) {
        alert("File kosong/salah format!");
        isLoading.value = false;
        return;
      }

      const { error } = await supabase
        .from("guests")
        .upsert(formattedData, { onConflict: "slug", ignoreDuplicates: true });

      if (error) {
        console.error(error);
        alert("Gagal Import! Cek konsol.");
      } else {
        alert(`Berhasil import ${formattedData.length} tamu!`);
        fetchGuests();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal baca file.");
    } finally {
      isLoading.value = false;
      event.target.value = "";
    }
  };
  reader.readAsArrayBuffer(file);
};

// --- HELPER ---
const slugToNiceName = (slug) => {
  if (!slug) return "";
  return slug.replace(/-/g, "+").replace(/\b\w/g, (l) => l.toUpperCase());
};

const copyLink = (slug) => {
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(slug)}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Link tersalin!\n" + fullUrl);
};

const openQrCode = (guest) => {
  qrName.value = guest.name;
  qrValue.value = `${window.location.origin}/#/?to=${slugToNiceName(
    guest.slug
  )}`;
  showQrModal.value = true;
};

// --- SHARE WA LOGIC ---
const shareToWa = async (guest) => {
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(
    guest.slug
  )}`;
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

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");

  const { error } = await supabase
    .from("guests")
    .update({ invitation_sent: true })
    .eq("id", guest.id);

  if (!error) {
    guest.invitation_sent = true;
  }
};

const goToScanner = () => {
  router.push("/scan");
};
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
            Total Tamu: {{ guests.length }} |
            <span class="text-green-600 font-bold"
              >Hadir:
              {{ guests.filter((g) => g.status === "Hadir").length }}</span
            >
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
        <div
          class="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="flex items-center gap-3 w-full md:w-auto">
            <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
               🔍 Filter:
            </label>
            <select
              v-model="selectedFilterCategory"
              @change="handleFilterChange"
              class="border rounded px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-48"
            >
              <option value="">Semua Kategori</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              v-model="itemsPerPage"
              @change="handleFilterChange"
              class="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="guests.length > 0 ? guests.length : 1000">
                Semua
              </option>
            </select>
            <span class="hidden md:inline"
              >| {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, filteredGuests.length) }}
              dari {{ filteredGuests.length }}</span
            >
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th class="p-4 border-b">No</th>
                <th class="p-4 border-b">Nama Tamu</th>
                <th class="p-4 border-b">Kategori</th>
                <th class="p-4 border-b text-center">Status</th>
                <th class="p-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(guest, index) in paginatedGuests"
                :key="guest.id"
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="p-4 text-gray-500 font-mono text-xs">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
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
                    <button
                      @click="shareToWa(guest)"
                      :disabled="guest.invitation_sent"
                      class="px-3 py-1 rounded text-sm flex items-center gap-1 transition shadow-sm border"
                      :class="
                        guest.invitation_sent
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                      "
                      title="Kirim WA"
                    >
                      <span v-if="guest.invitation_sent">✅</span>
                      <span v-else>📲 WA</span>
                    </button>
                    <button
                      @click="copyLink(guest.slug)"
                      class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm border transition"
                    >
                      🔗
                    </button>
                    <button
                      @click="openQrCode(guest)"
                      class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm border border-purple-200 flex items-center gap-1 transition"
                    >
                      📱
                    </button>
                    <button
                      @click="deleteGuest(guest.id)"
                      class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm border border-red-200 transition"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedGuests.length === 0">
                <td colspan="5" class="p-8 text-center text-gray-500 italic">
                  <span v-if="selectedFilterCategory"
                    >Tidak ada tamu di kategori "{{
                      selectedFilterCategory
                    }}".</span
                  >
                  <span v-else>Belum ada data tamu.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredGuests.length > 0"
          class="p-4 bg-gray-50 border-t flex justify-between items-center"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-white border rounded text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition"
              :class="
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border hover:bg-gray-100 text-gray-600'
              "
            >
              <span
                v-if="
                  Math.abs(currentPage - page) < 3 ||
                  page === 1 ||
                  page === totalPages
                "
              >
                {{ page }}
              </span>
              <span v-else-if="Math.abs(currentPage - page) === 3">...</span>
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-white border rounded text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
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