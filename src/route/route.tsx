import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/login",
      },
    ],
  },
];
export const router = createBrowserRouter(routes);
