<script setup>
import { ref, defineExpose } from "vue";

// 1. STATE MUSIK
const isPlaying = ref(false);
const audioPlayer = ref(null); // Ini untuk memegang elemen <audio>

// 2. FUNGSI PUTAR/PAUSE (Dipakai tombol piringan hitam)
const toggleMusic = () => {
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

// 3. FUNGSI UNTUK DIPANGGIL DARI LUAR (Oleh Invitation.vue)
const playMusic = () => {
  // Coba play, kalau error (karena browser block) kita tangkap
  audioPlayer.value
    .play()
    .then(() => {
      isPlaying.value = true;
    })
    .catch((error) => {
      console.log("Autoplay dicegah browser, user harus klik manual:", error);
      isPlaying.value = false;
    });
};

// 4. WAJIB: Buka akses fungsi ini ke luar
defineExpose({
  playMusic,
});
</script>

<template>
  <div class="fixed top-4 right-4 z-50">
    <audio ref="audioPlayer" src="../../audio/fix.mp3" loop></audio>

    <button
      @click="toggleMusic"
      class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center animate-spin-slow"
      :class="{ paused: !isPlaying }"
    >
      <span v-if="isPlaying">🎵</span>
      <span v-else>🔇</span>
    </button>
  </div>
</template>

<style scoped>
/* Animasi Putar Piringan */
.animate-spin-slow {
  animation: spin 4s linear infinite;
}
.paused {
  animation-play-state: paused;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
