export interface Article {
  id: string;
  title: string;
  content: string;
}

export const fetchAllArticles = async (): Promise<Article[]> => {
  // Simulate an API call to get all articles
  const response = await fetch("/api/articles");
  const data: Article[] = await response.json();
  return data;
};

export const fetchArticleById = async (id: string): Promise<Article> => {
  // Simulate an API call to get an article by ID
  const response = await fetch(`/api/articles/${id}`);
  const data: Article = await response.json();
  return data;
};
