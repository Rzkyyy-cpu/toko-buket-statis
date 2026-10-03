/* pengaduan.js — formulir pengaduan -> template email siap kirim (mailto / Gmail / salin). */
(function () {
  "use strict";
  const { S, PRODUK, $, esc } = window.BBS;
  const form = $("#form-pengaduan");
  if (!form) return;
  $("#p-produk").innerHTML = `<option value="">Pilih produk</option>` + PRODUK.map(p => `<option>${esc(p.nama)}</option>`).join("") + `<option>Lebih dari satu produk / lainnya</option>`;
  const v = id => ($("#" + id).value || "").trim();
  const isi = (x, h) => x || `[${h}]`;

  function susun() {
    const nama = v("p-nama");
    const body = [
      `Yth. Tim ${S.nama},`, "", "Saya ingin menyampaikan pengaduan berikut.", "",
      "Nama                : " + isi(nama, "isi nama"),
      "No. WhatsApp        : " + isi(v("p-wa"), "isi nomor WhatsApp"),
      "Produk              : " + isi(v("p-produk"), "pilih produk"),
      "No./tanggal pesanan : " + isi(v("p-pesanan"), "isi jika ada"),
      "Jenis pengaduan     : " + v("p-jenis"),
      "", "Keluhan / kronologi:", isi(v("p-detail"), "jelaskan masalahnya"),
      "", "Harapan penyelesaian:", isi(v("p-harapan"), "isi harapan kamu"),
      "", "Foto/bukti terlampir pada email ini.", "", "Terima kasih,", isi(nama, "nama")
    ].join("\n");
    return { body, subject: `Pengaduan: ${v("p-jenis")} - ${nama || "Pelanggan"}`, ok: !!(nama && v("p-detail")) };
  }
  function upd() {
    const m = susun(), enc = encodeURIComponent, crlf = m.body.replace(/\n/g, "\r\n");
    $("#pratinjau").value = m.body;
    const okKirim = m.ok && !!S.email;
    const mail = $("#k-mail"), gm = $("#k-gmail");
    mail.href = okKirim ? `mailto:${S.email}?subject=${enc(m.subject)}&body=${enc(crlf)}` : "#";
    gm.href = okKirim ? `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(S.email)}&su=${enc(m.subject)}&body=${enc(crlf)}` : "#";
    [mail, gm].forEach(a => a.classList.toggle("disabled", !okKirim));
    $("#p-info").textContent = !S.email ? "Alamat email pengaduan belum diisi di panel admin (Pengaturan situs)." : m.ok ? "Lampirkan foto bukti langsung di email sebelum mengirim." : "Isi nama dan keluhan dulu supaya email siap dikirim.";
  }
  form.addEventListener("input", upd);
  form.addEventListener("submit", e => e.preventDefault());
  [$("#k-mail"), $("#k-gmail")].forEach(a => a.addEventListener("click", e => { if (a.classList.contains("disabled")) e.preventDefault(); }));
  $("#k-salin").addEventListener("click", () => {
    const t = $("#pratinjau"); t.select();
    (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).catch(() => document.execCommand("copy"));
    $("#p-info").textContent = "Template disalin. Tempel di email ke " + (S.email || "alamat email pengaduan") + ".";
  });
  upd();
})();
