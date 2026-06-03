import { apiClient } from '../../lib/api-client';
import type { BlogPostDetail, BlogPostSummary } from './types';

export async function fetchBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  const response = await apiClient.get<{ data: BlogPostSummary[] }>(
    `/api/v1/blog?locale=${encodeURIComponent(locale)}`,
  );
  return response.data ?? [];
}

export async function fetchBlogPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPostDetail | null> {
  try {
    const response = await apiClient.get<{ data: BlogPostDetail }>(
      `/api/v1/blog/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}
