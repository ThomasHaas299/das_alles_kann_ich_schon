// Baut aus src/ die eigenständige Seite dist/index.html für den Webserver.
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

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}</head>
<body>
${body.replace("<!-- script -->", `<script>\n${js}</script>`)}</body>
</html>
`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
console.log("dist/index.html geschrieben");
