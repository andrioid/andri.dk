export async function getCountryFromIP(
  ipAddress: string,
): Promise<undefined | string> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const resJ = await res.json();
    if (!resJ.country) {
      return;
    }
    return resJ.country;
  } catch (_err) {
    console.error(`[Geolocation] Failed for ${ipAddress}`);
    // ignore and return undefined
  }
}

export function getIPfromHeaders(headers: Headers) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0].trim();
  return ip;
}
