'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {Space, Tooltip, ConfigProvider, theme, Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import dynamic from "next/dynamic";
import SearchBar from "@/components/search-bar";
import Filters from "@/components/filters";
import EventList from "@/components/event-list";


const Map = dynamic(() => import('@/components/map'), { ssr: false });
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
  {value: "time", label: "Newest"},
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
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [layout, setLayout] = useState<'map' | 'list'>('list');
  const [sort, setSort] = useState<"time" | "servings">("time");
  const [reserves, setReserves] = useState<number[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [search, setSearch] = useState("");


const filteredEvents = mockEvents
.filter((e) => categoryFilter.length === 0 || categoryFilter.includes(e.category))
.filter((e) => dietary.length === 0 || dietary.every(d => e.dietary.includes(d)))
.filter((e) => allergy.length === 0 || allergy.every(a => !e.allergies.includes(a)))
.filter((e) => location.length === 0 || location.includes(e.campus))
.filter((e) => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.description.toLowerCase().includes(search.toLowerCase()) || 
    e.location.toLowerCase().includes(search.toLowerCase())
  )
.sort((a,b) => {
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
      <Space.Compact style={{width: '100%'}}>
      <SearchBar
        layout={layout}
        setLayout={setLayout}
        search={search}
        setSearch={setSearch}
      />
      </Space.Compact>

      <Filters
        layout={layout}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dietary={dietary}
        setDietary={setDietary}
        dietaryOptions={dietaryOptions}
        allergy={allergy}
        setAllergy={setAllergy}
        allergyOptions={allergyOptions}
        location={location}
        setLocation={setLocation}
        locationOptions={locationOptions}
        sort={sort}
        setSort={setSort}
        sortOptions={sortOptions}
      />

        {layout === 'list' ? (
            <EventList
                filteredEvents={filteredEvents}
                favorites={favorites}
                favs={favs}
                reserves={reserves}
                reserve={reserve}
                defaults={defaults}
            />
        ) : ( 
            <Map/>
        )}

      <Tooltip title="Post a new event">
        <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusOutlined className="plus-icon"/>}
            className="floating-post-button"
            onClick={() => router.push("/post")}
        />
        </Tooltip>
        </Space>
        </ConfigProvider>
    );
    }