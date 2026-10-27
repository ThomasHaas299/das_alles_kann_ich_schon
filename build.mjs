// Baut aus src/ zwei Dateien:
//   dist/index.html    – vollständige Seite für den Webserver
//   dist/artifact.html – dieselbe Seite ohne <html>/<head>/<body>-Gerüst (für claude.ai-Artifacts)
// Die Typen werden mit Node-Bordmitteln entfernt; geprüft wird vorher mit `tsc`.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const ts = readFileSync("src/rechnen.ts", "utf8");
const js = stripTypeScriptTypes(ts, { mode: "strip" });
const template = readFileSync("src/template.html", "utf8");

const [head, body] = template.split("<!-- body -->");
if (body === undefined) {
	throw new Error("Marker <!-- body --> fehlt in src/template.html");
}
const bodyWithScript = body.replace("<!-- script -->", `<script>\n${js}</script>`);

const full = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head.replace(/^<meta name="claude:viewport-fit-sides".*\n/m, "")}</head>
<body>
${bodyWithScript}</body>
</html>
`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", full);
writeFileSync("dist/artifact.html", head + bodyWithScript);
console.log("dist/index.html und dist/artifact.html geschrieben");
