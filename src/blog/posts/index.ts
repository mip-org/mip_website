import { parseFrontmatter } from "../parseFrontmatter";
import type { BlogPost } from "../types";

import introducingMip from "./introducing-mip.md?raw";

export const posts: BlogPost[] = [
  parseFrontmatter(introducingMip),
].sort((a, b) => b.date.localeCompare(a.date));
