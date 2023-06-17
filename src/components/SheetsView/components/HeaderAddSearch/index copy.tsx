import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { LoadingOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { AiFillFileAdd, AiOutlineCloseCircle } from 'react-icons/ai'
import { BiSearchAlt } from 'react-icons/bi'
import { SheetContext } from '../../context/sheets-view.context'
import styles from './index.module.css'

export const HeaderAddSearch = () => {
    const [type, setType] = useState<'search' | 'add'>('add')
    const [description, setDescription] = useState('')
    const [loadAddNew, setLoadAddNew] = useState(false)
    const [msgAlertAdd, setMsgAlertAdd] = useState('')
    const [descSearch, setDescSearch] = useState('')

    const { refreshData, descriptionAlreadyExists, filterData, descriptionSearch } = useContext(SheetContext)
    const { user, page } = useContext(AppContext);

    function descriptionExists(description: string) {
        if (descriptionAlreadyExists(description, -1)) {
            setMsgAlertAdd('Essa descrição já exite.')
        } else {
            setMsgAlertAdd('')
        }
    }

    async function saveNew() {
        if (
            description !== '' &&
            description.length > 2 &&
            !descriptionAlreadyExists(description, -1)
        ) {
            setLoadAddNew(true)
            setMsgAlertAdd('')
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
                    .then(() => {
                        setDescription('')
                    })
                    .catch((err) => {
                        if (err.response.data.message.includes('already')) {
                            setMsgAlertAdd('Essa descrição já exite.')
                            return
                        }
                        setMsgAlertAdd('Erro ao adicionar folha.')
                    })
                refreshData()
            } catch (error) {
                console.log(error)
            } finally {
                setLoadAddNew(false)
            }
        }
    }

    useEffect(() => {
        if (descriptionSearch.length) {
            setType('search')
            setDescSearch(descriptionSearch)
            filterData(descriptionSearch)
        }
    }, [page])

    const Add = () => {
        return (
            <div className={styles.inputButton}>
                <div className={styles.slideIconInput} >
                    <input
                        disabled={loadAddNew}
                        placeholder='Adicionar...'
                        className={styles.inputDescriptionAdd}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                            descriptionExists(e.target.value)
                        }}
                    />
                </div>
                {
                    loadAddNew
                        ? <LoadingOutlined
                            className={styles.iconAdd}
                            spin
                        />
                        : <>
                            <AiFillFileAdd
                                className={styles.iconAdd}
                                onClick={saveNew}
                            />
                        </>
                }
            </div>
        )
    }

    const Search = () => {
        return (
            <div className={styles.inputButton}>
                <div className={styles.slideIconInput}>
                    <input
                        disabled={loadAddNew}
                        placeholder='Pesquisar...'
                        className={styles.inputDescriptionAdd}
                        value={descSearch}
                        onChange={(e) => {
                            setDescSearch(e.target.value)
                            filterData(e.target.value)
                            console.log(descriptionSearch)
                        }}
                    />
                    {descSearch.length
                        ? (<AiOutlineCloseCircle
                            onClick={() => {
                                setDescSearch('')
                                filterData('')
                            }}
                            className={styles.iconClose}
                        />)
                        : <></>}
                </div>
                {loadAddNew
                    ? <LoadingOutlined
                        className={styles.iconAdd}
                        spin
                    />
                    : <BiSearchAlt
                        className={styles.iconAdd}
                        onClick={saveNew}
                    />

                }
            </div>
        )
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <BiSearchAlt className={styles.iconSearch} />,
            children: <Search />,
        },
        {
            key: '2',
            label: <AiFillFileAdd className={styles.iconAddNew} />,
            children: <Add />,
        }
    ];

    return (<>
        <div className={styles.headerAdd}>
            <Tabs
                className={styles.tabs}
                tabBarGutter={0.5}
                // tabPosition='left'
                size='small'
                items={items}
                animated={{ inkBar: true, tabPane: true }}
            >

            </Tabs>
            {/* {type === 'add' ? (
                <div className={styles.inputButton}>
                    <div className={styles.slideIconInput} >
                        <div className={styles.buttonSlide}>
                            <BiSearchAlt
                                className={styles.iconInactive}
                                onClick={saveNew}
                            />
                            <AiOutlineDoubleRight
                                className={styles.icon}
                                onClick={() => setType('search')}
                                style={{ fontSize: 24 }}
                            />
                        </div>
                        <input
                            disabled={loadAddNew}
                            placeholder='Adicionar...'
                            className={styles.inputDescriptionAdd}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                descriptionExists(e.target.value)
                            }}
                        />
                    </div>
                    {
                        loadAddNew
                            ? <LoadingOutlined
                                className={styles.iconAdd}
                                spin
                            />
                            : <>
                                <AiFillFileAdd
                                    className={styles.iconAdd}
                                    onClick={saveNew}
                                />
                            </>
                    }
                </div>
            ) : (
                <div className={styles.inputButton}>
                    <div className={styles.slideIconInput}>
                        <input
                            disabled={loadAddNew}
                            placeholder='Pesquisar...'
                            className={styles.inputDescriptionAdd}
                            value={descSearch}
                            onChange={(e) => {
                                setDescSearch(e.target.value)
                                filterData(e.target.value)
                                console.log(descriptionSearch)
                            }}
                        />
                        {descSearch.length
                            ? (<AiOutlineCloseCircle
                                onClick={() => {
                                    setDescSearch('')
                                    filterData('')
                                }}
                                className={styles.iconClose}
                            />)
                            : <></>}
                    </div>
                    {loadAddNew
                        ? <LoadingOutlined
                            className={styles.iconAdd}
                            spin
                        />
                        : <div>
                            <BiSearchAlt
                                className={styles.iconAdd}
                                onClick={saveNew}
                            />
                            <AiOutlineDoubleLeft
                                className={styles.icon}
                                onClick={() => setType('add')}
                                style={{ fontSize: 24 }}
                            />
                            <AiFillFileAdd
                                className={styles.iconInactive}
                                onClick={saveNew}
                            />
                        </div>
                    }
                </div>

            )} */}
            <p className={styles.alertAdd}>{type === 'add' ? msgAlertAdd : ''}</p>
        </div>
    </>)
}