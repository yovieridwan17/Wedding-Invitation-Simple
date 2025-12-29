<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '../supabase';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';
// IMPORT DATA PENGANTIN
import { weddingData } from '../data/data'; 

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

// --- LOGIC LOGIN & SESI ---
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
  if (isAuto) alert("Sesi habis (30 Menit). Silakan login kembali.");
  router.push('/admin'); 
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
  sessionTimer = setTimeout(() => { logout(true); }, duration);
};

onMounted(() => { checkSession(); });
onBeforeUnmount(() => { if (sessionTimer) clearTimeout(sessionTimer); });

// --- DASHBOARD DATA ---
const guests = ref([]);
const newName = ref('');
const newCategory = ref('Teman Kerja');
const isLoading = ref(false);
const categories = ['Keluarga', 'Teman Kerja', 'Teman Sekolah', 'VIP', 'Tetangga'];
const showQrModal = ref(false);
const qrValue = ref('');
const qrName = ref('');

// --- CRUD LOGIC ---
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

// --- HELPER DI TARUH DI ATAS (SUPAYA AMAN) ---
const slugToNiceName = (slug) => {
  if (!slug) return ''; // Jaga-jaga kalau slug kosong
  return slug.replace(/-/g, '+').replace(/\b\w/g, l => l.toUpperCase());
}

const copyLink = (slug) => {
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(slug)}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Link tersalin!\n" + fullUrl);
};

// --- LOGIC SHARE WA ---
const shareToWa = (guest) => {
  // 1. Debugging: Cek di Console apakah link terbentuk
  const fullUrl = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  console.log("Link WA:", fullUrl); // <-- Cek Console Pak kalau masih error

  const groom = weddingData.groom?.nickName || "Wildan";
  const bride = weddingData.bride?.nickName || "Deva";
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

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
};

const openQrCode = (guest) => {
  qrName.value = guest.name;
  qrValue.value = `${window.location.origin}/#/?to=${slugToNiceName(guest.slug)}`;
  showQrModal.value = true;
};

const goToScanner = () => { router.push('/scan'); };
</script>