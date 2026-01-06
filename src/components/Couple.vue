<script setup>
import { weddingData } from '../utilities/data'; 

// Data Safety (Hanya data, tidak ada animasi di sini)
const defaultGroom = { fullName: "Pria", fatherName: "Ayah", motherName: "Ibu" };
const defaultBride = { fullName: "Wanita", fatherName: "Ayah", motherName: "Ibu" };
const groom = weddingData?.groom || defaultGroom;
const bride = weddingData?.bride || defaultBride;
</script>

<template>
  <section class="couple-section relative w-full min-h-screen py-20 overflow-hidden text-white bg-slate-800">
    
    <div class="absolute inset-0 z-0">
        <img src="/images/ART-WHITE-03-scaled-1-1.jpg" class="w-full h-full object-cover" alt="BG" onerror="this.style.display='none'">
        <div class="absolute inset-0 bg-[#1a2e25]/20"></div> 
    </div>

    <div class="relative z-10 container mx-auto px-6 text-center">
        
        <div class="mb-12">
            <h2 class="couple-anim font-tempting text-3xl md:text-5xl text-green mb-4 font-bold">Mempelai</h2>
            <p class="couple-anim font-serif text-marron/80 max-w-xl mx-auto">
               Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami :
            </p>
        </div>

        <div class="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-10">

            <div class="flex flex-col items-center group">
                <div class="couple-anim relative w-[280px] h-[350px] mb-6 flex justify-center items-center">
                    <div class="relative w-full h-full overflow-hidden rounded-full border-[3px] border-[#D4AF37]/60 shadow-2xl z-20">
                        <img src="/images/IMG_20260106_091015_728.JPG" class="w-full h-full object-cover object-top" alt="Pria">
                    </div>
                </div>
                <div class="couple-anim relative z-40"> 
                    <h3 class="font-tempting text-4xl text-green font-bold mb-2 mt-2">{{ groom.nickName }}</h3>
                    <h3 class="font-alcantera text-xl text-marron mb-2">{{ groom.fullName }}</h3>
                    <p class="font-trajan text-sm text-[#284f20]">Putra dari {{ groom.father }} <br> & <br>{{ groom.mother }}</p>
                </div>
            </div>

            <div class="couple-anim font-aston text-5xl text-[#D4AF37] md:mt-[-100px] z-40">
                &
            </div>

            <div class="flex flex-col items-center group">
                <div class="couple-anim relative w-[280px] h-[350px] mb-6 flex justify-center items-center">
                    <div class="relative w-full h-full overflow-hidden rounded-full border-[3px] border-[#D4AF37]/60 shadow-2xl z-20">
                         <img src="/images/BCK_2630.JPG" class="w-full h-full object-cover" alt="Wanita">
                    </div>
                </div>
                <div class="couple-anim relative z-40 mb-35">
                    <h3 class="font-tempting text-4xl text-green font-bold mb-2 mt-2">{{ bride.nickName }}</h3>
                    <h3 class="font-alcantera text-xl text-marron mb-2">{{ bride.fullName }}</h3>
                    <p class="font-trajan text-sm text-[#284f20]">Putra dari {{ bride.father }} <br> & <br>{{ bride.mother }}</p>
                </div>
            </div>

        </div>
    </div>
  </section>
</template>