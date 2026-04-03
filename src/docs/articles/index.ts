import { parseFrontmatter } from "../parseFrontmatter";
import type { Doc } from "../types";

import installingPackages from "./installing-packages.md?raw";
import creatingAPackage from "./creating-a-package.md?raw";
import buildingAMexPackage from "./building-a-mex-package.md?raw";
// import buildingAWasmPackage from "./building-a-wasm-package.md?raw";
import hostingAChannel from "./hosting-a-channel.md?raw";

export const docs: Doc[] = [
  parseFrontmatter(installingPackages),
  parseFrontmatter(creatingAPackage),
  parseFrontmatter(buildingAMexPackage),
  parseFrontmatter(hostingAChannel),
  // parseFrontmatter(buildingAWasmPackage),
].sort((a, b) => a.order - b.order);
