const { DEV_API_KEY, DEV_TO_API_URL } = import.meta.env;

export async function fetchArticleByID(id: string) {
    const res = await fetch(DEV_TO_API_URL + "article/" + id, {
        headers: {
            "api-key": DEV_API_KEY,
        },
    });
    const data = await res.json();
    const article = data;

    return article;
}