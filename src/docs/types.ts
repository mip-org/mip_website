export interface DocMeta {
  title: string;
  slug: string;
  summary: string;
  order: number;
}

export interface Doc extends DocMeta {
  content: string;
}
