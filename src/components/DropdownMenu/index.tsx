import { Dropdown, Menu } from "antd";
import { ReactNode } from "react";

interface ItemType {
    label: string | ReactNode,
    key: string | number,
    icon?: ReactNode,
    action?: () => void
}

type PlacementType = "bottomRight" | "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "top" | "bottom" | undefined

type Props = {
    children: React.ReactNode;
    items: ItemType[];
    placement?: PlacementType
};

export const DropdownMenu: React.FC<Props> = ({ children, items = [], placement = 'bottomRight' }) => {

    const menu = (
        <Menu
            style={{
                backgroundColor: '#2e3034',
                borderRadius: 'var(--border-radius)',
                transition: 'background 200ms, border 200ms',
                background: 'rgba(78, 80, 88, 0.91)',
                border: '1px solid rgba(var(--card-border-rgb), 0.15)',
                color: 'white',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
            }}
        >
            {items.map(item =>
                <Menu.Item
                    style={{ color: 'white' }}
                    icon={item.icon}
                    key={item.key}
                    onClick={item.action}
                >
                    {item.label}
                </Menu.Item>
            )}
        </Menu>
    );


    return (
        <Dropdown
            dropdownRender={() => menu}
            placement={placement}            
        >
            {children}
        </Dropdown>
    )
}