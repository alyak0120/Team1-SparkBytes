"use client";
import {Row, Col, Empty} from "antd";
import EventCard from "@/components/event-card";


export default function EventList({filteredEvents, favorites, favs, reserves, reserve, defaults}:any){
    return (
        <div style={{marginTop: 12}}>
            <Row gutter={[24,24]} justify="start">
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