'use client';

import { use } from 'react';
import { BlogPostDetailView } from '../../../features/blog/components/BlogPostDetailView';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  return <BlogPostDetailView slug={slug} />;
}
