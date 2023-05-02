import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import ReactDev from "@/pages/react-dev";
// const routeFiles = import.meta.globEager<string, any>(
//   "/src/pages/**/index.tsx"
// );

// console.log(routeFiles, "routeFiles");

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/react-dev" replace={true} />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/react-dev",
        element: <ReactDev />,
      },
    ],
  },
];

// for (const path in routeFiles) {
//   const element = routeFiles[path].default;

//   routes[0].children?.push({
//     path: path.replace("/src/pages", "").replace("/index.tsx", ""),
//     element,
//   });
// }

export const router = createBrowserRouter(routes);
