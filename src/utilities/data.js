// src/data.js

export const weddingData = {
  // --- Data Mempelai ---
  groom: {
    nickName: "Wildan", // Nama Panggilan
    fullName: "Muhammad Wildan Vicki Fahmi akbar, S.Kom., M.M", // Nama Lengkap
    father: "Alm. Bpk H.Moh Yusuf",
    mother: "Ibu Siti Fatimah, S.Pd",
    instagram : "@wildanvfa"
  },
  bride: {
    nickName: "Deva",
    fullName: "Deva Putri Dyana, S.Tp",
    father: "Bpk. Muhammad Daud",
    mother: "Ibu Syanti Dewi",
    instagram: "@devaptrdyn"
  },

  // --- Data Acara ---
  akad :{
    date: "Jumat, 05 Juni 2026", 
    date1: "05 juni 2026",
    dateIso: "2026-06-05T07:00:00",
    time: "08.00 WIB - Selesai",
    location: "Dsn.Sukoanyar RT:022/RW:006, Ds.Bakalan, Kec.Purwosari, Kab.Pasuruan",
    // OPSI 1: Masukkan link hasil "Share" dari Google Maps di sini
    mapLink: "https://maps.app.goo.gl/bx1SiusZiuiB5YfF9", 
  },
  resepsi : {
    date: "Jumat, 05 Juni 2026", 
    time: "Bebas",
    location: "Dsn.Sukoanyar RT:022/RW:006, Ds.Bakalan, Kec.Purwosari, Kab.Pasuruan",
    // OPSI 2: Jika dibiarkan kosong (""), nanti kode di bawah akan otomatis mencarikan alamat di location
    mapLink: "https://maps.app.goo.gl/bx1SiusZiuiB5YfF9", 
  },
  gift: {
     banks: [
       { name: "BCA", number: "1234567890", holder: "Muhammad Wildan vicki Fahmi Akbar" },
       { name: "MANDIRI", number: "1440017892974", holder: "Deva Putri Dyana" }
     ],
     address: "Alamat rumah untuk kirim kado..."
  },

  
  // --- Link ---
  mapLink: "https://maps.app.goo.gl/h752ssu9yaPCVgH38", // Link Google Maps
  calendarLink: "https://calendar.google.com/...", // Link Add to Calendar
  
  // --- Pesan ---
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
};