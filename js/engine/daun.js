/* Lapisan daun: satu kanvas di atas teks DOM (brief bagian 12, risiko R7). Menggambar tikar dan daun penutup tiap segmen,
   kilau jalur sekilas (tingkat 1), daun yang berhamburan saat segmen dibuka, kunang-kunang yang terbang ke toples,
   dan Rasi Bacaan (titik rasi tersambung garis cahaya). Ukuran daun mengikuti tinggi baris (GDD 3.1).
   Kanvas digambar ulang hanya saat ada perubahan atau animasi. */
(function (root) {
  var TINTA = '#1E2A47', KUNANG = '#F5DF5C', WARNA = ['#3E9A4A', '#5DB548', '#2F7D4E', '#7CC24E', '#4FA845'];

  function daunKanvas(c, d, alfa) {
    var p = d.p, l = d.l;
    c.save(); c.translate(d.x, d.y); c.rotate(d.rot * Math.PI / 180); c.globalAlpha = alfa == null ? 1 : alfa;
    c.beginPath(); c.moveTo(-p / 2, 0);
    c.bezierCurveTo(-p / 4, -l / 1.6, p / 4, -l / 1.6, p / 2, 0); c.bezierCurveTo(p / 4, l / 1.6, -p / 4, l / 1.6, -p / 2, 0); c.closePath();
    c.fillStyle = d.w; c.fill(); c.lineWidth = 2.4; c.strokeStyle = TINTA; c.stroke();
    c.beginPath(); c.moveTo(-p / 2 + 5, 0); c.quadraticCurveTo(0, -l * 0.08, p / 2 - 6, 0);
    c.moveTo(-p * 0.12, -l * 0.05); c.lineTo(0, -l * 0.31); c.moveTo(p * 0.12, -l * 0.04); c.lineTo(p * 0.22, l * 0.2);
    c.lineWidth = 1.6; c.strokeStyle = 'rgba(31,90,55,.75)'; c.stroke();
    c.restore();
  }
  function bintang4(c, x, y, r, alfa) {
    var k = r * 0.24;
    c.save(); c.globalAlpha = alfa == null ? 1 : alfa;
    c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x + k, y - k, x + r, y); c.quadraticCurveTo(x + k, y + k, x, y + r);
    c.quadraticCurveTo(x - k, y + k, x - r, y); c.quadraticCurveTo(x - k, y - k, x, y - r); c.closePath();
    c.fillStyle = KUNANG; c.fill(); c.lineWidth = Math.max(1.6, r * 0.16); c.strokeStyle = TINTA; c.stroke(); c.restore();
  }
  function kunangKanvas(c, x, y, r, alfa) {
    c.save(); c.globalAlpha = alfa == null ? 1 : alfa;
    var g = c.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, 'rgba(255,251,214,1)'); g.addColorStop(0.35, 'rgba(245,223,92,.85)'); g.addColorStop(1, 'rgba(245,223,92,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 3, 0, Math.PI * 2); c.fill(); c.restore();
  }

  function Lapisan(parent, z) {
    this.kanvas = U.h('canvas', 'lapis-daun');
    if (z != null) this.kanvas.style.zIndex = z;
    parent.appendChild(this.kanvas);
    this.c = this.kanvas.getContext('2d');
    this.tutup = {};      // id -> { kotak, daun[], kilau }
    this.terbang = [];    // daun berhamburan
    this.kunang = [];     // kunang menuju toples
    this.rasi = null;     // { titik[], k }
    this.jalan = false;
    this.ukur();
  }
  Lapisan.prototype.ukur = function () {
    var k = Math.min(2, Math.max(1, Math.round((Stage.scale || 1) * (root.devicePixelRatio || 1) * 4) / 4));
    if (k !== this.k) { this.k = k; this.kanvas.width = 1280 * k; this.kanvas.height = 720 * k; }
    this.gambar();
  };
  /* kotak: daftar kotak baris (koordinat panggung). benih: acak-tetap. kilau: segmen jalur sekilas berkilau (tingkat 1). */
  Lapisan.prototype.pasang = function (id, kotak, benih, kilau) {
    var r = Seni.acak(benih || 1), daun = [];
    kotak.forEach(function (b) {
      var u = Math.max(0.7, b.h / 36), n = Math.max(1, Math.round(b.w / (34 * u))), ruang = Math.max(0, b.w - 46 * u), i;
      for (i = 0; i < n; i++) {
        daun.push({ x: b.x + 23 * u + (n > 1 ? i * ruang / (n - 1) : ruang / 2) + (r() - 0.5) * 6, y: b.y + b.h / 2 + (r() - 0.5) * 5 * u,
          p: (44 + r() * 8) * u, l: (24 + r() * 7) * u, rot: (r() - 0.5) * 30 + (i % 2 ? 7 : -7), w: WARNA[Math.floor(r() * WARNA.length)] });
      }
    });
    this.tutup[id] = { kotak: kotak, daun: daun, kilau: !!kilau };
  };
  Lapisan.prototype.hapusSemua = function () { this.tutup = {}; this.rasi = null; this.gambar(); };
  Lapisan.prototype.ada = function (id) { return !!this.tutup[id]; };
  /* segmen dibuka: daunnya berhamburan */
  Lapisan.prototype.buka = function (id, angin) {
    var t = this.tutup[id]; if (!t) return;
    delete this.tutup[id];
    if (!UI.kurangi) t.daun.forEach(function (d, i) {
      var a = angin ? -0.15 + Math.random() * 0.3 : -Math.PI * (0.15 + 0.7 * Math.random()), v = angin ? 520 + Math.random() * 300 : 160 + Math.random() * 220;
      this.terbang.push({ x: d.x, y: d.y, p: d.p, l: d.l, rot: d.rot, w: d.w, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vr: (Math.random() - 0.5) * 720, umur: 0, maks: 0.6 + Math.random() * 0.3 });
    }, this);
    this.mulai();
  };
  Lapisan.prototype.bukaSemua = function () { Object.keys(this.tutup).forEach(function (id) { this.buka(id, true); }, this); };
  /* kunang terbang melengkung dari (x0, y0) ke (x1, y1); janji selesai saat tiba */
  Lapisan.prototype.terbangKunang = function (x0, y0, x1, y1) {
    var self = this;
    return new Promise(function (ok) {
      if (UI.kurangi) { ok(); return; }
      self.kunang.push({ x0: x0, y0: y0, x1: x1, y1: y1, cx: (x0 + x1) / 2 - 60, cy: Math.min(y0, y1) - 140, t: 0, dur: 0.75 * (Tween.speed || 1), ok: ok, jejak: [] });
      self.mulai();
    });
  };
  /* Rasi Bacaan: titik-titik tersambung garis cahaya (700 ms) */
  Lapisan.prototype.pasangRasi = function (titik) {
    var self = this;
    this.rasi = { titik: titik, k: 0 };
    return Tween.run(700, function (e) { self.rasi.k = e; self.gambar(); }, Ease.easeInOutCubic);
  };
  Lapisan.prototype.mulai = function () {
    if (this.jalan) return;
    this.jalan = true;
    var self = this, akhir = performance.now();
    (function tick(ts) {
      if (!self.kanvas.isConnected) { self.jalan = false; return; }
      var dt = Math.min(0.05, (ts - akhir) / 1000); akhir = ts;
      if (Loop.paused || Tween.paused) dt = 0;
      self.terbang.forEach(function (q) { q.umur += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 380 * dt; q.rot += q.vr * dt; });
      self.terbang = self.terbang.filter(function (q) { return q.umur < q.maks; });
      self.kunang.forEach(function (q) { q.t += dt / q.dur; });
      self.kunang = self.kunang.filter(function (q) { if (q.t >= 1) { q.ok(); return false; } return true; });
      self.gambar();
      if (self.terbang.length || self.kunang.length) requestAnimationFrame(tick); else { self.jalan = false; self.gambar(); }
    })(akhir);
  };
  Lapisan.prototype.gambar = function () {
    var c = this.c, self = this;
    c.setTransform(this.k, 0, 0, this.k, 0, 0);
    c.clearRect(0, 0, 1280, 720);
    if (this.klip) { c.save(); c.beginPath(); c.rect(this.klip.x, this.klip.y, this.klip.w, this.klip.h); c.clip(); }
    Object.keys(this.tutup).forEach(function (id) {
      var t = self.tutup[id];
      t.kotak.forEach(function (b) {
        c.beginPath();
        if (c.roundRect) c.roundRect(b.x + 2, b.y + 3, b.w - 2, b.h - 6, 12); else c.rect(b.x + 2, b.y + 3, b.w - 2, b.h - 6);
        c.fillStyle = '#2F7D4E'; c.fill();
        if (t.kilau) { c.save(); c.shadowColor = 'rgba(245,223,92,.95)'; c.shadowBlur = 14; c.lineWidth = 4; c.strokeStyle = KUNANG; c.stroke(); c.restore(); }
        c.lineWidth = 2.4; c.strokeStyle = TINTA; c.stroke();
      });
      t.daun.forEach(function (d) { daunKanvas(c, d); });
      if (t.kilau && t.kotak[0]) { var b = t.kotak[t.kotak.length - 1]; bintang4(c, b.x + b.w - 4, b.y + 4, 9); }
    });
    if (this.klip) c.restore();
    if (this.rasi) {
      var T = this.rasi.titik, k = this.rasi.k, n = T.length - 1;
      c.save(); c.lineWidth = 4; c.strokeStyle = 'rgba(245,223,92,.95)'; c.shadowColor = 'rgba(245,223,92,1)'; c.shadowBlur = 10; c.lineCap = 'round';
      c.beginPath();
      for (var i = 0; i < n; i++) {
        var a = Math.min(1, Math.max(0, k * n - i));
        if (a <= 0) break;
        c.moveTo(T[i].x, T[i].y); c.lineTo(T[i].x + (T[i + 1].x - T[i].x) * a, T[i].y + (T[i + 1].y - T[i].y) * a);
      }
      c.stroke(); c.restore();
      T.forEach(function (p) { bintang4(c, p.x, p.y, 10); });
    }
    this.terbang.forEach(function (q) { daunKanvas(c, q, Math.min(1, (1 - q.umur / q.maks) * 1.6)); });
    this.kunang.forEach(function (q) {
      var t = Math.min(1, q.t), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, u = 1 - e;
      var x = u * u * q.x0 + 2 * u * e * q.cx + e * e * q.x1, y = u * u * q.y0 + 2 * u * e * q.cy + e * e * q.y1;
      q.jejak.push([x, y]); if (q.jejak.length > 8) q.jejak.shift();
      q.jejak.forEach(function (j, n2) { kunangKanvas(c, j[0], j[1], 2 + n2 * 0.4, (n2 + 1) / 12); });
      kunangKanvas(c, x, y, 6);
    });
  };

  root.Daun = { Lapisan: Lapisan, bintang4: bintang4 };
})(window);
