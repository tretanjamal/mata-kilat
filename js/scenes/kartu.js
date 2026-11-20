/* Kartu Penjelajah (brief 3c): pilih warna lentera (kuning, hijau, jingga, ungu). Lentera langsung menyala dan warnanya
   menjadi warna pita sorot. Ini aksi menyenangkan pertama sesudah MULAI. Nama tidak diminta (tanpa data pribadi). */
(function () {
  Scenes.add('kartu', {
    enter: function (root, p) {
      Aud.musik('judul');
      Adegan.latar(root, 'latarRumahPohon');
      root.appendChild(U.h('div', 'redup'));
      var K = STR.kartu, panel = U.h('div', 'papan panel-kartu');
      panel.innerHTML = '<div class="pita-panel">' + UI.esc(K.judul) + '</div><p class="ajak" data-cek="ajak kartu">' + UI.esc(K.ajak) + '</p>';
      var baris = U.h('div', 'baris-lentera'), tombol = [];
      Save.LENTERA.forEach(function (w) {
        var src = Seni.src('lentera_' + w);
        var isi = (src ? '<img src="' + src + '" alt="" draggable="false">' : Seni.ikon('lentera', 84)) + '<span>' + UI.esc(K.warna[w]) + '</span>';
        var b = Input.button(isi, 'ketiga alir pilih-lentera', function () { pilih(w); }, { id: 'lentera-' + w, aria: K.warna[w] });
        b.dataset.warna = w;
        tombol.push(b); baris.appendChild(b);
      });
      panel.appendChild(baris);
      panel.appendChild(U.h('p', 'catatan', UI.esc(K.catatan)));
      var pergi = Input.button('<span class="label-tombol">' + (p.dariJudul ? STR.tombol.simpan : STR.tombol.berangkat) + '</span>', 'utama alir lebar', function () {
        Save.data.kartu = true; Save.save();
        Scenes.go(p.dariJudul ? 'judul' : 'peta');
      }, { id: 'berangkat' });
      /* jalan keluar ke layar judul (pertama kali dari MULAI); dari tombol Lentera di judul, Simpan sudah kembali ke judul */
      if (p.dariJudul) panel.appendChild(pergi);
      else {
        var bt = U.h('div', 'baris-tombol-hasil');
        bt.appendChild(Input.button('<span class="label-tombol">' + STR.tombol.menuUtama + '</span>', 'ketiga alir', function () { Scenes.go('judul'); }, { id: 'kartu-kembali' }));
        bt.appendChild(pergi);
        panel.appendChild(bt);
      }
      root.appendChild(panel);
      function pilih(w) {
        Save.data.lentera = w; Save.save();
        Save.LENTERA.forEach(function (x) { document.body.classList.toggle('lentera-' + x, x === w); });
        tombol.forEach(function (b) { var on = b.dataset.warna === w; b.classList.toggle('dipilih', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) UI.lompat(b); });
        Aud.sfx('ting');
      }
      tombol.forEach(function (b) { var on = b.dataset.warna === Save.data.lentera; b.classList.toggle('dipilih', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      UI.idle.atur(function () { return Save.data.kartu ? pergi : tombol[0]; });
      setTimeout(function () { UI.fokus(tombol[Save.LENTERA.indexOf(Save.data.lentera)]); }, 60);
    },
    exit: function () { UI.idle.fn = null; }
  });
})();
