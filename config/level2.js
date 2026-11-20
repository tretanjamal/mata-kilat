/* Level 2 Telaga Teratai (brief bagian 6): Halaman Teratai, Jurus Sekilas tingkat 1-2 (isi umum, judul terbaik, gagasan utama
   paragraf, Rasi Bacaan), dan Kilatan Frasa. Halaman dan frasa ada di config/latihan.js (bank Fase 3). Kunang L2 = 150. Semua teks ditulis khusus untuk gim ini.
   Pengecoh bertipe: sempit (rincian), luas, topik (salah topik), paragraf (isi paragraf lain). */
window.LEVELS = window.LEVELS || {};
(function () {
  var BUKU = ['Satwa Malam', 'Air dan Sungai', 'Tumbuhan Hutan', 'Permainan Tradisional'];
  var TEKS = [
    {
      id: 'teratai', judul: 'Teratai, Bunga di Atas Air', rasi: 'Teratai di Telaga', panjang: true,
      paragraf: [
        [{ t: '**Teratai** adalah tumbuhan yang hidup di air tenang, seperti kolam dan telaga.', p: 'awal' }, { t: 'Akarnya tertanam di lumpur dasar telaga.' }, { t: 'Daunnya lebar dan mengapung di permukaan air.' }],
        [{ t: 'Daun teratai memiliki lapisan **lilin** yang membuatnya tahan air.', p: 'awal' }, { t: 'Tetes air di atasnya menggelinding seperti butiran kaca.' }, { t: 'Karena itu, daunnya tetap kering walaupun terkena hujan.' }],
        [{ t: 'Teratai juga menjadi **rumah** bagi banyak hewan kecil.', p: 'awal' }, { t: 'Katak duduk di atas daunnya, sedangkan ikan kecil berlindung di bawahnya.' }, { t: 'Capung pun sering hinggap di bunganya.' }]
      ],
      soal: [
        { tanya: 'Judul lain yang paling cocok untuk teks ini?', inti: 'teratai dan kehidupan di telaga', pilihan: [
          { t: 'Tetes Air yang Menggelinding seperti Kaca', jenis: 'sempit' }, { t: 'Teratai dan Kehidupan di Telaga', jenis: 'benar' }, { t: 'Tumbuhan yang Hidup di Air', jenis: 'luas' }] },
        { tanya: 'Gagasan utama paragraf yang bersinar?', paragraf: 1, inti: 'daun teratai tahan air', pilihan: [
          { t: 'Daun teratai tahan air karena lapisan lilin', jenis: 'benar' }, { t: 'Tetes air menggelinding seperti kaca', jenis: 'sempit' }, { t: 'Katak duduk di atas daun teratai', jenis: 'paragraf' }] }
      ]
    },
    {
      id: 'capung', judul: 'Capung, Penerbang Andal', rasi: 'Capung Penerbang Andal', panjang: true, gambar: { ilus: 'capung', ket: 'Capung terbang di atas telaga dengan empat sayapnya.', di: 'akhir' },
      paragraf: [
        [{ t: 'Capung adalah serangga yang **pandai terbang**.', p: 'awal' }, { t: 'Ia dapat terbang maju, mundur, bahkan diam melayang di udara.' }, { t: 'Sayapnya ada empat dan bergerak sendiri-sendiri.' }],
        [{ t: 'Capung memulai hidupnya **di dalam air**.', p: 'awal' }, { t: 'Telurnya diletakkan di air atau di tumbuhan air.' }, { t: 'Setelah menetas, anak capung hidup di air berbulan-bulan sebelum bisa terbang.' }],
        [{ t: 'Capung membantu menjaga **keseimbangan alam**.', p: 'awal' }, { t: 'Ia memakan nyamuk dan serangga kecil lainnya.' }, { t: 'Telaga yang banyak capungnya biasanya masih bersih.' }]
      ],
      soal: [
        { tanya: 'Teks ini terutama membahas apa?', inti: 'capung dan kehidupannya', pilihan: [
          { t: 'Capung dan kehidupannya', jenis: 'benar' }, { t: 'Cara capung memakan nyamuk', jenis: 'sempit' }, { t: 'Serangga di sekitar kita', jenis: 'luas' }] },
        { tanya: 'Gagasan utama paragraf yang bersinar?', paragraf: 2, inti: 'capung menjaga keseimbangan alam', pilihan: [
          { t: 'Capung memakan nyamuk', jenis: 'sempit' }, { t: 'Anak capung hidup di dalam air', jenis: 'paragraf' }, { t: 'Capung menjaga keseimbangan alam', jenis: 'benar' }] }
      ]
    },
    {
      id: 'gobak', judul: 'Gobak Sodor, Permainan Kerja Sama', rasi: 'Gobak Sodor', panjang: true,
      paragraf: [
        [{ t: '**Gobak sodor** adalah permainan tradisional yang dimainkan oleh dua regu.', p: 'awal' }, { t: 'Lapangannya berbentuk persegi panjang yang dibagi menjadi beberapa petak.' }, { t: 'Garis-garisnya biasanya dibuat dengan kapur.' }],
        [{ t: 'Satu regu bertugas **menjaga garis**.', p: 'awal' }, { t: 'Para penjaga berdiri di garis dan berusaha menyentuh lawan.' }, { t: 'Regu lain berusaha melewati semua petak tanpa tersentuh.' }],
        [{ t: 'Permainan ini mengajarkan **kerja sama**.', p: 'awal' }, { t: 'Setiap pemain harus memperhatikan temannya dan menyusun siasat bersama.' }, { t: 'Regu yang kompak biasanya lebih mudah menang.' }]
      ],
      soal: [
        { tanya: 'Judul lain yang paling cocok untuk teks ini?', inti: 'bermain gobak sodor bersama regu', pilihan: [
          { t: 'Membuat Garis Lapangan dengan Kapur', jenis: 'sempit' }, { t: 'Aneka Permainan Olahraga', jenis: 'luas' }, { t: 'Bermain Gobak Sodor Bersama Regu', jenis: 'benar' }] },
        { tanya: 'Gagasan utama paragraf yang bersinar?', paragraf: 0, inti: 'gobak sodor dimainkan dua regu', pilihan: [
          { t: 'Gobak sodor dimainkan oleh dua regu', jenis: 'benar' }, { t: 'Garis lapangan dibuat dengan kapur', jenis: 'sempit' }, { t: 'Regu yang kompak lebih mudah menang', jenis: 'paragraf' }] }
      ]
    }
  ];
  window.LEVELS[2] = {
    latar: 'latarTelaga', musik: 'jelajah', kartuJurus: ['awal', 'kelompok'],
    teks: TEKS, buku: BUKU,
    tugas: [
      { jenis: 'cerita', ucapan: [['tasi', 'Lihat! Halaman buku mendarat di daun teratai.', 'kaget'], ['tasi', 'Ayo kembalikan ke bukunya dengan Jurus Sekilas!', 'semangat']],
        tokoh: [['ulin', 640, 520, 0.9, 'baca']] },
      /* Fase 3: halaman dan frasa diambil acak dari bank (config/latihan.js); permainan ulang memakai 4 buku acak dari 6 */
      { jenis: 'teratai', buku: BUKU, bank: window.HALAMAN_TERATAI, jumlah: 8, jebakan: 2, acakBuku: true, kunang: 40 },
      { jenis: 'sekilas', teks: TEKS[0], min: 2, max: 2, kunang: 30 },
      { jenis: 'frasa', bank: window.FRASA_KILAT, jumlah: 8, kunang: 20 },
      { jenis: 'sekilas', teks: TEKS[1], min: 1, max: 2, kunang: 30 },
      { jenis: 'sekilas', teks: TEKS[2], min: 2, max: 3, kunang: 30 }
    ]
  };
})();
