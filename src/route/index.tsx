import { RouteObject } from "react-router-dom";

const routeFiles = import.meta.globEager<string, any>("/src/views/*.tsx");
const routes: RouteObject[] = [];

for (const path in routeFiles) {
  const element = routeFiles[path].default as RouteObject["element"];

  routes.push({
    path: path.replace("/src/views", "").replace(".tsx", ""),
    element,
  });
}

routes.push({
  path: "/",
  element: routes[0].element,
});

export default routes;
