import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import { fetchArticles } from "../../lib/getArticles";

export async function get(context) {
  const articles = await fetchArticles();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: article.pubDate,
      description: article.published_at,
      link: `/blog/${post.slug}/`,
    })),
  });
}
