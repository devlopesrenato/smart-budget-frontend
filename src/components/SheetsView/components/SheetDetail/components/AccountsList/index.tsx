import { DropdownMenu } from '@/components/DropdownMenu'
import { AppContext } from '@/context/app.context'
import { api } from '@/services/api'
import { Utils } from '@/utils/utils'
import { LoadingOutlined, MoreOutlined, SaveOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useContext, useRef, useState } from 'react'
import { BiRename } from 'react-icons/bi'
import { FaTrashAlt } from 'react-icons/fa'
import { IoDuplicateSharp } from 'react-icons/io5'
import { SheetContext } from '../../../../context/sheets-view.context'
import styles from './accounts-list.module.css'

interface AccountListItemProps {
    account: AccountType,
    route: '/accounts-receivable' | '/accounts-payable',
    refreshData: () => void
}

export const AccountListItem: React.FC<AccountListItemProps> = ({ account, route, refreshData }) => {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [newValues, setNewValues] = useState({ description: account.description, value: String(account.value) });
    const [oldValues, setOldValues] = useState({ description: account.description, value: String(account.value) });
    const [already, setAlready] = useState(false);
    const [duplicating, setDuplicating] = useState(false);

    const rowItem = useRef<HTMLDivElement>(null);
    const inputDescription = useRef<HTMLInputElement>(null);
    const inputValue = useRef<HTMLInputElement>(null);
    const button = useRef<HTMLButtonElement>(null);

    const { user, openNotification } = useContext(AppContext);
    const { descriptionAlreadyExists } = useContext(SheetContext)

    const utils = new Utils();

    const renameItem = () => {
        setOldValues(newValues)
        setEditing(true);
        setAlready(false);
    };

    const deleteItem = async () => {
        setDeleting(true)
        try {
            await api.request({
                method: 'DELETE',
                url: `${route}/${account.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                }
            })
            refreshData()

        } catch (error) {
            openNotification(
                `Erro ao excluir ${account.description}`,
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
            if (oldValues !== newValues)
                await api.request({
                    method: 'PATCH',
                    url: `${route}/${account.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.jwtToken}`
                    },
                    data: {
                        description: newValues.description,
                        value: Number(newValues.value)
                    }
                })
                    .then(() => {
                        refreshData()
                    })
                    .catch(() => {
                        openNotification(
                            `Erro ao atualizar ${route === '/accounts-payable' ? 'Conta a pagar' : 'Conta a receber'}.`,
                            `Não foi possível atualizar o item: ${oldValues.description}`,
                            'error'
                        )
                        setNewValues(oldValues)
                    })

        } catch (error) {
            openNotification(
                `Erro ao atualizar ${route === '/accounts-payable' ? 'Conta a pagar' : 'Conta a receber'}.`,
                `Não foi possível atualizar o item: ${oldValues.description}`,
                'error'
            )
            setNewValues(oldValues)
            console.log(error)
        } finally {
            setEditing(false);
        }
    };

    const duplicateItem = async () => {
        setDuplicating(true)
        try {
            await api.request({
                method: 'POST',
                url: `${route}/${account.id}`,
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
                `Erro ao duplicar ${account.description}.`,
                'error'
            )
            console.log(error)
        } finally {
            setDuplicating(false)
        }
    }

    const items = [
        {
            label: 'Editar',
            key: 'edit',
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
        if (descriptionAlreadyExists(description, account.id)) {
            setAlready(true)
        } else {
            setAlready(false)
        }
    }

    const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as Element;

        if (
            relatedTarget !== inputDescription.current &&
            relatedTarget !== inputValue.current &&
            relatedTarget !== button.current
        ) {
            setEditing(false)
        }
    };

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');

        const real = numericValue.slice(0, -2);
        const centavos = numericValue.slice(-2);

        setNewValues((prev) => ({
            ...prev,
            value: (real + "." + centavos)
        }))
    };

    return (
        <div className={styles.accountList} key={account.id}>
            {editing ? (
                <>
                    <div
                        ref={rowItem}
                        onBlur={handleFocusOut}
                        className={styles.accountDescription}
                    >
                        <BiRename size={25} color='#00C5FF' />
                        <Tooltip title="Essa descrição já existe." open={already} color={'gold'} >
                            <input
                                ref={inputDescription}
                                autoFocus
                                className={styles.inputDescription}
                                value={newValues.description}
                                onKeyUp={(e) => { e.key === "Enter" && saveItem() }}
                                onChange={(e) => {
                                    setNewValues((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }))
                                    descriptionExists(e.target.value)
                                }}
                            />
                        </Tooltip>
                        <input
                            ref={inputValue}
                            className={styles.inputValue}
                            value={newValues.value}
                            onKeyUp={(e) => { e.key === "Enter" && saveItem() }}
                            onChange={(e) => {
                                formatCurrency(e.target.value)
                            }}
                        />
                    </div>
                </>
            ) : (
                <div
                    style={{ display: 'flex', width: '90%' }}
                    className={styles.accountDescription}
                >
                    <p className={deleting ? styles.deleting : styles.description}>{newValues.description}</p>
                    <p className={deleting ? styles.deleting : styles.description}>{utils.valueToCurrency(newValues.value)}</p>
                </div>
            )}
            {
                deleting
                    ? (<FaTrashAlt className={styles.deleting} />)
                    : (
                        duplicating
                            ? <LoadingOutlined spin />
                            : editing
                                ? <SaveOutlined ref={button} className={styles.buttonSave} onClick={() => saveItem()} />
                                : (
                                    <DropdownMenu items={items}>
                                        <MoreOutlined className={styles.iconMore} />
                                    </DropdownMenu>
                                )
                    )
            }
        </div>
    );
};