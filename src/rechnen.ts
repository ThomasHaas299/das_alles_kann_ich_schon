// Rechenblatt-Generator: erzeugt Plus-, Minus-, Mal- und Geteilt-Aufgaben zum Ausdrucken.
// Einstellungen werden pro Gerät im localStorage gemerkt.

const OPS = ["add", "sub", "tim", "div"] as const;
type Op = (typeof OPS)[number];

const OP_SIGN: Record<Op, string> = { add: "+", sub: "–", tim: "·", div: ":" };
const OP_NAME: Record<Op, string> = { add: "Plus", sub: "Minus", tim: "Mal", div: "Geteilt" };

const COUNTS = [20, 40, 60] as const;
type Count = (typeof COUNTS)[number];

const MAX_ROW = 25;
const MAX_NUMBER = 100_000;
const STORAGE_KEY = "rechnen.settings.v1";

interface Settings {
	types: Op[];
	mix: boolean;
	/** Lücke auch vorne oder in der Mitte (___ + 7 = 23) */
	complement: boolean;
	/** Tauschaufgaben: die beiden Zahlen zufällig vertauschen */
	commutative: boolean;
	count: Count;
	/** Plus/Minus: größte Zahl der Aufgabe (Summe bzw. Minuend) */
	minResult: number;
	maxResult: number;
	/** Plus/Minus: zweite Zahl (Summand bzw. Subtrahend) */
	minCalc: number;
	maxCalc: number;
	/** Mal/Geteilt: Einmaleins-Reihen */
	rows: number[];
	/** Mal/Geteilt: größter anderer Faktor */
	maxFactor: number;
	showSolutions: boolean;
	name: string;
}

const DEFAULTS: Readonly<Settings> = {
	types: ["add", "sub"],
	mix: true,
	complement: false,
	commutative: false,
	count: 40,
	minResult: 20,
	maxResult: 100,
	minCalc: 4,
	maxCalc: 17,
	rows: [0, 1, 2, 4, 10],
	maxFactor: 10,
	showSolutions: false,
	name: "",
};

type Slot = "x1" | "x2" | "r";

/** x1 op x2 = r */
interface Task {
	readonly op: Op;
	readonly x1: number;
	readonly x2: number;
	readonly r: number;
	readonly blank: Slot;
}

// ---------------------------------------------------------------- Zufall

function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Ganzzahl in [min, max]. bias > 1 bevorzugt größere Zahlen, bias < 1 kleinere.
 */
function biasedInt(min: number, max: number, bias: number): number {
	return min + Math.floor(Math.random() ** (1 / bias) * (max - min + 1));
}

function coin(): boolean {
	return Math.random() < 0.5;
}

function pick<T>(items: readonly T[]): T {
	const item = items[randInt(0, items.length - 1)];
	if (item === undefined) {
		throw new Error("pick() auf leerer Liste");
	}
	return item;
}

function shuffle<T>(items: T[]): T[] {
	for (let i = items.length - 1; i > 0; i--) {
		const j = randInt(0, i);
		[items[i], items[j]] = [items[j] as T, items[i] as T];
	}
	return items;
}

// ---------------------------------------------------------------- Aufgaben

interface Parts {
	a: number;
	b: number;
	/** Summe bzw. Produkt */
	total: number;
}

function addParts(s: Settings): Parts {
	const total = biasedInt(s.minResult, s.maxResult, 3);
	const b = biasedInt(Math.min(total, s.minCalc), Math.min(total, s.maxCalc), 1.7);
	const a = total - b;
	return s.commutative && coin() ? { a: b, b: a, total } : { a, b, total };
}

function timesParts(s: Settings): Parts {
	const row = pick(s.rows);
	const other = randInt(0, s.maxFactor);
	// Die Reihe steht hinten: 3 · 4 gehört zur Vierer-Reihe
	return s.commutative && coin()
		? { a: row, b: other, total: row * other }
		: { a: other, b: row, total: row * other };
}

