import { Button, Typography, Layout, Menu, Flex, Divider, Image, ConfigProvider, Splitter} from "antd";

import Text from 'antd/lib/typography/Text';
import Title from "antd/lib/typography/Title";
import Sider from "antd/lib/layout/Sider";

import { Header, Content, Footer } from "antd/lib/layout/layout";

import profile_img from "../../public/images/profile_img.png";
import Panel from "antd/lib/splitter/Panel";

const text = "ehy";

const menuItems = [
  {
    key: "Nav1",
    label: "Profile",
  },
  {
    key: "Nav2",
    label: "Favorites",
  },
  {
    key: "Nav3",
    label: "Settings",
  }
]

const Home = () => (
  // <div style={{color: "white"}}>
    // <div style={{padding: 0, margin: 0}}>
    <Flex gap="middle" wrap>
      <Layout>
        <Layout style={{background: "#212121", color: "#E0E0E0", flexDirection: 'initial', height:"100vh"}}>
          <Sider style={{background: "#212121", color: "white"}}>
            <ConfigProvider 
              theme={{
                components: {
                  Menu: {
                    itemColor: "#E0E0E0",
                  },
                },
              }}>
              <Menu color="white" style={{background: "#212121", color: "white"}} mode="inline" items={menuItems}/>
            </ConfigProvider>
          </Sider>

          {/* Add page switch logic here */}
          <Content style={{background: "#303030", minHeight: ""}}>
            <Title style={{color: "#E0E0E0", margin: 0, padding: 8}}>Profile</Title>
            <Divider style={{background: "white", margin: 0}} size="large" type="horizontal"/>
            <Splitter>
              <Panel resizable={false} style={{color: "white", textAlign: "center"}} size={310}>
                <Image style={{padding: 10, border: "solid 1px #212121", borderRadius: 200,}} width={300} src={profile_img.src} alt="text" />
                <Title style={{color: "#E0E0E0", margin: 0, padding: 4}} level={2}>Insert Name</Title>
                <Text style={{color: "#E0E0E0", margin: 0, padding: 0}}>(BU Email)</Text>
              </Panel>
              <Panel>
                <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={2}>Profile Information</Title>
                <div style={{paddingLeft: 10}}>
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>Info</Text> <br/>
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>More Info</Text> <br/>
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>Etc. Info</Text> <br/>
                </div>
              </Panel>
            </Splitter>
            
          </Content>
          
          {/* <Divider style={{background: "white"}} type="vertical"/> */}
        
        </Layout>
          <Footer style={{background: "#212121", color: "#E0E0E0"}}>Here&apos;s a footer</Footer>
        </Layout>
    </Flex>
    // </div>
);

export default Home;