/* Hasil Belajarku (brief bagian 2 dan 3c, CLAUDE.md bagian 5): Tasi, Ulin, dan Tupi bersorak; enam keterampilan dalam bahasa anak
   dengan status yang dibedakan oleh bentuk (bintang = dikuasai, tunas = berkembang, putar = ayo latih lagi, lingkaran putus-putus =
   belum dicoba); perbandingan Uji Kilat (hanya kalimat positif); tombol Catatan untuk Guru (js/engine/guru.js).
   Dibuka otomatis sesudah L5 pertama kali selesai, dan kapan saja dari Peta Jelajah. */
(function () {
  var st = null;
  var IKON_STATUS = { dikuasai: 'stDikuasai', berkembang: 'stBerkembang', latihan: 'stLatihan', belum: 'stBelum' };
  /* kalimat Uji Kilat: lebih cepat minimal 1,2 kali = "x kali lebih cepat", selain itu kalimat positif */
  function kalimatUji() {
    var B = STR.belajarku, u = Save.data.ujiKilat;
    if (!u.awal || !u.akhir) return B.ujiBelum;
    var x = u.awal / u.akhir;
    return x >= 1.2 ? U.fmt(B.ujiCepat, { x: String(Math.round(x * 10) / 10).replace('.', ',') }) : B.ujiTeliti;
  }
  Scenes.add('belajarku', {
    enter: function (root, p) {
      p = p || {};
      var B = STR.belajarku, D = Save.data;
      st = { siap: false };
      Aud.musik('festival');
      Adegan.latar(root, (window.LEVELS && LEVELS[5] && LEVELS[5].latar) || 'latarRumahPohon');
      root.appendChild(U.h('div', 'redup'));
      Adegan.lapisSvg(root, Adegan.kunangAmbien(18, 30, 40, 1220, 640, 51));
      var status = B.tag.map(function (t) { return Save.status(t); }), kuasai = status.filter(function (s) { return s === 'dikuasai'; }).length;
      /* di HP panel lebih lebar: ketiga tokoh ditumpuk lebih kecil di lajur kiri supaya tidak menimpa kartu keterampilan */
      var hp = Stage.hp;
      st.tokoh = [
        new Tokoh(root, 'tasi', hp ? { x: 76, y: 362, s: 0.6, ekspresi: kuasai >= 3 ? 'sorak' : 'senang' } : { x: 168, y: 470, s: 0.84, ekspresi: kuasai >= 3 ? 'sorak' : 'senang' }),
        new Tokoh(root, 'ulin', hp ? { x: 76, y: 712, s: 0.5, ekspresi: 'senang' } : { x: 92, y: 708, s: 0.6, ekspresi: 'senang' }),
        new Tokoh(root, 'tupi', hp ? { x: 76, y: 540, s: 0.5, ekspresi: 'sorak', balik: true } : { x: 250, y: 708, s: 0.6, ekspresi: 'sorak', balik: true })
      ];
      var bintang = 0;
      Object.keys(D.level).forEach(function (n) { if (D.level[n].selesai) bintang += D.level[n].bintang; });
      var panel = U.h('div', 'papan panel-belajar');
      panel.innerHTML = '<div class="pita-panel">' + UI.esc(B.judul) + '</div>' +
        '<p class="sapa-belajar" data-cek="sapa belajar">' + UI.esc(B.sapa) + '</p>' +
        '<div class="ringkas-belajar"><span class="chip-ringkas">' + Seni.ikon('bintang', 32) + '<span data-cek="ringkas">' + UI.esc(U.fmt(B.ringkas, { b: bintang, k: D.kunang })) + '</span></span>' +
        '<span class="chip-ringkas chip-uji">' + Seni.ikon('lompat', 32) + '<span data-cek="uji kilat">' + UI.esc(kalimatUji()) + '</span></span></div>' +
        '<div class="grid-belajar"></div><div class="baris-tombol-hasil"></div>';
      root.appendChild(panel);
      var grid = panel.querySelector('.grid-belajar');
      var sel = B.tag.map(function (t, i) {
        var d = U.h('div', 'sel-belajar status-' + status[i]);
        d.dataset.tag = t;
        d.innerHTML = '<span class="lencana-status">' + Seni.ikon(IKON_STATUS[status[i]], 60) + '</span><div class="isi-sel"><p class="kalimat-belajar" data-cek="belajar ' + t + '">' + UI.esc(B.kalimat[t]) + '</p>' +
          '<span class="chip-status status-' + status[i] + '">' + UI.esc(B.status[status[i]]) + '</span></div>';
        if (!UI.kurangi) d.style.opacity = 0;
        grid.appendChild(d); return d;
      });
      var baris = panel.querySelector('.baris-tombol-hasil');
      var guru = Input.button(Seni.ikon('buku', 36) + '<span class="label-tombol">' + UI.esc(B.guru) + '</span>', 'ketiga alir', function () { Guru.panel(); }, { id: 'catatan-guru' });
      var peta = Input.button('<span class="label-tombol">' + UI.esc(B.peta) + '</span>', 'utama alir lebar', function () { Scenes.go('peta'); }, { id: 'ke-peta' });
      baris.appendChild(guru);
      if (p.dariL5) baris.appendChild(Input.button('<span class="label-tombol">' + UI.esc(B.ulangi) + '</span>', 'ketiga alir', function () { Scenes.go('level5'); }, { id: 'belajar-ulangi' }));
      baris.appendChild(peta);
      if (p.dariL5) Aud.jingle('final', 2);
      /* sel muncul satu per satu: yang dikuasai disambut nada dan kilau */
      var urut = Tween.wait(350);
      sel.forEach(function (d, i) {
        urut = urut.then(function () {
          if (!st) return;
          if (status[i] === 'dikuasai') { Aud.sfx('star', i % 3); var t = UI.titik(d.querySelector('.lencana-status'), 0.5); if (t) UI.ledak(t.x, t.y, 6); }
          else Aud.sfx('tick', 1 + i * 0.1);
          if (UI.kurangi) return;
          return Tween.run(260, function (e) { d.style.opacity = e; d.style.transform = 'translateY(' + ((1 - e) * 16).toFixed(1) + 'px)'; }, Ease.easeOutBack).then(function () { d.style.transform = ''; });
        });
      });
      urut.then(function () {
        if (!st) return;
        UI.bacakan(B.sapa);
        UI.fokus(peta); st.siap = true;
        UI.idle.atur(function () { return peta; });
      });
    },
    exit: function () { st = null; UI.idle.fn = null; UI.sembunyiTangan(true); },
    uji: {
      keadaan: function () { return { tugas: 'belajarku', siap: !!(st && st.siap), status: STR.belajarku.tag.map(function (t) { return Save.status(t); }) }; },
      aksi: function () { var b = document.querySelector('[data-id="ke-peta"]'); if (b) { b.click(); return 'peta'; } return null; }
    }
  });
})();
