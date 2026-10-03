/* loader.js — memuat isi situs dari folder content/ (diedit lewat panel admin /admin),
   lalu menjalankan script lain secara berurutan. */
(async function () {
  "use strict";
  const ambil = f => fetch("content/" + f + ".json", { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
  try {
    const [situs, produk, ulasan] = await Promise.all([ambil("situs"), ambil("produk"), ambil("ulasan")]);
    window.SITE = situs || {};
    window.PRODUK = ((produk && produk.produk) || []).filter(p => p && p.id && p.aktif !== false);
    window.ULASAN = (ulasan && ulasan.ulasan) || [];
  } catch (e) {
    window.SITE = window.SITE || {}; window.PRODUK = []; window.ULASAN = [];
    console.error("Gagal memuat data situs. Buka lewat server (mis. Live Server), bukan klik dua kali file.", e);
  }

  /* Teks halaman yang bisa diedit dari admin */
  const S = window.SITE;
  document.querySelectorAll("[data-text]").forEach(el => { const v = S[el.dataset.text]; if (v) el.textContent = v; });
  document.querySelectorAll("[data-paragraf]").forEach(el => {
    const v = S[el.dataset.paragraf]; if (!v) return;
    el.replaceChildren(...String(v).split(/\n\s*\n/).map(t => { const p = document.createElement("p"); p.textContent = t.trim(); return p; }));
  });

  /* Jalankan script halaman berurutan */
  for (const f of ["core", "produk", "ulasan", "pengaduan"]) {
    await new Promise(ok => { const s = document.createElement("script"); s.src = "assets/js/" + f + ".js"; s.onload = s.onerror = ok; document.body.appendChild(s); });
  }
})();
