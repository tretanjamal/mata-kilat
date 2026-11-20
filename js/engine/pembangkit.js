/* Pembangkit dan pemeriksa soal Pindai (brief bagian 7 dan 13).
   buat(templat, benih, tingkat) membuat teks fungsional (jadwal, harga, penjaga, daftar isi; Fase 3: pengumuman, denah, indeks,
   resep) beserta soalnya: kata kunci,
   bentuk jawaban, jawaban tunggal, dan pengecoh sebentuk (waktu lain, harga lain, nama lain, halaman lain).
   periksa(dok) memastikan: baris jawaban ada dan memuat nilai sebentuk; kata kunci ada di pertanyaan dan hanya di satu baris;
   nilai sebentuk unik; minimal dua pengecoh sebentuk; format EYD (pukul 18.00, Rp2.000). Dipakai juga untuk teks tulisan tangan. */
(function (root) {
  var TEMPAT = ['Rumah Pohon', 'Telaga Teratai', 'Pasar Dahan', 'Air Terjun Embun', 'Bukit Bulan', 'Pohon Kunang', 'Hutan Bambu', 'Dermaga Timur', 'Batu Besar', 'Lembah Embun'];
  var BARANG = ['Kue lentera', 'Teh serai', 'Jagung bakar', 'Madu hutan', 'Pisang goreng', 'Bubur kacang', 'Lentera daun', 'Tikar pandan', 'Topi daun', 'Wedang jahe'];
  var NAMA = ['Pak Beruang Madu', 'Bu Lebah', 'Om Berang', 'Kak Kalong', 'Bu Rusa', 'Pak Trenggiling', 'Kak Merak', 'Dik Kancil'];
  var POS = ['Panggung', 'Kedai Madu', 'Gondola Daun', 'Pintu Masuk', 'Tenda Cerita', 'Lapangan Lentera', 'Tepi Telaga', 'Menara Bulan'];
  var RESEP = ['Bubur sumsum', 'Kue lumpur', 'Nasi liwet', 'Pisang goreng', 'Wedang jahe', 'Klepon', 'Getuk', 'Serabi'];
  var LOMBA = ['menghias lentera', 'membaca puisi', 'egrang', 'congklak', 'mewarnai', 'lari karung', 'bakiak', 'gobak sodor'];
  var DENAH = ['Panggung musik', 'Tenda obat', 'Pos informasi', 'Kedai minum', 'Tenda cerita', 'Tempat cuci tangan', 'Loket tiket', 'Pintu keluar'];
  var INDEKS = ['bambu', 'capung', 'gua', 'kelelawar', 'kukang', 'lumut', 'musang', 'tarsius', 'teratai', 'tupai'];
  /* [bahan, satuan, jumlah yang wajar] */
  var BAHAN = [['Tepung ketan', 'gram', [150, 200, 250, 300]], ['Gula merah', 'gram', [50, 75, 100, 125]], ['Kelapa parut', 'gram', [80, 90, 120, 150]],
    ['Air hangat', 'mililiter', [160, 180, 220, 240]], ['Daun pandan', 'lembar', [2, 3, 4, 5]], ['Santan', 'mililiter', [260, 280, 320, 350]],
    ['Garam', 'sendok teh', [1]], ['Pisang', 'buah', [6, 7, 8, 9]]];
  function rng(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function ambil(r, arr, n) { var a = arr.slice(), out = []; while (out.length < n) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; }
  function antara(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function jam(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + '.' + (mm < 10 ? '0' : '') + mm; }
  function rupiah(n) { var s = String(n), o = ''; while (s.length > 3) { o = '.' + s.slice(-3) + o; s = s.slice(0, -3); } return 'Rp' + s + o; }
  function kecil(t) { return t.charAt(0).toLowerCase() + t.slice(1); }
  function namaDiri(t) { return (t.match(/\b[A-Z]/g) || []).length > 1; }

  var T = {
    jadwal: function (r, n, nSoal) {
      var tujuan = ambil(r, TEMPAT, n), m = antara(r, 15, 17) * 60 + antara(r, 0, 3) * 5, baris = [], dipakai = {};
      tujuan.forEach(function (x) {
        m += antara(r, 2, 4) * 5;
        var tiba = m + antara(r, 2, 8) * 5;
        while (dipakai[jam(tiba)] || dipakai[jam(m)]) { m += 5; tiba += 5; }
        dipakai[jam(m)] = dipakai[jam(tiba)] = true;
        baris.push([x, { t: jam(m), b: 'waktu' }, { t: jam(tiba), b: 'waktu' }]);
      });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        var berangkat = r() < 0.5, kata = berangkat ? 'berangkat' : 'tiba', jw = baris[i][berangkat ? 1 : 2].t, lain = baris[i][berangkat ? 2 : 1].t, pk = {};
        pk[i + ':' + lain] = berangkat ? 'Itu waktu tiba, bukan berangkat.' : 'Itu waktu berangkat, bukan tiba.';
        return { tanya: 'Pukul berapa gondola ke ' + baris[i][0] + ' ' + kata + '?', kunci: baris[i][0], kunci2: kata, bentuk: 'waktu', jawab: i, jawabT: jw, pengecoh: pk };
      });
      return { judul: 'Jadwal Gondola Daun', kolom: ['Tujuan', 'Berangkat', 'Tiba'], kelas: 'tiga-kolom', baris: baris, soal: soal };
    },
    harga: function (r, n, nSoal) {
      var barang = ambil(r, BARANG, n), harga = ambil(r, [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7500, 10000], n);
      var baris = barang.map(function (b, i) { return [b, { t: rupiah(harga[i]), b: 'harga' }]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Berapa harga ' + kecil(baris[i][0]) + '?', kunci: kecil(baris[i][0]), bentuk: 'harga', jawab: i };
      });
      return { judul: 'Daftar Harga Kedai Madu', kolom: ['Barang', 'Harga'], baris: baris, soal: soal };
    },
    penjaga: function (r, n, nSoal) {
      var nama = ambil(r, NAMA, n), pos = ambil(r, POS, n);
      var baris = nama.map(function (x, i) { return [{ t: x, b: 'nama' }, pos[i]]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Siapa yang menjaga ' + pos[i] + '?', kunci: pos[i], bentuk: 'nama', jawab: i };
      });
      return { judul: 'Penjaga Festival', kolom: ['Nama', 'Menjaga'], baris: baris, soal: soal };
    },
    daftarIsi: function (r, n, nSoal) {
      var resep = ambil(r, RESEP, n), h = antara(r, 2, 5);
      var baris = resep.map(function (x) { h += antara(r, 2, 6); return [x, { t: String(h), b: 'angka' }]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Resep ' + kecil(baris[i][0]) + ' ada di halaman berapa?', kunci: kecil(baris[i][0]), bentuk: 'angka', jawab: i };
      });
      return { judul: 'Daftar Isi Buku Resep Rimba', kolom: ['Resep', 'Halaman'], baris: baris, soal: soal };
    },
    /* Fase 3: empat templat tambahan (brief bagian 7: pengumuman, denah, indeks, resep) */
    pengumuman: function (r, n, nSoal) {
      var lomba = ambil(r, LOMBA, n), tgl = ambil(r, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], n);
      var baris = lomba.map(function (x, i) { return ['Lomba ' + x, { t: tanggal(tgl[i]), b: 'tanggal' }]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Kapan lomba ' + lomba[i] + ' diadakan?', kunci: lomba[i], bentuk: 'tanggal', jawab: i };
      });
      return { judul: 'Pengumuman Lomba Festival', kolom: ['Lomba', 'Tanggal'], baris: baris, soal: soal };
    },
    denah: function (r, n, nSoal) {
      var benda = ambil(r, DENAH, n), tempat = ambil(r, TEMPAT, n);
      var baris = benda.map(function (x, i) { return [x, { t: tempat[i], b: 'tempat' }]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Di mana ' + kecil(benda[i]) + ' berada?', kunci: kecil(benda[i]), bentuk: 'tempat', jawab: i };
      });
      return { judul: 'Denah Festival Seribu Kunang', kolom: ['Yang dicari', 'Tempat'], baris: baris, soal: soal };
    },
    indeks: function (r, n, nSoal) {
      var kata = ambil(r, INDEKS, n).sort(function (a, b) { return a.localeCompare(b, 'id'); }), hal = ambil(r, [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45], n);
      var baris = kata.map(function (x, i) { return [x, { t: String(hal[i]), b: 'angka' }]; });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Kata ' + kata[i] + ' ada di halaman berapa?', kunci: kata[i], bentuk: 'angka', jawab: i };
      });
      return { judul: 'Indeks Buku Satwa Rimba', kolom: ['Kata', 'Halaman'], baris: baris, soal: soal };
    },
    resep: function (r, n, nSoal) {
      var bahan = ambil(r, BAHAN, n), dipakai = {};
      var baris = bahan.map(function (x) {
        var j; do { j = x[2][Math.floor(r() * x[2].length)]; } while (dipakai[j]);
        dipakai[j] = true;
        return [x[0], { t: String(j), b: 'angka' }, x[1]];
      });
      var soal = ambil(r, baris.map(function (b, i) { return i; }), nSoal).map(function (i) {
        return { tanya: 'Berapa ' + baris[i][2] + ' ' + kecil(baris[i][0]) + ' yang diperlukan?', kunci: kecil(baris[i][0]), bentuk: 'angka', jawab: i };
      });
      return { judul: 'Resep Kue Lentera', kolom: ['Bahan', 'Jumlah', 'Satuan'], kelas: 'tiga-kolom', baris: baris, soal: soal };
    }
  };
  /* tanggal November 2026 dengan nama hari yang benar (EYD: Sabtu, 21 November 2026) */
  function tanggal(d) { return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date(2026, 10, d).getDay()] + ', ' + d + ' November 2026'; }

  function buat(templat, benih, tingkat) {
    var r = rng((benih || 1) * 7919 + templat.length * 104729), t = tingkat || 2;
    var n = t >= 3 ? 6 : 5, nSoal = t >= 4 ? 2 : 1;
    var d = T[templat](r, n, nSoal);
    d.id = templat + '-' + benih;
    return d;
  }

  /* nilai di satu baris (semua potongan) */
  function nilaiBaris(b) {
    var out = [];
    (Array.isArray(b) ? b : [b]).forEach(function (sel) { (Array.isArray(sel) ? sel : [sel]).forEach(function (x) { if (x && typeof x === 'object') out.push(x); }); });
    return out;
  }
  function teksBaris(b) {
    var s = [];
    (Array.isArray(b) ? b : [b]).forEach(function (sel) { (Array.isArray(sel) ? sel : [sel]).forEach(function (x) { s.push(typeof x === 'string' ? x : x.t); }); });
    return s.join(' ');
  }
  var FORMAT = { waktu: /^\d{2}\.\d{2}$/, harga: /^Rp\d{1,3}(\.\d{3})*$/, tanggal: /^(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu), \d{1,2} [A-Z][a-z]+ \d{4}$/, angka: /^\d+$/ };
  function periksa(d) {
    var masalah = [], soal = d.soal || [{ tanya: d.tanya, kunci: d.kunci, bentuk: d.bentuk, jawab: d.jawab, jawabT: d.jawabT, huruf: d.huruf }];
    soal.forEach(function (sl, k) {
      var baris = d.kamus ? d.kamus.entri[sl.huruf] : d.baris, tag = (d.id || d.judul) + ' soal ' + (k + 1) + ': ';
      if (!baris) { masalah.push(tag + 'halaman huruf tidak ada'); return; }
      var tanya = Array.isArray(sl.tanya) ? sl.tanya.map(function (x) { return typeof x === 'string' ? x : x.k; }).join('') : sl.tanya;
      if (tanya.toLowerCase().indexOf(sl.kunci.toLowerCase()) < 0) masalah.push(tag + 'kata kunci tidak ada di pertanyaan');
      var cocok = baris.map(teksBaris).filter(function (t) { return t.toLowerCase().indexOf(sl.kunci.toLowerCase()) >= 0; });
      if (cocok.length !== 1) masalah.push(tag + 'kata kunci ada di ' + cocok.length + ' baris');
      var b = baris[sl.jawab];
      if (!b) { masalah.push(tag + 'baris jawaban tidak ada'); return; }
      if (teksBaris(b).toLowerCase().indexOf(sl.kunci.toLowerCase()) < 0) masalah.push(tag + 'kata kunci tidak di baris jawaban');
      var nb = nilaiBaris(b).filter(function (x) { return x.b === sl.bentuk && (!sl.jawabT || x.t === sl.jawabT); });
      if (nb.length !== 1) masalah.push(tag + 'jawaban tidak tunggal di barisnya (' + nb.length + ')');
      var semua = [];
      baris.forEach(function (bb) { nilaiBaris(bb).forEach(function (x) { if (x.b === sl.bentuk) semua.push(x.t); }); });
      if (semua.length - 1 < 2) masalah.push(tag + 'pengecoh sebentuk kurang dari 2');
      var jw = nb[0] && nb[0].t;
      if (jw && semua.filter(function (x) { return x === jw; }).length > 1) masalah.push(tag + 'nilai jawaban muncul di baris lain');
      if (FORMAT[sl.bentuk]) semua.forEach(function (x) { if (!FORMAT[sl.bentuk].test(x)) masalah.push(tag + 'format ' + sl.bentuk + ' tidak sesuai EYD: ' + x); });
    });
    return masalah;
  }
  var Pembangkit = { buat: buat, periksa: periksa, TEMPLAT: Object.keys(T), jam: jam, rupiah: rupiah };
  root.Pembangkit = Pembangkit;
  if (typeof module !== 'undefined') module.exports = Pembangkit;
})(typeof window !== 'undefined' ? window : globalThis);
