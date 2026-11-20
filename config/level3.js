/* Level 3 Pasar Dahan (brief bagian 6): Jurus Pindai tingkat 2-3 dengan langkah Kunci, Bentuk, Sorot, Pastikan.
   5 teks, 11 soal. Pengecoh sebentuk dari kesalahan nyata: waktu tiba lawan berangkat, harga dewasa lawan anak,
   tanggal pendaftaran lawan tanggal acara. Kamus Kecil Rimba memakai Lompat Huruf. Kunang L3 = 200.
   pengecoh: kunci "baris:nilai", "nilai", atau "baris" -> umpan balik khusus (Tupi tergelincir). */
window.LEVELS = window.LEVELS || {};
(function () {
  var W = function (t) { return { t: t, b: 'waktu' }; }, H = function (t) { return { t: t, b: 'harga' }; }, A = function (t) { return { t: t, b: 'angka' }; };
  var JADWAL = {
    id: 'gondola', judul: 'Jadwal Gondola Daun', kolom: ['Tujuan', 'Berangkat', 'Tiba'], kelas: 'tiga-kolom',
    baris: [['Rumah Pohon', W('16.15'), W('16.25')], ['Telaga Teratai', W('16.30'), W('16.45')], ['Air Terjun Embun', W('17.00'), W('17.40')], ['Bukit Bulan', W('17.10'), W('17.35')], ['Pohon Kunang', W('17.15'), W('17.50')]],
    soal: [
      { tanya: 'Pukul berapa gondola ke Air Terjun Embun berangkat?', kunci: 'Air Terjun Embun', kunci2: 'berangkat', bentuk: 'waktu', jawab: 2, jawabT: '17.00', pengecoh: { '2:17.40': 'Itu waktu tiba, bukan berangkat.' } },
      { tanya: 'Pukul berapa gondola ke Pohon Kunang tiba?', kunci: 'Pohon Kunang', kunci2: 'tiba', bentuk: 'waktu', jawab: 4, jawabT: '17.50', pengecoh: { '4:17.15': 'Itu waktu berangkat, bukan tiba.' } },
      { tanya: 'Pukul berapa gondola ke Telaga Teratai berangkat?', kunci: 'Telaga Teratai', kunci2: 'berangkat', bentuk: 'waktu', jawab: 1, jawabT: '16.30', pengecoh: { '1:16.45': 'Itu waktu tiba, bukan berangkat.' } }
    ]
  };
  var HARGA = {
    id: 'harga', judul: 'Daftar Harga di Pasar Dahan', kolom: ['Barang', 'Harga'],
    baris: [['Tiket gondola anak', H('Rp2.000')], ['Tiket gondola dewasa', H('Rp3.000')], ['Kue lentera', H('Rp3.500')], ['Teh serai', H('Rp2.500')], ['Jagung bakar', H('Rp4.000')], ['Lentera daun', H('Rp5.000')]],
    soal: [
      { tanya: 'Berapa harga tiket gondola untuk anak?', kunci: 'anak', kunci2: 'tiket', bentuk: 'harga', jawab: 0, pengecoh: { '1': 'Itu harga tiket untuk dewasa.' } },
      { tanya: 'Berapa harga lentera daun?', kunci: 'lentera daun', bentuk: 'harga', jawab: 5, pengecoh: { '2': 'Itu harga kue lentera, bukan lentera daun.' } }
    ]
  };
  var TG = function (t) { return { t: t, b: 'tanggal' }; };
  var LOMBA = {
    id: 'lomba', judul: 'Lomba Menghias Lentera', anak: 'Ayo ikut lomba menghias lentera daun!',
    baris: [[['Pendaftaran: ', TG('Jumat, 20 November 2026')]], [['Pendaftaran ditutup pukul ', W('12.00')]], [['Hari lomba: ', TG('Sabtu, 21 November 2026')]],
      [['Lomba dimulai pukul ', W('15.00')]], [['Lomba selesai pukul ', W('17.00')]], [['Pengumuman pemenang: ', TG('Minggu, 22 November 2026')]], [['Tempat: ', { t: 'Lapangan Pasar Dahan', b: 'tempat' }]]],
    soal: [
      { tanya: 'Tanggal berapa hari lomba?', kunci: 'hari lomba', bentuk: 'tanggal', jawab: 2, pengecoh: { '0': 'Itu tanggal pendaftaran, bukan hari lomba.', '5': 'Itu tanggal pengumuman pemenang.' } },
      { tanya: 'Pukul berapa lomba dimulai?', kunci: 'dimulai', bentuk: 'waktu', jawab: 3, pengecoh: { '4': 'Itu waktu lomba selesai.', '1': 'Itu waktu pendaftaran ditutup.' } }
    ]
  };
  var DAFTAR_ISI = {
    id: 'resep', judul: 'Daftar Isi Buku Resep Rimba', kolom: ['Resep', 'Halaman'],
    baris: [['Bubur sumsum', A('4')], ['Kue lumpur', A('7')], ['Nasi liwet', A('10')], ['Pisang goreng', A('13')], ['Wedang jahe', A('16')]],
    soal: [
      { tanya: 'Resep pisang goreng ada di halaman berapa?', kunci: 'pisang goreng', bentuk: 'angka', jawab: 3 },
      { tanya: 'Halaman berapa resep wedang jahe?', kunci: 'wedang jahe', bentuk: 'angka', jawab: 4 }
    ]
  };
  var R = function (t) { return { t: t, b: 'arti' }; };
  var KAMUS = {
    id: 'kamus', judul: 'Kamus Kecil Rimba', kolom: ['Kata', 'Arti'], kelas: 'kamus',
    kamus: { huruf: ['K', 'L', 'N', 'T'], entri: {
      K: [['kancil', R('hewan kecil berkaki ramping yang mirip rusa')], ['kukang', R('hewan malam bermata besar yang bergerak lambat')], ['kunang-kunang', R('serangga kecil yang dapat bercahaya')]],
      L: [['lembap', R('agak basah')], ['lentera', R('lampu yang dapat dibawa ke mana-mana')], ['lumut', R('tumbuhan kecil yang hidup di tempat lembap')]],
      N: [['nektar', R('cairan manis di dalam bunga')], ['nokturnal', R('aktif pada malam hari')], ['nyiur', R('pohon kelapa')]],
      T: [['tarsius', R('hewan kecil bermata besar yang pandai melompat')], ['teratai', R('tumbuhan air berdaun lebar')], ['tupai', R('hewan berekor lebat yang pandai memanjat')]]
    } },
    soal: [
      { tanya: 'Apa arti kata nokturnal?', kunci: 'nokturnal', bentuk: 'arti', huruf: 'N', jawab: 1 },
      { tanya: 'Apa arti kata lumut?', kunci: 'lumut', bentuk: 'arti', huruf: 'L', jawab: 2 }
    ]
  };
  window.LEVELS[3] = {
    latar: 'latarPasar', musik: 'jelajah', kartuJurus: ['kunci', 'abjad'],
    dok: [JADWAL, HARGA, LOMBA, DAFTAR_ISI, KAMUS],
    tugas: [
      { jenis: 'cerita', ucapan: [['tasi', 'Pasar Dahan ramai! Banyak jadwal dan daftar harga.', 'semangat'], ['tupi', 'Tupi: Aku cepat! Pasti langsung kutemukan!'], ['tasi', 'Cepat boleh, tetapi pastikan dulu, ya!', 'semangat']],
        tokoh: [['tupi', 700, 600, 1, 'semangat', true]] },
      { jenis: 'pindai', dok: JADWAL, min: 2, max: 3, kunang: 45 },
      { jenis: 'pindai', dok: HARGA, min: 2, max: 3, kunang: 30 },
      { jenis: 'pindai', dok: LOMBA, min: 2, max: 3, kunang: 40 },
      { jenis: 'pindai', dok: DAFTAR_ISI, min: 2, max: 3, kunang: 40 },
      { jenis: 'pindai', dok: KAMUS, min: 2, max: 2, kunang: 45 }
    ]
  };
})();
