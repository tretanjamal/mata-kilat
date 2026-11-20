/* Tugas Sekilas dan Pindai untuk semua level (brief bagian 6b dan 6c).
   Sekilas  tingkat 1: kilau di jalur sekilas, lompatan bebas | 2: tanpa kilau, 5 lompatan | 3: subjudul, 4 lompatan
            tingkat 4: teks utuh tanpa daun, Bintang Kilat. Soal: isi umum, judul terbaik, gagasan utama paragraf.
   Pindai   tingkat 1: kunci menyala, bentuk terpilih, kilau | 2: murid memilih kata kunci | 3: + memilih bentuk, Pastikan
            tingkat 4: tanpa kilau, beberapa soal per teks, Bintang Kilat. Kamus: Lompat Huruf dulu, lalu sorot. */
(function () {
  var T = STR.tasi, esc = function (x) { return UI.esc(x); };
  var IKON_BENTUK = { waktu: 'jam', tanggal: 'kalender', angka: 'angka', harga: 'harga', nama: 'nama', tempat: 'tempat', arti: 'buku' };
  var KATA_TANYA = /^(berapa|siapa|kapan|apa|apakah|pukul|di|mana|manakah|bagaimana|mengapa|yang|ke|untuk|dan|dari|pada|ini|itu)$/i;

  /* ===================== JURUS SEKILAS ===================== */
  Tugas.sekilas = function (tok, t) {
    var S = Lv.S, teks = t.teks, pandu = !!t.pandu, tingkat = pandu ? 1 : Lv.tingkat('sekilas', t);
    var soalList = teks.soal || [{ tanya: teks.tanya, pilihan: teks.pilihan }];
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'sekilas'; Aud.setBaca(true);
      S.hud.kartu(STR.hud.tujuan, esc(soalList[0].tanya));
      var tTampil = 0, lem = Bacaan.lembar(S.wadah, teks), dibuka = 0, tengah = 0, fase = 'lompat', salah = 0, salahTotal = 0, iPandu = 0, iSoal = 0, lompatIni = 0, jituIni = 0, tSoal = performance.now();
      var kilau = tingkat === 1, batas = { 1: 0, 2: 5, 3: 4, 4: 0 }[tingkat], sisa = batas, t0 = performance.now();
      if (Save.data.settings.santai) { kilau = true; batas = 0; }
      var urutPandu = pandu ? ['judul', 'p0s0', 'p1s0'] : null;
      function chip(k) { return '<span class="chip" data-chip="' + k + '"><span class="cek">' + Seni.ikon('centang', 24) + '</span>' + STR.mantra[k] + '</span>'; }
      var bilah = U.h('div', 'bilah bilah-sekilas', '<span class="label" data-cek="Lompatan">' + STR.lompatan + '</span><span class="ikon-baris" aria-live="polite"></span>' +
        '<span class="mantra">' + ['judul', 'awal', 'tebal'].concat(teks.gambar ? ['gambar'] : []).map(chip).join('') + '</span>');
      S.wadah.appendChild(bilah);
      function segarLompat() {
        var w = bilah.querySelector('.ikon-baris');
        if (!batas) { w.innerHTML = '<b>' + STR.bebas + '</b>'; return; }
        var x = ''; for (var i = 0; i < batas; i++) x += Seni.ikon(i < batas - sisa ? 'daunPudar' : 'daun', 34);
        w.innerHTML = x; w.setAttribute('aria-label', U.fmt(STR.sisaLompat, { n: sisa, t: batas }));
      }
      segarLompat();
      if (tingkat === 4) bilah.style.display = 'none';
      var kartu = null;
      var jawab = Input.button('<span class="label-tombol">' + STR.tombol.jawab + '</span>', 'utama tombol-jawab', function () {
        if (fase === 'tanya' && kartu) { kartu.classList.remove('ringkas'); jawab.style.display = 'none'; UI.sembunyiTangan(true); return; }
        bukaTanya();
      }, { id: 'jawab' });
      jawab.disabled = tingkat < 4;
      S.wadah.appendChild(jawab);
      if (tingkat === 4) lem.seg.forEach(function (s) { lem.buka(s); });
      function klip() { var k = Bacaan.keLogis(lem.el.getBoundingClientRect()); S.daun.klip = { x: k.x + 4, y: k.y + 4, w: k.w - 8, h: k.h - 8 }; }
      klip();
      if (tingkat < 4) lem.pasangDaun(S.daun, kilau);
      var gulirAntre = false;
      lem.el.addEventListener('scroll', function () { if (gulirAntre) return; gulirAntre = true; requestAnimationFrame(function () { gulirAntre = false; if (S.ukurUlang) S.ukurUlang(); }); });
      S.ukurUlang = function () {
        klip(); S.daun.hapusSemua(); if (tingkat < 4) lem.pasangDaun(S.daun, kilau && fase === 'lompat');
        if (S.rasi) S.daun.pasangRasi(S.rasi());
      };
      function arahan() {
        if (!pandu || !Lv.aktif(tok)) return;
        if (iPandu < urutPandu.length) { Lv.kata([T.sekilasJudul, T.sekilasAwal, T.sekilasAwal2][iPandu]); UI.tunjuk(lem.cari(urutPandu[iPandu]).el, { sumber: 'petunjuk', fy: 0.5 }); }
        else { Lv.kata(T.sekilasJawab, 'semangat'); UI.tunjuk(jawab, { sumber: 'petunjuk', fy: 0.4 }); }
      }
      if (pandu) { Lv.kata(T.sekilasPengantar, 'semangat'); Tween.wait(1700).then(arahan); }
      else if (teks.gambar && tingkat < 4 && !Save.data.gambarDikenal) {
        /* teks bergambar pertama: Tasi memperkenalkan langkah Gambar dan menunjuk keterangannya */
        Save.data.gambarDikenal = true; Save.save();
        var gEl = lem.cari('g').el;
        Lv.kata(T.sekilasGambar, 'semangat');
        /* lembar bergulir (HP): gulir ke keterangan dulu, daun diukur ulang oleh pendengar gulir, baru tangan menunjuk */
        if (lem.el.scrollHeight > lem.el.clientHeight + 4) gEl.scrollIntoView({ block: 'center' });
        Lv.tunggu(tok, 350).then(function () { if (fase === 'lompat') UI.tunjuk(gEl, { sumber: 'petunjuk', fy: 0.5 }); });
      }
      else Lv.kata(tingkat === 4 ? T.sekilasUtuh : (batas ? U.fmt(T.sekilasBatas, { n: batas }) : T.sekilasBebas), 'semangat');
      function tandaiChip(s) {
        var k = s.peran === 'judul' || s.peran === 'subjudul' ? 'judul' : (s.peran === 'awal' ? 'awal' : (s.peran === 'gambar' ? 'gambar' : null));
        if (k) bilah.querySelector('[data-chip="' + k + '"]').classList.add('sudah');
        if (s.el.querySelector('b')) bilah.querySelector('[data-chip="tebal"]').classList.add('sudah');
      }
      lem.onKetuk = function (s) {
        if (fase !== 'lompat' || S.sibuk || !Lv.aktif(tok) || tingkat === 4) return;
        if (pandu && iPandu < urutPandu.length && s.id !== urutPandu[iPandu]) { Aud.sfx('bad'); UI.tunjuk(lem.cari(urutPandu[iPandu]).el, { sumber: 'petunjuk', fy: 0.5 }); return; }
        S.sibuk = true; UI.sembunyiTangan(true);
        if (!pandu) { S.stat.lompat++; lompatIni++; if (s.jalur) { S.stat.jitu++; jituIni++; } Save.catatLompat(s.jalur); }
        if (batas) { sisa--; segarLompat(); }
        var p = lem.titik(s);
        S.tasi.sambar(p.x, p.y, function () { lem.buka(s, S.daun); Aud.sfx('sresek'); tandaiChip(s); }, { akhir: s.jalur ? 'senang' : 'berpikir' }).then(function () {
          S.sibuk = false;
          if (!Lv.aktif(tok)) return;
          dibuka++;
          if (dibuka >= 2) jawab.disabled = false;
          if (!s.jalur) { tengah++; if (tengah === 2 && !pandu) { Lv.kata(T.sekilasTengah, 'berpikir'); Save.catatMis('sekilas-tengah'); Lv.ulinMenguap(); } }
          if (pandu) { iPandu++; arahan(); }
          else if (batas && sisa <= 0) { Lv.kata(T.sekilasHabis, 'semangat'); bukaTanya(); }
        });
      };
      function bukaTanya() {
        if (fase !== 'lompat' || S.sibuk || !Lv.aktif(tok)) return;
        fase = 'tanya'; UI.sembunyiTangan(true); jawab.style.display = 'none'; bilah.style.display = 'none';
        if (tingkat < 4) { S.daun.hapusSemua(); lem.pasangDaun(S.daun, false); }
        tampilSoal();
      }
      function tampilSoal() {
        var sl = soalList[iSoal];
        salah = 0;
        S.hud.kartu(STR.hud.tujuan, esc(sl.tanya));
        Lv.kata(sl.tanya, 'berpikir');
        Array.prototype.forEach.call(lem.el.querySelectorAll('.paragraf-sorot'), function (x) { x.classList.remove('paragraf-sorot'); });
        if (sl.paragraf != null) lem.paragrafEl(sl.paragraf).classList.add('paragraf-sorot');
        if (kartu) kartu.remove();
        kartu = U.h('div', 'kartu-tanya' + (teks.panjang ? ' kartu-panjang' : '') + (UI.kurangi ? '' : ' muncul-naik'), '<div class="daftar-pilihan"></div>');
        var daftar = kartu.querySelector('.daftar-pilihan');
        sl.pilihan.forEach(function (pl, i) {
          var b = Input.button('<span class="huruf">' + 'ABCD'.charAt(i) + '</span><span class="teks-pilihan">' + esc(pl.t) + '</span>', 'ketiga pilihan', function () { pilih(pl, b); }, { id: 'pilihan-' + i });
          b.dataset.jenis = pl.jenis;
          daftar.appendChild(b);
        });
        /* tombol mata berlabel: pilihan disembunyikan supaya teks di bawahnya terbaca, tombol Pilihan memunculkannya lagi */
        var mata = Input.button(Seni.ikon('mata', 40) + '<span class="label-tombol">' + esc(STR.tombol.lihatTeks) + '</span>', 'ketiga tombol-lihat', function () {
          kartu.classList.add('ringkas'); Input.label(jawab, '<span class="label-tombol">' + esc(STR.tombol.lihatPilihan) + '</span>'); jawab.style.display = ''; jawab.disabled = false; UI.fokus(jawab);
          UI.sembunyiTangan(true);
          if (!Save.data.tipPilihan) { Save.data.tipPilihan = true; Save.save(); Lv.kata(T.lihatKembali, 'semangat'); UI.tunjuk(jawab, { sumber: 'petunjuk', fy: 0.5 }); }
        }, { id: 'lihat-teks', aria: STR.tombol.lihatTeks });
        kartu.appendChild(mata);
        S.root.appendChild(kartu);
        /* pertama kali tombol mata tampil: Tasi menjelaskan gunanya sesudah pertanyaan selesai dibacakan (playtest kreator) */
        if (mata.offsetParent && !Save.data.tipMata) {
          Save.data.tipMata = true; Save.save();
          Lv.tunggu(tok, 1200).then(function () { return Lv.tungguSuara(tok, 32); }).then(function () {
            if (fase !== 'tanya' || !kartu.isConnected || kartu.classList.contains('ringkas') || salah) return;
            Lv.kata(T.lihatMata, 'intai'); UI.tunjuk(mata, { sumber: 'petunjuk', fy: 0.5 });
          });
        }
        UI.idle.atur(function () { return kartu.querySelector('.pilihan:not(:disabled)'); });
        tTampil = performance.now();
      }
      var PESAN = { sempit: T.salahSempit, luas: T.salahLuas, topik: T.salahTopik, rincian: T.salahSempit, paragraf: T.salahParagraf };
      function pilih(pl, b) {
        if (fase !== 'tanya' || S.sibuk || !Lv.aktif(tok)) return;
        UI.sembunyiTangan(true);
        var sl = soalList[iSoal];
        if (pl.jenis !== 'benar') {
          salah++; salahTotal++; b.classList.add('salah'); b.disabled = true; UI.goyang(b); Aud.sfx('bad');
          if (!pandu && performance.now() - tTampil < 1200) Lv.tupiTebak();
          Save.catatMis('sekilas-' + pl.jenis); if (!pandu) Save.catatSalah('isi-umum');
          if (!pandu && salah <= 3) Lv.petunjuk(salah);
          if (salah === 1) Lv.kata(pl.balas || PESAN[pl.jenis] || T.salahSempit, 'berpikir');
          else {
            /* petunjuk ke-2: jalur sekilas dibuka dan disorot; ke-3: Tasi menyebut isinya */
            lem.seg.forEach(function (s) { if (s.jalur && (sl.paragraf == null || s.paragraf === sl.paragraf || s.peran === 'judul')) { if (!s.buka) lem.buka(s, S.daun); s.el.classList.add('terang'); } });
            Aud.sfx('sresek');
            Lv.kata(salah === 2 ? T.salah2 : U.fmt(T.salah3, { rasi: sl.inti || teks.rasi }), 'semangat');
          }
          return;
        }
        S.sibuk = true;
        b.classList.add('benar'); Aud.sfx('good');
        Array.prototype.forEach.call(kartu.querySelectorAll('.pilihan'), function (x) { if (x !== b) x.classList.add('redup'); });
        Lv.nilai('isi-umum', salah === 0, { pandu: pandu, jurus: 'sekilas', detik: (performance.now() - tSoal) / 1000 });
        if (salah && !pandu && !t.ulang) Lv.ulangi(Lv.serupaSekilas(t, teks, sl));
        tSoal = performance.now();
        lem.seg.forEach(function (s) { s.el.classList.remove('terang'); });
        if (iSoal < soalList.length - 1) {
          Lv.kata(Lv.acak(T.benarSekilas), 'sorak');
          Lv.tunggu(tok, 1100).then(function () { S.sibuk = false; iSoal++; tampilSoal(); });
          return;
        }
        fase = 'selesai';
        if (!pandu && tingkat < 4) Lv.catatJalur(lompatIni, jituIni);
        if (tingkat === 4 && !pandu) Lv.kilat((performance.now() - t0) / 1000, 10 + kataTeks() * 0.25);
        Lv.kata(Lv.acak(T.benarSekilas), 'sorak');
        S.rasi = function () { return lem.seg.filter(function (s) { return s.buka && s.jalur; }).map(lem.titikRasi).filter(Boolean); };
        var titik = S.rasi();
        S.daun.pasangRasi(titik).then(function () {
          if (!Lv.aktif(tok)) return;
          var k = Bacaan.keLogis(lem.el.getBoundingClientRect()), nama = U.h('div', 'nama-rasi', Seni.ikon('bintang', 30) + '<span>' + esc(teks.rasi) + '</span>');
          nama.style.left = (k.x + 24) + 'px'; nama.style.top = (k.y + k.h - 4) + 'px';
          nama.setAttribute('data-cek', 'nama rasi');
          S.wadah.appendChild(nama);
          Aud.sfx('sring');
          return Lv.kunangKe(titik[0] || { x: k.x + 40, y: k.y + 40 }, t.kunang || 0);
        }).then(function () { return Lv.tunggu(tok, 1300); }).then(function () { S.rasi = null; S.sibuk = false; ok(); });
      }
      function kataTeks() { return lem.el.textContent.split(/\s+/).length; }
      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        if (fase === 'lompat') {
          if (pandu && iPandu < urutPandu.length) { lem.onKetuk(lem.cari(urutPandu[iPandu])); return 'pandu'; }
          var cocok = lem.seg.filter(function (s) { return !s.buka && (benar ? s.jalur : !s.jalur); })[0];
          if (tingkat < 4 && cocok && (benar ? dibuka < 3 : tengah < 1) && (!batas || sisa > 1)) { lem.onKetuk(cocok); return 'lompat ' + cocok.id; }
          if (!jawab.disabled) { jawab.click(); return 'jawab'; }
          var lain = lem.seg.filter(function (s) { return !s.buka; })[0];
          if (lain) { lem.onKetuk(lain); return 'lompat'; }
          return null;
        }
        if (fase === 'tanya') {
          if (kartu.classList.contains('ringkas')) { jawab.click(); return 'buka kartu'; }
          var tb = Array.prototype.filter.call(kartu.querySelectorAll('.pilihan'), function (x) { return !x.disabled && (benar ? x.dataset.jenis === 'benar' : x.dataset.jenis !== 'benar'); })[0]
            || kartu.querySelector('.pilihan[data-jenis="benar"]');
          tb.click(); return 'pilih ' + tb.dataset.jenis;
        }
        return null;
      };
      UI.idle.atur(function () {
        if (fase !== 'lompat') return null;
        if (pandu && iPandu < urutPandu.length) return lem.cari(urutPandu[iPandu]).el;
        return dibuka >= 3 || tingkat === 4 ? jawab : (lem.seg.filter(function (s) { return !s.buka; })[0] || {}).el;
      });
    });
  };

  /* ===================== JURUS PINDAI ===================== */
  function kapsul(ikon, teks, kelas, id) {
    return '<span class="kapsul ' + (kelas || '') + '" data-langkah="' + id + '">' + Seni.ikon(ikon, 38) + '<span class="teks-kapsul">' + esc(teks) + '</span><span class="cek">' + Seni.ikon('centang', 24) + '</span></span>';
  }
  function bentukDari(tanya) {
    var t = tanya.toLowerCase();
    if (/pukul|jam berapa/.test(t)) return 'waktu';
    if (/kapan|tanggal|hari apa/.test(t)) return 'tanggal';
    if (/harga|bayar|biaya/.test(t)) return 'harga';
    if (/siapa/.test(t)) return 'nama';
    if (/di mana|ke mana|tempat/.test(t)) return 'tempat';
    if (/arti/.test(t)) return 'arti';
    return 'angka';
  }

  Tugas.pindai = function (tok, t) {
    var S = Lv.S, d = t.dok || t.dokFn(), pandu = !!t.pandu, uji = !!t.uji;
    var tingkat = pandu || uji ? 1 : Lv.tingkat('pindai', t);
    var soalList = d.soal || [{ tanya: d.tanya, kunci: d.kunci, kunci2: d.kunci2, bentuk: d.bentuk, jawab: d.jawab, jawabT: d.jawabT, pengecoh: d.pengecoh, huruf: d.huruf }];
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = uji ? 'uji' : 'pindai'; Aud.setBaca(true);
      var dok = { judul: d.judul, anak: d.anak, kolom: d.kolom, baris: d.kamus ? d.kamus.entri[d.kamus.huruf[0]] : d.baris, catatan: d.catatan, tab: !!d.kamus, kelas: d.kelas };
      var api = S.api = Bacaan.daftar(S.wadah, dok);
      api.tanpaKilau = tingkat === 4 && !Save.data.settings.santai;
      var langkah = U.h('div', 'langkah');
      langkah.setAttribute('aria-label', 'Langkah jurus Pindai');
      S.wadah.appendChild(langkah);
      Lv.pasangBaki(api, null);
      var pegangan = U.h('div', 'pegangan-pita', Seni.ikon('lentera', 44));
      pegangan.style.display = 'none';   /* tampil sesudah pita dipasang (dulu terlihat di pojok kiri atas, menimpa tombol Jeda) */
      S.wadah.appendChild(pegangan);
      var tSorot = 0, baki = null, iSoal = 0, sl, fase, salah, salahKunci, kb, t0 = performance.now(), hurufKini = d.kamus ? d.kamus.huruf[0] : null, konfirmasi = null;

      function letakPegangan() {
        if (api.ke < 0 || !api.baris[api.ke]) { pegangan.style.display = 'none'; return; }
        pegangan.style.display = '';
        var r = Bacaan.keLogis(api.baris[api.ke].getBoundingClientRect()), kb2 = Bacaan.keLogis(api.el.getBoundingClientRect());
        pegangan.style.left = (kb2.x - 30) + 'px'; pegangan.style.top = (r.y + r.h / 2 - 30) + 'px';
      }
      /* Lompat Huruf (kamus): tab abjad di atas daftar */
      if (d.kamus) {
        d.kamus.huruf.forEach(function (h) {
          api.tabEl.appendChild(Input.button(h, 'ketiga alir tab-satu', function () { gantiHuruf(h); }, { id: 'huruf-' + h, aria: 'Huruf ' + h }));
        });
        segarTab();
      }
      function segarTab() { Array.prototype.forEach.call(api.tabEl.querySelectorAll('.tombol'), function (b) { b.classList.toggle('aktif', b.textContent === hurufKini); }); }
      function gantiHuruf(h) {
        if (S.sibuk || !Lv.aktif(tok)) return;
        hurufKini = h; Aud.sfx('fwip'); segarTab();
        api.gantiBaris(d.kamus.entri[h]); api.segarBaki(-1); letakPegangan();
        kb = api.barisKunci(sl.kunci);
        if (fase === 'sorot' && h !== sl.huruf) { salahKunci = true; Lv.kata(U.fmt(T.kamusHuruf, { h: sl.huruf }), 'berpikir'); Save.catatMis('kamus-dari-atas'); var tb = api.tabEl.querySelector('[data-id="huruf-' + sl.huruf + '"]'); if (tb) UI.tunjuk(tb, { sumber: 'petunjuk', fy: 0.5 }); }
        else if (h === sl.huruf && fase === 'sorot') { Lv.kata(T.pindaiSorot, 'intai'); UI.sembunyiTangan(true); }
        if (api.baris.length) api.pitaKe(0);
      }

      /* ---------- satu soal ---------- */
      function mulaiSoal() {
        sl = soalList[iSoal]; salah = 0; salahKunci = false; t0 = performance.now();
        sl.bentuk = sl.bentuk || bentukDari(Array.isArray(sl.tanya) ? sl.tanya.map(function (x) { return typeof x === 'string' ? x : x.k; }).join('') : sl.tanya);
        var pakaiKunci = tingkat >= 2, pakaiBentuk = tingkat >= 3, pakaiPastikan = tingkat >= 3;
        fase = pakaiKunci ? 'kunci' : 'sorot';
        api.ke = -1; api.pita.classList.add('sembunyi'); api.segarBaki(-1); api.bingkaiKunci(-1);
        api.baris.forEach(function (b) { b.classList.remove('baris-sorot'); });
        tampilSoal(pakaiKunci);
        langkah.innerHTML = kapsul('kunci', STR.langkah.kunci, pakaiKunci ? 'aktif' : 'selesai', 'kunci') + '<span class="panah-langkah">' + Seni.ikon('kanan', 22) + '</span>' +
          kapsul(pakaiBentuk ? 'bentuk' : IKON_BENTUK[sl.bentuk], pakaiBentuk ? STR.langkah.bentuk : STR.bentuk[sl.bentuk], pakaiBentuk ? '' : 'selesai', 'bentuk') + '<span class="panah-langkah">' + Seni.ikon('kanan', 22) + '</span>' +
          kapsul('sorot', STR.langkah.sorot, pakaiKunci ? '' : 'aktif', 'sorot') +
          (pakaiPastikan ? '<span class="panah-langkah">' + Seni.ikon('kanan', 22) + '</span>' + kapsul('pastikan', STR.langkah.pastikan, '', 'pastikan') : '');
        api.aktif = !pakaiKunci;
        if (pakaiKunci) api.tutupBaki(); else api.bukaBaki();
        kb = api.barisKunci(sl.kunci);
        if (!pakaiKunci) { api.pitaKe(0); tSorot = performance.now(); }
        if (pandu) {
          Lv.kata(T.pindaiPengantar, 'semangat');
          Lv.tunggu(tok, 1800).then(function () { if (fase === 'sorot') Lv.kata(T.pindaiSiap); return Lv.tunggu(tok, 1600); })
            .then(function () { if (fase === 'sorot' && api.ke !== kb) { Lv.kata(T.pindaiSorot, 'intai'); UI.tunjuk(api.baris[kb], { sumber: 'petunjuk', fy: 0.5 }); } });
        } else if (fase === 'kunci') Lv.kata(iSoal ? T.soalBerikut : T.pindaiKunci, 'intai');
        else Lv.kata(uji ? T.uji : (d.kamus ? T.kamusMulai : T.pindaiSorot), 'intai');
      }
      function tampilSoal(pilihKata) {
        var html;
        if (Array.isArray(sl.tanya)) html = sl.tanya.map(function (x) { return typeof x === 'string' ? esc(x) : (tingkat === 1 && !uji ? '<span class="kunci">' + esc(x.k) + '</span>' : esc(x.k)); }).join('');
        else {
          html = esc(sl.tanya);
          /* teks pembangkit (Ulang Kilat) di tingkat 1: kata kunci tetap menyala */
          if (tingkat === 1 && !uji && sl.kunci) { var ik = html.toLowerCase().indexOf(esc(sl.kunci).toLowerCase()); if (ik >= 0) html = html.slice(0, ik) + '<span class="kunci">' + html.slice(ik, ik + esc(sl.kunci).length) + '</span>' + html.slice(ik + esc(sl.kunci).length); }
        }
        if (pilihKata) {
          /* langkah Kunci: setiap kata pertanyaan bisa diketuk */
          var teks = Array.isArray(sl.tanya) ? sl.tanya.map(function (x) { return typeof x === 'string' ? x : x.k; }).join('') : sl.tanya;
          html = teks.split(/(\s+)/).map(function (w) { return /\s/.test(w) || !w ? w : '<span class="kata-soal" role="button" tabindex="0">' + esc(w) + '</span>'; }).join('');
        }
        S.hud.kartu(STR.hud.cari, html, 'biru');
        /* langkah Kunci: kartu pertanyaan membesar ke tengah supaya setiap kata menjadi target ketuk yang cukup besar (review Fase 4) */
        S.hud.kartuEl.classList.toggle('kunci-besar', !!pilihKata);
        /* tab huruf kamus tertutup kartu besar: tidak bisa difokus atau diketuk sampai kata kunci ditemukan */
        if (api.tabEl) api.tabEl.inert = !!pilihKata;
        if (pilihKata && !UI.kurangi) { S.hud.kartuEl.classList.remove('muncul-naik'); void S.hud.kartuEl.offsetWidth; S.hud.kartuEl.classList.add('muncul-naik'); }
        if (pilihKata) Array.prototype.forEach.call(S.hud.kartuEl.querySelectorAll('.kata-soal'), function (w) {
          function ketuk(e) { if (e) e.preventDefault(); pilihKataKunci(w); }
          w.addEventListener('click', ketuk);
          w.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') ketuk(e); });
        });
      }
      function bersihKata(w) { return w.replace(/[?!,]+$/, '').replace(/\.$/, '').toLowerCase(); }
      function pilihKataKunci(w) {
        if (fase !== 'kunci' || S.sibuk || !Lv.aktif(tok)) return;
        var kata = bersihKata(w.textContent), frasa = [sl.kunci, sl.kunci2].filter(Boolean).map(function (k) { return k.toLowerCase(); });
        var kena = frasa.filter(function (f) { return f.split(/\s+/).indexOf(kata) >= 0; })[0];
        if (!kena) {
          salahKunci = true; Aud.sfx('bad'); UI.goyang(w); Save.catatMis(KATA_TANYA.test(kata) ? 'kunci-kata-tanya' : 'kunci-umum');
          Lv.kata(KATA_TANYA.test(kata) ? T.kunciTanya : T.kunciUmum, 'berpikir');
          return;
        }
        /* bingkai seluruh frasa kata kunci */
        var kataFrasa = kena.split(/\s+/);
        Array.prototype.forEach.call(S.hud.kartuEl.querySelectorAll('.kata-soal'), function (x) { if (kataFrasa.indexOf(bersihKata(x.textContent)) >= 0) x.classList.add('kunci'); });
        Aud.sfx('tik');
        var semua = frasa.every(function (f) { return f.split(/\s+/).every(function (k) { return Array.prototype.some.call(S.hud.kartuEl.querySelectorAll('.kata-soal.kunci'), function (x) { return bersihKata(x.textContent) === k; }); }); });
        var utama = sl.kunci.toLowerCase().split(/\s+/).every(function (k) { return Array.prototype.some.call(S.hud.kartuEl.querySelectorAll('.kata-soal.kunci'), function (x) { return bersihKata(x.textContent) === k; }); });
        if (utama && (semua || !sl.kunci2)) selesaiKunci();
        else if (utama) { Lv.kata(T.kunciLagi, 'semangat'); }
      }
      function tandaLangkah(id, kelas) {
        var k = langkah.querySelector('[data-langkah="' + id + '"]'); if (!k) return;
        k.classList.remove('aktif'); if (kelas) k.classList.add(kelas);
      }
      function selesaiKunci() {
        if (fase !== 'kunci') return;
        tandaLangkah('kunci', 'selesai'); Aud.sfx('good');
        S.hud.kartuEl.classList.remove('kunci-besar', 'muncul-naik');
        if (api.tabEl) api.tabEl.inert = false;
        /* kata pertanyaan kembali menjadi teks biasa (bingkai kata kunci tetap terlihat) */
        Array.prototype.forEach.call(S.hud.kartuEl.querySelectorAll('.kata-soal'), function (x) { x.removeAttribute('role'); x.removeAttribute('tabindex'); x.classList.add('mati'); });
        if (tingkat >= 3) { fase = 'bentuk'; tandaLangkah('bentuk', 'aktif'); tampilBentuk(); Lv.kata(T.pindaiBentuk, 'berpikir'); }
        else { Lv.nilai('kata-kunci', !salahKunci, { pandu: pandu }); mulaiSorot(); }
      }
      function tampilBentuk() {
        baki = U.h('div', 'baki-bentuk');
        Object.keys(STR.bentuk).filter(function (k) { return k !== 'arti' || sl.bentuk === 'arti'; }).forEach(function (k) {
          baki.appendChild(Input.button(Seni.ikon(IKON_BENTUK[k], 34) + '<span class="label-tombol">' + STR.bentuk[k] + '</span>', 'ketiga alir bentuk', function () { pilihBentuk(k); }, { id: 'bentuk-' + k }));
        });
        S.wadah.appendChild(baki);
      }
      function pilihBentuk(k) {
        if (fase !== 'bentuk' || S.sibuk || !Lv.aktif(tok)) return;
        var b = baki.querySelector('[data-id="bentuk-' + k + '"]');
        if (k !== sl.bentuk) { salahKunci = true; Aud.sfx('bad'); UI.goyang(b); Save.catatMis('bentuk-keliru'); Lv.kata(T.bentukSalah[sl.bentuk] || T.kunciTanya, 'berpikir'); return; }
        fase = 'pindah'; Aud.sfx('good'); b.classList.add('pilih');
        Lv.nilai('kata-kunci', !salahKunci, { pandu: pandu });
        var kp = langkah.querySelector('[data-langkah="bentuk"]');
        kp.querySelector('svg').outerHTML = Seni.ikon(IKON_BENTUK[k], 38); kp.querySelector('.teks-kapsul').textContent = STR.bentuk[k];
        tandaLangkah('bentuk', 'selesai');
        Lv.tunggu(tok, 350).then(function () { if (baki) baki.remove(); baki = null; mulaiSorot(); });
      }
      function mulaiSorot() {
        tSorot = performance.now(); fase = 'sorot'; tandaLangkah('sorot', 'aktif'); api.aktif = true; api.bukaBaki();
        if (!d.kamus || hurufKini === sl.huruf) api.pitaKe(0);
        Lv.kata(d.kamus && hurufKini !== sl.huruf ? U.fmt(T.kamusLompat, { h: sl.huruf }) : T.pindaiSorot, 'intai');
        /* kamus: tangan langsung menunjuk tab huruf, supaya murid tahu gunanya (playtest kreator) */
        if (d.kamus && hurufKini !== sl.huruf) { var th = api.tabEl.querySelector('[data-id="huruf-' + sl.huruf + '"]'); if (th) UI.tunjuk(th, { sumber: 'petunjuk', fy: 0.5 }); }
        else if (pandu) UI.tunjuk(api.baris[kb], { sumber: 'petunjuk', fy: 0.5 });
      }
      api.adaKunci = function (i) { return i === kb ? 1 : 0; };
      api.onBaris = function (i) {
        if (fase !== 'sorot') { api.segarBaki(-1); return; }
        api.tandaiKandidat(i, sl.bentuk);
        api.segarBaki(i);
        letakPegangan();
        api.baris.forEach(function (b) { b.classList.remove('baris-sorot'); });
        if (i === kb && kb >= 0) {
          api.bingkaiKunci(i, sl.kunci); Aud.sfx('tik');
          Lv.kata(U.fmt(T.pindaiKetemu, { bentuk: STR.bentuk[sl.bentuk].toLowerCase() }), 'intai');
          if (pandu) { var c = api.tombolBaki(i) || api.baris[i].querySelector('.nilai-ketuk.kandidat'); if (c) UI.tunjuk(c, { sumber: 'petunjuk', fy: 0.4 }); }
        } else api.bingkaiKunci(-1);
      };
      function benarkah(n) { return +n.getAttribute('data-baris') === sl.jawab && n.getAttribute('data-bentuk') === sl.bentuk && (!sl.jawabT || n.textContent === sl.jawabT) && (!d.kamus || hurufKini === sl.huruf); }
      api.onTangkap = function (n) {
        if (fase !== 'sorot' || S.sibuk || !Lv.aktif(tok)) return;
        UI.sembunyiTangan(true);
        if (tingkat >= 3 && !uji) { pastikan(n); return; }
        nilaiTangkap(n);
      };
      /* langkah Pastikan: gelembung menampilkan baris tempat jawaban berada */
      function pastikan(n) {
        if (konfirmasi) konfirmasi.remove();
        fase = 'pastikan'; tandaLangkah('sorot'); tandaLangkah('pastikan', 'aktif');   // satu kapsul aktif pada satu waktu
        var i = +n.getAttribute('data-baris'), teksBaris = api.teksBaris(i);
        konfirmasi = U.h('div', 'papan kartu-pastikan muncul-naik', '<p class="judul-baki">' + esc(STR.pastikan.judul) + '</p><p class="baris-pastikan" data-cek="baris pastikan">' + esc(teksBaris) + '</p><p class="tanya-pastikan">' + esc(U.fmt(STR.pastikan.tanya, { n: n.textContent })) + '</p>');
        var ya = Input.button(esc(STR.pastikan.ya), 'utama alir', function () { konfirmasi.remove(); konfirmasi = null; fase = 'sorot'; nilaiTangkap(n); }, { id: 'pastikan-ya' });
        var lagi = Input.button(esc(STR.pastikan.lagi), 'ketiga alir', function () {
          konfirmasi.remove(); konfirmasi = null; fase = 'sorot'; tandaLangkah('pastikan'); tandaLangkah('sorot', 'aktif'); Lv.kata(T.pastikanLagi, 'intai');
          if (!benarkah(n)) Save.catatMis('pastikan-menyelamatkan');
        }, { id: 'pastikan-lagi' });
        var baris = U.h('div', 'baris-tombol-pastikan'); baris.appendChild(lagi); baris.appendChild(ya); konfirmasi.appendChild(baris);
        S.root.appendChild(konfirmasi); konfirmasi.classList.add('lapis-atas');
        Lv.kata(T.pastikan, 'berpikir');
        UI.idle.atur(function () { return ya; });
      }
      function nilaiTangkap(n) {
        var i = +n.getAttribute('data-baris');
        if (benarkah(n)) {
          S.sibuk = true; api.tutupBaki();
          var detik = (performance.now() - t0) / 1000;
          tandaLangkah('sorot', 'selesai'); tandaLangkah('pastikan', 'selesai');
          Lv.nilai('pindai-tepat', salah === 0, { pandu: pandu, jurus: 'pindai', detik: detik });
          if ((salah || salahKunci) && !pandu && !uji && !t.ulang) Lv.ulangi(Lv.serupaPindai(t, d, sl, tingkat));
          if (uji) { Save.data.ujiKilat[t.uji === 'akhir' ? 'akhir' : 'awal'] = Math.round(detik * 10) / 10; Save.save(); }
          else if (tingkat === 4) Lv.kilat(detik, 6 + api.baris.length * 1.2);
          Lv.kata(Lv.acak(T.pindaiBenar), 'sorak');
          var akhir = iSoal >= soalList.length - 1;
          Lv.tangkap(api, n, akhir ? (t.kunang || 0) : 0).then(function () { return Lv.tunggu(tok, 800); }).then(function () {
            S.sibuk = false;
            if (akhir) { ok(); return; }
            n.classList.remove('tertangkap'); api.bukaBaki(); iSoal++; mulaiSoal();
          });
          return;
        }
        salah++; Aud.sfx('bad'); UI.goyang(n);
        if (!pandu && !uji && performance.now() - tSorot < 1200) Lv.tupiTebak();
        if (!pandu) { Save.catatSalah('pindai-tepat'); if (salah <= 3) Lv.petunjuk(salah); }
        var pk = sl.pengecoh || {}, pesanKhusus = pk[i + ':' + n.textContent] || pk[n.textContent] || pk[String(i)];
        Save.catatMis(pesanKhusus ? 'pindai-sebentuk' : 'pindai-baris-lain');
        if (pesanKhusus) Lv.tupiTergelincir();
        var label = Lv.kecil(Array.prototype.map.call(api.isiBaris(i), function (s) { return s.querySelector('.nilai-ketuk') ? '' : s.textContent; }).join(' '));
        if (salah === 1) Lv.kata(pesanKhusus || U.fmt(T.pindaiSalah, { bentuk: STR.bentuk[sl.bentuk].toLowerCase(), baris: label, kunci: Lv.kecil(sl.kunci) }), 'berpikir');
        else if (salah === 2) { Lv.kata(pesanKhusus ? pesanKhusus + ' ' + T.pindaiSalah2 : T.pindaiSalah2, 'semangat'); if (kb >= 0) { api.bingkaiKunci(kb, sl.kunci); api.baris[kb].classList.add('baris-sorot'); } }
        else {
          if (d.kamus && hurufKini !== sl.huruf) { gantiHuruf(sl.huruf); }
          api.ke = -2; api.pitaKe(sl.jawab, true);
          var jw = jawabanEl();
          Lv.kata(U.fmt(T.pindaiSalah3, { jawab: jw.textContent }), 'semangat');
          UI.tunjuk(api.tombolBaki(sl.jawab) || jw, { sumber: 'petunjuk', fy: 0.4 });
        }
      }
      function jawabanEl() {
        var b = api.baris[sl.jawab];
        return Array.prototype.filter.call(b.querySelectorAll('.nilai-ketuk'), function (x) { return x.getAttribute('data-bentuk') === sl.bentuk && (!sl.jawabT || x.textContent === sl.jawabT); })[0];
      }
      S.ukurUlang = function () { if (api.ke >= 0) { var k = api.ke; api.ke = -2; api.pitaKe(k); } };
      mulaiSoal();

      S.langkahUji = function (benar) {
        if (S.sibuk) return 'sibuk';
        if (fase === 'kunci') {
          var kata = Array.prototype.slice.call(S.hud.kartuEl.querySelectorAll('.kata-soal'));
          var frasa = [sl.kunci, sl.kunci2].filter(Boolean).join(' ').toLowerCase().split(/\s+/);
          var w = benar ? kata.filter(function (x) { return frasa.indexOf(bersihKata(x.textContent)) >= 0 && !x.classList.contains('kunci'); })[0]
            : kata.filter(function (x) { return KATA_TANYA.test(bersihKata(x.textContent)); })[0];
          if (!w) w = kata.filter(function (x) { return frasa.indexOf(bersihKata(x.textContent)) >= 0 && !x.classList.contains('kunci'); })[0];
          if (w) { w.click(); return 'kunci ' + w.textContent; }
          return null;
        }
        if (fase === 'bentuk') {
          var k = benar ? sl.bentuk : Object.keys(STR.bentuk).filter(function (x) { return x !== sl.bentuk; })[0];
          baki.querySelector('[data-id="bentuk-' + k + '"]').click(); return 'bentuk ' + k;
        }
        if (fase === 'pastikan') { konfirmasi.querySelector(benar ? '[data-id="pastikan-ya"]' : '[data-id="pastikan-ya"]').click(); return 'pastikan'; }
        if (fase !== 'sorot') return null;
        if (d.kamus && hurufKini !== sl.huruf) { var hb = benar ? sl.huruf : d.kamus.huruf.filter(function (h) { return h !== sl.huruf && h !== hurufKini; })[0] || sl.huruf; gantiHuruf(hb); return 'huruf ' + hb; }
        var tujuan = benar ? sl.jawab : (sl.jawab + 1) % api.baris.length;
        if (api.ke !== tujuan) { api.ke = -2; api.pitaKe(tujuan, true); return 'sorot ' + tujuan; }
        var n = benar ? jawabanEl() : (Array.prototype.filter.call(api.baris[tujuan].querySelectorAll('.nilai-ketuk.kandidat'), function (x) { return !benarkah(x); })[0]);
        if (!benar && !n) { api.ke = -2; api.pitaKe((tujuan + 1) % api.baris.length, true); return 'sorot lain'; }
        if (n && n.classList.contains('kandidat')) { api.onTangkap(n); return benar ? 'tangkap' : 'tangkap salah'; }
        return null;
      };
      UI.idle.atur(function () {
        if (fase === 'kunci') return S.hud.kartuEl;
        if (fase === 'bentuk') return baki && baki.querySelector('.tombol');
        if (d.kamus && hurufKini !== sl.huruf) return api.tabEl.querySelector('.tombol');
        return fase === 'sorot' ? api.pita : null;
      });
    });
  };
})();
