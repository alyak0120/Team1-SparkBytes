"use client";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Layout,
  Menu,
  Flex,
  Divider,
  Image,
  ConfigProvider,
  Splitter,
  Input,
  Tag,
} from "antd";

import { Content } from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import Sider from "antd/lib/layout/Sider";
import Link from "antd/lib/typography/Link";
import Panel from "antd/lib/splitter/Panel";

import profile_img from "../../public/images/profile_img.png";
import { createClient } from "@/lib/supabase/client";
import NotificationSettings from "@/components/notification-settings";

const supabase = createClient();

const menuItems = [
  { key: "Nav1", label: "Profile" },
  { key: "Nav2", label: "Bookmarks" },
  { key: "Nav3", label: "Event Preferences" },
  { key: "Nav4", label: "Notifications" },
];

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return user || null;
}

const DashboardPage = () => {
  const notificationRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [BUID, setBUID] = useState("");

  async function getCurrentProfile() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id);

    if (error) {
      console.log(error.message);
      return;
    }

    if (data?.[0]) {
      setName(data[0].name);
      setEmail(data[0].email);
      setBUID(data[0].bu_id);
    }
  }

  useEffect(() => {
    getCurrentProfile();
  }, []);

  return (
    <Flex gap="middle" wrap>
      <Layout
        style={{
          background: "#212121",
          color: "#E0E0E0",
          flexDirection: "initial",
          height: "100vh",
        }}
      >
        {/* SIDEBAR */}
        <Sider style={{ background: "#212121" }}>
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemColor: "#E0E0E0",
                  itemSelectedBg: "#303030",
                  itemSelectedColor: "inherit",
                  itemHoverColor: "inherit",
                },
              },
            }}
          >
            <Menu
              style={{ background: "#212121", color: "white" }}
              mode="inline"
              items={menuItems}
            />
          </ConfigProvider>
        </Sider>

        {/* MAIN CONTENT */}
        <Content style={{ background: "#303030" }}>
          <Title style={{ color: "#E0E0E0", margin: 0, padding: 8 }}>
            Account Information
          </Title>
          <Divider
            style={{ background: "#E0E0E0", margin: 0 }}
            size="large"
            type="horizontal"
          />

          <Splitter>
            {/* LEFT PANEL – PROFILE SIDEBAR */}
            <Panel
              resizable={false}
              style={{ color: "white", textAlign: "center" }}
              size={310}
            >
              <Image
                style={{
                  padding: 10,
                  border: "solid 1px #212121",
                  borderRadius: 200,
                }}
                width={300}
                src={profile_img.src}
                alt="Profile"
              />

              <Title style={{ color: "#E0E0E0", margin: 0 }} level={2}>
                {name}
              </Title>
              <Text style={{ color: "#E0E0E0" }}>({email})</Text>

              <br />
              <Button
                onClick={() =>
                  notificationRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Scroll to Notifications
              </Button>
            </Panel>

            {/* RIGHT PANEL – MAIN SECTIONS */}
            <Panel style={{ background: "#212121" }} resizable={false}>
              {/* PROFILE SECTION */}
              <Title style={{ color: "#E0E0E0", padding: 8 }} level={2}>
                Profile
              </Title>
              <div style={{ paddingLeft: 10 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 20 }}>
                  Full Name:
                </Text>
                <br />
                <Input style={{ width: 200 }} value={name} readOnly />
                <br />

                <Text style={{ color: "#E0E0E0", fontSize: 20 }}>Email:</Text>
                <br />
                <Input style={{ width: 200 }} value={email} readOnly />
                <br />

                <Text style={{ color: "#E0E0E0", fontSize: 20 }}>BU ID:</Text>
                <br />
                <Input style={{ width: 200 }} value={BUID} readOnly />
                <br />
              </div>

              <Divider style={{ background: "#E0E0E0" }} />

              {/* BOOKMARKS SECTION */}
              <Title style={{ color: "#E0E0E0", padding: 8 }} level={2}>
                Bookmarks
              </Title>
              <div style={{ paddingLeft: 10 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 20 }}>
                  Insert events here.
                </Text>
              </div>

              <Divider style={{ background: "#E0E0E0" }} />

              {/* EVENT PREFERENCES SECTION */}
              <Title style={{ color: "#E0E0E0", padding: 8 }} level={2}>
                Event Preferences
              </Title>

              <div style={{ paddingLeft: 10 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 20 }}>
                  No preferences added yet.
                </Text>
              </div>

              <Divider style={{ background: "#E0E0E0" }} />

              {/* NOTIFICATIONS SECTION */}
              <Title
                ref={notificationRef}
                style={{ color: "#E0E0E0", padding: 8 }}
                level={2}
              >
                Notifications
              </Title>

              <div style={{ paddingLeft: 10, paddingBottom: 75 }}>
                <NotificationSettings />
              </div>
            </Panel>
          </Splitter>
        </Content>
      </Layout>
    </Flex>
  );
};

export default DashboardPage;
