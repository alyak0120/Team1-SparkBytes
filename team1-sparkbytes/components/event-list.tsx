"use client";
import {Row, Col, Empty} from "antd";
import EventCard from "@/components/event-card";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export default function EventList({filteredEvents, favorites, favs, reserves, reserve, defaults}:any) {
    async function getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user:', error.message);
            return null;
        }

        if (user) {
            console.log('Currently logged in user:', user);
            return user;
        } else {
            console.log('No user is currently logged in.');
            return null;
        }
    }
    return (
        <div style={{marginTop: 12}}>
            <Row gutter={[24,24]} justify="start" align="stretch">
                {filteredEvents.length === 0 ? (
                    <Empty description="No events found" />
                ) : (
                    filteredEvents.map((event:any) => (
                        <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
                            <EventCard
                                event={event}
                                favorites={favorites}
                                favs={favs}
                                reserves={reserves}
                                reserve={reserve}
                                defaults={defaults}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
}