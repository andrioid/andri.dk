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

const app = express();
app.use(noWWW);
app.use(express.static("dist/client/"));
app.use(ssrHandler);
console.log("[andri.dk] Server listening on port 3000");

app.listen(3000);
