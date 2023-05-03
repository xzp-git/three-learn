import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import { BrowserRouter } from "react-router-dom";
import "@arco-design/web-react/dist/css/arco.css";
import "./style/base.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
