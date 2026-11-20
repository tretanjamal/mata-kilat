/* Boot Mata Kilat: simpanan, layar muat (huruf, gambar terdaftar, daftar suara perangkat), lalu layar judul.
   Pola Dear Zuzu! (15) dan Ding Dong Delivery (231). Kait uji window.__test hanya aktif dengan ?test=1 dan tidak terlihat murid. */
(function () {
  Save.load();
  if (U.TEST && /[?&]foto=1/.test(location.search)) document.body.classList.add('foto');
  document.body.classList.add('lentera-' + Save.data.lentera);
  bootStage();
  UI.applySettings();
  document.title = STR.judul.lengkap;
  document.getElementById('rotate-text').textContent = STR.putar;
  /* tata letak hp berubah saat ukuran layar berubah: layar yang aktif menata ulang dirinya */
  Stage.onFit(function () { if (Scenes.cur && Scenes.cur.tata) Scenes.cur.tata(); });
  Muat.buka();

  function suaraSiap() {
    return new Promise(function (ok) {
      var ss = window.speechSynthesis;
      if (!ss || (ss.getVoices() || []).length) { ok(); return; }
      ss.addEventListener('voiceschanged', function () { ok(); });
      setTimeout(ok, 1200);
    });
  }
  var huruf = ['800 40px "Baloo 2"', '700 30px "Baloo 2"', '700 24px Andika', '400 24px Andika'].map(function (f) { return document.fonts.load(f).catch(function () { }); });
  Promise.all(huruf).then(function () {
    Seni.susunLogo(document.getElementById('muat'));
    Muat.atur(0.35);
    return Seni.pramuat(['latarJudul', 'latarRumahPohon', 'peta', 'lentera_kuning', 'lentera_hijau', 'lentera_jingga', 'lentera_ungu', 'tangan', 'pengembang', 'pengembang2', 'instagram']);
  }).then(function () {
    Muat.atur(0.8);
    return suaraSiap();
  }).then(function () {
    Muat.atur(1);
    return Muat.tunggu();
  }).then(function () {
    Muat.tutup();
    Scenes.go('judul');
  }).catch(function (e) {
    console.error(e);
    try { Muat.tutup(); } catch (x) { }
    Scenes.go('judul');
  });

  /* lama bermain (untuk Catatan untuk Guru), tidak dihitung saat tab tersembunyi atau di layar judul */
  setInterval(function () {
    if (Loop.paused || Stage.portrait || !Scenes.name || Scenes.name === 'judul') return;
    Save.data.detik++;
    if (Save.data.detik % 15 === 0) Save.save();
  }, 1000);

  if (U.TEST) {
    window.__test = {
      scene: function () { return Scenes.name; },
      keadaan: function () {
        var c = Scenes.cur, k = c && c.uji ? c.uji.keadaan() : {}, o = { scene: Scenes.name, busy: Scenes.busy, overlay: !!document.querySelector('.overlay') }, n;
        for (n in k) o[n] = k[n];
        o.siap = !!k.siap && !Scenes.busy;
        return o;
      },
      /* langkah murid berikutnya (benar atau salah) dilakukan lewat API layar */
      aksi: function (benar) { return Scenes.cur && Scenes.cur.uji ? Scenes.cur.uji.aksi(benar) : null; },
      ke: function (nama, p) { Scenes.go(nama, p || {}); },
      aturSantai: function (b) { Save.data.settings.santai = !!b; Save.save(); },
      lewatiHook: function () { Save.data.hook = true; Save.data.kartu = true; Save.save(); },
      aturSetelan: function (k, v) { Save.data.settings[k] = v; Save.save(); UI.applySettings(); },
      hapus: function () { Save.newStudent(); },
      simpanan: function () { return JSON.parse(JSON.stringify(Save.data)); },
      ucapan: function () { return Voice.log ? Voice.log.slice() : []; },
      luap: function () { return UI.cekLuap(); },
      huruf: function () { return UI.hurufKecil(); },
      sentuh: function () { return UI.targetKecil(); },
      elemenSvg: function () { return document.querySelectorAll('#stage svg *').length; }
    };
  }
})();
