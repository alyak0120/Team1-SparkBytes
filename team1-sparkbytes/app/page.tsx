'use client';

import {useState} from 'react';
import {Card, Button, Tag, Select, Row, Col, Typography, Space, Tooltip, Empty, ConfigProvider, theme} from 'antd';
import {EnvironmentOutlined, ClockCircleOutlined, UserOutlined, HeartOutlined, HeartFilled, FlagOutlined, UnorderedListOutlined} from '@ant-design/icons';

const defaults: Record<string, string> = {
  Pizza: "/images/pizza.jpg",
  Mexican: "/images/tacos.jpg",
  Asian: "/images/sushi.jpg",
  Breakfast: "/images/muffins.jpg",
  Other: "/images/default.jpg"
};

const mockEvents = [
  {
    id: 1,
    title: "Pizza Night",
    category: "Pizza",
    distance: 2,
    description: "Join us for free pizza slices and good vibes!",
    location: "Student Union",
    time: "5:00 PM - 7:00 PM",
    servingsLeft: 10,
    image: "/images/pizza.jpg",
  },
  {
    id: 2,
    title: "Taco Tuesday",
    category: "Mexican",
    distance: 5,
    description: "Spicy tacos and fun games!",
    location: "Cafeteria Patio",
    time: "6:00 PM - 8:00 PM",
    servingsLeft: 6,
    image: "/images/tacos.jpg",
  },
  {
    id: 3,
    title: "Sushi Social",
    category: "Asian",
    distance: 1,
    description: "Fresh sushi rolls made on site!",
    location: "Library Courtyard",
    time: "12:00 PM - 2:00 PM",
    servingsLeft: 12,
    image: "/images/sushi.jpg",
  },
  {
    id: 4,
    title: "Bagel Brunch",
    category: "Breakfast",
    distance: 4,
    description: "Cream cheese, coffee, and bagels!",
    location: "Campus Café",
    time: "10:00 AM - 12:00 PM",
    servingsLeft: 8,
    image: "/images/muffins.jpg",
  },
];


const categories = ["All", "Pizza", "Mexican", "Asian", "Breakfast", "Other"]; //does this make sense
const sortOptions = [
  {value: "distance", label: "Distance"},
  {value: "time", label: "Time Posted"},
];

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [layout, setLayout] = useState<'map' | 'list'>('list');
  const [sort, setSort] = useState<"distance" | "time">("distance");
  const [reserves, setReserves] = useState<number[]>([]);

  const filteredEvents = mockEvents.filter((e) => filter === "All" || e.category === filter).sort((a,b) =>
  sort === "distance" ? a.distance - b.distance : a.time.localeCompare(b.time));
  
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

        <Select value={sort} onChange={(value: "distance" | "time") => setSort(value)} options={sortOptions} style={{width:160}}/>
    </Space>
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
                    <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>{event.distance} mi away</Typography.Text>
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
                      size="middle"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1 px solid #f0f0f0",
                        paddingTop: 8,
                      }}>
                      <Tooltip title="Favorite">
                        <Button 
                          type="text" 
                          icon={favorites.includes(event.id)? (<HeartFilled style={{color:"#CC0000"}} />) :
                        (<HeartOutlined/>)} 
                          onClick={() => favs(event.id)}
                        />
                      </Tooltip>
                      <Button 
                        key="reserve" 
                        type={reserves.includes(event.id) ? "default" : "primary"}
                        style={{
                          transition: "all 0.3s ease",
                          backgroundColor: reserves.includes(event.id) ? "#52c41a": undefined,
                          color: reserves.includes(event.id) ? "white": undefined,
                          borderColor: reserves.includes(event.id) ? "#52c41a" : undefined,
                          minWidth: 100,
                        }}
                        icon={reserves.includes(event.id) ? <span>✅</span> : null}
                        onClick={() => reserve(event.id)}>
                        {reserves.includes(event.id) ? "Reserved" : "Reserve"}
                      </Button>
                      <Button danger icon={<FlagOutlined/>}>
                        Report
                      </Button>
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
    </Space>
    </ConfigProvider>
  );
}