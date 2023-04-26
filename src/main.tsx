import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/route";
import "@arco-design/web-react/dist/css/arco.css";
import "./style/index.less";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
