"use client";

import {Modal, Typography, Tag, Space} from "antd";
import {EnvironmentOutlined, ClockCircleOutlined, UserOutlined} from "@ant-design/icons";
import { on } from "events";

export default function EventModal({event, open, onClose}: any) {
    if (!event) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            <img
                src={event.image || event.image_url || "/default-event.jpg"}
                alt={event.title}
                style={{ width: "100%", borderRadius: 12, marginBottom: 16, height: 240, objectFit: "cover" }}
            />
            <Typography.Title level={4} style={{marginBottom:8}}>{event.title}</Typography.Title>
            
            <p style={{marginBottom: 8}}>
                <ClockCircleOutlined/> {event.time}
            </p>

            <p style={{marginBottom: 8}}>
                <EnvironmentOutlined/> {event.location}
            </p>

            <p style={{marginBottom: 8}}>
                <UserOutlined/> {event.servings_left} servings left
            </p>

            <Space wrap style={{marginBottom: 16}}>
                {event.dietary_tags?.map((tag: string) => (
                    <Tag color="green" key={tag}>{tag}</Tag>
                ))}
                {event.allergy_tags?.map((tag: string) => (
                    <Tag color="red" key={tag}>{tag}</Tag>
                ))}
            </Space>
            
            <Typography.Paragraph style={{fontSize: 15}}>
                {event.description}
            </Typography.Paragraph>

        </Modal>
    );
}