/* Sistem seni SVG Mata Kilat (dipindah dari mockup/seni.js Fase 0; GDD bagian 9).
   Gaya mengikuti lembar acuan kreator K1 (acuan-tasi.png) dan K2 (acuan-ulin-tupi.png):
   garis luar Tinta Malam tebal, warna datar, bayangan sel tipis, sudut membulat.
   Tokoh: titik asal di tengah telapak kaki, y negatif ke atas, tinggi sekitar 200 satuan.
   Warna bulu diambil langsung dari lembar acuan (sampel median 5x5). Gambar AI terdaftar di js/data/aset.js. */
var Seni = (function () {
  'use strict';

  var P = {
    tinta: '#1E2A47', kertas: '#FFF7E6', kunang: '#F5DF5C', lumut: '#2F7D4E', jingga: '#EE8A4A',
    ungu: '#5E4E93', dahan: '#8A5A3C', telaga: '#2B6C8A', sorot: '#FFE9A8', putih: '#FFFFFF',
    daun1: '#3E9A4A', daun2: '#5DB548', daun3: '#2F7D4E', daun4: '#7CC24E', urat: '#1F5A37',
    // Tasi (tarsius)
    tBulu: '#B9977A', tBuluGelap: '#A3846A', tMuka: '#DCC6AA', tPerut: '#EEDFC8', tTelinga: '#F4AB99',
    tHidung: '#E99584', tIris: '#FBC456', tIrisTepi: '#E9A23B', tPupil: '#141B33', tJari: '#F0B9A6',
    mulut: '#B23B5A', lidah: '#F28B8B', pipi: '#F28B8B',
    // Ulin (kukang)
    uBulu: '#F3CD9F', uMoncong: '#FDE5BF', uBercak: '#744E32', uTangan: '#B37D4E', uKaki: '#8E5E3E',
    uTelinga: '#D77559', uPunggung: '#8A5F3E', uIris: '#5A3620', buku: '#557A3B', bukuGelap: '#3F5E2C', bukuTepi: '#8FB06A',
    // Tupi (tupai)
    pBulu: '#B07748', pBuluTerang: '#D49A62', pOranye: '#F4A257', pKrem: '#F6E3BF', pGaris: '#5E3B22', pTelinga: '#F0A890'
  };

  function f(n) { return Math.round(n * 10) / 10; }
  function atr(o) {
    var s = '', k;
    for (k in o) if (o.hasOwnProperty(k) && o[k] !== undefined && o[k] !== null) s += ' ' + k + '="' + o[k] + '"';
    return s;
  }
  function el(tag, o, isi) { return '<' + tag + atr(o) + (isi === undefined ? '/>' : '>' + isi + '</' + tag + '>'); }
  function g(isi, o) { return el('g', o || {}, isi); }
  function gabungObj(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; if (b) for (k in b) o[k] = b[k]; return o; }
  function gayaGaris(isi, tebal, lain) {
    return gabungObj({ fill: isi || 'none', stroke: tebal ? P.tinta : 'none', 'stroke-width': tebal || null,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, lain);
  }
  function jalur(d, isi, tebal, lain) { return el('path', gabungObj({ d: d }, gayaGaris(isi, tebal, lain))); }
  function elips(cx, cy, rx, ry, isi, tebal, lain) { return el('ellipse', gabungObj({ cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry) }, gayaGaris(isi, tebal, lain))); }
  function bulat(cx, cy, r, isi, tebal, lain) { return el('circle', gabungObj({ cx: f(cx), cy: f(cy), r: f(r) }, gayaGaris(isi, tebal, lain))); }
  function kotak(x, y, w, h, r, isi, tebal, lain) { return el('rect', gabungObj({ x: f(x), y: f(y), width: f(w), height: f(h), rx: r }, gayaGaris(isi, tebal, lain))); }
  /* lain: objek atribut, atau teks atribut mentah (pola mesin studio, mis. ' viewBox="0 0 620 290"') */
  function svg(w, h, isi, lain) {
    var tambah = typeof lain === 'string' ? lain : atr(lain || {});
    var vb = /viewBox=/.test(tambah) ? '' : ' viewBox="0 0 ' + w + ' ' + h + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg"' + vb + ' width="' + w + '" height="' + h + '"' + tambah + '>' + isi + '</svg>';
  }

  /* Anggota tubuh bergaris: dua lapis garis (luar Tinta, dalam warna bulu). Semua lapis luar dulu supaya sambungan bersih. */
  function tungkai(daftar, lebar, warna) {
    var luar = '', dalam = '';
    daftar.forEach(function (d) {
      luar += jalur(d, 'none', lebar + 7);
      dalam += jalur(d, 'none', lebar, { stroke: warna });
    });
    return luar + dalam;
  }

  /* Jalur berbulu: elips dengan tepi bergelombang lembut (jumbai ekor, ekor tupai). */
  function dBerbulu(cx, cy, rx, ry, n, rot) {
    var d = '', i, a, am, x, y, kx, ky, c = Math.cos((rot || 0) * Math.PI / 180), s = Math.sin((rot || 0) * Math.PI / 180);
    function putar(px, py) { return [cx + px * c - py * s, cy + px * s + py * c]; }
    for (i = 0; i <= n; i++) {
      a = (i / n) * Math.PI * 2;
      var p = putar(rx * Math.cos(a), ry * Math.sin(a));
      if (i === 0) d = 'M' + f(p[0]) + ',' + f(p[1]);
      else {
        am = ((i - 0.5) / n) * Math.PI * 2;
        var q = putar(rx * 1.3 * Math.cos(am), ry * 1.3 * Math.sin(am));
        d += ' Q' + f(q[0]) + ',' + f(q[1]) + ' ' + f(p[0]) + ',' + f(p[1]);
      }
    }
    return d + 'Z';
  }
  /* Beberapa bentuk digabung menjadi satu siluet bergaris: garis tebal semua bentuk dulu, lalu isinya. */
  function siluet(daftarD, isi, tebal) {
    var luar = '', dalam = '';
    daftarD.forEach(function (d) { luar += jalur(d, isi, (tebal || 4) * 2); dalam += jalur(d, isi, 0); });
    return luar + dalam;
  }

  /* Kilau bintang empat sudut. */
  function kilau(x, y, r, warna, tebal) {
    var k = r * 0.24;
    var d = 'M' + f(x) + ',' + f(y - r) + ' Q' + f(x + k) + ',' + f(y - k) + ' ' + f(x + r) + ',' + f(y) +
      ' Q' + f(x + k) + ',' + f(y + k) + ' ' + f(x) + ',' + f(y + r) + ' Q' + f(x - k) + ',' + f(y + k) + ' ' + f(x - r) + ',' + f(y) +
      ' Q' + f(x - k) + ',' + f(y - k) + ' ' + f(x) + ',' + f(y - r) + 'Z';
    return jalur(d, warna || P.kunang, tebal === undefined ? Math.max(1.6, r * 0.16) : tebal);
  }
  function bayangan(rx) { return elips(0, 0, rx, rx * 0.16, P.tinta, 0, { opacity: 0.2 }); }

  /* ---------------- TASI (tarsius) ---------------- */
  var EKSPRESI_TASI = {
    senang: { pupil: [0, -1], r: 20, pr: 10, mulut: 'senyum', lengan: 'turun', telinga: 0, miring: 0 },
    kaget: { pupil: [0, 0], r: 22, pr: 7, mulut: 'o', lengan: 'dada', telinga: 12, miring: 0 },
    berpikir: { pupil: [6, -7], r: 20, pr: 9.5, mulut: 'miring', lengan: 'dagu', telinga: -4, miring: -12 },
    semangat: { pupil: [3, -1], r: 20, pr: 10, mulut: 'buka', lengan: 'tunjuk', telinga: 4, miring: 7 },
    sorak: { pupil: null, r: 20, pr: 10, mulut: 'lebar', lengan: 'atas', telinga: 10, miring: 0, kilau: true },
    intai: { pupil: [8, 5], r: 21, pr: 12, mulut: 'rapat', lengan: 'siap', telinga: -14, miring: 10, ekorTegak: true }
  };

  function mataTasi(cx, cy, r, pupil, pr) {
    if (!pupil) return jalur('M' + f(cx - r * 0.62) + ',' + f(cy + 3) + ' Q' + f(cx) + ',' + f(cy - r * 0.8) + ' ' + f(cx + r * 0.62) + ',' + f(cy + 3), 'none', 4.2);
    var px = cx + pupil[0], py = cy + pupil[1];
    return g(bulat(cx, cy, r, P.tIrisTepi, 3.6) + bulat(cx, cy, r - 3.8, P.tIris, 0) + bulat(px, py, pr, P.tPupil, 0) +
      bulat(px - pr * 0.36, py - pr * 0.4, Math.max(2.4, pr * 0.42), '#fff', 0) + bulat(px + pr * 0.42, py + pr * 0.36, Math.max(1.2, pr * 0.18), '#fff', 0),
      { 'class': 'mata' });
  }

  function mulutTasi(jenis) {
    switch (jenis) {
      case 'o': return elips(0, -95, 4.6, 6.2, P.mulut, 2.6);
      case 'miring': return jalur('M-5,-96 Q1,-93 8,-98', 'none', 2.8);
      case 'buka': return jalur('M-9,-99 Q0,-86 9,-99 Z', P.mulut, 2.6) + elips(0, -93.5, 4, 2.4, P.lidah, 0);
      case 'lebar': return jalur('M-12,-100 Q0,-82 12,-100 Z', P.mulut, 2.8) + elips(0, -91.5, 6, 3.4, P.lidah, 0);
      case 'rapat': return jalur('M-5,-97 Q0,-95.5 5,-97', 'none', 2.8);
      default: return jalur('M-8,-99 Q-4,-94.5 0,-98.5 Q4,-94.5 8,-99', 'none', 2.6);
    }
  }

  /* Tangan tarsius: telapak kecil, jari panjang, ujung jari berbantalan bulat merah muda. */
  function tanganTasi(x, y, gaya, sx) {
    var jari;
    if (gaya === 'genggam') jari = [[-5, 7], [0, 8.5], [5, 7]];
    else if (gaya === 'atas') jari = [[-5, -8], [0, -9.5], [5, -8]];
    else if (gaya === 'buka') jari = [[-10, -5], [-5, -11], [2, -12], [9, -7]];
    else if (gaya === 'samping') jari = [[9, -11], [14, -4], [14, 4], [9, 11]];
    else if (gaya === 'dagu') jari = [[-3, -10], [5, 3], [8, 0]];
    else jari = [[-8, 3], [-3, 5], [3, 5], [8, 3]];
    var d = jari.map(function (j) { return 'M' + f(x) + ',' + f(y) + ' L' + f(x + j[0] * sx) + ',' + f(y + j[1]); });
    var bantal = jari.map(function (j) { return bulat(x + j[0] * sx, y + j[1], 2.7, P.tJari, 1.8); }).join('');
    return tungkai(d, 3.2, P.tBulu) + bulat(x, y, 5.6, P.tBulu, 3.2) + bantal;
  }

  function kakiTasi(sx) {
    var x = 27 * sx, d = [], bantal = '';
    [[-24, 5], [-19, 9], [-11, 10]].forEach(function (j) {
      d.push('M' + f(x - 6 * sx) + ',-4 L' + f(x + j[0] * -sx) + ',' + j[1]);
      bantal += bulat(x + j[0] * -sx, j[1], 3, P.tJari, 1.8);
    });
    return tungkai(d, 3.4, P.tBulu) + elips(x, -5, 15, 6.5, P.tBulu, 3.5) + bantal;
  }

  function tasi(o) {
    o = o || {};
    var c = EKSPRESI_TASI[o.ekspresi] || EKSPRESI_TASI.senang;
    if (o.ekspresi === 'lompat') return tasiLompat(o);
    var s = '';
    if (o.bayangan !== false) s += bayangan(46);

    // ekor dengan jumbai
    var ekor = c.ekorTegak ? 'M24,-14 C58,-10 74,-52 66,-96' : 'M26,-14 C64,-4 92,-24 84,-66';
    var jb = c.ekorTegak ? [66, -106, 8.5, 15, 8] : [84, -78, 9, 16, 4];
    s += tungkai([ekor], 5.5, P.tBulu);
    s += siluet([dBerbulu(jb[0], jb[1], jb[2], jb[3], 9, jb[4])], P.tBulu, 3.6);

    // badan, perut, paha, kaki
    s += jalur('M-27,-86 C-46,-70 -52,-30 -40,-7 Q0,4 40,-7 C52,-30 46,-70 27,-86 Z', P.tBulu, 4);
    s += jalur('M-38,-50 C-42,-34 -40,-18 -32,-8 L-24,-10 C-30,-24 -31,-38 -28,-52 Z', P.tBuluGelap, 0, { opacity: 0.55 });
    s += elips(0, -42, 23, 30, P.tPerut, 0);
    s += elips(-31, -25, 18, 23, P.tBulu, 4, { transform: 'rotate(20 -31 -25)' }) + elips(31, -25, 18, 23, P.tBulu, 4, { transform: 'rotate(-20 31 -25)' });
    s += jalur('M-38,-36 Q-30,-40 -24,-34 M38,-36 Q30,-40 24,-34', 'none', 0, { stroke: P.tBuluGelap, 'stroke-width': 3, 'stroke-linecap': 'round' });
    s += kakiTasi(-1) + kakiTasi(1);

    // telinga (di belakang kepala)
    var aKiri = -40 + c.telinga, aKanan = 40 - c.telinga;
    function telinga(bx, a) {
      return g(elips(bx, -182, 23, 32, P.tBulu, 4) + elips(bx, -180, 15, 23, P.tTelinga, 0) +
        jalur('M' + (bx - 7) + ',-170 Q' + bx + ',-176 ' + (bx + 6) + ',-168', 'none', 0, { stroke: '#E58E7E', 'stroke-width': 2 }),
        { transform: 'rotate(' + a + ' ' + bx + ' -150)' });
    }
    var kepala = telinga(-34, aKiri) + telinga(34, aKanan);

    // lengan
    var LENGAN = {
      turun: [['M-22,-78 Q-43,-60 -36,-45 Q-30,-33 -16,-27', 'M22,-78 Q43,-60 36,-45 Q30,-33 16,-27'], [[-15, -27, 'genggam', -1], [15, -27, 'genggam', 1]]],
      dada: [['M-22,-78 C-38,-66 -30,-50 -13,-54', 'M22,-78 C38,-66 30,-50 13,-54'], [[-13, -55, 'atas', -1], [13, -55, 'atas', 1]]],
      dagu: [['M-22,-78 C-33,-58 -30,-32 -17,-18', 'M22,-78 C42,-62 38,-80 20,-89'], [[-17, -18, 'genggam', -1], [18, -90, 'dagu', -1]]],
      tunjuk: [['M-22,-78 C-33,-58 -30,-32 -17,-18', 'M22,-78 C40,-76 56,-78 70,-86'], [[-17, -18, 'genggam', -1], [72, -87, 'samping', 1]]],
      atas: [['M-22,-82 C-46,-96 -62,-126 -70,-158', 'M22,-82 C46,-96 62,-126 70,-158'], [[-71, -163, 'buka', -1], [71, -163, 'buka', 1]]],
      siap: [['M-22,-72 C-30,-52 -33,-28 -31,-10', 'M22,-72 C30,-52 33,-28 31,-10'], [[-31, -8, 'datar', -1], [31, -8, 'datar', 1]]]
    }[c.lengan];
    var lengan = tungkai(LENGAN[0], 7.5, P.tBulu) + LENGAN[1].map(function (t) { return tanganTasi(t[0], t[1], t[2], t[3]); }).join('');
    if (c.lengan === 'atas') { s += g(kepala, { transform: 'rotate(' + c.miring + ' 0 -88)' }) + lengan; kepala = ''; }

    // jambul kecil berbentuk kilat, kepala, muka
    kepala += jalur('M-8,-170 C-9,-178 -6,-185 -2,-190 C-2,-184 0,-181 3,-181 C3,-187 6,-192 10,-195 C9,-186 8,-177 5,-170 Z', P.tBulu, 3.4);
    kepala += elips(0, -128, 56, 47, P.tBulu, 4);
    kepala += elips(0, -101, 27, 16, P.tMuka, 0);
    kepala += mataTasi(-24, -131, c.r, c.pupil, c.pr) + mataTasi(24, -131, c.r, c.pupil, c.pr);
    kepala += jalur('M-4.5,-108 Q0,-110 4.5,-108 Q3.5,-103.5 0,-102.5 Q-3.5,-103.5 -4.5,-108 Z', P.tHidung, 2);
    kepala += mulutTasi(c.mulut);
    if (o.pipi || c.mulut === 'lebar') kepala += elips(-36, -104, 7, 4, P.pipi, 0, { opacity: 0.55 }) + elips(36, -104, 7, 4, P.pipi, 0, { opacity: 0.55 });
    s += g(kepala, { transform: 'rotate(' + c.miring + ' 0 -88)', 'class': 'kepala' });
    if (c.lengan !== 'atas') s += lengan;

    if (c.kilau) s += kilau(-74, -168, 9) + kilau(76, -176, 8) + kilau(-66, -92, 6) + kilau(70, -100, 6.5);
    return g(s, { 'class': 'tokoh tasi' });
  }

  /* Tasi melompat, tampak samping menghadap kanan; titik asal di tengah badan. */
  function tasiLompat(o) {
    var s = '';
    s += tungkai(['M-34,6 C-66,16 -100,6 -124,-8'], 5.5, P.tBulu);
    s += siluet([dBerbulu(-134, -12, 17, 10, 9, -16)], P.tBulu, 3.6);
    // kaki belakang terentang ke belakang
    s += tungkai(['M-26,12 C-44,24 -62,28 -80,26', 'M-16,18 C-30,32 -48,38 -66,40'], 7.5, P.tBulu);
    s += tanganTasi(-82, 26, 'datar', -1) + tanganTasi(-68, 40, 'datar', -1);
    s += elips(-22, 12, 23, 15, P.tBulu, 4, { transform: 'rotate(22 -22 12)' });
    // badan memanjang
    s += elips(2, 2, 42, 26, P.tBulu, 4, { transform: 'rotate(-10 2 2)' });
    s += elips(8, 12, 27, 11, P.tPerut, 0, { transform: 'rotate(-10 8 12)' });
    // lengan menjangkau ke depan
    s += tungkai(['M26,-4 C50,-12 70,-18 92,-24', 'M20,8 C44,6 62,2 84,-2'], 7, P.tBulu);
    s += tanganTasi(95, -25, 'samping', 1) + tanganTasi(87, -3, 'samping', 1);
    // telinga terlipat ke belakang, jambul, kepala besar, mata besar
    s += g(elips(30, -68, 21, 30, P.tBulu, 4) + elips(30, -66, 14, 22, P.tTelinga, 0), { transform: 'rotate(-62 34 -44)' });
    s += jalur('M30,-72 C28,-80 31,-87 36,-91 C36,-85 38,-83 41,-83 C42,-89 46,-93 51,-95 C48,-86 46,-78 43,-71 Z', P.tBulu, 3.2);
    s += elips(46, -38, 38, 34, P.tBulu, 4);
    s += elips(68, -24, 16, 12, P.tMuka, 0);
    s += mataTasi(56, -44, 21, [6, -1], 11);
    s += jalur('M80,-30 Q83,-31.5 85,-28.5 Q83,-25.5 80,-26 Z', P.tHidung, 1.8);
    s += jalur('M68,-17 Q75,-11 82,-18', 'none', 2.6);
    s += elips(36, -22, 7, 4, P.pipi, 0, { opacity: 0.5 });
    return g(s, { 'class': 'tokoh tasi lompat' });
  }

  /* ---------------- ULIN (kukang) ---------------- */
  function mataUlin(cx, cy, jenis) {
    if (jenis === 'tutup') return jalur('M' + (cx - 8) + ',' + (cy - 1) + ' Q' + cx + ',' + (cy + 5) + ' ' + (cx + 8) + ',' + (cy - 1), 'none', 3.2);
    if (jenis === 'senang') return jalur('M' + (cx - 8) + ',' + (cy + 3) + ' Q' + cx + ',' + (cy - 7) + ' ' + (cx + 8) + ',' + (cy + 3), 'none', 3.4);
    var dy = jenis === 'bawah' ? 3 : 0;
    return g(bulat(cx, cy, 9.5, '#fff', 2.4) + bulat(cx, cy + dy, 7.4, P.uIris, 0) + bulat(cx, cy + dy, 4.4, P.tPupil, 0) +
      bulat(cx - 2.6, cy + dy - 2.8, 2.4, '#fff', 0), { 'class': 'mata' });
  }

  function ulin(o) {
    o = o || {};
    var e = o.ekspresi || 'baca', s = '';
    if (o.bayangan !== false) s += bayangan(54);
    s += elips(-9, -50, 57, 49, P.uPunggung, 4);
    s += elips(3, -48, 54, 47, P.uBulu, 4);
    s += elips(7, -38, 34, 31, P.uMoncong, 0);
    s += elips(-28, -6, 16, 9, P.uKaki, 4) + elips(36, -6, 16, 9, P.uKaki, 4);
    if (e !== 'menguap') s += elips(-38, -66, 12, 21, P.uBulu, 4, { transform: 'rotate(24 -38 -66)' }) + elips(44, -66, 12, 21, P.uBulu, 4, { transform: 'rotate(-24 44 -66)' });

    // kepala
    var k = '';
    k += bulat(-37, -138, 11.5, P.uBulu, 4) + bulat(-37, -138, 6, P.uTelinga, 0) + bulat(43, -138, 11.5, P.uBulu, 4) + bulat(43, -138, 6, P.uTelinga, 0);
    k += elips(3, -108, 50, 41, P.uBulu, 4);
    k += jalur('M-5,-148 C-4,-136 -1,-127 3,-121 C7,-127 10,-136 11,-148 Q3,-150 -5,-148 Z', P.uBercak, 0);
    k += jalur('M-3,-104 C-4,-121 -16,-134 -31,-132 C-41,-122 -39,-104 -27,-96 C-17,-92 -6,-95 -3,-104 Z', P.uBercak, 0);
    k += jalur('M9,-104 C10,-121 22,-134 37,-132 C47,-122 45,-104 33,-96 C23,-92 12,-95 9,-104 Z', P.uBercak, 0);
    k += elips(3, -113, 5, 12, P.uMoncong, 0);
    k += elips(3, -93, 15, 10, P.uMoncong, 0);
    var jm = e === 'baca' ? 'bawah' : (e === 'menguap' ? 'tutup' : 'senang');
    k += mataUlin(-17, -111, jm) + mataUlin(23, -111, jm);
    // kacamata baca bulat
    k += bulat(-17, -111, 14.5, '#fff', 2.8, { 'fill-opacity': 0.16 }) + bulat(23, -111, 14.5, '#fff', 2.8, { 'fill-opacity': 0.16 });
    k += jalur('M-2.5,-113 Q3,-117 8.5,-113 M-31.5,-114 L-45,-119 M37.5,-114 L51,-119', 'none', 2.8);
    k += jalur('M-1,-101 Q3,-103 7,-101 Q6,-97 3,-96.5 Q0,-97 -1,-101 Z', '#7A4A3A', 1.8);
    if (e === 'menguap') k += elips(1, -86, 7.5, 9.5, P.mulut, 2.6) + elips(1, -81, 4.5, 2.8, P.lidah, 0);
    else if (e === 'senang') k += jalur('M-5,-91 Q3,-81 11,-91 Z', P.mulut, 2.4) + elips(-28, -96, 6, 3.5, P.pipi, 0, { opacity: 0.5 }) + elips(34, -96, 6, 3.5, P.pipi, 0, { opacity: 0.5 });
    else k += jalur('M-2,-90 Q3,-86 8,-90', 'none', 2.4);
    s += g(k, { 'class': 'kepala' });

    if (e === 'baca') {
      // buku hijau terbuka, sampulnya menghadap kita
      s += jalur('M-30,-84 L3,-77 L37,-86 L37,-90 L3,-82 L-30,-89 Z', P.kertas, 2.6);
      s += jalur('M-31,-83 L3,-75 L3,-34 L-31,-42 Z', P.buku, 3.4) + jalur('M3,-75 L38,-85 L38,-44 L3,-34 Z', P.buku, 3.4);
      s += jalur('M-25,-77 L-2,-71 L-2,-42 L-25,-48 Z M8,-71 L32,-78 L32,-49 L8,-42 Z', 'none', 0, { stroke: P.bukuTepi, 'stroke-width': 2 });
      s += jalur('M3,-75 L3,-34', 'none', 0, { stroke: P.bukuGelap, 'stroke-width': 3 });
      s += elips(-31, -60, 8, 10, P.uTangan, 3.4) + elips(38, -63, 8, 10, P.uTangan, 3.4);
    } else if (e === 'menguap') {
      s += elips(-34, -62, 12, 20, P.uBulu, 4, { transform: 'rotate(30 -34 -62)' });
      s += elips(-18, -36, 9, 8, P.uTangan, 3.4);
      s += elips(36, -72, 12, 22, P.uBulu, 4, { transform: 'rotate(-40 36 -72)' });
      s += elips(14, -86, 9.5, 8.5, P.uTangan, 3.4);
      s += jalur('M58,-116 q6,-4 10,0 M60,-104 q7,-3 11,1', 'none', 2.6);
    } else {
      s += g(kotak(-18, -88, 42, 52, 4, P.buku, 3.4) + kotak(-18, -88, 8, 52, 2, P.bukuGelap, 0) +
        kotak(-6, -80, 24, 14, 3, 'none', 0, { stroke: P.bukuTepi, 'stroke-width': 2 }), { transform: 'rotate(-8 3 -62)' });
      s += elips(-22, -58, 8.5, 10, P.uTangan, 3.4) + elips(30, -64, 8.5, 10, P.uTangan, 3.4);
    }
    return g(s, { 'class': 'tokoh ulin' });
  }

  /* ---------------- TUPI (tupai) ---------------- */
  var EKSPRESI_TUPI = {
    semangat: { miring: 6, mata: 'biasa', mulut: 'lebar' },
    tergelincir: { miring: -24, mata: 'kaget', mulut: 'o' },
    malu: { miring: 0, mata: 'senang', mulut: 'malu' },
    sorak: { miring: 0, mata: 'senang', mulut: 'lebar', kilau: true }
  };

  function tupi(o) {
    o = o || {};
    var e = EKSPRESI_TUPI[o.ekspresi] ? o.ekspresi : 'semangat', c = EKSPRESI_TUPI[e], s = '', b = '';
    if (o.bayangan !== false) s += bayangan(40);
    // ekor besar berbulu di belakang
    var ekor = e === 'tergelincir'
      ? [dBerbulu(-30, -30, 18, 24, 8, 30), dBerbulu(-52, -62, 21, 25, 8, 10), dBerbulu(-50, -100, 20, 19, 7, 0)]
      : [dBerbulu(-24, -36, 18, 24, 8, 25), dBerbulu(-40, -72, 21, 26, 8, 5), dBerbulu(-30, -110, 21, 20, 7, -20), dBerbulu(-10, -128, 14, 12, 6, 0)];
    b += siluet(ekor, P.pBulu, 4);
    b += jalur(e === 'tergelincir' ? 'M-30,-34 C-46,-54 -56,-80 -48,-104' : 'M-22,-40 C-36,-62 -42,-90 -28,-114 C-20,-124 -10,-128 -2,-128', 'none', 0, { stroke: P.pBuluTerang, 'stroke-width': 6 });
    // kaki dan badan
    b += elips(-8, -4, 13, 6, P.pBulu, 3.5) + elips(18, -4, 13, 6, P.pBulu, 3.5);
    b += elips(4, -48, 28, 40, P.pBulu, 4);
    b += elips(13, -46, 16, 31, P.pOranye, 0);
    b += jalur('M-15,-76 C-23,-56 -22,-33 -13,-17', 'none', 0, { stroke: P.pKrem, 'stroke-width': 5, 'stroke-linecap': 'round' });
    b += jalur('M-8,-78 C-15,-58 -14,-35 -6,-19', 'none', 0, { stroke: P.pGaris, 'stroke-width': 3.6, 'stroke-linecap': 'round' });

    // lengan per ekspresi
    var L = {
      semangat: [['M-4,-74 C-12,-64 -8,-54 2,-54', 'M20,-74 C34,-72 40,-82 42,-92'], [[3, -54], [43, -94]]],
      tergelincir: [['M-6,-76 C-22,-84 -32,-100 -38,-114', 'M22,-74 C40,-84 52,-96 58,-110'], [[-39, -117], [59, -113]]],
      malu: [['M-4,-72 C-10,-58 -6,-46 4,-42', 'M22,-76 C42,-92 36,-124 22,-128'], [[5, -42], [20, -130]]],
      sorak: [['M-6,-76 C-18,-84 -22,-98 -18,-110', 'M22,-74 C36,-84 40,-98 38,-112'], [[-18, -113], [38, -115]]]
    }[e];
    var lengan = tungkai(L[0], 7, P.pBulu) + L[1].map(function (p) { return bulat(p[0], p[1], 6.6, P.pBulu, 3.4); }).join('');
    if (e === 'malu') b += lengan;

    // kepala
    var k = '';
    k += g(elips(-6, -130, 8, 12.5, P.pBulu, 3.6) + elips(-6, -129, 4, 7.5, P.pTelinga, 0), { transform: 'rotate(-18 -6 -130)' });
    k += g(elips(22, -133, 8.5, 12.5, P.pBulu, 3.6) + elips(22, -132, 4.4, 7.5, P.pTelinga, 0), { transform: 'rotate(14 22 -133)' });
    k += elips(8, -106, 30, 27, P.pBulu, 4);
    k += elips(18, -98, 21, 17, P.pOranye, 0);
    k += jalur('M-8,-114 C0,-123 14,-124 26,-119', 'none', 0, { stroke: P.pKrem, 'stroke-width': 4.2, 'stroke-linecap': 'round' });
    k += jalur('M-6,-120 C2,-128 12,-129 22,-126', 'none', 0, { stroke: P.pGaris, 'stroke-width': 3, 'stroke-linecap': 'round' });
    if (c.mata === 'senang') {
      k += jalur('M17,-106 Q23,-114 29,-106 M-3,-106 Q2,-112 7,-106', 'none', 3.4);
    } else if (c.mata === 'kaget') {
      k += bulat(24, -109, 8.5, '#fff', 2.6) + bulat(25, -108, 4, P.tinta, 0) + bulat(3, -109, 7.5, '#fff', 2.6) + bulat(4, -108, 3.6, P.tinta, 0);
    } else {
      k += g(bulat(24, -108, 7.6, P.tinta, 0) + bulat(21.6, -110.6, 2.8, '#fff', 0) + bulat(26, -105.5, 1.2, '#fff', 0), { 'class': 'mata' });
      k += g(bulat(3, -108, 6.6, P.tinta, 0) + bulat(1, -110.4, 2.4, '#fff', 0), { 'class': 'mata' });
    }
    k += bulat(37.5, -100.5, 3.8, P.tinta, 0);
    if (c.mulut === 'lebar') k += jalur('M18,-94 Q28,-79 39,-95 Z', P.mulut, 2.6) + kotak(26, -95.5, 4.6, 5.4, 1, '#fff', 1.8) + kotak(30.6, -95.5, 4.6, 5.4, 1, '#fff', 1.8);
    else if (c.mulut === 'o') k += elips(29, -89, 5.5, 6.5, P.mulut, 2.6) + kotak(26.6, -95.8, 4.2, 4.8, 1, '#fff', 1.6) + kotak(30.8, -95.8, 4.2, 4.8, 1, '#fff', 1.6);
    else k += jalur('M21,-94 Q28,-89 35,-95', 'none', 2.6) + kotak(27, -94.6, 4, 4, 1, '#fff', 1.6);
    if (e === 'malu' || e === 'sorak') k += elips(12, -96, 5.5, 3.2, P.pipi, 0, { opacity: 0.6 });
    b += g(k, { 'class': 'kepala' });
    if (e !== 'malu') b += lengan;

    if (e === 'tergelincir') {
      b = g(b, { transform: 'rotate(-22 0 -10)' });
      b += jalur('M-58,-140 l4,14 M-46,-150 l2,15 M-34,-154 l0,14', 'none', 0, { stroke: P.kunang, 'stroke-width': 5, 'stroke-linecap': 'round' });
      b += jalur('M64,-60 q8,6 6,16 M72,-74 q10,8 8,20', 'none', 2.6);
    } else if (c.miring) b = g(b, { transform: 'rotate(' + c.miring + ' 0 0)' });
    s += b;
    if (c.kilau) s += kilau(-52, -136, 8) + kilau(56, -132, 9) + kilau(62, -96, 6);
    return g(s, { 'class': 'tokoh tupi' });
  }

  /* ---------------- BENDA DAN UI ---------------- */
  /* Daun penutup: daun lonjong dengan urat, diputar dan diwarnai acak-tetap (benih) supaya tangkapan stabil. */
  function acak(benih) { var x = benih || 1; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
  var WARNA_DAUN = ['#3E9A4A', '#5DB548', '#2F7D4E', '#7CC24E', '#4FA845'];
  function daun(x, y, p, l, rot, warna, tebal) {
    var d = 'M' + f(-p / 2) + ',0 C' + f(-p / 4) + ',' + f(-l / 1.6) + ' ' + f(p / 4) + ',' + f(-l / 1.6) + ' ' + f(p / 2) + ',0 C' + f(p / 4) + ',' + f(l / 1.6) + ' ' + f(-p / 4) + ',' + f(l / 1.6) + ' ' + f(-p / 2) + ',0 Z';
    var urat = 'M' + f(-p / 2 + 5) + ',0 Q0,' + f(-l * 0.08) + ' ' + f(p / 2 - 6) + ',0 M' + f(-p * 0.12) + ',' + f(-l * 0.05) + ' l' + f(p * 0.12) + ',' + f(-l * 0.26) +
      ' M' + f(p * 0.12) + ',' + f(-l * 0.04) + ' l' + f(p * 0.1) + ',' + f(l * 0.24);
    return g(jalur(d, warna, tebal || 2.6) + jalur(urat, 'none', 0, { stroke: P.urat, 'stroke-width': 1.8, 'stroke-linecap': 'round', opacity: 0.75 }),
      { transform: 'translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot) + ')' });
  }
  /* Menutup daftar kotak baris (koordinat panggung) dengan tikar daun + daun bertumpuk. */
  function tutupDaun(kotakBaris, benih, opsi) {
    opsi = opsi || {};
    var r = acak(benih), s = '';
    kotakBaris.forEach(function (k) {
      s += kotak(k.x + 2, k.y + 3, k.w - 2, k.h - 6, 12, opsi.tikar || '#2F7D4E', 2.6);
    });
    kotakBaris.forEach(function (k) {
      // ukuran daun mengikuti tinggi baris (24 px di laptop, 32 px di HP); daun tidak keluar dari kotak baris
      var u = k.h / 36, n = Math.max(1, Math.round(k.w / (34 * u))), i, ruang = Math.max(0, k.w - 46 * u);
      for (i = 0; i < n; i++) {
        var x = k.x + 23 * u + (n > 1 ? i * ruang / (n - 1) : ruang / 2) + (r() - 0.5) * 6, y = k.y + k.h / 2 + (r() - 0.5) * 5 * u;
        s += daun(x, y, (44 + r() * 8) * u, (24 + r() * 7) * u, (r() - 0.5) * 30 + (i % 2 ? 7 : -7), WARNA_DAUN[Math.floor(r() * WARNA_DAUN.length)]);
      }
    });
    return s;
  }
  /* Daun beterbangan (segmen yang baru dibuka). */
  function daunTerbang(x, y, n, benih) {
    var r = acak(benih), s = '', i;
    for (i = 0; i < n; i++) {
      var a = -Math.PI * (0.04 + 0.42 * r()), jarak = 24 + r() * 46;
      s += daun(x + (i / Math.max(1, n - 1) - 0.5) * 220 + Math.cos(a) * jarak, y + Math.sin(a) * jarak, 32 + r() * 10, 17 + r() * 5, r() * 360, WARNA_DAUN[i % WARNA_DAUN.length], 2.2);
    }
    return s;
  }

  /* Toples kaca berisi kunang-kunang (HUD). */
  function toples(n) {
    var s = '', r = acak(7), i;
    s += kotak(10, 4, 30, 9, 3, P.dahan, 2.6);
    s += jalur('M8,14 Q8,11 12,11 L38,11 Q42,11 42,14 L44,40 Q44,48 36,48 L14,48 Q6,48 6,40 Z', '#CFEFF0', 2.8, { 'fill-opacity': 0.55 });
    for (i = 0; i < (n || 7); i++) {
      var x = 13 + r() * 24, y = 20 + r() * 22;
      s += bulat(x, y, 4.6, P.kunang, 0, { opacity: 0.45 }) + bulat(x, y, 2.2, '#FFF6B8', 0);
    }
    s += jalur('M13,18 L13,38', 'none', 0, { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 });
    return s;
  }

  /* Kunang-kunang kecil berpendar (ambien). */
  function kunang(x, y, r) {
    return bulat(x, y, r * 2.6, P.kunang, 0, { opacity: 0.22 }) + bulat(x, y, r * 1.4, P.kunang, 0, { opacity: 0.5 }) + bulat(x, y, r * 0.8, '#FFFBD6', 0);
  }

  /* Gambar di teks bacaan: kunang-kunang di atas daun. */
  function gambarKunang(w, h) {
    var s = kotak(0, 0, w, h, 14, '#26365E', 0);
    s += kunang(w * 0.22, h * 0.3, 4) + kunang(w * 0.8, h * 0.22, 3) + kunang(w * 0.68, h * 0.7, 3.5);
    s += daun(w * 0.5, h * 0.74, w * 0.78, h * 0.36, -8, '#3E9A4A', 3);
    s += g(elips(0, 0, 18, 9, '#2A2A35', 2.4) + elips(-10, -10, 12, 7, '#DDE8F0', 2, { opacity: 0.85, transform: 'rotate(-20 -10 -10)' }) +
      elips(14, 1, 9, 8, P.kunang, 2.4) + bulat(14, 1, 18, P.kunang, 0, { opacity: 0.3 }) + bulat(-17, -2, 6, '#2A2A35', 2.2), { transform: 'translate(' + f(w * 0.48) + ' ' + f(h * 0.52) + ') rotate(-8)' });
    return s;
  }

  /* ---------------- IKON (viewBox 48) ---------------- */
  var T = 3.2;
  var IKON = {
    jeda: function () { return kotak(13, 11, 8, 26, 3, P.tinta, 0) + kotak(27, 11, 8, 26, 3, P.tinta, 0); },
    buku: function () { return jalur('M24,13 C18,9 10,9 5,11 L5,37 C10,35 18,35 24,39 C30,35 38,35 43,37 L43,11 C38,9 30,9 24,13 Z', P.kertas, T) + jalur('M24,13 L24,39', 'none', T) + jalur('M10,18 Q15,16 19,18 M10,24 Q15,22 19,24 M29,18 Q34,16 38,18', 'none', 2.2); },
    bantuan: function () { return bulat(24, 20, 12, P.kunang, T) + kotak(18, 31, 12, 8, 3, '#D9CDB4', T) + jalur('M20,42 L28,42', 'none', T) + jalur('M20,20 Q20,14 25,14', 'none', 2.6, { stroke: '#fff' }); },
    suara: function () { return jalur('M7,19 L15,19 L24,11 L24,37 L15,29 L7,29 Z', P.tinta, 2.4) + jalur('M30,18 Q35,24 30,30 M35,13 Q44,24 35,35', 'none', 3.4); },
    layarPenuh: function () { return jalur('M8,17 L8,8 L17,8 M31,8 L40,8 L40,17 M40,31 L40,40 L31,40 M17,40 L8,40 L8,31', 'none', 4); },
    gerigi: function () {
      var d = '', i, n = 8;
      for (i = 0; i < n * 2; i++) {
        var a = (i / (n * 2)) * Math.PI * 2, ra = i % 2 ? 13 : 18, b = a + Math.PI / (n * 2);
        d += (i ? ' L' : 'M') + f(24 + ra * Math.cos(a)) + ',' + f(24 + ra * Math.sin(a)) + ' L' + f(24 + ra * Math.cos(b)) + ',' + f(24 + ra * Math.sin(b));
      }
      return jalur(d + 'Z', P.kertas, 2.8) + bulat(24, 24, 6, '#fff', 2.8);
    },
    kiri: function () { return jalur('M29,10 L15,24 L29,38', 'none', 6); },
    kanan: function () { return jalur('M19,10 L33,24 L19,38', 'none', 6); },
    tutup: function () { return jalur('M13,13 L35,35 M35,13 L13,35', 'none', 6); },
    kunci: function () { return bulat(15, 24, 9, P.kunang, T) + bulat(15, 24, 3, P.tinta, 0) + jalur('M24,24 L42,24 M35,24 L35,31 M40,24 L40,29', 'none', 4); },
    bentuk: function () { return bulat(15, 16, 8, P.jingga, 2.6) + kotak(27, 8, 15, 15, 3, '#7FC3DE', 2.6) + jalur('M14,41 L22,27 L30,41 Z', P.kunang, 2.6) + jalur('M33,30 L42,30 L42,41 L33,41 Z', '#B9A9E8', 2.6); },
    sorot: function () { return kotak(4, 16, 40, 16, 8, P.sorot, 2.8) + kilau(34, 15, 7, P.kunang, 2) + jalur('M11,24 L26,24', 'none', 3.2); },
    pastikan: function () { return bulat(24, 24, 18, P.lumut, T) + jalur('M15,24 L21,30 L33,17', 'none', 0, { stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); },
    centang: function () { return jalur('M10,25 L20,35 L38,13', 'none', 0, { stroke: P.lumut, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); },
    jam: function () { return bulat(24, 24, 18, P.kertas, T) + jalur('M24,13 L24,24 L32,29', 'none', 3.6) + bulat(24, 24, 2.4, P.tinta, 0); },
    kalender: function () { return kotak(6, 10, 36, 32, 5, P.kertas, T) + jalur('M6,15 Q6,10 11,10 L37,10 Q42,10 42,15 L42,20 L6,20 Z', P.jingga, T) + jalur('M15,6 L15,13 M33,6 L33,13', 'none', 3.6) + bulat(16, 28, 2.5, P.tinta, 0) + bulat(24, 28, 2.5, P.tinta, 0) + bulat(32, 28, 2.5, P.tinta, 0) + bulat(16, 35, 2.5, P.tinta, 0) + bulat(24, 35, 2.5, P.tinta, 0); },
    angka: function () { return kotak(4, 10, 40, 28, 7, '#BFE3F0', T) + el('text', { x: 24, y: 32, 'text-anchor': 'middle', 'font-family': 'Baloo 2, sans-serif', 'font-weight': 800, 'font-size': 19, fill: P.tinta }, '123'); },
    harga: function () { return bulat(24, 24, 18, P.kunang, T) + bulat(24, 24, 13, 'none', 0, { stroke: '#C9A92E', 'stroke-width': 2 }) + el('text', { x: 24, y: 30, 'text-anchor': 'middle', 'font-family': 'Baloo 2, sans-serif', 'font-weight': 800, 'font-size': 16, fill: P.tinta }, 'Rp'); },
    nama: function () { return bulat(24, 16, 8, '#F1C9A5', T) + jalur('M9,41 Q9,26 24,26 Q39,26 39,41 Z', '#9C8BD6', T); },
    tempat: function () { return jalur('M24,44 C16,34 10,27 10,19 A14,14 0 0 1 38,19 C38,27 32,34 24,44 Z', P.jingga, T) + bulat(24, 19, 5.5, '#fff', 2.6); },
    lentera: function () { return jalur('M24,4 L24,10', 'none', 3) + jalur('M24,10 C34,16 36,30 24,44 C12,30 14,16 24,10 Z', P.kunang, T) + jalur('M24,14 L24,40 M24,24 L30,19 M24,30 L18,25', 'none', 0, { stroke: '#C9A92E', 'stroke-width': 2.2, 'stroke-linecap': 'round' }); },
    daun: function () { return daun(24, 24, 40, 20, -35, P.daun2, 3); },
    daunPudar: function () { return g(daun(24, 24, 40, 20, -35, '#CFC6B4', 3), { opacity: 0.6 }); },
    lompat: function () { return jalur('M8,38 Q20,4 38,28', 'none', 4) + jalur('M31,27 L39,30 L40,21', 'none', 4); },
    bintang: function () { return jalur('M24,5 L29,18 L43,18 L32,27 L36,41 L24,33 L12,41 L16,27 L5,18 L19,18 Z', P.kunang, T); },
    mata: function () { return jalur('M4,24 Q24,6 44,24 Q24,42 4,24 Z', '#fff', T) + bulat(24, 24, 8, P.telaga, 0) + bulat(24, 24, 4, P.tinta, 0) + bulat(21, 21, 2, '#fff', 0); },
    senyap: function () { return jalur('M7,19 L15,19 L24,11 L24,37 L15,29 L7,29 Z', P.tinta, 2.4) + jalur('M31,18 L43,30 M43,18 L31,30', 'none', 4); },
    dengar: function () { return jalur('M6,19 L13,19 L21,12 L21,36 L13,29 L6,29 Z', P.kunang, 2.6) + jalur('M27,18 Q32,24 27,30 M32,13 Q41,24 32,35', 'none', 3.4); },
    panah: function () { return jalur('M19,10 L33,24 L19,38', 'none', 6); },
    peta: function () { return jalur('M6,12 L17,8 L31,13 L42,9 L42,37 L31,41 L17,36 L6,40 Z', P.kertas, T) + jalur('M17,8 L17,36 M31,13 L31,41', 'none', 2.6) + jalur('M10,30 Q16,22 22,26 T36,18', 'none', 0, { stroke: P.jingga, 'stroke-width': 3, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }); },
    gembok: function () { return kotak(10, 22, 28, 20, 5, P.kunang, T) + jalur('M16,22 L16,15 A8,8 0 0 1 32,15 L32,22', 'none', 4) + bulat(24, 31, 3, P.tinta, 0); },
    ulangi: function () { return jalur('M36,16 A14,14 0 1 0 38,28', 'none', 4.4) + jalur('M30,14 L37,16 L37,8', 'none', 4.4); },
    bintangKosong: function () { return jalur('M24,5 L29,18 L43,18 L32,27 L36,41 L24,33 L12,41 L16,27 L5,18 L19,18 Z', '#EFE6D2', 2.6); },
    unduh: function () { return jalur('M24,7 L24,30 M14,21 L24,31 L34,21', 'none', 4.6) + jalur('M8,32 L8,40 L40,40 L40,32', 'none', 4.2); },
    bulan: function () { return bulat(24, 24, 17, '#FFF2B8', T) + bulat(18, 19, 4, '#EBD98A', 0) + bulat(29, 29, 3, '#EBD98A', 0) + bulat(30, 17, 2.2, '#EBD98A', 0); },
    /* status keterampilan, dibedakan oleh bentuk (bukan hanya warna): bintang, tunas, putar, lingkaran putus-putus */
    stDikuasai: function () { return bulat(24, 24, 21, '#FFF4C2', 2.6) + jalur('M24,9 L28,19 L39,19 L30,26 L33,37 L24,30 L15,37 L18,26 L9,19 L20,19 Z', P.kunang, 2.6); },
    stBerkembang: function () { return bulat(24, 24, 21, '#DDF0C8', 2.6) + jalur('M24,38 L24,22', 'none', 3.4) + daun(17, 21, 14, 8, -30, P.lumut, 2.4) + daun(31, 18, 16, 9, 35, P.lumut, 2.4) + jalur('M15,38 L33,38', 'none', 3.4); },
    stLatihan: function () { return bulat(24, 24, 21, '#FCE0C6', 2.6) + jalur('M34,18 A11,11 0 1 0 35,30', 'none', 3.8) + jalur('M29,16 L35,18 L35,11', 'none', 3.8); },
    stBelum: function () { return bulat(24, 24, 19, '#F3EEE2', 0, { stroke: '#A89C86', 'stroke-width': 3, 'stroke-dasharray': '6 5' }); }
  };
  function ikon(nama, uk) {
    var fn = IKON[nama];
    return '<svg viewBox="0 0 48 48" width="' + uk + '" height="' + uk + '" aria-hidden="true" focusable="false" data-ikon-svg="1">' + (fn ? fn() : '') + '</svg>';
  }

  /* Logo MATA KILAT: huruf I diganti petir. Posisi petir diukur dari glyph I sesudah font termuat (susunLogo). */
  function logo(x, y, uk) {
    uk = uk || 116;
    var teks = 'MATA K<tspan class="huruf-i">I</tspan>LAT';
    return g(
      el('text', { 'class': 'logo-teks logo-bayang', x: 0, y: 8, 'font-size': uk }, teks) +
      el('text', { 'class': 'logo-teks logo-garis', x: 0, y: 0, 'font-size': uk }, teks) +
      el('text', { 'class': 'logo-teks logo-isi', x: 0, y: 0, 'font-size': uk }, teks) +
      g('', { 'class': 'logo-petir' }),
      { transform: 'translate(' + x + ' ' + y + ')', 'class': 'logo', 'data-uk': uk });
  }
  function susunLogo(akar) {
    Array.prototype.forEach.call((akar || document).querySelectorAll('g.logo'), function (lg) {
      var t = lg.querySelector('.logo-isi'), uk = +lg.getAttribute('data-uk');
      var b = t.getExtentOfChar(6), cx = b.x + b.width / 2, atas = b.y + uk * 0.2, bawah = b.y + b.height - uk * 0.16, h = bawah - atas, w = uk * 0.36;
      var d = 'M' + f(cx + w * 0.18) + ',' + f(atas) + ' L' + f(cx - w * 0.5) + ',' + f(atas + h * 0.56) + ' L' + f(cx - w * 0.02) + ',' + f(atas + h * 0.56) +
        ' L' + f(cx - w * 0.22) + ',' + f(bawah) + ' L' + f(cx + w * 0.52) + ',' + f(atas + h * 0.38) + ' L' + f(cx + w * 0.04) + ',' + f(atas + h * 0.38) + ' L' + f(cx + w * 0.34) + ',' + f(atas) + ' Z';
      lg.querySelector('.logo-petir').innerHTML = g(jalur(d, P.tinta, 0, { transform: 'translate(0 8)', opacity: 0.35 })) +
        jalur(d, P.kunang, 9) + jalur(d, P.kunang, 0) + kilau(cx + w * 0.62, atas - 4, 11) + kilau(cx - w * 0.7, bawah - 6, 7);
    });
  }

  /* Menaruh tokoh: grup luar memegang posisi, grup dalam bernapas (animasi CSS tidak menimpa transform posisi). */
  function letak(isi, x, y, s, balik) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + (balik ? -s : s) + ' ' + s + ')"><g class="bernapas">' + isi + '</g></g>';
  }
  /* Balon ucapan: kotak membulat dengan ekor di bawah (ex = posisi ekor dari kiri). */
  function balon(w, h, ex) {
    var r = 22;
    var d = 'M' + r + ',0 H' + (w - r) + ' Q' + w + ',0 ' + w + ',' + r + ' V' + (h - r) + ' Q' + w + ',' + h + ' ' + (w - r) + ',' + h +
      ' H' + (ex + 16) + ' L' + (ex + 4) + ',' + (h + 26) + ' L' + (ex - 12) + ',' + h + ' H' + r + ' Q0,' + h + ' 0,' + (h - r) + ' V' + r + ' Q0,0 ' + r + ',0 Z';
    return jalur(d, P.tinta, 0, { transform: 'translate(0 6)', opacity: 0.28 }) + jalur(d, '#fff', 4);
  }
  function defs() {
    return '<defs><linearGradient id="gLogo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4A8"/><stop offset=".55" stop-color="#F5DF5C"/><stop offset="1" stop-color="#F0B43A"/></linearGradient></defs>';
  }

  /* ===== Gambar AI terdaftar (js/data/aset.js). Tanpa entri: null, dan pemanggil memakai SVG kode. ===== */
  function gambar(k) { var A = window.ASET && window.ASET.gambar; return (A && A[k]) || null; }
  function src(k) { var x = gambar(k); return x ? (typeof x === 'string' ? x : x.src) : null; }
  var _muat = {};
  function pramuat(daftar) {
    return Promise.all(daftar.map(function (k) {
      var s = src(k);
      if (!s) return Promise.resolve(false);
      if (_muat[s]) return _muat[s];
      return (_muat[s] = new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(true); }; im.onerror = function () { ok(false); }; im.src = s; }));
    }));
  }
  /* potret bundar Tasi (HUD HP, panel) */
  function potretTasi(uk, ekspresi) {
    return svg(uk, uk, bulat(80, 80, 76, '#E6E0F5', 0) + letak(tasi({ ekspresi: ekspresi || 'senang', bayangan: false }), 80, 172, 0.78), ' viewBox="0 0 160 160" aria-hidden="true"');
  }
  /* tangan SVG cadangan bila tangan kreator tidak terdaftar (ujung telunjuk di 0,0, menunjuk ke atas) */
  function tangan(dx) {
    return g(jalur('M-6,0 Q0,-4 6,0 L8,46 L22,40 Q32,38 34,48 L36,80 Q30,104 6,106 L-14,104 Q-30,96 -30,78 L-30,52 Q-30,44 -22,44 L-8,46 Z', '#F6D2B4', 4) +
      kotak(-26, 100, 62, 26, 8, P.kunang, 4), { transform: 'translate(' + (dx || 0) + ' 0)' });
  }
  /* batang muat: lentera daun mengisi cahaya, kunang terbang di depan (muat.js mengatur #muat-roket dan #muat-isi) */
  function lenteraMuat() {
    return kotak(20, 50, 480, 26, 13, '#3B3266', 3.5) + el('rect', { id: 'muat-isi', x: 20, y: 50, width: 0, height: 26, rx: 13, fill: P.kunang }) +
      kotak(20, 50, 480, 26, 13, 'none', 3.5) + g(kunang(0, 0, 6) + kilau(0, 0, 9), { id: 'muat-roket', transform: 'translate(30 62)' });
  }
  /* alias warna untuk komponen mesin studio (partikel, HUD) */
  var C = { tinta: P.tinta, kertas: P.kertas, bintang: P.kunang, mint: '#7CC24E', koral: P.jingga, langit: '#7FC3DE', ungu: P.ungu, lumut: P.lumut };

  return {
    letak: letak, defs: defs, balon: balon, gambar: gambar, src: src, pramuat: pramuat, potretTasi: potretTasi, tangan: tangan, lenteraMuat: lenteraMuat, C: C,
    P: P, svg: svg, g: g, el: el, jalur: jalur, elips: elips, bulat: bulat, kotak: kotak, kilau: kilau,
    tasi: tasi, ulin: ulin, tupi: tupi, daun: daun, tutupDaun: tutupDaun, daunTerbang: daunTerbang,
    toples: toples, kunang: kunang, gambarKunang: gambarKunang, ikon: ikon, logo: logo, susunLogo: susunLogo, acak: acak
  };
})();
