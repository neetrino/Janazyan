export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  images: string[];
  publishedAt: string | null;
};

export type BlogPostDetail = BlogPostSummary & {
  contentHtml: string;
};
