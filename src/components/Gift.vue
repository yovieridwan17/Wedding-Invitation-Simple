<script setup>
import { ref } from 'vue';
import { weddingData } from '../utilities/data'; 

// Ambil data gift dari data.js
const giftData = weddingData.gift;

// State untuk menyimpan status "Tersalin" per kartu (Array of boolean)
const copiedStates = ref(new Array(giftData.banks.length).fill(false));

// Fungsi Copy to Clipboard
const copyToClipboard = async (text, index) => {
    try {
        await navigator.clipboard.writeText(text);
        
        // Ubah status jadi true (muncul tulisan "Disalin!")
        copiedStates.value[index] = true;
        
        // Kembalikan ke semula setelah 2 detik
        setTimeout(() => {
            copiedStates.value[index] = false;
        }, 2000);
    } catch (err) {
        console.error('Gagal menyalin:', err);
    }
};
</script>

<template>
  <section class="gift-section relative w-full py-20 overflow-hidden text-white bg-slate-900">
    
    <div class="absolute inset-0 z-0">
        <img src="/images/GREEN-LAND-PII.webp" class="w-full h-full object-cover opacity-40" alt="BG Gift" onerror="this.style.display='none'">
        <div class="absolute inset-0 bg-[#1a2e25]/40"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6">
        
        <div class="text-center mb-16">
            <h2 class="gift-anim font-aston text-3xl md:text-5xl text-[#D4AF37] mb-6">Wedding Gift</h2>
            <p class="gift-anim font-serif italic text-white/80 max-w-xl mx-auto mb-4">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
            </p>
            <p class="gift-anim font-serif text-sm text-white/60 max-w-lg mx-auto">
                Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless melalui:
            </p>
        </div>

        <div class="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
            
            <div v-for="(bank, index) in giftData.banks" :key="index" 
                 class="gift-anim relative w-full max-w-sm h-56 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 group">
                
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffffff]/10 to-[#000000]/40 backdrop-blur-md border border-[#D4AF37]/30 shadow-xl group-hover:border-[#D4AF37]/60 transition-colors"></div>
                
                <div class="relative z-10 flex flex-col justify-between h-full">
                    
                    <div class="flex justify-between items-start">
                        <div class="font-trajan text-xl font-bold tracking-widest text-[#D4AF37] italic">
                            {{ bank.name }}
                        </div>
                        <div class="w-10 h-8 rounded bg-gradient-to-r from-yellow-200 to-yellow-500 opacity-80 shadow-inner flex items-center justify-center">
                             <div class="w-full h-[1px] bg-black/20"></div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 my-auto">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-mono text-2xl tracking-widest text-white shadow-black drop-shadow-md">
                                {{ bank.number }}
                            </span>
                            
                            <button @click="copyToClipboard(bank.number, index)" 
                                    class="p-2 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1a2e25] transition-all duration-300 backdrop-blur-sm"
                                    :title="copiedStates[index] ? 'Berhasil Disalin' : 'Salin Nomor'">
                                
                                <svg v-if="copiedStates[index]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                        </div>
                        
                        <span v-if="copiedStates[index]" class="text-xs text-[#D4AF37] font-bold animate-pulse">
                            Nomor berhasil disalin!
                        </span>
                    </div>

                    <div>
                        <p class="text-[10px] text-white/50 uppercase tracking-widest mb-1">Card Holder</p>
                        <p class="font-serif text-sm tracking-wide text-white/90 truncate uppercase">
                            {{ bank.holder }}
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="giftData.address" class="gift-anim max-w-2xl mx-auto text-center p-8 rounded-xl border border-dashed border-[#D4AF37]/40 bg-[#1a2e25]/50">
            <div class="w-12 h-12 mx-auto mb-4 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V7H4v5"/><path d="M22 22H2v-6h20v6Z"/><path d="M12 7v5"/><path d="M12 16v6"/><path d="M12 2h10v5h-5"/><path d="M2 2h10v5H7"/></svg>
            </div>
            <h3 class="font-trajan text-xl text-[#D4AF37] mb-2">Kirim Kado</h3>
            
            
            <button @click="copyToClipboard(giftData.address, 99)" 
                    class="inline-flex items-center gap-2 px-6 py-2 text-sm border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-[#1a2e25] transition-colors">
                <span v-if="copiedStates[99]">Alamat Disalin!</span>
                <span v-else>Salin Alamat</span>
            </button>
        </div>

    </div>
  </section>
</template>