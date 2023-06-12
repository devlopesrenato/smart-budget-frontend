import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { LoadingOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { BiRename } from 'react-icons/bi'
import { BsBuildingAdd } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'
import { LuFileSpreadsheet } from 'react-icons/lu'
import { SheetContext } from '../context/sheets-view.context'
import styles from './sheet-list.module.css'

interface SheetListItemProps {
    sheet: Sheet
}

interface SheetListProps {
    sheets: Sheet[]
}

const SheetListItem: React.FC<SheetListItemProps> = ({ sheet }) => {
    const [editing, setEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(sheet.description);
    const [oldDescription, setOldDescription] = useState(sheet.description);

    const { user } = useContext(AppContext);
    const { refreshData } = useContext(SheetContext)

    const renameItem = () => {
        setOldDescription(newDescription)
        setEditing(true);
    };

    const deleteItem = async () => {
        try {
            await api.request({
                method: 'DELETE',
                url: `/sheets/${sheet.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                }
            })
            refreshData()

        } catch (error) {
            console.log(error)
        }
    };

    const saveItem = async () => {
        try {
            if (oldDescription !== newDescription)
                await api.request({
                    method: 'PATCH',
                    url: `/sheets/${sheet.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.jwtToken}`
                    },
                    data: { description: newDescription }
                })

        } catch (error) {
            setNewDescription(oldDescription)
            console.log(error)
        } finally {
            setEditing(false);
        }
    };

    const items = [
        {
            label: 'Renomear',
            key: 'rename',
            icon: <BiRename color='#00C5FF' />,
            action: () => renameItem()
        },
        {
            label: 'Excluir',
            key: 'delete',
            icon: <FaTrashAlt color='#D94848' />,
            action: () => deleteItem()
        },
    ]

    const menu = (
        <Menu
            rootClassName={styles.menuMore}
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
        <div className={styles.sheetList} key={sheet.id}>
            {editing ? (
                <div className={styles.sheetDescription}>
                    <BiRename size={25} color='#00C5FF' />
                    <input
                        onBlur={saveItem}
                        className={styles.inputDescription}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                </div>
            ) : (
                <Link
                    style={{ display: 'flex' }}
                    href={`/sheet/${sheet.id}`}
                    className={styles.sheetDescription}
                >
                    <LuFileSpreadsheet />
                    <p className={styles.description}>{newDescription}</p>
                </Link>
            )}
            <Dropdown dropdownRender={() => menu} placement="bottomRight">
                <MoreOutlined className={styles.iconMore} />
            </Dropdown>
        </div>
    );
};

export const SheetList = () => {
    const { data, loading, refreshData } = useContext(SheetContext)
    const { user } = useContext(AppContext);
    const [description, setDescription] = useState('')

    async function saveNew() {
        try {
            await api.request({
                method: 'POST',
                url: `/sheets`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                },
                data: { description: description }
            })
            setDescription('')
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={styles.center}>
            {
                loading
                    ? <LoadingOutlined style={{ fontSize: 24 }} spin />
                    : (
                        data.length
                            ? (<>
                                <div className={styles.options}>
                                    <input
                                        className={styles.inputDescriptionAdd}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <BsBuildingAdd
                                        className={styles.iconOptions}
                                        style={{ fontSize: 24 }}
                                        onClick={saveNew}
                                    />

                                </div>
                                {data.map((sheet) => (
                                    <SheetListItem key={sheet.id} sheet={sheet} />
                                ))}
                            </>) : <p>Não há dados</p>
                    )
            }
        </div>
    );
};