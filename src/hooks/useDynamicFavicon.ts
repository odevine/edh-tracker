import { useEffect } from "react";

export const useDynamicFavicon = (primaryColor: string) => {
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.821649 0.25 20.88 19">
	    <path d="m20.47 2.35-1.34-.56v9.03l2.43-5.86c.41-1.02-.08-2.19-1.09-2.61m-19.5 3.7 4.96 11.97a2.013 2.013 180 001.81 1.23c.26 0 .53-.04.79-.15l7.37-3.05a1.999 1.999 180 001.08-2.6l-4.96-11.97a1.998 1.998 180 00-2.6-1.08l-7.36 3.05a1.994 1.994 180 00-1.09 2.6m14.15 7.2m2-11c0-1.1-.9-2-2-2h-1.45l3.45 8.34z" fill="${primaryColor}"/>
    </svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    let favicon: HTMLLinkElement | null =
      document.querySelector("link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }

    favicon.setAttribute("type", "image/svg+xml");
    favicon.setAttribute("href", url);

    // clean up old blob URL on change
    return () => URL.revokeObjectURL(url);
  }, [primaryColor]);
};
