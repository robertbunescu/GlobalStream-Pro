// Component Loader - components-loader.js
// Încarcă toate componentele HTML în paginile corespunzătoare

(function () {
  "use strict";

  // Funcție pentru încărcarea componentelor
  async function loadComponent(componentPath, containerId) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentPath}: ${response.status}`);
      }
      const html = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      }
    } catch (error) {
      console.error("Error loading component:", error);
    }
  }

  // Încarcă toate componentele când DOM-ul este gata
  document.addEventListener("DOMContentLoaded", async function () {
    // Lista de componente și containerele lor
    const components = [
      { path: "components/header.html", container: "header-container" },
      { path: "components/sidebar.html", container: "sidebar-container" },
      {
        path: "components/video-player.html",
        container: "video-player-container",
      },
      {
        path: "components/channel-filters.html",
        container: "channel-filters-container",
      },
      {
        path: "components/channel-grid.html",
        container: "channel-grid-container",
      },
    ];

    // Încarcă toate componentele în paralel
    await Promise.all(
      components.map((comp) => loadComponent(comp.path, comp.container))
    );

    // Emite eveniment când toate componentele sunt încărcate
    const event = new CustomEvent("componentsLoaded");
    document.dispatchEvent(event);

    console.log("All components loaded successfully");
  });
})();
