const SUBSTACK_BASE = "https://madelgeek.substack.com";
const ARCHIVE_URL = `${SUBSTACK_BASE}/api/v1/archive`;

export interface SubstackArticle {
  title: string;
  description: string;
  slug: string;
  cover_image: string | undefined;
  badge?: string;
  url: string;
  data: { published_at: Date };
  /** Only set when fetched via fetchArticleBySlug */
  body_html?: string;
  updated_at?: Date;
}

interface SubstackArchiveItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  post_date: string;
  cover_image: string | null;
  canonical_url?: string;
}

interface SubstackPostDetail extends SubstackArchiveItem {
  body_html: string | null;
  updated_at: string | null;
}

/** Remove Substack subscribe widgets from post HTML (full widget divs, not just text) */
function stripSubscribeBlocks(html: string): string {
  return html
    .replace(
      /<div\s[^>]*class="[^"]*subscription-widget-wrap-editor[^"]*"[^>]*>[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/gi,
      ""
    )
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

/** Remove the first <img> from HTML so it can be used as cover without duplicating in body */
function removeFirstImageFromHtml(html: string): string {
  return html.replace(/<img[^>]*>/i, "").trim();
}

async function fetchFromSubstackArchive(): Promise<SubstackArticle[]> {
  const res = await fetch(`${ARCHIVE_URL}?sort=new&limit=50&offset=0`);
  if (!res.ok) throw new Error(`Substack archive failed: ${res.status}`);
  const items = (await res.json()) as SubstackArchiveItem[];
  return items.map((item) => ({
    title: item.title ?? "Untitled",
    description: item.description || "No description",
    slug: item.slug,
    cover_image: item.cover_image ?? undefined,
    url: `${SUBSTACK_BASE}/p/${item.slug}`,
    data: { published_at: new Date(item.post_date) },
  }));
}

export async function fetchArticles(): Promise<Array<SubstackArticle>> {
  return fetchFromSubstackArchive();
}

export async function fetchArticleBySlug(slug: string): Promise<SubstackArticle | null> {
  const res = await fetch(`${SUBSTACK_BASE}/api/v1/posts/${slug}`);
  if (!res.ok) return null;
  const post = (await res.json()) as SubstackPostDetail;
  const rawBody = post.body_html ?? "";
  let body_html: string | undefined;
  let cover_image = post.cover_image ?? undefined;
  if (rawBody) {
    const stripped = stripSubscribeBlocks(rawBody);
    // If we show a cover image, remove the first image from body so it doesn’t appear twice
    if (cover_image) {
      body_html = removeFirstImageFromHtml(stripped);
    } else {
      body_html = stripped;
    }
  }
  return {
    title: post.title ?? "Untitled",
    description: post.description || "No description",
    slug: post.slug,
    cover_image,
    url: `${SUBSTACK_BASE}/p/${post.slug}`,
    data: { published_at: new Date(post.post_date) },
    body_html,
    updated_at: post.updated_at ? new Date(post.updated_at) : undefined,
  };
}
