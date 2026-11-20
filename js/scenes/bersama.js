/* Bagian bersama layar: latar AI (cadangan gradasi bila tidak terdaftar), kunang ambien, balon ucapan Tasi
   (dibacakan bila diizinkan, dengan tombol dengar), dan daun depan. */
(function (root) {
  var Adegan = {
    latar: function (parent, kunci) {
      var s = Seni.src(kunci), el;
      if (s) { el = U.h('img', 'latar'); el.src = s; el.alt = ''; el.draggable = false; }
      else { el = U.h('div', 'latar'); el.style.background = 'linear-gradient(#5E4E93, #EE8A4A 60%, #2F7D4E 61%, #1F5A37)'; }
      parent.appendChild(el);
      return el;
    },
    /* kunang ambien SVG ringan (maksimal 16) di area tertentu */
    kunangAmbien: function (n, x, y, w, h, benih) {
      var r = Seni.acak(benih || 5), s = '';
      for (var i = 0; i < n; i++) s += Seni.g(Seni.kunang(x + r() * w, y + r() * h, 2.2 + r() * 2), { 'class': 'kunang-ambien' });
      return s;
    },
    lapisSvg: function (parent, isi, cls) {
      var d = U.h('div', 'lapis tembus ' + (cls || ''), Seni.svg(1280, 720, isi, ' aria-hidden="true"'));
      parent.appendChild(d);
      return d;
    },
    /* balon ucapan Tasi. kata(teks) menampilkan dan membacakan (tidak menunggu suara selesai kecuali diminta). */
    balon: function (parent) {
      var el = U.h('div', 'balon-tasi'), p = U.h('p', 'ucapan');
      p.setAttribute('aria-live', 'polite'); p.setAttribute('data-cek', 'balon Tasi');
      var teks = '', dengar = UI.tombolArahan(function () { return teks; });
      el.appendChild(p); el.appendChild(dengar);
      el.style.display = 'none';
      parent.appendChild(el);
      return {
        el: el,
        kata: function (t) {
          teks = t; p.textContent = t; el.style.display = '';
          dengar.segar(t);
          el.classList.remove('muncul'); void el.offsetWidth; if (!UI.kurangi) el.classList.add('muncul');
          return UI.bacakan(t);
        },
        teks: function () { return teks; },
        sembunyi: function () { el.style.display = 'none'; }
      };
    },
    /* daun besar di depan tokoh yang mengintip (gaya latar AI) */
    daunDepan: function (daftar) { return daftar.map(function (d) { return Seni.daun(d[0], d[1], d[2], d[3], d[4], d[5], 4); }).join(''); }
  };
  root.Adegan = Adegan;
})(window);
