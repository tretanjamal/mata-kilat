/* Mesin level umum (Fase 2): satu adegan untuk L1-L5. Isi level ada di config/levelN.js (window.LEVELS[N]) berupa daftar tugas:
   hook, cerita, sekilas, pindai, kebiasaan, teratai (Halaman Teratai), frasa (Kilatan Frasa), pilihJurus, bacaTeliti, festival.
   Tugas Sekilas dan Pindai ada di tugas-baca.js, tugas lain di tugas-lain.js. Semua tugas memakai Lv (keadaan dan bantuan bersama).
   Alur memakai janji berantai yang dijaga token: layar yang sudah ditinggalkan tidak melanjutkan alurnya.
   Bintang: 1 bila selesai; 2 bila >= 70% benar pada coba pertama; 3 bila >= 90% dan (Lompatan Jitu >= 80% atau Bintang Kilat
   atau Mode Santai). Langkah yang dipandu tangan tidak dihitung (brief bagian 2 dan 6). */
(function (root) {
  var T = STR.tasi, S = null;
  var Lv = {
    get S() { return S; },
    esc: function (x) { return UI.esc(x); },
    acak: function (a) { return a[Math.floor(Math.random() * a.length)]; },
    /* nama baris untuk umpan balik: huruf kecil di awal bila bukan nama diri (lebih dari satu kata berhuruf kapital) */
    kecil: function (t) { t = String(t).trim(); return (t.match(/\b[A-Z]/g) || []).length > 1 ? t : t.charAt(0).toLowerCase() + t.slice(1); },
    aktif: function (tok) { return !!S && S.tok === tok && Scenes.name === 'level' + S.id; },
    rumah: function () { return Stage.hp ? { x: 64, y: 606, s: 0.5 } : { x: 150, y: 606, s: 0.86 }; },
    kata: function (t, ek) { if (ek && S.tasi.ekspresi !== ek) S.tasi.atur(ek); return S.balon.kata(t); },
    /* tunggu sampai antrean suara kosong, dicek tiap 250 ms paling banyak n kali */
    tungguSuara: function (tok, n) { return Lv.tunggu(tok, 250).then(function () { if (n > 0 && Voice.sibuk()) return Lv.tungguSuara(tok, n - 1); }); },
    tunggu: function (tok, ms) { return Tween.wait(ms).then(function () { if (!Lv.aktif(tok)) return new Promise(function () { }); }); },
    /* tingkat penopang tugas: tetap bila t.tingkat, atau tingkat adaptif jurus dalam rentang t.min..t.max */
    tingkat: function (jurus, t) {
      if (t.tingkat) return t.tingkat;
      var x = U.clamp(S.adaptif[jurus].t, t.min || 1, t.max || 4);
      return Save.data.settings.santai ? Math.min(x, 3) : x;
    },
    /* satu soal dinilai: dicatat ke keterampilan, bintang, dan adaptif (kecuali yang dipandu).
       Saat Ulang Kilat, hasilnya dicatat terpisah (ulang/ulangBenar) dan tidak mengubah bintang. o.detik = waktu sampai tepat. */
    nilai: function (tag, tepat, o) {
      o = o || {};
      if (o.pandu) return;
      if (o.jurus) S.adaptif[o.jurus].catat(tepat);
      if (S.dalamUlang) { Save.catatUlang(tag, tepat); if (tag !== 'kata-kunci') { S.stat.ulang++; if (tepat) S.stat.ulangBenar++; } return; }   // satu soal = satu hitungan (langkah Kunci tidak dihitung dua kali)
      Save.catat(tag, tepat); S.stat.nilai++; if (tepat) S.stat.benarAwal++;
      if (o.detik && (o.jurus === 'sekilas' || o.jurus === 'pindai')) Save.catatWaktu(o.jurus, o.detik);
    },
    /* petunjuk tingkat 1-3 (brief 13b): dihitung sekali per soal untuk tiap tingkat */
    petunjuk: function (tingkat) { var i = Math.max(1, Math.min(3, tingkat)) - 1; S.stat.petunjuk[i]++; },
    /* Lompatan Jitu satu teks sekilas: keterampilan jalur-sekilas (brief bagian 2), tidak dihitung ke bintang */
    catatJalur: function (lompat, jitu) { if (lompat > 0 && !S.dalamUlang) Save.catat('jalur-sekilas', jitu / lompat >= 0.8); },
    /* Ulang Kilat (brief bagian 6): soal yang keliru dicatat, lalu soal serupa muncul di akhir level (maksimal 3) */
    ulangi: function (item) {
      if (!S || S.dalamUlang || !item || S.ulang.length >= 3) return;
      item.kunang = 0; item.ulang = true;
      S.ulang.push(item);
    },
    dipakai: function (k) { if (!S) return false; var ada = !!S.dipakai[k]; S.dipakai[k] = true; return ada; },
    /* teks sekilas serupa: teks lain dari bank dengan jenis soal yang sama; tanpa itu, soal yang sama dengan urutan pilihan diacak */
    serupaSekilas: function (t, teks, sl) {
      var jenis = Lv.jenisSoal(sl), bank = (window.BANK_SEKILAS || []).filter(function (x) {
        return x.id !== teks.id && !S.dipakai['teks:' + x.id] && !!x.panjang === !!teks.panjang && x.soal.some(function (s) { return Lv.jenisSoal(s) === jenis; });
      });
      var tingkat = t.pandu ? 1 : Lv.tingkat('sekilas', t);
      if (bank.length) {
        var x = Lv.acak(bank), s = x.soal.filter(function (y) { return Lv.jenisSoal(y) === jenis; })[0];
        Lv.dipakai('teks:' + x.id);
        return { jenis: 'sekilas', teks: U.gabung(x, { soal: [s] }), tingkat: tingkat };
      }
      return { jenis: 'sekilas', teks: U.gabung(teks, { soal: [U.gabung(sl, { pilihan: U.shuffle(Math.random, sl.pilihan) })] }), tingkat: tingkat };
    },
    jenisSoal: function (sl) { return sl.paragraf != null ? 'paragraf' : (/judul/i.test(sl.tanya) ? 'judul' : 'isi'); },
    /* tugas dari bank isi dipilih acak saat level dimulai, supaya permainan ulang bervariasi:
       teratai = halaman dari buku tugas (tiap buku minimal 1, jebakan minimal 2); frasa = frasa acak, yang pendek dulu */
    siapkan: function (t) {
      var r = Math.random;
      if (t.jenis === 'teratai' && t.bank) {
        /* permainan ulang: 4 buku acak dari 6 (buku kelima dan keenam brief bagian 7) */
        if (t.acakBuku && Save.selesai(S.id)) t = U.gabung(t, { buku: U.ambil(r, window.BUKU_TERATAI, t.buku.length) });
        var buku = t.buku.map(function (nama) { return window.BUKU_TERATAI.indexOf(nama); });
        var cocok = t.bank.filter(function (h) { return buku.indexOf(h.buku) >= 0; }).map(function (h) { return U.gabung(h, { buku: buku.indexOf(h.buku) }); });
        /* jebakan hanya bila buku yang dikecohkan ada di rak */
        var jebak = U.ambil(r, cocok.filter(function (h) { return h.jebakan && buku.indexOf(h.kecoh) >= 0; }), t.jebakan || 2), biasa = cocok.filter(function (h) { return !h.jebakan; }), pilih = jebak.slice();
        buku.forEach(function (b, i) { var x = U.ambil(r, biasa.filter(function (h) { return h.buku === i && pilih.indexOf(h) < 0; }), 1)[0]; if (x) pilih.push(x); });
        pilih = pilih.concat(U.ambil(r, biasa.filter(function (h) { return pilih.indexOf(h) < 0; }), Math.max(0, (t.jumlah || 8) - pilih.length)));
        pilih = U.shuffle(r, pilih);
        if (pilih[0].jebakan) pilih.push(pilih.shift());   // halaman pertama bukan jebakan
        pilih.forEach(function (h) { S.dipakai['hal:' + h.t] = true; });
        return U.gabung(t, { halaman: pilih });
      }
      if (t.jenis === 'frasa' && t.bank) {
        var f = U.ambil(r, t.bank, t.jumlah || 8).sort(function (a, b) { return a[0].length - b[0].length; });
        return U.gabung(t, { daftar: f });
      }
      if (t.teks) S.dipakai['teks:' + t.teks.id] = true;
      if (t.item) S.dipakai['jurus:' + t.item.t] = true;
      return t;
    },
    /* halaman teratai serupa: halaman lain dari buku yang sama (jebakan bila yang keliru jebakan) */
    serupaTeratai: function (t, h) {
      var nama = t.buku[h.buku], b = window.BUKU_TERATAI ? window.BUKU_TERATAI.indexOf(nama) : -1;
      var calon = (t.bank || []).filter(function (x) { return x.buku === b && !S.dipakai['hal:' + x.t] && !!x.jebakan === !!h.jebakan; });
      if (!calon.length) calon = (t.bank || []).filter(function (x) { return x.buku === b && !S.dipakai['hal:' + x.t]; });
      var x = calon.length ? Lv.acak(calon) : null;
      if (x) S.dipakai['hal:' + x.t] = true;
      return { jenis: 'teratai', buku: t.buku, halaman: [x ? U.gabung(x, { buku: h.buku }) : h] };
    },
    /* permintaan Pilih Jurus serupa: tujuan lain dari bank jurus dengan jawaban yang sama */
    serupaJurus: function (it) {
      var calon = (window.JURUS || []).filter(function (x) { return x.jurus === it.jurus && !S.dipakai['jurus:' + x.t]; });
      var x = calon.length ? Lv.acak(calon) : it;
      S.dipakai['jurus:' + x.t] = true;
      return { jenis: 'pilihJurus', item: x };
    },
    /* teks pindai serupa: dibuat pembangkit dengan bentuk jawaban yang sama; tanpa templat, soal yang sama */
    serupaPindai: function (t, d, sl, tingkat) {
      var templat = { waktu: 'jadwal', harga: 'harga', nama: 'penjaga', angka: 'daftarIsi', tanggal: 'pengumuman', tempat: 'denah' }[sl.bentuk];
      if (templat && window.Pembangkit && Pembangkit.TEMPLAT.indexOf(templat) >= 0) {
        var dok = Pembangkit.buat(templat, 1 + Math.floor(Math.random() * 99999), Math.min(3, tingkat));
        return { jenis: 'pindai', dok: dok, tingkat: tingkat };
      }
      return { jenis: 'pindai', dok: U.gabung(d, { soal: [sl] }), tingkat: tingkat };
    },
    /* Bintang Kilat: dicatat bila tugas tingkat 4 selesai dalam batas waktu (tidak di Mode Santai) */
    kilat: function (detik, batas) {
      if (Save.data.settings.santai || !batas) return false;
      S.stat.kilatTotal++;
      if (detik <= batas) { S.stat.kilat++; UI.toast(STR.bintangKilat); Aud.sfx('sring'); return true; }
      return false;
    },
    bersih: function () {
      Aud.setBaca(false);
      S.root.classList.remove('mode-pindai');
      Array.prototype.forEach.call(S.root.querySelectorAll('.kartu-tanya, .lapis-atas'), function (x) { x.remove(); });
      S.wadah.innerHTML = ''; S.daun.klip = null; S.daun.hapusSemua();
      S.api = null; S.ukurUlang = null; S.langkahUji = null; S.sibuk = false; S.rasi = null;
      UI.sembunyiTangan(true); UI.idle.fn = null;
    },
    /* kunang terbang ke toples lalu angka menghitung naik */
    kunangKe: function (t, n) {
      var tj = S.hud.titikToples(), dari = S.basis + S.stat.kunang;
      Aud.sfx('ting');
      S.stat.kunang += n || 0;
      return S.daun.terbangKunang(t.x, t.y, tj.x, tj.y).then(function () { return S.hud.tambahKunang(dari, S.basis + S.stat.kunang); });
    },
    /* Tasi menerkam nilai jawaban: nilai lenyap, kunang terbang ke toples */
    tangkap: function (api, n, jumlah) {
      var t = api.titikNilai(n), terbang = null;
      return S.tasi.sambar(t.x, t.y, function () {
        n.classList.add('tertangkap'); Aud.sfx('tap'); Aud.sfx('good'); UI.ledak(t.x, t.y, 10);
        terbang = Lv.kunangKe(t, jumlah);
      }, { akhir: 'sorak' }).then(function () { return terbang; });
    },
    /* Baki Tangkap: nilai sebentuk di baris yang disorot tampil sebagai tombol besar (target 44 px nyata di HP) */
    pasangBaki: function (api, bentuk) {
      var el = U.h('div', 'baki-tangkap');
      S.wadah.appendChild(el);
      S.root.classList.add('mode-pindai');
      api.segarBaki = function (i) {
        var nilai = Array.prototype.filter.call(api.baris[i] ? api.baris[i].querySelectorAll('.nilai-ketuk') : [], function (n) {
          return (!bentuk || n.getAttribute('data-bentuk') === bentuk) && !n.classList.contains('tertangkap');
        });
        el.innerHTML = '<p class="judul-baki">' + Lv.esc(STR.baki.judul) + '</p>';
        if (!nilai.length) { el.appendChild(U.h('p', 'kosong-baki', Lv.esc(STR.baki.kosong))); return; }
        nilai.forEach(function (n, k) {
          /* jawaban panjang (arti kata di kamus) dibungkus dengan huruf lebih kecil supaya muat di tombol (playtest kreator) */
          el.appendChild(Input.button(Lv.esc(n.textContent), 'kedua alir' + (n.textContent.length > 10 ? ' panjang' : ''), function () { if (api.onTangkap) api.onTangkap(n); }, { id: 'tangkap-' + n.getAttribute('data-baris') + (k ? '-' + k : ''), aria: 'Tangkap ' + n.textContent }));
        });
      };
      api.tombolBaki = function (i) { return el.querySelector('[data-id="tangkap-' + i + '"]'); };
      api.tutupBaki = function () { el.classList.add('sembunyi'); };
      api.bukaBaki = function () { el.classList.remove('sembunyi'); };
      api.bakiEl = el;
      return el;
    },
    /* tombol Lanjut di kanan bawah (cerita, baca teliti) */
    tombolLanjut: function (fn, teks) {
      var b = Input.button('<span class="label-tombol">' + Lv.esc(teks || STR.tombol.lanjut) + '</span>', 'utama tombol-jawab', fn, { id: 'lanjut' });
      S.wadah.appendChild(b);
      return b;
    }
  };

  /* Ulang Kilat: kartu pembuka, lalu soal serupa satu per satu (tanpa kunang, tidak mengubah bintang) */
  function ulangKilat(tok) {
    var U2 = STR.ulang, daftar = S.ulang.slice();
    return new Promise(function (ok) {
      Lv.bersih(); S.tugas = 'ulang';
      S.hud.kartu('', '');
      var kartu = U.h('div', 'papan kartu-cerita kartu-ulang muncul-naik', '<p class="judul-ulang">' + Seni.ikon('ulangi', 40) + '<span>' + Lv.esc(U2.judul) + '</span></p><p class="teks-cerita" data-cek="teks ulang">' + Lv.esc(U.fmt(U2.ajak, { n: daftar.length })) + '</p>');
      S.wadah.appendChild(kartu);
      Lv.kata(T.ulang, 'semangat'); Aud.sfx('sring');
      var b = Lv.tombolLanjut(function () { if (S.sibuk || !Lv.aktif(tok)) return; S.sibuk = true; ok(); }, STR.tombol.mulai2);
      S.langkahUji = function () { b.click(); return 'ulang mulai'; };
      UI.idle.atur(function () { return b; });
    }).then(function () {
      S.sibuk = false; S.dalamUlang = true;
      return daftar.reduce(function (urut, t) { return urut.then(function () { if (Lv.aktif(tok)) return window.Tugas[t.jenis](tok, t); }); }, Promise.resolve());
    }).then(function () {
      S.dalamUlang = false;
      if (!Lv.aktif(tok)) return;
      Lv.bersih(); S.tugas = 'ulang'; S.sibuk = true;
      Lv.kata(T.ulangSelesai, 'sorak');
      return Lv.tunggu(tok, 1400).then(function () { S.sibuk = false; });
    });
  }

  function selesai(tok) {
    /* sesudah Festival, lapangan beserta Ulin, Tupi, dan lentera tetap tampil saat kalimat penutup */
    if (S.tugas === 'festival') { UI.sembunyiTangan(true); UI.idle.fn = null; S.langkahUji = null; Aud.setBaca(false); }
    else Lv.bersih();
    S.tugas = 'selesai'; S.sibuk = true;
    S.hud.kartu('', '');
    var cfg = S.cfg, st = S.stat;
    Lv.kata(cfg.selesai || T.selesai, 'sorak');
    var rasio = st.nilai ? st.benarAwal / st.nilai : 1;
    var jitu = st.lompat ? st.jitu / st.lompat >= 0.8 : false, kilat = st.kilatTotal ? st.kilat / st.kilatTotal >= 0.5 : false;
    var bintang = 1 + (rasio >= 0.7 ? 1 : 0) + (rasio >= 0.9 && (jitu || kilat || Save.data.settings.santai || (!st.lompat && !st.kilatTotal)) ? 1 : 0);
    Save.data.tingkat.sekilas = Math.max(1, S.adaptif.sekilas.t);
    Save.data.tingkat.pindai = Math.max(1, S.adaptif.pindai.t);
    var baru = (cfg.kartuJurus || []).filter(function (k) { return Save.dapatKartu(k); });
    var kuota = Save.KUOTA[S.id] || 0;
    var tamatBaru = S.id === '5' && !Save.data.tamat;
    if (S.id === '5') Save.data.tamat = true;
    Save.catatLevel(S.id, { selesai: true, bintang: bintang, petunjuk: st.petunjuk, ulang: st.ulang, ulangBenar: st.ulangBenar, kunang: Math.min(st.kunang, kuota), detik: Math.round((performance.now() - S.t0) / 1000), santai: Save.data.settings.santai });
    Aud.sfx('lonceng');
    /* tunggu ucapan Tasi selesai (maks. 5 detik) sebelum pindah ke Hasil: dulu kalimatnya terpotong (playtest kreator) */
    return Tween.wait(1500).then(function () { return Lv.tungguSuara(tok, 20); }).then(function () { if (Lv.aktif(tok)) Scenes.go('hasil', { level: +S.id, bintang: bintang, kunang: Math.min(st.kunang, kuota), kartu: baru, tamat: tamatBaru, ulang: st.ulang, ulangBenar: st.ulangBenar }); });
  }

  function buatAdegan(id) {
    return {
      enter: function (root, p) {
        var cfg = window.LEVELS[id], tok = {};
        S = { tok: tok, id: String(id), cfg: cfg, p: p, stat: { nilai: 0, benarAwal: 0, petunjuk: [0, 0, 0], ulang: 0, ulangBenar: 0, kunang: 0, lompat: 0, jitu: 0, kilat: 0, kilatTotal: 0 }, t0: performance.now(),
          ulang: [], dipakai: {}, dalamUlang: false,
          adaptif: { sekilas: new Adaptif(1, 4, Save.data.tingkat.sekilas), pindai: new Adaptif(1, 4, Save.data.tingkat.pindai) } };
        S.basis = Save.kunangLain(S.id); S.root = root;
        Aud.musik(cfg.musik || 'jelajah');
        Adegan.latar(root, cfg.latar);
        root.appendChild(U.h('div', 'redup'));
        Adegan.lapisSvg(root, Adegan.kunangAmbien(6 + id * 2, 20, 120, 260, 420, 5 + id));
        S.wadah = U.h('div', 'lapis wadah-tugas'); root.appendChild(S.wadah);
        S.hud = UI.hud(root, { nama: STR.peta.level[id - 1], jeda: { ulangi: function () { Scenes.go('level' + id, { ulang: true }); } } });
        S.hud.kunang(S.basis);
        S.daun = new Daun.Lapisan(root);
        var r = Lv.rumah();
        S.tasi = new Tokoh(root, 'tasi', { x: r.x, y: r.y, s: r.s, ekspresi: 'senang' });
        S.balon = Adegan.balon(root);
        root.appendChild(Input.button(Seni.ikon('bantuan', 42) + '<span class="label-tombol">' + STR.tombol.bantuan + '</span>', 'ketiga tombol-bantuan', function () {
          var m = { sekilas: T.sekilasPengantar, pindai: T.pindaiPengantar, uji: T.pindaiPengantar, kebiasaan: T.kebiasaan, pilihJurus: T.pilihMantra, frasa: T.frasa, teratai: T.teratai,
            cerita: T.bantuanLanjut, ulang: T.bantuanUlang, bacaTeliti: T.teliti, festival: T.festival1, selesai: T.bantuanFestival }[S.tugas] || T.sekilasBebas;
          Lv.kata(m, 'semangat');
          var el = UI.idle.fn && UI.idle.fn(); if (el) UI.tunjuk(el, { sumber: 'petunjuk', fy: 0.5 });
        }, { id: 'bantuan', aria: STR.ikon.bantuan }));
        UI.onHuruf = function () { if (S && S.ukurUlang) setTimeout(S.ukurUlang, 30); };
        this.tata();
        var daftar = cfg.tugas.filter(function (t) { return t.jenis !== 'hook' || !Save.data.hook || p.hook; });
        /* Festival (akhir L5) tetap menjadi klimaks: Ulang Kilat dijalankan sebelumnya (review Fase 4) */
        var akhir = daftar.length && daftar[daftar.length - 1].jenis === 'festival' ? daftar.pop() : null;
        function jalankan(t) { return function () { if (Lv.aktif(tok)) return window.Tugas[t.jenis](tok, Lv.siapkan(t)); }; }
        daftar.reduce(function (urut, t) { return urut.then(jalankan(t)); }, Promise.resolve())
          .then(function () { if (Lv.aktif(tok) && S.ulang.length) return ulangKilat(tok); })
          .then(akhir ? jalankan(akhir) : null)
          .then(function () { if (Lv.aktif(tok)) return selesai(tok); });
      },
      tata: function () {
        if (!S || !S.tasi || S.id !== String(id)) return;
        var r = Lv.rumah();
        S.tasi.s = r.s; S.tasi.x = r.x; S.tasi.y = r.y; S.tasi.atur();
        S.daun.ukur();
        if (S.ukurUlang) S.ukurUlang();
      },
      exit: function () { if (S) S.tok = null; UI.idle.fn = null; UI.onHuruf = null; Aud.setBaca(false); },
      uji: {
        keadaan: function () { return { tugas: S && S.tugas, siap: !!S && !S.sibuk && !!S.langkahUji }; },
        aksi: function (benar) { return S && S.langkahUji ? S.langkahUji(benar !== false) : null; }
      }
    };
  }
  root.Lv = Lv;
  root.Tugas = root.Tugas || {};
  for (var i = 1; i <= 6; i++) Scenes.add('level' + i, buatAdegan(i));
})(window);