/** Wäre die Aufgabe mit der Lücke an dieser Stelle noch eindeutig lösbar? */
function isUnique(op: Op, x1: number, x2: number, blank: Slot): boolean {
	if (op === "tim") {
		// 0 · ___ = 0 hat beliebig viele Lösungen
		return !(blank === "x1" && x2 === 0) && !(blank === "x2" && x1 === 0);
	}
	if (op === "div") {
		// 0 : ___ = 0 ebenso
		return !(blank === "x2" && x1 === 0);
	}
	return true;
}

function withBlank(op: Op, x1: number, x2: number, r: number, s: Settings): Task {
	const slots: Slot[] = s.complement ? ["x1", "x2", "r"] : ["r"];
	const blank = pick(slots.filter((slot) => isUnique(op, x1, x2, slot)));
	return { op, x1, x2, r, blank };
}

function makeTask(op: Op, s: Settings): Task {
	switch (op) {
		case "add": {
			const p = addParts(s);
			return withBlank(op, p.a, p.b, p.total, s);
		}
		case "sub": {
			const p = addParts(s);
			return withBlank(op, p.total, p.b, p.a, s);
		}
		case "tim": {
			const p = timesParts(s);
			return withBlank(op, p.a, p.b, p.total, s);
		}
		case "div": {
			let p = timesParts(s);
			// Durch 0 wird nicht geteilt. Terminiert, weil check() eine Reihe ≠ 0 verlangt.
			while (p.b === 0) {
				p = timesParts(s);
			}
			return withBlank(op, p.total, p.b, p.a, s);
		}
	}
}

/** Fehlermeldung, falls sich mit diesen Einstellungen keine Aufgaben bilden lassen */
function check(s: Settings): string | null {
	if (s.types.length === 0) {
		return "Bitte mindestens eine Rechenart wählen.";
	}
	const needsRows = s.types.includes("tim") || s.types.includes("div");
	if (needsRows && s.rows.length === 0) {
		return "Bitte für Mal und Geteilt mindestens eine Reihe wählen.";
	}
	if (s.types.includes("div") && s.rows.every((row) => row === 0)) {
		return "Durch 0 kann man nicht teilen. Bitte für Geteilt noch eine andere Reihe wählen.";
	}
	return null;
}

function generate(s: Settings): Task[] {
	// gleichmäßig auf die Rechenarten verteilen, der Rest geht an die ersten
	const base = Math.floor(s.count / s.types.length);
	let rest = s.count % s.types.length;
	const tasks: Task[] = [];
	for (const op of s.types) {
		const n = base + (rest > 0 ? 1 : 0);
		rest--;
		for (let i = 0; i < n; i++) {
			tasks.push(makeTask(op, s));
		}
	}
	return s.mix ? shuffle(tasks) : tasks;
}

// ---------------------------------------------------------------- Einstellungen prüfen und speichern

function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

function toInt(v: unknown, fallback: number, min: number, max: number): number {
	const n = typeof v === "string" ? Number.parseInt(v, 10) : v;
	return typeof n === "number" && Number.isFinite(n) ? clamp(Math.round(n), min, max) : fallback;
}

function toBool(v: unknown, fallback: boolean): boolean {
	return typeof v === "boolean" ? v : fallback;
}

function isCount(v: unknown): v is Count {
	return COUNTS.some((c) => c === v);
}

/** Bereiche so korrigieren, dass max > min gilt (wie im PHP-Original) */
function fixRanges(s: Settings): Settings {
	return {
		...s,
		maxResult: Math.max(s.maxResult, s.minResult + 1),
		maxCalc: Math.max(s.maxCalc, s.minCalc + 1),
	};
}

