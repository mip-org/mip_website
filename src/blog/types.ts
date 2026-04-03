export interface BlogPostMeta {
  title: string;
  date: string;
  slug: string;
  author: string;
  summary: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}
