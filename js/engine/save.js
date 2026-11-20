/* Save: progres di localStorage (try/catch); tetap jalan bila penyimpanan diblokir.
   Disalin dari Dear Zuzu! (15; asal Ding Dong Delivery 231 dan Kafe Cilik 483: data dibersihkan saat dimuat supaya simpanan
   lama atau rusak tidak membuat gim macet). Disesuaikan untuk Mata Kilat: kunci mataKilat.save.v1, warna lentera, level,
   kunang-kunang, tingkat per jurus, Kartu Jurus, Uji Kilat, dan tag keterampilan brief bagian 2. Tanpa nama dan data pribadi. */
(function (root) {
  var KEY = 'mataKilat.save.v1';
  var memory = null;
  var SETEL = { senyap: false, musik: true, efek: true, bacakan: true, santai: false, kurangi: false, hurufBesar: false };
  var LENTERA = ['kuning', 'hijau', 'jingga', 'ungu'];
  /* kuota kunang-kunang per level (GDD bagian 5; total 1.000). Mengulang level tidak menambah melebihi kuota. */
  var KUOTA = { '1': 100, '2': 150, '3': 200, '4': 250, '5': 300 };
  /* ambang "Dikuasai" per tag (brief bagian 2): [rasio benar coba pertama, minimal kesempatan] */
  var AMBANG = { 'pilih-jurus': [0.8, 6], 'jalur-sekilas': [0.8, 5], 'isi-umum': [0.8, 8], 'kata-kunci': [0.8, 8], 'pindai-tepat': [0.8, 10], 'kebiasaan-kilat': [0.75, 6] };
  function fresh() {
    var s = {}, k;
    for (k in SETEL) s[k] = SETEL[k];
    return {
      settings: s,
      kartu: false,         // Kartu Penjelajah sudah diisi (MULAI berikutnya langsung ke peta)
      lentera: 'kuning',    // warna lentera = warna pita sorot
      hook: false,          // hook 10 detik sudah dimainkan
      kunang: 0,            // kunang-kunang terkumpul (maks 1.000)
      tingkat: { sekilas: 1, pindai: 1 },
      level: {},            // id -> { selesai, bintang, petunjuk3, detik, main, santai }
      kartuJurus: [],       // id Kartu Jurus terkumpul
      ujiKilat: { awal: 0, akhir: 0 },   // detik sampai jawaban tepat (perkiraan, untuk Hasil Belajarku)
      lompatan: { jitu: 0, semua: 0 },   // Lompatan Jitu
      keterampilan: {},     // tag -> { kesempatan, benarAwal, salah, ulang, ulangBenar }
      miskonsepsi: {},      // kode -> jumlah muncul
      waktu: { sekilas: [0, 0], pindai: [0, 0] },   // [jumlah detik, jumlah soal] sampai jawaban tepat (brief 13b)
      bulan: 0,             // jumlah level selesai yang sudah ditampilkan sebagai bulan naik di peta
      tamat: false,         // L5 pernah selesai (Hasil Belajarku dibuka otomatis sekali)
      videoPembuka: false,  // video pembuka V1 sudah diputar sekali di hook
      tipMata: false,       // arahan tombol Lihat teks sudah ditunjukkan
      tipPilihan: false,    // arahan tombol Pilihan (kembali ke pilihan jawaban) sudah ditunjukkan
      detik: 0
    };
  }
  function isObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function angka(v) { return typeof v === 'number' && isFinite(v) && v >= 0; }
  function clean(d) {
    var f = fresh(), k;
    if (!isObj(d)) return f;
    if (!isObj(d.settings)) d.settings = f.settings;
    for (k in f.settings) if (typeof d.settings[k] !== 'boolean') d.settings[k] = f.settings[k];
    for (k in d.settings) if (!(k in f.settings)) delete d.settings[k];
    ['kartu', 'hook', 'tamat', 'videoPembuka', 'tipMata', 'tipPilihan'].forEach(function (n) { if (typeof d[n] !== 'boolean') d[n] = false; });
    d.bulan = angka(d.bulan) ? Math.min(5, Math.round(d.bulan)) : 0;
    if (!isObj(d.waktu)) d.waktu = f.waktu;
    ['sekilas', 'pindai'].forEach(function (j) { var w = d.waktu[j]; if (!Array.isArray(w) || w.length !== 2 || !angka(w[0]) || !angka(w[1])) d.waktu[j] = [0, 0]; });
    if (LENTERA.indexOf(d.lentera) < 0) d.lentera = 'kuning';
    d.kunang = angka(d.kunang) ? Math.min(1000, Math.round(d.kunang)) : 0;
    d.detik = angka(d.detik) ? Math.round(d.detik) : 0;
    if (!isObj(d.tingkat)) d.tingkat = f.tingkat;
    ['sekilas', 'pindai'].forEach(function (j) { var t = d.tingkat[j]; d.tingkat[j] = angka(t) && t >= 1 && t <= 4 ? Math.round(t) : 1; });
    if (!Array.isArray(d.kartuJurus)) d.kartuJurus = [];
    d.kartuJurus = d.kartuJurus.filter(function (x) { return typeof x === 'string' && /^[a-zA-Z]{1,24}$/.test(x); }).slice(0, 10);
    if (!isObj(d.ujiKilat)) d.ujiKilat = f.ujiKilat;
    ['awal', 'akhir'].forEach(function (n) { if (!angka(d.ujiKilat[n])) d.ujiKilat[n] = 0; });
    if (!isObj(d.lompatan) || !angka(d.lompatan.jitu) || !angka(d.lompatan.semua)) d.lompatan = f.lompatan;
    ['level', 'keterampilan', 'miskonsepsi'].forEach(function (n) { if (!isObj(d[n])) d[n] = {}; });
    Object.keys(d.level).forEach(function (n) {
      var v = d.level[n];
      if (!isObj(v) || !angka(v.bintang) || typeof v.selesai !== 'boolean') { delete d.level[n]; return; }
      v.bintang = Math.min(3, Math.round(v.bintang));
      ['petunjuk3', 'detik', 'main', 'kunang', 'ulang', 'ulangBenar'].forEach(function (k2) { v[k2] = angka(v[k2]) ? Math.round(v[k2]) : 0; });
      v.kunang = Math.min(KUOTA[n] || 0, v.kunang);
      v.petunjuk = Array.isArray(v.petunjuk) && v.petunjuk.length === 3 && v.petunjuk.every(angka) ? v.petunjuk.map(Math.round) : [0, 0, v.petunjuk3];
      v.santai = v.santai === true;
    });
    d.kunang = Object.keys(d.level).reduce(function (t, n) { return t + d.level[n].kunang; }, 0);
    Object.keys(d.keterampilan).forEach(function (t) {
      var v = d.keterampilan[t];
      if (!isObj(v) || !angka(v.kesempatan) || !angka(v.benarAwal) || !angka(v.salah)) { delete d.keterampilan[t]; return; }
      if (!angka(v.ulang)) v.ulang = 0;
      if (!angka(v.ulangBenar)) v.ulangBenar = 0;
    });
    Object.keys(d.miskonsepsi).forEach(function (t) { if (!angka(d.miskonsepsi[t])) delete d.miskonsepsi[t]; });
    return d;
  }
  function slot(tag) { return Save.data.keterampilan[tag] || (Save.data.keterampilan[tag] = { kesempatan: 0, benarAwal: 0, salah: 0, ulang: 0, ulangBenar: 0 }); }

  var Save = {
    data: fresh(),
    AMBANG: AMBANG, KEY: KEY, LENTERA: LENTERA, KUOTA: KUOTA,
    load: function () {
      try {
        var raw = root.localStorage.getItem(KEY);
        if (raw) Save.data = clean(JSON.parse(raw));
      } catch (e) { Save.data = memory || fresh(); }
    },
    save: function () {
      memory = Save.data;
      try { root.localStorage.setItem(KEY, JSON.stringify(Save.data)); } catch (e) { /* diblokir: abaikan */ }
    },
    /* satu kesempatan keterampilan selesai; langsung = benar pada coba pertama. Langkah yang dipandu tangan tidak dihitung. */
    catat: function (tag, langsung) { var s = slot(tag); s.kesempatan++; if (langsung) s.benarAwal++; },
    catatSalah: function (tag) { slot(tag).salah++; },
    catatUlang: function (tag, benar) { var s = slot(tag); s.ulang++; if (benar) s.ulangBenar++; },
    catatMis: function (kode) { if (kode) Save.data.miskonsepsi[kode] = (Save.data.miskonsepsi[kode] || 0) + 1; },
    catatLompat: function (jitu) { Save.data.lompatan.semua++; if (jitu) Save.data.lompatan.jitu++; },
    /* waktu sampai jawaban tepat per jurus (detik, dibatasi 300 supaya jeda panjang tidak merusak rata-rata) */
    catatWaktu: function (jurus, detik) { var w = Save.data.waktu[jurus]; if (!w || !(detik > 0)) return; w[0] = Math.round((w[0] + Math.min(300, detik)) * 10) / 10; w[1]++; },
    /* kunang dari level lain (dasar penghitung toples selama bermain) */
    kunangLain: function (id) { var L = Save.data.level; return Object.keys(L).reduce(function (t, n) { return n === id ? t : t + (L[n].kunang || 0); }, 0); },
    dapatKartu: function (id) { if (Save.data.kartuJurus.indexOf(id) < 0) { Save.data.kartuJurus.push(id); return true; } return false; },
    /* status untuk Hasil Belajarku dan Catatan untuk Guru */
    status: function (tag) {
      var s = Save.data.keterampilan[tag], a = AMBANG[tag] || [0.8, 5];
      if (!s || !s.kesempatan) return 'belum';
      var r = s.benarAwal / s.kesempatan;
      if (r >= a[0] && s.kesempatan >= a[1]) return 'dikuasai';
      return r >= 0.5 || s.kesempatan < 2 ? 'berkembang' : 'latihan';
    },
    selesai: function (id) { var l = Save.data.level[id]; return !!(l && l.selesai); },
    catatLevel: function (id, isi) {
      var lama = Save.data.level[id] || { selesai: false, bintang: 0, petunjuk3: 0, detik: 0, main: 0, kunang: 0 };
      var p = Array.isArray(isi.petunjuk) ? isi.petunjuk : [0, 0, isi.petunjuk3 || 0];
      Save.data.level[id] = {
        selesai: lama.selesai || !!isi.selesai,
        bintang: Math.max(lama.bintang, isi.bintang || 0),
        petunjuk3: p[2] || 0,
        petunjuk: [p[0] || 0, p[1] || 0, p[2] || 0],   // petunjuk tingkat 1, 2, 3 pada permainan terakhir
        ulang: isi.ulang || 0, ulangBenar: isi.ulangBenar || 0,   // Ulang Kilat pada permainan terakhir
        detik: isi.detik || 0,
        main: (lama.main || 0) + 1,
        kunang: Math.min(KUOTA[id] || 0, Math.max(lama.kunang || 0, isi.kunang || 0)),
        santai: !!isi.santai
      };
      Save.data.kunang = Save.kunangLain(id) + Save.data.level[id].kunang;
      Save.save();
    },
    /* Murid baru di perangkat yang sama: progres dihapus, pengaturan tetap */
    newStudent: function () { var s = Save.data.settings; Save.data = fresh(); Save.data.settings = s; Save.save(); }
  };
  root.Save = Save;
  if (typeof module !== 'undefined') module.exports = Save;
})(typeof window !== 'undefined' ? window : globalThis);
