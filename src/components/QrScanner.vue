<script setup>
import { onMounted, ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabase';

const scanResult = ref('');
const guestData = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

// --- LOGIC SCANNER ---
const onScanSuccess = async (decodedText, decodedResult) => {
  // Mencegah scan berulang kali dalam waktu singkat
  if (isLoading.value) return; 

  // Format QR kita: https://domain.com/?to=Nama+Tamu
  // Kita perlu ambil bagian "Nama+Tamu" saja
  try {
    const url = new URL(decodedText);
    const guestNameParam = url.searchParams.get('to'); // Ambil parameter '?to='

    if (guestNameParam) {
      // Ubah "Budi+Santoso" jadi "Budi Santoso"
      const cleanName = guestNameParam.replace(/\+/g, ' '); 
      handleCheckIn(cleanName);
    } else {
      errorMessage.value = "QR Code tidak valid! (Bukan undangan kita)";
    }
  } catch (e) {
    errorMessage.value = "Bukan link undangan yang valid!";
  }
};

const onScanFailure = (error) => {
  // Biarkan kosong biar console tidak penuh error saat mencari QR
};

// --- LOGIC UPDATE DATABASE ---
const handleCheckIn = async (name) => {
  isLoading.value = true;
  scanResult.value = name;
  errorMessage.value = '';

  // 1. Cari Tamu di Database berdasarkan Nama (Case Insensitive ilike)
  // Kita pakai slug atau nama, tapi di URL tadi kita pakai nama.
  // Biar aman kita cari yang namanya mirip.
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .ilike('name', name) 
    .single();

  if (error || !data) {
    errorMessage.value = `Tamu atas nama "${name}" tidak ditemukan di database!`;
    isLoading.value = false;
    return;
  }

  // 2. Jika ketemu, Update Status jadi 'Hadir'
  const { error: updateError } = await supabase
    .from('guests')
    .update({ status: 'Hadir' })
    .eq('id', data.id);

  if (updateError) {
    errorMessage.value = "Gagal update status kehadiran.";
  } else {
    guestData.value = data; // Tampilkan data tamu sukses
    
    // Bunyikan suara 'Beep' sukses (Opsional)
    const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
    audio.play();

    // Reset scanner setelah 3 detik biar bisa scan tamu berikutnya
    setTimeout(() => {
      guestData.value = null;
      scanResult.value = '';
      isLoading.value = false;
    }, 3000);
  }
};

onMounted(() => {
  // Inisialisasi Scanner
  const scanner = new Html5QrcodeScanner(
    "reader", 
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  );
  scanner.render(onScanSuccess, onScanFailure);
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
    
    <h1 class="text-2xl font-bold mb-6 text-gold">Scan QR Tamu</h1>

    <div v-if="!guestData" class="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-lg mb-6">
      <div id="reader" class="w-full"></div>
    </div>

    <div v-else class="w-full max-w-md bg-green-600 p-8 rounded-xl text-center shadow-2xl animate-bounce">
      <h2 class="text-3xl font-bold mb-2">✅ BERHASIL!</h2>
      <p class="text-xl opacity-90">Selamat Datang,</p>
      <p class="text-4xl font-heading font-bold mt-2 text-yellow-300">{{ guestData.name }}</p>
      <p class="mt-4 bg-black/20 inline-block px-4 py-1 rounded-full text-sm">
        Kategori: {{ guestData.category }}
      </p>
    </div>

    <div v-if="errorMessage" class="w-full max-w-md bg-red-500 p-4 rounded-xl text-center mb-4">
      <p class="font-bold">❌ {{ errorMessage }}</p>
    </div>
    
    <p class="text-gray-500 text-xs mt-8">Arahkan kamera ke QR Code Undangan</p>
    <router-link to="/admin" class="mt-4 text-blue-400 hover:underline">Kembali ke Dashboard</router-link>

  </div>
</template>

<style>
/* Styling bawaan library biar rapi di Dark Mode */
#reader { border: none !important; }
#reader__scan_region { background: white; }
#reader__dashboard_section_csr button { 
  background: #d4af37; color: black; border: none; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-top: 10px;
}
</style>