import { DropdownMenu } from '@/components/DropdownMenu'
import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { LoadingOutlined, MoreOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { BiRename } from 'react-icons/bi'
import { FaTrashAlt } from 'react-icons/fa'
import { IoDuplicateSharp } from 'react-icons/io5'
import { LuFileSpreadsheet } from 'react-icons/lu'
import { SheetContext } from '../context/sheets-view.context'
import { HeaderAddSearch } from './HeaderAddSearch'
import Details from './SheetDetail/details'
import styles from './sheet-list.module.css'

interface SheetListItemProps {
    sheet: Sheet
}

const SheetListItem: React.FC<SheetListItemProps> = ({ sheet }) => {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [newDescription, setNewDescription] = useState(sheet.description);
    const [oldDescription, setOldDescription] = useState(sheet.description);
    const [already, setAlready] = useState(false);
    const [duplicating, setDuplicating] = useState(false);

    const { user, openNotification, setIdSheetDetail, setPage } = useContext(AppContext);
    const { refreshData, descriptionAlreadyExists, data } = useContext(SheetContext)

    const router = useRouter();

    const renameItem = () => {
        setOldDescription(newDescription)
        setEditing(true);
        setAlready(false);
    };

    const deleteItem = async () => {
        setDeleting(true)
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
            openNotification(
                `Erro ao excluir ${sheet.description}`,
                'Não foi possível excluir este item! Tente novamente.',
                'error'
            )
            console.log(error)
        } finally {
            setDeleting(false)
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
                }).catch(() => {
                    setNewDescription(oldDescription)
                })

        } catch (error) {
            setNewDescription(oldDescription)
            console.log(error)
        } finally {
            setEditing(false);
        }
    };

    const duplicateItem = async () => {
        setDuplicating(true)
        try {
            // const newItemDescription = generateDuplicateDescription(sheet.description)
            await api.request({
                method: 'POST',
                url: `/sheets/${sheet.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                },
            }).then(() => {
                refreshData()
            })
        } catch (error) {
            openNotification(
                'Erro ao duplicar item!',
                `Erro ao duplicar ${sheet.description}.`,
                'error'
            )
            console.log(error)
        } finally {
            setDuplicating(false)
        }
    }

    const items = [
        {
            label: 'Renomear',
            key: 'rename',
            icon: <BiRename color='#00C5FF' />,
            action: () => renameItem()
        },
        {
            label: 'Duplicar',
            key: 'duplicate',
            icon: <IoDuplicateSharp color='#ffb02e' />,
            action: () => duplicateItem()
        },
        {
            label: 'Excluir',
            key: 'delete',
            icon: <FaTrashAlt color='#D94848' />,
            action: () => deleteItem()
        },
    ]

    function descriptionExists(description: string) {
        if (descriptionAlreadyExists(description, sheet.id)) {
            setAlready(true)
        } else {
            setAlready(false)
        }
    }

    const generateDuplicateDescription = (originalDescription: string) => {
        let duplicateCount = 0
        let newItemDescription = originalDescription

        while (isDescriptionDuplicate(newItemDescription)) {
            duplicateCount++
            newItemDescription = `${originalDescription} (cópia ${duplicateCount})`
        }

        return newItemDescription
    }

    const isDescriptionDuplicate = (description: string) => {
        return data.some(({ description: existingDescription }) => {
            return existingDescription === description
        })
    }

    return (
        <div className={styles.sheetList} key={sheet.id}>
            {editing ? (
                <div className={styles.sheetDescription}>
                    <BiRename size={25} color='#00C5FF' />
                    <Tooltip title="Essa descrição já existe." open={already} color={'gold'} >
                        <input
                            autoFocus
                            onBlur={saveItem}
                            className={styles.inputDescription}
                            value={newDescription}
                            onKeyUp={(e) => { e.key === "Enter" && saveItem() }}
                            onChange={(e) => {
                                setNewDescription(e.target.value)
                                descriptionExists(e.target.value)
                            }}
                        />
                    </Tooltip>
                </div>
            ) : (
                <div
                    style={{ display: 'flex', width: '90%' }}
                    onClick={() => {
                        if (!deleting) {
                            setIdSheetDetail(sheet.id)
                            setPage('detail')
                            router.replace(`/sheet?id=${sheet.id}`)
                        }
                    }}
                    aria-disabled={deleting}

                    className={styles.sheetDescription}
                >
                    <LuFileSpreadsheet className={deleting ? styles.deleting : ''} />
                    <p className={deleting ? styles.deleting : styles.description}>{newDescription}</p>
                </div>
            )}
            {
                deleting
                    ? (<FaTrashAlt color='#D94848' className={styles.deleting} />)
                    : (
                        duplicating
                            ? <LoadingOutlined spin />
                            : (
                                <DropdownMenu items={items}                    >
                                    <MoreOutlined className={styles.iconMore} />
                                </DropdownMenu>
                            )
                    )
            }
        </div>
    );
};

export const SheetList = () => {
    const { data, loading } = useContext(SheetContext)
    const { setPage, setIdSheetDetail, idSheetDetail } = useContext(AppContext);

    const [loadPage, setLoadPage] = useState<boolean>(true)

    const router = useRouter();

    function getSheetIDByRoute() {
        try {
            const url = new URL(window.location.href);
            const id = url.searchParams.get('id');
            if (id?.length) {
                setIdSheetDetail(Number(id))
                setLoadPage(false)
            } else {
                setLoadPage(false)
            }
        } catch (error) {
            setLoadPage(false)
        }
    }

    useEffect(() => {
        getSheetIDByRoute()
    }, [])

    return (
        <>
            {(loadPage)
                ? <LoadingOutlined style={{ fontSize: 24 }} spin />
                : (
                    idSheetDetail
                        ? (
                            <Details params={{
                                id: idSheetDetail
                            }} />
                        )
                        : (
                            <>
                                {loading
                                    ? <LoadingOutlined style={{ marginTop: '3rem', fontSize: 24 }} spin />
                                    : (
                                        <div className={styles.center}>
                                            {
                                                data.length
                                                    ? (<>
                                                        {data.map((sheet) => (
                                                            <SheetListItem key={sheet.id} sheet={sheet} />
                                                        ))}
                                                    </>) : <p>Não há dados...</p>
                                            }
                                        </div>
                                    )}
                                <HeaderAddSearch />
                            </>
                        )
                )
            }
        </>
    );
};