<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const scanResult = ref('');
const guestData = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
let scanner = null;

// --- LOGIC SCANNER (Tidak Berubah) ---
const onScanSuccess = async (decodedText, decodedResult) => {
  if (isLoading.value) return; 

  let guestNameParam = null;
  try {
    // Logic hash mode parsing
    if (decodedText.includes('to=')) {
      const splitUrl = decodedText.split('to='); 
      const rawName = splitUrl[1];
      guestNameParam = rawName.split('&')[0];
    } 
    
    if (guestNameParam) {
      const cleanName = decodeURIComponent(guestNameParam.replace(/\+/g, ' '));
      handleCheckIn(cleanName);
    } else {
      errorMessage.value = "QR Code tidak valid!";
      setTimeout(() => errorMessage.value = '', 3000);
    }
  } catch (e) {
    errorMessage.value = "Link rusak / tidak terbaca";
    setTimeout(() => errorMessage.value = '', 3000);
  }
};

const onScanFailure = (error) => {}; 

const handleCheckIn = async (name) => {
  isLoading.value = true;
  errorMessage.value = '';

  const { data, error } = await supabase.from('guests').select('*').ilike('name', name).single();

  if (error || !data) {
    errorMessage.value = `Tamu "${name}" tidak ditemukan!`;
    isLoading.value = false;
    return;
  }

  const { error: updateError } = await supabase.from('guests').update({ status: 'Hadir' }).eq('id', data.id);

  if (updateError) {
    errorMessage.value = "Gagal update status.";
  } else {
    guestData.value = data; 
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
    audio.play().catch(e => {});

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
    qrbox: { width: 300, height: 300 }, // Box fokus scanner diperbesar sedikit
    videoConstraints: {
      facingMode: "environment",
      aspectRatio: 1.0 
    }
  };
  
  scanner = new Html5QrcodeScanner("reader", config, false);
  scanner.render(onScanSuccess, onScanFailure);
});

onBeforeUnmount(() => {
  if (scanner) scanner.clear();
});
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col items-center justify-center p-4">
    
    <div class="absolute top-8 text-center z-20 w-full px-4">
      <h1 class="text-2xl font-bold text-yellow-400 tracking-wider drop-shadow-md">SCANNER RESEPSI</h1>
      <p class="text-sm text-gray-300 mt-1">Posisikan QR Tamu di dalam kotak</p>
    </div>

    <div v-show="!guestData" class="relative w-[85vw] max-w-[500px] aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-500/80 mt-[-50px]">
      
      <div v-if="errorMessage" class="absolute inset-0 flex items-center justify-center bg-black/80 z-30 px-4 text-center">
        <p class="text-red-500 font-bold text-lg animate-pulse">{{ errorMessage }}</p>
      </div>

      <div id="reader" class="w-full h-full"></div>

      <div class="absolute top-5 left-5 w-12 h-12 border-t-4 border-l-4 border-white/60 rounded-tl-2xl pointer-events-none"></div>
      <div class="absolute top-5 right-5 w-12 h-12 border-t-4 border-r-4 border-white/60 rounded-tr-2xl pointer-events-none"></div>
      <div class="absolute bottom-5 left-5 w-12 h-12 border-b-4 border-l-4 border-white/60 rounded-bl-2xl pointer-events-none"></div>
      <div class="absolute bottom-5 right-5 w-12 h-12 border-b-4 border-r-4 border-white/60 rounded-br-2xl pointer-events-none"></div>
    </div>

    <div v-if="guestData" class="w-full max-w-sm bg-white text-gray-800 p-8 rounded-3xl text-center shadow-2xl animate-bounce z-30">
      <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <span class="text-white text-4xl font-bold">✓</span>
      </div>
      <h2 class="text-2xl font-bold text-green-600">BERHASIL!</h2>
      <div class="my-4 py-4 border-t border-b border-gray-200">
        <p class="text-3xl font-bold text-gray-900 leading-tight">{{ guestData.name }}</p>
        <span class="inline-block mt-2 bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
          {{ guestData.category }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-10 w-full flex flex-col items-center gap-3">
        <router-link to="/admin" class="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-200 transition flex items-center gap-3 transform active:scale-95">
            <span>🏠</span> Kembali ke Dashboard
        </router-link>
        
        <p class="text-xs text-gray-500">Pastikan izin kamera aktif</p>
    </div>

  </div>
</template>

<style>
/* --- CSS RESET & FORCE STYLE --- */
#reader {
  border: none !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

#reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: 0 !important;
}

#reader__dashboard_section_csr span, 
#reader__dashboard_section_swaplink,
#reader__scan_region img { 
  display: none !important; 
}

#reader__scan_region {
  background: transparent !important;
}
</style>