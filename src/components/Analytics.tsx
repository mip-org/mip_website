import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: { path?: string; title?: string; referrer?: string }) => void;
    };
  }
}

// Fires a GoatCounter pageview on every client-side route change. Automatic
// counting is disabled in index.html (no_onload), so this also reports the
// initial pageview once the async count.js script has finished loading.
export default function Analytics() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const count = () =>
      window.goatcounter?.count?.({ path: pathname + search + hash });

    if (window.goatcounter?.count) {
      count();
      return;
    }

    // count.js loads asynchronously; wait for it before recording this view.
    const id = setInterval(() => {
      if (window.goatcounter?.count) {
        clearInterval(id);
        count();
      }
    }, 200);
    return () => clearInterval(id);
  }, [pathname, search, hash]);

  return null;
}
