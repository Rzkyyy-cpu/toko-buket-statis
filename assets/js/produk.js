/* produk.js — beranda (unggulan), daftar produk (cari/filter/urut), halaman detail + pesan WA. */
(function () {
  "use strict";
  const { S, PRODUK, $, esc, rp, KAT, waUrl, tgl, rating, stars, ph, foto, cardHTML, hydrate } = window.BBS;

  const feat = $("#unggulan");
  if (feat) feat.innerHTML = PRODUK.filter(p => p.unggulan).sort((a, b) => a.urut - b.urut).map(cardHTML).join("");

  /* ---- Daftar produk ---- */
  const list = $("#daftar");
  if (list) {
    const st = { q: "", kat: new URLSearchParams(location.search).get("kat") || "semua", urut: "rekomendasi" };
    if (st.kat !== "semua" && !KAT[st.kat]) st.kat = "semua";
    const cmp = { rekomendasi: (a, b) => a.urut - b.urut, murah: (a, b) => a.harga - b.harga, mahal: (a, b) => b.harga - a.harga, nama: (a, b) => a.nama.localeCompare(b.nama, "id") };
    const chips = document.querySelectorAll(".chip");
    const draw = () => {
      const q = st.q.trim().toLowerCase();
      const rows = PRODUK.filter(p => (st.kat === "semua" || p.kategori === st.kat) && (!q || (p.nama + " " + KAT[p.kategori]).toLowerCase().includes(q))).sort(cmp[st.urut]);
      list.innerHTML = rows.map(cardHTML).join("");
      $("#jumlah").textContent = rows.length + " produk";
      $("#kosong").hidden = rows.length > 0;
      chips.forEach(c => c.setAttribute("aria-pressed", c.dataset.kat === st.kat));
    };
    chips.forEach(c => c.addEventListener("click", () => { st.kat = c.dataset.kat; draw(); }));
    $("#cari").addEventListener("input", e => { st.q = e.target.value; draw(); });
    $("#urut").addEventListener("change", e => { st.urut = e.target.value; draw(); });
    $("#reset").addEventListener("click", () => { st.q = ""; st.kat = "semua"; $("#cari").value = ""; draw(); });
    draw();
  }

  /* ---- Detail produk ---- */
  const det = $("#detail");
  if (det) {
    const p = PRODUK.find(x => x.id === new URLSearchParams(location.search).get("id"));
    if (!p) {
      det.innerHTML = `<div class="empty"><h1>Produk tidak ditemukan</h1><p>Produk yang kamu cari mungkin sudah tidak tersedia.</p><a class="btn" href="produk.html">Lihat semua produk</a></div>`;
      const w = $("#ulasan-produk-wrap"); if (w) w.hidden = true;
      return;
    }
    document.title = p.nama + " | " + S.nama;
    const papan = p.kategori === "papan", r = rating(p.id);
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    det.innerHTML = `<nav class="crumb" aria-label="Jejak halaman"><a href="index.html">Beranda</a> / <a href="produk.html">Produk</a> / <span>${esc(p.nama)}</span></nav>
<div class="detail">
  <div class="thumb big">${ph(p)}${foto(p)}</div>
  <div class="info">
    <h1>${esc(p.nama)}</h1>
    <p class="meta"><span>${KAT[p.kategori]}</span>${r.n ? `<a class="rt" href="#ulasan-produk-wrap">${stars(r.avg)} (${r.n} ulasan)</a>` : ""}</p>
    <p class="price big">${rp(p.harga)}${papan ? " <small>/ sewa</small>" : ""}</p>
    <p>${esc(p.deskripsi)}</p>
    <div class="order">
      <div class="two">
        <div class="field"><label for="jml">Jumlah</label><input id="jml" type="number" min="1" max="99" value="1" inputmode="numeric"></div>
        <div class="field"><label for="tgl">Tanggal dibutuhkan</label><input id="tgl" type="date" min="${today}"></div>
      </div>
      <div class="field"><label for="teks">${papan ? "Tulisan di papan" : "Tulisan di kartu ucapan"}</label><textarea id="teks" rows="2" maxlength="200"></textarea></div>
      <div class="field"><label for="cat">Catatan</label><input id="cat" type="text" maxlength="200" placeholder="Warna, alamat kirim, atau permintaan lain"></div>
      <p class="total"><span>Perkiraan total</span><strong id="total"></strong></p>
      <a id="pesan" class="btn btn-wa btn-lg" href="#setup">Pesan lewat WhatsApp</a>
      <p class="hint">Pembayaran dilakukan lewat WhatsApp setelah pesananmu dikonfirmasi.</p>
      <div data-pay></div>
    </div>
  </div>
</div>`;
    const upd = () => {
      const j = Math.max(1, Math.min(99, parseInt($("#jml").value, 10) || 1));
      const L = [`Halo ${S.nama}, saya mau pesan:`, `- Produk: ${p.nama}`, `- Jumlah: ${j}`, `- Perkiraan total: ${rp(p.harga * j)}`];
      if ($("#tgl").value) L.push("- Tanggal dibutuhkan: " + tgl($("#tgl").value));
      if ($("#teks").value.trim()) L.push(`- ${papan ? "Tulisan papan" : "Tulisan kartu"}: ${$("#teks").value.trim()}`);
      if ($("#cat").value.trim()) L.push("- Catatan: " + $("#cat").value.trim());
      L.push("", "Mohon info ketersediaan dan cara pembayarannya. Terima kasih!");
      $("#total").textContent = rp(p.harga * j);
      $("#pesan").href = waUrl(L.join("\n"));
    };
    ["jml", "tgl", "teks", "cat"].forEach(id => $("#" + id).addEventListener("input", upd));
    upd(); hydrate(det);

    const rel = $("#terkait");
    if (rel) rel.innerHTML = PRODUK.filter(x => x.kategori === p.kategori && x.id !== p.id).slice(0, 4).map(cardHTML).join("");
  }
})();
