<script setup>
import { weddingData } from '../utilities/data'; 

// 1. AMBIL DATA
const akad = weddingData.akad;
const resepsi = weddingData.resepsi;

// 2. LOGIC MAPS YANG BENAR
const getMapLink = (eventData) => {
    // Cek apakah ada link spesifik yang diisi di data.js?
    if (eventData.mapLink && eventData.mapLink !== "" && !eventData.mapLink.includes("googleusercontent")) {
        return eventData.mapLink;
    }
    
    // Jika tidak ada link, buat link pencarian otomatis berdasarkan alamat (location)
    // Format resmi Google Maps Search API
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.location)}`;
};
</script>

<template>
  <section class="event-section relative w-full py-20 overflow-hidden text-white bg-slate-900">
    
    <div class="absolute inset-0 z-0">
        <img src="/images/BACKGROUND-GREEN-PII.webp" class="w-full h-full object-cover opacity-60" alt="BG Event" onerror="this.style.display='none'">
        <div class="absolute inset-0 bg-gradient-to-b from-[#1a2e25] via-[#1a2e25]/50 to-[#1a2e25]"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6">
        
        <div class="text-center mb-16">
            <h2 class="event-anim font-aston text-3xl md:text-5xl text-[#D4AF37] mb-4">Rangkaian Acara</h2>
            <p class="event-anim font-serif italic text-white/80 max-w-xl mx-auto">
                Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami pada:
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">

            <div class="event-anim group relative p-8 rounded-2xl border border-[#D4AF37]/30 bg-black/20 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] text-center flex flex-col items-center">
                
                <div class="mb-6 w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19.9 14.25a6 6 0 0 1-11.8 0"/><path d="M4.1 14.25a6 6 0 1 1 11.8 0"/><path d="M10 9c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg>
                </div>

                <h3 class="font-trajan text-3xl text-[#D4AF37] mb-6">Akad Nikah</h3>
                
                <div class="space-y-4 font-serif text-gray-200 mb-8 w-full">
                    <div class="flex flex-col items-center">
                        <span class="text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-1">Waktu</span>
                        <p class="text-lg font-bold">{{ akad.date }}</p>
                        <p>{{ akad.time }}</p>
                    </div>
                    
                    <div class="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto my-4"></div>

                    <div class="flex flex-col items-center">
                        <span class="text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-1">Tempat</span>
                        <p class="text-sm opacity-90 px-2 leading-relaxed">{{ akad.location }}</p>
                    </div>
                </div>

                <a :href="getMapLink(akad)" target="_blank" class="mt-auto inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a2e25] transition-colors duration-300 font-serif text-sm tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    Google Maps
                </a>
            </div>

            <div class="event-anim group relative p-8 rounded-2xl border border-[#D4AF37]/30 bg-black/20 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] text-center flex flex-col items-center">
                
                <div class="mb-6 w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                </div>

                <h3 class="font-trajan text-3xl text-[#D4AF37] mb-6">Resepsi</h3>
                
                <div class="space-y-4 font-serif text-gray-200 mb-8 w-full">
                    <div class="flex flex-col items-center">
                        <span class="text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-1">Waktu</span>
                        <p class="text-lg font-bold">{{ resepsi.date }}</p>
                        <p>{{ resepsi.time }}</p>
                    </div>
                    
                    <div class="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto my-4"></div>

                    <div class="flex flex-col items-center">
                        <span class="text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-1">Tempat</span>
                        <p class="text-sm opacity-90 px-2 leading-relaxed">{{ resepsi.location }}</p>
                    </div>
                </div>

                <a :href="getMapLink(resepsi)" target="_blank" class="mt-auto inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a2e25] transition-colors duration-300 font-serif text-sm tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    Google Maps
                </a>
            </div>

        </div>
    </div>
  </section>
</template>