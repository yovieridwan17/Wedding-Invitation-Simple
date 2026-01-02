<script setup>
import { weddingData } from '@/utilities/data';

  // Data Lokasi (Bisa diganti nanti)
  const mapLink = "https://goo.gl/maps/bHq4..."; // Ganti dengan link Google Maps asli nanti
  </script>
  
  <template>
    <section class="py-24 bg-black relative text-white">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-gold)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
  
      <div class="container mx-auto px-6 relative z-10">
        
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="font-heading text-4xl md:text-5xl text-gold mb-4">Rangkaian Acara</h2>
          <p class="text-gray-400">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami pada:</p>
        </div>
  
        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <div 
            class="bg-dark-surface border border-gray-800 rounded-2xl p-8 text-center shadow-lg hover:border-gold/50 transition duration-500 relative overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
  
            <div class="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-6 text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0Z"/><path d="M2 10a8.2 8.2 0 0 1 5.8-5.8c4.6-1.5 9.4.5 10.9 5.1"/><path d="m17.5 11.5 1.9 1.9a3.4 3.4 0 0 1 0 4.8 3.4 3.4 0 0 1-4.8 0L12 15.5"/></svg>
            </div>
  
            <h3 class="font-heading text-3xl text-gold mb-2">Akad Nikah</h3>
            <p class="font-bold text-xl mb-4">{{weddingData.akad.date}}</p>
            
            <div class="space-y-2 text-gray-300 text-sm mb-8">
              <p>Pukul: <span class="text-gold font-bold">{{weddingData.akad.time}}</span></p>
              <p>Bertempat di:</p>
              <p class="font-medium text-white">Kediaman Mempelai Wanita</p>
              <p>{{weddingData.akad.location}}</p>
            </div>
          </div>
  
          <div 
            class="bg-dark-surface border border-gray-800 rounded-2xl p-8 text-center shadow-lg hover:border-gold/50 transition duration-500 relative overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
  
            <div class="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-6 text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
  
            <h3 class="font-heading text-3xl text-gold mb-2">Resepsi</h3>
            <p class="font-bold text-xl mb-4">{{ weddingData.resepsi.date }}</p>
            
            <div class="space-y-2 text-gray-300 text-sm mb-8">
              <p>Pukul: <span class="text-gold font-bold">{{weddingData.resepsi.time}}</span></p>
              <p>Bertempat di:</p>
              <p class="font-medium text-white">Kediaman Mempelai Wanita</p>
              <p>{{weddingData.resepsi.location}}</p>
            </div>
          </div>
  
        </div>
  
        <div class="text-center mt-12" data-aos="zoom-in">
          <a 
            :href="mapLink" 
            target="_blank"
            class="inline-flex items-center gap-2 px-8 py-3 bg-gold text-dark font-bold rounded-full hover:bg-white hover:text-black transition shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Lihat Lokasi Google Maps
          </a>
          <p class="mt-4 text-sm text-gray-500">Mohon doa restu Bapak/Ibu/Saudara/i merupakan suatu kehormatan dan kebahagiaan bagi kami.</p>
        </div>
  
      </div>
    </section>
  </template>
  
  <style>
  /* Animasi Shimmer (Kilau) Custom */
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  </style>