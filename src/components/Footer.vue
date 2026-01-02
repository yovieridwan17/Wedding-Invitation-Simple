<script setup>
import { weddingData } from '@/utilities/data';

  // Footer Statis
  </script>
  
  <template>
    <footer class="py-12 bg-black text-center relative overflow-hidden">
      
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,_var(--color-gold),_transparent_70%)]"></div>
  
      <div class="container mx-auto px-6 relative z-10">
        
        <p class="text-gray-400 mb-6 text-sm italic" data-aos="fade-up">
          "Merupakan suatu kehormatan dan kebahagiaan bagi kami <br>
          apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu."
        </p>
  
        <h3 class="font-heading text-2xl text-white mb-8" data-aos="fade-up" data-aos-delay="100">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
  
        <h2 
          class="font-heading text-5xl md:text-6xl text-gold mb-12"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          {{weddingData.groom.nickName}} & {{ weddingData.bride.nickName }}
        </h2>
  
        <hr class="border-gray-800 w-1/2 mx-auto mb-8">
  
        <div class="text-gray-500 text-xs">
          <p class="mb-2">Created with <span class="text-red-500 animate-pulse">❤</span> by <span class="text-gold font-bold">Calon Suami (Wildan)</span></p>
          <p>&copy; 2026 The Wedding of Wildan & Deva. All Rights Reserved.</p>
        </div>
  
      </div>
    </footer>
  </template>