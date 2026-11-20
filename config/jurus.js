/* Bank Pilih Jurus (brief bagian 7): 48 tujuan membaca, 24 Sekilas dan 24 Pindai, masing-masing dengan alasan.
   Dipakai Tantangan Kilat L5 (dua soal acak) dan latihan berikutnya. Mantra: Isi umum? Sekilas. Satu info? Pindai. */
window.JURUS = (function () {
  var S = 'sekilas', P = 'pindai';
  var a = {
    isi: 'Isi umum? Sekilas!', cocok: 'Menilai cocok atau tidak? Sekilas!', gagasan: 'Gagasan utama? Sekilas!',
    satu: 'Satu info? Pindai!', abjad: 'Kamus urut abjad. Pindai!', angka: 'Mencari angka? Pindai!'
  };
  return [
    { t: 'Ulin ingin tahu apakah buku Rahasia Sungai cocok untuk tugasnya.', jurus: S, alasan: a.cocok },
    { t: 'Tasi ingin tahu berita apa saja yang dimuat Kabar Rimba hari ini.', jurus: S, alasan: a.isi },
    { t: 'Tupi penasaran buku dongeng baru itu bercerita tentang apa.', jurus: S, alasan: a.isi },
    { t: 'Bu Lebah mencari buku bunga yang isinya paling cocok untuk kebunnya.', jurus: S, alasan: a.cocok },
    { t: 'Kak Kalong perlu tahu gagasan utama teks tentang gua.', jurus: S, alasan: a.gagasan },
    { t: 'Om Berang memeriksa apakah artikel ini membahas sungai.', jurus: S, alasan: a.cocok },
    { t: 'Ulin melihat garis besar surat dari temannya sebelum membacanya pelan-pelan.', jurus: S, alasan: a.isi },
    { t: 'Tasi memilih satu dari tiga artikel untuk tugas tentang hutan.', jurus: S, alasan: a.cocok },
    { t: 'Pak Beruang Madu ingin tahu inti pengumuman yang panjang.', jurus: S, alasan: a.isi },
    { t: 'Tupi mencari tahu bab pertama buku sains membahas apa.', jurus: S, alasan: a.isi },
    { t: 'Bu Rusa menimbang apakah majalah ini membahas tanaman obat.', jurus: S, alasan: a.cocok },
    { t: 'Kak Merak menentukan gagasan utama paragraf kedua.', jurus: S, alasan: a.gagasan },
    { t: 'Ulin membandingkan dua buku untuk dipinjam.', jurus: S, alasan: a.cocok },
    { t: 'Tasi ingin tahu poster di dinding kelas itu tentang apa.', jurus: S, alasan: a.isi },
    { t: 'Dik Kancil mencari tahu apakah cerita ini tentang persahabatan.', jurus: S, alasan: a.cocok },
    { t: 'Om Berang ingin tahu topik berita utama di koran pagi ini.', jurus: S, alasan: a.isi },
    { t: 'Pak Trenggiling memilih teks yang paling cocok untuk lomba membaca.', jurus: S, alasan: a.cocok },
    { t: 'Tupi melihat brosur festival untuk tahu acaranya tentang apa.', jurus: S, alasan: a.isi },
    { t: 'Bu Lebah perlu tahu pokok pikiran artikel tentang lebah.', jurus: S, alasan: a.gagasan },
    { t: 'Kak Kalong mencari buku yang membahas kelelawar.', jurus: S, alasan: a.cocok },
    { t: 'Tasi membuat judul yang cocok untuk tulisan temannya.', jurus: S, alasan: a.gagasan },
    { t: 'Ulin ingin tahu cerita bergambar itu tentang apa sebelum dibacakan.', jurus: S, alasan: a.isi },
    { t: 'Tupi memilih artikel yang membahas cara menanam pohon.', jurus: S, alasan: a.cocok },
    { t: 'Pak Beruang Madu ingin tahu inti laporan panitia.', jurus: S, alasan: a.isi },
    { t: 'Tupi ingin tahu harga satu lentera daun.', jurus: P, alasan: a.satu },
    { t: 'Pak Beruang Madu mencari arti kata nokturnal di kamus.', jurus: P, alasan: a.abjad },
    { t: 'Ulin perlu tahu jam berangkat gondola ke telaga.', jurus: P, alasan: a.satu },
    { t: 'Tasi membuka daftar isi untuk menemukan halaman resep klepon.', jurus: P, alasan: a.angka },
    { t: 'Bu Lebah ingin tahu tanggal lomba menghias lentera.', jurus: P, alasan: a.satu },
    { t: 'Kak Kalong mencari nama penjaga Tenda Cerita.', jurus: P, alasan: a.satu },
    { t: 'Om Berang ingin tahu di mana acara dongeng diadakan.', jurus: P, alasan: a.satu },
    { t: 'Tupi menghitung berapa peserta lomba menurut pengumuman.', jurus: P, alasan: a.angka },
    { t: 'Dik Kancil perlu nomor telepon Kedai Madu.', jurus: P, alasan: a.angka },
    { t: 'Ulin ingin tahu arti kata lumut di kamus.', jurus: P, alasan: a.abjad },
    { t: 'Tasi mencari jam tiba gondola di Pohon Kunang.', jurus: P, alasan: a.satu },
    { t: 'Bu Rusa ingin tahu harga tiket gondola untuk dewasa.', jurus: P, alasan: a.satu },
    { t: 'Kak Merak membuka indeks untuk menemukan halaman tentang kunang-kunang.', jurus: P, alasan: a.abjad },
    { t: 'Pak Trenggiling perlu tahu takaran gula di resep.', jurus: P, alasan: a.angka },
    { t: 'Tupi ingin tahu siapa pemenang lomba lentera.', jurus: P, alasan: a.satu },
    { t: 'Ulin mencari pukul berapa Tari Kunang-Kunang dimulai.', jurus: P, alasan: a.satu },
    { t: 'Om Berang menemukan letak Panggung Telaga di denah.', jurus: P, alasan: a.satu },
    { t: 'Tasi ingin tahu nomor urut namanya di daftar hadir.', jurus: P, alasan: a.satu },
    { t: 'Bu Lebah memeriksa berapa sendok madu di resep wedang jahe.', jurus: P, alasan: a.angka },
    { t: 'Kak Kalong ingin tahu kedai mana yang menjual jagung bakar.', jurus: P, alasan: a.satu },
    { t: 'Dik Kancil mencari arti kata nyiur di kamus.', jurus: P, alasan: a.abjad },
    { t: 'Pak Beruang Madu perlu tahu jam pembukaan festival.', jurus: P, alasan: a.satu },
    { t: 'Tupi ingin tahu harga sewa lentera besar.', jurus: P, alasan: a.satu },
    { t: 'Ulin membuka daftar isi untuk menemukan halaman bab tentang teratai.', jurus: P, alasan: a.angka }
  ];
})();
