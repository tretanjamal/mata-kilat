/* Semua teks UI Mata Kilat (standar studio bagian 2), supaya mudah ditinjau guru.
   Teks bacaan dan soal ada di config/level1.js. Fase dan kelas tidak ditulis di mana pun (permintaan kreator). */
window.STR = {
  judul: { lengkap: 'Mata Kilat: Jurus Skimming dan Scanning', logo: 'MATA KILAT', sub: 'Jurus Skimming dan Scanning', slogan: 'Cepat dan tepat!' },
  putar: 'Putar perangkatmu supaya mendatar, ya.',
  muat: 'Menyalakan lentera',
  muatTahu: 'Tahukah kamu? ',
  muatTips: [
    'Mata tarsius sangat besar. Satu bola matanya kira-kira sebesar otaknya.',
    'Tarsius tidak bisa menggerakkan bola matanya, jadi ia memutar kepalanya.',
    'Kunang-kunang sebenarnya termasuk kumbang.',
    'Cahaya kunang-kunang hampir tidak menghasilkan panas.',
    'Membaca dalam hati biasanya lebih cepat daripada membaca dengan bersuara.',
    'Kamus disusun menurut abjad, jadi kita bisa langsung melompat ke huruf awal kata.',
    'Tarsius bisa melompat sampai puluhan kali panjang tubuhnya.',
    'Di Sulawesi Utara, tarsius dikenal dengan nama tangkasi.',
    'Kunang-kunang menetas dari telur, lalu menjadi larva, kepompong, dan kunang-kunang dewasa.',
    'Kukang dan tarsius termasuk satwa dilindungi. Kukang bukan hewan peliharaan.',
    'Sepandai-pandai tupai melompat, akhirnya jatuh juga: orang pandai pun bisa keliru.',
    'Daftar isi dan indeks membantu kita memindai isi buku.'
  ],
  ikon: {
    pengaturan: 'Pengaturan', layarPenuh: 'Layar penuh', keluarPenuh: 'Keluar dari layar penuh', fsDitolak: 'Layar penuh tidak tersedia di perangkat ini.',
    suaraNyala: 'Suara menyala. Ketuk untuk mematikan.', suaraMati: 'Suara mati. Ketuk untuk menyalakan.',
    suaraSenyap: 'Suara sedang dimatikan. Nyalakan lewat tombol suara.', suaraTokohMati: 'Suara arahan sedang dimatikan.',
    dengarInstruksi: 'Dengarkan arahan', jeda: 'Jeda', bukuJurus: 'Buku Jurus', bantuan: 'Bantuan', video: 'Video pembuka: angin senja menerbangkan halaman buku dari rumah pohon Tasi'
  },
  tombol: {
    tutup: 'Tutup', mulai: 'MULAI', lenteraku: 'Lenteraku', informasi: 'Informasi', referensi: 'Referensi', pengembang: 'Pengembang',
    berangkat: 'Berangkat!', simpan: 'Simpan', jawab: 'Jawab', lanjut: 'Lanjut', ulangi: 'Ulangi', peta: 'Peta', menuUtama: 'Menu Utama',
    lewati: 'Lewati', bantuan: 'Bantuan', lihatTeks: 'Lihat teks', lihatPilihan: 'Pilihan', mulai2: 'Mulai', belajarku: 'Hasil Belajarku'
  },
  /* narasi video pembuka V1 (8 detik): [detik mulai, tokoh ('' = pencerita), kalimat]. Dibacakan bila "Bacakan arahan" menyala, keterangan selalu tampil. */
  videoNarasi: [
    [0.2, '', 'Senja di Rimba Pustaka. Tasi tertidur.'],
    [2.6, '', 'Wuus! Angin menerbangkan halaman buku!'],
    [5.0, 'tasi', 'Halamanku! Ayo, kita kejar!']
  ],
  ulang: { judul: 'Ulang Kilat!', ajak: 'Ada {n} soal yang tadi keliru. Coba soal serupa!' },
  pengaturan: {
    judul: 'Pengaturan', musik: 'Musik', efek: 'Efek suara', bacakan: 'Arahan dibacakan',
    santai: 'Mode Santai', santaiCatatan: 'Tanpa waktu, kilau selalu menyala',
    kurangi: 'Kurangi animasi', kurangiCatatan: 'Diatur oleh perangkat',
    hurufBesar: 'Huruf bacaan besar', hurufBesarCatatan: 'Teks bacaan lebih besar',
    nyala: 'Nyala', mati: 'Mati',
    muridBaru: 'Murid baru', muridBaruCatatan: 'Hapus kemajuan di perangkat ini', hapus: 'Hapus', yakin: 'Yakin? Ketuk lagi'
  },
  jeda: { judul: 'Jeda', kunang: '{n} kunang-kunang terkumpul', lanjut: 'Lanjut', ulangi: 'Ulangi level', peta: 'Peta Jelajah', pengaturan: 'Pengaturan', keJudul: 'Menu Utama' },
  kartu: {
    judul: 'Kartu Penjelajah', ajak: 'Pilih warna lenteramu!', catatan: 'Warna lentera menjadi warna pita sorotmu.',
    warna: { kuning: 'Kuning', hijau: 'Hijau', jingga: 'Jingga', ungu: 'Ungu' }
  },
  peta: {
    judul: 'Peta Jelajah', terkunci: 'Selesaikan level sebelumnya dulu.', segera: 'Level ini sedang disiapkan.',
    level: ['Rumah Pohon', 'Telaga Teratai', 'Pasar Dahan', 'Air Terjun Embun', 'Pohon Kunang', 'Bukit Bulan'],
    ajak: 'Ketuk Rumah Pohon untuk mulai!'
  },
  hud: { tujuan: 'Tujuan', cari: 'Cari', permintaan: 'Minta', kunang: 'Kunang-kunang terkumpul: {n}' },
  langkah: { kunci: 'Kunci', bentuk: 'Bentuk', sorot: 'Sorot', pastikan: 'Pastikan' },
  bentuk: { waktu: 'Waktu', tanggal: 'Tanggal', angka: 'Angka', harga: 'Harga', nama: 'Nama', tempat: 'Tempat', arti: 'Arti' },
  mantra: { judul: 'Judul', awal: 'Awal', tebal: 'Tebal', gambar: 'Gambar' },
  lompatan: 'Lompatan', bebas: 'bebas',
  baki: { judul: 'Tangkap:', kosong: 'Geser sorot ke baris lain.' },
  bintangKilat: 'Bintang Kilat! Cepat dan tepat!',
  sisaLompat: 'Sisa {n} dari {t} lompatan',
  pastikan: { judul: 'Pastikan', tanya: 'Jawabannya {n}?', ya: 'Ya, ini jawabannya', lagi: 'Cari lagi' },
  frasaTujuan: 'Baca sekelompok kata sekaligus!', frasaMulai: 'Mulai',
  terataiTujuan: 'Halaman ini masuk buku apa?',
  jurus: { sekilas: 'Sekilas', sekilasKecil: 'isi umum', pindai: 'Pindai', pindaiKecil: 'satu info' },
  lepaskan: 'Lepaskan!',
  kebiasaanTanya: 'Mana yang membantu membaca cepat?',
  dengar: 'Dengarkan arahan',

  /* ucapan Tasi di Level 1 (satu kalimat per langkah, maksimal 2 baris) */
  tasi: {
    hook1: 'Ada pesan! Lompat ke judulnya!',
    hookSalah: 'Judulnya dulu, ya!',
    hook2: 'Pukul berapa mulainya? Geser sorotnya!',
    hook3: 'Ketuk jamnya!',
    hook4: 'Ayo kumpulkan kunang-kunang sebelum bulan terbit!',
    sekilasPengantar: 'Jurus Sekilas: Judul, Awal, Tebal, Gambar!',
    sekilasGambar: 'Ada gambar! Buka keterangannya, itu juga jalur sekilas.',
    sekilasJudul: 'Ketuk judulnya dulu.',
    sekilasAwal: 'Sekarang kalimat awal paragraf.',
    sekilasAwal2: 'Lompat ke kalimat awal berikutnya.',
    sekilasJawab: 'Cukup! Ketuk Jawab.',
    sekilasBebas: 'Lompat ke bagian penting saja!',
    sekilasTengah: 'Bagian tengah berisi rincian. Coba kalimat awal.',
    lihatMata: 'Pilihan menutupi teks? Ketuk Lihat teks.',
    bantuanLanjut: 'Dengarkan ceritanya, lalu ketuk Lanjut.',
    bantuanUlang: 'Ketuk Mulai, lalu coba soal yang mirip.',
    bantuanFestival: 'Misimu berhasil! Lihat kunang-kunang menyala.',
    lihatKembali: 'Sudah dilihat? Ketuk Pilihan untuk menjawab.',
    sekilasTanya: 'Teks ini terutama membahas apa?',
    pindaiPengantar: 'Jurus Pindai: Kunci, Bentuk, Sorot, Pastikan!',
    pindaiSiap: 'Kunci dan bentuknya sudah kusiapkan.',
    pindaiSorot: 'Geser sorot sampai bertemu kata kunci!',
    pindaiKetemu: 'Itu dia! Ketuk {bentuk}nya.',
    pindaiBenar: ['Tertangkap!', 'Cepat dan tepat!', 'Mata Kilat!'],
    pindaiSalah: 'Itu {bentuk} untuk {baris}. Cari baris {kunci}.',
    pindaiSalah2: 'Lihat baris yang ada kata kuncinya.',
    pindaiSalah3: 'Ini barisnya. Ketuk {jawab}!',
    kebiasaan: 'Pilih 2 kebiasaan yang membantu!',
    uji: 'Tantangan terakhir. Temukan jawabannya!',
    selesai: 'Hebat! Rumah Pohon terang lagi!',
    benarSekilas: ['Tepat! Isi umumnya tertangkap.', 'Hebat! Kamu menangkap isinya.'],
    salahSempit: 'Itu salah satu rinciannya. Apa isi seluruh teks?',
    salahLuas: 'Itu terlalu luas. Teks ini membahas satu hal.',
    salahTopik: 'Teks ini tidak membahas itu. Lihat judulnya.',
    salah2: 'Lihat judul dan kalimat awal yang bersinar.',
    salah3: 'Judul dan kalimat awal membahas {rasi}.',
    salahParagraf: 'Itu isi paragraf lain. Lihat paragraf yang bersinar.',
    sekilasUtuh: 'Teks utuh! Pakai jurusmu sendiri.',
    sekilasBatas: 'Kamu punya {n} lompatan. Pilih yang penting!',
    sekilasHabis: 'Lompatan habis. Ayo jawab!',
    pindaiKunci: 'Ketuk kata kunci di pertanyaan!',
    soalBerikut: 'Soal berikutnya. Mana kata kuncinya?',
    kunciTanya: 'Itu kata tanya. Kata kunci adalah kata yang dicari di teks.',
    kunciUmum: 'Kata itu tidak membedakan barisnya. Cari yang khusus.',
    kunciLagi: 'Bagus! Ada satu kata kunci lagi.',
    pindaiBentuk: 'Jawabannya berbentuk apa?',
    bentukSalah: { waktu: '"Pukul berapa" menanyakan waktu.', tanggal: '"Kapan" menanyakan hari atau tanggal.', harga: '"Berapa harga" menanyakan harga dalam rupiah.',
      nama: '"Siapa" menanyakan nama, biasanya berhuruf kapital.', tempat: '"Di mana" menanyakan tempat.', angka: '"Berapa" menanyakan angka atau jumlah.', arti: '"Apa arti" menanyakan keterangan kata.' },
    pastikan: 'Pastikan dulu: benarkah ini jawabannya?',
    pastikanLagi: 'Bagus, kamu teliti! Cari lagi.',
    kamusHuruf: 'Kamus urut abjad. Lompat ke huruf {h} dulu.',
    kamusLompat: 'Kamus urut abjad. Ketuk huruf {h} untuk melompat!',
    kamusMulai: 'Ketuk huruf awal katanya dulu!',
    teliti: 'Petunjuk dibaca teliti, langkah demi langkah.',
    telitiSelesai: 'Lentera menyala lagi!',
    frasa: 'Lihat sekejap, lalu pilih yang sama!',
    frasaSalah: 'Hampir! Lihat sekelompok kata sekaligus.',
    frasaLihat: 'Ini frasanya. Pilih yang sama.',
    frasaSelesai: 'Matamu makin kilat!',
    teratai: 'Sekilas, lalu masukkan ke bukunya!',
    terataiSalah: 'Coba lihat kalimat awalnya lagi.',
    terataiLihat: 'Halaman ini masuk buku {buku}.',
    terataiBenar: ['Tepat masuk!', 'Hebat!', 'Rapi sekali!'],
    terataiBerantai: 'Berantai! Tiga benar berturut-turut!',
    pilihJurus: 'Jurus mana yang cocok?',
    pilihMantra: 'Isi umum? Sekilas. Satu info? Pindai.',
    peragaanSekilas: 'Aku lompat-lompat, tetapi infonya tak kutemukan!',
    peragaanPindai: 'Aku sorot satu kata, tetapi isinya tak tertangkap!',
    festival1: 'Ketuk Lepaskan untuk kunang terakhir!',
    festival2: 'Festival Seribu Kunang dimulai!',
    ulang: 'Ulang Kilat! Salah itu bagian dari belajar.',
    ulangSelesai: 'Hebat! Kamu belajar dari kesalahan.',
    tebak: 'Wah, kamu secepat Tupi! Namun, pastikan dulu, ya.'
  },
  ulin: { tengah: 'Hoaam... bagian tengah panjang sekali.' },
  tupi: { cepat: 'Wah, aku mau secepat kamu!' },

  hasil: {
    judul: 'Rumah Pohon Terang!', judulLevel: ['Rumah Pohon Terang!', 'Telaga Teratai Terang!', 'Pasar Dahan Terang!', 'Air Terjun Embun Terang!', 'Festival Dimulai!', 'Tantangan Bulan Selesai!'], rekor: 'Rekor terbaikmu: {b} bintang', kunang: 'Kunang-kunang', kartuBaru: 'Kartu Jurus baru',
    bintang: ['Selesai!', 'Teliti!', 'Mata Kilat!'], lanjut: 'Lanjut', ulangi: 'Ulangi',
    keterangan: '1 bintang: selesai. 2 bintang: 70% benar pada coba pertama. 3 bintang: 90% benar dan lompatan jitu.',
    ulang: 'Ulang Kilat: {b} dari {n} tepat'
  },

  /* Hasil Belajarku (brief bagian 2 dan 3c): keterampilan dalam bahasa anak, tanpa kata "gagal" */
  belajarku: {
    judul: 'Hasil Belajarku', sapa: 'Ini jurus Mata Kilat yang sudah kamu latih!',
    tag: ['pilih-jurus', 'jalur-sekilas', 'isi-umum', 'kata-kunci', 'pindai-tepat', 'kebiasaan-kilat'],
    kalimat: {
      'pilih-jurus': 'Aku tahu kapan memakai Jurus Sekilas dan Jurus Pindai.',
      'jalur-sekilas': 'Aku melompat ke judul, kalimat awal, kata tebal, dan gambar.',
      'isi-umum': 'Aku bisa menangkap isi bacaan dengan cepat.',
      'kata-kunci': 'Aku tahu kata yang harus kucari dan bentuk jawabannya.',
      'pindai-tepat': 'Aku bisa menemukan informasi dengan cepat dan tepat.',
      'kebiasaan-kilat': 'Aku membaca dalam hati dan tidak mengulang-ulang.'
    },
    status: { dikuasai: 'Dikuasai', berkembang: 'Berkembang', latihan: 'Ayo latih lagi', belum: 'Belum dicoba' },
    ujiCepat: 'Mata Kilatmu {x} kali lebih cepat!', ujiTeliti: 'Kamu makin teliti!', ujiBelum: 'Selesaikan Pohon Kunang untuk melihat kecepatan Mata Kilatmu.',
    ringkas: '{b} dari 15 bintang, {k} kunang-kunang',
    guru: 'Catatan untuk Guru', peta: 'Peta Jelajah', ulangi: 'Ulangi Level 5'
  },

  /* Catatan untuk Guru (brief bagian 13b): tanpa nama, tanpa data pribadi, tanpa fase dan kelas */
  guru: {
    judul: 'Catatan untuk Guru',
    tab: { keterampilan: 'Keterampilan', ringkasan: 'Ringkasan', saran: 'Kesalahan dan Saran' },
    kolom: { tag: 'Keterampilan', bukti: 'Benar coba pertama', ulang: 'Ulang Kilat', status: 'Status' },
    nama: {
      'pilih-jurus': 'Memilih teknik sesuai tujuan membaca',
      'jalur-sekilas': 'Membaca bagian penting saat skimming (Lompatan Jitu)',
      'isi-umum': 'Menemukan topik, gagasan utama, dan judul',
      'kata-kunci': 'Menentukan kata kunci dan bentuk jawaban',
      'pindai-tepat': 'Menemukan dan memastikan informasi tertentu',
      'kebiasaan-kilat': 'Kebiasaan membaca cepat'
    },
    ambang: 'Dikuasai: minimal 80% benar pada coba pertama dengan kesempatan cukup (kebiasaan 75%). Ayo latih lagi: di bawah 50%. Langkah yang dipandu tidak dihitung.',
    kolomLevel: { level: 'Level', bintang: 'Bintang', petunjuk: 'Petunjuk 1/2/3', ulang: 'Ulang Kilat', main: 'Main' },
    belumMain: 'Belum dimainkan',
    waktu: 'Lama bermain: {m} menit', selesai: 'Level selesai: {n} dari 5', santai: 'Mode Santai: {s}',
    jitu: 'Lompatan Jitu: {p}', rataSekilas: 'Rata-rata waktu soal sekilas: {d} detik', rataPindai: 'Rata-rata waktu soal pindai: {d} detik',
    uji: 'Uji Kilat: awal {a} detik, akhir {b} detik', ujiBelum: 'Uji Kilat: belum lengkap',
    catatanWaktu: 'Gim tidak mengukur kata per menit. Waktu Uji Kilat hanya perkiraan; teks awal dan akhir setara bentuknya.',
    ringkasanJudul: 'Ringkasan', levelJudul: 'Per level (permainan terakhir)',
    miskJudul: 'Kesalahan tersering', miskKosong: 'Belum ada kesalahan yang tercatat.', miskKali: '{n} kali',
    baikJudul: 'Kebiasaan baik', baik: 'Langkah Pastikan mencegah jawaban keliru sebanyak {n} kali.',
    saranJudul: 'Saran tindak lanjut',
    misk: {
      'sekilas-tengah': ['Membaca bagian tengah saat menyekilas', 'Murid masih membaca rincian. Tanyakan: bagian mana yang membawa gagasan utama?'],
      'sekilas-sempit': ['Memilih rincian sebagai isi utama', 'Diskusikan: pilihan itu membahas seluruh teks atau satu bagian saja?'],
      'sekilas-rincian': ['Memilih rincian sebagai isi utama', 'Diskusikan: pilihan itu membahas seluruh teks atau satu bagian saja?'],
      'sekilas-luas': ['Memilih judul yang terlalu luas', 'Bandingkan judul dengan isi tiap paragraf.'],
      'sekilas-topik': ['Memilih topik yang tidak dibahas', 'Ingatkan untuk mulai dari judul dan kalimat awal.'],
      'sekilas-paragraf': ['Tertukar gagasan utama antarparagraf', 'Latih menunjuk kalimat utama tiap paragraf.'],
      'teratai-jebakan': ['Menebak topik dari satu kata yang lewat', 'Contoh: halaman tentang katak menyebut sungai. Tanyakan: yang dibahas apa?'],
      'teratai-salah': ['Keliru menentukan topik halaman', 'Ajak membaca kalimat awal sebelum memutuskan.'],
      'kunci-kata-tanya': ['Memilih kata tanya sebagai kata kunci', 'Kata tanya menentukan bentuk jawaban; kata kunci adalah kata yang dicari di teks.'],
      'kunci-umum': ['Memilih kata umum sebagai kata kunci', 'Diskusikan: kata mana yang membedakan satu baris dari baris lain?'],
      'bentuk-keliru': ['Keliru menentukan bentuk jawaban', 'Pasangkan kata tanya dengan bentuknya: pukul berapa untuk waktu, siapa untuk nama.'],
      'pindai-sebentuk': ['Terkecoh jawaban yang bentuknya sama', 'Misalnya waktu tiba dan waktu berangkat. Tekankan langkah Pastikan.'],
      'pindai-baris-lain': ['Mengambil jawaban dari baris lain', 'Ingatkan untuk berhenti di baris yang memuat kata kunci.'],
      'kamus-dari-atas': ['Mencari di kamus dari atas', 'Latih melompat ke huruf awal kata.'],
      'jurus-tertukar': ['Memilih jurus yang tidak sesuai tujuan', 'Ulangi mantra: isi umum, Sekilas; satu info, Pindai.'],
      'frasa-mirip': ['Tertukar frasa yang mirip', 'Latih membaca per kelompok kata, misalnya dengan kartu frasa.'],
      'kebiasaan-keras': ['Menganggap membaca bersuara itu cepat', 'Membaca bersuara membuat kita membaca kata demi kata.'],
      'kebiasaan-ulang': ['Menganggap mengulang kalimat itu membantu', 'Mengulang tanpa perlu menghabiskan waktu.'],
      'menebak': ['Menjawab terlalu cepat tanpa membaca', 'Tidak dihukum. Ingatkan langkah Pastikan: baca seluruh baris dulu.']
    },
    saran: {
      'pilih-jurus': 'Sebutkan beberapa tujuan membaca, misalnya mencari jadwal atau mengetahui isi buku, lalu minta murid memilih jurusnya.',
      'jalur-sekilas': 'Latih membaca judul dan kalimat awal saja, lalu menebak isi teks sebelum membaca utuh.',
      'isi-umum': 'Bandingkan dua judul untuk satu teks: mana yang mencakup semua paragraf?',
      'kata-kunci': 'Garis bawahi kata kunci di pertanyaan sebelum mencari jawabannya.',
      'pindai-tepat': 'Latih memindai jadwal atau daftar harga, lalu memastikan jawabannya di baris yang sama.',
      'kebiasaan-kilat': 'Ajak membaca dalam hati dan per kelompok kata, misalnya dengan kartu frasa.'
    },
    saranKosong: 'Belum ada data. Minta murid menyelesaikan minimal satu level.',
    saranBaik: 'Semua keterampilan berkembang baik. Lanjutkan dengan teks yang lebih panjang tanpa Mode Santai.',
    nuansa: 'Melafalkan dalam hati itu wajar dan tidak dinilai salah. Menelusuri daftar dengan jari saat memindai juga boleh.',
    privasi: 'Data hanya tersimpan di perangkat ini, tanpa nama dan tanpa data pribadi.',
    unduh: 'Unduh catatan', unduhGagal: 'Unduhan tidak tersedia di perangkat ini.', namaBerkas: 'catatan-guru-mata-kilat.txt',
    ya: 'Ya', tidak: 'Tidak', kosong: '-', detik: '{d} detik'
  },
  bukuJurus: {
    judul: 'Buku Jurus',
    sekilas: 'Jurus Sekilas (skimming)', sekilasMantra: 'Judul, Awal, Tebal, Gambar',
    sekilasArti: 'Membaca sekilas untuk menangkap isi umum: baca judul, kalimat awal tiap paragraf, kata tebal, lalu gambar dan keterangannya.',
    pindai: 'Jurus Pindai (scanning)', pindaiMantra: 'Kunci, Bentuk, Sorot, Pastikan',
    pindaiArti: 'Membaca dengan memindai untuk menemukan satu informasi: tentukan kata kunci dan bentuk jawabannya, sorot teks, lalu pastikan.',
    pilih: 'Isi umum? Sekilas. Satu info? Pindai.',
    kartu: 'Kartu Jurus terkumpul: {n} dari 10', kosong: 'Selesaikan level untuk mengumpulkan Kartu Jurus.', tahu: 'Tahukah kamu?', video: 'Tonton pembuka'
  },
  kartuJurus: {
    judul: 'Judul adalah pintu bacaan.',
    kataTanya: 'Kata tanya menentukan bentuk jawaban.',
    dalamHati: 'Baca dalam hati, jangan mengulang-ulang.',
    awal: 'Kalimat awal paragraf biasanya membawa gagasan utama.',
    kelompok: 'Baca per kelompok kata.',
    kunci: 'Berhenti di kata kunci, lalu baca sekitarnya.',
    abjad: 'Kamus dan indeks diurutkan menurut abjad.',
    akhir: 'Kadang gagasan utama ada di akhir paragraf.',
    teliti: 'Petunjuk dan resep dibaca teliti.',
    pilih: 'Isi umum? Sekilas. Satu info? Pindai.'
  },

  info: {
    info: {
      judul: 'Informasi', tab: { tujuan: 'Tujuan', cara: 'Cara Main', jurus: 'Jurus', guru: 'Untuk Guru' },
      pengantar: 'Rimba Pustaka butuh Pembaca Kilat!',
      tujuanJudul: 'Tujuan pembelajaran',
      tujuan: 'Murid mampu memakai teknik membaca cepat yang sesuai dengan tujuan membaca, yaitu skimming untuk menemukan gagasan utama dan scanning untuk menemukan informasi tertentu dalam teks dengan cepat dan tepat.',
      cara: ['Baca tujuannya, lalu pilih jurus yang cocok.', 'Jurus Sekilas: lompat ke judul, kalimat awal, kata tebal, dan gambar.', 'Jurus Pindai: geser pita sorot sampai bertemu kata kunci, lalu tangkap jawabannya.', 'Jawaban tepat membebaskan kunang-kunang yang menerangi rimba.'],
      caraCatatan: 'Tidak ada kalah. Bila keliru, Tasi memberi petunjuk.',
      jurus: [['Jurus Sekilas', 'skimming: membaca sekilas untuk menangkap isi umum atau gagasan utama.'], ['Jurus Pindai', 'scanning: membaca dengan memindai untuk menemukan informasi tertentu, misalnya waktu, nama, atau harga.']],
      jurusCatatan: 'Gagasan utama juga sering disebut ide pokok.',
      guru: ['Pemanasan 5 menit: bahas dua mantra di Buku Jurus.', 'Bermain sekitar 20 menit; progres tersimpan di perangkat.', 'Diskusi: kapan kita membaca sekilas, kapan memindai, kapan membaca teliti?', 'Data hanya tersimpan di perangkat ini, tanpa nama dan tanpa data pribadi.']
    },
    referensi: {
      judul: 'Referensi', tab: { sumber: 'Sumber Materi', ka: 'Kecerdasan Artifisial' },
      sumberPengantar: 'Isi gim ini disusun berdasarkan:',
      sumber: [
        ['Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2025).', 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.', 'Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.'],
        ['Badan Pengembangan dan Pembinaan Bahasa. (2022).', 'Ejaan Bahasa Indonesia yang Disempurnakan Edisi V.', 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.'],
        ['Badan Pengembangan dan Pembinaan Bahasa.', 'Kamus Besar Bahasa Indonesia daring.', ''],
        ['Kementerian Lingkungan Hidup dan Kehutanan. (2018).', 'Peraturan Menteri LHK Nomor P.106/MENLHK/SETJEN/KUM.1/12/2018 tentang Jenis Tumbuhan dan Satwa yang Dilindungi.', '']
      ],
      topik: 'Semua teks bacaan ditulis khusus untuk gim ini. Nama tokoh, tempat, jadwal, dan harga adalah rekaan.',
      huruf: 'Huruf: Baloo 2 dan Andika (SIL Open Font License).',
      kaPengantar: 'Pengembang memakai kecerdasan artifisial (KA) sebagai alat bantu. Semua isi ditinjau oleh guru.',
      ka: [['Kode', 'Claude (Anthropic) membantu menulis kode dan menguji gim.'], ['Gambar', 'Latar, peta, dan benda dibuat dengan alat pembuat gambar KA dari prompt pengembang.'], ['Musik', 'Musik dibuat dengan Suno dari prompt pengembang.'], ['Video', 'Video pembuka dibuat dengan Google Flow dari prompt pengembang.']],
      kaRujukanJudul: 'Rujukan pemakaian KA:',
      kaRujukan: ['Purwarianti, A., dkk. (2025).', 'Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Pendidikan Dasar, dan Pendidikan Menengah.', 'Kementerian Pendidikan Dasar dan Menengah.']
    },
    pengembang: {
      judul: 'Pengembang', tahun: 'Tahun pembuatan: 2026', urutan: 'Pengembang {n} dari {t}',
      sebelumnya: 'Pengembang sebelumnya', berikutnya: 'Pengembang berikutnya',
      profil: [
        {
          nama: 'Jamaluddin', foto: 'pengembang', fotoAlt: 'Foto Jamaluddin',
          baris: ['UPTD SMPN 2 Robatal', 'jamaluddin551@guru.smp.belajar.id', { ikon: 'instagram', alt: 'Instagram', teks: 'tretanjamal' }],
          daftarJudul: 'Prestasi dan Pengalaman',
          daftar: ['Narasumber Digitalisasi Pembelajaran Kemendikdasmen', 'Guru Pejuang Digital', 'Juara 1 Lomba Inovasi Guru SMP Kabupaten Sampang 2026',
            'Juara 1 Guru Inspiratif SMP Kabupaten Sampang 2026', 'Komunitas Belajar Terbaik BLPT Kemendikdasmen 2024']
        },
        { nama: 'Rohmatun Amina, S.Pd.SD., M.Pd.', foto: 'pengembang2', fotoAlt: 'Foto Rohmatun Amina', baris: ['Guru UPTD SDN Lepelle 1'] }
      ]
    }
  }
};
