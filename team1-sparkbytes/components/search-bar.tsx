import {Button, Space, Input} from "antd";
import {UnorderedListOutlined, EnvironmentOutlined, SearchOutlined} from "@ant-design/icons";


export default function SearchBar({layout, setLayout, search, setSearch} : any) {
    const handleSearch = () => {
        console.log("Searching for:", search);
    }
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
            <Space.Compact>
            <Input
                placeholder="Search events..."
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={handleSearch}
                style={{width: 400}}
            />
            <Button type="primary" onClick={handleSearch}>
                <SearchOutlined />
            </Button>
            </Space.Compact>
        </Space>
    );
}