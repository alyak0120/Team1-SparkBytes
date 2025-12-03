"use client";
import {Drawer, Button, Space, Typography, Collapse, Checkbox} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import { useState } from "react";
const{Title, Text} = Typography;

interface FilterProps {
    categories: string[];
    categoryFilter: string[];
    setCategoryFilter: (val: string[]) => void;
    layout: "map" | "list";
    
    sort: "time" | "servings";
    setSort: (val: "time" | "servings") => void;
    sortOptions: {label: string; value: string}[];
    
    dietary: string[];
    setDietary: (val: string[]) => void;
    dietaryOptions: string[];
    
    allergy: string[];
    setAllergy: (val: string[]) => void;
    allergyOptions: string[];
    
    location: string[];
    setLocation: (val: string[]) => void;
    locationOptions: string[];
}

export default function Filters({categoryFilter, setCategoryFilter, categories, sort, setSort, sortOptions, layout,
    dietary, setDietary, dietaryOptions, allergy, setAllergy, allergyOptions, location, setLocation, locationOptions
} : FilterProps){
    const [open, setOpen] = useState(false);
    
    return (
    <>
    <Button
        icon={<FilterOutlined />}
        onClick={() => setOpen(true)}
        type="default"
        style={{borderRadius:8}}
    >
        Filters
    </Button>

    {layout === "list" && (
        <Space style={{marginLeft: 16}}>
            <Button
                type={sort === "servings" ? "primary" : "default"}
                onClick={() => setSort("servings")}
            >
                Servings Left
            </Button>
            <Button
                type={sort === "time" ? "primary" : "default"}
                onClick={() => setSort("time")}
            >
                Newest
            </Button>
        </Space>
    )}
    <Drawer
        title="Filters"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={320}
    >
    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
    <Space direction = "vertical" style={{width: "100%", flex:1}} size={4}>
                <Collapse
                    ghost
                    style={{width: "100%"}}
                    expandIconPosition="end"
                    items={[
                        {
                            key: "category",
                            label: <Title level={5} style={{margin: 0}}>Category</Title>,
                            children: (
                                <Checkbox.Group
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e as string[])}
                                    style={{display: "flex", flexDirection: "column", gap: 2, paddingLeft: 12}}
                                >
                                    {categories.map((cat) => (
                                        <Checkbox key={cat} value={cat}>
                                            {cat}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            ),
                        },
                    {
                        key: "dietary",
                        label: <Title level={5} style={{margin:0}}>Dietary Preferences</Title>,
                        children: (
                            <>
                            <Text type="secondary" style={{fontSize:12}}>
                                Events shown satisfy <b>all</b> selected dietary preferences.</Text>
                            <Checkbox.Group
                                value={dietary}
                                onChange={(e) => setDietary(e as string[])}
                                style={{display: "flex", flexDirection: "column", gap: 2, paddingLeft: 12}}
                            >
                                {dietaryOptions.map((e) => (
                                    <Checkbox key={e} value={e}>
                                        {e}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                            </>
                        ),
                    },
                    {
                        key: "allergies",
                        label: <Title level={5} style={{margin:0}}>Allergies</Title>,
                        children: (
                            <>
                            <Text type="secondary" style={{fontSize:12}}>
                                Events shown do <b>not contain</b> any selected allergens.</Text>
                            <Checkbox.Group
                                value={allergy}
                                onChange={(e) => setAllergy(e as string[])}
                                style={{display: "flex", flexDirection: "column", gap: 2, paddingLeft: 12}}
                            >
                                {allergyOptions.map((e) => (
                                    <Checkbox key={e} value={e}>
                                        {e}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                            </>
                        ),
                    },
                    {
                        key: "location",
                        label: <Title level={5} style={{margin:0}}>Campus Location</Title>,
                        children: (
                            <Checkbox.Group
                                value={location}
                                onChange={(e) => setLocation(e as string[])}
                                style={{display: "flex", flexDirection: "column", gap: 2, paddingLeft: 12}}
                            >
                                {locationOptions.map((e) => (
                                    <Checkbox key={e} value={e}>
                                        {e}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        ),
                    },
                    ]}
                />
        </Space>
        <Button
            danger
            block
            style={{marginTop: "auto"}}
            onClick={()=> {
                setCategoryFilter([]);
                setDietary([]);
                setAllergy([]);
                setLocation([]);
            }}
        >
            Clear all filters
        </Button>
        </div>
    </Drawer>
    </>
    );
}