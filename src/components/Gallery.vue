<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- DATA 4 FOTO GALERI ---
const galleryImages = ref([
  { id: 1, src: '/images/1.JPG', alt: 'Momen 1' },
  { id: 2, src: '/images/2.JPG', alt: 'Momen 2' },
  { id: 3, src: '/images/3.JPG', alt: 'Momen 3' },
  { id: 4, src: '/images/4.JPG', alt: 'Momen 4' },
]);

// --- LOGIC LIGHTBOX (Pop-up) ---
const selectedImageIndex = ref(null);
const isLightboxOpen = ref(false);

const openLightbox = (index) => {
  selectedImageIndex.value = index;
  isLightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  setTimeout(() => (selectedImageIndex.value = null), 300);
  document.body.style.overflow = '';
};

// --- GSAP ANIMATION ---
let ctx;
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(".gallery-card", {
      scrollTrigger: {
        trigger: "#gallery-section",
        start: "top 70%",
      },
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out"
    });
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert(); 
});
</script>

<template>
  <section id="gallery-section" class="py-24 relative overflow-hidden text-white">
    
    <div class="absolute inset-0 z-0">
      
      <img 
        src="/images/BACKGROUND-GREEN-PII.webp" 
        alt="Background Gallery" 
        class="w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
    </div>
    <div class="container mx-auto px-6 relative z-10 max-w-4xl">
      
      <div class="text-center mb-16 gallery-header">
        <h2 class="font-serif text-4xl md:text-5xl text-yellow-500 mb-4 drop-shadow-lg">
          Our Moments
        </h2>
        <div class="w-24 h-[1px] bg-yellow-600/50 mx-auto mt-6"></div>
      </div>

      <div class="grid grid-cols-2 gap-4 md:gap-6">
        
        <div 
          v-for="(img, index) in galleryImages" 
          :key="img.id"
          class="gallery-card relative group cursor-pointer rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 aspect-[3/4]"
          @click="openLightbox(index)"
        >
          <img 
            :src="img.src" 
            :alt="img.alt" 
            class="w-full h-full object-cover transform transition duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
          />
          
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
            <span class="text-white text-xs tracking-widest uppercase border border-white/50 px-4 py-2 rounded-full backdrop-blur-md">
              Lihat Foto
            </span>
          </div>
        </div>

      </div>

      <Transition name="fade">
        <div v-if="isLightboxOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md" @click.self="closeLightbox">
          <button @click="closeLightbox" class="absolute top-6 right-6 text-white p-2 hover:text-yellow-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <img 
            :src="galleryImages[selectedImageIndex].src" 
            class="max-w-full max-h-[90vh] object-contain rounded shadow-2xl border border-white/10"
          />
        </div>
      </Transition>

    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>