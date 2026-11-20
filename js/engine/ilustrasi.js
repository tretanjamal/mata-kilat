/* Ilustrasi bacaan (review Fase 4: langkah "Gambar" pada mantra Jurus Sekilas perlu dilatih).
   Gambar kecil 220x160 untuk teks Sekilas bergambar, dengan gaya sistem seni: garis Tinta Malam, warna datar, sudut membulat.
   Fungsi gambar baru memanggil Seni saat dipakai, jadi daftar nama bisa diperiksa uji logika tanpa peramban. */
var Ilustrasi = (function () {
  'use strict';
  var L = 220, Tg = 160, T = 3.2;
  var MALAM = '#33427A', SIANG = '#DDF0F7', AIR = '#7FC3DE', nomor = 0;

  /* bingkai: latar diisi dulu, isi gambar, lalu garis bingkai di atas supaya sudut tetap rapi */
  function bingkai(latar, isi) {
    var S = Seni, id = 'klip-ilus-' + (++nomor);
    return S.el('clipPath', { id: id }, S.kotak(4, 4, L - 8, Tg - 8, 18, '#fff', 0)) +
      S.g(S.kotak(4, 4, L - 8, Tg - 8, 18, latar, 0) + isi, { 'clip-path': 'url(#' + id + ')' }) +
      S.kotak(4, 4, L - 8, Tg - 8, 18, 'none', T);
  }
  /* awan: semua lingkaran bergaris dulu, lalu isinya, supaya garis dalam tidak terlihat */
  function awan(x, y, s, warna) {
    var S = Seni, b = [[-22, 4, 13], [-6, -6, 16], [12, -2, 14], [24, 6, 11], [0, 8, 14]], luar = '', dalam = '';
    b.forEach(function (c) { luar += S.bulat(x + c[0] * s, y + c[1] * s, c[2] * s, warna, T * 2); dalam += S.bulat(x + c[0] * s, y + c[1] * s, c[2] * s, warna, 0); });
    return luar + dalam;
  }
  function bintang(x, y) { return Seni.kilau(x, y, 5, Seni.P.kunang, 1.6); }
  function bukit(warna) { return Seni.jalur('M0,132 Q50,112 110,126 Q170,140 220,118 L220,160 L0,160 Z', warna, T); }
  function airBawah(y) { return Seni.jalur('M0,' + y + ' L220,' + y + ' L220,160 L0,160 Z', AIR, T); }

  var GAMBAR = {
    capung: function () {
      var S = Seni, P = S.P, sayap = '#EAF8FF';
      return bingkai(SIANG,
        airBawah(118) + S.jalur('M52,134 Q64,129 76,134 M140,142 Q152,137 164,142', 'none', 2.4, { stroke: '#fff' }) +
        S.jalur('M30,120 Q27,84 34,52', 'none', 4, { stroke: P.lumut }) + S.elips(34, 56, 5, 13, P.dahan, 2.4) +
        S.jalur('M186,120 Q190,90 182,66', 'none', 4, { stroke: P.lumut }) + S.elips(182, 70, 5, 12, P.dahan, 2.4) +
        S.elips(94, 44, 7, 24, sayap, 2.4, { transform: 'rotate(-14 94 66)' }) + S.elips(110, 44, 7, 24, sayap, 2.4, { transform: 'rotate(14 110 66)' }) +
        S.elips(94, 90, 7, 22, sayap, 2.4, { transform: 'rotate(14 94 70)' }) + S.elips(110, 90, 7, 22, sayap, 2.4, { transform: 'rotate(-14 110 70)' }) +
        S.kotak(108, 64, 66, 9, 4.5, '#3AA0C8', 2.6) + S.elips(100, 68, 11, 9, P.telaga, 2.6) +
        S.bulat(84, 68, 9, P.telaga, 2.6) + S.bulat(80, 63, 4, '#9BE6D6', 1.8) + S.bulat(80, 73, 4, '#9BE6D6', 1.8));
    },
    kelelawar: function () {
      var S = Seni, P = S.P, bulu = '#8A5A3C', sayap = '#5A3B2E';
      return bingkai(MALAM,
        S.bulat(182, 32, 14, '#FFF2B8', 2.4) + bintang(34, 28) + bintang(140, 20) + bukit('#2F5E45') +
        S.jalur('M104,76 Q78,50 38,58 Q48,70 44,84 Q58,79 62,94 Q74,84 84,96 Q92,84 104,88 Z', sayap, T) +
        S.jalur('M116,76 Q142,50 182,58 Q172,70 176,84 Q162,79 158,94 Q146,84 136,96 Q128,84 116,88 Z', sayap, T) +
        S.jalur('M101,57 L98,44 L107,53 Z M119,57 L122,44 L113,53 Z', bulu, 2.6) +
        S.elips(110, 84, 13, 18, bulu, T) + S.bulat(110, 64, 12, bulu, T) +
        S.bulat(105, 62, 2.4, P.tinta, 0) + S.bulat(115, 62, 2.4, P.tinta, 0) + S.elips(110, 69, 4, 3, '#6E4630', 0) +
        S.bulat(110, 108, 9, P.jingga, 2.6) + S.daun(116, 99, 10, 6, -30, P.daun2, 1.8) +
        S.bulat(72, 128, 2.6, '#E9D9A6', 0) + S.bulat(88, 142, 2.6, '#E9D9A6', 0) + S.bulat(134, 136, 2.6, '#E9D9A6', 0));
    },
    lumut: function () {
      var S = Seni, P = S.P, tunas = '';
      [[62, 92], [80, 86], [104, 80], [126, 82], [150, 90]].forEach(function (k) { tunas += S.jalur('M' + k[0] + ',' + k[1] + ' L' + (k[0] - 2) + ',' + (k[1] - 16), 'none', 2.4) + S.bulat(k[0] - 2, k[1] - 18, 3, '#C9A15A', 1.8); });
      return bingkai('#E6F2DA',
        S.jalur('M0,136 L220,136 L220,160 L0,160 Z', '#B9946A', T) +
        S.jalur('M28,138 Q32,94 78,86 Q120,72 160,90 Q196,102 194,138 Z', '#A3ACB2', T) +
        S.jalur('M40,108 Q48,94 62,98 Q70,86 86,90 Q98,80 112,86 Q126,80 140,90 Q156,88 166,100 Q178,102 184,114 Q160,106 140,108 Q110,102 86,106 Q60,106 40,108 Z', P.daun2, 2.6) +
        tunas + S.jalur('M176,34 Q184,46 176,52 Q168,46 176,34 Z M196,52 Q202,61 196,66 Q190,61 196,52 Z', AIR, 2.2));
    },
    burungHantu: function () {
      var S = Seni, P = S.P, bulu = '#B07748';
      return bingkai(MALAM,
        S.bulat(176, 40, 20, '#FFF2B8', 2.4) + bintang(30, 26) + bintang(60, 52) + bintang(196, 92) +
        S.jalur('M0,128 Q110,114 220,130', 'none', 16) + S.jalur('M0,128 Q110,114 220,130', 'none', 10, { stroke: P.dahan }) +
        S.jalur('M96,56 L92,40 L106,52 Z M124,56 L128,40 L114,52 Z', bulu, 2.6) +
        S.elips(110, 88, 30, 36, bulu, T) + S.elips(110, 98, 19, 22, '#EAD3A8', 0) +
        S.bulat(98, 72, 13, '#F6E3BF', 2.6) + S.bulat(122, 72, 13, '#F6E3BF', 2.6) +
        S.bulat(98, 72, 7, P.kunang, 2) + S.bulat(122, 72, 7, P.kunang, 2) + S.bulat(98, 72, 3, P.tinta, 0) + S.bulat(122, 72, 3, P.tinta, 0) +
        S.jalur('M110,79 L105,85 L110,91 L115,85 Z', P.jingga, 2.2) +
        S.jalur('M82,82 Q74,104 90,120 M138,82 Q146,104 130,120', 'none', T) +
        S.jalur('M101,121 L99,128 M106,121 L106,129 M114,121 L114,129 M119,121 L121,128', 'none', 2.6, { stroke: P.jingga }));
    },
    pelangi: function () {
      var S = Seni, warna = ['#E5554F', '#EE8A4A', '#F5DF5C', '#5DB548', '#2B8FB8', '#5E4E93'], busur = '';
      warna.forEach(function (w, i) { var r = 92 - i * 8; busur += S.jalur('M' + (110 - r) + ',140 A' + r + ',' + r + ' 0 0 1 ' + (110 + r) + ',140', 'none', 0, { stroke: w, 'stroke-width': 8 }); });
      return bingkai('#CDEBF7',
        busur + S.jalur('M14,140 A96,96 0 0 1 206,140 M58,140 A52,52 0 0 1 162,140', 'none', 2.4) +
        awan(46, 40, 0.8, '#fff') + awan(176, 46, 0.9, '#fff') + bukit('#5DB548'));
    },
    katak: function () {
      var S = Seni, P = S.P, kulit = '#7CC24E', not = '';
      [[160, 52], [178, 36]].forEach(function (n) { not += S.jalur('M' + n[0] + ',' + n[1] + ' L' + n[0] + ',' + (n[1] - 16) + ' L' + (n[0] + 9) + ',' + (n[1] - 19), 'none', 2.6) + S.elips(n[0] - 3, n[1], 5, 4, P.tinta, 0); });
      return bingkai('#F3D9B8',
        S.bulat(46, 40, 16, '#FBE3A0', 2.4) + airBawah(112) +
        S.elips(110, 128, 64, 15, P.daun2, T) + S.jalur('M110,128 L154,120', 'none', 2.4) +
        S.jalur('M84,110 Q70,122 84,128 M136,110 Q150,122 136,128', 'none', T) +
        S.elips(110, 106, 30, 21, kulit, T) + S.bulat(110, 116, 10, '#F4F0C8', 2.4) +
        S.bulat(95, 84, 9, kulit, 2.6) + S.bulat(125, 84, 9, kulit, 2.6) + S.bulat(95, 84, 4, P.tinta, 0) + S.bulat(125, 84, 4, P.tinta, 0) +
        S.jalur('M97,100 Q110,107 123,100', 'none', 2.4) + not);
    },
    kunang: function () {
      var S = Seni, P = S.P;
      return bingkai(MALAM,
        bintang(30, 26) + bintang(186, 22) + bintang(150, 48) + S.bulat(60, 52, 10, P.kunang, 0, { opacity: 0.5 }) + S.bulat(60, 52, 4, P.kunang, 1.6) +
        S.jalur('M0,150 Q60,96 220,112 L220,160 L0,160 Z', P.daun3, T) + S.daun(150, 116, 120, 40, -12, P.daun2, T) +
        S.bulat(132, 84, 26, P.kunang, 0, { opacity: 0.45 }) +
        S.elips(108, 68, 14, 8, '#EAF8FF', 2.2, { transform: 'rotate(-35 108 68)' }) + S.elips(124, 64, 14, 8, '#EAF8FF', 2.2, { transform: 'rotate(-60 124 64)' }) +
        S.elips(116, 80, 10, 18, '#3B3A4A', 2.6, { transform: 'rotate(-55 116 80)' }) + S.bulat(102, 88, 7, '#E5554F', 2.4) +
        S.elips(132, 74, 9, 8, P.kunang, 2.6) + S.jalur('M98,88 L88,82 M99,92 L88,94', 'none', 2.2));
    },
    kunangHidup: function () {
      var S = Seni, P = S.P, x = [34, 84, 136, 186], y = 84, isi = '';
      x.forEach(function (cx) { isi += S.bulat(cx, y, 22, '#FFF7E6', 2.6); });
      isi += S.bulat(28, 88, 5, '#FFF2B8', 1.8) + S.bulat(39, 88, 5, '#FFF2B8', 1.8) + S.bulat(34, 79, 5, '#FFF2B8', 1.8);
      isi += S.jalur('M70,90 Q76,78 84,88 Q92,98 98,84', 'none', 7, { stroke: '#8E6A4A' }) + S.bulat(98, 84, 3.4, P.tinta, 0);
      isi += S.elips(136, 84, 9, 15, '#C9A15A', 2.4) + S.jalur('M130,78 L142,78 M129,86 L143,86', 'none', 1.8);
      isi += S.bulat(190, 90, 12, P.kunang, 0, { opacity: 0.55 }) + S.elips(182, 80, 9, 5, '#EAF8FF', 1.8, { transform: 'rotate(-30 182 80)' }) +
        S.elips(184, 86, 7, 11, '#3B3A4A', 2.2) + S.bulat(190, 94, 6, P.kunang, 2);
      [59, 110, 161].forEach(function (ax) { isi += S.jalur('M' + (ax - 3) + ',' + (y - 5) + ' L' + (ax + 3) + ',' + y + ' L' + (ax - 3) + ',' + (y + 5), 'none', 2.6, { stroke: P.kunang }); });
      return bingkai(MALAM, bintang(30, 28) + bintang(110, 22) + bintang(190, 34) + S.jalur('M0,136 Q110,124 220,138 L220,160 L0,160 Z', '#2F5E45', T) + isi);
    },
    awan: function () {
      var S = Seni, hujan = '';
      [[136, 98], [152, 110], [168, 96], [184, 108], [146, 128], [174, 124]].forEach(function (k) { hujan += S.jalur('M' + k[0] + ',' + k[1] + ' L' + (k[0] - 4) + ',' + (k[1] + 10), 'none', 3, { stroke: '#2B8FB8' }); });
      return bingkai(SIANG, awan(62, 60, 1.1, '#fff') + awan(160, 66, 1.2, '#8E97A8') + hujan + bukit('#5DB548'));
    }
  };

  return {
    nama: Object.keys(GAMBAR),
    ada: function (n) { return GAMBAR.hasOwnProperty(n); },
    svg: function (n) { return Seni.svg(L, Tg, GAMBAR[n](), ' class="ilus-bacaan" aria-hidden="true" focusable="false"'); }
  };
})();
