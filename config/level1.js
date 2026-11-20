/* Isi Level 1 Rumah Pohon Tasi (GDD bagian 5; brief bagian 5d dan 6). Semua teks ditulis khusus untuk gim ini.
   Teks sekilas: tiap paragraf daftar kalimat; peran 'awal' dan kata **tebal** menandai jalur sekilas (validator di Fase 2).
   Teks pindai: baris berisi potongan teks; {t, b} = nilai berbentuk b (waktu, harga, nama, tempat, ...).
   Kunang-kunang L1 = 100: hook 10, sekilas 2 x 15, pindai 3 x 10, kebiasaan 2 x 5, uji kilat 20. */
window.LEVEL1 = {
  kunang: { hook: 10, sekilas: 15, pindai: 10, kebiasaan: 5, uji: 20 },

  /* poster hook (brief 5d contoh 1) */
  poster: {
    judul: 'FESTIVAL SERIBU KUNANG',
    baris: [['Malam ini di Pohon Kunang'], ['Mulai pukul ', { t: '18.00', b: 'waktu' }], ['Bawa lentera daunmu dan ajak teman-temanmu!']],
    jawab: 1
  },

  /* Jurus Sekilas tingkat 1: 2 paragraf, kilau di jalur sekilas, lompatan bebas */
  sekilas: [
    {
      id: 'tarsius', judul: 'Tarsius, Si Mata Besar', rasi: 'Tarsius si Mata Besar',
      paragraf: [
        [{ t: 'Tarsius adalah hewan kecil bermata **sangat besar**.', p: 'awal' }, { t: 'Tubuhnya hanya sebesar kepalan tangan orang dewasa.' }, { t: 'Satu bola matanya kira-kira sebesar otaknya.' }],
        [{ t: 'Tarsius **aktif pada malam hari**.', p: 'awal' }, { t: 'Saat hari gelap, ia keluar untuk mencari serangga.' }, { t: 'Ia melompat jauh dari satu dahan ke dahan lain untuk menangkapnya.' }]
      ],
      tanya: 'Teks ini terutama membahas apa?',
      pilihan: [
        { t: 'Tarsius si mata besar yang aktif malam hari', jenis: 'benar' },
        { t: 'Cara tarsius menangkap serangga di dahan', jenis: 'sempit' },
        { t: 'Semua hewan yang hidup di hutan tropis', jenis: 'luas' }
      ]
    },
    {
      id: 'kunang', judul: 'Kunang-Kunang, Lampu Kecil dari Alam', rasi: 'Kunang-Kunang dan Cahayanya', gambar: { ilus: 'kunang', ket: 'Cahaya kunang-kunang keluar dari ujung perutnya.' },
      paragraf: [
        [{ t: 'Kunang-kunang adalah serangga yang dapat menghasilkan **cahaya** sendiri.', p: 'awal' }, { t: 'Cahaya itu keluar dari ujung perutnya.' }, { t: 'Warnanya bisa kuning, hijau, atau jingga pucat.' }],
        [{ t: 'Kunang-kunang memakai cahayanya untuk **berkomunikasi**.', p: 'awal' }, { t: 'Setiap jenis kunang-kunang punya pola kedip yang berbeda.' }, { t: 'Dengan pola itu, mereka saling mengenali dalam gelap.' }]
      ],
      tanya: 'Teks ini terutama membahas apa?',
      pilihan: [
        { t: 'Warna-warna cahaya kunang-kunang', jenis: 'sempit' },
        { t: 'Kunang-kunang dan cahayanya', jenis: 'benar' },
        { t: 'Lampu hias dari botol bekas', jenis: 'topik' }
      ]
    }
  ],

  /* Jurus Pindai tingkat 1: daftar 4 baris, kunci menyala, bentuk sudah dipilih, kilau aktif, tanpa Pastikan */
  pindai: [
    {
      id: 'harga', judul: 'Daftar Harga Kedai Madu', kolom: ['Menu', 'Harga'],
      baris: [['Madu hutan', { t: 'Rp5.000', b: 'harga' }], ['Kue lentera', { t: 'Rp3.000', b: 'harga' }], ['Teh serai', { t: 'Rp2.000', b: 'harga' }], ['Jagung bakar', { t: 'Rp4.000', b: 'harga' }]],
      tanya: ['Berapa harga ', { k: 'kue lentera' }, '?'], kunci: 'Kue lentera', bentuk: 'harga', jawab: 1
    },
    {
      id: 'penjaga', judul: 'Penjaga Festival', kolom: ['Nama', 'Menjaga'],
      baris: [[{ t: 'Pak Beruang Madu', b: 'nama' }, 'Panggung'], [{ t: 'Bu Lebah', b: 'nama' }, 'Kedai Madu'], [{ t: 'Om Berang', b: 'nama' }, 'Gondola Daun'], [{ t: 'Kak Kalong', b: 'nama' }, 'Pintu Masuk']],
      tanya: ['Siapa yang menjaga ', { k: 'Gondola Daun' }, '?'], kunci: 'Gondola Daun', bentuk: 'nama', jawab: 2
    },
    {
      id: 'acara', judul: 'Acara Festival', kolom: ['Pukul', 'Acara'],
      baris: [[{ t: '18.00', b: 'waktu' }, 'Pembukaan'], [{ t: '18.30', b: 'waktu' }, 'Lomba Lentera'], [{ t: '19.00', b: 'waktu' }, 'Tari Kunang-Kunang'], [{ t: '19.30', b: 'waktu' }, 'Pelepasan Kunang']],
      tanya: ['Pukul berapa ', { k: 'Lomba Lentera' }, ' dimulai?'], kunci: 'Lomba Lentera', bentuk: 'waktu', jawab: 1
    }
  ],

  /* Kebiasaan Kilat: pilih dua yang membantu (brief 5e) */
  kebiasaan: [
    { id: 'hati', t: 'Membaca dalam hati', bantu: true, tokoh: 'tasi', balas: 'Betul! Membaca dalam hati lebih cepat.' },
    { id: 'keras', t: 'Membaca keras kata demi kata', bantu: false, tokoh: 'ulin', balas: 'Membaca bersuara itu lambat, kata demi kata.' },
    { id: 'kunci', t: 'Langsung mencari kata kunci', bantu: true, tokoh: 'intai', balas: 'Betul! Mata langsung berhenti di kata kunci.' },
    { id: 'ulang', t: 'Mengulang-ulang kalimat yang sama', bantu: false, tokoh: 'tupi', balas: 'Mengulang kalimat membuat waktu habis.' }
  ],

  /* Uji Kilat Awal: bentuknya setara dengan Uji Kilat Akhir di L5 (6 baris, jawaban di baris ke-5). Waktu dicatat diam-diam. */
  uji: {
    id: 'uji-awal', judul: 'Jadwal Gondola Daun', kolom: ['Tujuan', 'Berangkat'],
    baris: [['Rumah Pohon', { t: '16.15', b: 'waktu' }], ['Telaga Teratai', { t: '16.30', b: 'waktu' }], ['Pasar Dahan', { t: '16.45', b: 'waktu' }],
      ['Air Terjun Embun', { t: '17.00', b: 'waktu' }], ['Bukit Bulan', { t: '17.10', b: 'waktu' }], ['Pohon Kunang', { t: '17.15', b: 'waktu' }]],
    tanya: ['Pukul berapa gondola ke ', { k: 'Bukit Bulan' }, ' berangkat?'], kunci: 'Bukit Bulan', bentuk: 'waktu', jawab: 4, kunciMenyala: false
  },

  kartuJurus: ['judul', 'kataTanya', 'dalamHati']
};

/* Daftar tugas Level 1 untuk mesin level umum (js/scenes/level.js). Kunang total = 100 (kuota L1). */
window.LEVELS = window.LEVELS || {};
window.LEVELS[1] = {
  latar: 'latarRumahPohon', musik: 'jelajah', kartuJurus: LEVEL1.kartuJurus,
  tugas: [
    { jenis: 'hook', poster: LEVEL1.poster, kunang: 10 },
    { jenis: 'sekilas', teks: LEVEL1.sekilas[0], pandu: true, tingkat: 1, kunang: 15 },
    { jenis: 'sekilas', teks: LEVEL1.sekilas[1], tingkat: 1, kunang: 15 },
    { jenis: 'pindai', dok: LEVEL1.pindai[0], pandu: true, tingkat: 1, kunang: 10 },
    { jenis: 'pindai', dok: LEVEL1.pindai[1], tingkat: 1, kunang: 10 },
    { jenis: 'pindai', dok: LEVEL1.pindai[2], tingkat: 1, kunang: 10 },
    { jenis: 'kebiasaan', kartu: LEVEL1.kebiasaan, kunang: 10 },
    { jenis: 'pindai', dok: LEVEL1.uji, uji: 'awal', kunang: 20 }
  ]
};
