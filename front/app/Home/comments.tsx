import { useEffect } from "react";

const Giscus = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.setAttribute("crossorigin", "anonymous");

    script.setAttribute("data-repo", "medwessim/FindComments");
    script.setAttribute("data-repo-id", "R_kgDOOp3T1A");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOOp3T1M4CqIqQ");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "fr");

    const giscusContainer = document.getElementById("giscus-container");
    if (giscusContainer) {
      giscusContainer.innerHTML = "";
      giscusContainer.appendChild(script);
    }
  }, []);

  return <div id="giscus-container" />;
};

export default Giscus;
