/* core.js — helper, header/footer, kartu produk, gambar pengganti. Dimuat di semua halaman. */
(function () {
  "use strict";
  const S = window.SITE || {}, PRODUK = window.PRODUK || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rp = n => "Rp" + new Intl.NumberFormat("id-ID").format(n);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const KAT = { buket: "Buket", kue: "Kue", papan: "Papan ucapan" };
  const waOk = /^\d{9,15}$/.test(S.wa || "");
  const waUrl = t => waOk ? "https://wa.me/" + S.wa + "?text=" + encodeURIComponent(t) : "#setup";
  const tgl = d => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const ulasanAktif = () => (window.ULASAN || []).filter(u => S.tampilkanUlasanContoh || !u.demo);
  const rating = id => { const r = ulasanAktif().filter(u => !id || u.produk === id); return { n: r.length, avg: r.length ? r.reduce((a, u) => a + u.bintang, 0) / r.length : 0 }; };
  const stars = v => `<span class="stars" style="--p:${(v / 5 * 100).toFixed(0)}%" role="img" aria-label="Rating ${v.toFixed(1).replace(".", ",")} dari 5">★★★★★</span>`;

  /* ---------- Gambar pengganti (dipakai sampai foto asli dipasang) ---------- */
  const TEMA = {
    rose:  { bg: ["#FBE7EB", "#F3C6D1"], c: ["#A3305A", "#F2AEBE", "#FFFFFF"] },
    blush: { bg: ["#FDF0F2", "#F7D6DD"], c: ["#E58AA5", "#F8C9D5", "#FFFFFF"] },
    blue:  { bg: ["#E8F0FA", "#C4D6EC"], c: ["#4E73A8", "#9DB6D8", "#FFFFFF"] },
    mix:   { bg: ["#F1EEF8", "#DAD1EE"], c: ["#8A5FA8", "#F2AEBE", "#9DB6D8"] },
    koran: { bg: ["#EFEBE1", "#D9D2BF"], c: ["#C95A80", "#F4C9D3", "#FFFFFF"] }
  };
  const PAPAN = {
    mirror:      { bg: ["#EEF2F6", "#CBD5E0"], f: "#DDE6EE", s: "#7C8DA1" },
    akrilik:     { bg: ["#FBF1F3", "#F1D7DD"], f: "#FFFFFF", s: "#C2879A" },
    akrilikblue: { bg: ["#E8F0FA", "#C4D6EC"], f: "#DCE8F6", s: "#4E73A8" }
  };
  let uid = 0;
  const bloom = (cx, cy, w, col) => `<use href="#bloom" x="${cx - w / 2}" y="${cy - w / 2}" width="${w}" height="${w}" style="color:${col}"/>`;
  function ph(p) {
    const g = "g" + (++uid);
    const grad = t => `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient></defs><rect width="400" height="500" fill="url(#${g})"/>`;
    if (p.kategori === "kue") {
      const t = TEMA[p.tema] || TEMA.blush, c = t.c[0];
      return `<svg class="ph" viewBox="0 0 400 500" aria-hidden="true">${grad(t)}<ellipse cx="200" cy="392" rx="150" ry="22" fill="#fff" fill-opacity=".85"/><rect x="85" y="275" width="230" height="110" rx="14" fill="#FFF8F3"/><path d="M85 300 q19 26 38 0 t38 0 t38 0 t38 0 t38 0 t38 0 V289 a14 14 0 0 0 -14 -14 H99 a14 14 0 0 0 -14 14 Z" fill="${c}" fill-opacity=".55"/><rect x="125" y="190" width="150" height="90" rx="12" fill="#FFF8F3"/><path d="M125 212 q12.5 20 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V202 a12 12 0 0 0 -12 -12 H137 a12 12 0 0 0 -12 12 Z" fill="${c}" fill-opacity=".75"/><rect x="195" y="140" width="10" height="50" rx="4" fill="${t.c[1]}"/><path d="M200 112 c10 12 8 24 0 28 c-8 -4 -10 -16 0 -28 Z" fill="#F2C46B"/><circle cx="160" cy="330" r="7" fill="${c}"/><circle cx="200" cy="340" r="7" fill="${c}"/><circle cx="240" cy="330" r="7" fill="${c}"/></svg>`;
    }
    if (p.kategori === "papan") {
      const t = PAPAN[p.tema] || PAPAN.akrilik;
      return `<svg class="ph" viewBox="0 0 400 500" aria-hidden="true">${grad(t)}<path d="M130 300 L100 450 M270 300 L300 450" stroke="${t.s}" stroke-width="8" stroke-linecap="round"/><rect x="55" y="90" width="290" height="220" rx="10" fill="${t.f}" stroke="${t.s}" stroke-width="6"/><path d="M75 300 L190 100" stroke="#fff" stroke-opacity=".5" stroke-width="26"/><text x="200" y="205" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="30" fill="${t.s}">Selamat &amp; Sukses</text></svg>`;
    }
    const t = TEMA[p.tema] || TEMA.rose;
    return `<svg class="ph" viewBox="0 0 400 500" aria-hidden="true">${grad(t)}<g stroke="#35533F" stroke-width="5" stroke-linecap="round" fill="none"><path d="M200 340 V250"/><path d="M190 340 L140 260"/><path d="M210 340 L262 258"/></g><ellipse cx="112" cy="318" rx="40" ry="13" transform="rotate(-28 112 318)" fill="#35533F"/><ellipse cx="288" cy="316" rx="40" ry="13" transform="rotate(28 288 316)" fill="#35533F"/>${bloom(200, 175, 170, t.c[0])}${bloom(128, 240, 120, t.c[1])}${bloom(274, 238, 124, t.c[2])}${bloom(200, 292, 96, t.c[1])}<path d="M100 335 L300 335 L224 485 L176 485 Z" fill="#fff" fill-opacity=".78"/><path d="M176 485 L224 485 L300 335 L250 335 Z" fill="#000" fill-opacity=".05"/></svg>`;
  }
  const fotoSrc = p => p.foto ? String(p.foto).replace(/^\//, "") : `assets/img/products/${p.id}.jpg`;
  const foto = p => `<img src="${esc(fotoSrc(p))}" alt="${esc(p.nama)}" loading="lazy" onerror="this.remove()">`;

  function cardHTML(p) {
    const url = "produk-detail.html?id=" + encodeURIComponent(p.id), r = rating(p.id);
    const wa = waUrl(`Halo ${S.nama}, saya tertarik dengan ${p.nama} (${rp(p.harga)}). Apakah masih tersedia?`);
    return `<article class="card"><a class="thumb" href="${url}" tabindex="-1" aria-hidden="true">${ph(p)}${foto(p)}</a><div class="card-body"><h3><a href="${url}">${esc(p.nama)}</a></h3><p class="meta"><span>${KAT[p.kategori]}</span>${r.n ? `<span class="rt">${stars(r.avg)} (${r.n})</span>` : ""}</p><div class="buy"><strong class="price">${rp(p.harga)}${p.kategori === "papan" ? " <small>/ sewa</small>" : ""}</strong><a class="btn btn-sm" href="${wa}">Pesan</a></div></div></article>`;
  }

  /* ---------- Komponen bersama ---------- */
  const pay = () => !(S.pembayaran || []).length ? "" : `<ul class="pay" aria-label="Metode pembayaran">${(S.pembayaran || []).map(m => `<li><img src="assets/img/payments/${esc(m.id)}.svg" alt="${esc(m.nama)}" width="72" height="30" loading="lazy"></li>`).join("")}</ul>`;
  function peta(el) {
    if (!S.mapQuery) { el.innerHTML = `<div class="map-empty"><p>Peta tampil di sini setelah alamat toko diisi (isi <code>mapQuery</code> di panel admin).</p></div>`; return; }
    el.innerHTML = `<iframe title="Lokasi ${esc(S.nama)} di Google Maps" src="https://www.google.com/maps?q=${encodeURIComponent(S.mapQuery)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  }
  function hydrate(root) {
    root = root || document;
    $$("[data-pay]", root).forEach(e => e.innerHTML = pay());
    $$("[data-wa]", root).forEach(e => e.setAttribute("href", waUrl(e.getAttribute("data-wa") || `Halo ${S.nama}, saya mau tanya.`)));
    $$("[data-alamat]", root).forEach(e => e.textContent = S.alamat || "Alamat toko belum diisi.");
    $$("[data-jam]", root).forEach(e => e.innerHTML = (S.jam || []).map(j => `<dt>${esc(j.hari)}</dt><dd>${esc(j.waktu)}</dd>`).join(""));
    $$("[data-map]", root).forEach(peta);
    $$("[data-maplink]", root).forEach(a => { if (S.mapQuery) a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.mapQuery); else a.hidden = true; });
    $$("[data-email]", root).forEach(a => { if (S.email) { a.href = "mailto:" + S.email; a.textContent = S.email; } else a.hidden = true; });
    $$("[data-ig]", root).forEach(a => { if (S.instagram) a.href = "https://instagram.com/" + S.instagram.replace(/^@/, ""); else a.hidden = true; });
  }

  /* ---------- Header, footer, banner setup ---------- */
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="bloom" viewBox="-50 -50 100 100"><g fill="currentColor">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="0" cy="-27" rx="13" ry="22" transform="rotate(${a})"/>`).join("")}</g><g fill="#000" fill-opacity=".1">${[22, 67, 112, 157, 202, 247, 292, 337].map(a => `<ellipse cx="0" cy="-15" rx="7" ry="12" transform="rotate(${a})"/>`).join("")}</g><circle r="9" fill="#F5D27A"/></symbol></svg>`;
  const pg = document.body.dataset.page || "";
  const nav = [["home", "index.html", "Beranda"], ["produk", "produk.html", "Produk"], ["", "index.html#ulasan", "Ulasan"], ["", "index.html#lokasi", "Lokasi"], ["pengaduan", "pengaduan.html", "Pengaduan"]];
  const miss = [!waOk && "wa", !S.email && "email", !S.alamat && "alamat", !S.mapQuery && "mapQuery"].filter(Boolean);
  const banner = miss.length ? `<div class="setup-note" role="status">Mode pengaturan: isi <code>${miss.join(", ")}</code> di panel admin (/admin → Pengaturan situs). Banner ini hilang otomatis setelah semuanya terisi.</div>` : "";
  const header = `<a class="skip" href="#main">Lewati ke konten</a><header class="site-header"><div class="wrap bar"><a class="brand" href="index.html"><img src="assets/img/logo.svg" alt="" width="34" height="34"><span>${esc(S.nama)}</span></a><nav class="nav" id="nav" aria-label="Menu utama">${nav.map(n => `<a href="${n[1]}"${n[0] && n[0] === pg ? ' aria-current="page"' : ""}>${n[2]}</a>`).join("")}</nav><a class="btn btn-wa btn-sm" data-wa href="#setup">Chat WhatsApp</a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button></div></header>`;
  const footer = `<footer class="site-footer"><div class="wrap foot"><div><p class="foot-brand">${esc(S.nama)}</p><p>${esc(S.tagline || "")}</p><p><a data-ig href="#" target="_blank" rel="noopener">Instagram</a></p></div><div><h3>Jam buka</h3><dl class="hours" data-jam></dl></div><div><h3>Hubungi kami</h3><p data-alamat></p><p><a data-wa href="#setup">Chat WhatsApp</a></p><p><a data-email href="#"></a></p><p><a href="pengaduan.html">Layanan pengaduan</a></p></div></div><div class="wrap foot-pay"><h3>Metode pembayaran</h3><div data-pay></div><p class="small">Pembayaran hanya dilakukan lewat WhatsApp setelah pesanan dikonfirmasi.</p></div><div class="wrap copy">© ${new Date().getFullYear()} ${esc(S.nama)}. Semua hak dilindungi.</div></footer>`;
  document.body.insertAdjacentHTML("afterbegin", sprite + banner + header);
  document.body.insertAdjacentHTML("beforeend", footer);

  const hd = $(".site-header"), mb = $(".menu-btn");
  mb.addEventListener("click", () => { const o = hd.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href="#setup"]');
    if (a) { e.preventDefault(); alert("Nomor WhatsApp belum diisi. Isi lewat panel admin (/admin)."); }
  });
  hydrate();

  window.BBS = { S, PRODUK, $, $$, rp, esc, KAT, waUrl, waOk, tgl, ulasanAktif, rating, stars, ph, foto, cardHTML, pay, hydrate };
})();
