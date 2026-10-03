// /api/auth — langkah 1 login panel admin: arahkan ke halaman izin GitHub.
// Butuh env di Vercel: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (dari GitHub OAuth App).
const crypto = require("crypto");

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    return res.end("GITHUB_CLIENT_ID belum diisi di Environment Variables Vercel.");
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const state = crypto.randomBytes(16).toString("hex"); // cegah CSRF
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/callback`,
    scope: process.env.GITHUB_SCOPE || "public_repo", // ganti ke "repo" kalau repo dijadikan private
    state
  });
  res.setHeader("Set-Cookie", `decap_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params}`);
  res.end();
};
