/* Tokoh SVG di panggung (Tasi, Ulin, Tupi): ganti ekspresi, pindah, dan lompatan Tasi melengkung 450 ms dengan
   squash and stretch (brief 9e). Titik (x, y) adalah telapak kaki. Kurangi animasi: lompatan diganti pudar. */
(function (root) {
  /* kotak tampil tiap pose (satuan tokoh): [x, y, lebar, tinggi] */
  var VB = { tasi: [-104, -214, 208, 226], ulin: [-72, -160, 150, 172], tupi: [-84, -164, 168, 176], lompat: [-160, -112, 270, 168] };
  var ASAL_LOMPAT = 62;   // pusat badan pose lompat berada 62 satuan di atas telapak kaki pose duduk

  function Tokoh(parent, nama, o) {
    o = o || {};
    this.nama = nama; this.s = o.s || 1; this.x = o.x || 0; this.y = o.y || 0; this.balik = !!o.balik;
    this.el = U.h('div', 'tokoh tokoh-' + nama);
    this.el.setAttribute('aria-hidden', 'true');
    if (o.z != null) this.el.style.zIndex = o.z;
    parent.appendChild(this.el);
    this.atur(o.ekspresi);
  }
  Tokoh.prototype.render = function (pose, ekspresi) {
    var vb = VB[pose === 'lompat' ? 'lompat' : this.nama], s = this.s;
    var isi = pose === 'lompat' ? Seni.tasi({ ekspresi: 'lompat' }) : Seni[this.nama]({ ekspresi: ekspresi });
    this.el.innerHTML = Seni.svg(Math.round(vb[2] * s), Math.round(vb[3] * s), '<g class="bernapas">' + isi + '</g>', ' viewBox="' + vb.join(' ') + '"');
    this.vb = vb;
    this.el.style.width = Math.round(vb[2] * s) + 'px'; this.el.style.height = Math.round(vb[3] * s) + 'px';
    this.el.style.transformOrigin = Math.round(-vb[0] * s) + 'px ' + Math.round(-vb[1] * s) + 'px';
  };
  Tokoh.prototype.atur = function (ekspresi) {
    this.ekspresi = ekspresi || this.ekspresi;
    this.render('duduk', this.ekspresi);
    this.taruh(this.x, this.y);
    return this;
  };
  Tokoh.prototype.taruh = function (x, y, pose) {
    this.x = x; this.y = y;
    var vb = this.vb, s = this.s, dy = pose === 'lompat' ? -ASAL_LOMPAT * s : 0;
    this.el.style.left = Math.round(x + vb[0] * s) + 'px';
    this.el.style.top = Math.round(y + dy + vb[1] * s) + 'px';
    this.el.style.transform = this.balik ? 'scaleX(-1)' : '';
  };
  Tokoh.prototype.skala = function (s) { this.s = s; return this.atur(); };
  Tokoh.prototype.sembunyi = function (b) { this.el.style.visibility = b ? 'hidden' : ''; };
  /* lompat ke (x1, y1). o.akhir: ekspresi saat mendarat; o.tinggi: tinggi lengkung tambahan */
  Tokoh.prototype.lompat = function (x1, y1, o) {
    o = o || {};
    var self = this, x0 = this.x, y0 = this.y, ekspresiAkhir = o.akhir || this.ekspresi, el = this.el;
    if (UI.kurangi) {
      return Tween.run(140, function (e) { el.style.opacity = 1 - e; }, Ease.linear).then(function () {
        self.ekspresi = ekspresiAkhir; self.atur(); self.taruh(x1, y1);
        return Tween.run(140, function (e) { el.style.opacity = e; }, Ease.linear);
      });
    }
    Aud.sfx('hup');
    var baliAwal = this.balik;
    this.balik = x1 < x0;
    this.render('lompat');
    var tinggi = (o.tinggi || 0) + Math.max(70, Math.hypot(x1 - x0, y1 - y0) * 0.32);
    return Tween.run(450, function (e, k) {
      var x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k - Math.sin(Math.PI * k) * tinggi;
      self.taruh(x, y, 'lompat');
      var reg = 1 + Math.sin(Math.PI * k) * 0.12;
      el.style.transform = (self.balik ? 'scaleX(-1) ' : '') + 'rotate(' + ((self.balik ? -1 : 1) * (k - 0.5) * 40) + 'deg) scale(' + reg + ',' + (2 - reg) + ')';
    }, Ease.linear).then(function () {
      self.balik = o.balik != null ? o.balik : baliAwal;
      self.ekspresi = ekspresiAkhir;
      self.render('duduk', ekspresiAkhir);
      self.taruh(x1, y1);
      /* mendarat: gepeng sebentar lalu kembali */
      return Tween.run(180, function (e) {
        var sx = 1.16 - 0.16 * e, sy = 0.84 + 0.16 * e;
        el.style.transform = (self.balik ? 'scaleX(-1) ' : '') + 'scale(' + sx + ',' + sy + ')';
      }, Ease.easeOutBack).then(function () { self.taruh(self.x, self.y); });
    });
  };
  /* sambar: Tasi melesat ke sasaran (pose lompat), menyentuhnya, lalu memantul pulang dan mendarat. Tidak mendarat di atas
     teks supaya bacaan tidak tertutup. onSentuh dipanggil saat menyentuh sasaran (daun berhamburan, kata tertangkap). */
  Tokoh.prototype.sambar = function (x1, y1, onSentuh, o) {
    o = o || {};
    var self = this, x0 = this.x, y0 = this.y, el = this.el, ekspresi = o.akhir || this.ekspresi, baliAwal = this.balik;
    if (UI.kurangi) { if (onSentuh) onSentuh(); if (o.akhir) this.atur(o.akhir); return Promise.resolve(); }
    Aud.sfx('hup');
    function terbang(ax, ay, bx, by, dur) {
      self.balik = bx < ax;
      self.render('lompat');
      var tinggi = Math.max(60, Math.hypot(bx - ax, by - ay) * 0.28);
      return Tween.run(dur, function (e, k) {
        var x = ax + (bx - ax) * k, y = ay + (by - ay) * k - Math.sin(Math.PI * k) * tinggi;
        self.taruh(x, y, 'lompat');
        var reg = 1 + Math.sin(Math.PI * k) * 0.12;
        el.style.transform = (self.balik ? 'scaleX(-1) ' : '') + 'rotate(' + ((self.balik ? -1 : 1) * (k - 0.5) * 36) + 'deg) scale(' + reg + ',' + (2 - reg) + ')';
      }, Ease.linear);
    }
    /* sasaran adalah titik sentuh tangan Tasi: geser supaya ujung tangan (sekitar 90 satuan di depan pusat badan) tepat di sana */
    var maju = 88 * this.s * (x1 < x0 ? -1 : 1), tx = x1 - maju, ty = y1 + ASAL_LOMPAT * this.s - 20 * this.s;
    return terbang(x0, y0, tx, ty, 380).then(function () {
      if (onSentuh) onSentuh();
      return terbang(tx, ty, x0, y0, 360);
    }).then(function () {
      self.balik = baliAwal; self.ekspresi = ekspresi;
      self.render('duduk', ekspresi); self.taruh(x0, y0);
      return Tween.run(180, function (e) { el.style.transform = (self.balik ? 'scaleX(-1) ' : '') + 'scale(' + (1.16 - 0.16 * e) + ',' + (0.84 + 0.16 * e) + ')'; }, Ease.easeOutBack);
    }).then(function () { self.taruh(self.x, self.y); });
  };
  root.Tokoh = Tokoh;
})(window);
