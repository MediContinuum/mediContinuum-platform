import { useCallback, useSyncExternalStore } from "react";

const mediaQueryCache = new Map<string, MediaQueryList>();

function getMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null;
  }

  let mediaQuery = mediaQueryCache.get(query);

  if (!mediaQuery) {
    mediaQuery = window.matchMedia(query);
    mediaQueryCache.set(query, mediaQuery);
  }

  return mediaQuery;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = getMediaQuery(query);

      if (!mediaQuery) return () => {};

      mediaQuery.addEventListener("change", callback);

      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => getMediaQuery(query)?.matches ?? false,
    [query],
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const BREAKPOINTS = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  largeDesktop: "(min-width: 1280px)",
} as const;

export function useResponsive() {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const isLargeDesktop = useMediaQuery(BREAKPOINTS.largeDesktop);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isMobileOrTablet: isMobile || isTablet,
  };
}
