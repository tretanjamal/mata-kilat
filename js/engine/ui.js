/* UI: komponen bersama. Disalin dari Dear Zuzu! (15; asal Ding Dong Delivery 231 dan Kafe Cilik 483: overlay, sakelar,
   Pengaturan, Jeda, Informasi/Referensi/Pengembang dengan 2 kartu digeser panah, toast, tangan penunjuk dan isyarat diam 8 detik,
   partikel, hitung naik, goyang, lompat). Disesuaikan untuk Mata Kilat: HUD level (papan nama, kartu Tujuan/Cari, toples kunang,
   Buku Jurus), tab Informasi (Tujuan, Cara Main, Jurus, Untuk Guru), Buku Jurus, dan sakelar Huruf bacaan besar. */
(function (root) {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function stage() { return document.getElementById('stage'); }
  /* titik di panggung untuk elemen atau {x, y}; fy = letak vertikal (0 atas, 1 bawah) */
  function titik(sasaran, fy) {
    if (!sasaran) return null;
    if (sasaran.x != null && !sasaran.getBoundingClientRect) return sasaran;
    var r = sasaran.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return Stage.toLocal(r.left + r.width / 2, r.top + r.height * (fy == null ? 0.4 : fy));
  }

  var UI = {
    prefersReduced: !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches),
    kurangi: false,
    esc: esc,
    titik: titik,
    applySettings: function () {
      var s = Save.data.settings;
      Aud.setMuted(s.senyap); Aud.setBus('musik', s.musik); Aud.setBus('sfx', s.efek);
      UI.kurangi = s.kurangi || UI.prefersReduced;
      document.body.classList.toggle('kurangi-gerak', UI.kurangi);
      document.body.classList.toggle('huruf-besar', !!s.hurufBesar);
      Tween.speed = UI.kurangi ? 0.4 : (U.TEST ? 0.3 : 1);
    },
    ikon: function (nama, ukuran, arg) { return Seni.ikon(nama, ukuran || 40, arg); },
    tombolIkon: function (nama, aria, onTap, o) {
      o = o || {}; o.aria = aria;
      return Input.button(UI.ikon(nama, o.ukuran || 40), 'ketiga ikon ' + (o.cls || ''), onTap, o);
    },
    /* suara perangkat untuk bahasa ini tersedia? */
    adaSuara: function (lang) { return Voice.available() && !!Voice.voice(lang, 'w'); },
    /* tombol suara untuk kalimat ini berguna di perangkat ini: ada rekamannya, atau ada suara perangkat untuk bahasanya */
    bisaSuara: function (teks, tokoh, lang) {
      if (U.TEST) return !/[?&]tanpasuara=1/.test(location.search);
      return !!(teks && Voice.rekaman(teks, tokoh)) || UI.adaSuara(lang);
    },
    /* tombol suara diketuk saat suara dimatikan: pesan singkat, bukan diam. true = suara memang mati. */
    cekSenyap: function (lang) {
      if (Aud.muted) { UI.toast(STR.ikon.suaraSenyap); return true; }
      if (/^en/.test(lang) && Save.data.settings.suara === false) { UI.toast(STR.ikon.suaraTokohMati); return true; }
      return false;
    },
    /* arahan Pip (bahasa Indonesia) dibacakan bila diizinkan */
    bacakan: function (teks, paksa) {
      if (!teks || (!paksa && !Save.data.settings.bacakan) || !UI.bisaSuara(teks, null, 'id-ID')) return Promise.resolve();
      return Voice.say(teks, { lang: 'id-ID', info: true });
    },
    /* kata bahasa Inggris dibacakan (ubin diketuk, Kamus, Eja) */
    ucapKata: function (kata, pelan, segera) {
      if (!kata || !Save.data.settings.bacaKata && !segera) return Promise.resolve();
      return Voice.say(kata, { tokoh: 'kata', lang: 'en-US', info: true, rate: pelan ? 0.6 : undefined, segera: !!segera });
    },
    tombolArahan: function (ambilTeks) {
      var b = UI.tombolIkon('dengar', STR.ikon.dengarInstruksi, function () { if (UI.cekSenyap('id-ID')) return; Voice.stop(); UI.bacakan(ambilTeks(), true); }, { id: 'dengar-arahan', cls: 'alir' });
      b.segar = function (teks) { b.style.display = UI.bisaSuara(teks, null, 'id-ID') ? '' : 'none'; };
      return b;
    },
    barisTab: function (daftar, tutup) { var b = U.h('div', 'tab-buku'); b.appendChild(daftar); if (tutup) b.appendChild(tutup); return b; },
    fokus: function (el) { if (el && el.focus && !el.disabled) { try { el.focus({ preventScroll: true }); } catch (e) { } } },
    fokusHilang: function () { var a = document.activeElement; return !a || a === document.body || a.disabled || !document.body.contains(a); },

    /* ikon pojok kanan atas layar judul: suara, layar penuh, pengaturan. Mengembalikan fungsi pembersih. */
    pojok: function (parent) {
      var s = Save.data.settings, fs = null;
      var atur = UI.tombolIkon('gerigi', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { id: 'pengaturan', cls: 'pojok pojok-0' });
      if (FS.supported()) fs = UI.tombolIkon('layarPenuh', STR.ikon.layarPenuh, function () { FS.toggle(function () { UI.toast(STR.ikon.fsDitolak); }); }, { id: 'layar-penuh', cls: 'pojok pojok-1' });
      var snd = UI.tombolIkon(s.senyap ? 'senyap' : 'suara', '', function () { s.senyap = !s.senyap; Save.save(); UI.applySettings(); segar(); }, { id: 'suara', cls: 'pojok ' + (fs ? 'pojok-2' : 'pojok-1') });
      function segar() {
        Input.label(snd, UI.ikon(s.senyap ? 'senyap' : 'suara'));
        snd.setAttribute('aria-label', s.senyap ? STR.ikon.suaraMati : STR.ikon.suaraNyala);
        if (fs) fs.setAttribute('aria-label', FS.isFull() ? STR.ikon.keluarPenuh : STR.ikon.layarPenuh);
      }
      [snd, fs, atur].forEach(function (b) { if (b) parent.appendChild(b); });
      segar();
      FS.onChange(segar);
      return function () { FS.offChange(segar); };
    },

    /* HUD level (brief 9g): Jeda, papan nama level, kartu Tujuan/Cari, toples kunang-kunang, Buku Jurus */
    hud: function (parent, o) {
      var h = {};
      parent.appendChild(UI.tombolIkon('jeda', STR.ikon.jeda, function () { UI.jeda(o.jeda || {}); }, { id: 'jeda', cls: 'tombol-jeda' }));
      var nama = U.h('div', 'papan-nama' + ((o.nama || '').length > 13 ? ' nama-panjang' : ''), UI.esc(o.nama || ''));
      nama.setAttribute('data-cek', 'nama level');
      parent.appendChild(nama);
      var kartu = U.h('div', 'papan kartu-atas', '<span class="tag"></span><p class="teks-kartu" data-cek="kartu atas" aria-live="polite"></p>');
      parent.appendChild(kartu);
      h.kartu = function (tag, html, warna) {
        var t = kartu.querySelector('.tag');
        t.textContent = tag || ''; t.classList.toggle('tag-biru', warna === 'biru');
        kartu.querySelector('.teks-kartu').innerHTML = html || '';
        kartu.style.display = tag ? '' : 'none';
      };
      h.kartuEl = kartu;
      var tp = U.h('div', 'toples-hud', Seni.svg(46, 48, Seni.toples(7), ' viewBox="0 0 50 52" aria-hidden="true"') + '<span class="nilai" data-cek="kunang"></span>');
      tp.setAttribute('role', 'img');
      parent.appendChild(tp);
      h.toplesEl = tp;
      h.kunang = function (n) { tp.querySelector('.nilai').textContent = n; tp.setAttribute('aria-label', U.fmt(STR.hud.kunang, { n: n })); };
      h.tambahKunang = function (dari, ke) { UI.lompat(tp); return UI.hitungNaik(tp.querySelector('.nilai'), dari, ke, function (v) { return String(v); }, 520); };
      /* titik tujuan kunang yang terbang (tengah toples, koordinat panggung) */
      h.titikToples = function () { return titik(tp.querySelector('svg'), 0.5) || { x: 1030, y: 44 }; };
      parent.appendChild(UI.tombolIkon('buku', STR.ikon.bukuJurus, function () { UI.bukuJurus(); }, { id: 'buku-jurus', cls: 'tombol-buku' }));
      h.kunang(Save.data.kunang);
      return h;
    },

    /* panel modal bergaya kertas surat. Mengembalikan {el, body, panel, close} */
    overlay: function (judul, cls) {
      var ov = U.h('div', 'overlay'), panel = U.h('div', 'panel kertas ' + (cls || '')), opener = document.activeElement;
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', judul);
      document.getElementById('scene-root').inert = true;
      document.querySelectorAll('.overlay').forEach(function (x) { x.inert = true; });
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      panel.innerHTML = '<div class="pita-kepala">' + esc(judul) + '</div>';
      var body = U.h('div', 'isi-panel'); panel.appendChild(body); ov.appendChild(panel);
      stage().appendChild(ov);
      UI.sembunyiTangan(true);
      if (!UI.kurangi) panel.classList.add('panel-muncul');
      var api = {
        el: ov, body: body, panel: panel,
        close: function () {
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          var rest = document.querySelectorAll('.overlay');
          if (rest.length) rest[rest.length - 1].inert = false; else document.getElementById('scene-root').inert = false;
          if (opener && opener.isConnected && !opener.disabled) { try { opener.focus({ preventScroll: true }); } catch (e) { } }
          if (api.onClose) api.onClose();
        }
      };
      return api;
    },
    closeOverlays: function () {
      document.querySelectorAll('.overlay, .toast').forEach(function (x) { x.parentNode.removeChild(x); });
      UI._p.list = [];
      document.getElementById('scene-root').inert = false;
      UI.idle.fn = null;
      UI.sembunyiTangan(true);
    },
    tombolTutup: function (o, teks) {
      var b = Input.button(teks || STR.tombol.tutup, 'kedua alir lebar', function () { o.close(); }, { id: 'tutup' });
      o.body.appendChild(b);
      setTimeout(function () { UI.fokus(b); }, 30);
      return b;
    },
    /* sakelar Nyala/Mati dengan label teks (bukan hanya warna) */
    barisSakelar: function (label, get, set, id, catatan, nonaktif) {
      var row = U.h('div', 'baris-sakelar');
      row.innerHTML = '<span class="label-sakelar">' + esc(label) + (catatan ? '<small>' + esc(catatan) + '</small>' : '') + '</span>';
      var b = Input.button('', 'sakelar alir', function () { set(!get()); cat(); }, { id: id, aria: label });
      function cat() {
        var on = get();
        b.classList.toggle('nyala', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        Input.label(b, '<span class="kenop"></span><span class="teks-sakelar">' + (on ? STR.pengaturan.nyala : STR.pengaturan.mati) + '</span>');
      }
      if (nonaktif) b.disabled = true;
      cat(); row.appendChild(b);
      return row;
    },
    pengaturan: function (onClose) {
      var T = STR.pengaturan, s = Save.data.settings, o = UI.overlay(T.judul, 'panel-pengaturan');
      var grid = U.h('div', 'grid-sakelar');
      function simpan() { Save.save(); UI.applySettings(); }
      grid.appendChild(UI.barisSakelar(T.musik, function () { return s.musik; }, function (v) { s.musik = v; simpan(); }, 'sw-musik'));
      grid.appendChild(UI.barisSakelar(T.efek, function () { return s.efek; }, function (v) { s.efek = v; simpan(); }, 'sw-efek'));
      grid.appendChild(UI.barisSakelar(T.bacakan, function () { return s.bacakan; }, function (v) { s.bacakan = v; simpan(); if (!v) Voice.stop(); }, 'sw-bacakan'));
      grid.appendChild(UI.barisSakelar(T.santai, function () { return s.santai; }, function (v) { s.santai = v; simpan(); if (UI.onSantai) UI.onSantai(v); }, 'sw-santai', T.santaiCatatan));
      grid.appendChild(UI.barisSakelar(T.hurufBesar, function () { return s.hurufBesar; }, function (v) { s.hurufBesar = v; simpan(); if (UI.onHuruf) UI.onHuruf(v); }, 'sw-huruf', T.hurufBesarCatatan));
      grid.appendChild(UI.barisSakelar(T.kurangi, function () { return s.kurangi || UI.prefersReduced; }, function (v) { s.kurangi = v; simpan(); }, 'sw-kurangi', UI.prefersReduced ? T.kurangiCatatan : '', UI.prefersReduced));
      var row = U.h('div', 'baris-sakelar'), yakin = false;
      row.innerHTML = '<span class="label-sakelar">' + esc(T.muridBaru) + '<small>' + esc(T.muridBaruCatatan) + '</small></span>';
      var hapus = Input.button(T.hapus, 'ketiga alir hapus', function () {
        if (!yakin) { yakin = true; Input.label(hapus, T.yakin); return; }
        Save.newStudent(); Scenes.go('judul');
      }, { id: 'murid-baru' });
      row.appendChild(hapus); grid.appendChild(row);
      o.body.appendChild(grid);
      UI.tombolTutup(o);
      o.onClose = onClose;
      return o;
    },
    /* menu jeda: permainan dan suara berhenti selama panel terbuka; bintang tampil di sini (di HP chip bintang disembunyikan) */
    jeda: function (opsi) {
      var T = STR.jeda, o = UI.overlay(T.judul, 'panel-jeda');
      Voice.jeda(); Tween.paused = true;
      o.body.appendChild(U.h('p', 'bintang-jeda', Seni.svg(46, 48, Seni.toples(7), ' viewBox="0 0 50 52" aria-hidden="true"') + '<span>' + esc(U.fmt(T.kunang, { n: Save.data.kunang })) + '</span>'));
      function tombol(label, cls, id, fn) { var b = Input.button(label, cls + ' alir lebar', fn, { id: id }); o.body.appendChild(b); return b; }
      var lanjut = tombol(T.lanjut, 'utama', 'jeda-lanjut', function () { o.close(); });
      if (opsi.ulangi) tombol(T.ulangi, 'kedua', 'jeda-ulangi', function () { Voice.buangTertahan(); o.close(); opsi.ulangi(); });
      tombol(T.peta, 'ketiga', 'jeda-peta', function () { Voice.buangTertahan(); o.close(); Scenes.go('peta'); });
      tombol(T.pengaturan, 'ketiga', 'jeda-pengaturan', function () { UI.pengaturan(); });
      tombol(T.keJudul, 'ketiga', 'jeda-judul', function () { Voice.buangTertahan(); o.close(); Scenes.go('judul'); });
      o.onClose = function () { Tween.paused = false; Voice.lanjutTertahan(); if (opsi.onClose) opsi.onClose(); };
      setTimeout(function () { UI.fokus(lanjut); }, 30);
      return o;
    },
    /* Informasi (Tujuan, Cara Main, Ruangan) dan Referensi (Sumber Materi, Kecerdasan Artifisial) bertab,
       Pengembang berfoto dan digeser dengan panah (2 kartu, berputar). Tanpa tautan keluar. */
    info: function (jenis) {
      var D = STR.info[jenis], o = UI.overlay(D.judul, 'panel-info panel-' + jenis), HAL = null;
      function daftar(a, tag) { return '<' + (tag || 'ul') + ' class="daftar-info">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + (tag || 'ul') + '>'; }
      function baris(a, en) { return '<div class="baris-info">' + a.map(function (r) { return '<div><b' + (en ? ' lang="en"' : '') + '>' + esc(r[0]) + '</b><span' + (en ? ' lang="en"' : '') + '>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>'; }
      function pustaka(r) { return '<p class="pustaka">' + esc(r[0]) + ' <i>' + esc(r[1]) + '</i> ' + esc(r[2]) + '</p>'; }
      if (jenis === 'info') HAL = {
        tujuan: function () { return '<p class="sorot-info">' + esc(D.pengantar) + '</p><p><b>' + esc(D.tujuanJudul) + '</b></p><p class="tujuan-info">' + esc(D.tujuan).replace('skimming', '<i>skimming</i>').replace('scanning', '<i>scanning</i>') + '</p>'; },
        cara: function () { return daftar(D.cara, 'ol') + '<p class="kecil-info">' + esc(D.caraCatatan) + '</p>'; },
        jurus: function () { return baris(D.jurus) + '<p class="mantra-info">' + esc(STR.bukuJurus.sekilasMantra) + '<br>' + esc(STR.bukuJurus.pindaiMantra) + '</p><p class="kecil-info">' + esc(D.jurusCatatan) + '</p>'; },
        guru: function () { return daftar(D.guru); }
      };
      if (jenis === 'referensi') HAL = {
        sumber: function () { return '<p><b>' + esc(D.sumberPengantar) + '</b></p>' + D.sumber.map(pustaka).join('') + '<p>' + esc(D.topik) + '</p><p class="kecil-info">' + esc(D.huruf) + '</p>'; },
        ka: function () { return '<p>' + esc(D.kaPengantar) + '</p>' + baris(D.ka) + '<p><b>' + esc(D.kaRujukanJudul) + '</b></p>' + pustaka(D.kaRujukan); }
      };
      if (!HAL) {
        var P = D.profil, ke = 0, wadah = U.h('div', 'geser-pengembang'), kartu = U.h('div', 'kartu-pengembang'), urutan = U.h('p', 'urutan-pengembang');
        kartu.setAttribute('data-cek', 'info pengembang');
        urutan.setAttribute('aria-live', 'polite');
        var barisData = function (x) {
          if (typeof x === 'string') return '<span>' + esc(x) + '</span>';
          var src = Seni.gambar(x.ikon);
          return '<span class="baris-ikon">' + (src ? '<img src="' + src + '" alt="' + esc(x.alt) + '" width="32" height="32">' : esc(x.alt) + ': ') + esc(x.teks) + '</span>';
        };
        var tampil = function (i) {
          ke = (i + P.length) % P.length;
          var p = P[ke], foto = Seni.gambar(p.foto);
          kartu.innerHTML = '<div class="foto-pengembang">' + (foto ? '<img src="' + foto + '" alt="' + esc(p.fotoAlt) + '">' : Seni.potretTasi(180)) + '</div>' +
            '<div class="data-pengembang"><b class="nama-pengembang">' + esc(p.nama) + '</b>' + p.baris.map(barisData).join('') + '<span>' + esc(D.tahun) + '</span></div>' +
            (p.daftar ? '<div class="prestasi"><b>' + esc(p.daftarJudul) + '</b>' + daftar(p.daftar) + '</div>' : '');
          kartu.classList.toggle('tanpa-daftar', !p.daftar);
          urutan.textContent = U.fmt(D.urutan, { n: ke + 1, t: P.length });
        };
        var kiri = UI.tombolIkon('panah', D.sebelumnya, function () { tampil(ke - 1); }, { id: 'pengembang-kiri', cls: 'panah-kiri alir' });
        var kanan = UI.tombolIkon('panah', D.berikutnya, function () { tampil(ke + 1); }, { id: 'pengembang-kanan', cls: 'alir' });
        wadah.appendChild(kiri); wadah.appendChild(kartu); wadah.appendChild(kanan);
        o.body.appendChild(wadah); o.body.appendChild(urutan);
        tampil(0);
        /* tombol panah keyboard menggeser kartu (Tab tetap berpindah antartombol) */
        o.el.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { tampil(ke + (e.key === 'ArrowLeft' ? -1 : 1)); Aud.sfx('kertas'); e.preventDefault(); e.stopPropagation(); }
        });
        UI.tombolTutup(o);
        return o;
      }
      var tabs = U.h('div', 'daftar-tab'), isi = U.h('div', 'teks-info isi-tab');
      isi.setAttribute('data-cek', 'info ' + jenis);
      var pilih = function (k) {
        isi.innerHTML = HAL[k]();
        Array.prototype.forEach.call(tabs.children, function (b) { var on = b.dataset.id === 'tab-' + k; b.classList.toggle('aktif', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      };
      Object.keys(HAL).forEach(function (k) {
        var b = Input.button(esc(D.tab[k]), 'ketiga alir tab', function () { pilih(k); }, { id: 'tab-' + k });
        b.setAttribute('role', 'tab');
        tabs.appendChild(b);
      });
      tabs.setAttribute('role', 'tablist');
      var tutup = Input.button(esc(STR.tombol.tutup), 'kedua alir tab tutup-tab', function () { o.close(); }, { id: 'tutup' });
      o.body.appendChild(UI.barisTab(tabs, tutup)); o.body.appendChild(isi);
      pilih(Object.keys(HAL)[0]);
      setTimeout(function () { UI.fokus(tutup); }, 30);
      return o;
    },
    /* Video pembuka V1 (GDD bagian 1 dan 11): menutupi panggung, tombol Lewati selalu ada (juga Esc), musik diredam selama video.
       Janji selesai saat video habis atau dilewati; lapisan lalu memudar sendiri supaya adegan di bawahnya langsung tersusun.
       Bila peramban menolak memutar dengan suara, dicoba tanpa suara; bila tetap gagal, langsung selesai.
       Pudar memakai transisi CSS, bukan Tween, karena Tween dijeda saat video diputar ulang dari Buku Jurus (dulu softlock).
       Lapisan di bawahnya dibuat inert selama video, lalu dipulihkan dan fokus kembali ke tombol pemanggil. */
    video: function (src) {
      return new Promise(function (ok) {
        var lap = U.h('div', 'video-pembuka'), vid = document.createElement('video'), selesai = false, opener = document.activeElement;
        var dibekukan = Array.prototype.filter.call(document.querySelectorAll('#scene-root, .overlay'), function (x) { return !x.inert; });
        dibekukan.forEach(function (x) { x.inert = true; });
        vid.src = src; vid.setAttribute('playsinline', ''); vid.preload = 'auto';
        vid.setAttribute('aria-label', STR.ikon.video);
        lap.appendChild(vid);
        var lewati = Input.button('<span class="label-tombol">' + esc(STR.tombol.lewati) + '</span>' + UI.ikon('kanan', 34), 'kedua tombol-lewati', function () { akhir(); }, { id: 'lewati-video' });
        lap.appendChild(lewati);
        /* narasi bertimer dengan keterangan di layar (playtest kreator: video perlu narasi supaya imersif).
           segera: tetap diucapkan saat diputar ulang dari Buku Jurus (permainan sedang dijeda). */
        var kap = U.h('p', 'teks-video'), pewaktu = [], bersuara = false;
        kap.setAttribute('aria-live', 'polite'); kap.style.display = 'none';
        lap.appendChild(kap);
        (STR.videoNarasi || []).forEach(function (n) {
          pewaktu.push(setTimeout(function () {
            if (selesai) return;
            /* keterangan mengikuti waktu video, suara menyusul sebisanya (mesin suara yang macet tidak menunda keterangan) */
            kap.innerHTML = (n[1] ? '<b>' + esc(n[1].charAt(0).toUpperCase() + n[1].slice(1)) + ':</b> ' : '') + esc(n[2]); kap.style.display = '';
            if (Save.data.settings.bacakan && UI.bisaSuara(n[2], n[1] || null, 'id-ID')) {
              bersuara = true;
              Voice.say(n[2], { lang: 'id-ID', tokoh: n[1] || undefined, segera: true }).then(function () { if (!selesai) Aud.duck(true); });
            }
          }, n[0] * 1000));
        });
        stage().appendChild(lap);
        UI.sembunyiTangan(true);
        Aud.duck(true);
        function kunci(e) { if (e.key === 'Escape') { e.preventDefault(); akhir(); } }
        function sembunyi() { if (document.hidden) vid.pause(); else if (!selesai) vid.play().catch(function () { }); }
        document.addEventListener('keydown', kunci);
        document.addEventListener('visibilitychange', sembunyi);
        function akhir() {
          if (selesai) return; selesai = true;
          pewaktu.forEach(clearTimeout);
          if (bersuara) Voice.stop();
          document.removeEventListener('keydown', kunci); document.removeEventListener('visibilitychange', sembunyi);
          Aud.duck(false); Aud.sfx('whoosh');
          dibekukan.forEach(function (x) { if (x.isConnected) x.inert = false; });
          if (opener && opener.isConnected && !opener.disabled) { try { opener.focus({ preventScroll: true }); } catch (e) { } }
          ok();
          lap.style.pointerEvents = 'none'; vid.pause();
          var hapus = function () { vid.removeAttribute('src'); try { vid.load(); } catch (e) { } lap.remove(); };
          if (UI.kurangi) hapus(); else { lap.classList.add('pudar'); setTimeout(hapus, 420); }
        }
        /* video habis: bingkai terakhir ditahan sampai narasi selesai (paling lama 3 detik) */
        vid.addEventListener('ended', function () {
          var n = 0;
          (function cek() { if (selesai) return; if (n++ < 15 && Voice.sibuk()) setTimeout(cek, 200); else akhir(); })();
        });
        vid.addEventListener('error', akhir);
        var p = vid.play();
        if (p && p.catch) p.catch(function () { vid.muted = true; vid.play().catch(akhir); });
        setTimeout(function () { UI.fokus(lewati); }, 30);
      });
    },
    /* Buku Jurus: dua mantra, pengertian singkat, dan Kartu Jurus terkumpul. Permainan dijeda selama terbuka. */
    bukuJurus: function () {
      var B = STR.bukuJurus, o = UI.overlay(B.judul, 'panel-buku');
      Voice.jeda(); Tween.paused = true;
      function jurus(nama, mantra, arti, warna) { return '<div class="kartu-jurus-besar ' + warna + '"><b>' + esc(nama).replace(/[(](\w+)[)]/, '(<i>$1</i>)') + '</b><span class="mantra-besar">' + esc(mantra) + '</span><span>' + esc(arti) + '</span></div>'; }
      o.body.appendChild(U.h('div', 'dua-jurus', jurus(B.sekilas, B.sekilasMantra, B.sekilasArti, 'hijau') + jurus(B.pindai, B.pindaiMantra, B.pindaiArti, 'biru')));
      o.body.appendChild(U.h('p', 'pilih-jurus-info', esc(B.pilih)));
      var kk = Save.data.kartuJurus, isi = kk.length ? kk.map(function (k) { return '<span class="kartu-kecil">' + UI.ikon('bintang', 26) + esc(STR.kartuJurus[k] || k) + '</span>'; }).join('') : '<span class="kecil-info">' + esc(B.kosong) + '</span>';
      /* kartu terkumpul di kisi dua kolom yang bisa digulir: dulu 10 kartu mendorong tombol Tutup keluar panel (playtest kreator) */
      o.body.appendChild(U.h('div', 'kumpulan-kartu', '<b>' + esc(U.fmt(B.kartu, { n: kk.length })) + '</b><div class="baris-kartu' + (kk.length ? ' gulir-kartu" data-gulir tabindex="0" aria-label="' + esc(U.fmt(B.kartu, { n: kk.length })) : '') + '">' + isi + '</div>'));
      /* kisi yang bisa digulir diberi gradasi bawah sampai murid menggulir ke akhir */
      var kisi = o.body.querySelector('.gulir-kartu');
      if (kisi) {
        var segarKisi = function () { kisi.classList.toggle('bisa-gulir', kisi.scrollHeight > kisi.clientHeight + 2); kisi.classList.toggle('di-akhir', kisi.scrollTop + kisi.clientHeight >= kisi.scrollHeight - 4); };
        kisi.addEventListener('scroll', segarKisi, { passive: true });
        setTimeout(segarKisi, 0);
      }
      var fakta = STR.muatTips[Math.floor(Math.random() * STR.muatTips.length)];
      o.body.appendChild(U.h('p', 'tahu-buku', '<b>' + esc(B.tahu) + '</b> <span data-cek="tahukah">' + esc(fakta) + '</span>'));
      var v = root.ASET && root.ASET.video && root.ASET.video.pembuka, baris = U.h('div', 'baris-tombol-buku');
      if (v) baris.appendChild(Input.button(UI.ikon('mata', 36) + '<span class="label-tombol">' + esc(B.video) + '</span>', 'ketiga alir', function () { UI.video(v.src); }, { id: 'tonton-pembuka' }));
      o.body.appendChild(baris);
      UI.tombolTutup(o);
      if (v) baris.appendChild(o.body.querySelector('[data-id="tutup"]'));
      /* tombol X di pojok panel selalu terlihat */
      o.panel.appendChild(UI.tombolIkon('tutup', STR.tombol.tutup, function () { o.close(); }, { id: 'tutup-pojok', cls: 'tutup-pojok', ukuran: 34 }));
      o.onClose = function () { Tween.paused = false; Voice.lanjutTertahan(); };
      return o;
    },
    /* teks yang meluap dari kotaknya: elemen bertanda data-cek, badan tombol, dan teks SVG bertanda data-maxw (dipakai uji) */
    cekLuap: function () {
      var hasil = [];
      Array.prototype.forEach.call(document.querySelectorAll('#stage [data-cek], #stage .tombol .badan'), function (el) {
        if (!el.offsetParent) return;
        /* lembar panjang di HP sengaja digulir di dalam panel (brief 9g): tinggi tidak dihitung meluap */
        if (el.scrollWidth > el.clientWidth + 1 || (!el.hasAttribute('data-gulir') && el.scrollHeight > el.clientHeight + 8)) hasil.push((el.getAttribute('data-cek') || el.textContent.trim().slice(0, 30)) + ': ' + el.scrollWidth + 'x' + el.scrollHeight + ' > ' + el.clientWidth + 'x' + el.clientHeight);
        var wadah = el.parentElement && el.parentElement.closest('.balon, .balon-tasi, .papan, .panel, .panel-hasil');
        /* tombol suara di pojok balon Tasi sengaja menyembul keluar balon */
        if (wadah && wadah !== el && !el.closest('.balon-tasi .tombol')) {
          var a = el.getBoundingClientRect(), b = wadah.getBoundingClientRect(), s = Stage.scale || 1;
          if (a.bottom > b.bottom + 2 * s || a.right > b.right + 2 * s) hasil.push((el.getAttribute('data-cek') || 'teks') + ': melewati wadah (bawah ' + Math.round((a.bottom - b.bottom) / s) + ' px, kanan ' + Math.round((a.right - b.right) / s) + ' px)');
        }
      });
      Array.prototype.forEach.call(document.querySelectorAll('#stage text[data-maxw]'), function (t) {
        if (!t.getClientRects().length) return;
        var w = t.getComputedTextLength(), m = +t.getAttribute('data-maxw');
        if (w > m) hasil.push('svg "' + t.textContent + '": ' + Math.round(w) + ' > ' + m);
      });
      return hasil;
    },
    /* teks HTML yang tampil di bawah 20 px logis (standar studio bagian 3: label minimal 20 px, isi 24 px); dipakai uji tangkapan */
    hurufKecil: function () {
      var hasil = [];
      Array.prototype.forEach.call(document.querySelectorAll('#stage *'), function (el) {
        if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') return;
        var teks = Array.prototype.some.call(el.childNodes, function (nd) { return nd.nodeType === 3 && nd.nodeValue.trim(); });
        if (!teks || !el.getClientRects().length) return;
        var cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
        var uk = parseFloat(cs.fontSize);
        if (uk < 19.5) hasil.push((el.className || el.tagName) + ' "' + el.textContent.trim().slice(0, 24) + '" ' + uk + ' px');
      });
      return hasil;
    },
    /* target sentuh terkecil dalam piksel fisik (batas mutlak 44 px), dan tombol yang titik tengahnya tertutup elemen lain.
       Selain .tombol juga [role=button] (kata pertanyaan, butir baca teliti). Tidak dihitung: segmen bacaan Sekilas (baris teks)
       dan nilai di daftar Pindai, karena keduanya punya jalan lain yang besar (pita sorot dan baki Tangkap). */
    targetKecil: function () {
      var s = Stage.scale || 1, kecil = [], tertutup = [];
      Array.prototype.forEach.call(document.querySelectorAll('#stage .tombol, #stage [role=button]:not(.seg):not(.nilai-ketuk)'), function (el) {
        if (!el.offsetParent || el.disabled || el.classList.contains('hiasan') || el.closest('[inert]')) return;
        var nama = el.getAttribute('aria-label') || el.dataset.id || el.textContent.trim().slice(0, 20);
        var r = el.getBoundingClientRect(), m = Math.min(r.width, r.height);
        if (m > 0 && m < 44) kecil.push(nama + ' ' + Math.round(m) + ' px');
        var cs = getComputedStyle(el), x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (cs.visibility === 'hidden' || cs.pointerEvents === 'none' || x < 0 || y < 0 || x > innerWidth || y > innerHeight) return;
        var atas = document.elementFromPoint(x, y);
        if (atas && atas !== el && !el.contains(atas)) tertutup.push(nama + ' oleh ' + (typeof atas.className === 'string' ? atas.className : atas.tagName));
      });
      return { skala: Math.round(s * 1000) / 1000, kecil: kecil, tertutup: tertutup };
    },
    toast: function (text) {
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      var t = U.h('div', 'toast', esc(text));
      t.setAttribute('role', 'status');
      stage().appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
    },

    /* tangan penunjuk: ujung telunjuk di titik sasaran. sumber 'idle' hilang saat murid bergerak. */
    tangan: null, sumberTangan: '',
    tunjuk: function (sasaran, o) {
      o = o || {};
      var p = titik(sasaran, o.fy);
      if (!p) return;
      if (!UI.tangan) {
        /* tangan dari kreator (hand_cursor, telunjuk ke atas) bila terdaftar; tanpa itu, tangan SVG kode */
        var g = Seni.gambar('tangan');
        UI.infoTangan = g && g.src && g.ujung ? g : null;
        UI.tangan = U.h('div', 'tangan-penunjuk' + (UI.infoTangan ? ' tangan-gambar' : ''), UI.infoTangan ?
          '<span class="gerak-tangan tunjuk"><img src="' + g.src + '" width="' + g.w + '" height="' + g.h + '" alt="" draggable="false"></span>' :
          Seni.svg(120, 140, Seni.g(Seni.g(Seni.tangan(0), { 'class': 'tunjuk' }), { transform: 'translate(44 8)' })));
        UI.tangan.setAttribute('aria-hidden', 'true');
      }
      stage().appendChild(UI.tangan);
      UI.tanganBawah = o.bawah != null ? o.bawah : p.y > 540;
      UI.letakTangan(p.x, p.y);
      UI.tangan.classList.add('tampil');
      UI.sumberTangan = o.sumber || 'petunjuk';
    },
    /* ujung jari di (x, y); dibalik ke bawah bila sasaran di bagian bawah layar supaya tangan tetap di dalam panggung */
    letakTangan: function (x, y) {
      var t = UI.tangan, gt = UI.infoTangan;
      if (!t) return;
      t.classList.toggle('bawah', !!UI.tanganBawah);
      if (gt) {
        t.style.left = Math.round(x - gt.ujung[0]) + 'px';
        t.style.top = Math.round(UI.tanganBawah ? y - (gt.h - gt.ujung[1]) : y - gt.ujung[1]) + 'px';
        return;
      }
      t.style.left = Math.round(x - 44) + 'px';
      t.style.top = Math.round(UI.tanganBawah ? y - 132 : y - 8) + 'px';
    },
    sembunyiTangan: function (semua) {
      if (!UI.tangan) return;
      if (semua || UI.sumberTangan === 'idle') { UI.tangan.classList.remove('tampil'); UI.sumberTangan = ''; }
    },
    /* isyarat bila 8 detik tanpa aksi (CLAUDE.md bagian 4). fn mengembalikan elemen tempat aksi berikutnya, bukan jawaban. */
    idle: {
      fn: null, t: 0,
      atur: function (fn) { UI.idle.fn = fn; UI.idle.reset(); },
      reset: function () { UI.idle.t = performance.now(); UI.sembunyiTangan(false); },
      cek: function () {
        var I = UI.idle;
        if (!I.fn || Loop.paused || Tween.paused || Scenes.busy || document.querySelector('.overlay')) return;
        if (Voice.sibuk()) { I.t = performance.now(); return; }
        if (UI.sumberTangan === 'petunjuk') return;
        if (performance.now() - I.t > 8000 && UI.sumberTangan !== 'idle') { var el = I.fn(); if (el) UI.tunjuk(el, { sumber: 'idle' }); }
      }
    },

    /* partikel kecil saat benar: satu kanvas untuk semua */
    _p: { kanvas: null, ctx: null, list: [], jalan: false },
    ledak: function (x, y, nn) {
      if (UI.kurangi) return;
      var P = UI._p, C = Seni.C, warna = [C.bintang, C.mint, C.koral, C.langit, C.kertas];
      if (!P.kanvas) {
        P.kanvas = U.h('canvas', 'kanvas-partikel'); P.kanvas.width = 1280; P.kanvas.height = 720;
        P.ctx = P.kanvas.getContext('2d');
      }
      if (!P.kanvas.parentNode) stage().appendChild(P.kanvas);
      for (var i = 0; i < (nn || 14); i++) {
        var a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 260;
        P.list.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 180, umur: 0, maks: 0.7 + Math.random() * 0.4, r: 5 + Math.random() * 6, w: warna[i % warna.length], b: i % 3 === 0 });
      }
      if (P.jalan) return;
      P.jalan = true;
      var akhir = performance.now();
      (function tick(ts) {
        var dt = Math.min(0.05, (ts - akhir) / 1000); akhir = ts;
        var c = P.ctx;
        c.clearRect(0, 0, 1280, 720);
        if (!Loop.paused) P.list.forEach(function (q) { q.umur += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 520 * dt; });
        P.list = P.list.filter(function (q) { return q.umur < q.maks; });
        P.list.forEach(function (q) {
          var k = 1 - q.umur / q.maks;
          c.globalAlpha = Math.min(1, k * 1.5);
          c.fillStyle = q.w; c.strokeStyle = Seni.C.tinta; c.lineWidth = 2.5;
          c.beginPath();
          if (q.b) { for (var j = 0; j < 10; j++) { var rr = j % 2 ? q.r * 0.45 : q.r * 1.2, aa = j * Math.PI / 5 - Math.PI / 2; c.lineTo(q.x + rr * Math.cos(aa), q.y + rr * Math.sin(aa)); } c.closePath(); }
          else c.arc(q.x, q.y, q.r * 0.7, 0, Math.PI * 2);
          c.fill(); c.stroke();
        });
        c.globalAlpha = 1;
        if (P.list.length) requestAnimationFrame(tick); else { P.jalan = false; c.clearRect(0, 0, 1280, 720); }
      })(akhir);
    },
    /* angka menghitung naik dengan bunyi detak */
    hitungNaik: function (el, dari, ke, fmt, ms) {
      var lalu = dari;
      el.textContent = fmt(dari);
      return Tween.run(ms || 700, function (e) {
        var v = Math.round(dari + (ke - dari) * e);
        if (v !== lalu) { lalu = v; el.textContent = fmt(v); Aud.sfx('tick', 1 + e * 0.5); }
      }, Ease.easeOutCubic).then(function () { el.textContent = fmt(ke); });
    },
    /* goyang lembut untuk jawaban salah (6 px, 300 ms; GDD 10) */
    goyang: function (el) {
      if (UI.kurangi || !el) return Promise.resolve();
      return Tween.run(300, function (e, k) { el.style.translate = (Math.sin(k * Math.PI * 5) * 6 * (1 - k)).toFixed(1) + 'px 0'; }, Ease.linear).then(function () { el.style.translate = ''; });
    },
    /* lompatan kecil untuk jawaban benar */
    lompat: function (el) {
      if (UI.kurangi || !el) return Promise.resolve();
      return Tween.run(420, function (e, k) { el.style.translate = '0 ' + (-Math.sin(k * Math.PI) * 18).toFixed(1) + 'px'; el.style.scale = (1 + Math.sin(k * Math.PI) * 0.08).toFixed(3); }, Ease.linear)
        .then(function () { el.style.translate = ''; el.style.scale = ''; });
    }
  };
  document.addEventListener('pointerdown', function () { UI.idle.reset(); }, true);
  document.addEventListener('keydown', function () { UI.idle.reset(); }, true);
  setInterval(function () { UI.idle.cek(); }, 500);
  root.UI = UI;
})(window);
