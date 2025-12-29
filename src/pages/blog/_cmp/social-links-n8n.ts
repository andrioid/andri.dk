type SocialLinks = {
  atUri: string | null;
  linkedIn: string | null;
};

export async function socialLinks(slug: string): Promise<SocialLinks> {
  try {
    const linksFromN8N = await fetch(
      // URL encode
      `https://n8n.andri.dk/webhook/fce5f719-c044-4c70-8ba1-953b99011973/`,
      {
        method: "POST",
        body: JSON.stringify({ url: `https://andri.dk/blog/${slug}` }),
      },
    );
    const socialLinks = await linksFromN8N.json();
    return {
      atUri: socialLinks.atUri,
      linkedIn: socialLinks.linkedIn,
    };
  } catch (err) {
    // Not working. But, that's OK. Ignore it.
    console.debug("error", err);
    return {
      atUri: null,
      linkedIn: null,
    };
  }
}
