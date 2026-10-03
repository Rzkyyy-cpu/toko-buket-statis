/* ulasan.js — daftar ulasan, ringkasan rating, dan formulir ulasan (dikirim ke admin lewat WhatsApp). */
(function () {
  "use strict";
  const { S, PRODUK, $, $$, esc, tgl, ulasanAktif, rating, stars, waUrl } = window.BBS;
  const nama = id => (PRODUK.find(p => p.id === id) || {}).nama || "";
  const idUrl = new URLSearchParams(location.search).get("id") || "";

  const card = u => `<article class="review"><header><strong>${esc(u.nama)}</strong>${stars(u.bintang)}</header><p>${esc(u.teks)}</p><footer>${nama(u.produk) ? `<a href="produk-detail.html?id=${encodeURIComponent(u.produk)}">${esc(nama(u.produk))}</a> · ` : ""}${tgl(u.tanggal)}${u.demo ? ' <span class="badge-demo">Contoh</span>' : ""}</footer></article>`;
  const kosong = `<p class="empty-note">Belum ada ulasan. Jadilah yang pertama menulis setelah pesananmu sampai.</p>`;

  const ring = $("#ulasan-ringkas");
  if (ring) {
    const r = rating();
    ring.innerHTML = r.n ? `<div class="summary"><strong>${r.avg.toFixed(1).replace(".", ",")}</strong><div>${stars(r.avg)}<br><span>${r.n} ulasan</span></div></div>` : "";
  }
  const all = $("#ulasan-list");
  if (all) { const rows = ulasanAktif().slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 6); all.innerHTML = rows.length ? rows.map(card).join("") : kosong; }
  const one = $("#ulasan-produk");
  if (one) { const rows = ulasanAktif().filter(u => u.produk === idUrl); one.innerHTML = rows.length ? rows.map(card).join("") : kosong; }

  $$("[data-ulasan-form]").forEach((el, k) => {
    const fixed = el.hasAttribute("data-produk-url") ? idUrl : "";
    const p = "u" + k + "-";
    el.innerHTML = `<details class="write"><summary class="btn btn-ghost">Tulis ulasan</summary><div class="formcard">
<div class="two"><div class="field"><label for="${p}nama">Nama</label><input id="${p}nama" autocomplete="name" maxlength="60"></div>
<div class="field"><label for="${p}prod">Produk</label><select id="${p}prod">${PRODUK.map(x => `<option value="${esc(x.id)}"${x.id === fixed ? " selected" : ""}>${esc(x.nama)}</option>`).join("")}</select></div></div>
<fieldset class="ratefs"><legend>Rating</legend><div class="rate">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="${p}r" id="${p}r${n}" value="${n}"><label for="${p}r${n}" title="${n} bintang"><span class="sr">${n} bintang</span>★</label>`).join("")}</div></fieldset>
<div class="field"><label for="${p}teks">Ulasan</label><textarea id="${p}teks" rows="4" maxlength="500"></textarea></div>
<a class="btn btn-wa disabled" id="${p}kirim" href="#">Kirim lewat WhatsApp</a>
<p class="hint" id="${p}info">Ulasan dikirim ke admin dulu dan tampil di situs setelah ditinjau.</p></div></details>`;
    const g = s => $("#" + p + s), rv = () => (el.querySelector(`input[name="${p}r"]:checked`) || {}).value;
    const ready = () => g("nama").value.trim() && g("teks").value.trim() && rv();
    const upd = () => {
      const a = g("kirim"), ok = !!ready();
      a.classList.toggle("disabled", !ok);
      a.href = ok ? waUrl(`Halo ${S.nama}, saya ingin menulis ulasan.\nNama: ${g("nama").value.trim()}\nProduk: ${nama(g("prod").value)}\nRating: ${"★".repeat(rv())}${"☆".repeat(5 - rv())} (${rv()}/5)\nUlasan: ${g("teks").value.trim()}`) : "#";
    };
    el.addEventListener("input", upd);
    g("kirim").addEventListener("click", e => { if (!ready()) { e.preventDefault(); g("info").textContent = "Lengkapi nama, rating, dan ulasan dulu."; } });
    upd();
  });
})();
