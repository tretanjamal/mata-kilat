/* Bacaan: teks DOM untuk kedua jurus (brief bagian 12: teks bacaan DOM supaya tajam; daun di kanvas Daun.Lapisan).
   - Bacaan.lembar: teks Sekilas. Setiap kalimat satu segmen (GDD 3.1); judul, kalimat 'awal', dan kalimat berkata **tebal**
     adalah jalur sekilas. Segmen tertutup disembunyikan dan ditimpa daun; ketuk (atau Tab lalu Enter) untuk membuka.
   - Bacaan.daftar: teks Pindai berupa daftar atau poster. Pita sorot diseret, baris diketuk, atau panah atas-bawah;
     nilai yang sebentuk dengan bentuk jawaban menjadi kandidat yang bisa ditangkap.
   Kotak baris diukur sesudah huruf termuat dan diukur ulang saat skala berubah (risiko R8). */
(function (root) {
  function esc(s) { return UI.esc(s); }
  function tebal(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  /* kotak layar -> kotak panggung logis (juga saat panggung diputar di HP tegak) */
  function keLogis(r) {
    var a = Stage.toLocal(r.left, r.top), b = Stage.toLocal(r.right, r.bottom);
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
  }
  function kotakBaris(el) {
    return Array.prototype.map.call(el.getClientRects(), keLogis).filter(function (k) { return k.w > 2 && k.h > 2; });
  }

  /* ===== Sekilas ===== */
  function lembar(parent, teks, o) {
    o = o || {};
    var el = U.h('div', 'lembar teks-baca' + (teks.panjang ? ' panjang' : '') + (teks.gambar ? ' bergambar' : '')), seg = [], api = { el: el, seg: seg };
    el.setAttribute('data-cek', 'lembar bacaan');
    if (teks.panjang) el.setAttribute('data-gulir', '');
    function figur(i, bi) {
      h += '<figure class="gambar-bacaan">' + Ilustrasi.svg(teks.gambar.ilus) + '<figcaption><span class="seg" data-seg="g">' + tebal(teks.gambar.ket) + '</span></figcaption></figure>';
      seg.push({ id: 'g', jalur: true, peran: 'gambar', paragraf: i, bagian: bi });
    }
    var h = '<h2 class="judul-bacaan"><span class="seg" data-seg="judul">' + esc(teks.judul) + '</span></h2>', np = 0;
    seg.push({ id: 'judul', jalur: true, peran: 'judul' });
    /* teks.bagian: subjudul atau beberapa artikel pendek; tanpa bagian, paragraf langsung di bawah judul */
    (teks.bagian || [{ paragraf: teks.paragraf }]).forEach(function (b, bi) {
      if (b.judul) {
        h += '<h3 class="subjudul-bacaan"><span class="seg" data-seg="b' + bi + '">' + esc(b.judul) + '</span></h3>';
        seg.push({ id: 'b' + bi, jalur: true, peran: 'subjudul', bagian: bi });
      }
      b.paragraf.forEach(function (p) {
        var i = np++;
        /* gambar dan keterangannya (mantra "Gambar"): gambar selalu tampak, keterangan adalah jalur sekilas yang tertutup daun */
        if (teks.gambar && i === (teks.gambar.di || 0)) figur(i, bi);
        h += '<p class="paragraf" data-paragraf="' + i + '">';
        p.forEach(function (k, j) {
          var id = 'p' + i + 's' + j, jalur = k.p === 'awal' || k.p === 'utama' || /\*\*/.test(k.t);
          seg.push({ id: id, jalur: jalur, peran: k.p || (j === p.length - 1 ? 'akhir' : 'tengah'), paragraf: i, bagian: bi });
          h += '<span class="seg" data-seg="' + id + '">' + tebal(k.t) + '</span>' + (j < p.length - 1 ? ' ' : '');
        });
        h += '</p>';
      });
    });
    /* teks dua kolom: gambar di akhir teks (di: 'akhir'), di ruang kosong kolom kedua */
    if (teks.gambar && teks.gambar.di === 'akhir') figur(np - 1, 0);
    el.innerHTML = h;
    parent.appendChild(el);
    seg.forEach(function (s, n) {
      s.el = el.querySelector('[data-seg="' + s.id + '"]');
      s.buka = false;
      s.el.setAttribute('role', 'button');
      s.el.setAttribute('tabindex', '0');
      s.el.setAttribute('aria-label', n === 0 ? 'Daun judul' : (s.peran === 'subjudul' ? 'Daun subjudul' : (s.peran === 'gambar' ? 'Daun keterangan gambar' : 'Daun kalimat ' + n)));
      s.el.classList.add('tutup');
      function ketuk(e) { if (e) e.preventDefault(); if (api.onKetuk && !s.buka) { Aud.init(); api.onKetuk(s); } }
      s.el.addEventListener('click', ketuk);
      s.el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') ketuk(e); });
    });
    api.paragrafEl = function (i) { return el.querySelector('[data-paragraf="' + i + '"]'); };
    api.cari = function (id) { for (var i = 0; i < seg.length; i++) if (seg[i].id === id) return seg[i]; return null; };
    api.kotak = function (s) { return kotakBaris(s.el); };
    /* titik pendaratan Tasi: di atas awal baris pertama segmen */
    api.titik = function (s) { var k = api.kotak(s)[0]; return k ? { x: k.x + 18, y: k.y + 4 } : null; };
    api.titikRasi = function (s) { var k = api.kotak(s)[0]; return k ? { x: k.x - 14, y: k.y + k.h / 2 } : null; };
    /* pasang daun untuk semua segmen yang masih tertutup */
    api.pasangDaun = function (lapis, kilau) {
      seg.forEach(function (s, n) { if (!s.buka) lapis.pasang(s.id, api.kotak(s), 7 + n * 13, kilau && s.jalur); });
      lapis.gambar();
    };
    api.buka = function (s, lapis) {
      s.buka = true; s.el.classList.remove('tutup'); s.el.removeAttribute('tabindex'); s.el.removeAttribute('role'); s.el.removeAttribute('aria-label');
      s.el.style.cursor = 'default';
      if (lapis) lapis.buka(s.id);
    };
    api.bukaSemua = function (lapis) { seg.forEach(function (s) { if (!s.buka) api.buka(s, lapis); }); };
    return api;
  }

  /* ===== Pindai ===== */
  function daftar(parent, dok, o) {
    o = o || {};
    var papan = U.h('div', 'papan-dok' + (dok.poster ? ' poster' : '') + (dok.kelas ? ' ' + dok.kelas : '')), api = { el: papan, baris: [], nilai: [], ke: -1 };
    var kertas = U.h('div', 'kertas-dok');
    kertas.setAttribute('tabindex', '0');
    kertas.setAttribute('aria-label', dok.judul);
    kertas.setAttribute('data-cek', 'kertas pindai');
    papan.appendChild(kertas);
    var h = '<span class="paku" style="left:6px"></span><span class="paku" style="right:6px"></span><div class="pita-sorot sembunyi"></div>';
    h += '<div class="judul-dok"' + (dok.poster ? ' data-seg="judul"' : '') + '><span class="teks-judul">' + esc(dok.judul) + '</span></div>';
    if (dok.anak) h += '<div class="anak-dok">' + esc(dok.anak) + '</div>';
    if (dok.tab) h += '<div class="tab-huruf" role="group" aria-label="Huruf"></div>';
    h += '<div class="daftar-pindai"></div>';
    if (dok.catatan) h += '<p class="catatan-dok">' + esc(dok.catatan) + '</p>';
    kertas.innerHTML = h;
    parent.appendChild(papan);
    api.kertas = kertas;
    api.pita = kertas.querySelector('.pita-sorot');
    function htmlBaris(daftarBaris) {
      var x = '';
      if (dok.kolom) x += '<div class="baris-pindai kepala">' + dok.kolom.map(function (k) { return '<div class="sel" data-cek="kolom ' + esc(k) + '"><span class="isi-sel">' + esc(k) + '</span></div>'; }).join('') + '</div>';
      daftarBaris.forEach(function (b, i) {
        x += '<div class="baris-pindai" data-baris="' + i + '">';
        (dok.poster ? [b] : b).forEach(function (sel) {
          x += '<div class="sel" data-cek="sel baris ' + i + '"><span class="isi-sel">';
          (Array.isArray(sel) ? sel : [sel]).forEach(function (v) {
            if (typeof v === 'string') x += esc(v);
            else x += '<span class="nilai-ketuk" data-bentuk="' + v.b + '" data-baris="' + i + '">' + esc(v.t) + '</span>';
          });
          x += '</span></div>';
        });
        x += '</div>';
      });
      return x;
    }
    /* ganti isi daftar (mis. halaman huruf lain di kamus); pita kembali tersembunyi */
    api.gantiBaris = function (daftarBaris) {
      kertas.querySelector('.daftar-pindai').innerHTML = htmlBaris(daftarBaris);
      api.baris = Array.prototype.slice.call(kertas.querySelectorAll('.baris-pindai[data-baris]'));
      api.nilai = Array.prototype.slice.call(kertas.querySelectorAll('.nilai-ketuk'));
      api.nilai.forEach(function (n) {
        n.addEventListener('click', function (e) {
          if (!api.aktif || !n.classList.contains('kandidat')) return;
          e.stopPropagation(); Aud.init();
          if (api.onTangkap) api.onTangkap(n);
        });
      });
      api.ke = -1; api.pita.classList.add('sembunyi');
    };
    api.tabEl = kertas.querySelector('.tab-huruf');
    api.judulEl = kertas.querySelector('.teks-judul');
    api.gantiBaris(dok.baris);
    api.isiBaris = function (i) { return api.baris[i].querySelectorAll('.isi-sel'); };
    /* isi baris sebagai kalimat untuk kartu Pastikan: "Tali: 3", atau dengan nama kolom bila lebih dari dua kolom: "Air Terjun Embun: Berangkat 17.00, Tiba 17.40" (bukan pemisah mentah "|") */
    api.teksBaris = function (i) {
      var isi = Array.prototype.map.call(api.isiBaris(i), function (s) { return s.textContent.trim(); });
      if (isi.length < 2) return isi.join('');
      var sisa = isi.slice(1).map(function (v, j) { return isi.length > 2 && dok.kolom && dok.kolom[j + 1] ? dok.kolom[j + 1] + ' ' + v : v; });
      return isi[0] + ': ' + sisa.join(', ');
    };

    /* posisi baris dalam kertas (px logis, relatif kertas) */
    function posBaris(i) {
      var k = keLogis(kertas.getBoundingClientRect()), b = keLogis(api.baris[i].getBoundingClientRect());
      return { y: b.y - k.y, h: b.h };
    }
    api.pitaKe = function (i, anim) {
      i = U.clamp(i, 0, api.baris.length - 1);
      var p = posBaris(i), pita = api.pita, dari = parseFloat(pita.style.top) || p.y;
      pita.classList.remove('sembunyi');
      pita.style.height = (p.h + 10) + 'px';
      var ganti = i !== api.ke;
      api.ke = i;
      if (anim && !UI.kurangi) Tween.run(160, function (e) { pita.style.top = (dari + (p.y - 5 - dari) * e) + 'px'; }, Ease.easeOutCubic);
      else pita.style.top = (p.y - 5) + 'px';
      if (ganti && api.onBaris) api.onBaris(i);
      return i;
    };
    /* baris terdekat dari titik y (koordinat panggung) */
    function barisDi(yPanggung) {
      var terbaik = 0, jarak = 1e9;
      api.baris.forEach(function (b, i) { var r = keLogis(b.getBoundingClientRect()), d = Math.abs(r.y + r.h / 2 - yPanggung); if (d < jarak) { jarak = d; terbaik = i; } });
      return terbaik;
    }
    /* seret pita atau ketuk baris */
    var seret = null;
    kertas.addEventListener('pointerdown', function (e) {
      if (!api.aktif) return;
      if (e.target.closest('.nilai-ketuk.kandidat')) return;   // menangkap jawaban, bukan menyeret
      if (e.target.closest('button, .tab-huruf')) return;   // tab huruf kamus: tanpa ini pointer capture mencuri kliknya (playtest kreator)
      var p = Stage.toLocal(e.clientX, e.clientY);
      seret = { y0: p.y, gerak: false, id: e.pointerId };
      try { kertas.setPointerCapture(e.pointerId); } catch (x) { }
    });
    kertas.addEventListener('pointermove', function (e) {
      if (!seret || !api.aktif) return;
      var p = Stage.toLocal(e.clientX, e.clientY);
      if (Math.abs(p.y - seret.y0) > 8) seret.gerak = true;
      if (!seret.gerak) return;
      var kb = keLogis(kertas.getBoundingClientRect()), i = barisDi(p.y), pos = posBaris(i), tinggi = pos.h + 10;
      api.pita.classList.remove('sembunyi');
      api.pita.style.height = tinggi + 'px';
      api.pita.style.top = U.clamp(p.y - kb.y - tinggi / 2, 0, kb.h - tinggi) + 'px';
      if (i !== api.ke) { api.ke = i; Aud.sfx('dengung', api.adaKunci ? api.adaKunci(i) : 0); if (api.onBaris) api.onBaris(i); }
    });
    function lepas(e) {
      if (!seret) return;
      var s = seret; seret = null;
      if (!api.aktif) return;
      var p = Stage.toLocal(e.clientX, e.clientY), i = barisDi(p.y);
      if (!s.gerak) Aud.sfx('dengung', api.adaKunci ? api.adaKunci(i) : 0);
      api.ke = -2;   // paksa onBaris
      api.pitaKe(i, true);
    }
    kertas.addEventListener('pointerup', lepas);
    kertas.addEventListener('pointercancel', lepas);
    kertas.addEventListener('keydown', function (e) {
      if (!api.aktif) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var i = api.ke < 0 ? 0 : api.ke + (e.key === 'ArrowDown' ? 1 : -1);
        api.pitaKe(i, true); Aud.sfx('dengung', 0);
        e.preventDefault(); e.stopPropagation();
      } else if (e.key === 'Enter' || e.key === ' ') {
        var k = api.baris[api.ke] && api.baris[api.ke].querySelector('.nilai-ketuk.kandidat');
        if (k && api.onTangkap) api.onTangkap(k);
        e.preventDefault(); e.stopPropagation();
      }
    });
    /* tandai kandidat (nilai sebentuk) di baris i */
    api.tandaiKandidat = function (i, bentuk) {
      api.nilai.forEach(function (n) {
        var on = +n.getAttribute('data-baris') === i && (!bentuk || n.getAttribute('data-bentuk') === bentuk);
        n.classList.toggle('kandidat', on);
        n.classList.toggle('tanpa-kilau', on && api.tanpaKilau === true);
        if (on) { n.setAttribute('role', 'button'); n.setAttribute('aria-label', 'Tangkap ' + n.textContent); } else { n.removeAttribute('role'); n.removeAttribute('aria-label'); }
      });
    };
    /* bingkai kata kunci: sel yang memuat kata kunci (huruf besar-kecil diabaikan) */
    api.barisKunci = function (kunci) {
      var k = kunci.toLowerCase();
      for (var i = 0; i < api.baris.length; i++) if (api.baris[i].textContent.toLowerCase().indexOf(k) >= 0) return i;
      return -1;
    };
    api.bingkaiKunci = function (i, kunci) {
      Array.prototype.forEach.call(kertas.querySelectorAll('.isi-sel'), function (s) { s.classList.remove('kunci'); });
      if (i < 0) return;
      var k = kunci.toLowerCase();
      Array.prototype.forEach.call(api.isiBaris(i), function (s) { if (s.textContent.toLowerCase().indexOf(k) >= 0) s.classList.add('kunci'); });
    };
    api.kotakIsi = function (i) { return Array.prototype.map.call(api.isiBaris(i), function (s) { return keLogis(s.getBoundingClientRect()); }); };
    api.kotakJudul = function () { return [keLogis(api.judulEl.getBoundingClientRect())]; };
    api.titikNilai = function (n) { var r = keLogis(n.getBoundingClientRect()); return { x: r.x + r.w / 2, y: r.y + r.h / 2, kotak: r }; };
    return api;
  }

  root.Bacaan = { lembar: lembar, daftar: daftar, kotakBaris: kotakBaris, keLogis: keLogis, tebal: tebal };
})(window);
