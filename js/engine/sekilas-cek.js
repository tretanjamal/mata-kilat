/* Pemeriksa teks Sekilas (brief bagian 7 dan 13): soal sekilas harus bisa dijawab dari jalur sekilas saja.
   - setiap paragraf punya kalimat jalur (awal, utama, atau berkata tebal);
   - setiap soal punya tepat satu jawaban benar, dan setiap pengecoh bertipe (sempit, luas, topik, paragraf);
   - inti jawaban benar (kata isi) muncul di judul, subjudul, atau kalimat jalur;
   - panjang teks sesuai tingkat tata letak; ejaan dasar (pukul 18.00, Rp2.000, spasi ganda, tanda baca akhir kalimat). */
(function (root) {
  var JENIS = ['benar', 'sempit', 'luas', 'topik', 'paragraf'];
  var KATA_TUGAS = ['yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'atau', 'karena', 'adalah', 'ini', 'itu', 'juga', 'saat', 'bagi', 'oleh', 'tentang'];
  function kataIsi(t) { return t.toLowerCase().replace(/[^a-z\- ]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 4 && KATA_TUGAS.indexOf(w) < 0; }); }
  function akar(w) { return w.replace(/(nya|lah|kah)$/, '').slice(0, 5); }
  function periksa(teks, batasKata) {
    var m = [], tag = (teks.id || teks.judul) + ': ', jalur = [teks.judul], semuaKata = 0, para = [];
    (teks.bagian || [{ paragraf: teks.paragraf }]).forEach(function (b) { if (b.judul) jalur.push(b.judul); b.paragraf.forEach(function (p) { para.push(p); }); });
    para.forEach(function (p, i) {
      var adaJalur = false;
      p.forEach(function (k) {
        var j = k.p === 'awal' || k.p === 'utama' || /\*\*/.test(k.t);
        if (j) { adaJalur = true; jalur.push(k.t.replace(/\*\*/g, '')); }
        semuaKata += k.t.split(/\s+/).length;
        if (!/[.!?]$/.test(k.t)) m.push(tag + 'kalimat tanpa tanda baca akhir: ' + k.t);
        if (/ {2}/.test(k.t)) m.push(tag + 'spasi ganda');
        if (/pukul \d/.test(k.t) && !/pukul \d{2}\.\d{2}/.test(k.t)) m.push(tag + 'format pukul tidak sesuai EYD');
        if (/Rp /.test(k.t)) m.push(tag + 'Rp tidak boleh diikuti spasi');
      });
      if (!adaJalur) m.push(tag + 'paragraf ' + (i + 1) + ' tanpa kalimat jalur sekilas');
    });
    /* gambar: keterangannya termasuk jalur sekilas (mantra "Gambar"), ilustrasinya harus ada */
    if (teks.gambar) {
      var gb = teks.gambar;
      if (!gb.ket || !/[.!?]$/.test(gb.ket)) m.push(tag + 'keterangan gambar tanpa tanda baca akhir');
      else jalur.push(gb.ket.replace(/\*\*/g, ''));
      if (root.Ilustrasi && !root.Ilustrasi.ada(gb.ilus)) m.push(tag + 'ilustrasi tidak dikenal: ' + gb.ilus);
      if (gb.di === 'akhir' ? !teks.panjang : (teks.panjang && gb.di !== 'akhir')) m.push(tag + 'letak gambar: lembar panjang memakai di "akhir", lembar pendek mengapung di paragraf');
    }
    var akarJalur = kataIsi(jalur.join(' ')).map(akar);
    (teks.soal || [{ tanya: teks.tanya, pilihan: teks.pilihan, inti: teks.rasi }]).forEach(function (sl, k) {
      var benar = sl.pilihan.filter(function (p) { return p.jenis === 'benar'; });
      if (benar.length !== 1) m.push(tag + 'soal ' + (k + 1) + ' punya ' + benar.length + ' jawaban benar');
      sl.pilihan.forEach(function (p) { if (JENIS.indexOf(p.jenis) < 0) m.push(tag + 'pengecoh tanpa tipe: ' + p.t); });
      if (sl.pilihan.some(function (p) { return p.jenis === 'paragraf'; }) && sl.paragraf == null) m.push(tag + 'pengecoh paragraf tanpa paragraf sasaran');
      if (sl.paragraf != null && !para[sl.paragraf]) m.push(tag + 'paragraf sasaran tidak ada');
      var inti = kataIsi(sl.inti || (benar[0] && benar[0].t) || '').map(akar);
      var kena = inti.filter(function (w) { return akarJalur.indexOf(w) >= 0; });
      if (inti.length && kena.length / inti.length < 0.5) m.push(tag + 'inti jawaban soal ' + (k + 1) + ' tidak ditopang jalur sekilas (' + kena.length + '/' + inti.length + ')');
      var panjang = sl.pilihan.map(function (p) { return p.t.length; }), maks = Math.max.apply(null, panjang), min = Math.min.apply(null, panjang);
      if (maks > min * 2.2) m.push(tag + 'panjang pilihan soal ' + (k + 1) + ' terlalu timpang (' + min + '-' + maks + ' huruf)');
    });
    if (batasKata && (semuaKata < batasKata[0] || semuaKata > batasKata[1])) m.push(tag + semuaKata + ' kata, di luar batas ' + batasKata.join('-'));
    return m;
  }
  /* pola di seluruh bank: jawaban tidak boleh bisa dikenali dari bentuknya saja (review Fase 4).
     Pengecoh luas yang memakai "semua/seluruh" atau diawali "Aneka", dan pengecoh topik yang diawali "Cara", masing-masing paling banyak seperlima.
     Jawaban benar yang menjadi pilihan terpanjang paling banyak 40% soal (acak = sepertiga). */
  function polaPengecoh(daftar) {
    var luas = [], topik = [], m = [], soal = 0, terpanjang = 0;
    daftar.forEach(function (teks) {
      (teks.soal || [{ pilihan: teks.pilihan }]).forEach(function (sl) {
        sl.pilihan.forEach(function (p) { if (p.jenis === 'luas') luas.push(p.t); if (p.jenis === 'topik') topik.push(p.t); });
        var b = sl.pilihan.filter(function (p) { return p.jenis === 'benar'; })[0];
        soal++;
        if (b && sl.pilihan.every(function (p) { return p === b || p.t.length < b.t.length; })) terpanjang++;
      });
    });
    var nLuas = luas.filter(function (t) { return /(^|\s)(semua|seluruh)(\s|$)/i.test(t); }).length, nTopik = topik.filter(function (t) { return /^cara\s/i.test(t); }).length;
    var nAneka = luas.filter(function (t) { return /^aneka\s/i.test(t); }).length;
    if (nLuas * 5 > luas.length) m.push('pengecoh luas berpola "semua/seluruh": ' + nLuas + ' dari ' + luas.length);
    if (nAneka * 5 > luas.length) m.push('pengecoh luas berpola "Aneka...": ' + nAneka + ' dari ' + luas.length);
    if (nTopik * 5 > topik.length) m.push('pengecoh topik berpola "Cara...": ' + nTopik + ' dari ' + topik.length);
    if (terpanjang * 5 > soal * 2) m.push('jawaban benar terlalu sering menjadi pilihan terpanjang: ' + terpanjang + ' dari ' + soal + ' soal');
    return { pesan: m, luas: luas.length, nLuas: nLuas, nAneka: nAneka, topik: topik.length, nTopik: nTopik, soal: soal, terpanjang: terpanjang };
  }
  var SekilasCek = { periksa: periksa, kataIsi: kataIsi, polaPengecoh: polaPengecoh };
  root.SekilasCek = SekilasCek;
  if (typeof module !== 'undefined') module.exports = SekilasCek;
})(typeof window !== 'undefined' ? window : globalThis);
