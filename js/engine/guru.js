/* Catatan untuk Guru (brief bagian 13b, CLAUDE.md bagian 5): panel bertab Keterampilan | Ringkasan | Kesalahan dan Saran,
   lalu Unduh catatan (.txt). Tanpa nama, tanpa data pribadi, tanpa fase dan kelas. Pola panel guru dan unduhan dari
   Teknik Menganyam 2D (670). Data dari Save: keterampilan, level, miskonsepsi, lompatan, waktu, Uji Kilat. */
(function (root) {
  var esc = function (s) { return UI.esc(s); };
  function persen(a, b) { return b ? Math.round(100 * a / b) + '%' : STR.guru.kosong; }
  function desimal(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }

  var Guru = {
    /* ringkasan angka untuk panel dan unduhan */
    data: function () {
      var d = Save.data, G = STR.guru, M = d.miskonsepsi, selesai = 0, bintang = 0;
      var level = [1, 2, 3, 4, 5].map(function (i) {
        var l = d.level[String(i)];
        if (l && l.selesai) { selesai++; bintang += l.bintang; }
        return { nama: STR.peta.level[i - 1], l: l };
      });
      var kunci = Object.keys(M).filter(function (k) { return G.misk[k]; }).sort(function (a, b) { return M[b] - M[a]; });
      var rata = function (w) { return w[1] ? desimal(w[0] / w[1]) : null; };
      return {
        menit: Math.round(d.detik / 60), selesai: selesai, bintang: bintang, level: level, santai: d.settings.santai,
        jitu: d.lompatan.semua ? persen(d.lompatan.jitu, d.lompatan.semua) : null,
        sekilas: rata(d.waktu.sekilas), pindai: rata(d.waktu.pindai),
        uji: d.ujiKilat.awal && d.ujiKilat.akhir ? { a: desimal(d.ujiKilat.awal), b: desimal(d.ujiKilat.akhir) } : null,
        misk: kunci.slice(0, 3).map(function (k) { return { kunci: k, n: M[k] }; }),
        pastikan: M['pastikan-menyelamatkan'] || 0
      };
    },
    /* keterampilan yang perlu dilatih, paling lemah dulu */
    lemah: function () {
      var K = Save.data.keterampilan;
      return STR.belajarku.tag.filter(function (t) { var s = Save.status(t); return s === 'latihan' || s === 'berkembang'; })
        .sort(function (a, b) { return K[a].benarAwal / K[a].kesempatan - K[b].benarAwal / K[b].kesempatan; });
    },
    saran: function () {
      var G = STR.guru, ada = STR.belajarku.tag.some(function (t) { return Save.status(t) !== 'belum'; }), lemah = Guru.lemah();
      if (!ada) return [G.saranKosong];
      if (!lemah.length) return [G.saranBaik];
      return lemah.slice(0, 3).map(function (t) { return G.saran[t]; });
    },
    baris: function (tag) {
      var s = Save.data.keterampilan[tag], G = STR.guru;
      return {
        bukti: s && s.kesempatan ? s.benarAwal + ' / ' + s.kesempatan + ' (' + persen(s.benarAwal, s.kesempatan) + ')' : G.kosong,
        ulang: s && s.ulang ? s.ulangBenar + ' / ' + s.ulang : G.kosong,
        status: Save.status(tag)
      };
    },
    panel: function () {
      var G = STR.guru, B = STR.belajarku, o = UI.overlay(G.judul, 'panel-info panel-guru'), d = Guru.data();
      function daftar(a) { return '<ul class="daftar-info">' + a.join('') + '</ul>'; }
      var HAL = {
        keterampilan: function () {
          return '<table class="tabel-guru"><thead><tr><th>' + esc(G.kolom.tag) + '</th><th>' + esc(G.kolom.bukti) + '</th><th>' + esc(G.kolom.ulang) + '</th><th>' + esc(G.kolom.status) + '</th></tr></thead><tbody>' +
            B.tag.map(function (t) {
              var r = Guru.baris(t);
              return '<tr><td>' + esc(G.nama[t]).replace('skimming', '<i>skimming</i>') + '</td><td>' + esc(r.bukti) + '</td><td>' + esc(r.ulang) + '</td><td><span class="chip-status status-' + r.status + '">' + esc(B.status[r.status]) + '</span></td></tr>';
            }).join('') + '</tbody></table><p class="kecil-info">' + esc(G.ambang) + '</p>';
        },
        ringkasan: function () {
          var umum = [U.fmt(G.waktu, { m: d.menit }), U.fmt(G.selesai, { n: d.selesai }), U.fmt(G.santai, { s: d.santai ? G.ya : G.tidak }),
            U.fmt(G.jitu, { p: d.jitu || G.kosong }), U.fmt(G.rataSekilas, { d: d.sekilas || G.kosong }), U.fmt(G.rataPindai, { d: d.pindai || G.kosong }),
            d.uji ? U.fmt(G.uji, d.uji) : G.ujiBelum];
          var tabel = '<table class="tabel-guru tabel-level"><thead><tr><th>' + esc(G.kolomLevel.level) + '</th><th>' + esc(G.kolomLevel.bintang) + '</th><th>' + esc(G.kolomLevel.petunjuk) + '</th><th>' + esc(G.kolomLevel.ulang) + '</th><th>' + esc(G.kolomLevel.main) + '</th></tr></thead><tbody>' +
            d.level.map(function (x) {
              var l = x.l;
              if (!l || !l.selesai) return '<tr><td>' + esc(x.nama) + '</td><td colspan="4">' + esc(G.belumMain) + '</td></tr>';
              var bt = ''; for (var j = 0; j < 3; j++) bt += Seni.ikon(j < l.bintang ? 'bintang' : 'bintangKosong', 26);
              return '<tr><td>' + esc(x.nama) + '</td><td class="bintang-tabel" aria-label="' + l.bintang + ' bintang">' + bt + '</td><td>' + (l.petunjuk || [0, 0, 0]).join(' / ') + '</td><td>' + (l.ulang ? l.ulangBenar + ' / ' + l.ulang : G.kosong) + '</td><td>' + (l.main || 1) + '</td></tr>';
            }).join('') + '</tbody></table>';
          return '<div class="dua-kolom-guru"><div><p class="sorot-info">' + esc(G.ringkasanJudul) + '</p><p>' + umum.map(esc).join('<br>') + '</p><p class="kecil-info">' + esc(G.catatanWaktu) + '</p></div>' +
            '<div><p class="sorot-info">' + esc(G.levelJudul) + '</p>' + tabel + '</div></div>';
        },
        saran: function () {
          var misk = d.misk.length ? daftar(d.misk.map(function (m) { return '<li><b>' + esc(G.misk[m.kunci][0]) + ' (' + U.fmt(G.miskKali, { n: m.n }) + ').</b> ' + esc(G.misk[m.kunci][1]) + '</li>'; })) : '<p>' + esc(G.miskKosong) + '</p>';
          var baik = d.pastikan ? '<p class="sorot-info">' + esc(G.baikJudul) + '</p><p>' + esc(U.fmt(G.baik, { n: d.pastikan })) + '</p>' : '';
          return '<div class="dua-kolom-guru"><div><p class="sorot-info">' + esc(G.miskJudul) + '</p>' + misk + '</div>' +
            '<div><p class="sorot-info">' + esc(G.saranJudul) + '</p>' + daftar(Guru.saran().map(function (x) { return '<li>' + esc(x) + '</li>'; })) + baik +
            '<p class="kecil-info">' + esc(G.nuansa) + '</p></div></div>';
        }
      };
      var tabs = U.h('div', 'daftar-tab'), isi = U.h('div', 'teks-info isi-tab isi-guru');
      isi.setAttribute('data-cek', 'catatan guru');
      isi.setAttribute('data-gulir', '1');   // panel guru boleh digulir di HP (isi panjang); di laptop dijaga muat
      function pilih(k) {
        isi.innerHTML = HAL[k]();
        Array.prototype.forEach.call(tabs.children, function (b) { var on = b.dataset.id === 'guru-' + k; b.classList.toggle('aktif', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      }
      Object.keys(HAL).forEach(function (k) {
        var b = Input.button(esc(G.tab[k]), 'ketiga alir tab', function () { pilih(k); }, { id: 'guru-' + k });
        b.setAttribute('role', 'tab'); tabs.appendChild(b);
      });
      tabs.setAttribute('role', 'tablist');
      var tutup = Input.button(esc(STR.tombol.tutup), 'kedua alir tab tutup-tab', function () { o.close(); }, { id: 'tutup' });
      o.body.appendChild(UI.barisTab(tabs, tutup)); o.body.appendChild(isi);
      var kaki = U.h('div', 'kaki-guru', '<p class="kecil-info">' + esc(G.privasi) + '</p>');
      kaki.appendChild(Input.button(Seni.ikon('unduh', 36) + '<span class="label-tombol">' + esc(G.unduh) + '</span>', 'kedua alir', function () { Guru.unduh(); }, { id: 'guru-unduh' }));
      o.body.appendChild(kaki);
      pilih('keterampilan');
      setTimeout(function () { UI.fokus(tutup); }, 30);
      return o;
    },
    /* teks polos untuk unduhan (CRLF supaya rapi di Notepad) */
    teks: function () {
      var G = STR.guru, B = STR.belajarku, d = Guru.data(), t = [];
      t.push(STR.judul.lengkap + ' - ' + G.judul, '');
      t.push(G.tab.keterampilan + ':');
      B.tag.forEach(function (tag) { var r = Guru.baris(tag); t.push('- ' + G.nama[tag] + ': ' + r.bukti + '; ' + G.kolom.ulang + ' ' + r.ulang + ' (' + B.status[r.status] + ')'); });
      t.push('', G.ringkasanJudul + ':', U.fmt(G.waktu, { m: d.menit }), U.fmt(G.selesai, { n: d.selesai }), U.fmt(G.santai, { s: d.santai ? G.ya : G.tidak }),
        U.fmt(G.jitu, { p: d.jitu || G.kosong }), U.fmt(G.rataSekilas, { d: d.sekilas || G.kosong }), U.fmt(G.rataPindai, { d: d.pindai || G.kosong }), d.uji ? U.fmt(G.uji, d.uji) : G.ujiBelum, G.catatanWaktu);
      t.push('', G.levelJudul + ':');
      d.level.forEach(function (x) {
        var l = x.l;
        t.push('- ' + x.nama + ': ' + (l && l.selesai ? l.bintang + ' bintang; ' + G.kolomLevel.petunjuk + ' ' + (l.petunjuk || [0, 0, 0]).join('/') + '; ' + G.kolomLevel.ulang + ' ' + (l.ulang ? l.ulangBenar + '/' + l.ulang : G.kosong) + '; ' + G.kolomLevel.main + ' ' + (l.main || 1) : G.belumMain));
      });
      t.push('', G.miskJudul + ':');
      if (d.misk.length) d.misk.forEach(function (m) { t.push('- ' + G.misk[m.kunci][0] + ' (' + U.fmt(G.miskKali, { n: m.n }) + '). ' + G.misk[m.kunci][1]); }); else t.push(G.miskKosong);
      if (d.pastikan) t.push(G.baikJudul + ': ' + U.fmt(G.baik, { n: d.pastikan }));
      t.push('', G.saranJudul + ':'); Guru.saran().forEach(function (x) { t.push('- ' + x); });
      t.push('', G.nuansa, G.privasi);
      return t.join('\r\n');
    },
    /* unduh berkas teks di perangkat (tanpa tautan keluar, tanpa nama murid) */
    unduh: function () {
      try {
        var blob = new Blob(['﻿' + Guru.teks()], { type: 'text/plain;charset=utf-8' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = STR.guru.namaBerkas;
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        Aud.sfx('tik');
      } catch (e) { UI.toast(STR.guru.unduhGagal); }
    }
  };
  root.Guru = Guru;
})(window);
