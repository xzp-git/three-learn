import { Layout as ALayout, Menu, Space } from "@arco-design/web-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import threeIco from "@/assets/three_white.ico";
import routes from "@/route/route";

import style from "./index.module.less";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = ALayout.Sider;
const Header = ALayout.Header;
const Content = ALayout.Content;

const Layout = () => {
  const navigate = useNavigate();
  const onMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <ALayout style={{ height: "100%" }}>
      <Header
        style={{
          height: 70,
          backgroundColor: "#232324",
          padding: 20,
          borderBottom: "1px solid #fff",
        }}
      >
        <Space size={12}>
          <img style={{ width: 30 }} src={threeIco} alt="" />
          <span style={{ color: "#fff", fontSize: 24 }}>Three.js</span>
        </Space>
      </Header>
      <ALayout>
        <Sider
          className={style["custom-aside"]}
          style={{ backgroundColor: "#232324" }}
        >
          <Menu
            onClickMenuItem={onMenuClick}
            style={{ width: 200, borderRadius: 4 }}
            theme="dark"
          >
            {routes?.map((route) => {
              if (route.path === "/") {
                return null;
              }
              return (
                //@ts-ignore
                <MenuItem key={route.path}>
                  {
                    //@ts-ignore
                    route.element!.displayName as any as string
                  }
                </MenuItem>
              );
            })}
          </Menu>
        </Sider>
        <Content>
          <Routes>
            {routes?.map(({ path, element: Element }) => {
              //@ts-ignore
              return <Route key={path} path={path} element={<Element />} />;
            })}
          </Routes>
        </Content>
      </ALayout>
    </ALayout>
  );
};

export default Layout;
