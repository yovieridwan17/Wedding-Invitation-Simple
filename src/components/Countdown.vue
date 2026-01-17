<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { weddingData } from '../utilities/data'; 
// TIDAK ADA IMPORT GSAP DISINI!

const timer = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' });
let interval = null;
const targetDateStr = weddingData?.akad?.dateIso || "2025-12-30T08:00:00"; 
const targetDate = new Date(targetDateStr).getTime();

const updateTimer = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;
  if (distance < 0) {
    clearInterval(interval);
    timer.value = { days: '00', hours: '00', minutes: '00', seconds: '00' };
    return;
  }
  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  timer.value.days = d < 10 ? `0${d}` : d;
  timer.value.hours = h < 10 ? `0${h}` : h;
  timer.value.minutes = m < 10 ? `0${m}` : m;
  timer.value.seconds = s < 10 ? `0${s}` : s;
};

onMounted(() => {
  updateTimer();
  interval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <section class="custom-anim relative w-full h-screen overflow-hidden flex flex-col justify-end pb-32 md:pb-40 text-white">
    
    <div class="absolute inset-0 z-0">
        <img src="/images/BCK_2625.webp" class="w-full h-full object-cover " alt="Background Countdown">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute bottom-0 w-full h-[80%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 text-center">
        
        <div class="cnt-anim opacity-0 translate-y-10">
            <div class="mb-6 flex justify-center opacity-70">
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="#D4AF37" stroke-width="1"><path d="M0 10 Q10 0 20 10 Q30 20 40 10" /></svg>
            </div>
            <h2 class="font-aston text-3xl md:text-4xl text-[#D4AF37] mb-2 tracking-widest">Menuju Hari Bahagia</h2>
            <p class="font-serif italic text-white/90 mb-10 text-sm md:text-base max-w-lg mx-auto drop-shadow-md">Kami menantikan kehadiran para keluarga dan sahabat untuk menjadi saksi ikatan janji suci kami.</p>
        </div>

        <div class="flex flex-wrap justify-center gap-4 md:gap-8">
            
            <div class="cnt-anim opacity-0 scale-50 flex flex-col items-center">
                <div class="w-16 h-16 md:w-20 md:h-20 border border-[#D4AF37]/50 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-md shadow-lg">
                    <span class="font-trajan text-2xl md:text-3xl font-bold">{{ timer.days }}</span>
                </div>
                <span class="mt-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#D4AF37]">Hari</span>
            </div>

            <div class="cnt-anim opacity-0 scale-50 flex flex-col items-center">
                <div class="w-16 h-16 md:w-20 md:h-20 border border-[#D4AF37]/50 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-md shadow-lg">
                    <span class="font-trajan text-2xl md:text-3xl font-bold">{{ timer.hours }}</span>
                </div>
                <span class="mt-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#D4AF37]">Jam</span>
            </div>

            <div class="cnt-anim opacity-0 scale-50 flex flex-col items-center">
                <div class="w-16 h-16 md:w-20 md:h-20 border border-[#D4AF37]/50 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-md shadow-lg">
                    <span class="font-trajan text-2xl md:text-3xl font-bold">{{ timer.minutes }}</span>
                </div>
                <span class="mt-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#D4AF37]">Menit</span>
            </div>

            <div class="cnt-anim opacity-0 scale-50 flex flex-col items-center">
                <div class="w-16 h-16 md:w-20 md:h-20 border border-[#D4AF37] rounded-xl flex items-center justify-center bg-[#D4AF37]/20 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-pulse">
                    <span class="font-trajan text-2xl md:text-3xl font-bold text-[#D4AF37]">{{ timer.seconds }}</span>
                </div>
                <span class="mt-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#D4AF37]">Detik</span>
            </div>

        </div>

    </div>
  </section>
</template>