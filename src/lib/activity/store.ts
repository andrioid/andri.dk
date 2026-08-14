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
import { MAX_SUMMARY, MAX_TITLE, sanitizeTags, sanitizeText } from "./text";
import { isWebUrl, titleFromUrl } from "./url";

const DB_PATH = process.env.ACTIVITY_DB_PATH ?? "./.cache/activity.sqlite";

/**
 * Bump on any change to the `activity` or `sync_state` shape. The store is a cache of remote
 * APIs, so a mismatch drops and refills those tables rather than migrating in place.
 * `link_preview` survives: its shape is stable and refetching it is the expensive part.
 */
const SCHEMA_VERSION = 2;

/**
 * Most rows one kind may contribute to a single day. A bulk import — 49 Tangled repo records
 * created in one afternoon, 18 books backfilled in a month — is not activity, and without
 * this it would drown the day it landed on. Genuine activity never reaches the cap.
 */
const PER_DAY_CAP = 3;

/** Rows older than this are dropped on sync: the feed is recent activity, not an archive. */
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

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
	likes      INTEGER,
	replies    INTEGER,
	image      TEXT,
	updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS activity_date_idx ON activity (date DESC);

CREATE TABLE IF NOT EXISTS sync_state (
	source       TEXT PRIMARY KEY,
	attempted_at TEXT NOT NULL,
	synced_at    TEXT,
	error        TEXT,
	failures     INTEGER NOT NULL DEFAULT 0,
	retry_after  TEXT
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
const ENRICHED = `
enriched AS (
	SELECT a.url, a.kind, a.date, a.tags, a.stars, a.likes, a.replies, a.source,
	       COALESCE(a.title, p.title)         AS title,
	       COALESCE(a.summary, p.description) AS summary,
	       COALESCE(a.image, p.image)         AS image
	FROM activity a
	LEFT JOIN link_preview p ON p.url = a.url
)`;

const SELECT_ENTRY = `WITH ${ENRICHED} SELECT * FROM enriched WHERE url = ?`;

/** The feed read: enriched rows, with `PER_DAY_CAP` applied per kind per calendar day. */
const SELECT_FEED = `
WITH ${ENRICHED},
ranked AS (
	SELECT enriched.*, ROW_NUMBER() OVER (
		PARTITION BY kind, date(date) ORDER BY date DESC
	) AS rn
	FROM enriched
)
SELECT * FROM ranked WHERE rn <= ${PER_DAY_CAP}`;

const UPSERT_ACTIVITY = `
INSERT INTO activity
  (url, kind, kind_rank, date, title, summary, source, tags, stars, likes, replies,
   image, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(url) DO UPDATE SET
  kind = excluded.kind, kind_rank = excluded.kind_rank, date = excluded.date,
  title = excluded.title, summary = excluded.summary, source = excluded.source,
  tags = excluded.tags, stars = excluded.stars, likes = excluded.likes,
  replies = excluded.replies,
  image = excluded.image, updated_at = excluded.updated_at
WHERE excluded.kind_rank <= activity.kind_rank`;

let handle: DatabaseSync | undefined;

/** Opens (once) the activity database, creating the directory and schema on demand. */
export function getDb(): DatabaseSync {
	if (handle) return handle;
	mkdirSync(dirname(DB_PATH), { recursive: true });
	const db = new DatabaseSync(DB_PATH);
	db.exec("PRAGMA journal_mode = WAL");
	migrate(db);
	handle = db;
	return db;
}

/**
 * Columns whose absence proves the cached tables predate the current code, whatever the
 * recorded version claims.
 */
const REQUIRED_COLUMNS: Record<string, Array<string>> = {
	activity: ["likes", "replies"],
	sync_state: ["failures", "retry_after"],
};

/**
 * Rebuilds when the version moved, or when a table is missing a column the code needs.
 *
 * The shape check is not redundant with the version: the version is a separate write from the
 * DDL, so a crash between them — or a second connection running older code, which is exactly
 * what a dev-server hot reload produces — leaves the version asserting a shape the tables do
 * not have. The symptom is a `no such column` throw on every read, which blanks the feed.
 */
function needsRebuild(db: DatabaseSync): boolean {
	const row = db.prepare("PRAGMA user_version").get();
	if (Number(row?.user_version) !== SCHEMA_VERSION) return true;

	for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
		const present = new Set(
			db
				.prepare(`PRAGMA table_info(${table})`)
				.all()
				.map((column) => String(column.name)),
		);
		// An absent table is not drift — the schema below is about to create it.
		if (present.size === 0) continue;
		if (columns.some((column) => !present.has(column))) return true;
	}
	return false;
}

/**
 * Drops and refills the cached tables when their shape is stale. `CREATE TABLE IF NOT EXISTS`
 * cannot add a column to an existing table, so without this a new field is silently always
 * NULL. `sync_state` goes too: leaving it would mark every source as freshly synced against
 * the table we just emptied. `link_preview` survives — refetching it is the expensive part.
 *
 * All of it in one transaction, so the version and the tables can never disagree.
 */
