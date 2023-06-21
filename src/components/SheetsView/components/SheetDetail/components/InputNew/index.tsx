import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { LoadingOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './input-new.module.css';

interface InputNewProps {
    route: '/accounts-receivable' | '/accounts-payable',
    refreshData: () => void,
    validation: (value: string, type: 'rec' | 'pay') => boolean,
    sheetId: number,
}

export const InputNew: React.FC<InputNewProps> = ({ route, refreshData, validation, sheetId }) => {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [already, setAlready] = useState(false);
    const [adding, setAdding] = useState(false)
    const [viewInput, setViewInput] = useState(false)

    const rowItem = useRef<HTMLDivElement>(null);
    const inputDescription = useRef<HTMLInputElement>(null);
    const inputValue = useRef<HTMLInputElement>(null);
    const button = useRef<HTMLButtonElement>(null);

    const { user, openNotification } = useContext(AppContext);

    function descriptionExists(description: string) {
        if (validation(description, route == '/accounts-receivable' ? 'rec' : 'pay')) {
            setAlready(true)
            return true
        } else {
            setAlready(false)
            return false
        }
    }

    const saveItem = async () => {
        try {
            setAdding(true)
            if (description !== '' && !descriptionExists(description) && value !== '')
                await api.request({
                    method: 'POST',
                    url: `${route}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.jwtToken}`
                    },
                    data: {
                        description,
                        value: Number(value),
                        sheetId
                    }
                })
                    .then(() => {
                        setDescription('')
                        setValue('')
                        setViewInput(false);
                        setAlready(false)
                        refreshData()
                    })
                    .catch((err) => {
                        if (err.response.status === 409) {
                            setAlready(true)
                        }
                        openNotification(
                            `Erro ao adicionar ${route === '/accounts-payable' ? 'Conta a pagar' : 'Conta a receber'}.`,
                            `Não foi possível adicionar o item: ${description}`,
                            'error'
                        )
                    }).finally(() => {
                        setAdding(false)
                    })

        } catch (error) {
            openNotification(
                `Erro ao adicionar ${route === '/accounts-payable' ? 'Conta a pagar' : 'Conta a receber'}.`,
                `Não foi possível adicionar o item: ${description}`,
                'error'
            )
            console.log(error)
        } finally {
            setAdding(false);
        }
    };

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');

        const real = numericValue.slice(0, -2);
        const centavos = numericValue.slice(-2);

        setValue(real + "." + centavos)
    };

    const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as Element;

        if (
            relatedTarget !== inputDescription.current &&
            relatedTarget !== inputValue.current &&
            relatedTarget !== button.current
        ) {
            setViewInput(false)
            setAlready(false)
        }
    };

    return (
        <>
            <div className={styles.areaButtonNew}>
                <div
                    style={{ display: viewInput ? 'none' : 'flex' }}
                    onClick={() => {
                        setViewInput(true)
                    }}
                    className={styles.newItem}
                >
                    <PlusCircleOutlined />
                    Novo
                </div>
                <div
                    style={{ display: viewInput ? 'flex' : 'none' }}
                    onClick={() => {
                        setDescription('')
                        setValue('')
                        setAlready(false)
                        setViewInput(false)
                    }}
                    className={styles.closeNewItem}
                >
                    <AiOutlineCloseCircle />
                    Cancelar
                </div>

            </div>
            <div className={styles.accountList} style={{ display: viewInput ? 'flex' : 'none' }}>
                <div
                    className={styles.accountDescription}
                    ref={rowItem}
                    onBlur={handleFocusOut}
                >
                    <Tooltip title="Essa descrição já existe." open={already} color={'gold'} >
                        <input
                            ref={inputDescription}
                            autoFocus
                            placeholder='Descrição'
                            className={styles.inputDescription}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                descriptionExists(e.target.value)
                            }}
                        />
                    </Tooltip>
                    <input
                        ref={inputValue}
                        placeholder='Valor'
                        className={styles.inputValue}
                        value={value}
                        onChange={(e) => {
                            formatCurrency(e.target.value)
                        }}
                        onKeyUp={(e) => { e.key === "Enter" && saveItem() }}
                    />
                </div>
                {adding
                    ? <LoadingOutlined ref={button} style={{ fontSize: 24 }} spin />
                    : <SaveOutlined
                        ref={button}
                        className={styles.buttonSave}
                        onClick={() => saveItem()}
                    />
                }
            </div>
        </>
    )
}