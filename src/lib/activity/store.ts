import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync, type SQLOutputValue } from "node:sqlite";
import {
	KIND_RANK,
	type ActivityKind,
	type RemoteKind,
	type SourceRow,
	type StoredEntry,
} from "./types";
import { titleFromUrl } from "./url";

const DB_PATH = process.env.ACTIVITY_DB_PATH ?? "./.cache/activity.sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS activity (
	url        TEXT PRIMARY KEY,
	kind       TEXT NOT NULL,
	kind_rank  INTEGER NOT NULL,
	date       TEXT NOT NULL,
	title      TEXT,
	summary    TEXT,
	source     TEXT,
	tags       TEXT NOT NULL DEFAULT '[]',
	stars      INTEGER,
	image      TEXT,
	updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS activity_date_idx ON activity (date DESC);

CREATE TABLE IF NOT EXISTS sync_state (
	source       TEXT PRIMARY KEY,
	attempted_at TEXT NOT NULL,
	synced_at    TEXT,
	error        TEXT
);

CREATE TABLE IF NOT EXISTS link_preview (
	url         TEXT PRIMARY KEY,
	title       TEXT,
	description TEXT,
	image       TEXT,
	fetched_at  TEXT NOT NULL
);
`;

/**
 * Shared read shape: the stored row, with anything the source did not know filled in from
 * the link preview joined on the same normalized URL.
 */
const SELECT_ACTIVITY = `
SELECT a.url, a.kind, a.date, a.tags, a.stars, a.source,
       COALESCE(a.title, p.title)         AS title,
       COALESCE(a.summary, p.description) AS summary,
       COALESCE(a.image, p.image)         AS image
FROM activity a
LEFT JOIN link_preview p ON p.url = a.url`;

const UPSERT_ACTIVITY = `
INSERT INTO activity
  (url, kind, kind_rank, date, title, summary, source, tags, stars, image, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(url) DO UPDATE SET
  kind = excluded.kind, kind_rank = excluded.kind_rank, date = excluded.date,
  title = excluded.title, summary = excluded.summary, source = excluded.source,
  tags = excluded.tags, stars = excluded.stars,
  image = excluded.image, updated_at = excluded.updated_at
WHERE excluded.kind_rank <= activity.kind_rank`;

let handle: DatabaseSync | undefined;

/** Opens (once) the activity database, creating the directory and schema on demand. */
export function getDb(): DatabaseSync {
	if (handle) return handle;
	mkdirSync(dirname(DB_PATH), { recursive: true });
	const db = new DatabaseSync(DB_PATH);
	db.exec("PRAGMA journal_mode = WAL");
	db.exec(SCHEMA);
	handle = db;
	return db;
}

type Row = Record<string, SQLOutputValue>;

/** SQL NULL and non-text values become `undefined` so optional fields stay absent. */
function text(value: SQLOutputValue | undefined): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

function rowToEntry(row: Row): StoredEntry {
	const url = String(row.url);
	return {
		id: url,
		data: {
			kind: String(row.kind) as ActivityKind,
			date: new Date(String(row.date)),
			title: text(row.title) ?? titleFromUrl(url),
			url,
			summary: text(row.summary),
			source: text(row.source),
			tags:
				typeof row.tags === "string"
					? (JSON.parse(row.tags) as Array<string>)
					: [],
			stars: typeof row.stars === "number" ? row.stars : undefined,
			image: text(row.image),
		},
	};
}

/** Newest-first window of persisted remote activity, enriched from link_preview. */
export function readActivity(opts: {
	limit?: number;
	kinds?: Array<ActivityKind>;
}): Array<StoredEntry> {
	const params: Array<string | number> = [];
	let sql = SELECT_ACTIVITY;
	if (opts.kinds && opts.kinds.length > 0) {
		sql += ` WHERE a.kind IN (${opts.kinds.map(() => "?").join(", ")})`;
		params.push(...opts.kinds);
	}
	sql += " ORDER BY a.date DESC";
	if (opts.limit !== undefined) {
		sql += " LIMIT ?";
		params.push(opts.limit);
	}
	return getDb()
		.prepare(sql)
		.all(...params)
		.map(rowToEntry);
}

export function readEntry(url: string): StoredEntry | undefined {
	const row = getDb().prepare(`${SELECT_ACTIVITY} WHERE a.url = ?`).get(url);
	return row ? rowToEntry(row) : undefined;
}

/**
 * Replaces one source's newest window. Deletes rows of `kind` dated at or after the oldest
 * item in `rows`, then upserts `rows`. Rows older than that boundary survive, so items that
 * aged out of the API window remain as history. No-ops on an empty batch.
 */
export function replaceWindow(kind: RemoteKind, rows: Array<SourceRow>): void {
	let oldest: string | undefined;
	for (const row of rows) {
		const iso = row.date.toISOString();
		if (oldest === undefined || iso < oldest) oldest = iso;
	}
	if (oldest === undefined) return;

	const db = getDb();
	const now = new Date().toISOString();
	db.exec("BEGIN");
	try {
		db.prepare("DELETE FROM activity WHERE kind = ? AND date >= ?").run(
			kind,
			oldest,
		);
		const upsert = db.prepare(UPSERT_ACTIVITY);
		for (const row of rows) {
			upsert.run(
				row.url,
				row.kind,
				KIND_RANK[row.kind],
				row.date.toISOString(),
				row.title ?? null,
				row.summary ?? null,
				row.source ?? null,
				JSON.stringify(row.tags),
				row.stars ?? null,
				row.image ?? null,
				now,
			);
		}
		db.exec("COMMIT");
	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	}
}

/** URLs with no title of their own and no preview row newer than `staleBefore` (ISO). */
export function readUrlsNeedingPreview(
	limit: number,
	staleBefore: string,
): Array<string> {
	return getDb()
		.prepare(
			`SELECT a.url FROM activity a
			 LEFT JOIN link_preview p ON p.url = a.url
			 WHERE a.title IS NULL AND (p.url IS NULL OR p.fetched_at < ?)
			 ORDER BY a.date DESC LIMIT ?`,
		)
		.all(staleBefore, limit)
		.map((row) => String(row.url));
}

export function readSyncState(
	source: RemoteKind,
):
	| { attemptedAt: Date; syncedAt: Date | null; error: string | null }
	| undefined {
	const row = getDb()
		.prepare(
			"SELECT attempted_at, synced_at, error FROM sync_state WHERE source = ?",
		)
		.get(source);
	if (!row) return undefined;
	const syncedAt = text(row.synced_at);
	return {
		attemptedAt: new Date(String(row.attempted_at)),
		syncedAt: syncedAt ? new Date(syncedAt) : null,
		error: text(row.error) ?? null,
	};
}

/** Upserts `attempted_at = now`; advances `synced_at` only when `error` is omitted. */
export function writeSyncState(source: RemoteKind, error?: string): void {
	const now = new Date().toISOString();
	getDb()
		.prepare(
			`INSERT INTO sync_state (source, attempted_at, synced_at, error) VALUES (?, ?, ?, ?)
			 ON CONFLICT(source) DO UPDATE SET
			   attempted_at = excluded.attempted_at,
			   synced_at = COALESCE(excluded.synced_at, sync_state.synced_at),
			   error = excluded.error`,
		)
		.run(source, now, error ? null : now, error ?? null);
}
