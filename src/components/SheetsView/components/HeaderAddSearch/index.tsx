import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { LoadingOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { AiFillFileAdd, AiOutlineCloseCircle, AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai'
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

    return (<>
        <div className={styles.headerAdd}>
            <div className={styles.inputButton}>
                <div className={styles.slideIconInput} >
                    <div className={styles.buttonSlide}
                        style={{ display: type === 'add' ? 'flex' : 'none' }}
                        onClick={() => setType('search')}
                    >
                        <BiSearchAlt
                            className={styles.iconInactive}
                        />
                        <AiOutlineDoubleRight
                            className={styles.icon}
                        />
                    </div>
                    <input
                        disabled={loadAddNew}
                        placeholder={type === 'add' ? 'Adicionar...' : 'Pesquisar...'}
                        className={styles.inputDescriptionAdd}
                        value={type === 'add' ? description : descSearch}
                        onChange={(e) => {
                            if (type === 'add') {
                                setDescription(e.target.value)
                                descriptionExists(e.target.value)
                            } else {
                                setDescSearch(e.target.value)
                                filterData(e.target.value)
                            }
                        }}
                    />
                    {descSearch.length && type === 'search'
                        ? (<AiOutlineCloseCircle
                            onClick={() => {
                                setDescSearch('')
                                filterData('')
                            }}
                            className={styles.iconClose}
                        />)
                        : <></>
                    }
                </div>
                {
                    loadAddNew
                        ? <LoadingOutlined
                            className={styles.iconAdd}
                            spin
                        />
                        : type === 'add'
                            ? (
                                <div onClick={saveNew}>                                    
                                    <AiFillFileAdd
                                        className={styles.iconAdd}
                                    />
                                </div>
                            ) : (
                                <div onClick={() => setType('add')}>
                                    <BiSearchAlt
                                        className={styles.iconAdd}
                                    />
                                    <AiOutlineDoubleLeft
                                        className={styles.icon}
                                    />
                                    <AiFillFileAdd
                                        className={styles.iconInactive}
                                    />
                                </div>
                            )
                }
            </div>
            <p className={styles.alertAdd}>{type === 'add' ? msgAlertAdd : ''}</p>
        </div>
    </>)
}