function migrate(db: DatabaseSync): void {
	db.exec("BEGIN");
	try {
		if (needsRebuild(db)) {
			db.exec("DROP TABLE IF EXISTS activity");
			db.exec("DROP TABLE IF EXISTS sync_state");
			// PRAGMA takes no bound parameters; SCHEMA_VERSION is a local integer.
			db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
		}
		db.exec(SCHEMA);
		db.exec("COMMIT");
	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	}
}

type Row = Record<string, SQLOutputValue>;

/** SQL NULL and non-text values become `undefined` so optional fields stay absent. */
function text(value: SQLOutputValue | undefined): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Same, for counters: a NULL count means "unknown", never zero. */
function count(value: SQLOutputValue | undefined): number | undefined {
	return typeof value === "number" ? value : undefined;
}

/** Drops a stored image URL that is not http(s), whatever wrote it. */
function webUrl(value: string | undefined): string | undefined {
	return value !== undefined && isWebUrl(value) ? value : undefined;
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
			stars: count(row.stars),
			likes: count(row.likes),
			replies: count(row.replies),
			// Validated on read so it covers both the source's own image and one
			// adopted from link_preview: a non-web URL has no business in an <img>.
			image: webUrl(text(row.image)),
		},
	};
}

/** Newest-first window of persisted remote activity, enriched from link_preview. */
export function readActivity(opts: {
	limit?: number;
	kinds?: Array<ActivityKind>;
}): Array<StoredEntry> {
	const params: Array<string | number> = [];
	let sql = SELECT_FEED;
	if (opts.kinds && opts.kinds.length > 0) {
		sql += ` AND kind IN (${opts.kinds.map(() => "?").join(", ")})`;
		params.push(...opts.kinds);
	}
	sql += " ORDER BY date DESC";
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
	const row = getDb().prepare(SELECT_ENTRY).get(url);
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
				// Sanitized here rather than in each source: this is the one chokepoint
				// every row passes through, so a new source cannot forget to do it.
				sanitizeText(row.title, MAX_TITLE) ?? null,
				sanitizeText(row.summary, MAX_SUMMARY) ?? null,
				row.source ?? null,
				JSON.stringify(sanitizeTags(row.tags)),
				row.stars ?? null,
				row.likes ?? null,
				row.replies ?? null,
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

/** Drops rows past the retention window. Bounds growth; the feed shape comes from the cap. */
export function pruneActivity(): void {
	const cutoff = new Date(Date.now() - RETENTION_MS).toISOString();
	getDb().prepare("DELETE FROM activity WHERE date < ?").run(cutoff);
}

/** A stored link preview, when one exists and was fetched after `staleBefore` (ISO). */
export function readPreview(
	url: string,
	staleBefore: string,
): { title?: string; description?: string; image?: string } | undefined {
	const row = getDb()
		.prepare(
			`SELECT title, description, image FROM link_preview
			 WHERE url = ? AND fetched_at >= ?`,
		)
		.get(url, staleBefore);
	if (!row) return undefined;
	return {
		title: text(row.title),
		description: text(row.description),
		image: text(row.image),
	};
}

export type SyncState = {
	attemptedAt: Date;
	syncedAt: Date | null;
	error: string | null;
	/** Consecutive failures; drives the backoff in `sync.ts`. Zero after any success. */
	failures: number;
	/** When the endpoint itself told us to come back, if it did. */
	retryAfter: Date | null;
};

export function readSyncState(source: RemoteKind): SyncState | undefined {
	const row = getDb()
		.prepare(
			`SELECT attempted_at, synced_at, error, failures, retry_after
			 FROM sync_state WHERE source = ?`,
		)
		.get(source);
	if (!row) return undefined;
	const syncedAt = text(row.synced_at);
	const retryAfter = text(row.retry_after);
	return {
		attemptedAt: new Date(String(row.attempted_at)),
		syncedAt: syncedAt ? new Date(syncedAt) : null,
		error: text(row.error) ?? null,
		failures: count(row.failures) ?? 0,
		retryAfter: retryAfter ? new Date(retryAfter) : null,
	};
}

/**
 * Upserts `attempted_at = now`. A success advances `synced_at` and clears the failure count;
 * a failure increments it, so repeated trouble backs off instead of hammering. `retryAfter`
 * records an explicit instruction from the endpoint, and is cleared on success.
 */
export function writeSyncState(
	source: RemoteKind,
	error?: string,
	retryAfter?: Date,
): void {
	const now = new Date().toISOString();
	getDb()
		.prepare(
			`INSERT INTO sync_state
			   (source, attempted_at, synced_at, error, failures, retry_after)
			 VALUES (?, ?, ?, ?, ?, ?)
			 ON CONFLICT(source) DO UPDATE SET
			   attempted_at = excluded.attempted_at,
			   synced_at = COALESCE(excluded.synced_at, sync_state.synced_at),
			   error = excluded.error,
			   failures = CASE WHEN excluded.error IS NULL
			                   THEN 0 ELSE sync_state.failures + 1 END,
			   retry_after = excluded.retry_after`,
		)
		.run(
			source,
			now,
			error ? null : now,
			error ?? null,
			error ? 1 : 0,
			retryAfter?.toISOString() ?? null,
		);
}
