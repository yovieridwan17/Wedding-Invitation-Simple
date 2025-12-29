<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router'; // Tambah ini buat tombol close

const router = useRouter();
const scanResult = ref('');
const guestData = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
let scanner = null; // Simpan instance scanner biar bisa distop

// --- LOGIC SCANNER ---
const onScanSuccess = async (decodedText, decodedResult) => {
  if (isLoading.value) return; 

  // 1. LOGIC BARU: Parsing Link Hash Mode (Manual)
  // Link kita: https://domain.com/#/?to=Budi+Santoso
  let guestNameParam = null;

  try {
    // Cek apakah ini link undangan kita (harus mengandung 'to=')
    if (decodedText.includes('to=')) {
      // Kita pecah stringnya paksa. Ambil potongan setelah 'to='
      const splitUrl = decodedText.split('to='); 
      const rawName = splitUrl[1]; // Isinya: "Budi+Santoso" atau "Budi+Santoso&other=..."
      
      // Bersihkan kalau ada parameter lain di belakang (&)
      guestNameParam = rawName.split('&')[0];
    } 
    
    if (guestNameParam) {
      // Ubah "Budi+Santoso" atau "Budi%20Santoso" jadi "Budi Santoso"
      const cleanName = decodeURIComponent(guestNameParam.replace(/\+/g, ' '));
      handleCheckIn(cleanName);
    } else {
      errorMessage.value = "QR Code tidak valid! (Parameter nama tidak ditemukan)";
      setTimeout(() => errorMessage.value = '', 3000); // Hilang error stlh 3 detik
    }
  } catch (e) {
    console.error(e);
    errorMessage.value = "Bukan link undangan yang valid!";
    setTimeout(() => errorMessage.value = '', 3000);
  }
};

const onScanFailure = (error) => {
  // Kosongkan
};

// --- LOGIC UPDATE DATABASE ---
const handleCheckIn = async (name) => {
  isLoading.value = true;
  errorMessage.value = '';

  // 1. Cari Tamu
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .ilike('name', name) // Case insensitive
    .single();

  if (error || !data) {
    errorMessage.value = `Tamu "${name}" tidak ditemukan di database!`;
    isLoading.value = false;
    // Mainkan suara Gagal (Opsional)
    // new Audio('/fail.mp3').play().catch(e=>{});
    return;
  }

  // 2. Update Status
  const { error: updateError } = await supabase
    .from('guests')
    .update({ status: 'Hadir' })
    .eq('id', data.id);

  if (updateError) {
    errorMessage.value = "Gagal update status.";
  } else {
    guestData.value = data; 
    
    // Bunyikan Beep Sukses
    // Gunakan link audio pendek online yang stabil
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
    audio.play().catch(e => console.log("Audio block"));

    // Reset layar sukses setelah 3 detik
    setTimeout(() => {
      guestData.value = null;
      scanResult.value = '';
      isLoading.value = false;
    }, 3000);
  }
};

onMounted(() => {
  const config = { 
    fps: 10, 
    qrbox: { width: 250, height: 250 },
    videoConstraints: {
      facingMode: "environment" 
    }
  };
  
  scanner = new Html5QrcodeScanner("reader", config, false);
  scanner.render(onScanSuccess, onScanFailure);
});

onBeforeUnmount(() => {
  if (scanner) {
    scanner.clear(); // Matikan kamera pas keluar
  }
});
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col items-center justify-center p-4">
    
    <div class="absolute top-6 z-10 text-center">
      <h1 class="text-xl font-bold text-yellow-400 drop-shadow-md">SCANNER RESEPSI</h1>
      <p class="text-xs text-gray-300">Arahkan ke QR Code Tamu</p>
    </div>

    <div v-show="!guestData" class="w-full max-w-md relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-2xl">
      <div v-if="errorMessage" class="absolute top-0 left-0 w-full bg-red-600/90 text-white text-center p-2 z-20 font-bold animate-pulse">
        {{ errorMessage }}
      </div>

      <div id="reader" class="bg-black"></div>
    </div>

    <div v-if="guestData" class="w-full max-w-md bg-white text-gray-800 p-8 rounded-2xl text-center shadow-2xl animate-bounce z-20">
      <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl shadow-lg">✓</div>
      <h2 class="text-2xl font-bold text-green-600 mb-1">TERVERIFIKASI</h2>
      <p class="text-gray-500 text-sm">Selamat Datang</p>
      
      <div class="my-4 py-4 border-t border-b border-dashed border-gray-300">
        <p class="text-3xl font-heading font-bold text-gray-900 leading-tight">{{ guestData.name }}</p>
        <span class="inline-block mt-2 bg-gray-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">
          {{ guestData.category }}
        </span>
      </div>
      
      <p class="text-xs text-gray-400">Otomatis kembali dalam 3 detik...</p>
    </div>

    <button @click="router.push('/admin')" class="absolute bottom-10 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full hover:bg-white/20 transition text-sm">
      ❌ Tutup Scanner
    </button>

  </div>
</template>

<style>
/* --- CSS TEMBUS PANDANG (Force Style) --- */

/* Hilangkan border bawaan */
#reader { border: none !important; }

/* Sembunyikan elemen UI bawaan library yang jelek */
#reader__dashboard_section_csr span, 
#reader__dashboard_section_swaplink { display: none !important; }

/* Atur Video biar Full di dalam kotaknya */
#reader video {
  width: 100% !important;
  height: 60vh !important; /* Tinggi Video 60% layar */
  object-fit: cover !important;
  border-radius: 1rem;
}

/* Hilangkan background putih saat loading */
#reader__scan_region { background: transparent !important; }
</style>