import {
  fetchAllArticles,
  fetchArticleById,
  Article,
} from "../models/ArticleModel";

export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const articles = await fetchAllArticles();
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleDetails = async (
  articleId: string
): Promise<Article> => {
  try {
    const article = await fetchArticleById(articleId);
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};
