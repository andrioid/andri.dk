import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

function noWWW(req, res, next) {
  const host = req.get("host");
  if (host.match(/^www\..*/i)) {
    const nextHost = host.replace(/^www\./, "");
    const url = `${req.protocol}://${nextHost}${req.originalUrl}`;
    res.redirect(301, url);
    return;
  }
  next();
}

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' umami.andri.dk",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://public.api.bsky.app https://umami.andri.dk",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  next();
}

const app = express();
app.use(securityHeaders);
app.use(noWWW);
app.use(express.static("dist/client/"));
app.use(ssrHandler);
console.log("[andri.dk] Server listening on port 3000");

app.listen(3000);
