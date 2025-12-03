'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {useState} from 'react';
import {Card, Button, Tag, Select, Row, Col, Typography, Space, Tooltip, Empty, ConfigProvider, theme} from 'antd';
import {EnvironmentOutlined, ClockCircleOutlined, UserOutlined, HeartOutlined, HeartFilled, FlagOutlined, UnorderedListOutlined} from '@ant-design/icons';
import ReportButton from "@/components/report-button";
import BookmarkButton from "@/components/bookmark-button";
import { BookOutlined, BookFilled } from "@ant-design/icons";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Menu } from "antd";



const defaults: Record<string, string> = {
  Pizza: "/images/pizza.jpg",
  Mexican: "/images/tacos.jpg",
  Asian: "/images/sushi.jpg",
  Breakfast: "/images/muffins.jpg",
  Other: "/images/default.jpg"
};

const initialMockEvents = [
  {
    id: 1,
    title: "Pizza Night",
    category: "Pizza",
    description: "Join us for free pizza slices and good vibes!",
    location: "Student Union",
    campus: "Central Campus",
    time: "5:00 PM - 7:00 PM",
    servingsLeft: 10,
    image: "/images/pizza.jpg",
    dietary: ["Vegetarian"],
    allergies: ["Contains Dairy", "Contains Gluten"],
  },
  {
    id: 2,
    title: "Taco Tuesday",
    category: "Mexican",
    description: "Spicy tacos and fun games!",
    location: "Cafeteria Patio",
    campus: "East Campus",
    time: "6:00 PM - 8:00 PM",
    servingsLeft: 6,
    image: "/images/tacos.jpg",
    dietary: ["Halal"],
    allergies: ["Contains Gluten"],
  },
  {
    id: 3,
    title: "Sushi Social",
    category: "Asian",
    description: "Fresh sushi rolls made on site!",
    location: "Library Courtyard",
    campus: "West Campus",
    time: "12:00 PM - 2:00 PM",
    servingsLeft: 12,
    image: "/images/sushi.jpg",
    dietary: ["Pescatarian"],
    allergies: ["Contains Soy"],
  },
  {
    id: 4,
    title: "Bagel Brunch",
    category: "Breakfast",
    description: "Cream cheese, coffee, and bagels!",
    location: "Campus Café",
    campus: "Fenway Campus",
    time: "10:00 AM - 12:00 PM",
    servingsLeft: 8,
    image: "/images/muffins.jpg",
    dietary: ["Vegetarian"],
    allergies: ["Contains Dairy", "Contains Gluten"],
  },
];



const categories = ["All", "Pizza", "Mexican", "Asian", "Breakfast", "Other"]; //does this make sense
const sortOptions = [
  {value: "time", label: "Time Posted"},
  {value: "servings", label: "Servings Left"},
];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Pescatarian"];
const allergyOptions = ["Peanut-Free", "Dairy-Free", "Soy-Free", "Gluten-Free"];
const locationOptions = ["East Campus", "West Campus", "South Campus", "Central Campus", "Fenway Campus"];

