<script setup>
import { onMounted, ref, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../utilities/data'; 

const dummyData = {
  groom: "Habib",
  bride: "Adiba",
  date: "Minggu, 30 Desember 2025"
};

gsap.registerPlugin(ScrollTrigger);

// Refs Layer
const heroSection = ref(null);
const layer1_Sky = ref(null);
const layer2_Landscape = ref(null);
const layer3_Gazebo = ref(null);
// const layer4_Gate = ref(null); // HAPUS INI KARENA SUDAH TIDAK DIPAKAI
const layer5_Blur = ref(null); // Ini Bunga Kiri-Kanan
const finalFrameLayer = ref(null); 
const titleWrapper = ref(null);

onMounted(async () => {
  setTimeout(async () => {
      await nextTick();

      // --- 1. SETUP ANGIN (WIND) ---
      const windEffect = (element, delay = 0, strength = 2) => {
        // Cek dulu apakah element ada? Kalau null jangan dijalankan
        if (!element) return; 

        gsap.to(element, {
            rotation: strength,   
            xPercent: 1.5,          
            duration: 3,        
            delay: delay,
            ease: "sine.inOut",   
            yoyo: true,           
            repeat: -1,           
            transformOrigin: "bottom center" 
        });
      };

      // Jalankan efek angin HANYA untuk layer yang aktif (Layer 5)
      // windEffect(layer4_Gate.value, 0, 2); <--- INI PENYEBAB ERROR (HAPUS)
      windEffect(layer5_Blur.value, 0, 3); 

      // --- 2. TIMELINE UTAMA ---
      const tl = gsap.timeline({
        defaults: {
          duration: 3,       
          ease: "power2.inOut" 
        }
      });

      // SET POSISI AWAL
      gsap.set(finalFrameLayer.value, { opacity: 0 }); 
      
      // HAPUS layer4_Gate.value DARI SINI
      gsap.set(layer5_Blur.value, { opacity: 0, scale: 1 }); 
      
      gsap.set(titleWrapper.value, { opacity: 0, y: 30 });

      // ANIMASI SEQUENCE
      tl
      // A. BACKGROUND GAZEBO
      .to(layer3_Gazebo.value, { scale: 1.4, opacity: 0 }, 0) 
      .to(layer2_Landscape.value, { scale: 1.2, opacity: 0 }, 0) 
      .to(layer1_Sky.value, { scale: 1.05 }, 0)

      // B. FRAME & BUNGA (MUNCUL BARENGAN)
      // HAPUS layer4_Gate.value DARI SINI JUGA
      .to([finalFrameLayer.value, layer5_Blur.value], { 
          opacity: 1, 
          duration: 2, 
          ease: "none"
      }, 0.5) 

      // C. TEKS NAMA
      .to(titleWrapper.value, { 
          opacity: 1, 
          y: 0, 
          duration: 1.5,      
          ease: "back.out(1.7)" 
      }, "-=1.0"); 

  }, 800); 
});
</script>

<template>
  <div ref="heroSection" class="relative w-full h-screen overflow-hidden bg-gray-200">
    
    <div ref="layer1_Sky" class="absolute inset-0 z-0">
        <img src="/images/GREEN-LAND-PII.webp" class="w-full h-full object-cover opacity-60 blur-[2px]" alt="Sky">
    </div>

    <div ref="layer2_Landscape" class="absolute inset-0 z-10">
        <img src="/images/GREEN-LAND-PII.webp" class="w-full h-full object-cover opacity-90 brightness-90" alt="Landscape">
    </div>

    <div ref="layer3_Gazebo" class="absolute inset-0 z-20 flex items-center justify-center">
        <div class="relative w-[85%] h-[60%] md:w-[60%] md:h-[70%] shadow-2xl overflow-hidden"
             style="mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%); 
                    -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);">
            <img src="/images/BACKGROUND6-GREEN-PII-e1761201319990.jpg" class="w-full h-full object-cover" alt="Gazebo">
        </div>
    </div>

    <div ref="finalFrameLayer" class="absolute inset-0 z-30 opacity-0">
        <img src="/images/FALLBACK-HIJAU-V2-MOTION-PII.webp" 
             class="w-full h-full object-cover" 
             alt="Final Frame">
        <div class="absolute inset-0 bg-black/10"></div>
    </div>

    <div ref="layer5_Blur" class="absolute inset-0 z-40 pointer-events-none flex justify-between items-end origin-bottom">
         <img src="/images/BUNGA6-GREEN-PII.webp" 
              class="w-[100%] h-auto object-contain" 
              alt="Flower Left Clear">
         
         <img src="/images/BUNGA6-GREEN-PII.webp" 
              class="w-[100%] h-auto object-contain -scale-x-100" 
              alt="Flower Right Clear">
    </div>

    <div class="absolute inset-0 z-50 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div ref="titleWrapper" class="p-8 opacity-0">
            <p class="font-serif text-green md:text-3xl text-xl lg:text-xl mb-4 drop-shadow-lg tracking-wider">The Wedding of</p>
            
            <h1 class="font-snell text-marron lg:text-5xl text-4xl md:text-7xl  mb-6 leading-tight font-bold">
              {{ weddingData?.groom?.nickName || dummyData.groom }} 
            
              &{{ weddingData?.bride?.nickName || dummyData.bride }}
            </h1>
            
            <div class="w-24 h-1 bg-gold mx-auto mb-6 rounded-full shadow-lg"></div>

            <p class="font-trajan text-green text-sm md:text-base uppercase tracking-[0.3em] font-bold">
                {{ weddingData.akad.date1}}
            </p>
           <a href="https://calendar.app.google/apk9os4SF7K3BQLB6" 
               target="_blank"
               class="mt-8 group relative px-8 py-3 bg-[#2c574d] text-white font-sans text-xs tracking-[0.2em] uppercase rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-gold/50 cursor-pointer z-50 inline-block">
               
               <div class="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
               
               <span class="relative flex items-center gap-2 ">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Save The Date
               </span>
            </a>
        </div>
    </div>
    
    <div class="absolute bottom-0 w-full h-40 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent z-45 pointer-events-none"></div>

  </div>
</template>