<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const scanResult = ref('');
const guestData = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
let scanner = null;

// --- LOGIC SCANNER (Sama seperti sebelumnya) ---
const onScanSuccess = async (decodedText, decodedResult) => {
  if (isLoading.value) return; 

  let guestNameParam = null;
  try {
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

const onScanFailure = (error) => {}; // Kosongkan biar console bersih

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
    // QR Box kita set kotak juga
    qrbox: { width: 250, height: 250 },
    videoConstraints: {
      facingMode: "environment",
      aspectRatio: 1.0 // Paksa kamera rasio 1:1
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
    
    <div class="absolute top-10 text-center z-20">
      <h1 class="text-xl font-bold text-yellow-400 tracking-wider">SCANNER RESEPSI</h1>
      <p class="text-xs text-gray-400 mt-1">Posisikan QR di dalam kotak</p>
    </div>

    <div v-show="!guestData" class="relative w-full max-w-[320px] aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-500/80">
      
      <div v-if="errorMessage" class="absolute inset-0 flex items-center justify-center bg-black/80 z-30 px-4 text-center">
        <p class="text-red-500 font-bold text-lg animate-pulse">{{ errorMessage }}</p>
      </div>

      <div id="reader" class="w-full h-full"></div>

      <div class="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-white/50 rounded-tl-xl pointer-events-none"></div>
      <div class="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-white/50 rounded-tr-xl pointer-events-none"></div>
      <div class="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-white/50 rounded-bl-xl pointer-events-none"></div>
      <div class="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-white/50 rounded-br-xl pointer-events-none"></div>
    </div>

    <div v-if="guestData" class="w-full max-w-xs bg-white text-gray-800 p-6 rounded-3xl text-center shadow-2xl animate-bounce z-30">
      <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
        <span class="text-white text-3xl font-bold">✓</span>
      </div>
      <h2 class="text-xl font-bold text-green-600">BERHASIL!</h2>
      <div class="my-3 py-3 border-t border-b border-gray-200">
        <p class="text-2xl font-bold text-gray-900 leading-tight">{{ guestData.name }}</p>
        <span class="inline-block mt-2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
          {{ guestData.category }}
        </span>
      </div>
    </div>

    <button @click="router.push('/admin')" class="absolute bottom-10 bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition font-medium text-sm flex items-center gap-2">
      <span class="text-lg">✖</span> Tutup Scanner
    </button>

  </div>
</template>

<style>
/* --- CSS RESET & FORCE STYLE --- */

/* 1. Reset Container Library */
#reader {
  border: none !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

/* 2. Paksa Video Mengisi Kotak (Object Fit Cover) */
#reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important; /* Video dicrop biar full kotak */
  border-radius: 0 !important;
}

/* 3. Hilangkan elemen sampah bawaan library */
#reader__dashboard_section_csr span, 
#reader__dashboard_section_swaplink,
#reader__scan_region img { 
  display: none !important; 
}

/* 4. Background transparan */
#reader__scan_region {
  background: transparent !important;
}
</style>