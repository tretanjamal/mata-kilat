/* Level 5 Pohon Kunang (brief bagian 6): Malam Festival. (1) sekilas 3 artikel Kabar Rimba, pilih yang cocok untuk sambutan
   Pak Beruang Madu tentang menjaga kunang-kunang; (2) pindai Susunan Acara untuk 4 tamu dengan langkah Pastikan; (3) Tantangan Kilat
   6 soal campuran (pilih jurus, sekilas, pindai dari pembangkit); Uji Kilat Akhir (setara Uji Kilat Awal: 6 baris, jawaban di baris
   ke-5); lalu kunang terakhir dilepas dan festival dimulai. Kunang L5 = 300 (50 + 80 + 90 + 30 + 50). */
window.LEVELS = window.LEVELS || {};
(function () {
  var KABAR = {
    id: 'kabar', judul: 'Kabar Rimba', rasi: 'Kabar Rimba', panjang: true,
    bagian: [
      { judul: 'Lomba Lentera Paling Meriah', paragraf: [[{ t: 'Lomba menghias lentera tahun ini diikuti tiga puluh peserta.', p: 'awal' }, { t: 'Lentera terindah dibuat dari daun pisang kering.' }, { t: 'Pemenangnya diumumkan di panggung festival.' }]] },
      { judul: 'Matikan Lampu, Kunang Kembali', paragraf: [[{ t: 'Warga Rimba Pustaka sepakat **mematikan lampu** yang tidak perlu pada malam hari.', p: 'awal' }, { t: 'Cahaya yang terlalu terang membuat kunang-kunang sulit saling menemukan.' }, { t: 'Sejak lampu dikurangi, kunang-kunang terlihat lagi di tepi telaga.' }]] },
      { judul: 'Musim Buah di Pasar Dahan', paragraf: [[{ t: 'Pedagang di Pasar Dahan sedang panen buah.', p: 'awal' }, { t: 'Mangga, rambutan, dan manggis dijual dengan harga murah.' }, { t: 'Pengunjung datang sejak pagi untuk memilih buah terbaik.' }]] }
    ],
    soal: [{ tanya: 'Artikel mana yang cocok untuk sambutan tentang kunang-kunang?', inti: 'matikan lampu kunang kembali', pilihan: [
      { t: 'Lomba Lentera Paling Meriah', jenis: 'topik' }, { t: 'Matikan Lampu, Kunang Kembali', jenis: 'benar' }, { t: 'Musim Buah di Pasar Dahan', jenis: 'topik' }] }]
  };
  var W = function (t) { return { t: t, b: 'waktu' }; }, P = function (t) { return { t: t, b: 'tempat' }; };
  var ACARA = {
    id: 'acara', judul: 'Susunan Acara Festival Seribu Kunang', kolom: ['Acara', 'Pukul', 'Tempat'], kelas: 'tiga-kolom acara',
    baris: [['Pembukaan', W('18.00'), P('Panggung Utama')], ['Lomba Lentera', W('18.30'), P('Lapangan Lentera')], ['Tari Kunang-Kunang', W('19.00'), P('Panggung Telaga')],
      ['Dongeng Rimba', W('19.30'), P('Tenda Cerita')], ['Pelepasan Kunang', W('20.00'), P('Tepi Telaga')]],
    soal: [
      { tanya: 'Kak Kalong ingin menonton Tari Kunang-Kunang. Pukul berapa acaranya?', kunci: 'Tari Kunang-Kunang', bentuk: 'waktu', jawab: 2 },
      { tanya: 'Bu Lebah ingin mendengar Dongeng Rimba. Di mana tempatnya?', kunci: 'Dongeng Rimba', bentuk: 'tempat', jawab: 3 },
      { tanya: 'Om Berang ingin ikut Pelepasan Kunang. Pukul berapa acaranya?', kunci: 'Pelepasan Kunang', bentuk: 'waktu', jawab: 4 },
      { tanya: 'Di mana acara Pembukaan diadakan?', kunci: 'Pembukaan', bentuk: 'tempat', jawab: 0 }
    ]
  };
  var BULAN = {
    id: 'bulan', judul: 'Bulan Purnama', rasi: 'Bulan Purnama',
    paragraf: [
      [{ t: 'Bulan purnama terjadi saat **bulan tampak bulat penuh**.', p: 'awal' }, { t: 'Saat itu, seluruh sisi bulan yang menghadap bumi disinari matahari.' }],
      [{ t: 'Purnama datang **kira-kira sebulan sekali**.', p: 'awal' }, { t: 'Malam purnama terasa lebih terang sehingga cocok untuk festival.' }]
    ],
    soal: [{ tanya: 'Teks ini terutama membahas apa?', inti: 'bulan purnama', pilihan: [
      { t: 'Bulan purnama dan kapan terjadinya', jenis: 'benar' }, { t: 'Malam purnama terang dan cocok untuk festival', jenis: 'sempit' }, { t: 'Benda-benda di langit malam', jenis: 'luas' }] }]
  };
  var LENTERA = {
    id: 'lenteradaun', judul: 'Lentera Daun Pisang', rasi: 'Lentera Daun Pisang',
    paragraf: [
      [{ t: 'Lentera daun pisang dibuat dari **daun pisang kering**.', p: 'awal' }, { t: 'Daunnya dililitkan pada rangka bambu kecil, lalu diikat dengan tali.' }],
      [{ t: 'Cahaya di dalamnya membuat **daun tampak keemasan**.', p: 'awal' }, { t: 'Karena itu, lentera ini disukai saat festival.' }]
    ],
    soal: [{ tanya: 'Teks ini terutama membahas apa?', inti: 'lentera daun pisang', pilihan: [
      { t: 'Rangka bambu kecil', jenis: 'sempit' }, { t: 'Kebun pisang di tepi desa', jenis: 'topik' }, { t: 'Lentera dari daun pisang kering', jenis: 'benar' }] }]
  };
  var UJI = {
    id: 'uji-akhir', judul: 'Jadwal Perahu Daun', kolom: ['Tujuan', 'Berangkat'],
    baris: [['Dermaga Timur', W('18.05')], ['Pulau Kecil', W('18.20')], ['Teluk Teratai', W('18.35')], ['Batu Besar', W('18.50')], ['Hutan Bambu', W('19.05')], ['Pohon Kunang', W('19.20')]],
    tanya: ['Pukul berapa perahu ke ', { k: 'Hutan Bambu' }, ' berangkat?'], kunci: 'Hutan Bambu', bentuk: 'waktu', jawab: 4
  };
  /* Tantangan Kilat: dua soal pindai dari pembangkit (benih tetap, supaya sama di setiap perangkat) */
  function genPindai(templat, benih) { return { jenis: 'pindai', dokFn: function () { return Pembangkit.buat(templat, benih, 3); }, min: 3, max: 4, kunang: 15 }; }
  window.LEVELS[5] = {
    latar: 'latarPohonKunang', musik: 'jelajah', kartuJurus: [],
    teks: [KABAR, BULAN, LENTERA], dok: [ACARA, UJI],
    selesai: 'Kunang terakhir sudah bebas. Kalian Pembaca Kilat sejati!',
    tugas: [
      { jenis: 'cerita', ucapan: [['tasi', 'Ulin dan Tupi selamat! Bulan sudah terbit.', 'sorak'], ['tasi', 'Pak Beruang Madu butuh bantuan sebelum festival dimulai.', 'semangat']],
        tokoh: [['ulin', 600, 600, 0.9, 'senang'], ['tupi', 780, 600, 0.9, 'sorak', true]] },
      { jenis: 'sekilas', teks: KABAR, min: 3, max: 3, kunang: 50 },
      { jenis: 'pindai', dok: ACARA, min: 3, max: 4, kunang: 80 },
      { jenis: 'cerita', ucapan: [['tasi', 'Tantangan Kilat! Enam soal campuran.', 'semangat']] },
      { jenis: 'pilihJurus', item: { t: 'Pak Beruang Madu mencari nomor halaman cerita tentang tarsius di daftar isi.', jurus: 'pindai', alasan: 'Satu info? Pindai!' }, kunang: 15 },
      { jenis: 'sekilas', teks: BULAN, tingkat: 4, kunang: 15 },
      genPindai('harga', 7),
      { jenis: 'pilihJurus', item: { t: 'Bu Lebah ingin tahu Kabar Rimba hari ini membahas apa saja.', jurus: 'sekilas', alasan: 'Isi umum? Sekilas!' }, kunang: 15 },
      { jenis: 'sekilas', teks: LENTERA, tingkat: 4, kunang: 15 },
      genPindai('jadwal', 11),
      { jenis: 'pindai', dok: UJI, uji: 'akhir', kunang: 30 },
      { jenis: 'festival', kunang: 50 }
    ]
  };
})();
