import * as url from "url";

interface SyncOptions {
  /**
   * Files to match for syncing
   */
  targetFilter?: string;
  /**
   * If a target was found in the directory, any asset matching this filter will be synced as well
   */
  assetFilter?: string;
}

// Usage: await sync("webdav://user:pass@host.example.com/blog", "./src/blog")
export async function sync(src: string, dst: string, options?: SyncOptions) {
  // Connect to server
  // Get directory contents, deep. Assign target filters.
  // Make sure that destination directory exists, fail otherwise
  // Copy if missing. Overwrite if size mismatch. Overwrite if date-modified is older locally.
  //const srcP = new URL(src);
  const srcP = url.parse(src);
  const srcM = new URL("src");
  console.log(srcP);
}
//example.com/nextcloud/remote.php/dav/files/USERNAME/

sync(process.env.SYNC_FROM, "dist/tmp");
