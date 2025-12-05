"use client";
import {Form, Input, Button, Select, Card, Typography, DatePicker, TimePicker, message, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useState} from 'react';
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';


export default function NewEvent() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            // Convert Dayjs objects to an ISO datetime string
            const date = values.date && values.date.format('YYYY-MM-DD');
            const time = values.time && values.time.format('HH:mm');
            const starts_at = date && time ? dayjs(`${date} ${time}`).toISOString() : null;

            const payload: any = {
                title: values.title,
                category: values.category,
                description: values.description,
                area: values.area,
                address: values.address,
                building: values.building || null,
                room: values.room || null,
                starts_at,
            };

            // POST to the server route which uses a server-side Supabase admin client.
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                console.error('Server insert error', result);
                message.error('Failed to post event. Please try again.');
            } else {
                message.success('Event posted successfully');
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            message.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    const addressRegex = /^[0-9A-Za-z\s.,'-]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}(-\d{4})?$/;

    return (
        <div>
            <Card>
                <Typography.Title level={3}>
                    Post a New Event
                </Typography.Title>
                <Form layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        label="Event Title"
                        name="title"
                        rules={[{required: true, message: 'Enter a title'}]}
                    >
                        <Input placeholder="Enter a title"/>
                    </Form.Item>  

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{required: true, message: "Select a category"}]}              
                    >
                        <Select
                            placeholder="Select a Category"
                            options={[
                                {label: 'Pizza', value: 'Pizza'},
                                {label: 'Breakfast', value: 'Breakfast'},
                                {label: 'Dessert', value: 'Dessert'},
                                {label: 'Other', value: 'Other'},
                                {label: 'Mexican', value: 'Mexican'},
                                {label: 'Asian', value: 'Asian'},
                            ]}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Number of Servings"
                        name="servings"
                        rules={[{required: true, message: 'Enter number of servings'}]}
                    >
                        <Input type="number" placeholder="e.g. 10"/>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{required: true, message: 'Add a short description'}]}
                    >
                        <Input.TextArea rows={3} placeholder="Describe your event..."/>
                    </Form.Item>
                    
                    <Form.Item
                        label="Event Image (optional)"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            } 
                            return e?.fileList;
                        }}
                    >
                    
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Area of campus"
                        name="area"
                        rules={[{required:true, message: "Select an area of campus"}]}
                    >
                        <Select
                            placeholder="Select an area"
                            options={[
                                {label: "East Campus", value: "East Campus"},
                                {label: "West Campus", value: "West Campus"},
                                {label: "South Campus", value: "South Campus"},
                                {label: "Central Campus", value: "Central Campus"},
                                {label: "Fenway Campus", value: "Fenway Campus"},
                                {label: "Medical Campus", value: "Medical Campus"}
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Street Address, City, State, Zip Code"
                        name="address"
                        rules={[{required: true, message: "Enter a full address"},
                            {pattern: addressRegex, message: "Enter a valid format: 700 Commonwealth Ave, Boston, MA 02215"}
                        ]}
                    >
                        <Input placeholder="e.g. 700 Commonwealth Ave, Boston, MA 02215"/>
                    </Form.Item>

                    <Form.Item
                        label="Building Name (optional)"
                        name="building">
                        <Input placeholder="e.g. Warren Towers"/>
                    </Form.Item>

                    <Form.Item label="Room Number (optional)" name="room">
                        <Input placeholder="e.g. 511, B12, 201"/>
                    </Form.Item>

                    <div>
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{required: true, message: "Select a date"}]}
                    >
                        <DatePicker
                            format="MM/DD/YYYY"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[{required: true, message: "Select a time"}]}
                    >
                        <TimePicker format="h:mm A" use12Hours minuteStep={5} />
                    </Form.Item>
                    </div>

                    <div style={{display: "flex", gap: "16px"}}>
                        <Button
                            onClick={() => router.push('/')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            loading={loading}
                            htmlType="submit"
                            style={{backgroundColor: "#CC0000", borderColor: "#CC0000"}}
                        >
                            Post Event
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}