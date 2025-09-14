export function createPageUrl(page) {
  const routes = {
    Landing: "/",
    Dashboard: "/dashboard",
    History: "/history",
    Demo: "/demo"
  };

  return routes[page] || "/";
}