/** Beliebige Daten (z.B. aus dem localStorage) in gültige Einstellungen überführen */
function toSettings(raw: unknown): Settings {
	if (typeof raw !== "object" || raw === null) {
		return { ...DEFAULTS };
	}
	const o = raw as Record<string, unknown>;
	const types = Array.isArray(o.types) ? OPS.filter((op) => (o.types as unknown[]).includes(op)) : DEFAULTS.types;
	const rows = Array.isArray(o.rows)
		? o.rows.filter((r): r is number => Number.isInteger(r) && r >= 0 && r <= MAX_ROW)
		: DEFAULTS.rows;
	return fixRanges({
		types,
		mix: toBool(o.mix, DEFAULTS.mix),
		complement: toBool(o.complement, DEFAULTS.complement),
		commutative: toBool(o.commutative, DEFAULTS.commutative),
		count: isCount(o.count) ? o.count : DEFAULTS.count,
		minResult: toInt(o.minResult, DEFAULTS.minResult, 0, MAX_NUMBER),
		maxResult: toInt(o.maxResult, DEFAULTS.maxResult, 1, MAX_NUMBER),
		minCalc: toInt(o.minCalc, DEFAULTS.minCalc, 0, MAX_NUMBER),
		maxCalc: toInt(o.maxCalc, DEFAULTS.maxCalc, 1, MAX_NUMBER),
		rows: [...new Set(rows)].sort((a, b) => a - b),
		maxFactor: toInt(o.maxFactor, DEFAULTS.maxFactor, 1, 100),
		showSolutions: toBool(o.showSolutions, DEFAULTS.showSolutions),
		name: typeof o.name === "string" ? o.name.slice(0, 40) : DEFAULTS.name,
	});
}

function load(): Settings {
	try {
		const json = localStorage.getItem(STORAGE_KEY);
		return toSettings(json === null ? null : JSON.parse(json));
	} catch {
		return { ...DEFAULTS };
	}
}

function save(s: Settings): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
	} catch {
		// privater Modus o.ä.: dann eben ohne Merken
	}
}

/** Nur diese Felder beeinflussen die Aufgaben selbst; Lösungen und Name nicht */
function taskKey(s: Settings): string {
	const { showSolutions: _solutions, name: _name, ...rest } = s;
	return JSON.stringify(rest);
}

// ---------------------------------------------------------------- DOM

function byId<T extends HTMLElement>(id: string, type: new () => T): T {
	const el = document.getElementById(id);
	if (!(el instanceof type)) {
		throw new Error(`#${id} fehlt oder hat den falschen Typ`);
	}
	return el;
}

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string,
	text?: string,
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	if (className !== undefined) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

const form = byId("settings", HTMLFormElement);
const rowsBox = byId("rows", HTMLDivElement);
const tasksBox = byId("tasks", HTMLDivElement);
const message = byId("message", HTMLParagraphElement);

const numberFields = ["minResult", "maxResult", "minCalc", "maxCalc", "maxFactor"] as const;
const flagFields = ["mix", "complement", "commutative", "showSolutions"] as const;

function checkedValues(name: string): string[] {
	return [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)].map((i) => i.value);
}

function readForm(): Settings {
	const raw: Record<string, unknown> = {
		types: checkedValues("type"),
		rows: checkedValues("row").map(Number),
		count: Number(checkedValues("count")[0]),
		name: byId("name", HTMLInputElement).value,
	};
	for (const f of numberFields) raw[f] = byId(f, HTMLInputElement).value;
	for (const f of flagFields) raw[f] = byId(f, HTMLInputElement).checked;
	return toSettings(raw);
}

function writeForm(s: Settings): void {
	for (const input of form.querySelectorAll<HTMLInputElement>('input[name="type"]')) {
		input.checked = s.types.includes(input.value as Op);
	}
	for (const input of form.querySelectorAll<HTMLInputElement>('input[name="row"]')) {
		input.checked = s.rows.includes(Number(input.value));
	}
	for (const input of form.querySelectorAll<HTMLInputElement>('input[name="count"]')) {
		input.checked = Number(input.value) === s.count;
	}
	for (const f of numberFields) byId(f, HTMLInputElement).value = String(s[f]);
	for (const f of flagFields) byId(f, HTMLInputElement).checked = s[f];
	byId("name", HTMLInputElement).value = s.name;
	updateVisibility(s);
}

