/* Peta Jelajah (GDD bagian 5): lencana level di pelataran bundar peta AI, bintang tiap level, toples kunang, Buku Jurus,
   Hasil Belajarku, Menu Utama, dan bulan yang naik tiap level selesai. Level terbuka berurutan: L2 sesudah L1 selesai, dst. */
(function () {
  /* pusat pelataran bundar di peta-jelajah (koordinat panggung 1280x720, diukur Fase 1) */
  var PELATARAN = [[170, 576], [612, 606], [422, 330], [968, 410], [1088, 190]];
  var SIAP = 5;   // jumlah level yang sudah dibangun (Fase 2)
  /* Bulan naik (brief 3b dan 9e): bulan lukisan dihapus dari latar (tools/proses-aset.py), lalu bulan SVG terbit dari balik bukit
     di titik yang sama dan naik satu tahap tiap level selesai; langit menggelap satu tahap. Dipotong di garis bukit (y 117). */
  var BULAN = { x: 790, y0: 132, naik: 20, r: 34 };
  function lapisBulan(root) {
    var el = U.h('div', 'lapis langit-bulan');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="langit-gelap"></div><svg viewBox="0 0 1280 720" width="1280" height="720"><defs>' +
      '<radialGradient id="gBulan"><stop offset="0" stop-color="#FFF4C8" stop-opacity=".85"/><stop offset=".45" stop-color="#FFE9A0" stop-opacity=".35"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="kBukit"><path d="M600,0 H1000 V112 Q900,108 830,116 Q790,121 740,118 Q680,116 600,124 Z"/></clipPath></defs>' +
      '<g clip-path="url(#kBukit)"><g class="bulan-naik"><circle r="' + (BULAN.r * 2.6) + '" fill="url(#gBulan)"/>' +
      '<circle r="' + BULAN.r + '" fill="#FFF3C4" stroke="#F6D77A" stroke-width="3"/><circle cx="-11" cy="-9" r="7" fill="#F1E3A6"/><circle cx="12" cy="10" r="5" fill="#F1E3A6"/><circle cx="13" cy="-12" r="3.5" fill="#F1E3A6"/></g></g></svg>';
    root.appendChild(el);
    var g = el.querySelector('.bulan-naik'), gelap = el.querySelector('.langit-gelap');
    return function (n) {
      g.setAttribute('transform', 'translate(' + BULAN.x + ' ' + (BULAN.y0 - BULAN.naik * n).toFixed(1) + ')');
      gelap.style.opacity = (0.09 * n).toFixed(3);
    };
  }
  Scenes.add('peta', {
    enter: function (root) {
      Aud.musik('judul');
      Adegan.latar(root, 'peta');
      var aturBulan = lapisBulan(root), selesaiN = 0;
      for (var q = 1; q <= 5; q++) if (Save.selesai(String(q))) selesaiN++;
      var lalu = Math.min(Save.data.bulan, selesaiN);
      aturBulan(lalu);
      if (selesaiN > lalu) {
        Save.data.bulan = selesaiN; Save.save();
        if (UI.kurangi) aturBulan(selesaiN);
        else Tween.wait(500).then(function () {
          if (Scenes.name !== 'peta') return;
          Aud.sfx('lonceng');
          return Tween.run(1200, function (e) { aturBulan(lalu + (selesaiN - lalu) * e); }, Ease.easeInOutCubic);
        });
      }
      Adegan.lapisSvg(root, Adegan.kunangAmbien(8 + Math.round(Save.data.kunang / 60), 40, 80, 1200, 560, 21));
      var L = STR.peta.level, lencana = [];
      root.appendChild(UI.tombolIkon('panah', STR.tombol.menuUtama, function () { Scenes.go('judul'); }, { id: 'menu-utama', cls: 'panah-kiri tombol-jeda' }));
      var nama = U.h('div', 'papan-nama', UI.esc(STR.peta.judul)); nama.style.maxWidth = '260px'; root.appendChild(nama);
      var hud = U.h('div', 'toples-hud', Seni.svg(46, 48, Seni.toples(7), ' viewBox="0 0 50 52" aria-hidden="true"') + '<span class="nilai">' + Save.data.kunang + '</span>');
      hud.setAttribute('role', 'img'); hud.setAttribute('aria-label', U.fmt(STR.hud.kunang, { n: Save.data.kunang }));
      root.appendChild(hud);
      root.appendChild(UI.tombolIkon('buku', STR.ikon.bukuJurus, function () { UI.bukuJurus(); }, { id: 'buku-jurus', cls: 'tombol-buku' }));
      root.appendChild(Input.button(Seni.ikon('stDikuasai', 40) + '<span class="label-tombol">' + UI.esc(STR.tombol.belajarku) + '</span>', 'kedua tombol-belajarku', function () { Scenes.go('belajarku'); }, { id: 'hasil-belajarku' }));
      PELATARAN.forEach(function (p, i) {
        var id = String(i + 1), data = Save.data.level[id], buka = i < SIAP && (i === 0 || Save.selesai(String(i))), bintang = data ? data.bintang : 0;
        var b5 = '';
        for (var k = 0; k < 3; k++) b5 += Seni.svg(24, 24, Seni.jalur('M12,2 L15,9 L22,9 L16.5,13.5 L18.5,21 L12,16.5 L5.5,21 L7.5,13.5 L2,9 L9,9 Z', k < bintang ? Seni.P.kunang : '#fff', 2.2), ' viewBox="0 0 24 24" aria-hidden="true"');
        var isi = buka ? '<span class="no">' + id + '</span><span class="bintang-kecil">' + b5 + '</span>' : Seni.ikon('gembok', 52);
        var b = Input.button(isi, (buka ? (i === 0 ? 'kedua' : 'utama') : 'ketiga terkunci') + ' lencana', function () {
          if (buka) Scenes.go('level' + id);
          else { UI.toast(i < SIAP ? STR.peta.terkunci : STR.peta.segera); UI.goyang(b); }
        }, { x: p[0] - 66, y: p[1] - 100, id: 'level-' + id, aria: L[i] });
        root.appendChild(b); lencana.push(b);
        var lab = U.h('div', 'label-lencana' + (buka ? '' : ' terkunci'), UI.esc(L[i]));
        lab.style.left = p[0] + 'px'; lab.style.top = (p[1] + 38) + 'px';
        root.appendChild(lab);
      });
      /* L6 Bukit Bulan (TAMBAHAN): muncul di dekat bulan sesudah festival */
      if (Save.selesai('5')) {
        var b6 = '', d6 = Save.data.level['6'], bt6 = d6 ? d6.bintang : 0;
        for (var k6 = 0; k6 < 3; k6++) b6 += Seni.svg(24, 24, Seni.jalur('M12,2 L15,9 L22,9 L16.5,13.5 L18.5,21 L12,16.5 L5.5,21 L7.5,13.5 L2,9 L9,9 Z', k6 < bt6 ? Seni.P.kunang : '#fff', 2.2), ' viewBox="0 0 24 24" aria-hidden="true"');
        var l6 = Input.button(Seni.ikon('bulan', 56) + '<span class="bintang-kecil">' + b6 + '</span>', 'biru lencana lencana-bulan', function () { Scenes.go('level6'); }, { x: 560, y: 84, id: 'level-6', aria: L[5] });
        root.appendChild(l6); lencana.push(l6);
        var lab6 = U.h('div', 'label-lencana', UI.esc(L[5])); lab6.style.left = '626px'; lab6.style.top = '222px'; root.appendChild(lab6);
      }
      if (!Save.selesai('1')) {
        var bal = Adegan.balon(root);
        bal.el.classList.add('balon-peta');   /* letak di CSS: di HP balon bawah bawaan tidak muat di peta (review Fase 4) */
        new Tokoh(root, 'tasi', { x: Stage.hp ? 470 : 300, y: 690, s: 0.62, ekspresi: 'semangat', balik: true });   // HP: tidak menutup label Rumah Pohon
        bal.kata(STR.peta.ajak);
        setTimeout(function () { if (Scenes.name === 'peta') UI.tunjuk(lencana[0], { fy: 0.5 }); }, 600);
      }
      /* isyarat diam menunjuk level berikutnya yang belum selesai */
      var berikut = 0; while (berikut < 4 && Save.selesai(String(berikut + 1))) berikut++;
      UI.idle.atur(function () { return lencana[berikut]; });
    },
    exit: function () { UI.idle.fn = null; }
  });
})();
