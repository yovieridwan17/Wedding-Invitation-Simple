<script setup>
  import { ref, nextTick, onMounted, onUnmounted } from 'vue'; 
  import { supabase } from '../lib/supabase';
  import gsap from 'gsap'; 
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  // Import Components
  import Opening from '../components/Opening.vue';
  import Hero from '../components/Hero.vue';
  import Countdown from '../components/Countdown.vue';
  import Couple from '../components/Couple.vue';
  import Event from '../components/Event.vue';
  import Gallery from '../components/Gallery.vue';
  import Footer from '../components/Footer.vue';
  import Wishes from '../components/Wishes.vue';
  import Gift from '../components/Gift.vue';
  import AudioControl from '../components/AudioControl.vue';
  import { weddingData } from '../utilities/data'; 

  gsap.registerPlugin(ScrollTrigger);

  onMounted(async () => {
    const { data } = await supabase.from('wishes').select('*');
    console.log('Invitation Loaded', data);
  });

  // Bersihkan GSAP saat keluar
  onUnmounted(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
  });

  const isOpened = ref(false);
  const audioControl = ref(null);
  const openingLayer = ref(null);

  const handleOpenInvitation = async () => {
    if (audioControl.value) audioControl.value.playMusic();
    isOpened.value = true;
    
    await nextTick(); 

    // Tunggu sedikit agar DOM stabil
    setTimeout(() => {
        const scroller = document.getElementById("main-scroller");
        if (!scroller) return;

        ScrollTrigger.defaults({ scroller: "#main-scroller" });

        // 1. ANIMASI KHUSUS COUNTDOWN (Stagger Effect)
        // Kita cari semua elemen dengan class 'cnt-anim' di dalam scroller
        const countdownElements = scroller.querySelectorAll('.cnt-anim');
        
        if (countdownElements.length > 0) {
            gsap.to(countdownElements, {
                opacity: 1,
                y: 0,
                scale: 1, // Balik ke ukuran normal
                duration: 2,
                stagger: 0.4, // Muncul satu per satu (Jeda 0.2 detik)
                ease: "back.out(1.9)",
                scrollTrigger: {
                    trigger: ".custom-anim", // Memicu saat section countdown masuk
                    start: "top 60%", 
                    toggleActions: "play none none reverse"
                }
            });
        }

        // 2. ANIMASI GLOBAL (Untuk elemen lain selain Countdown & Hero)
        const sections = document.querySelectorAll('#main-scroller > *');
        sections.forEach((section, index) => {
            if (index === 0) return; // Skip Hero
            if (section.classList.contains('custom-anim')) return; // Skip Countdown (karena udah diurus di atas)

            gsap.fromTo(section, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%", 
                        toggleActions: "play none none reverse" 
                    }
                }
            );
        });
        // 3. ANIMASI KHUSUS COUPLE (Mempelai)
        // Mencari semua elemen dengan class .couple-anim di dalam scroller
        const coupleElements = scroller.querySelectorAll('.couple-anim');
        
        if (coupleElements.length > 0) {
           gsap.fromTo(coupleElements, 
             { 
               y: 50, 
               opacity: 0 
             }, 
             {
               y: 0,
               opacity: 1,
               duration: 2,
               stagger: 0.4, // Muncul berurutan (Jeda 0.2 detik)
               ease: "power2.out",
               scrollTrigger: {
                 trigger: ".couple-section", // Pemicu adalah wrapper section Couple
                 start: "top 75%",           // Mulai saat section masuk 75% layar
                 toggleActions: "play none none reverse"
               }
             }
           );
        }
        // 4. ANIMASI KHUSUS EVENT (Baru)
        // ==========================================================
        const eventElements = scroller.querySelectorAll('.event-anim');
        
        if (eventElements.length > 0) {
           gsap.fromTo(eventElements, 
             { 
               y: 80, 
               opacity: 0 
             }, 
             {
               y: 0,
               opacity: 1,
               duration: 2,
               stagger: 0.4, 
               ease: "power2.out",
               scrollTrigger: {
                 trigger: ".event-section", // Target section Event
                 start: "top 70%",          
                 toggleActions: "play none none reverse"
               }
             }
           );
        }
        // 5. ANIMASI GIFT (Amplop)
        // ==========================================================
        const giftElements = scroller.querySelectorAll('.gift-anim');
        
        if (giftElements.length > 0) {
           gsap.fromTo(giftElements, 
             { 
               scale: 0.9, 
               opacity: 0,
               y: 30
             }, 
             {
               scale: 1,
               opacity: 1,
               y: 0,
               duration: 2.4,
               stagger: 0.4, 
               ease: "back.out(1.7)", // Efek membal sedikit biar seperti kartu dilempar
               scrollTrigger: {
                 trigger: ".gift-section",
                 start: "top 70%",          
                 toggleActions: "play none none reverse"
               }
             }
           );
        }
    }, 500); // Delay 500ms

    // Animasi Buka Undangan
    if (openingLayer.value) {
        gsap.to(openingLayer.value, {
            yPercent: -100, 
            duration: 1.5,
            ease: "power4.inOut"
        });
    }
  };
</script>
<template>
  <div class="min-h-screen w-full flex bg-gray-900 overflow-hidden">
    <div class="hidden xl:block xl:w-[70%] bg-cover bg-center relative z-0" :style="{ backgroundImage: `url('/images/GREEN-LAND-PII.webp')` }">
         <div class="absolute inset-0 bg-black/60 flex flex-col items-end justify-center px-12 text-right">
             </div>
    </div>

    <div class="w-full xl:w-[30%] bg-dark text-white relative flex flex-col mx-auto shadow-2xl h-screen">
      <AudioControl ref="audioControl" v-show="isOpened" />
      <div ref="openingLayer" class="absolute inset-0 z-50 bg-dark w-full h-full">
         <Opening @open="handleOpenInvitation" />
      </div>
      <div id="main-scroller" ref="mainContent" v-if="isOpened" class="flex-1 overflow-y-auto overflow-x-hidden relative z-10 no-scrollbar">
        <Hero /> 
        <Countdown />
        <Couple />
        <Event />
        <Gallery />
        <Gift />
        <Wishes />
        <Footer />
      </div>
    </div>
  </div>
</template>