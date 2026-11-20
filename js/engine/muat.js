/* Layar muat: logo Mata Kilat, kunang-kunang yang terbang di batang lentera, dan satu "Tahukah kamu?" (brief 3c).
   Disalin dari Ding Dong Delivery (231; asal Lompat Waktu): tampil minimal MIN ms supaya sempat terbaca, kemajuan tidak pernah mundur. */
(function (root) {
  var MIN = U.TEST && !/[?&]muat=1/.test(location.search) ? 0 : 1800, el = null, t0 = 0, nilai = 0;
  var Muat = {
    buka: function () {
      t0 = performance.now(); nilai = 0;
      var tips = STR.muatTips;
      el = U.h('div', '',
        '<div class="muat-logo">' + Seni.svg(660, 170, Seni.defs() + Seni.logo(14, 128, 106), ' viewBox="0 0 660 170"') + '</div>' +
        '<div class="muat-jalan">' + Seni.svg(520, 110, Seni.lenteraMuat(), ' viewBox="0 0 520 110"') + '</div>' +
        '<div class="muat-teks"></div>' +
        '<div class="muat-tip"><b>' + UI.esc(STR.muatTahu) + '</b>' + UI.esc(tips[Math.floor(Math.random() * tips.length)]) + '</div>');
      el.id = 'muat';
      Stage.el.appendChild(el);
      Muat.atur(0);
    },
    /* k: 0 sampai 1; roket bergerak dari kiri ke kanan batang */
    atur: function (k) {
      if (!el) return;
      nilai = Math.max(nilai, k);
      var roket = el.querySelector('#muat-roket'), isi = el.querySelector('#muat-isi');
      if (roket) roket.setAttribute('transform', 'translate(' + Math.round(30 + 430 * nilai) + ' 62)');
      if (isi) isi.setAttribute('width', Math.round(480 * nilai));
      el.querySelector('.muat-teks').textContent = STR.muat + '... ' + Math.round(nilai * 100) + '%';
    },
    tunggu: function () { return new Promise(function (ok) { setTimeout(ok, Math.max(0, MIN - (performance.now() - t0))); }); },
    tutup: function () {
      if (!el) return;
      var e = el;
      el = null;
      if (!MIN) { e.remove(); return; }
      e.classList.add('tutup');
      setTimeout(function () { e.remove(); }, 420);
    }
  };
  root.Muat = Muat;
})(window);
