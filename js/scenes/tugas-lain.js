/* Tugas selain Sekilas dan Pindai (brief bagian 6 dan 6b):
   hook (L1), kebiasaan (Kebiasaan Kilat, L1), cerita (adegan pembuka level), bacaTeliti (momen "baca teliti", L4, tidak dinilai),
   frasa (Kilatan Frasa, L2), teratai (Halaman Teratai, L2: seret atau ketuk keranjang), pilihJurus (L4, L5: lalu kerjakan tugasnya),
   festival (akhir L5: kunang terakhir dilepas). */
(function () {
  var T = STR.tasi, esc = function (x) { return UI.esc(x); };

  /* Tupi tergelincir dari dahan (saat murid terkecoh pengecoh sebentuk): lucu, tidak terluka */
  Lv.tupiTergelincir = function () {
    var S = Lv.S; if (!S || UI.kurangi) return;
    var tp = new Tokoh(S.root, 'tupi', { x: 1190, y: 250, s: 0.6, ekspresi: 'tergelincir', z: 13 });
    Aud.sfx('tergelincir');
    Tween.run(900, function (e, k) { tp.el.style.transform = 'translateY(' + (Math.pow(k, 2) * 420) + 'px) rotate(' + (k * 50) + 'deg)'; tp.el.style.opacity = 1 - Math.max(0, k - 0.7) / 0.3; }, Ease.linear)
      .then(function () { tp.el.remove(); });
  };

  /* Ulin menguap saat murid membaca bagian tengah (brief bagian 8: miskonsepsi "sekilas = membaca semua kata") */
  Lv.ulinMenguap = function () {
    var S = Lv.S; if (!S) return;
    var ul = new Tokoh(S.root, 'ulin', { x: 1196, y: 712, s: 0.5, ekspresi: 'menguap', z: 13, balik: true });
    Aud.sfx('uap'); UI.toast(STR.ulin.tengah);
    var lama = UI.kurangi ? 1800 : 2000;
    if (!UI.kurangi) { ul.el.style.opacity = 0; Tween.run(300, function (e) { ul.el.style.opacity = e; }, Ease.linear); }
    Tween.wait(lama).then(function () { return UI.kurangi ? null : Tween.run(300, function (e) { ul.el.style.opacity = 1 - e; }, Ease.linear); }).then(function () { ul.el.remove(); });
  };
  /* Tupi mengintip saat murid menjawab keliru terlalu cepat berulang kali (brief bagian 8: menebak tanpa membaca; tidak dihukum) */
  Lv.tupiTebak = function () {
    var S = Lv.S; if (!S) return;
    S.tebak = (S.tebak || 0) + 1;
    if (S.tebak < 2) return;
    Save.catatMis('menebak');
    var tp = new Tokoh(S.root, 'tupi', { x: 1196, y: 712, s: 0.5, ekspresi: 'sorak', z: 13, balik: true });
    UI.toast(STR.tasi.tebak); Aud.sfx('boing');
    Tween.wait(2000).then(function () { tp.el.remove(); });
  };

  /* ===================== HOOK (L1) ===================== */
  /* video pembuka V1 sekali (bisa dilewati, diputar ulang dari Buku Jurus); tanpa video, Kurangi animasi, atau mode uji: langsung poster */
  Tugas.hook = function (tok, t) {
    var v = window.ASET && ASET.video && ASET.video.pembuka;
    if (v && !Save.data.videoPembuka && !UI.kurangi && (!U.TEST || /[?&]video=1/.test(location.search))) {
      Lv.S.tugas = 'video';
      return UI.video(v.src).then(function () { Save.data.videoPembuka = true; Save.save(); if (Lv.aktif(tok)) return hookPoster(tok, t); });
    }
    return hookPoster(tok, t);
  };
  function hookPoster(tok, t) {
    var S = Lv.S, P = t.poster;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'hook'; Aud.setBaca(true);
      S.hud.kartu('', '');
      var api = S.api = Bacaan.daftar(S.wadah, { judul: P.judul, baris: P.baris, poster: true });
      api.el.classList.add('papan-poster');
      var baki = Lv.pasangBaki(api, 'waktu');
      baki.classList.add('sembunyi');
      var langkah = 'judul', judulDok = api.el.querySelector('.judul-dok');
      function tutup() {
        S.daun.pasang('judul', api.kotakJudul(), 3, true);
        api.baris.forEach(function (b, i) { S.daun.pasang('b' + i, api.kotakIsi(i), 11 + i); });
        S.daun.gambar();
      }
      S.ukurUlang = function () {
        if (langkah === 'judul') { S.daun.hapusSemua(); tutup(); }
        else if (api.ke >= 0) { var k = api.ke; api.ke = -2; api.pitaKe(k); }
      };
      tutup();
      Lv.kata(T.hook1, 'kaget');
      UI.tunjuk(api.judulEl, { sumber: 'petunjuk', fy: 0.6 });
      function ketukJudul() {
        if (langkah !== 'judul' || !Lv.aktif(tok)) return;
        langkah = 'terbang'; UI.sembunyiTangan(true);
        var r = Bacaan.keLogis(api.judulEl.getBoundingClientRect());
        S.tasi.sambar(r.x + 30, r.y + r.h / 2, function () { S.daun.buka('judul'); Aud.sfx('sresek'); Aud.sfx('good'); UI.lompat(api.judulEl); }, { akhir: 'senang' })
          .then(function () { return Lv.tunggu(tok, 350); })
          .then(function () {
            Aud.sfx('whoosh'); S.daun.bukaSemua(); langkah = 'sorot';
            api.aktif = true; baki.classList.remove('sembunyi'); api.pitaKe(0);
            Lv.kata(T.hook2, 'semangat');
            UI.tunjuk(api.baris[P.jawab], { sumber: 'petunjuk', fy: 0.5 });
          });
      }
      judulDok.addEventListener('click', ketukJudul);
      api.kertas.addEventListener('click', function (e) {
        if (langkah === 'judul' && !e.target.closest('.judul-dok')) { Lv.kata(T.hookSalah, 'semangat'); Aud.sfx('bad'); UI.tunjuk(api.judulEl, { sumber: 'petunjuk', fy: 0.6 }); }
      });
      api.onBaris = function (i) {
        api.tandaiKandidat(i, 'waktu'); api.segarBaki(i);
        if (i === P.jawab && langkah === 'sorot') { Aud.sfx('tik'); Lv.kata(T.hook3, 'intai'); UI.tunjuk(api.tombolBaki(i) || api.baris[i].querySelector('.nilai-ketuk'), { sumber: 'petunjuk', fy: 0.4 }); }
      };
      api.onTangkap = function (n) {
        if (langkah !== 'sorot' || !Lv.aktif(tok) || +n.getAttribute('data-baris') !== P.jawab) return;
        langkah = 'selesai'; UI.sembunyiTangan(true); S.sibuk = true; api.tutupBaki();
        Lv.tangkap(api, n, t.kunang).then(function () {
          if (!Lv.aktif(tok)) return;
          Lv.kata(T.hook4, 'sorak'); Save.data.hook = true; Save.save();
          return Lv.tunggu(tok, 1700);
        }).then(function () { S.sibuk = false; ok(); });
      };
      S.langkahUji = function (benar) {
        if (S.sibuk || langkah === 'terbang') return 'sibuk';
        if (langkah === 'judul') { if (!benar) { api.baris[0].click(); return 'bukan judul'; } ketukJudul(); return 'judul'; }
        if (langkah === 'sorot') {
          if (api.ke !== P.jawab) { api.ke = -2; api.pitaKe(P.jawab, true); return 'sorot'; }
          var n = api.baris[api.ke].querySelector('.nilai-ketuk.kandidat'); if (n) api.onTangkap(n); return 'tangkap';
        }
        return null;
      };
      UI.idle.atur(function () { return langkah === 'judul' ? api.judulEl : api.pita; });
    });
  }

  /* ===================== CERITA (adegan pembuka) ===================== */
  Tugas.cerita = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'cerita';
      S.hud.kartu('', '');
      var tokoh = (t.tokoh || []).map(function (x) { return new Tokoh(S.wadah, x[0], { x: x[1], y: x[2], s: x[3], ekspresi: x[4], balik: !!x[5] }); });
      var kartu = U.h('div', 'papan kartu-cerita muncul-naik', '<p class="teks-cerita" data-cek="teks cerita"></p>');
      S.wadah.appendChild(kartu);
      var i = 0, b;
      function tampil() {
        var u = t.ucapan[i];
        kartu.querySelector('.teks-cerita').textContent = u[1];
        if (u[0] === 'tasi') Lv.kata(u[1], u[2] || 'semangat'); else { Lv.kata(u[1]); }
      }
      tampil();
      b = Lv.tombolLanjut(function () {
        if (S.sibuk || !Lv.aktif(tok)) return;
        i++;
        if (i < t.ucapan.length) { tampil(); return; }
        S.sibuk = true; tokoh.forEach(function (x) { x.el.remove(); }); ok();
      });
      S.langkahUji = function () { b.click(); return 'lanjut'; };
      UI.idle.atur(function () { return b; });
    });
  };

  /* ===================== BACA TELITI (L4, tidak dinilai) ===================== */
  Tugas.bacaTeliti = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'bacaTeliti'; Aud.setBaca(true);
      S.hud.kartu(STR.hud.tujuan, esc(t.tujuan));
      var kartu = U.h('div', 'lembar teks-baca lembar-teliti', '<h2 class="judul-bacaan">' + esc(t.judul) + '</h2><ol class="langkah-teliti"></ol>');
      var ol = kartu.querySelector('ol'), dibaca = 0;
      t.langkah.forEach(function (l, i) {
        var li = U.h('li', 'butir-teliti' + (i ? ' tunggu' : ''), esc(l));
        li.setAttribute('role', 'button'); li.setAttribute('tabindex', '0');
        function baca() {
          if (i !== dibaca || !Lv.aktif(tok)) return;
          li.classList.add('sudah'); Aud.sfx('tik'); dibaca++;
          var lanjut = ol.children[dibaca]; if (lanjut) lanjut.classList.remove('tunggu');
          if (dibaca === t.langkah.length) { S.sibuk = true; Lv.kata(T.telitiSelesai, 'sorak'); Aud.sfx('good'); Lv.kunangKe(UI.titik(li, 0.5), t.kunang || 0).then(function () { return Lv.tunggu(tok, 1200); }).then(function () { S.sibuk = false; ok(); }); }
        }
        li.addEventListener('click', baca);
        li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); baca(); } });
        ol.appendChild(li);
      });
      S.wadah.appendChild(kartu);
      Lv.kata(T.teliti, 'berpikir');
      S.langkahUji = function () { var li = ol.children[dibaca]; if (li) { li.click(); return 'baca ' + dibaca; } return null; };
      UI.idle.atur(function () { return ol.children[dibaca]; });
    });
  };

  /* ===================== KEBIASAAN KILAT (L1) ===================== */
  Tugas.kebiasaan = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'kebiasaan';
      S.hud.kartu(STR.hud.tujuan, esc(STR.kebiasaanTanya));
      var grid = U.h('div', 'grid-kebiasaan'), dapat = 0, adaSalah = false;
      var GAMBAR = { tasi: function () { return Seni.tasi({ ekspresi: 'senang', bayangan: false }); }, ulin: function () { return Seni.ulin({ ekspresi: 'menguap', bayangan: false }); },
        intai: function () { return Seni.tasi({ ekspresi: 'intai', bayangan: false }); }, tupi: function () { return Seni.tupi({ ekspresi: 'malu', bayangan: false }); } };
      t.kartu.forEach(function (k) {
        var svg = Seni.svg(132, 132, Seni.letak(GAMBAR[k.tokoh](), 0, 0, 0.56), ' viewBox="-62 -122 124 128" aria-hidden="true"');
        var b = Input.button(svg + '<span class="teks-kebiasaan">' + esc(k.t) + '</span>', 'ketiga kebiasaan', function () { ketuk(k, b); }, { id: 'kebiasaan-' + k.id });
        b.dataset.bantu = k.bantu ? '1' : '0';
        grid.appendChild(b);
      });
      S.wadah.appendChild(grid);
      Lv.kata(T.kebiasaan, 'semangat');
      function ketuk(k, b) {
        if (b.classList.contains('benar') || b.classList.contains('salah') || S.sibuk || !Lv.aktif(tok)) return;
        if (!k.bantu) {
          adaSalah = true; b.classList.add('salah'); UI.goyang(b); Aud.sfx('bad');
          Save.catatSalah('kebiasaan-kilat'); Save.catatMis('kebiasaan-' + k.id);
          Lv.kata(k.balas, 'berpikir');
          return;
        }
        b.classList.add('benar'); b.setAttribute('aria-pressed', 'true'); dapat++; Aud.sfx('good'); UI.lompat(b);
        Lv.kata(k.balas, 'sorak');
        var p = UI.titik(b, 0.3), semua = dapat === 2;
        if (semua) S.sibuk = true;
        Lv.kunangKe(p, t.kunang / 2).then(function () {
          if (!semua || !Lv.aktif(tok)) return;
          Lv.nilai('kebiasaan-kilat', !adaSalah);
          return Lv.tunggu(tok, 1200).then(function () { S.sibuk = false; ok(); });
        });
      }
      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        var b = Array.prototype.filter.call(grid.querySelectorAll('.kebiasaan'), function (x) { return !x.classList.contains('benar') && !x.classList.contains('salah') && x.dataset.bantu === (benar ? '1' : '0'); })[0]
          || grid.querySelector('.kebiasaan[data-bantu="1"]:not(.benar)');
        if (b) { b.click(); return 'kartu ' + b.dataset.id; }
        return null;
      };
      UI.idle.atur(function () { return grid.querySelector('.kebiasaan:not(.benar):not(.salah)'); });
    });
  };

  /* ===================== KILATAN FRASA (L2) ===================== */
  Tugas.frasa = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'frasa';
      S.hud.kartu(STR.hud.tujuan, esc(STR.frasaTujuan));
      var kartu = U.h('div', 'papan kartu-frasa', '<p class="kilat-frasa" aria-live="polite" data-cek="frasa"></p><div class="pilihan-frasa"></div>');
      S.wadah.appendChild(kartu);
      var teks = kartu.querySelector('.kilat-frasa'), wadahPil = kartu.querySelector('.pilihan-frasa');
      var i = 0, salah = 0, adaSalah = false, fase = 'tunggu', mulai;
      Lv.kata(T.frasa, 'semangat');
      mulai = Input.button('<span class="label-tombol">' + esc(STR.frasaMulai) + '</span>', 'utama alir lebar', function () { mulai.remove(); kilat(); }, { id: 'frasa-mulai' });
      wadahPil.appendChild(mulai);
      function kilat() {
        if (!Lv.aktif(tok)) return;
        var f = t.daftar[i]; salah = 0; fase = 'kilat'; wadahPil.innerHTML = '';
        teks.textContent = f[0]; teks.classList.add('tampil'); Aud.sfx('fwip');
        var lama = Save.data.settings.santai ? 1500 : Math.max(600, 900 - i * 40);
        setTimeout(function () {
          if (!Lv.aktif(tok)) return;
          teks.textContent = '?'; teks.classList.remove('tampil'); fase = 'pilih';
          U.shuffle(Math.random, f).forEach(function (p, k) {
            var b = Input.button(esc(p), 'ketiga alir pilihan-satu', function () { pilih(p, b); }, { id: 'frasa-' + k });
            b.dataset.benar = p === f[0] ? '1' : '0';
            wadahPil.appendChild(b);
          });
        }, lama * (U.TEST ? 0.3 : 1));
      }
      function pilih(p, b) {
        if (fase !== 'pilih' || S.sibuk || !Lv.aktif(tok)) return;
        var f = t.daftar[i];
        if (p !== f[0]) {
          salah++; adaSalah = true; b.classList.add('salah'); b.disabled = true; UI.goyang(b); Aud.sfx('bad'); Save.catatMis('frasa-mirip');
          teks.textContent = salah >= 2 ? f[0] : '?';
          Lv.kata(salah >= 2 ? T.frasaLihat : T.frasaSalah, 'berpikir');
          return;
        }
        b.classList.add('benar'); Aud.sfx('good'); teks.textContent = f[0];
        /* tiap frasa = satu kesempatan keterampilan kebiasaan-kilat (brief bagian 2: minimal 6); bintang dihitung sekali per tugas */
        Save.catat('kebiasaan-kilat', salah === 0);
        S.sibuk = true;
        Lv.kunangKe(UI.titik(b, 0.3), t.kunang / t.daftar.length).then(function () { return Lv.tunggu(tok, 500); }).then(function () {
          i++;
          if (i < t.daftar.length) { S.sibuk = false; kilat(); return; }
          fase = 'selesai';
          S.stat.nilai++; if (!adaSalah) S.stat.benarAwal++;
          Lv.kata(T.frasaSelesai, 'sorak');
          Lv.tunggu(tok, 1000).then(function () { S.sibuk = false; ok(); });
        });
      }
      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        if (fase === 'tunggu') { mulai.click(); return 'mulai'; }
        if (fase !== 'pilih') return 'tunggu';
        var b = wadahPil.querySelector('[data-benar="' + (benar ? '1' : '0') + '"]:not(:disabled)') || wadahPil.querySelector('[data-benar="1"]');
        b.click(); return 'frasa';
      };
      UI.idle.atur(function () { return wadahPil.querySelector('.tombol'); });
    });
  };

  /* ===================== HALAMAN TERATAI (L2) ===================== */
  Tugas.teratai = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'teratai'; Aud.setBaca(true);
      S.hud.kartu(STR.hud.tujuan, esc(STR.terataiTujuan));
      var WARNA = ['hijau', 'jingga', 'ungu', 'biru'];
      var rak = U.h('div', 'rak-keranjang'), keranjang = [];
      t.buku.forEach(function (nama, i) {
        var src = Seni.src('keranjang_' + WARNA[i]);
        var b = Input.button((src ? '<img src="' + src + '" alt="" draggable="false">' : Seni.ikon('buku', 80)) + '<span class="nama-buku" data-cek="buku ' + i + '"><i>' + esc(nama) + '</i></span>', 'ketiga alir keranjang', function () { masuk(i); }, { id: 'keranjang-' + i, aria: nama });
        rak.appendChild(b); keranjang.push(b);
      });
      S.wadah.appendChild(rak);
      var halaman = U.h('div', 'halaman-teratai teks-baca', ''), daunTeratai = U.h('div', 'daun-teratai');
      S.wadah.appendChild(daunTeratai); S.wadah.appendChild(halaman);
      var i = 0, salah = 0, adaSalah = false, berantai = 0;
      function tampil() {
        var h = t.halaman[i]; salah = 0;
        halaman.innerHTML = '<p data-cek="halaman teratai">' + Bacaan.tebal(h.t) + '</p>';
        halaman.style.transform = ''; halaman.classList.remove('jatuh');
        if (!UI.kurangi) { halaman.classList.remove('mendarat'); void halaman.offsetWidth; halaman.classList.add('mendarat'); }
        Aud.sfx('plup');
      }
      Lv.kata(T.teratai, 'semangat');
      tampil();
      /* seret halaman ke keranjang (atau ketuk keranjangnya) */
      var seret = null;
      halaman.addEventListener('pointerdown', function (e) {
        if (S.sibuk) return;
        var p = Stage.toLocal(e.clientX, e.clientY); seret = { x: p.x, y: p.y, gerak: false };
        try { halaman.setPointerCapture(e.pointerId); } catch (x) { }
      });
      halaman.addEventListener('pointermove', function (e) {
        if (!seret) return;
        var p = Stage.toLocal(e.clientX, e.clientY), dx = p.x - seret.x, dy = p.y - seret.y;
        if (Math.abs(dx) + Math.abs(dy) > 10) seret.gerak = true;
        if (seret.gerak) halaman.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dx / 40 + 'deg) scale(.8)';
      });
      function lepas(e) {
        if (!seret) return;
        var s = seret; seret = null;
        if (!s.gerak) return;
        var p = Stage.toLocal(e.clientX, e.clientY), kena = -1;
        keranjang.forEach(function (b, k) { var r = Bacaan.keLogis(b.getBoundingClientRect()); if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y - 40 && p.y <= r.y + r.h) kena = k; });
        if (kena >= 0) masuk(kena); else halaman.style.transform = '';
      }
      halaman.addEventListener('pointerup', lepas);
      halaman.addEventListener('pointercancel', lepas);
      function masuk(k) {
        if (S.sibuk || !Lv.aktif(tok)) return;
        var h = t.halaman[i];
        if (k !== h.buku) {
          salah++; adaSalah = true; berantai = 0; halaman.style.transform = ''; UI.goyang(halaman); UI.goyang(keranjang[k]); Aud.sfx('bad');
          Save.catatSalah('isi-umum'); Save.catatMis(h.jebakan ? 'teratai-jebakan' : 'teratai-salah');
          if (salah <= 2) Lv.petunjuk(salah === 1 ? 1 : 3);
          Lv.kata(salah === 1 ? (h.balas || T.terataiSalah) : U.fmt(T.terataiLihat, { buku: t.buku[h.buku] }), 'berpikir');
          if (salah >= 2) UI.tunjuk(keranjang[h.buku], { sumber: 'petunjuk', fy: 0.4 });
          return;
        }
        S.sibuk = true; UI.sembunyiTangan(true); berantai++;
        Lv.nilai('isi-umum', salah === 0, { jurus: 'sekilas' });
        if (salah && !t.ulang) Lv.ulangi(Lv.serupaTeratai(t, h));
        Aud.sfx('puk'); Aud.sfx('good');
        var r = Bacaan.keLogis(keranjang[k].getBoundingClientRect()), hr = Bacaan.keLogis(halaman.getBoundingClientRect());
        Lv.kata(berantai >= 3 ? T.terataiBerantai : Lv.acak(T.terataiBenar), 'sorak');
        UI.lompat(keranjang[k]);
        var dx = r.x + r.w / 2 - (hr.x + hr.w / 2), dy = r.y - (hr.y + hr.h / 2);
        Tween.run(400, function (e) { halaman.style.transform = 'translate(' + dx * e + 'px,' + dy * e + 'px) scale(' + (1 - 0.8 * e) + ')'; halaman.style.opacity = 1 - e; }, Ease.easeInOutCubic)
          .then(function () { return Lv.kunangKe({ x: r.x + r.w / 2, y: r.y }, t.kunang / t.halaman.length); })
          .then(function () {
            if (!Lv.aktif(tok)) return;
            S.sibuk = false; halaman.style.opacity = ''; i++;
            if (i < t.halaman.length) tampil(); else ok();
          });
      }
      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        var h = t.halaman[i], k = benar ? h.buku : (h.buku + 1) % t.buku.length;
        keranjang[k].click(); return 'keranjang ' + k;
      };
      UI.idle.atur(function () { return halaman; });
    });
  };

  /* ===================== PILIH JURUS (L4, L5) ===================== */
  Tugas.pilihJurus = function (tok, t) {
    var S = Lv.S, it = t.item;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'pilihJurus';
      S.hud.kartu(STR.hud.permintaan, esc(it.t));
      var wadah = U.h('div', 'pilih-jurus-dua');
      var bS = Input.button(Seni.svg(110, 90, Seni.letak(Seni.tasi({ ekspresi: 'lompat' }), 0, 0, 0.36), ' viewBox="-55 -48 110 90" aria-hidden="true"') + '<span class="label-tombol">' + STR.jurus.sekilas + '</span><small>' + esc(STR.jurus.sekilasKecil) + '</small>', 'utama alir jurus-besar', function () { pilih('sekilas', bS); }, { id: 'jurus-sekilas' });
      var bP = Input.button(Seni.ikon('sorot', 90) + '<span class="label-tombol">' + STR.jurus.pindai + '</span><small>' + esc(STR.jurus.pindaiKecil) + '</small>', 'biru alir jurus-besar', function () { pilih('pindai', bP); }, { id: 'jurus-pindai' });
      wadah.appendChild(bS); wadah.appendChild(bP);
      S.wadah.appendChild(wadah);
      var salah = 0;
      Lv.kata(T.pilihJurus, 'berpikir');
      function pilih(j, b) {
        if (S.sibuk || !Lv.aktif(tok)) return;
        if (j !== it.jurus) {
          salah++; Aud.sfx('bad'); UI.goyang(b); b.disabled = true; Save.catatMis('jurus-tertukar');
          if (!t.pandu) { Save.catatSalah('pilih-jurus'); Lv.petunjuk(1); }
          Lv.kata((j === 'sekilas' ? T.peragaanSekilas : T.peragaanPindai) + ' ' + T.pilihMantra, 'berpikir');
          return;
        }
        S.sibuk = true; b.classList.add('benar'); Aud.sfx('good'); UI.lompat(b);
        Lv.nilai('pilih-jurus', salah === 0, { pandu: t.pandu });
        if (salah && !t.pandu && !t.ulang) Lv.ulangi(Lv.serupaJurus(it));
        Lv.kata(it.alasan, 'sorak');
        Lv.kunangKe(UI.titik(b, 0.3), t.kunang || 0).then(function () { return Lv.tunggu(tok, 1300); }).then(function () {
          S.sibuk = false;
          if (t.lanjut) window.Tugas[t.lanjut.jenis](tok, t.lanjut).then(ok); else ok();
        });
      }
      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        var j = benar ? it.jurus : (it.jurus === 'sekilas' ? 'pindai' : 'sekilas'), b = j === 'sekilas' ? bS : bP;
        if (b.disabled) b = it.jurus === 'sekilas' ? bS : bP;
        b.click(); return 'jurus ' + j;
      };
      UI.idle.atur(function () { return bS; });
    });
  };

  /* ===================== FESTIVAL (akhir L5) ===================== */
  Tugas.festival = function (tok, t) {
    var S = Lv.S;
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'festival';
      S.hud.kartu('', '');
      var ulin = new Tokoh(S.wadah, 'ulin', { x: 560, y: 640, s: 0.9, ekspresi: 'senang' });
      var tupi = new Tokoh(S.wadah, 'tupi', { x: 760, y: 640, s: 0.9, ekspresi: 'sorak', balik: true });
      Lv.kata(T.festival1, 'semangat');
      var b = Input.button(Seni.ikon('lentera', 46) + '<span class="label-tombol">' + esc(STR.lepaskan) + '</span>', 'utama tombol-lepas', function () {
        if (S.sibuk || !Lv.aktif(tok)) return;
        S.sibuk = true; b.remove();
        Aud.musik('festival'); Aud.sfx('lonceng');
        ulin.atur('senang'); tupi.atur('sorak'); S.tasi.atur('sorak');
        var n = 0, tj = { x: 1000, y: 120 };
        (function satu() {
          if (!Lv.aktif(tok) || n >= 12) return;
          n++;
          S.daun.terbangKunang(560 + Math.random() * 200, 560, 700 + Math.random() * 500, 60 + Math.random() * 200);
          setTimeout(satu, U.TEST ? 30 : 140);
        })();
        UI.ledak(640, 420, 24);
        /* suasana festival (review Fase 4: terasa sepi): kunang yang dilepas menetap berkelip, lentera daun melayang naik,
           Ulin dan Tupi melompat bergantian. Tanpa gerak bila Kurangi animasi aktif (gerak CSS dimatikan, UI.lompat diam). */
        Adegan.lapisSvg(S.wadah, Adegan.kunangAmbien(16, 240, 90, 860, 330, 77) + Adegan.kunangAmbien(16, 300, 140, 760, 300, 91), 'kunang-festival');
        var langit = U.h('div', 'lentera-naik');
        for (var i = 0; i < 7; i++) { var l = U.h('span', 'satu-lentera', Seni.ikon('lentera', 48)); l.style.left = (300 + i * 110 + (i % 2) * 30) + 'px'; l.style.animationDelay = (-i * 1.1) + 's'; langit.appendChild(l); }
        S.wadah.appendChild(langit);
        (function joget(k) { if (!Lv.aktif(tok) || UI.kurangi) return; UI.lompat((k % 2 ? tupi : ulin).el); Lv.tunggu(tok, 650).then(function () { joget(k + 1); }); })(0);
        Lv.kunangKe({ x: 640, y: 520 }, t.kunang || 0).then(function () { Lv.kata(T.festival2, 'sorak'); return Lv.tunggu(tok, 2400); }).then(function () { S.sibuk = false; ok(); });
      }, { id: 'lepaskan' });
      S.wadah.appendChild(b);
      S.langkahUji = function () { b.click(); return 'lepaskan'; };
      UI.idle.atur(function () { return b; });
    });
  };
})();
