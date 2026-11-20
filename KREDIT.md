# Kredit: Mata Kilat: Jurus Skimming dan Scanning

Pengembang: Jamaluddin (UPTD SMPN 2 Robatal) dan Rohmatun Amina, S.Pd.SD., M.Pd. (Guru UPTD SDN Lepelle 1). Dibuat untuk Ruang Murid.

## Isi
- Semua teks bacaan, soal, jadwal, harga, dan nama tokoh ditulis khusus untuk gim ini dan bersifat rekaan. Termasuk bank latihan (`config/latihan.js`, `config/teks-sekilas.js`) dan teks dari pembangkit soal (`js/engine/pembangkit.js`).
- Kartu "Tahukah kamu?" memuat fakta satwa (tarsius, kunang-kunang, kukang) yang perlu dicek guru sebelum terbit.
- Rujukan materi: Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran; Ejaan Bahasa Indonesia yang Disempurnakan Edisi V (Badan Pengembangan dan Pembinaan Bahasa, 2022); KBBI daring.

## Huruf (SIL Open Font License 1.1, dibundel di `assets/fonts/`)
- Baloo 2 (Ek Type), berkas lisensi `OFL-Baloo2.txt`.
- Andika (SIL International), berkas lisensi `OFL-Andika.txt`.

## Gambar
- Latar (Rumah Pohon, Telaga Teratai, Pasar Dahan, Air Terjun Embun, Pohon Kunang, layar judul), peta, key art, benda festival, dan tangan penunjuk: dibuat kreator dengan alat pembuat gambar kecerdasan artifisial dari prompt di `docs/ASET-PROMPT.md` (November 2026). Nama alat dan paket langganan: **perlu dilengkapi kreator**.
- Peta: bulan lukisan di cakrawala dihapus oleh `tools/proses-aset.py` (piksel bulan diganti warna langit di sekitarnya), supaya bulan SVG di gim bisa naik setiap level selesai.
- Lembar acuan tokoh Tasi, Ulin, dan Tupi: dibuat kreator dengan alat yang sama. Tokoh di dalam gim digambar ulang sebagai SVG oleh pengembang (kode).
- Ikon, daun penutup, kunang-kunang, toples, logo, dan tokoh SVG: digambar dengan kode (`js/engine/seni.js`).
- Foto pengembang: milik masing-masing pengembang, dipakai atas izin mereka.

## Suara
- Musik `musik-judul`, `musik-jelajah`, `musik-festival`, dan `jingle-level`: dibuat kreator dengan Suno dari prompt di `docs/ASET-PROMPT.md` (November 2026). Paket langganan dan syarat pakai: **perlu dicatat kreator**.
  Diproses `tools/proses-aset.py`: dipotong sampai akhir bagian ulang (titik ulang dicari `tools/analisis-musik.js`), lalu dienkode ulang menjadi MP3 mono 80 kbps dengan FFmpeg (paket `imageio-ffmpeg`, lisensi LGPL/GPL; alat pengembangan, tidak ikut di zip).
- Efek suara: sintesis WebAudio (kode).
- Arahan dibacakan dengan suara perangkat (speechSynthesis) bila tersedia; tidak ada rekaman suara.

## Video
- Video pembuka `assets/video/pembuka.mp4`: dibuat kreator dengan Google Flow (November 2026), diperkecil menjadi 1280x720 H.264 dengan suara AAC mono yang dilembutkan, memakai FFmpeg. Diputar sekali di awal Rumah Pohon, bisa dilewati dan diputar ulang dari Buku Jurus.
- Tiga klip promosi (`rimba_senja`, `lompatan_jitu`, `malam_seribu_kunang`): dibuat kreator dengan Google Flow, hanya untuk promosi dan tidak masuk zip.
- Thumbnail: key art `key-art.png` buatan kreator, ditambah logo dan subjudul dari sistem SVG gim (`tools/thumbnail.html`).

## Kecerdasan artifisial
Pengembang memakai kecerdasan artifisial (KA) sebagai alat bantu: Claude (Anthropic) untuk kode dan pengujian, alat pembuat gambar dan video untuk aset visual, Suno untuk musik. Semua isi ditinjau guru. Rujukan: Purwarianti, A., dkk. (2025). *Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Pendidikan Dasar, dan Pendidikan Menengah*.
