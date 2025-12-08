"use client";
import { useEffect, useRef, useState } from "react";

import { Button, Layout, Menu, Flex, Divider, Image, ConfigProvider, Splitter, Input, Switch, Tag} from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";

import Text from 'antd/lib/typography/Text';
import Title from "antd/lib/typography/Title";
import Sider from "antd/lib/layout/Sider";
import Link from "antd/lib/typography/Link";
import Panel from "antd/lib/splitter/Panel";

import profile_img from "../../public/images/profile_img.png";
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
  // {
  //   key: "Nav3",
  //   label: "Event Preferences",
  // },
  {
    key: "Nav4",
    label: "Notifications",
  }
]

// const sampleAccount = {
//   firstName: "firstName",
//   lastName: "lastName",
//   email: "test@bu.edu",
//   BUID: "U12345678",
//   preferences: {},
// }

const Home = () => {
  const notificationRef = useRef(null);

  const [user, setUser] = useState({});
  const [sampleData, setSampleData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [BUID, setBUID] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [reservations, setReservations] = useState([]);

  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    if (user) {
      console.log('Currently logged in user:', user);
      setUser(user);
      return user;
    } else {
      console.log('No user is currently logged in.');
      return null;
    }
  }

  async function getCurrentProfile() {
    const user = await getCurrentUser();
    if (user != null) {
      const {data, error} = await supabase
      .from('profiles').select('*').eq('id', user.id);

      console.log(data);

      if (error) {
        console.log(error.message);
      } else {
        
        if (data[0]) {
          setName(data[0].name);
          setEmail(data[0].email);
          setBUID(data[0].bu_id);
          if (data[0].image_url) {
            console.log(data[0]["image_url"]);
            setImageURL(data[0].image_url);
            console.log("url", imageURL);
          }
          // console.log(data[0]);
        }

      }
    } else {
      console.log("No current user! Login in first.");
    }
  }

  async function getCurrentBookmarks() {
    // const user = await getCurrentUser();
    if (user != null) {
      const {data, error} = await supabase
      .from('bookmarks').select('*').eq('user_id', user.id);

      console.log(data);

      if (error) {
        console.log(error.message);
      } else {
        setBookmarks(data);
        console.log("Data:", data);
      }
    } else {
      console.log("No current user! Login in first.");
    }
  }

  async function getCurrentReservations() {
    // const user = await getCurrentUser();
    let reservedList = [];

    if (user != null) {
      const {data, error} = await supabase
      .from('reservations').select('*').eq('user_id', user.id);
      console.log("bang:", data);
      
      if (error) {
        console.log(error.message);
      } else {
        let reservedData = data;
        for (let i = 0; i < data.length; i++) {
          try {
            const {data, error} = await supabase
            .from('events').select('*').eq('id', reservedData[i].event_id);
            
            if (error) {
              console.log(error);
            } else {
              if (reservedList.length == 0) {
                reservedList = [data[0]];  
              } else {
                reservedList = [...reservedList, data[0]];
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
        console.log("reserved list:", reservedList)
        setReservations(reservedList);
        // console.log("reserved:", reservations[0])
        
      }
    } else {
      console.log("No current user! Login in first.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // const { data, error } = await supabase
      // .from('samples').select('*');
      await getCurrentUser();
      await getCurrentProfile();

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
        <Layout style={{background: "#FFF8F5", color: "#E0E0E0", flexDirection: 'initial', height:"100vh"}}>
          {/* <Sider style={{background: "#FFF8F5", color: "white"}}>
            <ConfigProvider 
              theme={{
                components: {
                  Menu: {
                    itemColor: "black",
                    itemSelectedBg: '#CC0000',
                    itemSelectedColor: '#fff',
                    itemHoverColor: 'inherit',
                  },
                },
              }}>
              <Menu 
              color="white" 
              style={{background: "#FFF8F5", color: "black"}} 
              mode="inline" 
              items={menuItems}
              />
            </ConfigProvider>
          </Sider> */}

          {/* Add page switch logic here */}
          <Content style={{background: "#FFF8F5", minHeight: ""}}>
            <Title style={{color: "black", margin: 0, padding: 8}}>Account Information</Title>
            <Divider style={{background: "black", margin: 0}} size="large" type="horizontal"/>
            <Splitter>
              <Panel resizable={false} style={{color: "white", textAlign: "center"}} size={310}>
                <Image style={{padding: 10, border: "solid 1px #212121", borderRadius: 200,}} width={300} height={300} src={imageURL || profile_img.src} alt="text" />
                <Title style={{color: "black", margin: 0, padding: 4}} level={2}>{name}</Title>
                <Text style={{color: "black", margin: 0, padding: 0}}>({email})</Text>
                <br/> <Button onClick={() => notificationRef.current?.scrollIntoView()}>Scroll to Notifications</Button>
                <Tag
                style={{cursor: "pointer",
                  fontWeight:500,
                  padding: '4px 10px',
                  borderRadius: 16,
                }}
                onClick={async () => {
                  const { data: {user}, error} = await supabase.auth.getUser();
                  if (error) {
                    console.log('Error signing out:', error.message);
                  }
      
                  if (user) {
                    console.log('Currently logged in user:', user);
                  } else {
                    console.log("No currently logged in user.");
                  }
                }}
                >(DEBUG) Check Current User</Tag>
                
                <Tag
                style={{cursor: "pointer",
                  fontWeight:500,
                  padding: '4px 10px',
                  borderRadius: 16,
                }}
                onClick={getCurrentReservations}
                >(DEBUG) Check Current Reservations</Tag>

                <Tag
                style={{cursor: "pointer",
                  fontWeight:500,
                  padding: '4px 10px',
                  borderRadius: 16,
                }}
                onClick={getCurrentBookmarks}
                >(DEBUG) Check Current Bookmarks</Tag>
              </Panel>
              <Panel resizable={false} style={{background: "#FFF8F5"}}>
                <Title style={{color: "black", margin: 0, padding: 8}} level={2}>Profile </Title>
                <div style={{paddingLeft: 10}}>
                  <Text style={{color: "black", fontSize: 20}}>Full Name:</Text> <br/>
                  <Input style={{ width: 200}} disabled placeholder="" value={name} readOnly/> <br/>
                    
                  <Text style={{color: "black", fontSize: 20}}>Email:</Text> <br/>
                  <Input style={{ width: 200}} disabled placeholder="" value={email} readOnly/> <br/>
                  
                  <Text style={{color: "black", fontSize: 20}}>BU ID:</Text> <br/>
                  <Input style={{ width: 200}} disabled 
                  placeholder="" value={BUID} readOnly/> <br/>
                </div>

                <Divider style={{background: "black", marginBottom: 0}} size="large" type="horizontal"/>
                <Title style={{color: "black", margin: 0, padding: 8}} level={2}>Reservations</Title>
                  <div style={{paddingLeft: 10}}>
                      {
                        reservations.length > 0 ? (reservations.map((reservation) => {
                          return (
                            <div key={reservation.id}>
                              <Text style={{color: "black", fontSize: 20}}>{reservation.title}</Text> <br/>
                            </div>
                          )
                        })) :
                        (<Text style={{color: "black", fontSize: 20}}>Insert events here.</Text> )
                      }
                      <br/>
                      {/* Add logic for displaying favorited events. */}
                  </div>

                <Divider style={{background: "black", marginBottom: 0}} size="large" type="horizontal"/>
                <Title style={{color: "black", margin: 0, padding: 8}} level={2}>Bookmarks</Title>
                  <div style={{paddingLeft: 10}}>
                      {
                        bookmarks.length > 0 ? (bookmarks.map((bookmark) => {
                          return (
                            <div key={bookmark.id}>
                              <Text style={{color: "black", fontSize: 20}}>{bookmark.event_title}</Text> <br/>
                            </div>
                          )
                        })) :
                        (<Text style={{color: "black", fontSize: 20}}>Insert events here.</Text> )
                      }
                      <br/>
                      {/* Add logic for displaying favorited events. */}
                  </div>

                {/* <Divider style={{background: "black", marginBottom: 0}} size="large" type="horizontal"/>
                <Title style={{color: "black", margin: 0, padding: 8}} level={2}>Event Preferences</Title>
                
                <Title style={{color: "black", margin: 0, padding: 8}} level={3}>Food Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "black", fontSize: 20}}>No specified food preferences.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "black", fontSize: 20}}>Add a food preference?</Text></Link>
                  </div>

                  <Title style={{color: "black", margin: 0, padding: 8}} level={3}>Allergy Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "black", fontSize: 20}}>No specified allergy information.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "black", fontSize: 20}}>Add an allergy?</Text></Link>
                  </div>

                  <Title style={{color: "black", margin: 0, padding: 8}} level={3}>Location Preferences:</Title>
                  <div style={{paddingLeft: 10}}>
                    <Text style={{color: "black", fontSize: 20}}>No specified location information.</Text> <br/>
                    <Link href="/" underline={true}><Text style={{color: "black", fontSize: 20}}>Add a location?</Text></Link>
                  </div> */}
                  
                <Divider style={{background: "black", marginBottom: 0}} size="large" type="horizontal"/>
                <Title ref={notificationRef} style={{color: "black", margin: 0, padding: 8}} level={2}>Notifications</Title>

                  <div style={{paddingLeft: 10, paddingBottom: 75}}>
                    <Text style={{color: "black", fontSize: 20}}>Enable SparkBytes! notifications?</Text> <Switch/> <br/>
                    <Text style={{color: "black", fontSize: 20}}>Enable event tracking notifications?</Text> <Switch/> <br/> 
                  </div>
              </Panel>
            </Splitter>
            
          </Content>
          
          {/* <Divider style={{background: "white"}} type="vertical"/> */}
        </Layout>
    </Flex>
)};

export default Home;