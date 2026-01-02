<script setup lang="ts">
import { weddingData } from '@/utilities/data';

</script>

<template>
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden" >
        <div class="absolute inset-0 bg-gray-800 opacity-50" > </div>
        <div class="relative z-10 text-center p-6" >
            <p class="text-sm tracking-[0.2em] uppercase mb-4" data-aos="fade-down" >
                The Wedding Of
            </p>
            <h1 class="font-heading text-6xl md:text-8xl text-gold mb-2" data-aos="zoom-in">{{ weddingData.groom.nickName }} & {{ weddingData.bride.nickName }}</h1>
            <p class="text-lg mt-4" data-aos="fade-up" > Friday, 05 June 2026</p>
        </div>
    </section>
</template>