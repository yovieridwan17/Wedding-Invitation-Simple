<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'; // Import Router
import { weddingData } from '../utilities/data';

const emit = defineEmits(['open']);
const route = useRoute();
const isHiding = ref(false); // State untuk animasi slide-up

// --- 1. AMBIL NAMA TAMU DARI URL ---
const guestName = computed(() => {
  const name = route.query.to; 
  if (name) {
    return name; 
  }
  return 'Tamu Spesial';
});

// --- 2. FUNGSI BUKA UNDANGAN (DENGAN ANIMASI) ---
const openInvitation = () => {
  // A. Trigger Animasi CSS (Slide ke atas)
  isHiding.value = true;

  // B. Tunggu animasi selesai (800ms), baru kabari Parent untuk mainkan lagu
  setTimeout(() => {
    emit('open');
  }, 800);
};
</script>

<template>
  <div 
    class="fixedw-full h-full relative inset-0 z-50 flex flex-col items-center justify-end pb-20 bg-black transition-transform duration-1000 ease-in-out"
    :class="{ '-translate-y-full': isHiding }"
  >
    <div class="absolute inset-0 bg-[url('../../public/images/BCK_2629.webp')] bg-cover bg-center opacity-40"></div>
    
    <div class="relative z-10 text-center px-4">
      <p class="font-body tracking-[0.3em] text-gray-300 mb-4 text-sm animate-pulse">THE WEDDING OF</p>
      
      <h1 class="font-alcantera text-5xl md:text-5xl text-gold leading-tight drop-shadow-sm mt-4 mb-4">
          {{ weddingData.groom.nickName }} &
          <!-- <!-- <span class="font-script text-4xl text-[#8B7355]">&</span>  -->
           {{ weddingData.bride.nickName }}
      </h1>

    

      <p class="font-body text-gray-300 mb-2 text-sm">
        Kepada Yth.<br>
        Bapak/Ibu/Saudara/i
      </p>
      
      <h2 class="font-bold text-2xl md:text-3xl text-gold mb-10 capitalize">
          {{ guestName }}
      </h2>

      <button 
        @click="openInvitation"
        class="group relative px-8 py-3 bg-gold text-dark font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all hover:scale-105 active:scale-95"
      >
        <span class="relative z-10 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.736 4 21.276 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648l12.812 6.968Z"/></svg>
          Buka Undangan
        </span>
      </button>
    </div>
    
  </div>
</template>