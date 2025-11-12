"use client";
import { Button, Layout, Menu, Flex, Divider, Image, ConfigProvider, Splitter, Input, Switch} from "antd";

import Text from 'antd/lib/typography/Text';
import Title from "antd/lib/typography/Title";
import Sider from "antd/lib/layout/Sider";
import Panel from "antd/lib/splitter/Panel";
import Link from "antd/lib/typography/Link";

import { useEffect, useRef, useState } from "react";

import { Header, Content, Footer } from "antd/lib/layout/layout";

import profile_img from "../../../public/images/profile_img.png";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient(); // serves as a window to the DB
// console.log(supabase);

const menuItems = [
  {
    key: "Nav1",
    label: "Profile",
  },
  {
    key: "Nav2",
    label: "Bookmarks",
  },
  {
    key: "Nav3",
    label: "Event Preferences",
  },
  {
    key: "Nav4",
    label: "Notifications",
  }
]

const Home = () => {
  const notificationRef = useRef(null);

  const [sampleData, setSampleData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
      .from('samples').select('*');

      // console.log(`data: ${data}`);
      // console.log(`error: ${error}`);
      // setSampleData(data);
    };
    fetchData();
  }, []);

  return (
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
                    itemSelectedBg: '#303030',
                    itemSelectedColor: 'inherit',
                    itemHoverColor: 'inherit',
                  },
                },
              }}>
              <Menu 
              color="white" 
              style={{background: "#212121", color: "white"}} 
              mode="inline" 
              items={menuItems}
              />
            </ConfigProvider>
          </Sider>

          {/* Add page switch logic here */}
          <Content style={{background: "#303030", minHeight: ""}}>
            <Title style={{color: "#E0E0E0", margin: 0, padding: 8}}>Account Information</Title>
            <Divider style={{background: "#E0E0E0", margin: 0}} size="large" type="horizontal"/>
            <Splitter>
              <Panel resizable={false} style={{color: "white", textAlign: "center"}} size={310}>
                <Image style={{padding: 10, border: "solid 1px #212121", borderRadius: 200,}} width={300} src={profile_img.src} alt="text" />
                <Title style={{color: "#E0E0E0", margin: 0, padding: 4}} level={2}>Name Placeholder</Title>
                <Text style={{color: "#E0E0E0", margin: 0, padding: 0}}>(BU Email)</Text>
                <br/> <Button onClick={() => notificationRef.current?.scrollIntoView()}>Scroll to Notifications</Button>
              </Panel>
              <Panel resizable={false} style={{background: "#212121"}}>
                <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={2}>Profile </Title>
                <div style={{paddingLeft: 10}}>
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>Full Name:</Text> <br/>
                  <Input style={{ width: 200}} placeholder="First Name, Last Name"/> <br/>
                    
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>Email:</Text> <br/>
                  <Input style={{ width: 200}} placeholder="BU Email"/> <br/>
                  
                  <Text style={{color: "#E0E0E0", fontSize: 20}}>BU ID:</Text> <br/>
                  <Input style={{ width: 200}} placeholder="BU ID"/> <br/>
                </div>

                <Divider style={{background: "#E0E0E0", marginBottom: 0}} size="large" type="horizontal"/>
                <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={2}>Bookmarks</Title>
                  <div style={{paddingLeft: 10}}>
                      <Text style={{color: "#E0E0E0", fontSize: 20}}>Insert events here.</Text> <br/>
                      {/* Add logic for displaying favorited events. */}
                  </div>

                <Divider style={{background: "#E0E0E0", marginBottom: 0}} size="large" type="horizontal"/>
                <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={2}>Event Preferences</Title>
                
                <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={3}>Food Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "#E0E0E0", fontSize: 20}}>No specified food preferences.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "#E0E0E0", fontSize: 20}}>Add a food preference?</Text></Link>
                    {/* Add logic for adding allergies if needed? Probably make it static to this page. */}
                  </div>

                  <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={3}>Allergy Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "#E0E0E0", fontSize: 20}}>No specified allergy information.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "#E0E0E0", fontSize: 20}}>Add an allergy?</Text></Link>
                    {/* Add logic for adding allergies if needed? Probably make it static to this page. */}
                  </div>

                  <Title style={{color: "#E0E0E0", margin: 0, padding: 8}} level={3}>Location Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "#E0E0E0", fontSize: 20}}>No specified location information.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "#E0E0E0", fontSize: 20}}>Add a location?</Text></Link>
                    {/* Add logic for adding locations of interest if needed? Probably make it static to this page. */}
                  </div>
                  
                <Divider style={{background: "#E0E0E0", marginBottom: 0}} size="large" type="horizontal"/>
                <Title ref={notificationRef} style={{color: "#E0E0E0", margin: 0, padding: 8}} level={2}>Notifications</Title>

                  <div style={{paddingLeft: 10, paddingBottom: 75}}>
                    <Text style={{color: "#E0E0E0", fontSize: 20}}>Enable SparkBytes! notifications?</Text> <Switch/> <br/>
                    <Text style={{color: "#E0E0E0", fontSize: 20}}>Enable event tracking notifications?</Text> <Switch/> <br/> 
                  </div>
              </Panel>
            </Splitter>
            
          </Content>
          
          {/* <Divider style={{background: "white"}} type="vertical"/> */}
        
        </Layout>
          <Footer style={{background: "#212121", color: "#E0E0E0", zIndex: 10}}>Here&apos;s a footer</Footer>
        </Layout>
    </Flex>
    // </div>
)};

export default Home;