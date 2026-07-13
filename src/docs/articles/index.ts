import { parseFrontmatter } from "../parseFrontmatter";
import type { Doc } from "../types";

import installingMip from "./installing-mip.md?raw";
import installingPackages from "./installing-packages.md?raw";
import managingPackages from "./managing-packages.md?raw";
import requestingAPackage from "./requesting-a-package.md?raw";
import creatingAPackage from "./creating-a-package.md?raw";
import buildingAMexPackage from "./building-a-mex-package.md?raw";
// import buildingAWasmPackage from "./building-a-wasm-package.md?raw";
import hostingAChannel from "./hosting-a-channel.md?raw";
import forDevelopers from "./for-developers.md?raw";

export const docs: Doc[] = [
  parseFrontmatter(installingMip),
  parseFrontmatter(installingPackages),
  parseFrontmatter(managingPackages),
  parseFrontmatter(requestingAPackage),
  parseFrontmatter(creatingAPackage),
  parseFrontmatter(buildingAMexPackage),
  parseFrontmatter(hostingAChannel),
  parseFrontmatter(forDevelopers),
  // parseFrontmatter(buildingAWasmPackage),
].sort((a, b) => a.order - b.order);
