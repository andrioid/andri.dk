export async function getCountryFromHeaders(
  headers: Headers,
): Promise<undefined | string> {
  const ip = headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (!ip) return "Iceland";
  if (!ip) return;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const resJ = await res.json();
    if (resJ.country) {
      return resJ.country;
    }
  } catch (_err) {
    // ignore and return undefined
  }
}
