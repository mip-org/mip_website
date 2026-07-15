export interface DocMeta {
  title: string;
  slug: string;
  summary: string;
  order: number;
  section?: string;
}

export interface Doc extends DocMeta {
  content: string;
}
