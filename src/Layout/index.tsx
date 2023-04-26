import { Layout as ALayout, Menu, Space } from "@arco-design/web-react";
import { Outlet, useNavigate } from "react-router-dom";
import { IconApps, IconBug } from "@arco-design/web-react/icon";
import threeIco from "@/assets/three_white.ico";
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
        <Sider style={{ backgroundColor: "#232324" }}>
          <Menu
            onClickMenuItem={onMenuClick}
            style={{ width: 200, borderRadius: 4 }}
            theme="dark"
          >
            <SubMenu
              key="/login"
              title={
                <>
                  <IconApps /> 登录
                </>
              }
            >
              <MenuItem key="/login/markupSchema">Markup Schema</MenuItem>
              <MenuItem key="/login/jsonSchema">Json Schema</MenuItem>
              <MenuItem key="/login/jsx">纯JSX</MenuItem>
            </SubMenu>
            <SubMenu
              key="/register"
              title={
                <>
                  <IconApps /> 注册
                </>
              }
            >
              <MenuItem key="/register/markupSchema">Markup Schema</MenuItem>
              <MenuItem key="/register/jsonSchema">Json Schema</MenuItem>
              <MenuItem key="/register/jsx">纯JSX</MenuItem>
            </SubMenu>
            <SubMenu
              key="/password"
              title={
                <>
                  <IconApps /> 忘记密码
                </>
              }
            >
              <MenuItem key="/password/markupSchema">Markup Schema</MenuItem>
              <MenuItem key="/password/jsonSchema">Json Schema</MenuItem>
              <MenuItem key="/password/jsx">纯JSX</MenuItem>
            </SubMenu>
            <SubMenu
              key="/edit"
              title={
                <>
                  <IconBug /> 编辑
                </>
              }
            >
              <MenuItem key="/edit/markupSchema">Markup Schema</MenuItem>
              <MenuItem key="/edit/jsonSchema">Json Schema</MenuItem>
              <MenuItem key="/edit/jsx">纯JSX</MenuItem>
            </SubMenu>
            <SubMenu
              key="/reactive"
              title={
                <>
                  <IconBug /> formily/reactive
                </>
              }
            >
              <MenuItem key="/reactive/observable">observable</MenuItem>
              <MenuItem key="/reactive/observer">observer</MenuItem>
            </SubMenu>
          </Menu>
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </ALayout>
    </ALayout>
  );
};

export default Layout;
