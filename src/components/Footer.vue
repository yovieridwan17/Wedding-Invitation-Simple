<script setup>
// Logic tombol kembali ke atas (opsional jika ingin dipakai)
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <footer class="relative py-24 overflow-hidden font-serif">
    
    <div class="absolute inset-0 z-0"> <img 
        src="/images/BACKGROUND6-GREEN-PII-e1761201319990.jpg" 
        alt="Background Pattern" 
        class="w-full h-full object-cover mix-blend-multiply"
      />
    </div>
 <div class="absolute inset-0 bg-[#1a2e25]/40"></div>
    <div class="container mx-auto px-6 relative z-10 max-w-[400px]" data-aos="fade-up" data-aos-duration="1200">
      
      <div class="relative z-20 mx-auto w-full group">
        <div class="bg-[#f4f1ea] p-[5px] rounded-t-[160px] shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
          
          <img 
            src="/images/BCK_2610.JPG" 
            alt="Mempelai" 
            class="w-full h-[420px] object-cover rounded-t-[155px] p-2"
          />
        </div>
      </div>

      <div class="relative z-10 bg-[#f4f1ea] -mt-20 pt-24 pb-12 px-8 text-center rounded-b-[20px] shadow-2xl overflow-hidden border-t-0">
        
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

        <p class="relative z-20 text-[#3a3a3a] text-sm font-medium tracking-wide font-serif mb-6">
         Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
        </p>

        <div class="w-12 h-[2px] bg-[#8B735B] mx-auto mb-6 opacity-50"></div>

        <h3 class="font-alcantera text-[#8B735B] text-xl font-bold">
          Wildan & Deva
        </h3>

      </div>

    </div>
      <p class="text-alcantera relative z-10 text-center  text-white text-sm tracking-widest mt-10">Created with ❤️ by Calon Suami (Wildan)</p>

  </footer>
</template>

<style scoped>
/* Pastikan font Serif aktif */
.font-serif {
  font-family: 'Times New Roman', Times, serif; 
}
</style>