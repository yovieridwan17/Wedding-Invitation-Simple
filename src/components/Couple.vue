<script setup>
import { weddingData } from '@/utilities/data';

  // Tidak perlu logic khusus di sini, hanya tampilan statis
  </script>
  
  <template>
    <section class="py-24 bg-dark-surface relative">
      
      <div class="text-center mb-16 relative z-10" data-aos="fade-down">
        <h2 class="font-heading text-4xl md:text-5xl text-gold mb-4">Mempelai</h2>
        <p class="font-body text-gray-400 text-sm max-w-lg mx-auto px-4">
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
        </p>
      </div>
  
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full overflow-hidden md:overflow-visible p-4">
          
          <div 
            class="text-center group" 
            data-aos="fade-right" 
            data-aos-duration="1000"
            data-aos-offset="100"
          >
            <div class="relative w-48 h-48 mx-auto mb-8">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-[spin_10s_linear_infinite]"></div>
              
              <div class="absolute inset-2 rounded-full overflow-hidden border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <img 
                  src="/images/deva.jpg" 
                  alt="Wildan" 
                  class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                >
              </div>
            </div>
  
            <h3 class="font-heading text-3xl text-gold mb-2">{{ weddingData.groom.nickName }}</h3>
            <p class="font-body text-white font-medium mb-1">{{ weddingData.groom.fullName }}</p>
            <p class="text-gray-400 text-sm mb-4">
              Putra pertama dari {{ weddingData.groom.father }}<br>&<br>{{ weddingData.groom.mother }}
            </p>
            
            <a href="#" class="inline-flex items-center gap-2 text-xs text-gold border border-gold/50 px-4 py-1 rounded-full hover:bg-gold hover:text-dark transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              {{ weddingData.groom.instagram }}
            </a>
          </div>
  
          <div class="font-heading text-6xl text-gold/50 md:self-center" data-aos="zoom-in">
            &
          </div>
  
          <div 
            class="text-center group" 
            data-aos="fade-left" 
            data-aos-duration="1000"
            data-aos-offset="100"
          >
            <div class="relative w-48 h-48 mx-auto mb-8">
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-[spin_10s_linear_infinite_reverse]"></div>
              
              <div class="absolute inset-2 rounded-full overflow-hidden border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <img 
                  src="/images/wildan.jpg" 
                  alt="Deva" 
                  class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                >
              </div>
            </div>
  
            <h3 class="font-heading text-3xl text-gold mb-2">{{ weddingData.bride.nickName }}</h3>
            <p class="font-body text-white font-medium mb-1">{{weddingData.bride.fullName}}</p>
            <p class="text-gray-400 text-sm mb-4">
               Putri pertama dari {{weddingData.bride.father}} <br>& {{ weddingData.bride.mother }}
            </p>
  
            <a href="#" class="inline-flex items-center gap-2 text-xs text-gold border border-gold/50 px-4 py-1 rounded-full hover:bg-gold hover:text-dark transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              {{ weddingData.bride.instagram }}
            </a>
          </div>
  
        </div>
      </div>
    </section>
  </template>