export function createPageUrl(page: string): string {
  const routes: Record<string, string> = {
    Landing: "/",
    Dashboard: "/dashboard",
    History: "/history",
    Demo: "/demo"
  };

  return routes[page] || "/";
}