import {Card, Typography, Space, Tooltip, Button} from "antd";
import {CheckOutlined, EnvironmentOutlined, ClockCircleOutlined, UserOutlined, HeartOutlined, HeartFilled, FlagOutlined} from "@ant-design/icons";

export default function EventCard({event, favorites, favs, reserves, reserve, defaults,}: any) {
    return (
        <Card
            hoverable
            cover={
                <img
                    alt={event.title}
                    src={event.image || "/default-event.jpg"}
                    style={{width: "100%",height: 180, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12,}}
                /> 
            }
            style={{borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", width: 330, height: 400, display: "flex", flexDirection: "column", justifyContent: "space-between",}}
        >
        <Typography.Title level={5} style={{marginBottom: 4}}>
            {event.title}
        </Typography.Title>
        <p>{event.description}</p>
        <Space direction="vertical" size={2}>
            <Typography.Text><EnvironmentOutlined /> {event.location}</Typography.Text>
            <Typography.Text><ClockCircleOutlined /> {event.time}</Typography.Text>
            <Typography.Text><UserOutlined /> {event.servingsLeft}</Typography.Text>
        </Space>

        <Space size="middle" style={{width: "100%", display: "flex", justifyContent: "space-between", borderTop:"1 px solid #f0f0f0", paddingTop: 8,}}>
            <Tooltip title="Favorite">
                <Button
                    type="text"
                    icon={favorites.includes(event.id) ? (<HeartFilled style={{color: "#CC0000"}} /> ) : (<HeartOutlined />)}
                    onClick={() => favs(event.id)}
                />
            </Tooltip>

            <Button
                key="reserve"
                type={reserves.includes(event.id) ? "default" : "primary"}
                style={{transition: "all 0.3s ease", backgroundColor: reserves.includes(event.id) ? "#52c41a" : undefined,
                color: reserves.includes(event.id) ? "#fff" : undefined, minWidth: 100,}}
                icon={reserves.includes(event.id) ? <CheckOutlined /> : null}
                onClick={() => reserve(event.id)}
            >
                {reserves.includes(event.id) ? "Reserved" : "Reserve"}
            </Button>

            <Button danger icon={<FlagOutlined />} >
                Report
            </Button>
        </Space>
        </Card>
    );
}