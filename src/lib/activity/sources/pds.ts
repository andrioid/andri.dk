import { identities } from "../../../constants";
import { okJson } from "./http";

/**
 * PDS for did:plc:rrrwbar3wv576qpsymwey5p5, per https://plc.directory/<did>.
 * If records stop appearing, re-resolve the DID document and update this.
 */
const PDS_URL = "https://eurosky.social";

export type Record_<T> = { uri: string; value: T };

/**
 * Newest-first page of one collection from my own repo. Public data, so no auth — every
 * atproto app that writes to my PDS (bookmarks, Tangled, Bookhive) is readable this way.
 * `listRecords` orders by descending record key, and keys are TIDs, so newest comes first.
 */
export async function listRecords<T>(
	collection: string,
	limit = 20,
): Promise<Array<Record_<T>>> {
	const url = `${PDS_URL}/xrpc/com.atproto.repo.listRecords?repo=${identities.blueskyDid}&collection=${collection}&limit=${limit}`;
	const res = await fetch(url);
	const body = await okJson<{ records?: Array<Record_<T>> }>(
		res,
		`atproto listRecords ${collection}`,
	);
	return body.records ?? [];
}
