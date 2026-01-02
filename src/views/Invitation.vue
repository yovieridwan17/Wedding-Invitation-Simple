<script setup>
  import { ref, nextTick, onMounted } from 'vue'; 
  import AOS from 'aos';
  import 'aos/dist/aos.css';
  import { supabase } from '../lib/supabase';
  
  // Import Semua Komponen Undangan
  import Decoration from './Decoration.vue';
  import Opening from '../components/Opening.vue';
  import Hero from './Hero.vue';
  import Countdown from './Countdown.vue';
  import Couple from './Couple.vue';
  import Event from './Event.vue';
  import Gallery from './Gallery.vue';
  import Footer from './Footer.vue';
  import Wishes from './Wishes.vue';
  import Gift from './Gift.vue';
  import AudioControl from './AudioControl.vue';
  
  // --- LOGIC DATABASE CHECK ---
  onMounted(async () => {
    // Logic cek koneksi supabase (biarkan di sini)
    const { data } = await supabase.from('wishes').select('*');
    console.log('Invitation Loaded', data);
  });

  // --- LOGIC UNDANGAN ---
  const isOpened = ref(false);
  const audioControl = ref(null);
  
  const handleOpenInvitation = async () => {
    isOpened.value = true;
    document.body.style.overflow = 'auto';
  
    if (audioControl.value) audioControl.value.playMusic();
  
    await nextTick();
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: false, mirror: true, offset: 50 });
    setTimeout(() => { AOS.refresh(); }, 1000);
  };
</script>
  
<template>
  <main class="relative bg-dark text-white min-h-screen">
      <AudioControl ref="audioControl" v-show="isOpened" />
      <Opening @open="handleOpenInvitation" />
  
      <div v-if="isOpened" class="w-full overflow-x-hidden">
        <Hero />
        <Countdown />
        <Couple />
        <Event />
        <Gallery />
        <Gift />
        <Wishes />
        <Footer />
      </div>
  </main>
</template>