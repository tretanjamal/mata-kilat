/* Level 6 Bukit Bulan: Tantangan Bulan (brief bagian 6 dan 11, TAMBAHAN prioritas 2). Latihan bebas sesudah festival:
   soal acak dari bank (Pilih Jurus lalu kerjakan, teks Sekilas tambahan, pembangkit Pindai 8 templat, Halaman Teratai).
   Daftar tugas dibuat baru setiap kali level dimulai (getter), jadi tiap permainan berbeda. Tanpa kuota kunang (total tetap
   1.000); waktu hanya untuk Bintang Kilat di tingkat 4; bintang tertinggi tersimpan sebagai rekor pribadi. */
window.LEVELS = window.LEVELS || {};
(function () {
  var r = Math.random;
  function acak(a) { return a[Math.floor(r() * a.length)]; }
  function sekilas(dipakai) {
    var calon = (window.BANK_SEKILAS || []).filter(function (x) { return !dipakai[x.id]; }), x = acak(calon);
    dipakai[x.id] = true;
    /* satu atau dua soal dari teks itu, urutan isi/judul lalu gagasan paragraf */
    var soal = x.soal.slice(r() < 0.5 ? 0 : 1).slice(0, 2);
    return { jenis: 'sekilas', teks: U.gabung(x, { soal: soal }), min: 2, max: 4 };
  }
  function pindai() {
    var templat = acak(Pembangkit.TEMPLAT), benih = 1 + Math.floor(r() * 99999);
    return { jenis: 'pindai', dokFn: function () { return Pembangkit.buat(templat, benih, 3); }, min: 2, max: 4 };
  }
  function buat() {
    var dipakai = {}, J = window.JURUS || [], s = J.filter(function (x) { return x.jurus === 'sekilas'; }), p = J.filter(function (x) { return x.jurus === 'pindai'; });
    var tugas = [{ jenis: 'cerita', ucapan: [['tasi', 'Selamat datang di Bukit Bulan!', 'senang'], ['tasi', 'Tantangan Bulan: soal acak dari seluruh rimba!', 'semangat']] }];
    var urut = U.shuffle(r, ['sekilas', 'sekilas', 'pindai', 'pindai']);
    urut.forEach(function (j) {
      var it = acak(j === 'sekilas' ? s : p);
      tugas.push({ jenis: 'pilihJurus', item: it, lanjut: j === 'sekilas' ? sekilas(dipakai) : pindai() });
    });
    tugas.splice(3, 0, { jenis: 'teratai', buku: ['Satwa Malam', 'Air dan Sungai', 'Tumbuhan Hutan', 'Permainan Tradisional'], bank: window.HALAMAN_TERATAI, jumlah: 4, jebakan: 1, acakBuku: true, kunang: 0 });
    return tugas;
  }
  window.LEVELS[6] = { latar: 'latarJudul', musik: 'jelajah', kartuJurus: [], selesai: 'Hebat! Bulan bersinar penuh untukmu!' };
  Object.defineProperty(window.LEVELS[6], 'tugas', { get: buat, enumerable: true });
})();
