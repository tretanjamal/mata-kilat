/* Profil suara speechSynthesis untuk arahan (pola Dear Zuzu! dan Ding Dong Delivery). Sumber narasi final menunggu
   keputusan kreator (suara perangkat, rekaman guru, atau TTS); sampai itu, arahan memakai suara perangkat dan bisa dimatikan.
   Nada dibatasi 0,9-1,15 dan kecepatan 0,8-0,95 supaya jelas. Teks bacaan tidak pernah dibacakan (yang dilatih membaca). */
(function (root) {
  root.SUARA = {
    namaPria: /david|mark|guy|james|george|daniel|fred|ryan|andrew|brian|christopher|eric|roger|steffan|thomas|andika|ardi|\bmale\b|pria|laki/i,
    narasi: { jenis: 'w', pitch: 1.1, pitchLain: 1.15, rate: 0.95 },
    tokoh: {
      tasi: { jenis: 'w', pitch: 1.12, pitchLain: 1.15, rate: 0.95 },
      ulin: { jenis: 'p', pitch: 0.92, pitchLain: 1.0, rate: 0.82 },
      tupi: { jenis: 'p', pitch: 1.12, pitchLain: 1.15, rate: 0.95 }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
