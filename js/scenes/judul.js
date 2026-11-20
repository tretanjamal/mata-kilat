/* Layar judul (mockup Fase 0 judul.html): rimba senja, logo MATA KILAT berpetir, pita subjudul, slogan, MULAI, Lenteraku,
   Informasi, Referensi, Pengembang, dan ikon pojok. Tasi menunjuk MULAI; Tupi dan Ulin mengintip dari daun. */
(function () {
  var bersih = null;
  Scenes.add('judul', {
    enter: function (root) {
      Aud.musik('judul');
      Adegan.latar(root, 'latarJudul');
      var P = Seni.P, s = Seni.defs() + Adegan.kunangAmbien(14, 40, 60, 1200, 560, 11);
      s += Seni.logo(58, 152, 106);
      s += Seni.jalur('M44,178 L64,178 L64,236 L44,236 L54,207 Z', P.ungu, 4) + Seni.jalur('M600,178 L620,178 L610,207 L620,236 L600,236 Z', P.ungu, 4);
      s += Seni.jalur('M60,172 L604,172 L604,232 L60,232 Z', '#7362AE', 4) + Seni.jalur('M64,224 L600,224', 'none', 0, { stroke: '#4E4180', 'stroke-width': 5 });
      s += Seni.el('text', { x: 332, y: 214, 'text-anchor': 'middle', 'font-family': 'Baloo 2', 'font-weight': 800, 'font-size': 33, fill: '#fff', 'data-maxw': 520 },
        'Jurus <tspan font-style="italic">Skimming</tspan> dan <tspan font-style="italic">Scanning</tspan>');
      s += Seni.el('text', { x: 66, y: 278, 'font-family': 'Baloo 2', 'font-weight': 800, 'font-size': 32, fill: P.kertas, stroke: P.tinta, 'stroke-width': 7, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, UI.esc(STR.judul.slogan));
      s += Seni.kilau(318, 254, 10) + Seni.kilau(338, 276, 6);
      Adegan.lapisSvg(root, s, 'lapis-logo');
      root.appendChild(U.h('h1', 'tersembunyi', UI.esc(STR.judul.lengkap)));

      new Tokoh(root, 'tasi', { x: 716, y: 664, s: 0.86, balik: true, ekspresi: 'semangat' });
      new Tokoh(root, 'tupi', { x: 1004, y: 704, s: 0.9, balik: true, ekspresi: 'sorak' });
      new Tokoh(root, 'ulin', { x: 1172, y: 700, s: 0.9, ekspresi: 'senang' });
      var depan = Adegan.lapisSvg(root, Adegan.daunDepan([[916, 700, 150, 64, -20, '#5DB548'], [1012, 712, 170, 66, 10, '#3E9A4A'], [1094, 694, 150, 60, -26, '#7CC24E'],
        [1196, 712, 190, 70, 14, '#4FA845'], [1272, 668, 150, 66, -60, '#5DB548']]));
      depan.style.zIndex = 12;

      var T = STR.tombol;
      var mulai = Input.button('<span class="label-tombol" data-cek="MULAI">' + T.mulai + '</span>', 'utama tombol-mulai', function () {
        Scenes.go(Save.data.kartu ? 'peta' : 'kartu');
      }, { x: 60, y: 300, w: 340, h: 104, font: 56, id: 'mulai' });
      root.appendChild(mulai);
      root.appendChild(Input.button(Seni.ikon('lentera', 40) + '<span class="label-tombol" data-cek="Lenteraku">' + T.lenteraku + '</span>', 'kedua tombol-lentera', function () { Scenes.go('kartu', { dariJudul: true }); },
        { x: 420, y: 314, w: 244, h: 78, font: 30, id: 'lenteraku' }));
      [['info', T.informasi, 40, 184], ['referensi', T.referensi, 236, 184], ['pengembang', T.pengembang, 432, 216]].forEach(function (b) {
        root.appendChild(Input.button('<span class="label-tombol" data-cek="' + b[1] + '">' + b[1] + '</span>', 'ketiga judul-kecil judul-' + b[0], function () { UI.info(b[0]); },
          { x: b[2], y: 424, w: b[3], h: 68, font: 26, id: b[0] }));
      });
      bersih = UI.pojok(root);
      document.fonts.ready.then(function () { Seni.susunLogo(root); });
      UI.idle.atur(function () { return mulai; });
      this.tata();
    },
    tata: function () {
      var hp = Stage.hp, q = function (s) { return Scenes.root.querySelector(s); };
      if (!q('.tombol-mulai')) return;
      q('.tombol-mulai').style.top = (hp ? 292 : 300) + 'px';
      q('.tombol-mulai').style.height = (hp ? 112 : 104) + 'px';
      q('.tombol-lentera').style.height = (hp ? 96 : 78) + 'px';
      q('.tombol-lentera').style.top = (hp ? 300 : 314) + 'px';
      Array.prototype.forEach.call(Scenes.root.querySelectorAll('.judul-kecil'), function (b) { b.style.top = (hp ? 418 : 424) + 'px'; b.style.height = (hp ? 92 : 68) + 'px'; });
    },
    exit: function () { if (bersih) bersih(); bersih = null; UI.idle.fn = null; }
  });
})();