export default function Home() {
    const router = useRouter();

  useEffect(() => {
    // if (localStorage.getItem("loggedIn") !== "true") {
    //   router.push("/auth/login");
    // }
  }, []);
  const [events, setEvents] = useState(initialMockEvents);
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [layout, setLayout] = useState<'map' | 'list'>('list');
  const [sort, setSort] = useState<"time" | "servings">("time");
  const [reserves, setReserves] = useState<number[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);



const filteredEvents = events.filter((e) => filter === "All" || e.category === filter).filter((e) => dietary.length === 0 ||
dietary.some(dopts => e.dietary.includes(dopts))).filter((e) => allergy.length === 0 ||
allergy.every(aopts => !e.allergies.includes(aopts))).filter((e) => location.length === 0 ||
location.includes(e.campus)).sort((a,b) => {
  if (sort==="time") return a.id - b.id;
  if (sort === "servings") return b.servingsLeft-a.servingsLeft;
  return 0;
});
  
  const favs = (id:number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]);
  };

  const reserve = (id:number) => {
    setReserves((prev) => prev.includes(id) ? prev.filter(resy => resy !==id) : [...prev, id]);
  };
  
  return(
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#CC0000',
          borderRadius: 12,
          colorBgContainer: '#fff',
        }
      }}
    >
      

    <Space
      size="large"
      direction="vertical"
      style={{width: '100%', padding: '24px 32px'}}>
      <Row justify="space-between" align="middle" style={{marginBottom: 12}}>
        {/*HAMBURGER*/}
         <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setDrawerOpen(true)}
      />
      <Space size="middle" wrap>
      <Button
        type={layout === "list" ? "primary" : "default"}
        icon={<UnorderedListOutlined />}
        onClick={() => setLayout("list")}
        >
          List
        </Button>
        <Button
        type={layout === "map" ? "primary" : "default"}
        icon={<EnvironmentOutlined />}
        onClick={() => setLayout("map")}
        >
          Map
        </Button>
        </Space>
            

        <Space wrap>
          {categories.map((e) => (
            <Tag
              key={e}
              color={filter === e ? "red" : undefined}
              style={{cursor: "pointer",
                fontWeight:500,
                padding: '4px 10px',
                borderRadius: 16,
              }}
              onClick={() => setFilter(e)}
              >
                {e}
              </Tag>
          ))}

        <Select value={sort} onChange={(value: "time" | "servings") => setSort(value)} options={sortOptions} style={{width:160}}/>
    </Space>
    </Row>

    <Row gutter={[16,16]} style={{marginTop: 16}}>
      <Col xs={24} sm={8}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by dietary preference"
            value={dietary}
            onChange={setDietary}
            options={dietaryOptions.map((dopts) => ({label: dopts, value: dopts}))}
            style={{width: "100%"}}
          />
      </Col>

      <Col xs={24} sm={8}>
        <Select
            mode="multiple"
            allowClear
            placeholder="Filter by allergies"
            value={allergy}
            onChange={setAllergy}
            options={allergyOptions.map((aopts) => ({label: aopts, value: aopts}))}
            style={{width: "100%"}}
          />
      </Col>

      <Col xs={24} sm={8}>
        <Select
            mode="multiple"
            allowClear
            placeholder="Filter by location"
            value={location}
            onChange={setLocation}
            options={locationOptions.map((lopts) => ({label: lopts, value: lopts}))}
            style={{width: "100%"}}
          />
      </Col>
    </Row>
    <div style={{marginTop:12}}>
          {layout === "list" ? (
            <Row gutter={[24,24]} justify="start">
              {filteredEvents.length === 0 ? (
                <Empty description="No events available"/>
              ) : (filteredEvents.map((event) => (
                <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={event.title}
                        src={event.image || defaults[event.category]}
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}  
                      />
                    }
                    style={{borderRadius:12,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                    >
                  
                    <Typography.Title level={5} style={{marginBottom:4}}>{event.title}</Typography.Title>
                    <p>{event.description}</p>
                    <Space direction="vertical" size={2}>
                      <Typography.Text>
                        <EnvironmentOutlined/> {event.location}
                      </Typography.Text>
                      <Typography.Text>
                        <ClockCircleOutlined/> {event.time}
                      </Typography.Text>
                      <Typography.Text>
                        <UserOutlined/> {event.servingsLeft} servings left
                      </Typography.Text>
                    </Space>

                    <Space
                      size="small"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        gap: 8,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 8,
                      }}
                    >

                    {/* Favorite */}
                    <Tooltip title="Favorite">
                      <Button 
                        type="text" 
                        icon={favorites.includes(event.id) ? (
                          <HeartFilled style={{ color: "#CC0000" }} />
                        ) : (
                          <HeartOutlined />
                        )}
                        onClick={() => favs(event.id)}
                      />
                    </Tooltip>

                    {/* Bookmark */}
                    <BookmarkButton eventId={event.id} eventTitle={event.title} />

                    {/* Reserve */}
                    <Button 
                      key="reserve" 
                      type={reserves.includes(event.id) ? "default" : "primary"}
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: reserves.includes(event.id) ? "#52c41a" : undefined,
                        color: reserves.includes(event.id) ? "white" : undefined,
                        borderColor: reserves.includes(event.id) ? "#52c41a" : undefined,
                        minWidth: 100,
                      }}
                      icon={reserves.includes(event.id) ? <span>✅</span> : null}
                      onClick={() => reserve(event.id)}
                    >
                      {reserves.includes(event.id) ? "Reserved" : "Reserve"}
                    </Button>

                    {/* Report */}
                    <ReportButton eventId={event.id} eventTitle={event.title} />
                  </Space>

                  </Card>
                </Col>
              )))} 
            </Row>
          ) : (<Card style={{textAlign: "center"}}>
            <Empty description="Map View Placeholder" image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Typography.Text style={{display: "block", marginTop:8}}>
              hopefully a map....
            </Typography.Text>
          </Card>)}
          </div>
          
          {/*DRAWER*/}
           <Drawer
            title="Menu"
            placement="left"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
          >
            <Menu
              mode="inline"
              items={[
                { key: "account", icon: <UserOutlined />, label: "My Account", onClick: () => router.push("/account") },
                { key: "bookmarks", icon: <BookOutlined />, label: "Bookmarks", onClick: () => router.push("/bookmarks") },
                { key: "report", icon: <FlagOutlined />, label: "Report a Problem", onClick: () => router.push("/report") },
              ]}
            />
          </Drawer>

    </Space>
    </ConfigProvider>
  );
}
