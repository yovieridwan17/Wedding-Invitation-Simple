<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase'; // Import koneksi Supabase

// --- STATE VARIABLES ---
const name = ref('');
const message = ref('');
const attendance = ref('Hadir'); // Default pilihan
const wishes = ref([]); // Menampung daftar ucapan dari database
const isLoading = ref(false); // Loading saat kirim
const isError = ref(false);

// --- 1. AMBIL DATA UCAPAN DARI SUPABASE ---
const fetchWishes = async () => {
  // Select semua kolom, urutkan dari yang terbaru (descending)
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal ambil data:', error);
  } else {
    wishes.value = data;
  }
};

// --- 2. KIRIM UCAPAN KE SUPABASE ---
const submitWish = async () => {
  // Validasi input
  if (!name.value || !message.value) {
    alert("Mohon isi nama dan ucapan.");
    return;
  }

  isLoading.value = true;

  // Insert ke tabel 'wishes'
  const { error } = await supabase
    .from('wishes')
    .insert([
      { 
        name: name.value, 
        message: message.value, 
        attendance: attendance.value 
      }
    ]);

  isLoading.value = false;

  if (error) {
    console.error('Gagal kirim:', error);
    alert("Gagal mengirim ucapan. Coba lagi.");
  } else {
    // Jika sukses:
    // 1. Reset form
    name.value = '';
    message.value = '';
    attendance.value = 'Hadir';
    
    // 2. Refresh daftar ucapan biar yang baru langsung muncul
    fetchWishes();
    
    alert("Terima kasih atas doa dan ucapannya!");
  }
};

// Ambil data saat komponen pertama kali dimuat
onMounted(() => {
  fetchWishes();
});
</script>

<template>
  <section class="py-20 bg-dark text-white relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>

    <div class="container mx-auto px-6 relative z-10 max-w-4xl">
      
      <div class="text-center mb-12" data-aos="fade-down">
        <h2 class="font-heading text-3xl md:text-4xl text-gold mb-4">Wishes & Prayers</h2>
        <p class="text-gray-400 text-sm">Doa restu Anda merupakan karunia yang sangat berarti bagi kami.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12">
        
        <div class="bg-dark-surface p-8 rounded-2xl border border-gray-800 shadow-xl" data-aos="fade-right">
          <h3 class="text-xl text-white font-heading mb-6 border-b border-gray-700 pb-2">Kirim Ucapan</h3>
          
          <form @submit.prevent="submitWish" class="space-y-4">
            
            <div>
              <label class="block text-xs text-gold uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input 
                v-model="name"
                type="text" 
                placeholder="Nama Anda" 
                class="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              >
            </div>

            <div>
              <label class="block text-xs text-gold uppercase tracking-wider mb-2">Ucapan & Doa</label>
              <textarea 
                v-model="message"
                rows="4" 
                placeholder="Tuliskan doa restu..." 
                class="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs text-gold uppercase tracking-wider mb-2">Konfirmasi Kehadiran</label>
              <select 
                v-model="attendance"
                class="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              >
                <option value="Hadir">Saya akan Hadir</option>
                <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
                <option value="Masih Ragu">Masih Ragu</option>
              </select>
            </div>

            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <span v-if="isLoading">Mengirim...</span>
              <span v-else>Kirim Ucapan</span>
            </button>

          </form>
        </div>

        <div class="bg-dark-surface p-8 rounded-2xl border border-gray-800 shadow-xl h-[500px] flex flex-col" data-aos="fade-left">
          <h3 class="text-xl text-white font-heading mb-6 border-b border-gray-700 pb-2">
            {{ wishes.length }} Doa Terkirim
          </h3>
          
          <div class="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">
            
            <div 
              v-for="item in wishes" 
              :key="item.id" 
              class="bg-black/30 p-4 rounded-lg border-l-2 border-gold"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-white text-sm">{{ item.name }}</h4>
                <span 
                  class="text-[10px] px-2 py-1 rounded-full border"
                  :class="{
                    'bg-green-900/30 text-green-400 border-green-800': item.attendance === 'Hadir',
                    'bg-red-900/30 text-red-400 border-red-800': item.attendance === 'Tidak Hadir',
                    'bg-gray-700 text-gray-400 border-gray-600': !item.attendance || item.attendance === 'Masih Ragu'
                  }"
                >
                  {{ item.attendance }}
                </span>
              </div>
              
              <p class="text-gray-400 text-sm italic">"{{ item.message }}"</p>
              
              <p class="text-[10px] text-gray-600 mt-3 text-right">
                {{ new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>

            <div v-if="wishes.length === 0" class="text-center text-gray-500 py-10">
              Belum ada ucapan. Jadilah yang pertama mengirim doa!
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styling Scrollbar biar tipis & elegan */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1a1a1a; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d4af37; 
}
</style>