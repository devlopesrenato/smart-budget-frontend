import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { LoadingOutlined, MoreOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { BsBuildingAdd } from 'react-icons/bs'
import { LuFileSpreadsheet } from 'react-icons/lu'
import styles from './sheets-view.module.css'


interface Sheet {
    "id": number,
    "description": string,
    "createdAt": string,
    "creatorUserId": number,
    "updatedAt": string
}

export const SheetsView = () => {
    const [load, setLoad] = useState(false)
    const [list, setList] = useState<Sheet[]>([])

    const { user, openNotification } = useContext(AppContext);

    async function getData() {
        setLoad(true)
        await api.get('sheets', {
            headers: {
                Authorization: `Bearer ${user?.jwtToken}`
            }
        })
            .then(({ data }) => {
                if (data && typeof data === 'object') {
                    setList(data)
                }
            })
            .catch(err => {
                openNotification(
                    'Erro ao obter dados!',
                    'Não foi possível obter os dados do servidor. Atualize a página e tente novamente.',
                    'error'
                )
            })
            .finally(() => {
                setLoad(false)
            })
    }



    useEffect(() => {
        getData()
    }, [])

    const SheetList = (sheet: Sheet) => {
        return (
            <div
                className={styles.sheetList}
                key={sheet.id}
            >
                <Link
                    href={`/sheet/${sheet.id}`}
                    className={styles.sheetDescription}
                >
                    <LuFileSpreadsheet />
                    {sheet.description}
                </Link>
                <MoreOutlined
                    className={styles.iconMore}
                />
            </div>
        )
    }

    return (
        <div className={styles.center}>
            {
                load
                    ? <LoadingOutlined style={{ fontSize: 24 }} spin />
                    : (
                        list.length
                            ? (<>
                                <div className={styles.options}>
                                    <BsBuildingAdd
                                        className={styles.iconOptions}
                                        style={{ fontSize: 24 }}
                                    />
                                    
                                </div>
                                {list.map(item => SheetList(item))}
                            </>) : <p>Não há dados</p>
                    )
            }
        </div >
    )
}