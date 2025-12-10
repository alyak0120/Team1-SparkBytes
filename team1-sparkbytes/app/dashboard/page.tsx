"use client";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Layout,
  Flex,
  Divider,
  Image,
  Splitter,
  Input,
  Modal,
  Form,
  Select,
} from "antd";

import { Content } from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import Panel from "antd/lib/splitter/Panel";

import EventList from "@/components/event-list";

import profile_img from "../../public/images/profile_img.png";
import { createClient } from "@/lib/supabase/client";

const defaults = { Other: "/images/default.jpg" };

const supabase = createClient();

const DashboardPage = () => {
  const notificationRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [BUID, setBUID] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [updateURL, setUpdateURL] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ---------------------------
  // Get current user
  // ---------------------------
  async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    if (data?.user) setUser(data.user);
    return data?.user || null;
  }

  // ---------------------------
  // Load user profile
  // ---------------------------
  async function getCurrentProfile() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id);

    if (!error && data?.[0]) {
      const profile = data[0];
      setName(profile.name);
      setEmail(profile.email);
      setBUID(profile.bu_id);
      if (profile.image_url) setImageURL(profile.image_url);
    }
  }

  // ---------------------------
  // Load bookmarks
  // ---------------------------
  async function getCurrentBookmarks() {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) setBookmarks(data);
  }

  // ---------------------------
  // Load reservations
  // ---------------------------
  async function getCurrentReservations() {
    if (!user) return;

    let reservedList: any[] = [];

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", user.id);

    if (error || !data) return;

    for (let r of data) {
      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("id", r.event_id);

      if (ev && ev[0]) reservedList.push(ev[0]);
    }

    setReservations(reservedList);
  }

  const showModal = () => {
    setIsModalVisible(true);
  }

  const handleOk = async () => {
    setIsModalVisible(false);
    const { data, error } = await supabase
    .from('profiles')
    .update({ image_url: updateURL})
    .eq('id', user.id);

    if (error) {
      console.error(error);
    } else {
      console.log('Successfully updated URL.');
      console.log(data);
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  // ---------------------------
  // Run on page load
  // ---------------------------
  useEffect(() => {
    (async () => {
      await getCurrentUser();
      await getCurrentProfile();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getCurrentBookmarks();
      await getCurrentReservations();
    })();
  }, [user]);

  return (
    <Flex gap="middle" wrap>
      <Layout
        style={{
          background: "#FFF8F5",
          flexDirection: "initial",
          height: "100vh",
        }}
      >
        {/* MAIN CONTENT */}
        <Content style={{ background: "#FFF8F5" }}>
          <Title style={{ color: "black", margin: 0, padding: 8 }}>
            Account Information
          </Title>

          <Divider style={{ background: "black", margin: 0 }} />

          <Splitter>
            {/* LEFT SIDEBAR PANEL */}
            <Panel
              resizable={false}
              style={{ textAlign: "center" }}
              size={310}
            >
              <Image
                style={{
                  padding: 10,
                  border: "solid 1px #212121",
                  borderRadius: 200,
                }}
                width={300}
                height={300}
                src={imageURL || profile_img.src}
                alt="Profile"
              />

              <Title style={{ color: "black", margin: 0 }} level={2}>
                {name}
              </Title>

              <Text style={{ color: "black" }}>({email})</Text>
              
              <br/>
              <Button onClick={showModal}>Update Profile Image</Button>
              <Modal
                title="Update Profile"
                visible={isModalVisible}
                okText={"Update Image"}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form layout="vertical" >
                  <Form.Item
                    label="Paste in a public image URL"
                    name="details"
                    rules={[{ required: true, message: "Please provide details." }]}
                  >
                    <Input.TextArea rows={4} placeholder="Tell us what happened..." name="URLInput" 
                      onChange={(e) => {setUpdateURL(e.target.value); console.log(updateURL);}}/>
                  </Form.Item>
                </Form>
              </Modal>
            </Panel>

            {/* RIGHT PANEL */}
            <Panel resizable={false} style={{ background: "#FFF8F5" }}>
              {/* PROFILE SECTION */}
              <Title style={{ padding: 8 }} level={2}>
                Profile
              </Title>
              <div style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 20 }}>Full Name:</Text>
                <br />
                <Input style={{ width: 200 }} value={name} readOnly />
                <br />

                <Text style={{ fontSize: 20 }}>Email:</Text>
                <br />
                <Input style={{ width: 200 }} value={email} readOnly />
                <br />

                <Text style={{ fontSize: 20 }}>BU ID:</Text>
                <br />
                <Input style={{ width: 200 }} value={BUID} readOnly />
                <br />
              </div>

              <Divider style={{ background: "black" }} />

              {/* RESERVATIONS */}
              <Title style={{ padding: 8 }} level={2}>
                Reservations
              </Title>
              <div style={{ paddingLeft: 10 }}>
                {reservations.length > 0 ? (
                  reservations.map((r) => (
                    <div key={r.id}>
                      <Text style={{ fontSize: 20 }}>&quot;{r.title}&quot;</Text>
                      <br />
                    </div>
                  ))
                ) : (
                  <Text style={{ fontSize: 20 }}>None yet</Text>
                )}
              </div>

              <Divider style={{ background: "black" }} />

              {/* BOOKMARKS */}
              <Title style={{ padding: 8 }} level={2}>
                Bookmarks
              </Title>
              <div style={{ paddingLeft: 10 }}>
                {bookmarks.length > 0 ? (
                  bookmarks.map((b) => (
                    <div key={b.id}>
                      <Text style={{ fontSize: 20 }}>&quot;{b.event_title}&quot;</Text>
                      <br />
                    </div>
                  ))
                ) : (
                  <Text style={{ fontSize: 20 }}>None</Text>
                )}
              </div>

              <Divider style={{ background: "black" }} />

              {/* NOTIFICATIONS */}
              <Title
                ref={notificationRef}
                style={{ padding: 8 }}
                level={2}
              >
                Notifications
              </Title>

              <div style={{ paddingLeft: 10, paddingBottom: 60 }}>
                <Text style={{ fontSize: 20 }}>
                  Email notifications:
                </Text>
                <br />
                
              </div>
            </Panel>
          </Splitter>
        </Content>
      </Layout>
    </Flex>
  );
};

export default DashboardPage;