function updateVisibility(s: Settings): void {
	byId("fsAddSub", HTMLFieldSetElement).hidden = !s.types.some((t) => t === "add" || t === "sub");
	byId("fsTimDiv", HTMLFieldSetElement).hidden = !s.types.some((t) => t === "tim" || t === "div");
}

function buildRowChips(): void {
	for (let row = 0; row <= MAX_ROW; row++) {
		const label = el("label", "chip chip-small");
		const input = el("input");
		input.type = "checkbox";
		input.name = "row";
		input.value = String(row);
		input.id = `row${row}`;
		label.append(input, el("span", undefined, String(row)));
		rowsBox.append(label);
	}
}

function cell(task: Task, slot: Slot, showSolutions: boolean): HTMLSpanElement {
	const value = task[slot];
	const span = el("span", "num");
	if (task.blank !== slot) {
		span.textContent = String(value);
		return span;
	}
	const blank = el("span", "blank");
	if (showSolutions) {
		blank.append(el("span", "solution", String(value)));
	}
	span.append(blank);
	return span;
}

function renderTask(task: Task, showSolutions: boolean): HTMLDivElement {
	const row = el("div", "task");
	row.append(
		cell(task, "x1", showSolutions),
		el("span", "op", OP_SIGN[task.op]),
		cell(task, "x2", showSolutions),
		el("span", "op", "="),
		cell(task, "r", showSolutions),
	);
	return row;
}

function render(tasks: readonly Task[], s: Settings): void {
	// höchstens 20 Zeilen pro Spalte, damit das Blatt auf eine A4-Seite passt
	const perColumn = Math.ceil(tasks.length / Math.max(2, Math.ceil(tasks.length / 20)));
	const columns: HTMLDivElement[] = [];
	for (let i = 0; i < tasks.length; i += perColumn) {
		const col = el("div", "col");
		col.append(...tasks.slice(i, i + perColumn).map((t) => renderTask(t, s.showSolutions)));
		columns.push(col);
	}
	tasksBox.replaceChildren(...columns);
	tasksBox.classList.toggle("three", columns.length > 2);

	byId("sheetName", HTMLSpanElement).textContent = s.name;
	byId("sheetInfo", HTMLSpanElement).textContent =
		`${tasks.length} Aufgaben · ${s.types.map((t) => OP_NAME[t]).join(", ")}`;
	byId("scoreTotal", HTMLSpanElement).textContent = String(tasks.length);
}

// ---------------------------------------------------------------- Ablauf

let settings = load();
let tasks: Task[] = [];
let key = "";

function regenerate(): void {
	const error = check(settings);
	message.textContent = error ?? "";
	message.hidden = error === null;
	if (error !== null) {
		return;
	}
	tasks = generate(settings);
	key = taskKey(settings);
	render(tasks, settings);
}

function onChange(): void {
	const next = readForm();
	settings = next;
	save(settings);
	// korrigierte Bereiche zurück ins Formular schreiben
	writeForm(settings);
	if (taskKey(settings) !== key || tasks.length === 0) {
		regenerate();
	} else {
		render(tasks, settings);
	}
}

buildRowChips();
writeForm(settings);
regenerate();

// "Lösungen zeigen" sitzt über dem Blatt, also außerhalb des Formulars
document.addEventListener("change", onChange);
form.addEventListener("submit", (e) => {
	e.preventDefault();
	onChange();
});
byId("name", HTMLInputElement).addEventListener("input", () => {
	settings = { ...settings, name: byId("name", HTMLInputElement).value.slice(0, 40) };
	byId("sheetName", HTMLSpanElement).textContent = settings.name;
	save(settings);
});

byId("btnNew", HTMLButtonElement).addEventListener("click", regenerate);
byId("btnDefaults", HTMLButtonElement).addEventListener("click", () => {
	settings = { ...DEFAULTS, name: settings.name };
	save(settings);
	writeForm(settings);
	regenerate();
});

byId("btnPrint", HTMLButtonElement).addEventListener("click", () => window.print());
