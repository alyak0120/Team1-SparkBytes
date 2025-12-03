import {Button, Space, Input} from "antd";
import {UnorderedListOutlined, EnvironmentOutlined} from "@ant-design/icons";


export default function SearchBar({layout, setLayout, search, setSearch} : any) {
    return(
        <Space size="middle" wrap>
            <Button
                type={layout === 'list' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => setLayout('list')}
            >
            List
            </Button>
            <Button
                type={layout === 'map' ? 'primary' : 'default'}
                icon={<EnvironmentOutlined />}
                onClick={() => setLayout('map')}
            >
            Map
            </Button>
            <Input.Search
                placeholder="Search events..."
                allowClear
                value={search}
                enterButton
                onChange={(e) => setSearch(e.target.value)}
                style={{width: 400}}
            />
        </Space>
    );
}