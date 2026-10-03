// /api/callback — langkah 2 login panel admin: tukar kode GitHub jadi token,
// lalu kirim token ke jendela /admin dengan format pesan yang dipahami Decap CMS.
module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin = `https://${host}`;
  const url = new URL(req.url, origin);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const saved = ((req.headers.cookie || "").match(/(?:^|;\s*)decap_state=([a-f0-9]+)/) || [])[1];

  let status = "error";
  let content = { error: "Sesi login tidak valid. Tutup jendela ini lalu coba login lagi." };

  if (code && state && saved && state === saved) {
    try {
      const r = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        })
      });
      const data = await r.json();
      if (data.access_token) {
        status = "success";
        content = { token: data.access_token, provider: "github" };
      } else {
        content = { error: data.error_description || "GitHub menolak login." };
      }
    } catch (e) {
      content = { error: "Gagal menghubungi GitHub." };
    }
  }

  // Escape "<" supaya isi pesan tidak bisa menutup tag <script>
  const js = v => JSON.stringify(v).replace(/</g, "\\u003c");
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;

  res.setHeader("Set-Cookie", "decap_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(`<!doctype html><html lang="id"><meta charset="utf-8"><title>Login admin</title>
<body style="font-family:system-ui;padding:24px">
<p>${status === "success" ? "Login berhasil, jendela ini akan tertutup..." : "Login gagal. Tutup jendela ini lalu coba lagi."}</p>
<script>
(function () {
  var origin = ${js(origin)}, message = ${js(message)};
  if (!window.opener) return;
  // Kirim token HANYA ke halaman admin di domain yang sama
  function terima(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(message, origin);
    window.removeEventListener("message", terima);
    setTimeout(function () { window.close(); }, 400);
  }
  window.addEventListener("message", terima);
  window.opener.postMessage("authorizing:github", origin);
})();
</script></body></html>`);
};
