/* Level 4 Air Terjun Embun (brief bagian 6): Ulin dan Tupi terjebak di gua di balik air terjun. Setiap permintaan: pilih jurus,
   lalu kerjakan pada teks (tingkat 3-4: daun berkurang sampai teks utuh, Bintang Kilat). Satu momen "baca teliti" tidak dinilai.
   Kunang L4 = 250 (8 x (10 + 20) + 10). Teks panjang memakai lembar lebar dua kolom (laptop) dan bisa digulir (HP). */
window.LEVELS = window.LEVELS || {};
(function () {
  var S1 = {
    id: 'airterjun', judul: 'Bagaimana Air Terjun Terbentuk?', rasi: 'Terbentuknya Air Terjun', panjang: true,
    bagian: [
      { judul: 'Sungai yang Jatuh', paragraf: [[{ t: 'Air terjun terbentuk saat **sungai mengalir melewati tebing**.', p: 'awal' }, { t: 'Air tidak bisa menuruni tebing secara perlahan.' }, { t: 'Akhirnya, air jatuh dari tempat yang tinggi.' }]] },
      { judul: 'Batu Keras dan Batu Lunak', paragraf: [[{ t: 'Tebing air terjun sering terbentuk dari **batuan yang berbeda**.', p: 'awal' }, { t: 'Batuan lunak di bawah lebih cepat terkikis air.' }, { t: 'Batuan keras di atasnya tetap bertahan dan menjadi bibir air terjun.' }]] },
      { judul: 'Kolam di Bawahnya', paragraf: [[{ t: 'Di kaki air terjun biasanya ada **kolam yang dalam**.', p: 'awal' }, { t: 'Kolam itu terbentuk karena air terus menghantam batu di bawahnya.' }, { t: 'Banyak ikan dan udang hidup di kolam seperti ini.' }]] }
    ],
    soal: [{ tanya: 'Teks ini terutama membahas apa?', inti: 'terbentuknya air terjun', pilihan: [
      { t: 'Cara air terjun terbentuk', jenis: 'benar' }, { t: 'Ikan dan udang di kolam', jenis: 'sempit' }, { t: 'Semua sungai di Indonesia', jenis: 'luas' }] }]
  };
  var S2 = {
    id: 'kelelawar', judul: 'Kelelawar Buah, Penanam Hutan', rasi: 'Kelelawar Penanam Hutan', panjang: true, gambar: { ilus: 'kelelawar', ket: 'Kelelawar buah terbang jauh sambil membawa buah dan bijinya.', di: 'akhir' },
    paragraf: [
      [{ t: 'Kelelawar buah aktif **pada malam hari**.', p: 'awal' }, { t: 'Siang hari ia tidur bergantung terbalik di dahan pohon.' }, { t: 'Saat hari gelap, ia terbang mencari buah yang matang.' }],
      [{ t: 'Kelelawar buah membantu **menanam hutan**.', p: 'awal' }, { t: 'Ia memakan buah, lalu terbang jauh sambil membawa bijinya.' }, { t: 'Biji yang jatuh ke tanah dapat tumbuh menjadi pohon baru.' }],
      [{ t: 'Banyak bunga juga dibantu oleh kelelawar.', p: 'awal' }, { t: 'Saat minum nektar, tubuhnya membawa serbuk sari dari bunga ke bunga.' }, { t: 'Karena itu, kelelawar buah perlu kita jaga.' }]
    ],
    soal: [{ tanya: 'Apakah teks ini cocok untuk tugas tentang menjaga hutan?', inti: 'kelelawar buah membantu menanam hutan', pilihan: [
      { t: 'Cocok, karena kelelawar buah membantu menanam hutan', jenis: 'benar' }, { t: 'Tidak cocok, karena isinya tentang gua', jenis: 'topik' }, { t: 'Tidak cocok, karena isinya tentang cara memasak buah', jenis: 'topik' }] }]
  };
  var S3 = {
    id: 'gua', judul: 'Gua, Rumah dalam Gelap', rasi: 'Hewan Penghuni Gua', panjang: true,
    paragraf: [
      [{ t: 'Gua adalah **ruang di dalam batu** yang gelap dan lembap.', p: 'awal' }, { t: 'Cahaya matahari hanya masuk di bagian mulut gua.' }, { t: 'Makin ke dalam, udara makin sejuk.' }],
      [{ t: 'Banyak **hewan tinggal di gua**.', p: 'awal' }, { t: 'Kelelawar tidur di langit-langit gua.' }, { t: 'Jangkrik gua punya antena panjang untuk meraba jalan dalam gelap.' }],
      [{ t: 'Gua juga menyimpan **air**.', p: 'awal' }, { t: 'Tetes air dari langit-langit gua perlahan membentuk batu runcing yang disebut stalaktit.' }, { t: 'Pembentukannya memakan waktu sangat lama.' }]
    ],
    soal: [{ tanya: 'Teks ini terutama membahas apa?', inti: 'gua gelap dan hewan yang tinggal', pilihan: [
      { t: 'Batu runcing bernama stalaktit', jenis: 'sempit' }, { t: 'Gua yang gelap dan penghuninya', jenis: 'benar' }, { t: 'Lentera penjelajah yang terang', jenis: 'topik' }] }]
  };
  var S4 = {
    id: 'lumut', judul: 'Lumut, Kecil tetapi Penting', rasi: 'Lumut yang Penting', gambar: { ilus: 'lumut', ket: 'Lumut menutupi batu yang lembap seperti karpet hijau.' },
    paragraf: [
      [{ t: 'Lumut tumbuh di batu, batang pohon, dan tanah yang **lembap**.', p: 'awal' }, { t: 'Tubuhnya kecil dan lembut seperti karpet hijau.' }, { t: 'Lumut tidak memiliki bunga.' }],
      [{ t: 'Saat hujan, lumut menyerap air seperti spons.' }, { t: 'Air itu dilepaskan perlahan ke tanah di sekitarnya.' }, { t: 'Jadi, lumut membantu **menjaga tanah tetap basah**.', p: 'utama' }]
    ],
    soal: [{ tanya: 'Gagasan utama paragraf yang bersinar?', paragraf: 1, inti: 'lumut menjaga tanah tetap basah', pilihan: [
      { t: 'Lumut membantu menjaga tanah tetap basah', jenis: 'benar' }, { t: 'Saat hujan, lumut menyerap air seperti spons', jenis: 'sempit', balas: 'Itu rinciannya. Coba lihat kalimat terakhirnya juga.' }, { t: 'Lumut tidak memiliki bunga', jenis: 'paragraf' }] }]
  };
  var A = function (t) { return { t: t, b: 'angka' }; };
  var D1 = { id: 'bekal', judul: 'Bekal Penjelajah Gua', kolom: ['Barang', 'Jumlah'], baris: [['Lentera', A('2')], ['Tali', A('3')], ['Senter', A('1')], ['Bekal makanan', A('4')], ['Botol air', A('5')]],
    soal: [{ tanya: 'Berapa tali yang dibawa penjelajah?', kunci: 'tali', bentuk: 'angka', jawab: 1 }] };
  var D2 = { id: 'lorong', judul: 'Petunjuk Arah di Gua', kolom: ['Lorong', 'Menuju'],
    baris: [[{ t: 'Lorong Kiri', b: 'tempat' }, 'Kolam Jernih'], [{ t: 'Lorong Tengah', b: 'tempat' }, 'Air Terjun Kecil'], [{ t: 'Lorong Kanan', b: 'tempat' }, 'Pintu Keluar'], [{ t: 'Lorong Bawah', b: 'tempat' }, 'Sarang Kelelawar']],
    soal: [{ tanya: 'Lorong mana yang menuju Pintu Keluar?', kunci: 'Pintu Keluar', bentuk: 'tempat', jawab: 2 }] };
  var D3 = { id: 'jaga', judul: 'Jadwal Penjaga Air Terjun', kolom: ['Penjaga', 'Mulai Jaga'],
    baris: [[{ t: 'Bu Lebah', b: 'nama' }, '17.00'], [{ t: 'Pak Beruang Madu', b: 'nama' }, '18.00'], [{ t: 'Om Berang', b: 'nama' }, '19.00'], [{ t: 'Kak Kalong', b: 'nama' }, '20.00']],
    soal: [{ tanya: 'Siapa yang mulai berjaga pukul 19.00?', kunci: '19.00', bentuk: 'nama', jawab: 2 }] };
  var D4 = { id: 'sewa', judul: 'Harga Sewa Lentera', kolom: ['Lentera', 'Harga'],
    baris: [['Lentera kecil', { t: 'Rp1.000', b: 'harga' }], ['Lentera sedang', { t: 'Rp2.000', b: 'harga' }], ['Lentera besar', { t: 'Rp3.000', b: 'harga' }], ['Lentera bambu', { t: 'Rp2.500', b: 'harga' }]],
    soal: [{ tanya: 'Berapa harga sewa lentera besar?', kunci: 'lentera besar', bentuk: 'harga', jawab: 2 }] };
  var MIN = { min: 3, max: 4 };
  function j(item, lanjut) { return { jenis: 'pilihJurus', item: item, kunang: 10, lanjut: Object.assign({ kunang: 20 }, MIN, lanjut) }; }
  window.LEVELS[4] = {
    latar: 'latarAirTerjun', musik: 'jelajah', kartuJurus: ['pilih', 'teliti', 'akhir'],
    teks: [S1, S2, S3, S4], dok: [D1, D2, D3, D4],
    tugas: [
      { jenis: 'cerita', ucapan: [['tasi', 'Gawat! Ulin dan Tupi terjebak di gua.', 'kaget'], ['tasi', 'Lentera mereka padam. Ayo bantu dengan jurus yang tepat!', 'semangat']] },
      j({ t: 'Ulin ingin tahu buku itu bercerita tentang apa.', jurus: 'sekilas', alasan: 'Isi umum? Sekilas!' }, { jenis: 'sekilas', teks: S1 }),
      j({ t: 'Tupi perlu tahu berapa tali yang dibawa penjelajah.', jurus: 'pindai', alasan: 'Satu info? Pindai!' }, { jenis: 'pindai', dok: D1 }),
      j({ t: 'Tasi ingin tahu apakah buku Kelelawar Buah cocok untuk tugas tentang hutan.', jurus: 'sekilas', alasan: 'Menilai isi buku? Sekilas!' }, { jenis: 'sekilas', teks: S2 }),
      j({ t: 'Ulin mencari lorong yang menuju pintu keluar.', jurus: 'pindai', alasan: 'Satu info? Pindai!' }, { jenis: 'pindai', dok: D2 }),
      { jenis: 'bacaTeliti', judul: 'Cara Menyalakan Lentera Daun', tujuan: 'Petunjuk dibaca teliti, langkah demi langkah.', kunang: 10,
        langkah: ['Buka tutup lentera dengan hati-hati.', 'Masukkan batu kunang ke dalam lentera.', 'Tutup kembali sampai berbunyi klik.', 'Goyangkan pelan tiga kali sampai menyala.'] },
      j({ t: 'Kak Kalong ingin tahu siapa yang berjaga pukul 19.00.', jurus: 'pindai', alasan: 'Satu info? Pindai!' }, { jenis: 'pindai', dok: D3 }),
      j({ t: 'Tupi mencari tahu gagasan utama teks tentang gua.', jurus: 'sekilas', alasan: 'Gagasan utama? Sekilas!' }, { jenis: 'sekilas', teks: S3 }),
      j({ t: 'Om Berang perlu tahu harga sewa lentera besar.', jurus: 'pindai', alasan: 'Satu info? Pindai!' }, { jenis: 'pindai', dok: D4 }),
      j({ t: 'Ulin ingin tahu gagasan utama teks tentang lumut.', jurus: 'sekilas', alasan: 'Gagasan utama? Sekilas!' }, { jenis: 'sekilas', teks: S4 })
    ]
  };
})();
