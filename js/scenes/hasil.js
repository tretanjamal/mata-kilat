/* Hasil Jelajah (brief 3c, standar bagian 4): bintang muncul satu per satu dengan nada bertingkat, kunang-kunang menghitung naik,
   hasil Ulang Kilat, Kartu Jurus baru, Tasi bersorak. Lanjut ke peta (sesudah L5 pertama kali: Hasil Belajarku) atau Ulangi. */
(function () {
  Scenes.add('hasil', {
    enter: function (root, p) {
      var H = STR.hasil, lvl = p.level || 1;
      Aud.musik(null);
      Adegan.latar(root, (window.LEVELS && LEVELS[lvl] && LEVELS[lvl].latar) || 'latarRumahPohon');
      root.appendChild(U.h('div', 'redup'));
      Adegan.lapisSvg(root, Adegan.kunangAmbien(16, 40, 60, 360, 600, 31));
      var tasi = new Tokoh(root, 'tasi', { x: 200, y: 640, s: 1.1, ekspresi: 'sorak' });
      var panel = U.h('div', 'papan panel-hasil');
      panel.innerHTML = '<div class="pita-panel">' + UI.esc(H.judulLevel[lvl - 1] || H.judul) + '</div>' +
        '<div class="bintang-hasil" role="img" aria-label="' + p.bintang + ' bintang dari 3"></div><p class="label-bintang" data-cek="label bintang"></p>' +
        (lvl === 6 ? '<div class="kunang-hasil rekor-hasil">' + Seni.ikon('bulan', 56) + '<span>' + UI.esc(U.fmt(H.rekor, { b: (Save.data.level['6'] || {}).bintang || p.bintang })) + '</span><span class="nilai" hidden>0</span></div>' :
        '<div class="kunang-hasil">' + Seni.svg(60, 62, Seni.toples(9), ' viewBox="0 0 50 52" aria-hidden="true"') + '<span class="nilai">0</span><span>' + UI.esc(H.kunang) + '</span></div>') +
        (p.ulang ? '<p class="ulang-hasil" data-cek="ulang hasil">' + Seni.ikon('ulangi', 30) + '<span>' + UI.esc(U.fmt(H.ulang, { b: p.ulangBenar || 0, n: p.ulang })) + '</span></p>' : '') +
        '<div class="kartu-baru"></div><div class="baris-tombol-hasil"></div>';
      root.appendChild(panel);
      var wadah = panel.querySelector('.bintang-hasil'), bintangEl = [];
      for (var i = 0; i < 3; i++) {
        var b = U.h('span', 'satu kosong', Seni.svg(108, 108, Seni.jalur('M54,6 L67,40 L104,40 L74,62 L85,98 L54,77 L23,98 L34,62 L4,40 L41,40 Z', Seni.P.kunang, 5), ' viewBox="0 0 108 108" aria-hidden="true"'));
        wadah.appendChild(b); bintangEl.push(b);
      }
      var kartu = panel.querySelector('.kartu-baru');
      if (p.kartu && p.kartu.length) kartu.innerHTML = '<b>' + UI.esc(H.kartuBaru) + '</b><div class="baris-kartu">' + p.kartu.map(function (k) { return '<span class="kartu-kecil">' + Seni.ikon('bintang', 30) + UI.esc(STR.kartuJurus[k]) + '</span>'; }).join('') + '</div>';
      var tb = panel.querySelector('.baris-tombol-hasil');
      /* L5 pertama kali selesai: lanjut ke Hasil Belajarku (brief 3c) */
      var lanjut = Input.button(H.lanjut, 'utama alir lebar', function () { if (p.tamat) Scenes.go('belajarku', { dariL5: true }); else Scenes.go('peta'); }, { id: 'hasil-lanjut' });
      tb.appendChild(Input.button(H.ulangi, 'ketiga alir', function () { Scenes.go('level' + lvl); }, { id: 'hasil-ulangi', w: 220, h: 76 }));
      tb.appendChild(lanjut);
      var nilai = panel.querySelector('.kunang-hasil .nilai');
      Aud.jingle('level', Math.max(0, p.bintang - 1));
      var urut = Promise.resolve();
      bintangEl.forEach(function (b, n) {
        urut = urut.then(function () {
          return Tween.wait(n ? 380 : 500).then(function () {
            if (n >= p.bintang) return;
            b.classList.remove('kosong'); Aud.sfx('star', n);
            panel.querySelector('.label-bintang').textContent = H.bintang[n];
            if (!UI.kurangi) return Tween.run(400, function (e) { b.style.transform = 'scale(' + (0.4 + 0.6 * e) + ')'; }, Ease.easeOutBack);
          });
        });
      });
      urut.then(function () { return UI.hitungNaik(nilai, 0, p.kunang || 0, function (v) { return String(v); }, 900); })
        .then(function () { if (p.kartu && p.kartu.length) Aud.sfx('sring'); UI.fokus(lanjut); });
      UI.idle.atur(function () { return lanjut; });
      this.tasi = tasi;
    },
    exit: function () { UI.idle.fn = null; }
  });
})();
