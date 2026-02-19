export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) return null
    const html = await res.text()

    const patterns = [
      // Quoted attributes, property first
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      // Quoted attributes, content first
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      // Unquoted attributes, content first (e.g. Vancouver Sun / Postmedia)
      /<meta[^>]+content=([^\s"'>]+)[^>]+property=og:image[\s>]/i,
      // Unquoted attributes, property first
      /<meta[^>]+property=og:image[^>]+content=([^\s"'>]+)/i,
      // Twitter image fallback — quoted
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      // Twitter image fallback — unquoted
      /<meta[^>]+content=([^\s"'>]+)[^>]+name=twitter:image[\s>]/i,
    ]

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match?.[1]) return match[1]
    }

    return null
  } catch {
    return null
  }
}
